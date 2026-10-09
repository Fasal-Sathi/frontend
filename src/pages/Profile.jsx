import { useAuth } from "../context/AuthContext";
import { UserRound, Sprout, BarChart3 } from "lucide-react";
export default function Profile(){
  const {user}=useAuth();
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12"><h1 className="text-4xl font-extrabold">My Profile</h1><div className="mt-8 grid lg:grid-cols-3 gap-6"><div className="bg-white rounded-3xl border shadow-gov p-7"><div className="h-16 w-16 rounded-full bg-green-50 text-govGreen flex items-center justify-center"><UserRound size={32}/></div><h2 className="mt-5 text-2xl font-extrabold">{user?.name||"Farmer"}</h2><p className="text-gray-500">+91 {user?.phone||"XXXXXXXXXX"}</p></div><div className="lg:col-span-2 grid sm:grid-cols-2 gap-5"><div className="bg-white rounded-3xl border p-7"><Sprout className="text-govGreen"/><h3 className="mt-4 font-bold text-xl">Saved Farms</h3><p className="mt-2 text-gray-600">No farms saved yet.</p></div><div className="bg-white rounded-3xl border p-7"><BarChart3 className="text-govBlue"/><h3 className="mt-4 font-bold text-xl">Prediction History</h3><p className="mt-2 text-gray-600">Your completed predictions will appear here.</p></div></div></div></div>
}
