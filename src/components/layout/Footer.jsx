import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "../../lib/icons";
import { subscriberService } from "../../services";
import { useToast } from "../../context/ToastContext";

const SHOP_LINKS = [
  { to: "/shop", label: "All products" },
  { to: "/categories", label: "Categories" },
  { to: "/shop?sort=price_desc", label: "Premium picks" },
  { to: "/shop?sort=rating", label: "Top rated" },
];

const COMPANY_LINKS = [
  { to: "/contact", label: "Contact us" },
  { to: "/contact", label: "Shipping & returns" },
  { to: "/contact", label: "Care guide" },
  { to: "/contact", label: "Privacy policy" },
];

export default function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  async function handleSubscribe(event) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;

    setSubscribing(true);
    try {
      const response = await subscriberService.subscribe({ email: value });
      toast.success(
        response?.message || "You are on the list. Watch your inbox.",
        "Subscribed"
      );
      setEmail("");
    } catch (error) {
      toast.error(error.message, "Could not subscribe");
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="brand">
              <span className="brand__mark">H</span>
              <span className="brand__name">
                Happy<span>Shop</span>
              </span>
            </Link>
            <p>
              A curated house of luxury essentials — watches, audio, fashion and
              objects made to be lived with.
            </p>
            <div className="social-row">
              <a href="#" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4>Shop</h4>
            <ul className="footer__links">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul className="footer__links">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Stay in the loop</h4>
            <p style={{ fontSize: "0.9rem" }}>
              Private previews and new arrivals, once a month.
            </p>
            <form className="newsletter" onSubmit={handleSubscribe}>
              <input
                type="email"
                className="input"
                placeholder="you@email.com"
                aria-label="Email address"
                required
                value={email}
                disabled={subscribing}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button
                type="submit"
                className="btn btn-gold btn-sm"
                disabled={subscribing}
              >
                {subscribing ? "Joining…" : "Join"}
              </button>
            </form>
            <ul className="footer__links" style={{ marginTop: "1rem" }}>
              <li>
                <a href="mailto:hello@happyshop.test">
                  <Mail size={15} /> hello@happyshop.test
                </a>
              </li>
              <li>
                <a href="tel:+212600000001">
                  <Phone size={15} /> +212 600 000 001
                </a>
              </li>
              <li>
                <span className="dim">
                  <MapPin size={15} /> Casablanca, Morocco
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} HappyShop. All rights reserved.</span>
          <span>Crafted with care in Morocco.</span>
        </div>
      </div>
    </footer>
  );
}
