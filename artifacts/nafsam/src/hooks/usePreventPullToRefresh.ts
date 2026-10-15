import { useEffect } from "react";

/**
 * iOS Safari fallback for browsers that ignore root overscroll-behavior.
 * Cancel only a *downward pull at the very top*, which would trigger a page
 * refresh. Normal vertical scrolling, links and nested scrollers are untouched.
 */
export default function usePreventPullToRefresh() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(pointer: coarse)").matches
    ) return;

    let startY = 0;
    let startX = 0;
    let tracking = false;

    const onStart = (event: TouchEvent) => {
      tracking = event.touches.length === 1;
      if (!tracking) return;
      startY = event.touches[0].clientY;
      startX = event.touches[0].clientX;
    };

    const hasInnerScrollAbove = (target: EventTarget | null) => {
      let node = target instanceof Element ? target : null;
      while (node && node !== document.body && node !== document.documentElement) {
        const style = getComputedStyle(node);
        if (
          /auto|scroll|overlay/.test(style.overflowY) &&
          node.scrollHeight > node.clientHeight + 1 &&
          node.scrollTop > 0
        ) return true;
        node = node.parentElement;
      }
      return false;
    };

    const onMove = (event: TouchEvent) => {
      if (!tracking || event.touches.length !== 1 || !event.cancelable) return;
      const touch = event.touches[0];
      const deltaY = touch.clientY - startY;
      const deltaX = touch.clientX - startX;

      if (
        deltaY > 0 &&
        deltaY > Math.abs(deltaX) &&
        window.scrollY <= 0 &&
        document.documentElement.scrollTop <= 0 &&
        !hasInnerScrollAbove(event.target)
      ) {
        // Prevent Safari's pull-to-refresh gesture without disabling
        // ordinary swipe-up scrolling farther down the page.
        event.preventDefault();
      }
    };

    const onEnd = () => { tracking = false; };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd, { passive: true });
    document.addEventListener("touchcancel", onEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  }, []);
}
