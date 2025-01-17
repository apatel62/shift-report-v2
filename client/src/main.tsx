import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import ShiftReport from "./pages/ShiftReport.tsx";
import ShiftHistory from "./pages/ShiftHistory.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import CreateAccount from "./pages/CreateAccount.tsx";
import OTS from "./pages/OTS.tsx";

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
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
