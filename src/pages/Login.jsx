import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login({signup=false}) {
  const {t}=useTranslation();
  const {requestOtp}=useAuth(); const navigate=useNavigate(); const location=useLocation();
  const [phone,setPhone]=useState(""); const [name,setName]=useState(""); const [loading,setLoading]=useState(false);
  const next=location.state?.from || location.state?.redirectTo || "/prediction";
  const submit=async e=>{e.preventDefault(); if(!/^[6-9]\d{9}$/.test(phone)){toast.error(t("auth.invalidPhone"));return}
    if (signup && !name.trim()) { toast.error(t("auth.fullName")); return; }
    setLoading(true); try {const mode=signup?"signup":"login"; const result=await requestOtp(phone,mode,name.trim()); const pending={phone,mode,name:name.trim(),demoOtp:result.demo_otp||""}; localStorage.setItem("fasalsathi-pending",JSON.stringify(pending)); toast.success(result.demo?"Demo OTP is ready":"OTP sent"); navigate("/otp",{state:{...pending,next}})} catch(err){toast.error(err.response?.data?.detail||t("auth.sendFailed"))} finally{setLoading(false)}
  };
  return <div className="min-h-[calc(100vh-76px)] gov-pattern flex items-center justify-center px-4 py-16"><div className="relative w-full max-w-lg bg-white rounded-3xl shadow-gov border p-7 sm:p-10">
    <button type="button" aria-label={t("auth.closeLogin")} onClick={() => navigate(location.state?.returnTo || "/")} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"><X size={20}/></button>
    <div className="text-center"><div className="mx-auto h-14 w-14 rounded-full bg-blue-50 text-govBlue flex items-center justify-center"><ShieldCheck/></div><h1 className="mt-5 text-3xl font-extrabold">{signup?t("auth.signup"):t("auth.login")}</h1><p className="mt-2 font-hi text-gray-600">{signup?t("auth.signupSubtitle"):t("auth.loginSubtitle")}</p></div>
    {signup&&<div className="mt-7"><label htmlFor="signup-name" className="text-base font-semibold">{t("auth.fullName")}</label><input id="signup-name" value={name} onChange={e=>setName(e.target.value)} className="mt-2 min-h-14 w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-govGreen/30" placeholder={t("auth.fullNamePlaceholder")} autoComplete="name" /></div>}
    <form onSubmit={submit} className="mt-6"><label className="text-base font-semibold">{t("auth.phone")}</label><div className="mt-2 flex"><span className="min-h-14 flex items-center px-3 border border-r-0 rounded-l-xl bg-gray-50 text-base">+91</span><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} className="min-h-14 w-full border rounded-r-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-govGreen/30" placeholder={t("auth.phonePlaceholder")} inputMode="numeric" /></div><button disabled={loading} className="mt-5 w-full py-3.5 rounded-xl bg-govGreen text-white font-extrabold disabled:opacity-60">{loading?t("auth.sendingOtp"):t("auth.sendOtp")}</button></form>
    <button onClick={()=>toast(t("auth.aadhaarUnavailable"))} className="mt-4 w-full py-3.5 rounded-xl border-2 border-govBlue text-govBlue font-bold">{t("auth.aadhaarDemo")}</button>
    <p className="mt-6 text-center text-sm text-gray-600">{signup?t("auth.alreadyAccount"):t("auth.newHere")} <Link to={signup?"/login":"/signup"} state={location.state} className="font-bold text-govGreen">{signup?t("auth.loginLink"):t("auth.createAccountLink")}</Link></p>
  </div></div>
}
