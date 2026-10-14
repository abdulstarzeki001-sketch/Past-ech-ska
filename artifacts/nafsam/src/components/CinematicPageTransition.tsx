import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

interface Props {
  location: string;
  routeLabel: string;
  enabled: boolean;
  children: ReactNode;
}

/**
 * Cinematic navigation with GPU-friendly opacity/translation.
 * Page content is captured per location, so the outgoing view cannot change
 * underneath the exit animation. Logout bypasses animation immediately.
 */
export default function CinematicPageTransition({
  location,
  routeLabel,
  enabled,
  children,
}: Props) {
  const reducedMotion = useReducedMotion();
  const [isTouch, setIsTouch] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse), (max-width: 820px)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse), (max-width: 820px)");
    const onChange = () => setIsTouch(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Never keep previously authenticated content mounted after a logout.
  if (!enabled) {
    return <div className="cinema-page-static">{children}</div>;
  }

  const duration = reducedMotion ? 0 : isTouch ? 0.24 : 0.46;
  const entrance = reducedMotion
    ? { opacity: 1 }
    : { opacity: 0, y: isTouch ? 9 : 26, scale: isTouch ? 1 : 0.994 };
  const leave = reducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: isTouch ? -5 : -15, scale: isTouch ? 1 : 1.003 };

  return (
    <div className="cinema-page-viewport">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location}
          className="cinema-page-stage"
          initial={entrance}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={leave}
          transition={{
            duration,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {!reducedMotion && <div className="cinema-page-stage__sheen" aria-hidden="true" />}
          {children}
        </motion.div>
      </AnimatePresence>
      {!reducedMotion && (
        <div className="cinema-route-beam" aria-hidden="true" key={location}>
          <span />
        </div>
      )}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {routeLabel}
      </span>
    </div>
  );
}
