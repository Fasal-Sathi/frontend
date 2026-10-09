import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import hi from "./locales/hi/translation.json";
import ta from "./locales/ta/translation.json";
import te from "./locales/te/translation.json";
import bn from "./locales/bn/translation.json";
import mr from "./locales/mr/translation.json";
import gu from "./locales/gu/translation.json";
import kn from "./locales/kn/translation.json";
import odia from "./locales/or/translation.json";

const supportedLanguages = ["en", "hi", "ta", "te", "bn", "mr", "gu", "kn", "or"];

const detectLanguage = () => {
  const saved = localStorage.getItem("fasalsathi-language");
  if (supportedLanguages.includes(saved)) return saved;
  const lang = (navigator.language || "en").toLowerCase();
  const detected = lang.split("-")[0];
  if (supportedLanguages.includes(detected)) return detected;
  return "en";
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    ta: { translation: ta },
    te: { translation: te },
    bn: { translation: bn },
    mr: { translation: mr },
    gu: { translation: gu },
    kn: { translation: kn },
    or: { translation: odia }
  },
  lng: detectLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

i18n.on("languageChanged", lng => localStorage.setItem("fasalsathi-language", lng));
export default i18n;
