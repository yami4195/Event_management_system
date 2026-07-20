import  { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Calendar, Users, MapPin, Sparkles, Award, ArrowRight, Star,
  Heart, Zap, Globe, ChevronDown
} from "lucide-react";

const colors = {
  bg: "#0a0a0f",
  bgLight: "#12121a",
  bgCard: "#1a1a28",
  primary: "#c9a96e",
  text: "#f0f0f5",
  textMuted: "#8888a0",
  border: "#2a2a3a",
};

const stats = [
  { value: "2+", label: "Events Managed", icon: Calendar },
  { value: "2+", label: "Happy Attendees", icon: Users },
  { value: "10+", label: "Cities Worldwide", icon: MapPin },
  { value: "98%", label: "Client Satisfaction", icon: Star },
];

const services = [
  { icon: Sparkles, title: "Corporate Events", desc: "From product launches to annual galas, we craft experiences that align with your brand vision and business goals." },
  { icon: Heart, title: "Weddings & Celebrations", desc: "Your special day deserves perfection. We handle every detail so you can focus on making memories." },
  { icon: Zap, title: "Conferences & Summits", desc: "Seamless logistics, engaging content, and flawless execution for events that inspire and connect." },
  { icon: Globe, title: "Virtual & Hybrid", desc: "Bridge the physical and digital worlds with immersive hybrid experiences that reach global audiences." },
];

const team = [
  { name: "Yeamlak sisay", role: "Frontend Developer", bio: "3+ years in frontend development, creating responsive and user-friendly interfaces." },
  { name: "Yohannes zewde", role: "Machine Learning Engineer", bio: "3+ years in machine learning and AI, driving data-driven solutions for event management." },
  { name: "Mussie negasi", role: "Laravel Developer", bio: "3+ years in Laravel development, building robust and maintainable event management applications." },
  { name: "yeabsira abesha", role: "Backend Developer", bio: "3+ years in backend development, building scalable and efficient event management systems." },
];

const testimonials = [
  { text: "They turned our product launch into an experience our clients still talk about. Absolutely phenomenal work.", author: "Elena Voss", company: "TechNova Inc." },
  { text: "Our wedding was beyond anything we imagined. Every detail was perfect. We are forever grateful.", author: "David & Priya K.", company: "Private Client" },
  { text: "The hybrid conference they built for us reached 10,000+ attendees globally. Seamless from start to finish.", author: "Robert Chang", company: "Global Summit Series" },
];

