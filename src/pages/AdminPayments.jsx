import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminPayments() {
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
        credentials: "include"
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
        credentials: "include"
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
    if (!window.confirm("Are you sure you want to approve this payment and activate Premium for 30 days?")) return;

    try {
      const res = await fetch("/api/user/admin/payment/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, paymentId }),
      });

      if (res.ok) {
        setPayments(prev => prev.filter(p => p.paymentId !== paymentId));
        alert("Payment approved successfully!");
        fetchDashboardData(); // refresh dashboard stats
      } else {
        alert("Failed to approve payment");
      }
    } catch (err) {
      alert("Error approving payment");
    }
  };

  const handleRevoke = async (userId) => {
    if (!window.confirm("Are you sure you want to revoke premium access for this user?")) return;

    try {
      const res = await fetch("/api/user/admin/premium/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        alert("Premium access revoked.");
        fetchDashboardData(); // refresh
      } else {
        alert("Failed to revoke premium.");
      }
    } catch (err) {
      alert("Error revoking premium.");
    }
  };

  if (loading) return <div className="min-h-screen bg-bg-main flex items-center justify-center text-white">Loading Admin Dashboard...</div>;

  return (
    <div className="min-h-screen bg-bg-main p-6 md:p-10">
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">
          Admin <span className="text-brand">Dashboard</span>
        </h1>

        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 flex-wrap">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-brand text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            Statistics
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-brand text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            Pending Payments ({payments.length})
          </button>
          <button 
            onClick={() => setActiveTab('premium')}
            className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'premium' ? 'bg-brand text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            Premium Users
          </button>
        </div>

        {error && <div className="bg-brand/10 text-brand p-4 rounded-xl mb-6">{error}</div>}

        {/* TAB CONTENT: DASHBOARD */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-bg-surface p-6 rounded-3xl border border-white/5 shadow-2xl">
              <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Registered Users</h3>
              <p className="text-4xl text-white font-black">{dashboardData.totalUsers}</p>
            </div>
            <div className="bg-bg-surface p-6 rounded-3xl border border-white/5 shadow-2xl">
              <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Free Users</h3>
              <p className="text-4xl text-white font-black">{dashboardData.freeUsers}</p>
            </div>
            <div className="bg-bg-surface p-6 rounded-3xl border border-brand/30 shadow-2xl shadow-brand/10">
              <h3 className="text-brand text-[10px] font-black uppercase tracking-widest mb-2">Active Premium Users</h3>
              <p className="text-4xl text-brand font-black">{dashboardData.premiumUsersCount}</p>
            </div>
          </div>
        )}

        {/* TAB CONTENT: PENDING PAYMENTS */}
        {activeTab === 'pending' && (
          <div className="overflow-x-auto rounded-3xl border border-white/5 bg-bg-surface shadow-2xl animate-fade-in">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-main/50 border-b border-white/5">
                  <th className="px-6 py-4 text-gray-500 text-[10px] font-black uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-gray-500 text-[10px] font-black uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-gray-500 text-[10px] font-black uppercase tracking-widest">Transaction ID</th>
                  <th className="px-6 py-4 text-gray-500 text-[10px] font-black uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-gray-500 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">No pending payments found.</td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.paymentId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-white font-bold">{p.userName}</p>
                        <p className="text-gray-500 text-xs">{p.userEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-brand font-black">{p.amount} BDT</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-bg-main px-3 py-1.5 rounded-lg border border-white/5 text-gray-300 font-mono text-sm uppercase">
                          {p.transactionId}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleApprove(p.userId, p.paymentId)}
                          className="bg-brand hover:bg-brand-hover text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB CONTENT: PREMIUM USERS */}
        {activeTab === 'premium' && dashboardData && (
          <div className="overflow-x-auto rounded-3xl border border-brand/20 bg-bg-surface shadow-2xl animate-fade-in">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand/5 border-b border-brand/20">
                  <th className="px-6 py-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">Expiry Date</th>
                  <th className="px-6 py-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">Days Left</th>
                  <th className="px-6 py-4 text-gray-400 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.premiumUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500 italic">No active premium users.</td>
                  </tr>
                ) : (
                  dashboardData.premiumUsers.map((u) => {
                    const expiry = new Date(u.premiumExpiry);
                    const now = new Date();
                    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                    const isExpired = daysLeft <= 0;

                    return (
                      <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-white font-bold">{u.name}</p>
                          <p className="text-gray-500 text-xs">{u.email}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm font-mono">
                          {u.premiumExpiry ? expiry.toLocaleDateString() : 'Lifetime / Unknown'}
                        </td>
                        <td className="px-6 py-4">
                          {u.premiumExpiry ? (
                            <span className={`px-2.5 py-1 rounded-md text-xs font-black ${isExpired ? 'bg-brand/20 text-brand' : 'bg-green-500/20 text-green-500'}`}>
                              {isExpired ? 'Expired' : `${daysLeft} Days`}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleRevoke(u._id)}
                            className="bg-white/5 hover:bg-brand/20 text-brand hover:text-brand border border-white/5 hover:border-brand/30 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
