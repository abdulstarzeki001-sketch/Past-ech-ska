import { useLayoutEffect, useRef } from "react";
import { gsap, Draggable } from "@/lib/gsap";
import { getLenis } from "@/lib/smoothScroll";
import GlareHover from "@/components/reactbits/GlareHover";

interface StripItem {
  title: string;
  body: string;
}

/**
 * Horizontal strip that can be dragged or thrown; momentum comes from InertiaPlugin.
 * Lenis is paused while the pointer is held so the page does not scroll mid-drag.
 */
export default function DraggableStrip({ items }: { items: StripItem[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const overflow = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const drag = Draggable.create(track, {
      type: "x",
      inertia: true,
      bounds: { minX: -overflow, maxX: 0 },
      edgeResistance: 0.8,
      cursor: "grab",
      activeCursor: "grabbing",
      onPress: () => getLenis()?.stop(),
      onRelease: () => getLenis()?.start(),
    });

    return () => {
      getLenis()?.start();
      drag.forEach((d) => d.kill());
    };
  }, []);

  return (
    <div ref={viewportRef} className="strip-viewport">
      <div ref={trackRef} className="strip-track">
        {items.map((item) => (
          <article className="strip-card" key={item.title}>
            <GlareHover
              width="100%"
              height="100%"
              borderRadius="20px"
              background="rgba(255,255,255,0.04)"
              borderColor="rgba(255,255,255,0.09)"
              glareColor="#ffffff"
              glareOpacity={0.25}
            >
              <div className="strip-card-inner">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </GlareHover>
          </article>
        ))}
      </div>
    </div>
  );
}
