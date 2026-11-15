import { useLayoutEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";

interface SplitWordsProps {
  text: string;
  className?: string;
  delay?: number;
}

/** Splits a line into masked words with the SplitText plugin and reveals them. */
export default function SplitWords({ text, className, delay = 0 }: SplitWordsProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: "words",
        mask: "words",
        wordsClass: "split-word",
      });
      gsap.from(split.words, {
        yPercent: 110,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
        delay,
      });
    }, el);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [text, delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}
