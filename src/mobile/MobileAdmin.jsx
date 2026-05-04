import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MobileAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, pending, premium

  const [dashboardData, setDashboardData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/");
      return;
    }
    if (user && user.isAdmin) {
      fetchDashboardData();
      fetchPayments();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/user/admin/dashboard", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/user/admin/payments", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      } else {
        setError("Failed to fetch payments");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, paymentId) => {
    try {
      const res = await fetch("/api/user/admin/payment/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, paymentId }),
      });

      if (res.ok) {
        setPayments((prev) => prev.filter((p) => p.paymentId !== paymentId));
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevoke = async (userId) => {
    try {
      const res = await fetch("/api/user/admin/premium/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Loading Dashboard</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-transparent pt-14 pb-10">
      <Helmet>
        <title>Admin Panel</title>
      </Helmet>

      {/* Header */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-bg-main/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center h-[56px]">
        <h1 className="text-lg font-black text-white uppercase tracking-widest">Admin Panel</h1>
      </div>

      <div className="pt-20 px-4">
        {/* TAB BUTTONS */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
          {[
            { id: "dashboard", label: "Stats" },
            { id: "pending", label: `Pending (${payments.length})` },
            { id: "premium", label: "Premium" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? "bg-brand text-white shadow-lg shadow-brand/20"
                  : "bg-white/5 text-gray-500 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-brand/10 border border-brand/20 text-brand p-4 rounded-2xl mb-6 text-xs font-bold">
            {error}
          </div>
        )}

        {/* DASHBOARD STATS */}
        {activeTab === "dashboard" && dashboardData && (
          <div className="space-y-4 animate-fade-up">
            <div className="bg-bg-surface p-6 rounded-[32px] border border-white/5 shadow-2xl">
              <span className="text-gray-500 text-[8px] font-black uppercase tracking-[0.2em] block mb-1">
                Total Users
              </span>
              <p className="text-3xl text-white font-black">{dashboardData.totalUsers}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-surface p-5 rounded-[28px] border border-white/5">
                <span className="text-gray-500 text-[8px] font-black uppercase tracking-[0.2em] block mb-1">Free</span>
                <p className="text-2xl text-white font-black">{dashboardData.freeUsers}</p>
              </div>
              <div className="bg-bg-surface p-5 rounded-[28px] border border-brand/20">
                <span className="text-brand text-[8px] font-black uppercase tracking-[0.2em] block mb-1">Premium</span>
                <p className="text-2xl text-brand font-black">{dashboardData.premiumUsersCount}</p>
              </div>
            </div>
          </div>
        )}

        {/* PENDING PAYMENTS */}
        {activeTab === "pending" && (
          <div className="space-y-4 animate-fade-up">
            {payments.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">No pending payments</p>
              </div>
            ) : (
              payments.map((p) => (
                <div key={p.paymentId} className="bg-bg-surface p-5 rounded-[32px] border border-white/5 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-white font-bold text-sm leading-tight">{p.userName}</h4>
                      <p className="text-gray-500 text-[10px] tracking-wide">{p.userEmail}</p>
                    </div>
                    <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
                      {p.amount} BDT
                    </span>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-3 mb-4 border border-white/5">
                    <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest block mb-1">
                      Transaction ID
                    </span>
                    <p className="text-gray-300 font-mono text-[10px] uppercase">{p.transactionId}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-[9px] font-bold uppercase">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleApprove(p.userId, p.paymentId)}
                      className="bg-brand text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand/20 active:scale-95 transition-transform"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PREMIUM USERS */}
        {activeTab === "premium" && dashboardData && (
          <div className="space-y-4 animate-fade-up">
            {dashboardData.premiumUsers.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">No premium users</p>
              </div>
            ) : (
              dashboardData.premiumUsers.map((u) => {
                const expiry = new Date(u.premiumExpiry);
                const now = new Date();
                const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                const isExpired = daysLeft <= 0;

                return (
                  <div key={u._id} className="bg-bg-surface p-5 rounded-[32px] border border-white/5 shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-white font-bold text-sm leading-tight">{u.name}</h4>
                        <p className="text-gray-500 text-[10px] tracking-wide">{u.email}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                          isExpired ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                        }`}
                      >
                        {isExpired ? "Expired" : `${daysLeft}d left`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex flex-col">
                        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Expires</span>
                        <span className="text-gray-400 font-mono text-[10px]">
                          {u.premiumExpiry ? expiry.toLocaleDateString() : "Lifetime"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRevoke(u._id)}
                        className="bg-white/5 text-brand border border-white/10 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
