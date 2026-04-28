import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import BottomNav from "./components/BottomNav";

const App = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-main">
      <NavBar />
      <main className="flex-1 h-full overflow-y-auto scrollbar-hide pb-20 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default App;
