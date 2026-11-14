import { Link, useLocation } from "react-router-dom";
import { ExternalLink, Menu } from "../../lib/icons";

const TITLES = {
  "/": "Dashboard",
  "/products": "Products",
  "/categories": "Categories",
  "/orders": "Orders",
  "/messages": "Messages",
  "/subscribers": "Subscribers",
  "/profile": "Profile",
};

function resolveTitle(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/products")) return "Products";
  if (pathname.startsWith("/orders")) return "Orders";
  return "Admin";
}

export default function Topbar({ onMenu }) {
  const { pathname } = useLocation();

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn topbar__menu"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <h1 className="topbar__title">{resolveTitle(pathname)}</h1>

      <Link to="/" className="btn btn-ghost btn-sm topbar__store" target="_blank" rel="noreferrer">
        <ExternalLink size={16} />
        View store
      </Link>
    </header>
  );
}
