import { useEffect, type RefObject } from "react";

/** Desktop-only cinematic entrance sequences, GSAP loaded on demand. */
export default function useCinematicScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 899px)").matches) return;
    let disposed = false;
    let cleanup = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([gsapModule, triggerModule]) => {
        if (disposed) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = triggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>(".cinema-scroll-reveal").forEach((element) => {
            gsap.fromTo(element,
              { autoAlpha: 0, y: 26 },
              { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out",
                scrollTrigger: { trigger: element, start: "top 90%", once: true } },
            );
          });
        }, root);
        cleanup = () => ctx.revert();
      })
      .catch(() => {
        // CSS fallback continues to work without animation libraries.
      });
    return () => { disposed = true; cleanup(); };
  }, [ref]);
}
