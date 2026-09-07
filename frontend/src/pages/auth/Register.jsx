import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Phone, Lock, UserCheck } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import AuthBackground from "../../components/auth/AuthBackground";
import "./Register.css";

// Social Icons SVGs
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="register-social-icon">
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
    <svg viewBox="0 0 24 24" fill="#1877F2" className="register-social-icon">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#1DA1F2" className="register-social-icon">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const cleanedPhone = formData.phone.trim().replace(/[\s-]/g, "");
      const normalized = cleanedPhone.startsWith("09")
        ? "+251" + cleanedPhone.substring(1)
        : cleanedPhone;
      if (!/^\+2519\d{8}$/.test(normalized)) {
        newErrors.phone = "Enter a valid Ethiopian phone number (e.g. 0912345678)";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const pwdErrors = [];
      if (formData.password.length < 8) pwdErrors.push("at least 8 characters");
      if (!/[A-Z]/.test(formData.password)) pwdErrors.push("one uppercase letter");
      if (!/[a-z]/.test(formData.password)) pwdErrors.push("one lowercase letter");
      if (!/\d/.test(formData.password)) pwdErrors.push("one number");
      if (!/[@$!%*?&.#_-]/.test(formData.password)) pwdErrors.push("one special character (@$!%*?&.#_-)");
      if (pwdErrors.length > 0) {
        newErrors.password = `Password must contain ${pwdErrors.join(", ")}.`;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const cleanedPhone = formData.phone.trim().replace(/[\s-]/g, "");
      const normalizedPhone = cleanedPhone.startsWith("09")
        ? "+251" + cleanedPhone.substring(1)
        : cleanedPhone;

      await register({
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim(),
        phone: normalizedPhone,
        password: formData.password,
        role: formData.role,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      {/* Abstract Ambient Background System */}
      <AuthBackground />

      {/* Centered Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="register-card-centered"
      >
        {/* Brand Header */}
        <div className="register-brand-header">
          <Link to="/" className="register-brand-logo">
            <span className="register-brand-icon">⚡</span>
            <span className="register-brand-name">EventFlow</span>
          </Link>
        </div>

        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">
            Join EventFlow and discover amazing events
          </p>
        </div>

        {serverError && (
          <div className="register-alert-error" role="alert">
            {serverError}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          {/* First Name & Last Name Row */}
          <div className="register-name-row">
            <div className="register-field-group">
              <label className="register-label" htmlFor="register-firstname">
                First Name
              </label>
              <div className="register-input-wrapper">
                <User className="register-input-icon" />
                <input
                  id="register-firstname"
                  type="text"
                  name="firstname"
                  className={`register-input ${errors.firstname ? "has-error" : ""}`}
                  placeholder="First name"
                  value={formData.firstname}
                  onChange={handleChange}
                  autoComplete="given-name"
                />
              </div>
              {errors.firstname && (
                <span className="register-field-error">{errors.firstname}</span>
              )}
            </div>

            <div className="register-field-group">
              <label className="register-label" htmlFor="register-lastname">
                Last Name
              </label>
              <div className="register-input-wrapper">
                <User className="register-input-icon" />
                <input
                  id="register-lastname"
                  type="text"
                  name="lastname"
                  className={`register-input ${errors.lastname ? "has-error" : ""}`}
                  placeholder="Last name"
                  value={formData.lastname}
                  onChange={handleChange}
                  autoComplete="family-name"
                />
              </div>
              {errors.lastname && (
                <span className="register-field-error">{errors.lastname}</span>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div className="register-field-group">
            <label className="register-label" htmlFor="register-email">
              Email Address
            </label>
            <div className="register-input-wrapper">
              <Mail className="register-input-icon" />
              <input
                id="register-email"
                type="email"
                name="email"
                className={`register-input ${errors.email ? "has-error" : ""}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="register-field-error">{errors.email}</span>
            )}
          </div>

          {/* Phone Number */}
          <div className="register-field-group">
            <label className="register-label" htmlFor="register-phone">
              Phone Number
            </label>
            <div className="register-input-wrapper">
              <Phone className="register-input-icon" />
              <input
                id="register-phone"
                type="tel"
                name="phone"
                className={`register-input ${errors.phone ? "has-error" : ""}`}
                placeholder="0912345678"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>
            {errors.phone && (
              <span className="register-field-error">{errors.phone}</span>
            )}
          </div>

          {/* Password */}
          <div className="register-field-group">
            <label className="register-label" htmlFor="register-password">
              Password
            </label>
            <div className="register-input-wrapper">
              <Lock className="register-input-icon" />
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                className={`register-input ${errors.password ? "has-error" : ""}`}
                placeholder="Min. 8 chars (upper, lower, num, symbol)"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="register-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="register-field-error">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="register-field-group">
            <label className="register-label" htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <div className="register-input-wrapper">
              <Lock className="register-input-icon" />
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className={`register-input ${errors.confirmPassword ? "has-error" : ""}`}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="register-toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="register-field-error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Account Role Selector */}
          <div className="register-field-group">
            <label className="register-label" htmlFor="register-role">
              I want to
            </label>
            <div className="register-input-wrapper">
              <UserCheck className="register-input-icon" />
              <select
                id="register-role"
                name="role"
                className="register-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="CUSTOMER">Attend Events</option>
                <option value="ORGANIZER">Organize & Host Events</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="register-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="register-spinner" />
                <span>Creating Account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Social Divider */}
          <div className="register-divider">
            <span>Or sign up with</span>
          </div>

          {/* Social Buttons Row */}
          <div className="register-social-row">
            <button
              type="button"
              className="register-social-btn"
              aria-label="Sign up with Google"
              title="Sign up with Google"
            >
              <GoogleIcon />
            </button>
            <button
              type="button"
              className="register-social-btn"
              aria-label="Sign up with Facebook"
              title="Sign up with Facebook"
            >
              <FacebookIcon />
            </button>
            <button
              type="button"
              className="register-social-btn"
              aria-label="Sign up with Twitter"
              title="Sign up with Twitter"
            >
              <TwitterIcon />
            </button>
          </div>
        </form>

        {/* Login Redirect Footer Link */}
        <p className="register-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="register-login-link">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}