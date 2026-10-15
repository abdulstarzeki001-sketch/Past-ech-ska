import { Link, useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { BookHeart, Camera, Film, HeartPulse, House, LogOut, Map, Music2, Send } from "lucide-react";
import { type Translations, type Lang } from "@/i18n/translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import "@/styles/luxe-chrome.css";

interface Props {
  t: Translations;
  lang: Lang;
  setLang: (lang: Lang) => void;
  onLogout: () => void;
}

export default function Navbar({ t, lang, setLang, onLogout }: Props) {
  const [location] = useLocation();
  const reducedMotion = useReducedMotion();
  const spring = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 460, damping: 38, mass: 0.75 };

  const links = [
    { href: "/home", label: t.nav_home, icon: House },
    { href: "/photos", label: t.nav_photos, icon: Camera },
    { href: "/journey", label: t.nav_journey, icon: Map },
    { href: "/songs", label: t.nav_songs, icon: Music2 },
    { href: "/videos", label: t.nav_videos, icon: Film },
    { href: "/writings", label: t.nav_writings, icon: BookHeart },
    { href: "/feelings", label: t.nav_feelings, icon: HeartPulse },
  ];

  const telegramHref = import.meta.env.BASE_URL + "telegram-call/";

  return (
    <>
      <header className="cinema-header">
        <Link href="/home" className="cinema-brand" aria-label={t.brand + " — home"}>
          <span className="cinema-brand__mark">N<span>.</span></span>
          <span className="cinema-brand__name">{t.brand}<small>THE MEMORY ARCHIVE</small></span>
        </Link>
        <nav className="cinema-nav-desktop" aria-label="Main navigation">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={location === href ? "is-active" : ""}
              aria-current={location === href ? "page" : undefined}
            >
              <span className="cinema-nav-desktop__label">{label}</span>
              {location === href && (
                <motion.span
                  aria-hidden="true"
                  className="cinema-nav-desktop__light"
                  layoutId="cinema-desktop-indicator"
                  transition={spring}
                />
              )}
            </Link>
          ))}
        </nav>
        <div className="cinema-header__actions">
          <LanguageSwitcher lang={lang} setLang={setLang} />
          <a className="cinema-header__chat" href={telegramHref} aria-label={t.nav_telegram} title={t.nav_telegram}>
            <Send size={17} strokeWidth={1.65} /><span>{t.nav_telegram}</span>
          </a>
          <button className="cinema-header__logout" onClick={onLogout} aria-label={t.nav_logout} title={t.nav_logout}>
            <LogOut size={17} strokeWidth={1.65} />
          </button>
        </div>
      </header>
      <nav className="cinema-mobile-dock" aria-label="Mobile navigation">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={"cinema-mobile-dock__item" + (location === href ? " is-active" : "")}
            aria-current={location === href ? "page" : undefined}
          >
            {location === href && (
              <motion.span
                aria-hidden="true"
                className="cinema-mobile-dock__light"
                layoutId="cinema-mobile-indicator"
                transition={spring}
              />
            )}
            <Icon size={18} strokeWidth={location === href ? 2 : 1.55} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
