import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpLeft, ArrowUpRight, BookOpenText, Camera, Film, Headphones, HeartPulse, Sparkles } from "lucide-react";
import { type Translations, type Lang } from "@/i18n/translations";
import FarewellPassage from "@/components/FarewellPassage";
import OblivionScript from "@/components/OblivionScript";
import Footer from "@/components/Footer";
import CosmicHeroArt from "@/components/CosmicHeroArt";
import useCinematicScroll from "@/hooks/useCinematicScroll";
import usePageAudio from "@/hooks/usePageAudio";
import { usePrivateContent, pickLangPages } from "@/hooks/usePrivateContent";
import "@/styles/luxe-home-login.css";

const START = new Date("2025-08-20T04:04:00");
function elapsed(now: Date) {
  const s = Math.max(0, Math.floor((now.getTime() - START.getTime()) / 1000));
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}
const pad = (n: number) => String(n).padStart(2, "0");

interface Props { t: Translations; lang: Lang; }
export default function Home({ t, lang }: Props) {
  const data = usePrivateContent();
  const p = pickLangPages(data, lang);
  usePageAudio(data?.pageAudio?.home ?? "");
  const root = useRef<HTMLDivElement>(null);
  useCinematicScroll(root);
  const [time, setTime] = useState(() => elapsed(new Date()));
  useEffect(() => {
    const interval = window.setInterval(() => setTime(elapsed(new Date())), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const archive = [
    { href: "/photos", label: t.card_photos_title, desc: p.card_photos_text, icon: Camera, num: "01" },
    { href: "/journey", label: t.card_moments_title, desc: p.card_moments_text, icon: Sparkles, num: "02" },
    { href: "/videos", label: t.nav_videos, desc: p.videos_text, icon: Film, num: "03" },
    { href: "/songs", label: t.card_songs_title, desc: p.card_songs_text, icon: Headphones, num: "04" },
    { href: "/writings", label: t.card_writings_title, desc: p.card_writings_text, icon: BookOpenText, num: "05" },
    { href: "/feelings", label: t.nav_feelings, desc: p.footer_text, icon: HeartPulse, num: "06" },
  ];
  const entrance = { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.85, ease: "easeOut" as const } };

  return (
    <div className="page-content home-page cinema-home" ref={root}>
      <section className="hero cinema-hero">
        <div className="cinema-hero__frame">
          <motion.div className="cinema-hero__copy" {...entrance}>
            <div className="cinema-eyebrow"><span className="cinema-pulse" /> <span>NAFSAM / PRIVATE UNIVERSE</span><span className="cinema-eyebrow__line" /></div>
            <p className="cinema-hero__index">A STORY WRITTEN IN STARS — 2025 / ∞</p>
            <h1 className="cinema-hero__title">{t.hero_title}<span className="cinema-hero__title-orbit">✦</span></h1>
            <p className="cinema-hero__lede">{p.hero_text || t.hero_eyebrow}</p>
            <div className="cinema-hero__actions">
              <Link className="cinema-action cinema-action--primary" href="/journey">{t.open_story} <ArrowUpLeft size={18} /></Link>
              <Link className="cinema-action cinema-action--ghost" href="/photos">{t.nav_photos} <ArrowUpRight size={17} /></Link>
            </div>
            <div className="cinema-live-counter" aria-label="Time elapsed since August 20, 2025">
              <span className="cinema-live-counter__title">SINCE THE BEGINNING <span className="cinema-live-counter__live" /></span>
              <div className="cinema-live-counter__units">
                <span><strong>{time.days}</strong><small>{t.countdown_day}</small></span>
                <i />
                <span><strong>{pad(time.hours)}</strong><small>{t.countdown_hour}</small></span>
                <i />
                <span><strong>{pad(time.minutes)}</strong><small>{t.countdown_minute}</small></span>
                <i />
                <span><strong>{pad(time.seconds)}</strong><small>{t.countdown_second}</small></span>
              </div>
            </div>
          </motion.div>
          <CosmicHeroArt />
        </div>
        <a className="cinema-scroll-hint" href="#cinema-archive"><ArrowDown size={15} /> <span>EXPLORE THE ARCHIVE</span></a>
        <div className="cinema-hero__edge-tag">EST. MMXXV — INFINITY</div>
      </section>

      {(p.farewell_title || p.oblivion_name) && (
        <section className="cinema-interlude cinema-scroll-reveal">
          <span className="cinema-section-number">00 / THE STORY</span>
          <div className="cinema-interlude__layout">
            <div className="cinema-interlude__aside">
              <span className="cinema-star-symbol">✳</span>
              <p>EVERY MEMORY<br />HAS AN ORBIT.</p>
            </div>
            <div className="cinema-interlude__text">
              {p.farewell_title && (
                <FarewellPassage
                  title={p.farewell_title}
                  paragraphs={[p.farewell_p1 ?? "", p.farewell_p2 ?? "", p.farewell_p3 ?? "", p.farewell_p4 ?? ""].filter(Boolean)}
                  silverAnchor={p.farewell_silver_anchor ?? ""}
                  memoryPattern={p.farewell_memory_pattern ?? ""}
                  dir={t.dir}
                  lang={lang}
                />
              )}
              {p.oblivion_name && (
                <OblivionScript name={p.oblivion_name} hint={p.oblivion_hint ?? ""} revealed={p.oblivion_revealed ?? ""} dir={t.dir} lang={lang} />
              )}
            </div>
          </div>
        </section>
      )}

      <section className="cinema-archive" id="cinema-archive">
        <div className="cinema-section-heading cinema-scroll-reveal">
          <div><span className="cinema-section-number">01 / THE COLLECTION</span><h2>{t.brand}<em> / </em>{t.open_story}</h2></div>
          <p>{p.card_moments_text || t.hero_eyebrow}</p>
        </div>
        <div className="cinema-archive__grid">
          {archive.map(({ href, label, desc, icon: Icon, num }) => (
            <Link href={href} key={href} className="cinema-archive-card cinema-scroll-reveal">
              <div className="cinema-archive-card__top"><span>{num} / 06</span><ArrowUpRight size={18} /></div>
              <div className="cinema-archive-card__icon"><Icon size={27} strokeWidth={1.2} /></div>
              <h3>{label}</h3>
              <p>{desc || t.hero_eyebrow}</p>
              <span className="cinema-archive-card__index">N — {num}</span>
            </Link>
          ))}
        </div>
      </section>
      <div className="cinema-endnote"><span>✦</span><p>{p.footer_text || t.brand}</p><span>∞</span></div>
      {p.footer_text && <Footer text={p.footer_text} />}
    </div>
  );
}
