import { ToastContainer, toast } from "react-toastify";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ToastContainer />
  </>
);
