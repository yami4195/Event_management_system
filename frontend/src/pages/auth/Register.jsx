import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import "./AuthForm.css";

const Register = () => {
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

    if (formData.phone && !/^[\d+\-() ]{7,20}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      await register({
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
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
    <div className="auth-page">
      {/* Background Blobs */}
      <div className="auth-page__blob auth-page__blob--1" />
      <div className="auth-page__blob auth-page__blob--2" />
      <div className="auth-page__blob auth-page__blob--3" />

      <div className="auth-card">
        {/* Logo */}
        <Link to="/" className="auth-card__logo">
          <span className="auth-card__logo-icon">⚡</span>
          <span className="auth-card__logo-text">EventFlow</span>
        </Link>

        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__subtitle">
          Join EventFlow and discover amazing events
        </p>

        {/* Server Error */}
        {serverError && (
          <div className="auth-form__alert" id="register-server-error">
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* First & Last Name Row */}
          <div className="auth-form__row">
            <div className="form-group">
              <label className="form-group__label" htmlFor="register-firstname">
                First Name
              </label>
              <input
                id="register-firstname"
                type="text"
                name="firstname"
                className={`form-group__input ${errors.firstname ? "form-group__input--error" : ""}`}
                placeholder="Your name"
                value={formData.firstname}
                onChange={handleChange}
                autoComplete="given-name"
              />
              {errors.firstname && (
                <span className="form-group__error">{errors.firstname}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-group__label" htmlFor="register-lastname">
                Last Name
              </label>
              <input
                id="register-lastname"
                type="text"
                name="lastname"
                className={`form-group__input ${errors.lastname ? "form-group__input--error" : ""}`}
                placeholder="Last name"
                value={formData.lastname}
                onChange={handleChange}
                autoComplete="family-name"
              />
              {errors.lastname && (
                <span className="form-group__error">{errors.lastname}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-group__label" htmlFor="register-email">
              Email Address
            </label>
            <input
              id="register-email"
              type="email"
              name="email"
              className={`form-group__input ${errors.email ? "form-group__input--error" : ""}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && (
              <span className="form-group__error">{errors.email}</span>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-group__label" htmlFor="register-phone">
              Phone Number <span style={{ color: "rgba(255,255,255,0.25)" }}>(optional)</span>
            </label>
            <input
              id="register-phone"
              type="tel"
              name="phone"
              className={`form-group__input ${errors.phone ? "form-group__input--error" : ""}`}
              placeholder="+251 9xxxxxxxx"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            {errors.phone && (
              <span className="form-group__error">{errors.phone}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-group__label" htmlFor="register-password">
              Password
            </label>
            <div className="form-group__input-wrapper">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                className={`form-group__input form-group__input--password ${errors.password ? "form-group__input--error" : ""}`}
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="form-group__toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                id="register-password-toggle"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <span className="form-group__error">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-group__label" htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <div className="form-group__input-wrapper">
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className={`form-group__input form-group__input--password ${errors.confirmPassword ? "form-group__input--error" : ""}`}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="form-group__toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                id="register-confirm-password-toggle"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="form-group__error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Role Select */}
          <div className="form-group">
            <label className="form-group__label" htmlFor="register-role">
              I want to
            </label>
            <select
              id="register-role"
              name="role"
              className="form-group__select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="CUSTOMER">Attend Events</option>
              <option value="ORGANIZER">Organize Events</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-form__submit"
            disabled={isSubmitting}
            id="register-submit-btn"
          >
            {isSubmitting ? (
              <>
                <span className="auth-form__submit-spinner" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{" "}
          <Link to="/login" id="register-login-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;