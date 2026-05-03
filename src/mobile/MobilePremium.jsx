import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";

export default function MobilePremium() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [amount, setAmount] = useState("");
  const [trxId, setTrxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [user, authLoading, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setMessage({ type: "error", text: "Please login first" });
    
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/payment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount, transactionId: trxId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setAmount("");
        setTrxId("");
      } else {
        setMessage({ type: "error", text: data.message || "Submission failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-transparent pt-14 pb-20 relative">
      <Helmet>
        <title>Get Premium</title>
      </Helmet>

      {/* Fixed Page Header */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-bg-main/95 backdrop-blur-xl border-b border-white/5 px-4 pt-4 pb-3">
        <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-brand to-red-400 uppercase tracking-widest text-center">Get Premium</h1>
      </div>

      <div className="pt-16 px-4 mt-6">
        {/* Banner */}
        <div className="bg-gradient-to-br from-brand/40 to-black border border-brand/30 rounded-[2rem] p-6 text-center shadow-2xl shadow-brand/20 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand blur-[60px] opacity-40"></div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter mb-2">PRO</h2>
          <p className="text-gray-300 text-[10px] uppercase tracking-widest font-bold">Unlock 30 days of VIP access</p>
          <div className="mt-4 inline-block bg-white text-black px-4 py-1.5 rounded-full text-xs font-black">
            50 BDT / Month
          </div>
        </div>

        {/* Step 1 */}
        <div className="mb-8">
          <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand/20 text-brand flex items-center justify-center text-[10px]">1</span>
            Send Money via bKash
          </h3>
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center shrink-0">
              <img src="https://www.logo.wine/a/logo/BKash/BKash-Logo.wine.svg" alt="bKash" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Personal Number</p>
              <p className="text-white text-xl font-black tracking-widest">01328117547</p>
            </div>
          </div>
        </div>

        {/* Step 2 Form */}
        <div>
          <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand/20 text-brand flex items-center justify-center text-[10px]">2</span>
            Submit Details
          </h3>
          
          <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-md rounded-3xl p-5 border border-white/10 space-y-4">
            {message.text && (
              <div className={`p-3 rounded-xl text-xs font-bold text-center ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2">Amount Sent (BDT)</label>
              <input
                type="number"
                required
                min="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-bold focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                placeholder="e.g. 50"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2">bKash TrxID</label>
              <input
                type="text"
                required
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-bold focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all uppercase placeholder:normal-case"
                placeholder="Enter Transaction ID"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-brand text-white py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg shadow-brand/20 active:scale-95 transition-transform disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
