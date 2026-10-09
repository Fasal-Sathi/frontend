import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const OTP_LIFETIME_SECONDS = 300;
const RESEND_DELAY_SECONDS = 60;

export default function OTP() {
  const { requestOtp, verifyOtp } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const pending = JSON.parse(localStorage.getItem("fasalsathi-pending") || "{}");
  const phone = loc.state?.phone || pending.phone || "";
  const mode = loc.state?.mode || pending.mode || "login";
  const next = loc.state?.next || "/prediction";
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(OTP_LIFETIME_SECONDS);
  const [resendSeconds, setResendSeconds] = useState(RESEND_DELAY_SECONDS);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((remaining) => Math.max(remaining - 1, 0));
      setResendSeconds((remaining) => Math.max(remaining - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const verify = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(phone, otp, mode);
      localStorage.removeItem("fasalsathi-pending");
      toast.success("Welcome back! You can now access all features");
      nav(next, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.detail || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (resending || resendSeconds > 0) return;

    setResending(true);
    try {
      await requestOtp(phone, mode);
      setSeconds(OTP_LIFETIME_SECONDS);
      setResendSeconds(RESEND_DELAY_SECONDS);
      setOtp("");
      toast.success("A new OTP has been sent");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Unable to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] gov-pattern flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-gov border p-8 text-center">
        <h1 className="text-3xl font-extrabold">Enter OTP | OTP दर्ज करें</h1>
        <p className="mt-3 text-gray-600">We've sent a code to +91 {phone}</p>
        <form onSubmit={verify} className="mt-8">
          <input
            autoFocus
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-full text-center tracking-[.65em] text-2xl font-bold border rounded-xl py-4"
            placeholder="••••••"
            inputMode="numeric"
            autoComplete="one-time-code"
          />
          <button disabled={loading || seconds === 0} className="mt-5 w-full py-3.5 rounded-xl bg-govGreen text-white font-bold disabled:opacity-60">
            {loading ? "Verifying…" : "Verify & Continue"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-500">
          OTP expires in {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
        </p>
        <button
          type="button"
          disabled={resending || resendSeconds > 0}
          onClick={resend}
          className="mt-2 text-govBlue font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resending ? "Sending…" : resendSeconds > 0 ? `Resend OTP in ${resendSeconds}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}
