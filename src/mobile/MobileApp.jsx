import { Outlet, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import BottomNav from "../components/BottomNav";
import ThreeBackground from "../components/ThreeBackground";
import MobileSidebar from "./components/MobileSidebar";
import MobileHeader from "./components/MobileHeader";

const MobileApp = () => {
  const mainRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isDetailsPage = location.pathname.startsWith("/details");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-main relative">
      <ThreeBackground scrollRef={mainRef} />
      
      {/* Global Mobile Header (Hidden on Details Page) */}
      {!isDetailsPage && <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />}

      {/* Main Content Area */}
      <main ref={mainRef} className="flex-1 h-full w-full overflow-x-hidden overflow-y-auto scrollbar-hide pb-[70px] relative z-10 overscroll-y-none">
        <Outlet context={{ openSidebar: () => setIsSidebarOpen(true), isSearchOpen, setIsSearchOpen }} />
      </main>
      
      {/* App Bottom Navigation */}
      <BottomNav />

      {/* Global Slide-out Sidebar */}
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

export default MobileApp;
