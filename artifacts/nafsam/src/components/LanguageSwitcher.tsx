import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe2 } from "lucide-react";
import { type Lang } from "@/i18n/translations";

interface Props {
  lang: Lang;
  setLang: (language: Lang) => void;
  /** Use the top corner when there is no navigation header (login). */
  floating?: boolean;
}

const LANGUAGES: { code: Lang; name: string; short: string }[] = [
  { code: "ar", name: "العربية", short: "AR" },
  { code: "fa", name: "فارسی", short: "FA" },
  { code: "tr", name: "Türkçe", short: "TR" },
  { code: "en", name: "English", short: "EN" },
];

const TITLE: Record<Lang, string> = {
  ar: "اختر اللغة",
  fa: "انتخاب زبان",
  tr: "Dil seçin",
  en: "Choose language",
};

export default function LanguageSwitcher({ lang, setLang, floating = false }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={`locale-picker${floating ? " locale-picker--floating" : ""}${open ? " is-open" : ""}`}
      dir={lang === "ar" || lang === "fa" ? "rtl" : "ltr"}
    >
      <button
        ref={triggerRef}
        type="button"
        className="locale-picker__trigger"
        aria-label={TITLE[lang]}
        title={TITLE[lang]}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe2 size={17} strokeWidth={1.8} aria-hidden="true" />
        <span className="locale-picker__code">{lang.toUpperCase()}</span>
        <ChevronDown
          size={13}
          strokeWidth={1.8}
          className={`locale-picker__chevron${open ? " is-open" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="locale-picker__menu" role="menu" aria-label={TITLE[lang]}>
          <div className="locale-picker__caption" role="presentation">
            <Globe2 size={14} strokeWidth={1.6} aria-hidden="true" />
            <span>{TITLE[lang]}</span>
          </div>
          {LANGUAGES.map((item) => (
            <button
              type="button"
              key={item.code}
              role="menuitemradio"
              aria-checked={lang === item.code}
              className={`locale-picker__option${lang === item.code ? " is-selected" : ""}`}
              onClick={() => {
                setLang(item.code);
                setOpen(false);
              }}
            >
              <span className="locale-picker__option-name" lang={item.code} dir="auto">
                {item.name}
              </span>
              <span className="locale-picker__option-code" aria-hidden="true">{item.short}</span>
              {lang === item.code && <Check size={15} strokeWidth={2} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
