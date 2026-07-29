import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import "./Login.css";

// SVG Illustration component matching the reference welcome banner illustration
function WelcomeIllustration() {
  return (
    <svg
      viewBox="0 0 500 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="login-illustration-svg"
    >
      {/* Background Leaves & Botanicals (Blue / Pink accents) */}
      <path
        d="M60 360C30 340 20 280 40 230C60 180 110 160 140 180C160 200 170 260 140 310C110 360 80 370 60 360Z"
        fill="#3B82F6"
        fillOpacity="0.85"
      />
      <path
        d="M90 370C70 350 70 300 90 260C110 220 150 210 170 230C190 250 180 300 160 340C140 380 110 380 90 370Z"
        fill="#2563EB"
      />
      <path
        d="M380 380C420 360 450 310 430 260C410 210 360 190 330 220C300 250 310 310 340 350C370 390 400 390 380 380Z"
        fill="#F43F5E"
        fillOpacity="0.75"
      />
      <path
        d="M340 370C370 350 380 300 360 250C340 200 290 190 270 220C250 250 270 310 300 350C320 380 330 380 340 370Z"
        fill="#1E40AF"
      />

      {/* Balloons Top */}
      <g filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.1))">
        {/* Pink Balloon */}
        <ellipse cx="220" cy="90" rx="20" ry="26" fill="#F43F5E" />
        <path d="M220 116L218 135" stroke="#94A3B8" strokeWidth="1.5" />

        {/* Navy Balloon */}
        <ellipse cx="250" cy="65" rx="22" ry="28" fill="#0F172A" />
        <path d="M250 93L248 130" stroke="#94A3B8" strokeWidth="1.5" />

        {/* Blue Balloon */}
        <ellipse cx="290" cy="75" rx="20" ry="26" fill="#2563EB" />
        <path d="M290 101L285 130" stroke="#94A3B8" strokeWidth="1.5" />
      </g>

      {/* Ribbon "WELCOME" Banner */}
      <path
        d="M120 145 Q 250 200 380 135 C 390 160 370 180 350 185 Q 250 240 140 180 C 125 170 115 155 120 145 Z"
        fill="#FFE4E6"
        stroke="#F43F5E"
        strokeWidth="2.5"
      />
      <svg width="500" height="200">
  <text
    x="180"
    y="190"
    fontSize="32"
    fontWeight="700"
    fill="#1E3A8A"
    fontFamily="Poppins, sans-serif"
  >
    Welcome
  </text>
</svg>

      {/* Male Character (Left) */}
      <g>
        {/* Hair */}
        <path d="M70 150 C 70 130, 95 130, 95 145 C 95 150, 75 160, 70 150 Z" fill="#1E3A8A" />
        {/* Head */}
        <circle cx="85" cy="150" r="14" fill="#FDBA74" />
        {/* Torso Red Shirt */}
        <path d="M65 175 L105 175 L100 230 L70 230 Z" fill="#E11D48" />
        {/* Arms holding ribbon */}
        <path d="M70 180 L130 145" stroke="#FDBA74" strokeWidth="6" strokeLinecap="round" />
        {/* Blue Pants */}
        <path d="M70 230 L50 330 L70 330 L85 260 L95 330 L115 330 L100 230 Z" fill="#2563EB" />
        {/* Shoes */}
        <ellipse cx="55" cy="333" rx="10" ry="4" fill="#0F172A" />
        <ellipse cx="120" cy="333" rx="10" ry="4" fill="#0F172A" />
      </g>

      {/* Female Character (Right) */}
      <g>
        {/* Long Red Hair */}
        <path d="M420 140 C 440 140, 450 190, 430 220 C 410 200, 410 160, 420 140 Z" fill="#E11D48" />
        {/* Head */}
        <circle cx="430" cy="150" r="13" fill="#FDBA74" />
        {/* Dark Blue Dress */}
        <path d="M415 175 Q 430 170 445 175 L455 310 Q 425 320 405 310 Z" fill="#1E3A8A" />
        {/* Arm holding ribbon */}
        <path d="M440 178 L390 135" stroke="#FDBA74" strokeWidth="5.5" strokeLinecap="round" />
        {/* Legs / Shoes */}
        <path d="M420 310 L418 335 M440 310 L442 335" stroke="#FDBA74" strokeWidth="4" />
        <ellipse cx="416" cy="336" rx="6" ry="3" fill="#0F172A" />
        <ellipse cx="444" cy="336" rx="6" ry="3" fill="#0F172A" />
      </g>
    </svg>
  );
}

// Social Icons SVGs
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="login-social-icon">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#1877F2" className="login-social-icon">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#1DA1F2" className="login-social-icon">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Decorative Rings */}
      <div className="login-page-bg-circles" aria-hidden="true">
        <div className="login-bg-circle-1" />
        <div className="login-bg-circle-2" />
      </div>

      {/* Centered Split-Screen Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="login-card"
      >
        {/* Left Side - Welcome Illustration */}
        <div className="login-left-panel">
          <div className="login-illustration-wrapper">
            <WelcomeIllustration />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right-panel">
          <div className="login-header">
            <h1 className="login-title">Login</h1>
            <p className="login-subtitle">Please login to continue</p>
          </div>

          {serverError && (
            <div className="login-alert-error" role="alert">
              {serverError}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="login-field-group">
              <label className="login-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="login-input-wrapper">
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className={`login-input ${errors.email ? "has-error" : ""}`}
                  placeholder="alifemu00@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="login-field-error" id="login-email-error">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="login-field-group">
              <label className="login-label" htmlFor="login-password">
                Password
              </label>
              <div className="login-input-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`login-input ${errors.password ? "has-error" : ""}`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="login-field-error" id="login-password-error">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Options Row: Remember Me & Forgot Password */}
            <div className="login-options-row">
              <label className="login-checkbox-label" htmlFor="login-remember">
                <input
                  id="login-remember"
                  type="checkbox"
                  name="rememberMe"
                  className="login-checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Keep Me Logged In</span>
              </label>

              <Link to="/forgot-password" className="login-forgot-link">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="login-spinner" />
                  <span>Logging In...</span>
                </>
              ) : (
                "LOGIN"
              )}
            </button>

            {/* Social Divider */}
            <div className="login-divider">
              <span>Or Login With</span>
            </div>

            {/* Social Icons Row */}
            <div className="login-social-row">
              <button
                type="button"
                className="login-social-btn"
                aria-label="Login with Facebook"
                title="Login with Facebook"
              >
                <FacebookIcon />
              </button>
              <button
                type="button"
                className="login-social-btn"
                aria-label="Login with Twitter"
                title="Login with Twitter"
              >
                <TwitterIcon />
              </button>
              <button
                type="button"
                className="login-social-btn"
                aria-label="Login with Google"
                title="Login with Google"
              >
                <GoogleIcon />
              </button>
            </div>
          </form>

          {/* Register Redirect Link */}
          <p className="login-footer-text">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="login-register-link">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}