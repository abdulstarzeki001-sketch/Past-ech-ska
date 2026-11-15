import { useRef, type ButtonHTMLAttributes, type PointerEvent, type ReactNode } from "react";
import "./ShimmerButton.css";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Color of the sweeping highlight. */
  shimmerColor?: string;
  /** Seconds for one full sweep. */
  shimmerDuration?: number;
}

/**
 * Button with a light band that sweeps across its border, and a glow that
 * follows the pointer. Written in the spirit of 21st.dev's shimmer button
 * (their source is React + Tailwind); this version is plain CSS, original code.
 */
export default function ShimmerButton({
  children,
  shimmerColor = "#d8a57c",
  shimmerDuration = 2.6,
  className = "",
  onPointerMove,
  ...rest
}: ShimmerButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMove = (e: PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--shimmer-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--shimmer-y", `${e.clientY - rect.top}px`);
    }
    onPointerMove?.(e);
  };

  return (
    <button
      ref={ref}
      className={`shimmer-button ${className}`.trim()}
      style={{
        ["--shimmer-color" as string]: shimmerColor,
        ["--shimmer-duration" as string]: `${shimmerDuration}s`,
      }}
      onPointerMove={handleMove}
      {...rest}
    >
      <span className="shimmer-button__sweep" aria-hidden="true" />
      <span className="shimmer-button__label">{children}</span>
    </button>
  );
}
