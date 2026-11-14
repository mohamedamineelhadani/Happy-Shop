import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/animations.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/pages.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
