import { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";
import ThreeBackground from "../components/ThreeBackground";
import logo from "../assets/havticmovielogo.png";

export default function MobileLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        const errorMessage = data.errors ? data.errors[0].msg : (data.message || "Login failed");
        throw new Error(errorMessage);
      }
      
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
    <div className="min-h-screen bg-bg-main relative overflow-hidden flex flex-col items-center justify-center p-6">
      <Helmet><title>Login - Havtic</title></Helmet>
      
      {/* Background Effect */}
      <ThreeBackground scrollRef={mainRef} />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent z-10" />

      <div ref={mainRef} className="w-full max-w-sm relative z-20 animate-fade-up">
        {/* Logo/Brand Area */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
             <img src={logo} alt="Havtic Movie" className="h-8 object-contain" />
          </Link>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Login to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-brand/10 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-widest rounded-2xl animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-4">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 text-white px-6 py-4 rounded-2xl outline-none border border-white/10 focus:border-brand transition-all text-sm font-bold"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-4">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 text-white px-6 py-4 rounded-2xl outline-none border border-white/10 focus:border-brand transition-all text-sm font-bold"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl shadow-white/10 active:scale-95 transition-all mt-4"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              Don't have an account?{" "}
              <Link to="/signup" className="text-brand ml-1">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
