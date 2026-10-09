import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Droplets, Leaf, Loader2, Sparkles, Thermometer, TrendingUp, CloudRain, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { api } from "../utils/api";

const initial={crop:"Rice",location:"Odisha",area:2,rainfall:1200,temperature:28,humidity:75,irrigation:50,fertilizer:70,soil:"Loamy",sowing_date:"2026-06-15"};

export default function Prediction(){
  const {t}=useTranslation(); const [form,setForm]=useState(initial); const [result,setResult]=useState(null); const [loading,setLoading]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const run=async e=>{e.preventDefault();setLoading(true);try{const {data}=await api.post("/prediction/predict",form);setResult(data);toast.success("Prediction generated")}catch(err){toast.error(err.response?.data?.detail||"Prediction failed")}finally{setLoading(false)}};
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
    <div className="max-w-3xl"><p className="text-govGreen font-bold">AI DECISION SUPPORT</p><h1 className="text-4xl font-extrabold mt-2">{t("prediction.title")}</h1><p className="mt-3 text-gray-600 text-lg">{t("prediction.subtitle")}</p></div>
    <div className="mt-8 grid lg:grid-cols-[1.05fr_.95fr] gap-7">
      <form onSubmit={run} className="bg-white rounded-3xl border shadow-gov p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            {[['crop',t("prediction.crop")],['location',t("prediction.location")],['area',t("prediction.area")],['rainfall',t("prediction.rain")],['temperature',t("prediction.temp")],['humidity',t("prediction.humidity")],['irrigation',t("prediction.irrigation")],['fertilizer',t("prediction.fertilizer")]].map(([k,label])=><label key={k} className="text-base font-semibold">{label}<input value={form[k]} onChange={e=>set(k,e.target.value)} type={['area','rainfall','temperature','humidity','irrigation','fertilizer'].includes(k)?'number':'text'} className="mt-2 min-h-14 w-full border border-gray-300 rounded-xl px-4 py-3 text-base font-normal focus:outline-none focus:ring-2 focus:ring-govGreen/30"/></label>)}
            <label className="text-base font-semibold">{t("prediction.soil")}<select value={form.soil} onChange={e=>set("soil",e.target.value)} className="mt-2 min-h-14 w-full border border-gray-300 rounded-xl px-4 py-3 text-base font-normal focus:outline-none focus:ring-2 focus:ring-govGreen/30"><option>Loamy</option><option>Clay</option><option>Sandy</option><option>Black Soil</option></select></label>
            <label className="text-base font-semibold">{t("prediction.sowing")}<input value={form.sowing_date} onChange={e=>set("sowing_date",e.target.value)} type="date" className="mt-2 min-h-14 w-full border border-gray-300 rounded-xl px-4 py-3 text-base font-normal focus:outline-none focus:ring-2 focus:ring-govGreen/30"/></label>
        </div>
        <button disabled={loading} className="mt-7 w-full py-4 rounded-xl bg-govGreen text-white font-extrabold hover:scale-[1.01] transition flex items-center justify-center gap-2">{loading?<><Loader2 className="animate-spin"/>Analyzing…</>:<><Sparkles size={19}/>{t("prediction.run")}</>}</button>
      </form>
      <div className="space-y-5">
        {!result?<div className="h-full min-h-[400px] rounded-3xl border border-dashed bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-8 text-center"><div><Leaf size={60} className="mx-auto text-govGreen"/><h2 className="mt-5 text-2xl font-extrabold">Your AI result will appear here</h2><p className="mt-2 text-gray-600">Enter your farm conditions and run the model.</p></div></div>:
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="space-y-5">
          <div className="bg-white rounded-3xl border shadow-gov p-7"><p className="text-sm font-bold text-govGreen">{t("prediction.results")}</p><div className="mt-2 text-gray-600">{t("prediction.current")}</div><div className="mt-1 text-5xl font-black text-gray-900">{result.predicted_yield}<span className="text-xl font-bold text-gray-500"> t/ha</span></div><div className="mt-5 h-3 bg-gray-100 rounded-full overflow-hidden"><div style={{width:`${Math.min(result.confidence,100)}%`}} className="h-full bg-govGreen rounded-full"/></div><div className="mt-2 text-sm text-gray-500">Model confidence: {result.confidence}%</div></div>
          <div className="bg-white rounded-3xl border p-7"><h2 className="text-xl font-extrabold">{t("prediction.factors")}</h2><div className="mt-5 space-y-3">{result.factors.map((f,i)=><div key={i} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3"><span className="flex items-center gap-2 font-semibold"><span className="text-govGreen">{i%2?<Thermometer size={18}/>:<CloudRain size={18}/>}</span>{f.name}</span><span className={`text-sm font-bold px-2.5 py-1 rounded-full ${f.status==="Favorable"?"bg-green-100 text-green-700":"bg-orange-100 text-orange-700"}`}>{f.status}</span></div>)}</div></div>
          <div className="bg-orange-50 rounded-3xl border border-orange-200 p-7"><h2 className="text-xl font-extrabold">AI Optimization</h2><p className="mt-2 text-gray-600">Explore a model-based potential scenario by improving limiting factors.</p><div className="mt-5 flex items-center justify-between"><div><div className="text-sm text-gray-500">Current</div><b className="text-3xl">{result.predicted_yield}</b> t/ha</div><TrendingUp className="text-govGreen"/><div className="text-right"><div className="text-sm text-gray-500">Potential</div><b className="text-3xl text-govGreen">{result.optimized_yield}</b> t/ha</div></div><div className="mt-5 grid gap-2">{result.recommendations.map((r,i)=><div key={i} className="flex gap-2 text-sm"><CheckCircle2 size={17} className="text-govGreen shrink-0"/>{r}</div>)}</div></div>
        </motion.div>}
      </div>
    </div>
    <div className="mt-8 grid sm:grid-cols-3 gap-4">
      {[[Droplets,"Irrigation","Review soil moisture and scheduling"],[Leaf,"Fertilizer","Adjust nutrient application using soil context"],[CalendarDays,"Sowing","Maintain a suitable crop calendar"]].map(([I,h,p])=><div className="bg-white rounded-2xl border p-5" key={h}><I className="text-govGreen"/><h3 className="font-bold mt-3">{h}</h3><p className="text-sm text-gray-600 mt-1">{p}</p></div>)}
    </div>
  </div>
}
