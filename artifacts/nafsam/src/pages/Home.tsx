import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  Observer,
  TextPlugin,
  archiveEase,
} from "@/lib/gsap";
import SplitWords from "@/components/SplitWords";
import SpotlightCard from "@/components/SpotlightCard";
import ScrambleTitle from "@/components/ScrambleTitle";
import OrbitMotif from "@/components/OrbitMotif";
import DraggableStrip from "@/components/DraggableStrip";
import FlipLayout from "@/components/FlipLayout";
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

const MEMORIES = [
  { title: "ليلة الشتاء", body: "حديث طويل تحت مطر خفيف، والوقت لم يكن يهم." },
  { title: "رسالة صباحية", body: "أول كلمة في اليوم، وآخر كلمة قبل النوم." },
  { title: "الطريق", body: "خطوات متوازية على طريقين مختلفين." },
  { title: "الصورة", body: "لحظة توقفت ولم تُنسَ أبداً." },
];

const MILESTONES = [
  { title: "أول لقاء", body: "البداية التي لم تكن تعرف أنها بداية." },
  { title: "أطول غياب", body: "الأيام التي مرّت ببطء ثقيل." },
  { title: "العودة", body: "حين التقت الطرق من جديد." },
  { title: "الآن", body: "ما زالت الحكاية مفتوحة." },
];

export default function Home({ openAt, onLogout }: HomeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const topbarRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);
  const countdown = useCountdown(openAt);

  // Entrance timeline with the custom archive ease, plus scroll reveals.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: archiveEase } })
        .from(".hero .kicker", { opacity: 0, y: 20, duration: 0.8 })
        .from(".orbit-svg", { opacity: 0, scale: 0.8, duration: 1.4 }, "-=0.4")
        .from(".hero-cta", { opacity: 0, y: 16, duration: 0.8 }, "-=0.8");

      gsap.from(".chapter", {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: ".chapters", start: "top 80%" },
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  // Topbar hides on scroll down and returns on scroll up (Observer).
  useEffect(() => {
    const bar = topbarRef.current;
    if (!bar) return;
    const obs = Observer.create({
      type: "wheel,touch",
      tolerance: 12,
      onDown: () => gsap.to(bar, { yPercent: -100, duration: 0.5, ease: "power3.out", overwrite: true }),
      onUp: () => gsap.to(bar, { yPercent: 0, duration: 0.5, ease: "power3.out", overwrite: true }),
    });
    return () => obs.kill();
  }, []);

  // Soft glow that follows the pointer (quickTo for smooth, cheap updates).
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    gsap.set(glow, { xPercent: -50, yPercent: -50 });
    const qx = gsap.quickTo(glow, "x", { duration: 1.4, ease: "power3.out" });
    const qy = gsap.quickTo(glow, "y", { duration: 1.4, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      qx((e.clientX - window.innerWidth / 2) * 0.15);
      qy((e.clientY - window.innerHeight / 2) * 0.15);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // Footer line types itself in once it scrolls into view (TextPlugin).
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(el, {
          duration: 2.2,
          ease: "none",
          text: { value: "ما زالت الحكاية تُكتب…", delimiter: "" },
        }),
    });
    return () => st.kill();
  }, []);

  const scrollToChapters = () => {
    gsap.to(window, { duration: 1.4, ease: archiveEase, scrollTo: { y: "#chapters", offsetY: 40 } });
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  return (
    <div ref={rootRef} className="home">
      <header ref={topbarRef} className="topbar">
        <span className="brand">Nafsam</span>
        <button className="ghost-button" onClick={handleLogout}>
          خروج
        </button>
      </header>

      <section className="hero">
        <div ref={glowRef} className="hero-glow" aria-hidden="true" />
        <p className="kicker">أرشيف قلبين افترقا</p>
        <h1 className="hero-title">
          <SplitWords text="لم تنتهِ الحكاية" />
        </h1>
        <OrbitMotif />
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
        <button className="ghost-button hero-cta" onClick={scrollToChapters}>
          ابدأ الرحلة
        </button>
      </section>

      <section id="chapters" className="chapters">
        {CHAPTERS.map((c) => (
          <article className="chapter" key={c.title}>
            <SpotlightCard>
              <ScrambleTitle text={c.title} className="chapter-title" />
              <p>{c.body}</p>
            </SpotlightCard>
          </article>
        ))}
      </section>

      <section className="block">
        <h3 className="section-label">ذكريات تُسحب</h3>
        <DraggableStrip items={MEMORIES} />
      </section>

      <section className="block">
        <h3 className="section-label">المحطات</h3>
        <FlipLayout items={MILESTONES} />
      </section>

      <footer className="site-footer">
        <p ref={footerRef} className="footer-typed" />
      </footer>
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
