import { Outlet } from "react-router-dom";
import { useRef, useEffect } from "react";
import NavBar from "./components/NavBar";
import BottomNav from "./components/BottomNav";
import ThreeBackground from "./components/ThreeBackground";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const mainRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    // Only inject Social Bar Ad if user is NOT premium
    if (user?.isPremium) return;

    if (!document.getElementById('adsterra-social-bar')) {
      const script = document.createElement('script');
      script.id = 'adsterra-social-bar';
      script.type = 'text/javascript';
      script.src = 'https://pl29326692.profitablecpmratenetwork.com/e1/56/d5/e156d595bd515b26929e14985a61483d.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [user]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-main relative">
      <ThreeBackground scrollRef={mainRef} />
      
      <NavBar />
      <main ref={mainRef} className="flex-1 h-full overflow-y-auto scrollbar-hide pb-20 md:pb-0 relative z-10">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default App;
