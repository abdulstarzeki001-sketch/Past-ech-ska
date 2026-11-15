import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ScrambleTitleProps {
  text: string;
  className?: string;
}

/** Heading that scrambles into its final text when it scrolls into view. */
export default function ScrambleTitle({ text, className }: ScrambleTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = "";
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          duration: 1.4,
          scrambleText: {
            text,
            chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            revealDelay: 0.2,
            speed: 0.6,
          },
        });
      },
    });
    return () => st.kill();
  }, [text]);

  return (
    <h2 ref={ref} className={className} aria-label={text}>
      {text}
    </h2>
  );
}

