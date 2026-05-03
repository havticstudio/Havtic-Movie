import { Outlet } from "react-router-dom";
import { useRef } from "react";
import NavBar from "./components/NavBar";
import BottomNav from "./components/BottomNav";
import ThreeBackground from "./components/ThreeBackground";

const App = () => {
  const mainRef = useRef(null);

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
