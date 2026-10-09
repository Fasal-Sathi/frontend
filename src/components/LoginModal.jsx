import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Smartphone, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginModal({ open, onClose, redirectTo="/prediction" }) {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => document.body.style.overflow = ""; }, [open]);
  const go = (path) => { onClose(); navigate(path, { state: { redirectTo, returnTo: location.pathname } }); };
  return (
    <AnimatePresence initial={false}>
      {open && (
      <motion.div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}} onMouseDown={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{y:12,scale:.98}} animate={{y:0,scale:1}} exit={{y:8,scale:.99}} transition={{duration:.18,ease:"easeOut"}} className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 relative">
          <button aria-label="Close" onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"><X size={20}/></button>
          <div className="mx-auto h-14 w-14 rounded-full bg-green-50 text-govGreen flex items-center justify-center"><Smartphone/></div>
          <h2 className="mt-4 text-2xl font-extrabold text-center text-gray-900">Login to Access This Feature</h2>
          <p className="mt-2 text-center text-gray-600">इस फीचर का उपयोग करने के लिए लॉगिन करें</p>
          <p className="mt-4 text-center text-sm text-gray-500">Create your free account to get personalized yield predictions.</p>
          <div className="mt-6 grid gap-3">
            <button onClick={() => go("/login")} className="w-full py-3 rounded-xl bg-govGreen text-white font-bold hover:scale-[1.02] transition">Login with Phone</button>
            <button onClick={() => go("/signup")} className="w-full py-3 rounded-xl border-2 border-govBlue text-govBlue font-bold hover:bg-blue-50 transition flex items-center justify-center gap-2"><UserPlus size={18}/>Signup with Phone</button>
          </div>
          <button onClick={onClose} className="w-full mt-4 text-sm text-gray-500 hover:text-gray-900">Maybe Later</button>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
