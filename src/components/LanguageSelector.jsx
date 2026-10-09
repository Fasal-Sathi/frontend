import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English", name: "English" },
  { code: "hi", label: "हिंदी", name: "Hindi" },
  { code: "ta", label: "தமிழ்", name: "Tamil" },
  { code: "te", label: "తెలుగు", name: "Telugu" },
  { code: "bn", label: "বাংলা", name: "Bengali" },
  { code: "mr", label: "मराठी", name: "Marathi" },
  { code: "gu", label: "ગુજરાતી", name: "Gujarati" },
  { code: "kn", label: "ಕನ್ನಡ", name: "Kannada" },
  { code: "or", label: "ଓଡ଼ିଆ", name: "Odia" }
];

export default function LanguageSelector({ mobile = false }) {
  const { i18n: instance, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const activeCode = instance.resolvedLanguage?.split("-")[0] || "en";
  const activeLanguage = languages.find(language => language.code === activeCode) || languages[0];

  useEffect(() => {
    const closeOnOutsideClick = event => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = event => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const selectLanguage = code => {
    instance.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`language-picker ${mobile ? "mobile-language" : ""}`}>
      <button
        ref={triggerRef}
        type="button"
        className="language-trigger"
        aria-label={`Choose language. Current language: ${activeLanguage.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
      >
        <img src="/language.png" alt="" className="language-icon" />
        <span>{activeLanguage.label}</span>
        <ChevronDown size={18} className={open ? "language-chevron is-open" : "language-chevron"} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="language-menu"
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            <div className="language-menu-heading">{t("language.choose")}</div>
            <div className="language-options">
              {languages.map(language => {
                const selected = language.code === activeCode;
                return (
                  <button
                    key={language.code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={selected}
                    className={`language-option ${selected ? "is-selected" : ""}`}
                    onClick={() => selectLanguage(language.code)}
                  >
                    <span className="language-option-label">{language.label}</span>
                    <span className="language-option-name">{language.name}</span>
                    {selected && <Check size={16} className="language-option-check" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