const milestones = [
  { year: "2017", title: "Founded", desc: "Started with a dream and a small team of passionate event professionals in New York." },
  { year: "2017", title: "First Major Client", desc: "Landed our first Fortune 500 client, proving our ability to deliver at the highest level." },
  { year: "2019", title: "Global Expansion", desc: "Opened offices in London, Dubai, and Singapore to serve clients worldwide." },
  { year: "2021", title: "Virtual Pioneer", desc: "Pivoted to virtual & hybrid events, developing proprietary tech for immersive digital experiences." },
  { year: "2024", title: "Industry Leader", desc: "Recognized as a top event management firm with 500+ successful events under our belt." },
  { year: "2026", title: "The Future", desc: "Embracing AI-driven personalization and sustainable event practices for the next era." },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["About", "Services", "Team", "Milestones", "Contact"];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 24px",
        background: scrolled ? "rgba(10,10,15,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${colors.border}` : "1px solid transparent",
        transition: "all 0.4s ease",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${colors.primary}, #d4a574)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={20} color={colors.bg} />
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, color: colors.text, letterSpacing: "-0.5px" }}>Event<span style={{ color: colors.primary }}>Horizon</span></span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: colors.textMuted, textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.3s", letterSpacing: "0.5px" }}
              onMouseEnter={(e) => e.target.style.color = colors.primary}
              onMouseLeave={(e) => e.target.style.color = colors.textMuted}
            >{l}</a>
          ))}
          <button style={{
            background: `linear-gradient(135deg, ${colors.primary}, #d4a574)`,
            border: "none", borderRadius: 8, padding: "10px 24px",
            color: colors.bg, fontWeight: 600, fontSize: 14, cursor: "pointer",
            transition: "transform 0.3s, box-shadow 0.3s",
          }}
          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 24px rgba(201,169,110,0.3)`; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
          >Get Started</button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: colors.bgLight, borderTop: `1px solid ${colors.border}`, overflow: "hidden" }}
          >
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {links.map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)}
                  style={{ color: colors.text, textDecoration: "none", fontSize: 16, fontWeight: 500 }}>{l}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]); // Don't fade completely

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", background: colors.bg }}>
      {/* Background Orbs */}
      <div style={{ position: "absolute", top: "10%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,140,200,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* Text content with parallax */}
      <motion.div style={{ y: y1, opacity, textAlign: "center", maxWidth: 900, padding: "0 24px", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 50, border: `1px solid ${colors.border}`, background: "rgba(201,169,110,0.08)", marginBottom: 32 }}
        >
          <Award size={14} color={colors.primary} />
          <span style={{ color: colors.primary, fontSize: 13, fontWeight: 500, letterSpacing: "1px" }}>AWARD-WINNING EVENT MANAGEMENT</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 800, color: colors.text, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 24 }}
        >
          We Don't Just Plan Events.<br />
          <span style={{ background: `linear-gradient(135deg, ${colors.primary}, #e8c99b)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>We Create Memories.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ fontSize: "clamp(16px, 2vw, 20px)", color: colors.textMuted, maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7 }}
        >
          MeetSphere is a full-service event management platform that transforms your vision into extraordinary experiences — from intimate gatherings to global conferences.
        </motion.p>
      </motion.div>

      {/* Buttons - OUTSIDE the fading div so they stay clickable! */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 3, marginTop: 20 }}
      >
        <button style={{
          background: `linear-gradient(135deg, ${colors.primary}, #d4a574)`,
          border: "none", borderRadius: 12, padding: "16px 36px",
          color: colors.bg, fontWeight: 700, fontSize: 16, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8,
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => { 
          e.currentTarget.style.transform = "translateY(-3px)"; 
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(201,169,110,0.35)"; 
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.transform = "translateY(0)"; 
          e.currentTarget.style.boxShadow = "none"; 
        }}
        >Plan Your Event <ArrowRight size={18} /></button>
        
        <button style={{
          background: "transparent", border: `1px solid ${colors.border}`,
          borderRadius: 12, padding: "16px 36px",
          color: colors.text, fontWeight: 600, fontSize: 16, cursor: "pointer",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => { 
          e.currentTarget.style.borderColor = colors.primary; 
          e.currentTarget.style.color = colors.primary; 
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.borderColor = colors.border; 
          e.currentTarget.style.color = colors.text; 
        }}
        >Watch Our Story</button>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
      >
        <span style={{ color: colors.textMuted, fontSize: 12, letterSpacing: "2px" }}>SCROLL</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown size={20} color={colors.textMuted} />
        </motion.div>
      </motion.div>
    </section>
  );
}
function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} style={{ padding: "100px 24px", background: colors.bgLight, position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            style={{
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: "40px 30px",
              textAlign: "center",
              transition: "transform 0.3s, border-color 0.3s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = colors.primary; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = colors.border; }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.05))`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <s.icon size={26} color={colors.primary} />
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, color: colors.text, lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
            <div style={{ fontSize: 15, color: colors.textMuted, fontWeight: 500 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} style={{ padding: "120px 24px", background: colors.bg, position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 50, border: `1px solid ${colors.border}`, marginBottom: 24 }}>
            <Heart size={14} color={colors.primary} />
            <span style={{ color: colors.primary, fontSize: 12, fontWeight: 600, letterSpacing: "1.5px" }}>OUR STORY</span>
          </div>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: colors.text, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1px" }}>
            Crafting Unforgettable Experiences Since <span style={{ color: colors.primary }}>2015</span>
          </h2>
          <p style={{ color: colors.textMuted, fontSize: 17, lineHeight: 1.8, marginBottom: 20 }}>
            EventHorizon was born from a simple belief: every gathering has the potential to be transformative. What started as a small team of passionate planners in New York has grown into a global force in event management.
          </p>
          <p style={{ color: colors.textMuted, fontSize: 17, lineHeight: 1.8, marginBottom: 32 }}>
            We combine creative vision with military-grade logistics to deliver events that don't just meet expectations — they redefine them.
          </p>
          <div style={{ display: "flex", gap: 40 }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, color: colors.primary, lineHeight: 1 }}>11</div>
              <div style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>Years of Excellence</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, color: colors.primary, lineHeight: 1 }}>4</div>
              <div style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>Global Offices</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, color: colors.primary, lineHeight: 1 }}>50+</div>
              <div style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>Team Members</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: "relative" }}
        >
          <div style={{
            width: "100%", aspectRatio: "4/5", borderRadius: 24,
            background: `linear-gradient(135deg, ${colors.bgCard}, ${colors.bgLight})`,
            border: `1px solid ${colors.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(201,169,110,0.1) 0%, transparent 60%)" }} />
            <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
              <Sparkles size={64} color={colors.primary} style={{ marginBottom: 20, opacity: 0.6 }} />
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.text, marginBottom: 8 }}>EventHorizon</div>
              <div style={{ fontSize: 14, color: colors.textMuted }}>Where Vision Meets Execution</div>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{
              position: "absolute", bottom: -30, left: -30,
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: "20px 24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${colors.primary}, #d4a574)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Star size={22} color={colors.bg} fill={colors.bg} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>4.9/5</div>
                <div style={{ fontSize: 13, color: colors.textMuted }}>Client Rating</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} style={{ padding: "120px 24px", background: colors.bgLight }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 50, border: `1px solid ${colors.border}`, marginBottom: 20 }}>
            <Zap size={14} color={colors.primary} />
            <span style={{ color: colors.primary, fontSize: 12, fontWeight: 600, letterSpacing: "1.5px" }}>WHAT WE DO</span>
          </div>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: colors.text, lineHeight: 1.1, letterSpacing: "-1px" }}>
            Services Tailored to <span style={{ color: colors.primary }}>Your Vision</span>
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: "40px 32px",
                transition: "all 0.4s ease",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = `0 20px 50px rgba(201,169,110,0.1)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ width: 60, height: 60, borderRadius: 16, background: `linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.05))`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <s.icon size={28} color={colors.primary} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: colors.text, marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: colors.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
              <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 6, color: colors.primary, fontSize: 14, fontWeight: 600 }}>
                Learn more <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="team" ref={ref} style={{ padding: "120px 24px", background: colors.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 50, border: `1px solid ${colors.border}`, marginBottom: 20 }}>
            <Users size={14} color={colors.primary} />
            <span style={{ color: colors.primary, fontSize: 12, fontWeight: 600, letterSpacing: "1.5px" }}>THE TEAM</span>
          </div>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: colors.text, lineHeight: 1.1, letterSpacing: "-1px" }}>
            Meet the <span style={{ color: colors.primary }}>Visionaries</span>
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {team.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: "32px",
                textAlign: "center",
                transition: "all 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
                e.currentTarget.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ width: 100, height: 100, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.primary}, #d4a574)`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, color: colors.bg }}>
                {t.name.charAt(0)}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 4 }}>{t.name}</h3>
              <div style={{ fontSize: 14, color: colors.primary, fontWeight: 600, marginBottom: 16 }}>{t.role}</div>
              <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>{t.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Milestones() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="milestones" ref={ref} style={{ padding: "120px 24px", background: colors.bgLight }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 50, border: `1px solid ${colors.border}`, marginBottom: 20 }}>
            <Calendar size={14} color={colors.primary} />
            <span style={{ color: colors.primary, fontSize: 12, fontWeight: 600, letterSpacing: "1.5px" }}>OUR JOURNEY</span>
          </div>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: colors.text, lineHeight: 1.1, letterSpacing: "-1px" }}>
            A Timeline of <span style={{ color: colors.primary }}>Excellence</span>
          </h2>
        </motion.div>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${colors.primary}, transparent)`, transform: "translateX(-50%)", opacity: 0.3 }} />

          {milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                display: "flex",
                justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                marginBottom: 48,
                position: "relative",
                paddingLeft: i % 2 === 0 ? 0 : "50%",
                paddingRight: i % 2 === 0 ? "50%" : 0,
              }}
            >
              <div style={{
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: 16,
                padding: "28px 32px",
                maxWidth: 420,
                width: "100%",
                position: "relative",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.primary}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.border}
              >
                <div style={{
                  position: "absolute",
                  top: "50%",
                  [i % 2 === 0 ? "right" : "left"]: -28,
                  width: 16, height: 16, borderRadius: "50%",
                  background: colors.primary,
                  border: `3px solid ${colors.bgLight}`,
                  transform: "translateY(-50%)",
                  boxShadow: `0 0 20px rgba(201,169,110,0.4)`,
                }} />

                <div style={{ fontSize: 14, fontWeight: 700, color: colors.primary, marginBottom: 8, letterSpacing: "1px" }}>{m.year}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>{m.title}</h3>
                <p style={{ fontSize: 15, color: colors.textMuted, lineHeight: 1.7 }}>{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);

  return (
    <section ref={ref} style={{ padding: "120px 24px", background: colors.bg }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 48 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 50, border: `1px solid ${colors.border}`, marginBottom: 20 }}>
            <Star size={14} color={colors.primary} />
            <span style={{ color: colors.primary, fontSize: 12, fontWeight: 600, letterSpacing: "1.5px" }}>TESTIMONIALS</span>
          </div>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: colors.text, lineHeight: 1.1, letterSpacing: "-1px" }}>
            What Our <span style={{ color: colors.primary }}>Clients Say</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
            borderRadius: 24,
            padding: "48px 40px",
            position: "relative",
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ fontSize: 60, color: colors.primary, opacity: 0.3, lineHeight: 1, marginBottom: 16, fontFamily: "serif" }}>"</div>
              <p style={{ fontSize: "clamp(18px, 2.5vw, 24px)", color: colors.text, lineHeight: 1.7, fontStyle: "italic", marginBottom: 32 }}>
                {testimonials[active].text}
              </p>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>{testimonials[active].author}</div>
                <div style={{ fontSize: 14, color: colors.textMuted }}>{testimonials[active].company}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 32 }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width: 10, height: 10, borderRadius: "50%",
                  border: "none", cursor: "pointer",
                  background: i === active ? colors.primary : colors.border,
                  transition: "all 0.3s",
                  transform: i === active ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" ref={ref} style={{ padding: "120px 24px", background: colors.bgLight, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,140,200,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}
      >
        <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: colors.text, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1.5px" }}>
          Ready to Create Something <span style={{ color: colors.primary }}>Extraordinary?</span>
        </h2>
        <p style={{ fontSize: 18, color: colors.textMuted, lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
          Let's discuss your next event. Whether it's a corporate summit, a dream wedding, or a virtual conference — we're here to make it unforgettable.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            background: `linear-gradient(135deg, ${colors.primary}, #d4a574)`,
            border: "none", borderRadius: 14, padding: "18px 44px",
            color: colors.bg, fontWeight: 700, fontSize: 17, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = `0 16px 40px rgba(201,169,110,0.35)`; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
          >Start Planning <ArrowRight size={20} /></button>
          <button style={{
            background: "transparent", border: `1px solid ${colors.border}`,
            borderRadius: 14, padding: "18px 44px",
            color: colors.text, fontWeight: 600, fontSize: 17, cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => { e.target.style.borderColor = colors.primary; e.target.style.color = colors.primary; }}
          onMouseLeave={(e) => { e.target.style.borderColor = colors.border; e.target.style.color = colors.text; }}
          >View Our Portfolio</button>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: colors.bg, borderTop: `1px solid ${colors.border}`, padding: "60px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${colors.primary}, #d4a574)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={20} color={colors.bg} />
              </div>
              <span style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>Event<span style={{ color: colors.primary }}>Horizon</span></span>
            </div>
            <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.7, maxWidth: 320 }}>
              Transforming visions into extraordinary experiences since 2015. Your trusted partner for events that leave a lasting impression.
            </p>
          </div>

          <div>
            <h4 style={{ color: colors.text, fontSize: 14, fontWeight: 700, marginBottom: 20, letterSpacing: "1px" }}>COMPANY</h4>
            {["About Us", "Our Team", "Careers", "Press"].map((item) => (
              <a key={item} href="#" style={{ display: "block", color: colors.textMuted, textDecoration: "none", fontSize: 14, marginBottom: 12, transition: "color 0.3s" }}
                onMouseEnter={(e) => e.target.style.color = colors.primary}
                onMouseLeave={(e) => e.target.style.color = colors.textMuted}
              >{item}</a>
            ))}
          </div>

          <div>
            <h4 style={{ color: colors.text, fontSize: 14, fontWeight: 700, marginBottom: 20, letterSpacing: "1px" }}>SERVICES</h4>
            {["Corporate Events", "Weddings", "Conferences", "Virtual Events"].map((item) => (
              <a key={item} href="#" style={{ display: "block", color: colors.textMuted, textDecoration: "none", fontSize: 14, marginBottom: 12, transition: "color 0.3s" }}
                onMouseEnter={(e) => e.target.style.color = colors.primary}
                onMouseLeave={(e) => e.target.style.color = colors.textMuted}
              >{item}</a>
            ))}
          </div>

          <div>
            <h4 style={{ color: colors.text, fontSize: 14, fontWeight: 700, marginBottom: 20, letterSpacing: "1px" }}>CONTACT</h4>
            {["hello@eventhorizon.com", "+1 (555) 234-5678", "New York, NY"].map((item) => (
              <div key={item} style={{ color: colors.textMuted, fontSize: 14, marginBottom: 12 }}>{item}</div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ color: colors.textMuted, fontSize: 13 }}>© 2026 EventHorizon. All rights reserved.</div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service", "Cookies"].map((item) => (
              <a key={item} href="#" style={{ color: colors.textMuted, textDecoration: "none", fontSize: 13, transition: "color 0.3s" }}
                onMouseEnter={(e) => e.target.style.color = colors.primary}
                onMouseLeave={(e) => e.target.style.color = colors.textMuted}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function AboutUs() {
  return (
    <div style={{ background: colors.bg, minHeight: "100vh", color: colors.text, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Navbar />
      <Hero />
      <Stats />
      <AboutSection />
      <Services />
      <Team />
      <Milestones />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}