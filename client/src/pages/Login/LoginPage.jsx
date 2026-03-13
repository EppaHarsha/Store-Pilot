import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { authService } from "../../services/authService.js";

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    setError("");

    authService
      .loginUser({ email, password })
      .then((data) => {
        const { token, user } = data;
        if (!token || !user) {
          throw new Error("Invalid login response");
        }
        login(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            role: "Shop Owner"
          },
          token
        );
        navigate("/dashboard", { replace: true });
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please check your details.";
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
            <div className="text-xs text-slate-500">Login to your dashboard</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Email
            </label>
            <input
              className="input-base"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Password
            </label>
            <input
              className="input-base"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting || !email || !password}
            className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
          <p className="text-[11px] text-slate-500">
            This demo login keeps you signed in on this browser until you log out or
            clear your data.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

