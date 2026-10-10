import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, BarChart3, CircleHelp, Mail, ScanLine, Sprout, UserRound } from "lucide-react";

const supportEmail = "support@fasalsathi.gov.in";

export default function Profile() {
  const { user } = useAuth();

  return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <h1 className="text-4xl font-extrabold">My Profile</h1>
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <section className="rounded-3xl border bg-white p-7 shadow-gov">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-govGreen"><UserRound size={32}/></div>
        <h2 className="mt-5 text-2xl font-extrabold">{user?.name || "Farmer"}</h2>
        <p className="text-gray-500">+91 {user?.phone || "XXXXXXXXXX"}</p>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
        <section className="rounded-3xl border bg-white p-7">
          <Sprout className="text-govGreen"/><h3 className="mt-4 text-xl font-bold">Saved Farms</h3>
          <p className="mt-2 text-gray-600">No farms saved yet.</p>
        </section>
        <section className="rounded-3xl border bg-white p-7">
          <BarChart3 className="text-govBlue"/><h3 className="mt-4 text-xl font-bold">Prediction History</h3>
          <p className="mt-2 text-gray-600">Your completed predictions will appear here.</p>
        </section>
        <Link to="/rice-disease-detection" className="group rounded-3xl border border-orange-100 bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-gov sm:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-700"><ScanLine size={23}/></span>
              <h3 className="mt-4 text-xl font-bold">Image Based Plant Disease Detection</h3>
              <p className="mt-2 max-w-xl text-gray-600">Upload a rice leaf photo for image based disease screening.</p>
            </div>
            <ArrowRight className="mt-2 shrink-0 text-orange-700 transition group-hover:translate-x-1" size={21}/>
          </div>
        </Link>
      </div>
    </div>

    <section className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 sm:p-8" aria-labelledby="profile-contact-title">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-govGreen"><CircleHelp size={23}/></span>
        <div className="min-w-0 flex-1">
          <h2 id="profile-contact-title" className="text-2xl font-extrabold">Contact Us</h2>
          <p className="mt-1 text-gray-600">Have a question? Contact our customer care team or visit Help for common questions.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={`mailto:${supportEmail}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-govGreen px-4 py-2 font-bold text-white hover:bg-green-800"><Mail size={18}/> Email Customer Care</a>
            <Link to="/help" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 font-bold text-emerald-900 hover:bg-emerald-50"><CircleHelp size={18}/> Help & FAQ</Link>
          </div>
          <p className="mt-3 break-all text-sm text-gray-600">{supportEmail}</p>
        </div>
      </div>
    </section>
  </div>;
}
