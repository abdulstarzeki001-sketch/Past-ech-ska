import { useLayoutEffect, useRef } from "react";
import { gsap, starWiggle } from "@/lib/gsap";

/** Generates a closed star path around (cx, cy). */
function starPath(cx: number, cy: number, outer: number, inner: number, points = 5): string {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const x = (cx + radius * Math.cos(angle)).toFixed(2);
    const y = (cy + radius * Math.sin(angle)).toFixed(2);
    d += `${i === 0 ? "M" : "L"}${x},${y} `;
  }
  return `${d}Z`;
}

const STAR = starPath(100, 100, 56, 24);
const HEART = "M100,150 C50,115 36,90 50,70 C64,50 92,58 100,78 C108,58 136,50 150,70 C164,90 150,115 100,150 Z";
const ORBIT = "M20,100 A80,40 0 1 0 180,100 A80,40 0 1 0 20,100 Z";

/**
 * Animated SVG motif for the hero: the orbit line draws itself (DrawSVG),
 * a dot travels along it (MotionPath), the star morphs into a heart and back
 * (MorphSVG), and hovering the star wiggles it with a custom ease.
 */
export default function OrbitMotif() {
  const starRef = useRef<SVGPathElement>(null);
  const heartRef = useRef<SVGPathElement>(null);
  const orbitRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useLayoutEffect(() => {
    const star = starRef.current;
    const heart = heartRef.current;
    const orbit = orbitRef.current;
    const dot = dotRef.current;
    if (!star || !heart || !orbit || !dot) return;

    const ctx = gsap.context(() => {
      gsap.set(star, { svgOrigin: "100 100" });
      gsap.from(orbit, { drawSVG: "0%", duration: 2.2, ease: "power2.inOut" });
      gsap.to(dot, {
        motionPath: { path: orbit, align: orbit, alignOrigin: [0.5, 0.5], autoRotate: false },
        duration: 10,
        repeat: -1,
        ease: "none",
      });
      gsap.to(star, {
        morphSVG: heart,
        duration: 2.4,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.6,
      });
    });

    return () => ctx.revert();
  }, []);

  const wiggle = () => {
    if (!starRef.current) return;
    gsap.fromTo(
      starRef.current,
      { rotation: 0 },
      { rotation: 360, duration: 1.2, ease: starWiggle, overwrite: true },
    );
  };

  return (
    <svg viewBox="0 0 200 200" className="orbit-svg" aria-hidden="true">
      <defs>
        <radialGradient id="planet-core" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#8fb3e0" />
          <stop offset="55%" stopColor="#24427a" />
          <stop offset="100%" stopColor="#060a18" />
        </radialGradient>
        <radialGradient id="planet-halo" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#7d8fd8" stopOpacity="0" />
          <stop offset="85%" stopColor="#b9d3e6" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#b9d3e6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#planet-halo)" />
      <circle cx="100" cy="100" r="46" fill="url(#planet-core)" />
      <path ref={orbitRef} d={ORBIT} className="orbit-path" fill="none" />
      <path ref={heartRef} d={HEART} className="morph-target" />
      <path ref={starRef} d={STAR} className="morph-star" onPointerEnter={wiggle} />
      <circle ref={dotRef} r="4" cx="0" cy="0" className="orbit-dot" />
    </svg>
  );
}

