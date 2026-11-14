import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Cart, Close, Heart, Menu, Search } from "../../lib/icons";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/favorites", label: "Favourites" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { count, openCart } = useCart();
  const { count: wishCount } = useWishlist();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
        <div className="navbar__inner">
          <Link to="/" className="brand" aria-label="HappyShop home">
            <span className="brand__mark">H</span>
            <span className="brand__name">
              Happy<span>Shop</span>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <Link to="/shop" className="icon-btn" aria-label="Browse the shop">
              <Search size={19} />
            </Link>
            <Link
              to="/favorites"
              className="icon-btn"
              aria-label={`Favourites, ${wishCount} saved`}
            >
              <Heart size={19} />
              {wishCount > 0 ? (
                <span className="icon-count">{wishCount > 99 ? "99+" : wishCount}</span>
              ) : null}
            </Link>
            <button
              type="button"
              className="icon-btn"
              onClick={openCart}
              aria-label={`Open bag, ${count} items`}
            >
              <Cart size={19} />
              {count > 0 ? (
                <span className="icon-count">{count > 99 ? "99+" : count}</span>
              ) : null}
            </button>
            <button
              type="button"
              className="icon-btn nav-toggle"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <Close size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <nav className="mobile-menu anim-fade-down" aria-label="Mobile">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </>
  );
}
