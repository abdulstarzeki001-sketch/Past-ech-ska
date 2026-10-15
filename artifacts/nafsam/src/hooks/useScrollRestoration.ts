import { useEffect } from "react";

const KEY_PREFIX = "nafsam_scroll_";
const RESTORE_TIMEOUT_MS = 8000;

function readScroll(key: string): number {
  try {
    const value = Number(sessionStorage.getItem(key) || "0");
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

function writeScroll(key: string, value: number) {
  try {
    sessionStorage.setItem(key, String(Math.max(0, Math.round(value))));
  } catch {
    // Storage can be unavailable in private browsing.
  }
}

/**
 * Preserve the scroll offset of each route after a browser tab reload.
 * Never pull the user back to an old offset once they have started scrolling.
 * Media pages grow asynchronously; we restore only when the saved position
 * becomes reachable, and never force a late fallback jump.
 */
export default function useScrollRestoration(location: string) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const key = KEY_PREFIX + location;
    const saved = readScroll(key);
    const start = performance.now();
    let cancelled = false;
    let userInteracted = false;
    let restoreRaf = 0;
    let writeRaf = 0;

    const cancelRestore = () => {
      userInteracted = true;
      cancelAnimationFrame(restoreRaf);
    };

    const tryRestore = () => {
      if (cancelled || userInteracted || saved <= 0) return;

      // Do not override native positioning, or any scrolling the visitor
      // performed before the image-heavy route finished rendering.
      if (window.scrollY > 2 || document.documentElement.scrollTop > 2) {
        cancelRestore();
        return;
      }

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );

      if (maxScroll >= saved) {
        window.scrollTo({ top: saved, left: 0, behavior: "instant" });
        return;
      }
      if (performance.now() - start < RESTORE_TIMEOUT_MS) {
        restoreRaf = requestAnimationFrame(tryRestore);
      }
      // If content remains shorter than the old scroll position, leave it
      // where it is rather than jumping suddenly after eight seconds.
    };

    if (saved > 0 && window.scrollY <= 2) {
      restoreRaf = requestAnimationFrame(tryRestore);
    }

    const onScroll = () => {
      if (!userInteracted && window.scrollY > 2) cancelRestore();
      if (writeRaf) return;
      writeRaf = requestAnimationFrame(() => {
        writeRaf = 0;
        if (!cancelled) writeScroll(key, window.scrollY);
      });
    };

    const persist = () => {
      if (writeRaf) cancelAnimationFrame(writeRaf);
      writeRaf = 0;
      writeScroll(key, window.scrollY);
    };

    window.addEventListener("wheel", cancelRestore, { passive: true });
    window.addEventListener("touchstart", cancelRestore, { passive: true });
    window.addEventListener("keydown", cancelRestore);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", persist);

    return () => {
      cancelled = true;
      cancelAnimationFrame(restoreRaf);
      persist();
      window.removeEventListener("wheel", cancelRestore);
      window.removeEventListener("touchstart", cancelRestore);
      window.removeEventListener("keydown", cancelRestore);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", persist);
    };
  }, [location]);
}
