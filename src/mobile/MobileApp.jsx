import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "../components/BottomNav";
import ThreeBackground from "../components/ThreeBackground";
import MobileSidebar from "./components/MobileSidebar";
import MobileHeader from "./components/MobileHeader";

const MobileApp = () => {
  const mainRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navType = useNavigationType();
  const isDetailsPage = location.pathname.startsWith("/details");

  // Determine transition direction
  const direction = navType === "POP" ? -1 : 1;

  const variants = {
    initial: (direction) => ({
      scale: direction > 0 ? 0.95 : 1.05,
      opacity: 0,
      filter: "blur(10px)",
      zIndex: direction > 0 ? 20 : 1,
    }),
    animate: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1], // Custom cubic-bezier for high-end feel
      },
    },
    exit: (direction) => ({
      scale: direction > 0 ? 1.05 : 0.95,
      opacity: 0,
      filter: "blur(10px)",
      zIndex: direction > 0 ? 1 : 20,
      transition: {
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1],
      },
    }),
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#080101] relative">
      <ThreeBackground scrollRef={mainRef} />

      {/* Global Mobile Header */}
      {!isDetailsPage && (
        <MobileHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
        />
      )}

      {/* Main Content Area with Transitions */}
      <main ref={mainRef} className="flex-1 h-full w-full overflow-hidden relative z-10 overscroll-y-none pb-[70px]">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full overflow-x-hidden overflow-y-auto scrollbar-hide"
          >
            <Outlet context={{ openSidebar: () => setIsSidebarOpen(true), isSearchOpen, setIsSearchOpen }} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* App Bottom Navigation */}
      <BottomNav />

      {/* Global Slide-out Sidebar */}
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

export default MobileApp;
