import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";

export default function MobilePremium() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [amount, setAmount] = useState("100");
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
    <div className="h-full overflow-hidden bg-transparent pt-14 pb-2 relative flex flex-col">
      <Helmet>
        <title>Get Premium</title>
      </Helmet>

      <div className="flex-1 px-4 mt-2 flex flex-col justify-center gap-4">
        {user?.isPremium ? (
          <div className="animate-fade-up space-y-4">
            {/* VIP Active Card */}
            <div className="relative rounded-[2rem] overflow-hidden bg-[#1a0505] border border-brand/30 p-6 text-center shadow-2xl shadow-brand/20">
              {/* Dynamic Glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand blur-[80px] opacity-20"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-brand/10 border border-brand/30 rounded-full flex items-center justify-center mx-auto mb-4">
                   <svg className="w-8 h-8 text-brand" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M5 16L3 5l8.5 5L21 5l-2 11H5zm14 3c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-1h14v1z"/>
                   </svg>
                </div>
                
                <h2 className="text-3xl font-black text-white italic tracking-tighter mb-1 uppercase">
                  VIP <span className="text-brand">MEMBER</span>
                </h2>
                
                <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                  Access active
                </p>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left backdrop-blur-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-500 text-[7px] font-black uppercase tracking-widest">Status</span>
                    <span className="text-green-500 text-[7px] font-black uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                      Verified
                    </span>
                  </div>
                  <p className="text-white text-[10px] font-black uppercase tracking-wider">Unlimited Streaming</p>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-2">
               {[
                 { title: "Ultra HD Quality", icon: "4K" },
                 { title: "No Advertisement", icon: "ADS" },
                 { title: "Premium Sources", icon: "VIP" }
               ].map((f, i) => (
                 <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-[9px] font-black">
                        {f.icon}
                      </div>
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">{f.title}</span>
                    </div>
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Banner */}
            <div className="bg-gradient-to-br from-brand/40 to-black border border-brand/30 rounded-[2rem] p-5 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand blur-[60px] opacity-40"></div>
              <h2 className="text-2xl font-black text-white italic tracking-tighter mb-1">PRO</h2>
              <p className="text-gray-300 text-[9px] uppercase tracking-widest font-bold">VIP Access</p>
              <div className="mt-3 inline-block bg-white text-black px-3 py-1 rounded-full text-[10px] font-black">
                100 BDT FOR 1 MONTH
              </div>
            </div>

            {/* Step 1 */}
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4">
              <div className="w-10 h-10 bg-pink-600/20 rounded-xl flex items-center justify-center shrink-0">
                <img src="https://www.logo.wine/a/logo/BKash/BKash-Logo.wine.svg" alt="bKash" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mb-0.5">Send Money to</p>
                <p className="text-white text-lg font-black tracking-widest">01328117547</p>
              </div>
            </div>

            {/* Step 2 Form */}
            <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-md rounded-[1.5rem] p-4 border border-white/10 space-y-3">
              {message.text && (
                <div className={`p-2 rounded-xl text-[9px] font-bold text-center ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Amount</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-brand transition-all"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 pl-1">TrxID</label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-brand transition-all uppercase"
                    placeholder="ID"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-white py-3 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand/20 active:scale-95 transition-transform disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
