import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, CheckCircle2, Globe, Share2, MessageCircle, Mail, Zap } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200">
      {/* Newsletter Banner */}
      <div className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-3 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                <Zap className="w-3 h-3" />
                Newsletter
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Stay in the loop
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Get weekly updates on trending events, exclusive discounts, and organizer tips delivered to your inbox.
              </p>
            </div>

            <div className="w-full max-w-md lg:shrink-0">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0"
                >
                  <Send className="h-4 w-4" />
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-600 animate-in fade-in slide-in-from-top-1 duration-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Thanks for subscribing! Check your inbox soon.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-5 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-blue-200 transition-shadow">
                EF
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">EventFlow</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              The modern event management platform designed to help organizers host unforgettable summits, concerts, and meetups with real-time analytics and QR check-ins.
            </p>
            <div className="flex items-center gap-2">
              {[
                { icon: Globe, label: "Global" },
                { icon: Share2, label: "Share" },
                { icon: MessageCircle, label: "Community" },
                { icon: Mail, label: "Email" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Contact", "Careers", "Press & Media"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "About Us" ? "/about" : item === "Contact" ? "/contact" : "#"}
                    className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Platform</h4>
            <ul className="space-y-3">
              {[
                { label: "All Events", to: "/events" },
                { label: "Categories", to: "/events?category=Technology" },
                { label: "Create Event", to: "/register" },
                { label: "Sign In", to: "/login" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Support & Legal</h4>
            <ul className="space-y-3">
              {["Help Center", "Privacy Policy", "Terms of Service", "Security & Trust"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} EventFlow Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}