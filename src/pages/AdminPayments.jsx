import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminPayments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/");
      return;
    }
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/user/admin/payments", {
        headers: { "Content-Type": "application/json" },
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
    if (!window.confirm("Are you sure you want to approve this payment and activate Premium for this user?")) return;

    try {
      const res = await fetch("/api/user/admin/payment/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, paymentId }),
      });

      if (res.ok) {
        setPayments(prev => prev.filter(p => p.paymentId !== paymentId));
        alert("Payment approved successfully!");
      } else {
        alert("Failed to approve payment");
      }
    } catch (err) {
      alert("Error approving payment");
    }
  };

  if (loading) return <div className="min-h-screen bg-bg-main flex items-center justify-center text-white">Loading Admin Dashboard...</div>;

  return (
    <div className="min-h-screen bg-bg-main p-6 md:p-10">
      <Helmet>
        <title>Admin - Manage Payments</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Pending <span className="text-brand">Payments</span>
          </h1>
          <div className="bg-bg-surface px-4 py-2 rounded-xl border border-white/5 text-xs text-gray-400">
            {payments.length} Pending
          </div>
        </div>

        {error && <div className="bg-brand/10 text-brand p-4 rounded-xl mb-6">{error}</div>}

        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-bg-surface shadow-2xl">
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
      </div>
    </div>
  );
}
