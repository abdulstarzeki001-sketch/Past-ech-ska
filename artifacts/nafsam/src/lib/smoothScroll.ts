import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let instance: Lenis | null = null;

/** The active Lenis instance, or null before startup and after teardown. */
export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Starts Lenis with the full option set, drives it from GSAP's ticker so that
 * ScrollTrigger and smooth scrolling share one frame, and publishes scroll
 * progress and direction as CSS variables and data attributes.
 * Returns a cleanup function.
 */
export function startSmoothScroll(): () => void {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
    syncTouch: false,
    touchInertiaExponent: 1.7,
    autoResize: true,
    autoToggle: true,
    anchors: { offset: -40, duration: 1.2 },
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
    respectReducedMotion: true,
    overscroll: true,
    // The draggable memories strip handles its own pointer movement.
    prevent: (node: HTMLElement) => node.closest(".strip-viewport") !== null,
  });

  instance = lenis;
  const root = document.documentElement;

  const onScroll = (l: Lenis) => {
    root.style.setProperty("--scroll-progress", String(l.progress));
    root.dataset.scrollDir = l.direction === 1 ? "down" : l.direction === -1 ? "up" : "idle";
    ScrollTrigger.update();
  };
  lenis.on("scroll", onScroll);

  // Marks the page while the wheel is in use, for styling hooks.
  let wheelTimer = 0;
  const onVirtualScroll = () => {
    root.dataset.wheel = "active";
    window.clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(() => {
      delete root.dataset.wheel;
    }, 180);
  };
  lenis.on("virtual-scroll", onVirtualScroll);

  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // Fonts and images can change layout after mount; recompute dimensions then.
  const onLoad = () => lenis.resize();
  window.addEventListener("load", onLoad);
  document.fonts?.ready.then(() => lenis.resize());

  return () => {
    window.removeEventListener("load", onLoad);
    window.clearTimeout(wheelTimer);
    gsap.ticker.remove(tick);
    lenis.off("scroll", onScroll);
    lenis.off("virtual-scroll", onVirtualScroll);
    lenis.destroy();
    instance = null;
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}
