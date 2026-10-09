import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 300);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      type="button"
      aria-label="Scroll to top"
      title="Scroll to top"
      onClick={scrollToTop}
      initial={false}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.9 }}
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ y: -12, scale: 0.95 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      className="fixed bottom-28 right-7 z-[69] flex h-16 w-16 items-center justify-center rounded-full bg-govGreen text-white shadow-xl transition-colors hover:bg-green-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-govGreen max-[760px]:bottom-24 max-[760px]:right-3 max-[760px]:h-14 max-[760px]:w-14"
    >
      <ArrowUp size={28} aria-hidden="true" />
    </motion.button>
  );
}
