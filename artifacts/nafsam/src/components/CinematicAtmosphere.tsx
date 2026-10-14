import { useEffect } from "react";

export default function CinematicAtmosphere() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onPointer = (event: PointerEvent) => {
      cancelAnimationFrame(raf);
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--cinema-pointer-x", (x * 100).toFixed(1) + "%");
        document.documentElement.style.setProperty("--cinema-pointer-y", (y * 100).toFixed(1) + "%");
      });
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.style.removeProperty("--cinema-pointer-x");
      document.documentElement.style.removeProperty("--cinema-pointer-y");
    };
  }, []);

  return (
    <div className="cinema-atmosphere" aria-hidden="true">
      <div className="cinema-atmosphere__grid" />
      <div className="cinema-atmosphere__aurora" />
      <div className="cinema-atmosphere__grain" />
      <div className="cinema-atmosphere__edge" />
    </div>
  );
}
