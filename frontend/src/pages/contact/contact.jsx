import  { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Send, MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle,
  Sparkles, User, MessageSquare,  CalendarDays
} from "lucide-react";

const colors = {
  bg: "#0a0a0f",
  bgLight: "#12121a",
  bgCard: "#1a1a28",
  bgInput: "#151520",
  primary: "#c9a96e",
  primaryHover: "#d4b87a",
  text: "#f0f0f5",
  textMuted: "#8888a0",
  border: "#2a2a3a",
  borderFocus: "#c9a96e",
  success: "#4ade80",
  error: "#f87171",
};

const contactInfo = [
  { icon: MapPin, title: "Visit Us", lines: ["Ras gobena damtew Avenue, Stadium", "Addis Ababa, Ethiopia"] },
  { icon: Phone, title: "Call Us", lines: ["+251 939208663", "+251 714578127"] },
  { icon: Mail, title: "Email Us", lines: ["yamlaksisay419@gmail.com", "yeamlaksisay420@gmail.com"] },
  { icon: Clock, title: "Office Hours", lines: ["Mon - Fri: 8:00 AM - 5:00 PM", "Sat: 10:00 AM - 2:00 PM"] },
];





// ═══════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════

function Navbar() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 24px", background: "rgba(10,10,15,0.95)",
      backdropFilter: "blur(20px)", borderBottom: `1px solid ${colors.border}`
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${colors.primary}, #d4a574)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={20} color={colors.bg} />
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, color: colors.text, letterSpacing: "-0.5px" }}>
            Event<span style={{ color: colors.primary }}>Horizon</span>
          </span>
        </div>
        <a href="/" style={{ color: colors.textMuted, textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.3s" }}
          onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
          onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}
        >← Back to Home</a>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════

function Hero() {
  return (
    <section style={{
      position: "relative", minHeight: "60vh", display: "flex",
      alignItems: "center", justifyContent: "center", overflow: "hidden",
      background: colors.bg, paddingTop: 72
    }}>
      <div style={{ position: "absolute", top: "20%", left: "15%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,140,200,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ textAlign: "center", maxWidth: 800, padding: "0 24px", position: "relative", zIndex: 2 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 50, border: `1px solid ${colors.border}`, background: "rgba(201,169,110,0.08)", marginBottom: 28 }}>
          <MessageSquare size={14} color={colors.primary} />
          <span style={{ color: colors.primary, fontSize: 13, fontWeight: 500, letterSpacing: "1px" }}>GET IN TOUCH</span>
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, color: colors.text, lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 20 }}>
          Let's Plan Your <span style={{ background: `linear-gradient(135deg, ${colors.primary}, #e8c99b)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Next Event</span>
        </h1>
        <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: colors.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Have an event in mind? <a href="/register" style={{ color: colors.primary, textDecoration: "underline" }}>Register</a> or fill out the form below and our team will get back to you within 24 hours.
        </p>
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONTACT INFO CARDS
// ═══════════════════════════════════════════════════════════════

function ContactInfo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ padding: "80px 24px", background: colors.bgLight }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
        {contactInfo.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              background: colors.bgCard, border: `1px solid ${colors.border}`,
              borderRadius: 20, padding: "32px 28px", transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.primary; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.05))`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <item.icon size={24} color={colors.primary} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 10 }}>{item.title}</h3>
            {item.lines.map((line, j) => (
              <p key={j} style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6, marginBottom: j === 0 ? 4 : 0 }}>{line}</p>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════════════════════════

function ContactForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    eventType: "", budget: "", eventDate: "", message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const name = e.target.name;
    setFormData({ ...formData, [name]: e.target.value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.eventType) newErrors.eventType = "Please select an event type";
    if (!formData.message.trim()) newErrors.message = "Please tell us about your event";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const inputStyle = (fieldName) => ({
    width: "100%", background: colors.bgInput,
    border: `1.5px solid ${errors[fieldName] ? colors.error : focusedField === fieldName ? colors.borderFocus : colors.border}`,
    borderRadius: 12, padding: "14px 16px", color: colors.text,
    fontSize: 15, outline: "none", transition: "all 0.3s ease", fontFamily: "inherit",
  });

  const labelStyle = {
    display: "block", fontSize: 13, fontWeight: 600,
    color: colors.textMuted, marginBottom: 8, letterSpacing: "0.5px", textTransform: "uppercase",
  };

  return (
    <section ref={ref} style={{ padding: "100px 24px", background: colors.bg }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 50, border: `1px solid ${colors.border}`, marginBottom: 20 }}>
            <Send size={14} color={colors.primary} />
            <span style={{ color: colors.primary, fontSize: 12, fontWeight: 600, letterSpacing: "1.5px" }}>SEND A MESSAGE</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: colors.text, lineHeight: 1.1, letterSpacing: "-1px" }}>
            Tell Us About Your <span style={{ color: colors.primary }}>Event</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }} style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 24, padding: "48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />

          <AnimatePresence>
            {submitted && (
              <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} style={{ background: "rgba(74, 222, 128, 0.08)", border: `1px solid ${colors.success}`, borderRadius: 16, padding: "20px 24px", marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle size={22} color={colors.success} />
                <div>
                  <div style={{ fontWeight: 700, color: colors.success, fontSize: 15 }}>Message Sent Successfully!</div>
                  <div style={{ color: colors.textMuted, fontSize: 13, marginTop: 2 }}>Our team will contact you within 24 hours.</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            {/* Name Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}><User size={12} style={{ marginRight: 6, verticalAlign: "middle" }} />First Name *</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} onFocus={() => setFocusedField("firstName")} onBlur={() => setFocusedField(null)} placeholder="Yeamlak" style={inputStyle("firstName")} />
                {errors.firstName && <span style={{ color: colors.error, fontSize: 12, marginTop: 6, display: "block" }}><AlertCircle size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />{errors.firstName}</span>}
              </div>
              <div>
                <label style={labelStyle}><User size={12} style={{ marginRight: 6, verticalAlign: "middle" }} />Last Name *</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} onFocus={() => setFocusedField("lastName")} onBlur={() => setFocusedField(null)} placeholder="Sisay" style={inputStyle("lastName")} />
                {errors.lastName && <span style={{ color: colors.error, fontSize: 12, marginTop: 6, display: "block" }}><AlertCircle size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />{errors.lastName}</span>}
              </div>
            </div>

            {/* Email & Phone Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}><Mail size={12} style={{ marginRight: 6, verticalAlign: "middle" }} />Email *</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} placeholder="yeamlaksisay@gmail.com" style={inputStyle("email")} />
                {errors.email && <span style={{ color: colors.error, fontSize: 12, marginTop: 6, display: "block" }}><AlertCircle size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />{errors.email}</span>}
              </div>
              <div>
                <label style={labelStyle}><Phone size={12} style={{ marginRight: 6, verticalAlign: "middle" }} />Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)} placeholder="+251939208663" style={inputStyle("phone")} />
              </div>
            </div>

            
              <div>
                <label style={labelStyle}><CalendarDays size={12} style={{ marginRight: 6, verticalAlign: "middle" }} />Event Date</label>
                <input name="eventDate" type="date" value={formData.eventDate} onChange={handleChange} onFocus={() => setFocusedField("eventDate")} onBlur={() => setFocusedField(null)} style={{ ...inputStyle("eventDate"), colorScheme: "dark" ,width: "50%"}} />
              </div>
            

            {/* Message */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}><MessageSquare size={12} style={{ marginRight: 6, verticalAlign: "middle" }} />Tell Us About Your Event *</label>
              <textarea name="message" value={formData.message} onChange={handleChange} onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)} placeholder="Describe your vision, expected guests, venue preferences, or any special requirements..." rows={5} style={{ ...inputStyle("message"), resize: "vertical", minHeight: 120, lineHeight: 1.6 }} />
              {errors.message && <span style={{ color: colors.error, fontSize: 12, marginTop: 6, display: "block" }}><AlertCircle size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />{errors.message}</span>}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, #d4a574)`,
                border: "none", borderRadius: 14, padding: "16px 48px",
                color: colors.bg, fontWeight: 700, fontSize: 16, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 10,
                boxShadow: "0 8px 24px rgba(201,169,110,0.25)",
                transition: "box-shadow 0.3s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 12px 32px rgba(201,169,110,0.4)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(201,169,110,0.25)"}
            >
              <Send size={18} />
              Send Message
              
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAP SECTION
// ═══════════════════════════════════════════════════════════════

function MapSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ padding: "0 24px 100px", background: colors.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 50, border: `1px solid ${colors.border}`, marginBottom: 16 }}>
            <MapPin size={14} color={colors.primary} />
            <span style={{ color: colors.primary, fontSize: 12, fontWeight: 600, letterSpacing: "1.5px" }}>FIND US</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: colors.text, lineHeight: 1.1, letterSpacing: "-1px" }}>
            Our <span style={{ color: colors.primary }}>Location</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }} style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 24, overflow: "hidden", height: 400, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${colors.bgCard}, ${colors.bgLight})` }} />
          <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
            <MapPin size={48} color={colors.primary} style={{ marginBottom: 16, opacity: 0.7 }} />
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>EventHorizon Headquarters</div>
            <div style={{ fontSize: 15, color: colors.textMuted, marginBottom: 20 }}>Ras gobena damtew Avenue, Stadium Addis Ababa, Ethiopia</div>
            <a href="https://maps.google.com/?q=Addis+Ababa" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: "transparent", border: `1px solid ${colors.primary}`, borderRadius: 12, color: colors.primary, fontWeight: 600, fontSize: 14, textDecoration: "none", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = colors.primary; e.currentTarget.style.color = colors.bg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = colors.primary; }}
            >
              <MapPin size={16} /> Open in Google Maps
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════

function Footer() {
  return (
    <footer style={{ background: colors.bg, borderTop: `1px solid ${colors.border}`, padding: "40px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${colors.primary}, #d4a574)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={16} color={colors.bg} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>
<span style={{ color: colors.primary }}>MeetSphere
</span></span>
        </div>
        
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════

export default function ContactUs() {
  return (
    <div style={{ background: colors.bg, minHeight: "100vh", color: colors.text, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Navbar />
      <Hero />
      <ContactInfo />
      <ContactForm />
      <MapSection />
      <Footer />
    </div>
  );
}