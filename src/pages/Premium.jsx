import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/TopBar";

export default function Premium() {
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

  if (authLoading) return <div className="min-h-screen bg-bg-main flex items-center justify-center text-white">Loading...</div>;
  if (!user) return null; // Will redirect via useEffect

  return (
    <div className="min-h-screen bg-bg-main">
      <Helmet>
        <title>Premium Membership - Havtic Movie</title>
      </Helmet>

      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-down">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Unlock <span className="text-brand italic">Premium</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Get early access to latest movies, ad-free streaming, and support our community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Instructions Card */}
          <div className="bg-bg-surface p-8 rounded-3xl border border-white/5 shadow-2xl animate-fade-right">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center text-sm font-black">1</span>
              Payment Instructions
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-pink-600/10 flex items-center justify-center">
                   <img src="https://www.logo.wine/a/logo/BKash/BKash-Logo.wine.svg" alt="bKash" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <p className="text-white font-bold mb-1">bKash (Personal)</p>
                  <p className="text-brand text-2xl font-black tracking-widest">01328117547</p>
                </div>
              </div>

              <div className="bg-bg-main/50 p-4 rounded-2xl border border-white/5 space-y-3">
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                  Open your bKash app or dial *247#
                </p>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                  Choose <strong>"Send Money"</strong> option
                </p>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                  Enter number: <strong>01328117547</strong>
                </p>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                  Enter amount (Min. 100 BDT)
                </p>
              </div>

              <div className="p-4 bg-brand/5 rounded-xl border border-brand/10">
                <p className="text-xs text-brand leading-relaxed">
                  <strong>Note:</strong> After successful payment, copy the <strong>Transaction ID (TrxID)</strong> and paste it into the form on the right.
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-bg-surface p-8 rounded-3xl border border-white/5 shadow-2xl animate-fade-left">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center text-sm font-black">2</span>
              Submit Details
            </h2>

            {message.text && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-bold animate-shake ${
                message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-500' : 'bg-brand/10 border border-brand/20 text-brand'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Paid Amount (BDT)</label>
                <input
                  type="number"
                  required
                  min="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-bg-main text-white px-5 py-4 rounded-xl outline-none border border-white/5 focus:border-brand/50 transition-all placeholder-gray-700"
                  placeholder="e.g. 500"
                />
              </div>

              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Transaction ID (TrxID)</label>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full bg-bg-main text-white px-5 py-4 rounded-xl outline-none border border-white/5 focus:border-brand/50 transition-all placeholder-gray-700"
                  placeholder="e.g. AR98B2X1L"
                />
              </div>

              <div className="pt-2">
                {user?.isPremium ? (
                   <div className="w-full bg-green-500/20 text-green-500 font-black uppercase tracking-widest py-4 rounded-xl text-center border border-green-500/30">
                      Already Premium ✨
                   </div>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !user}
                    className="w-full bg-brand hover:bg-brand-hover text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : (user ? "Submit Payment" : "Login to Pay")}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up">
           {[
             { title: "No Ads", desc: "Enjoy uninterrupted streaming without any advertisements.", icon: "🚫" },
             { title: "Early Access", desc: "Watch newly released movies before anyone else.", icon: "🚀" },
             { title: "HD Streaming", desc: "Access the highest quality available for all content.", icon: "💎" }
           ].map((item, i) => (
             <div key={i} className="bg-bg-surface/50 p-6 rounded-2xl border border-white/5 hover:border-brand/30 transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
