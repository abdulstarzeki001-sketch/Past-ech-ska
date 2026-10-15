import { useState, useEffect } from "react";
import { Link } from "wouter";
import { type Translations, type Lang } from "@/i18n/translations";
import FarewellPassage from "@/components/FarewellPassage";
import OblivionScript from "@/components/OblivionScript";
import Footer from "@/components/Footer";
import PhotoBackdrop from "@/components/PhotoBackdrop";
import usePageAudio from "@/hooks/usePageAudio";
import { usePrivateContent, pickLangPages } from "@/hooks/usePrivateContent";
import { imageUrl } from "@/lib/r2";

import "@/styles/luxe-home-login.css";


const heroCopy: Record<Lang, { kicker: string; lineOne: string; lineTwo: string; intro: string; archive: string; memories: string; distance: string; scroll: string; memoryLabel: string }> = {
  ar: {
    kicker: "أرشيف قلبين افترقا",
    lineOne: "لم تنتهِ",
    lineTwo: "الحكاية…",
    intro: "افترقنا في الطريق، لكن شيئاً منّا لا يزال عالقاً بين أول لقاء وآخر وداع.",
    archive: "ادخل إلى الحكاية",
    memories: "تصفّح الذكريات",
    distance: "بين قلبين… مسافة اسمها الغياب",
    scroll: "اسحب لتبدأ الرحلة",
    memoryLabel: "من بقايا الضوء"
  },
  en: {
    kicker: "THE ARCHIVE OF TWO DISTANT HEARTS",
    lineOne: "The story",
    lineTwo: "never ended…",
    intro: "Our roads divided, yet something of us remains between the first hello and the last goodbye.",
    archive: "Enter our story",
    memories: "Browse the memories",
    distance: "Two hearts, one impossible distance",
    scroll: "Scroll into the memories",
    memoryLabel: "Fragments of light"
  },
  tr: {
    kicker: "BİRBİRİNDEN UZAK İKİ KALBİN ARŞİVİ",
    lineOne: "Hikâyemiz",
    lineTwo: "bitmedi…",
    intro: "Yollarımız ayrıldı; ama ilk merhaba ile son veda arasında bizden bir şey hâlâ yaşıyor.",
    archive: "Hikâyeye gir",
    memories: "Anılara bak",
    distance: "İki kalp arasında sessiz bir mesafe",
    scroll: "Anılara doğru kaydır",
    memoryLabel: "Işıktan kalanlar"
  },
  fa: {
    kicker: "آرشیو دو قلب دور از هم",
    lineOne: "قصهٔ ما",
    lineTwo: "تمام نشد…",
    intro: "راه‌هایمان جدا شد، اما چیزی از ما میان نخستین سلام و آخرین خداحافظی جا ماند.",
    archive: "ورود به داستان",
    memories: "تماشای خاطره‌ها",
    distance: "میان دو قلب، فاصله‌ای به نام دلتنگی",
    scroll: "برای آغاز خاطره‌ها پایین برو",
    memoryLabel: "تکه‌هایی از نور"
  }
};

const START = new Date("2025-08-20T04:04:00");

function elapsed(now: Date) {
  let d = Math.floor((now.getTime() - START.getTime()) / 1000);
  if (d < 0) d = 0;
  const days = Math.floor(d / 86400);
  const hrs = Math.floor((d % 86400) / 3600);
  const mins = Math.floor((d % 3600) / 60);
  const secs = d % 60;
  return { days, hrs, mins, secs };
}

interface Props {
  t: Translations;
  lang: Lang;
}

