import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const classifyQuestion = text => {
  const normalized = text.toLocaleLowerCase();

  if (/predict|prediction|estimate|forecast|पूर्वानुमान|அனுமான|அறுவடை|అంచనా|পূর্বাভাস|अंदाज|અંદાજ|ಅಂದಾಜು|ଅନୁମାନ/.test(normalized)) {
    return "replyPrediction";
  }

  if (/yield|crop|fertili|irrigat|harvest|उपज|फसल|सिंचाई|மகசூல்|பயிர்|దిగుబడి|పంట|ফলন|ফসল|उत्पादन|पीक|ઉપજ|પાક|ಇಳುವರಿ|ಬೆಳೆ|ଅମଳ|ଫସଲ/.test(normalized)) {
    return "replyYield";
  }

  if (/language|भाषा|மொழி|భాష|ভাষা|भाषा|ಭಾಷೆ|ଭାଷା/.test(normalized)) {
    return "replyLanguage";
  }

  if (/help|support|મદદ|सहायता|உதவி|సహాయం|সাহায্য|मदत|ಸಹಾಯ|ସହାୟତା/.test(normalized)) {
    return "replySupport";
  }

  return null;
};

export default function ChatBot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const welcome = t("chat.welcome");
  const [messages, setMessages] = useState(() => [
    { id: "welcome", sender: "bot", text: welcome }
  ]);
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(0);

  useEffect(() => {
    setMessages(previous => (
      previous.length === 1 && previous[0].id === "welcome"
        ? [{ ...previous[0], text: welcome }]
        : previous
    ));
  }, [welcome]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isOpen]);

  const sendMessage = (text, forcedReply) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const replyKey = forcedReply || classifyQuestion(trimmed);
    setMessages(previous => [
      ...previous,
      { id: `user-${++messageIdRef.current}`, sender: "user", text: trimmed },
      {
        id: `bot-${++messageIdRef.current}`,
        sender: "bot",
        text: t(replyKey ? `chat.${replyKey}` : "chat.fallback")
      }
    ]);
    setInput("");
  };

  const quickReplies = [
    { key: "replyPrediction", label: t("chat.quickPrediction") },
    { key: "replyYield", label: t("chat.quickYield") },
    { key: "replyLanguage", label: t("chat.quickLanguage") }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex max-w-[calc(100vw-2rem)] flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label={t("chat.title")}
            aria-modal="false"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mb-3 flex max-h-[min(580px,calc(100dvh-5rem))] w-[min(350px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[22px] border border-orange-100 bg-white shadow-[0_20px_58px_rgba(21,51,41,0.2)]"
          >
            <header className="flex shrink-0 items-center justify-between bg-gradient-to-br from-orange-700 via-orange-600 to-amber-500 px-3.5 py-3 text-white">
              <div className="flex min-w-0 items-center gap-2.5">
                <img src="/fasal-sathi.jpeg" alt="FasalSathi logo" className="h-12 w-24 shrink-0 rounded-xl bg-white object-contain p-1 shadow-sm" />
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-extrabold tracking-wide">{t("chat.title")}</h2>
                  <p className="mt-0.5 truncate text-base text-orange-50/90">{t("chat.subtitle")}</p>
                </div>
              </div>
              <button
                type="button"
                aria-label={t("chat.close")}
                title={t("chat.close")}
                onClick={() => setIsOpen(false)}
                className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-[#f7faf8] px-4 py-4">
              <div className="flex flex-col gap-3">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <p
                      className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-lg leading-8 shadow-sm ${
                        message.sender === "user"
                          ? "rounded-br-md bg-orange-600 text-white"
                          : "rounded-bl-md border border-slate-100 bg-white text-slate-700"
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <footer className="shrink-0 border-t border-slate-100 bg-white px-3.5 pb-3.5 pt-3">
              <div className="mb-3 flex flex-wrap gap-1.5">
                {quickReplies.map(reply => (
                  <button
                    key={reply.key}
                    type="button"
                    onClick={() => sendMessage(reply.label, reply.key)}
                    className="rounded-full border border-orange-100 bg-orange-50 px-3.5 py-2.5 text-left text-sm font-semibold leading-6 text-orange-900 transition hover:border-orange-300 hover:bg-orange-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-700"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
              <form
                onSubmit={event => {
                  event.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 pl-3 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100"
              >
                <input
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  placeholder={t("chat.placeholder")}
                  aria-label={t("chat.placeholder")}
                  className="h-12 min-w-0 flex-1 border-0 bg-transparent text-lg text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label={t("chat.send")}
                  title={t("chat.send")}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white transition hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Send size={17} aria-hidden="true" />
                </button>
              </form>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={isOpen ? t("chat.close") : t("chat.open")}
        title={isOpen ? t("chat.close") : t("chat.open")}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
        layout
        transition={{ layout: { duration: 0.28, ease: "easeInOut" } }}
        className={`flex items-center rounded-full bg-gradient-to-br from-orange-700 to-amber-500 text-white shadow-[0_10px_26px_rgba(194,85,18,0.32)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(194,85,18,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 ${isOpen ? "h-[52px] w-[52px] justify-center p-0" : "h-16 w-[230px] justify-start gap-4 px-5 max-[420px]:h-14 max-[420px]:w-14 max-[420px]:justify-center max-[420px]:gap-0 max-[420px]:p-0"}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen
            ? <motion.span key="close" initial={{ opacity: 0, scale: 0.65, rotate: -60 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.65, rotate: 60 }} transition={{ duration: 0.16 }} className="flex items-center justify-center"><X size={24} aria-hidden="true" /></motion.span>
            : <motion.span key="open" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.14 }} className="flex items-center gap-4"><MessageCircle size={26} aria-hidden="true" /><span className="whitespace-nowrap text-lg font-extrabold max-[420px]:hidden">{t("chat.open")}</span></motion.span>}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
