import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

interface SplitWordsProps {
  text: string;
  className?: string;
  delay?: number;
}

/**
 * Splits a line into words and reveals them one by one with GSAP.
 * Written in the spirit of React Bits' SplitText, not copied from it.
 */
export default function SplitWords({ text, className, delay = 0 }: SplitWordsProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".split-word"),
        { yPercent: 110, opacity: 0, filter: "blur(8px)" },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.08,
          delay,
        },
      );
    }, el);
    return () => ctx.revert();
  }, [text, delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span className="split-mask" key={`${word}-${i}`} aria-hidden="true">
          <span className="split-word">{word}</span>
        </span>
      ))}
    </span>
  );
}
