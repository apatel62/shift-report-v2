import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
//import "./index.css";
import ShiftReport from "./pages/ShiftReport.tsx";
import ShiftHistory from "./pages/ShiftHistory.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import CreateAccount from "./pages/CreateAccount.tsx";
import OTS from "./pages/OTS.tsx";
import auth from "./utils/auth";

import OTSView from "./pages/OTSView.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ShiftReport />,
      },
      {
        path: "/ShiftHistory",
        element: <ShiftHistory />,
      },
      {
        path: "/CreateAccount",
        element: <CreateAccount />,
      },
      {
        path: "/OTS",
        element: <OTS />,
      },
      {
        path: "/OTSView",
        element: <OTSView />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  const loadCSS = async () => {
    if (auth.loggedIn()) {
      if (auth.getRole() === "supervisor") {
        await import("./supervisor.css");
      } else {
        await import("./index.css");
      }
    } else {
      await import("./index.css");
    }
  };

  loadCSS().then(() => {
    ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
  });
}
