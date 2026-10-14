import { lazy, Suspense, useEffect, useState } from "react";

const CosmicOrb = lazy(() => import("./CosmicOrb"));

function canRenderWebGL() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(max-width: 899px)").matches) return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory <= 4)) return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2", { powerPreference: "low-power" }));
  } catch {
    return false;
  }
}

export default function CosmicHeroArt() {
  const [threeEnabled, setThreeEnabled] = useState(false);
  useEffect(() => {
    if (!canRenderWebGL()) return;
    const id = window.setTimeout(() => setThreeEnabled(true), 800);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="cinema-art" aria-hidden="true">
      <div className="cinema-orb-fallback">
        <div className="cinema-orb-core" />
        <div className="cinema-orb-ring cinema-orb-ring--one" />
        <div className="cinema-orb-ring cinema-orb-ring--two" />
        <div className="cinema-orb-ring cinema-orb-ring--three" />
        <div className="cinema-orb-aura" />
      </div>
      {threeEnabled && (
        <div className="cinema-webgl">
          <Suspense fallback={null}><CosmicOrb /></Suspense>
        </div>
      )}
      <div className="cinema-art-label"><span>CELESTIAL MEMORY</span><span>— 01 / ∞</span></div>
      <span className="cinema-art-cross cinema-art-cross--top">+</span>
      <span className="cinema-art-cross cinema-art-cross--bottom">+</span>
    </div>
  );
}
