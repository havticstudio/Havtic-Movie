import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_BASE = "/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/me`, {
        credentials: "include" // Send cookie with request
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { 
        method: "POST",
        credentials: "include" 
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const addToWatchlist = async (item) => {
    try {
      const res = await fetch(`${API_BASE}/user/watchlist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ item })
      });
      if (res.ok) {
        const watchlist = await res.json();
        setUser(prev => ({ ...prev, watchlist }));
      }
    } catch (err) {
      console.error("Watchlist add error:", err);
    }
  };

  const removeFromWatchlist = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/user/watchlist/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const watchlist = await res.json();
        setUser(prev => ({ ...prev, watchlist }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addToCompleted = async (item) => {
    try {
      const res = await fetch(`${API_BASE}/user/completed/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ item })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({ ...prev, completed: data.completed, watchlist: data.watchlist }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCompleted = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/user/completed/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const completed = await res.json();
        setUser(prev => ({ ...prev, completed }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, loading, 
      addToWatchlist, removeFromWatchlist, 
      addToCompleted, removeFromCompleted 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
