import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, BarChart3, Check, Droplets, HelpCircle, Leaf, Sprout, TrendingUp, Users, ShieldCheck, Database, FileText, Smartphone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";

const heroImages = ["/hero2.jpeg", "/hero4.1.jpg"];
const cardImages = [
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1523742813191-6b3f0b5e2b5a?auto=format&fit=crop&w=900&q=82"
];
const processImages = [
  "/fillform.jpg",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=900&q=82"
];
const farmerImages = [
  "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=500&q=82",
  "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=500&q=82",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=500&q=82"
];

function SectionTitle({ eyebrow, title, hindi }) {
  return (
    <div className="section-title">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {hindi && <div className="section-hindi">{hindi}</div>}
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const { loggedIn } = useAuth();
  const [modal, setModal] = useState(false);
  const [target, setTarget] = useState("/prediction");
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    // Load both hero images before the first transition so slide changes do not
    // wait on a network or disk read while the carousel is animating.
    heroImages.forEach((src) => {
      const image = new Image();
      image.src = src;
    });

    const interval = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroImages.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, []);

  const requireLogin = (to = "/prediction") => {
    if (loggedIn) window.location.href = to;
    else { setTarget(to); setModal(true); }
  };
  const heroCopy = heroSlide === 0
    ? {
        title: t("hero.title"),
        subtitle: t("hero.subtitle"),
        desc: t("hero.desc")
      }
    : {
        title: "Crop Yield Prediction",
        subtitle: "",
        desc: "Get an AI-powered estimate of your expected crop yield using crop type, soil conditions, weather, location, and farming practices."
      };

  return (
    <>
      <LoginModal open={modal} onClose={() => setModal(false)} redirectTo={target} />

      <section className="hero-section !mt-0">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={heroSlide}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 w-full"
            style={{ backgroundImage: `linear-gradient(90deg, rgba(6,42,28,.55) 0%, rgba(6,42,28,.35) 42%, rgba(6,42,28,.10) 72%), url(${heroImages[heroSlide]})`, backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat", willChange: "transform", backfaceVisibility: "hidden" }}
          >
            <div className="hero-overlay-pattern" style={{ zIndex: 1 }} />
            <div className="hero-inner" style={{ zIndex: 2 }}>
              <div className="hero-content hero-content--modern">
                <div className="hero-brand hero-brand--wordmark">FasalSathi</div>
                <h1>{heroCopy.title}</h1>
                {heroCopy.subtitle && <h2>{heroCopy.subtitle}</h2>}
                <p>{heroCopy.desc}</p>
                <div className="hero-actions">
                  <button onClick={() => requireLogin()} className="primary-btn">{t("hero.start")} <ArrowRight size={19} /></button>
                </div>
                {heroSlide === 0 && (
                  <div className="hero-checks"><span><Check /> {t("hero.free")}</span><span><Check /> {t("hero.languages")}</span><span><Check /> {t("hero.initiative")}</span></div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <section className="content-section challenges-section">
        <div className="two-col-head">
          <SectionTitle eyebrow={t("problem.eyebrow")} title={t("problem.title")} />
          <SectionTitle eyebrow={t("solution.eyebrow")} title={t("solution.title")} />
        </div>
        <div className="two-col-grid">
          <div className="challenge-grid">
            {[
              [BarChart3, t("problem.uncertain"), t("problem.uncertainDesc"), t("problem.uncertainStat"), "orange", cardImages[0]],
              [HelpCircle, t("problem.info"), t("problem.infoDesc"), t("problem.infoStat"), "blue", cardImages[1]],
              [Droplets, t("problem.resources"), t("problem.resourcesDesc"), t("problem.resourcesStat"), "green", "/feild.jpeg"]
            ].map(([Icon, title, desc, stat, tone, image]) => (
              <motion.article whileHover={{ y: -5 }} whileTap={{ scale: 1.015, y: -3 }} transition={{ type: "spring", stiffness: 420, damping: 24 }} key={title} className="challenge-card">
                <div className={`round-icon ${tone}`}><Icon size={25} /></div>
                <div className="challenge-photo" style={{ backgroundImage: `url(${image})` }} />
                <h3>{title}</h3>
                <p>{desc}</p>
                <strong className={tone}>{stat}</strong>
              </motion.article>
            ))}
          </div>

          <div className="solution-list">
            {[
              [t("solution.advance.title"), t("solution.advance.desc"), t("solution.advance.benefit"), "/sol.jpeg"],
              [t("solution.factors.title"), t("solution.factors.desc"), t("solution.factors.benefit"), "/sol2.jpeg"],
              [t("solution.steps.title"), t("solution.steps.desc"), t("solution.steps.benefit"), "/square.jpeg"]
            ].map(([title, desc, benefit, image]) => (
              <div className="solution-card" key={title}>
                <div className="solution-image" style={{ backgroundImage: `url(${image})` }} />
                <div className="solution-copy"><h3>{title}</h3><p>{desc}</p><span><Check size={15} /> {benefit}</span></div>
                  <button onClick={() => requireLogin()} className="try-btn">{t("solution.try")}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="impact-strip">
        <div className="impact-inner">
          <div className="impact-heading"><h2>{t("stats.title")}</h2></div>
          {[[Users, "50,000+", t("stats.farmers")], [TrendingUp, "10–15%", t("stats.yield")], [Leaf, "12", t("stats.crops")], [ShieldCheck, "9", t("stats.languages")]].map(([Icon, number, label]) => (
            <div className="impact-stat" key={label}><div className="impact-icon"><Icon size={26} /></div><div><strong>{number}</strong><span>{label}</span></div></div>
          ))}
        </div>
      </section>

      <section className="content-section process-section">
        <div className="process-heading">
          <SectionTitle eyebrow={t("works.eyebrow")} title={t("works.title")} />
        </div>
        <div className="process-grid">
          {[
            ["1", t("works.step1.title"), t("works.step1.desc")],
            ["2", t("works.step2.title"), t("works.step2.desc")],
            ["3", t("works.step3.title"), t("works.step3.desc")]
          ].map(([n, title, desc], i) => {
            const ProcessIcon = [Sprout, Database, FileText][i];
            return (
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className={`process-card process-card-${i + 1}`}
                key={n}
              >
                <div className="process-image" style={{ backgroundImage: `url(${processImages[i]})` }}>
                  <span className={`step-number step-${i + 1}`}>0{n}</span>
                  <span className="process-icon"><ProcessIcon size={23} /></span>
                </div>
                <div className="process-copy">
                  <span className="process-step-label">STEP 0{n}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <button onClick={() => requireLogin()}>{i === 1 ? t("works.learnMore") : t("hero.start")} <ArrowRight size={16} /></button>
                </div>
                {i < 2 && <div className="process-arrow"><ArrowRight size={20} /></div>}
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="cta-strip">
        <div className="cta-inner"><div className="cta-icon"><Sprout size={42} /></div><div><h2>{t("cta.title")}</h2><p>{t("cta.subtitle")}</p></div><button onClick={() => requireLogin()}>{t("cta.start")} <ArrowRight size={18} /></button><button className="download-btn"><Smartphone size={18} /> {t("cta.download")}</button><div className="cta-points"><span>✓ {t("cta.noRegistration")}</span><span>✓ {t("hero.free")}</span><span>✓ {t("cta.available")}</span></div></div>
      </section>
    </>
  );
}
