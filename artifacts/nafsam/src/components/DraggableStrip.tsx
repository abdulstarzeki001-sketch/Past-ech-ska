import { useLayoutEffect, useRef } from "react";
import { gsap, Draggable } from "@/lib/gsap";

interface StripItem {
  title: string;
  body: string;
}

/** Horizontal strip that can be dragged or thrown; momentum comes from InertiaPlugin. */
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
    });

    return () => drag.forEach((d) => d.kill());
  }, []);

  return (
    <div ref={viewportRef} className="strip-viewport">
      <div ref={trackRef} className="strip-track">
        {items.map((item) => (
          <article className="strip-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

