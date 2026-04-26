import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Genres from "./pages/Genres.jsx";
import Placeholder from "./pages/Placeholder.jsx";

import Details from "./pages/Details.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "genres", element: <Genres /> },
      { path: "discover", element: <Placeholder /> },
      { path: "awards", element: <Placeholder /> },
      { path: "celebrities", element: <Placeholder /> },
      { path: "recent", element: <Placeholder /> },
      { path: "top-rated", element: <Placeholder /> },
      { path: "downloaded", element: <Placeholder /> },
      { path: "playlists", element: <Placeholder /> },
      { path: "watchlist", element: <Placeholder /> },
      { path: "completed", element: <Placeholder /> },
      { path: "settings", element: <Placeholder /> },
    ],
  },
  {
    path: "/details/:mediaType/:id/:slug",
    element: <Details />,
  },
]);

import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>,
);
