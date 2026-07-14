import { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthForm.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
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

        {isSubmitted ? (
          <>
            <h1 className="auth-card__title">Check Your Email</h1>
            <p className="auth-card__subtitle" style={{ marginBottom: "2rem" }}>
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <Link to="/login" className="btn btn--primary" style={{ width: "100%", justifyContent: "center" }}>
              Back to Login
            </Link>
          </>
        ) : (
          <>
            <h1 className="auth-card__title">Reset Password</h1>
            <p className="auth-card__subtitle">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-group__label" htmlFor="forgot-email">
                  Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  className="form-group__input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-form__submit"
                disabled={isSubmitting || !email}
              >
                {isSubmitting ? (
                  <>
                    <span className="auth-form__submit-spinner" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <p className="auth-card__footer">
              Remember your password?{" "}
              <Link to="/login">Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
