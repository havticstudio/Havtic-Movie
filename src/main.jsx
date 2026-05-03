import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Genres from "./pages/Genres.jsx";
import Details from "./pages/Details.jsx";
import Discover from "./pages/Discover.jsx";
import TopRated from "./pages/TopRated.jsx";
import Recent from "./pages/Recent.jsx";
import Celebrities from "./pages/Celebrities.jsx";
import CelebrityDetails from "./pages/CelebrityDetails.jsx";
import Awards from "./pages/Awards.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import Completed from "./pages/Completed.jsx";
import Settings from "./pages/Settings.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Premium from "./pages/Premium.jsx";
import AdminPayments from "./pages/AdminPayments.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import { useMobile } from "./hooks/useMobile.js";
import MobileApp from "./mobile/MobileApp.jsx";
import MobileHome from "./mobile/MobileHome.jsx";
import MobileDetails from "./mobile/MobileDetails.jsx";
import MobileDiscover from "./mobile/MobileDiscover.jsx";
import MobileWatchlist from "./mobile/MobileWatchlist.jsx";
import MobileCompleted from "./mobile/MobileCompleted.jsx";
import MobileSettings from "./mobile/MobileSettings.jsx";
import MobilePremium from "./mobile/MobilePremium.jsx";
import MobileAwards from "./mobile/MobileAwards.jsx";
import MobileGenres from "./mobile/MobileGenres.jsx";
import MobileLogin from "./mobile/MobileLogin.jsx";
import MobileSignup from "./mobile/MobileSignup.jsx";
import { HelmetProvider } from "react-helmet-async";

const desktopRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "genres", element: <Genres /> },
      { path: "discover", element: <Discover /> },
      { path: "awards", element: <Awards /> },
      { path: "celebrities", element: <Celebrities /> },
      { path: "celebrity/:id", element: <CelebrityDetails /> },
      { path: "recent", element: <Recent /> },
      { path: "top-rated", element: <TopRated /> },
      { path: "watchlist", element: <Watchlist /> },
      { path: "completed", element: <Completed /> },
      { path: "settings", element: <Settings /> },
      { path: "premium", element: <Premium /> },
      { path: "admin/payments", element: <AdminPayments /> },
      { path: "details/:mediaType/:id/:slug", element: <Details /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
];

const mobileRoutes = [
  {
    path: "/",
    element: <MobileApp />,
    children: [
      { index: true, element: <MobileHome /> },
      { path: "discover", element: <MobileDiscover /> },
      { path: "watchlist", element: <MobileWatchlist /> },
      { path: "completed", element: <MobileCompleted /> },
      { path: "settings", element: <MobileSettings /> },
      { path: "premium", element: <MobilePremium /> },
      { path: "awards", element: <MobileAwards /> },
      { path: "genres", element: <MobileGenres /> },
      { path: "details/:mediaType/:id/:slug", element: <MobileDetails /> },
      { path: "celebrities", element: <Celebrities /> },
      { path: "celebrity/:id", element: <CelebrityDetails /> },
      { path: "recent", element: <Recent /> },
      { path: "top-rated", element: <TopRated /> },
      { path: "admin/payments", element: <AdminPayments /> },
    ],
  },
  { path: "/login", element: <MobileLogin /> },
  { path: "/signup", element: <MobileSignup /> },
];

const DesktopRouter = createBrowserRouter(desktopRoutes);
const MobileRouter = createBrowserRouter(mobileRoutes);

function RootApp() {
  const isMobile = useMobile();
  return <RouterProvider router={isMobile ? MobileRouter : DesktopRouter} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <RootApp />
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);
