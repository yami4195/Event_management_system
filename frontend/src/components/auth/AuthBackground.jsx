import "./AuthBackground.css";

export default function AuthBackground() {
  return (
    <div className="auth-bg-abstract" aria-hidden="true">
      {/* 1. Subtle Tech Dot Grid Matrix Pattern */}
      <div className="auth-bg-grid" />

      {/* 2. Multi-color Ambient Mesh Glows to Soften Blue Dominance */}
      <div className="auth-bg-glow auth-glow-cyan" />
      <div className="auth-bg-glow auth-glow-indigo" />
      <div className="auth-bg-glow auth-glow-violet" />
      <div className="auth-bg-glow auth-glow-rose" />
      <div className="auth-bg-glow auth-glow-amber" />

      {/* 3. Floating Glassmorphism Geometric Shapes & Rings */}
      <div className="auth-glass-orb auth-orb-1" />
      <div className="auth-glass-orb auth-orb-2" />
      <div className="auth-glass-ring auth-ring-1" />
      <div className="auth-glass-ring auth-ring-2" />

      {/* 4. Abstract Vector Waves & Modern Light Ribbons */}
      <svg
        className="auth-bg-waves"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Curved smooth flow ribbons */}
        <path
          d="M-100 280 C 250 80, 550 480, 1050 200 C 1280 80, 1450 240, 1600 320"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <path
          d="M-50 620 C 350 780, 750 380, 1150 650 C 1350 740, 1500 580, 1650 520"
          stroke="rgba(56, 189, 248, 0.22)"
          strokeWidth="2"
        />
        <path
          d="M150 -50 C 400 320, 700 180, 1100 520 C 1300 680, 1450 420, 1600 480"
          stroke="rgba(167, 139, 250, 0.18)"
          strokeWidth="1.75"
        />

        {/* Abstract Floating Constellation Dots / Sparkles */}
        <circle cx="180" cy="160" r="3" fill="rgba(255, 255, 255, 0.35)" />
        <circle cx="380" cy="420" r="2" fill="rgba(56, 189, 248, 0.5)" />
        <circle cx="1180" cy="190" r="3.5" fill="rgba(255, 255, 255, 0.4)" />
        <circle cx="960" cy="720" r="2.5" fill="rgba(167, 139, 250, 0.45)" />
        <circle cx="1320" cy="560" r="3" fill="rgba(255, 255, 255, 0.3)" />
        <circle cx="220" cy="740" r="2" fill="rgba(255, 255, 255, 0.25)" />
      </svg>
    </div>
  );
}