export default function Home({ t, lang }: Props) {
  const data = usePrivateContent();
  usePageAudio(data?.pageAudio?.home ?? "");
  const p = pickLangPages(data, lang);
  const copy = heroCopy[lang] ?? heroCopy.ar;

  const [el, setEl] = useState(elapsed(new Date()));

  useEffect(() => {
    const interval = setInterval(() => setEl(elapsed(new Date())), 1000);
    return () => clearInterval(interval);
  }, []);

  const heroImage = (() => {
    const photo = data?.photos?.find((file) => file && !/memori[-_]?0*1(?:\.[a-z0-9]+)?$/i.test(file.split("/").pop() ?? ""));
    if (!photo) return "";
    const dir = data?.mediaConfig?.photosDir || "all_photos";
    return imageUrl(`${dir}/${photo}`);
  })();

  useEffect(() => {
    if (!heroImage) return;
    if (document.head.querySelector(`link[data-hero-preload="1"]`)) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = heroImage;
    link.setAttribute("fetchpriority", "high");
    link.setAttribute("data-hero-preload", "1");
    document.head.appendChild(link);
    const img = new Image();
    (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority =
      "high";
    img.decoding = "async";
    img.src = heroImage;
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, [heroImage]);

  return (
    <div className="page-content home-page celestial-luxe-theme">
      <div className="luxe-ambient-glow" aria-hidden="true" />
      <div className="luxe-stars" aria-hidden="true">
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="star star-4"></div>
        <div className="star star-5"></div>
      </div>
      <PhotoBackdrop />
      
      <section className="separation-hero" aria-labelledby="separation-title">
        <div className="separation-hero__wash" aria-hidden="true" />
        <div className="separation-hero__grid" aria-hidden="true" />
        <div className="separation-hero__inner">
          <div className="separation-hero__story">
            <span className="separation-kicker"><span className="separation-kicker__line" />{copy.kicker}</span>
            <div className="separation-hero__edition" aria-hidden="true">NAFSAM <span>—</span> 2025 / ∞</div>
            <h1 className="separation-heading" id="separation-title">
              <span>{copy.lineOne}</span>
              <em>{copy.lineTwo}</em>
            </h1>
            <p className="separation-quote">{t.hero_title}</p>
            <p className="separation-intro">{copy.intro}</p>
            <div className="separation-actions">
              <Link href="/journey" className="separation-button separation-button--primary">
                <span>{copy.archive}</span><span aria-hidden="true">↗</span>
              </Link>
              <Link href="/photos" className="separation-button separation-button--text">
                <span>{copy.memories}</span><span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="separation-countdown" aria-label={t.elapsed_label}>
              <span className="separation-countdown__dot" aria-hidden="true" />
              <span>{el.days} {t.countdown_day}</span>
              <i aria-hidden="true">/</i>
              <span>{String(el.hrs).padStart(2, "0")}:{String(el.mins).padStart(2, "0")}:{String(el.secs).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="separation-visual" aria-label={copy.distance}>
            <div className="separation-visual__halo separation-visual__halo--one" aria-hidden="true" />
            <div className="separation-visual__halo separation-visual__halo--two" aria-hidden="true" />
            <div className="separation-frame" aria-hidden="true">
              <div className="separation-frame__half separation-frame__half--left" style={heroImage ? { backgroundImage: "url(" + heroImage + ")" } : undefined} />
              <div className="separation-frame__half separation-frame__half--right" style={heroImage ? { backgroundImage: "url(" + heroImage + ")" } : undefined} />
              <div className="separation-frame__fracture">
                <svg viewBox="0 0 40 420" preserveAspectRatio="none" focusable="false">
                  <path d="M20 0 L13 72 L27 112 L9 179 L29 241 L12 292 L26 363 L17 420" />
                </svg>
              </div>
              <div className="separation-frame__grain" />
              <span className="separation-frame__stamp">MEMORIES / 001</span>
              <span className="separation-frame__edge">∞</span>
            </div>
            <div className="separation-visual__caption"><span>01 — ∞</span><span>{copy.distance}</span></div>
          </div>
        </div>
        <span className="separation-scroll-hint" aria-hidden="true">{copy.scroll}<span /></span>
      </section>
      <section className="separation-letter" aria-label={copy.memoryLabel}>
        <span className="separation-letter__eyebrow">{copy.memoryLabel} <span aria-hidden="true">✳</span></span>
        <div className="separation-letter__body">
          {p.farewell_title && (
            <FarewellPassage
              title={p.farewell_title}
              paragraphs={[
                p.farewell_p1 ?? "",
                p.farewell_p2 ?? "",
                p.farewell_p3 ?? "",
                p.farewell_p4 ?? "",
              ].filter(Boolean)}
              silverAnchor={p.farewell_silver_anchor ?? ""}
              memoryPattern={p.farewell_memory_pattern ?? ""}
              dir={t.dir}
              lang={lang}
            />
          )}
        </div>
      </section>

      {p.oblivion_name && (
        <OblivionScript
          name={p.oblivion_name}
          hint={p.oblivion_hint ?? ""}
          revealed={p.oblivion_revealed ?? ""}
          dir={t.dir}
          lang={lang}
        />
      )}

      <div className="luxe-divider" aria-hidden="true">
        <div className="luxe-diamond"></div>
      </div>

      <section className="cards-section">
        <div className="cards-grid">
          <Link href="/journey" className="card glass luxe-glass-card">
            <h3>{t.card_moments_title}</h3>
            {p.card_moments_text && <p>{p.card_moments_text}</p>}
          </Link>
          <Link href="/photos" className="card glass luxe-glass-card">
            <h3>{t.card_photos_title}</h3>
            {p.card_photos_text && <p>{p.card_photos_text}</p>}
          </Link>
          <Link href="/songs" className="card glass luxe-glass-card">
            <h3>{t.card_songs_title}</h3>
            {p.card_songs_text && <p>{p.card_songs_text}</p>}
          </Link>
          <Link href="/writings" className="card glass luxe-glass-card">
            <h3>{t.card_writings_title}</h3>
            {p.card_writings_text && <p>{p.card_writings_text}</p>}
          </Link>
          <Link href="/videos" className="card glass luxe-glass-card">
            <span className="separation-card-index" aria-hidden="true">05 / ∞</span>
            <h3>{t.nav_videos}</h3>
            <span className="separation-card-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link href="/feelings" className="card glass luxe-glass-card">
            <span className="separation-card-index" aria-hidden="true">06 / ∞</span>
            <h3>{t.nav_feelings}</h3>
            <span className="separation-card-arrow" aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      {p.footer_text && <Footer text={p.footer_text} />}
    </div>
  );
}
