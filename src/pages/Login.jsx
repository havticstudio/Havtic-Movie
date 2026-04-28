import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        // Handle validation errors or single message
        const errorMessage = data.errors ? data.errors[0].msg : (data.message || "Login failed");
        throw new Error(errorMessage);
      }
      
      // login context now only needs user data, token is in cookie
      login(data.user);
      const from = location.state?.from || "/";
      navigate(from);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <Helmet>
        <title>Login - Havtic Movie</title>
      </Helmet>
      <div className="w-full max-w-md bg-bg-surface p-8 rounded-3xl border border-white/5 shadow-2xl animate-fade-up">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-brand text-xs font-bold transition-colors mb-4">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Welcome <span className="text-brand">Back</span></h1>
          <p className="text-gray-500 text-sm">Login to your account to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-brand/10 border border-brand/20 text-brand text-xs font-bold rounded-xl animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-main text-white px-5 py-4 rounded-xl outline-none border border-white/5 focus:border-brand/50 transition-all placeholder-gray-700"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-main text-white px-5 py-4 rounded-xl outline-none border border-white/5 focus:border-brand/50 transition-all placeholder-gray-700"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between px-1">
             <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                   <input 
                     type="checkbox" 
                     checked={rememberMe}
                     onChange={() => setRememberMe(!rememberMe)}
                     className="sr-only" 
                   />
                   <div className={`w-5 h-5 rounded border transition-all ${rememberMe ? 'bg-brand border-brand' : 'border-white/10 bg-bg-main group-hover:border-white/30'}`}>
                      {rememberMe && (
                        <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                   </div>
                </div>
                <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">Remember me</span>
             </label>
             <button type="button" className="text-xs text-brand font-bold hover:underline">Forgot Password?</button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-hover text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-10 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" state={location.state} className="text-brand font-bold hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
