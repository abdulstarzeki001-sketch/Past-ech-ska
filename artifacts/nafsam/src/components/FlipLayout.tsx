import { useLayoutEffect, useRef, useState } from "react";
import { Flip, gsap } from "@/lib/gsap";

interface FlipItem {
  title: string;
  body: string;
}

type FlipState = ReturnType<typeof Flip.getState>;

/**
 * Milestones that switch between a grid and a single column. The FLIP
 * technique (Flip plugin) records each card's position before the layout
 * changes and animates it into the new position.
 */
export default function FlipLayout({ items }: { items: FlipItem[] }) {
  const [wide, setWide] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<FlipState | null>(null);

  const toggle = () => {
    if (listRef.current) {
      stateRef.current = Flip.getState(listRef.current.querySelectorAll(".flip-item"));
    }
    setWide((w) => !w);
  };

  useLayoutEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    const ctx = gsap.context(() => {
      Flip.from(state, {
        duration: 0.8,
        ease: "power3.inOut",
        absolute: true,
        stagger: 0.05,
        nested: true,
      });
    }, listRef.current ?? undefined);
    stateRef.current = null;
    return () => ctx.revert();
  }, [wide]);

  return (
    <div className="flip-wrap">
      <button className="ghost-button" onClick={toggle}>
        {wide ? "عرض عمودي" : "عرض شبكي"}
      </button>
      <div ref={listRef} className={`flip-list ${wide ? "is-grid" : "is-column"}`}>
        {items.map((item) => (
          <article className="flip-item" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
