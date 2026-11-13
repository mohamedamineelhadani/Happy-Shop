import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./animation.css";
import "./../public/fontawesome-free-7.1.0-web/css/fontawesome.min.css";
import "./../public/fontawesome-free-7.1.0-web/css/solid.min.css";
import "./../public/fontawesome-free-7.1.0-web/css/brands.min.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.body).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
);
