import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/authService.js";

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shopName, setShopName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name || !email || !phone || !shopName || !password) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    authService
      .signupUser({ name, email, phone, shopName, password })
      .then(() => {
        setSuccess("Account created successfully. You can now log in.");
        setTimeout(() => navigate("/login", { replace: true }), 600);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Signup failed. Please try again.";
        setError(message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
            SP
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Store Pilot</div>
            <div className="text-xs text-slate-500">Create your account</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Full name</label>
            <input
              className="input-base"
              placeholder="Sathvik Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Email</label>
            <input
              className="input-base"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Phone</label>
            <input
              className="input-base"
              type="tel"
              placeholder="10-digit mobile"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Shop Name</label>
            <input
              className="input-base"
              placeholder="Sai Tailors"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Password</label>
            <input
              className="input-base"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !name || !email || !phone || !shopName || !password}
            className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-slate-700 hover:text-slate-900">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

