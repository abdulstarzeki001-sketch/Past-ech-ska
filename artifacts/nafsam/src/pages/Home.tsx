import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/smoothScroll";
import SplitWords from "@/components/SplitWords";
import SpotlightCard from "@/components/SpotlightCard";
import { logout } from "@/lib/auth";

interface HomeProps {
  openAt: number;
  onLogout: () => void;
}

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const s = Math.floor(diff / 1000);
  return {
    done: diff <= 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const CHAPTERS = [
  { title: "البداية", body: "كل حكاية تبدأ بلحظة صغيرة تبقى عالقة في الذاكرة." },
  { title: "المسافة", body: "بين قلبين مسافة، وبين المسافة كلمات لم تُقل بعد." },
  { title: "الوعد", body: "ما انتهى شيء طالما بقي أحدهما يتذكّر." },
];

export default function Home({ openAt, onLogout }: HomeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countdown = useCountdown(openAt);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from(".chapter", {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: ".chapters", start: "top 80%" },
      });
      gsap.to(".hero-glow", {
        yPercent: 25,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  return (
    <div ref={rootRef} className="home">
      <header className="topbar">
        <span className="brand">Nafsam</span>
        <button className="ghost-button" onClick={handleLogout}>
          خروج
        </button>
      </header>

      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <p className="kicker">أرشيف قلبين افترقا</p>
        <h1 className="hero-title">
          <SplitWords text="لم تنتهِ الحكاية" />
        </h1>
        {!countdown.done && (
          <SpotlightCard className="countdown-card">
            <div className="countdown">
              <Unit value={countdown.days} label="يوم" />
              <Unit value={countdown.hours} label="ساعة" />
              <Unit value={countdown.minutes} label="دقيقة" />
              <Unit value={countdown.seconds} label="ثانية" />
            </div>
          </SpotlightCard>
        )}
      </section>

      <section className="chapters">
        {CHAPTERS.map((c) => (
          <article className="chapter" key={c.title}>
            <SpotlightCard>
              <h2>{c.title}</h2>
              <p>{c.body}</p>
            </SpotlightCard>
          </article>
        ))}
      </section>
    </div>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="unit">
      <span className="unit-value">{String(value).padStart(2, "0")}</span>
      <span className="unit-label">{label}</span>
    </div>
  );
}
