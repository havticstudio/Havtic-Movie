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

const router = createBrowserRouter([
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
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
