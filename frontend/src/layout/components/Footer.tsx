import React from "react";
import { Link } from "react-router-dom";
import { Recycle, Heart, ShieldCheck, PhoneCall, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-emerald-950/10 bg-slate-50/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-200">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Recycle className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">
                RecycleConnect Myanmar
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Empowering Myanmar households, businesses, and grassroots collectors with direct waste scheduling, fair scrap buybacks, and community eco-rewards.
            </p>
            <div className="text-[11px] text-emerald-800 font-medium bg-emerald-100/60 p-2 rounded-lg inline-block">
              🇲🇲 Supporting Clean Yangon, Mandalay & Nationwide Green Goals
            </div>
          </div>

          {/* Col 2: Citizen Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Citizens & Community
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/request-pickup" className="hover:text-emerald-700 transition-colors">
                  Schedule Free Doorstep Pickup
                </Link>
              </li>
              <li>
                <Link to="/hubs" className="hover:text-emerald-700 transition-colors">
                  Find Nearest 24/7 Drop-off Point
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-700 transition-colors">
                  Check Eco-Points & Kyat Balance
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-emerald-700 transition-colors">
                  Waste Segregation Guide (သန့်ရှင်းစနစ်)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Recyclers & Businesses */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Partners & Collectors
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/services" className="hover:text-emerald-700 transition-colors">
                  Verified Collectors Directory
                </Link>
              </li>
              <li>
                <Link to="/collector" className="hover:text-emerald-700 transition-colors">
                  Collector Dispatch Portal
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-700 transition-colors">
                  Live Scrap Material Buy Rates
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Social Enterprise Upcycling</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Coverage */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Coverage & Support
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Yangon, Mandalay, Bago, Mawlamyine, Taunggyi</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>+95 9 795 888 123 / +95 9 450 098 765</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>support@recycleconnect.mm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} RecycleConnect Myanmar. Community Open Platform.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Environmental MVP Edition</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Recycler Network
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
