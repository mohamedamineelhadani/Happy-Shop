import { NavLink } from "react-router-dom";
import {
  Cart,
  Close,
  Dashboard,
  Layers,
  Logo,
  Logout,
  Mail,
  Package,
  User,
  Users,
} from "../../lib/icons";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/", label: "Dashboard", icon: Dashboard, end: true },
  { to: "/products", label: "Products", icon: Package },
  { to: "/categories", label: "Categories", icon: Layers },
  { to: "/orders", label: "Orders", icon: Cart },
  { to: "/messages", label: "Messages", icon: Mail },
  { to: "/subscribers", label: "Subscribers", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      <div
        className={`sidebar__scrim${open ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar${open ? " is-open" : ""}`}>
        <div className="sidebar__brand">
          <span className="brand">
            <Logo size={30} />
            <span className="brand__name">
              Happy<span>Shop</span>
            </span>
          </span>
          <span className="brand__tag">Admin</span>
          <button
            type="button"
            className="icon-btn sidebar__close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <Close size={18} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar__link${isActive ? " is-active" : ""}`}
              onClick={onClose}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__foot">
          <div className="sidebar__user">
            <span className="avatar">{user?.name?.[0]?.toUpperCase() ?? "A"}</span>
            <span className="sidebar__user-info">
              <strong>{user?.name ?? "Admin"}</strong>
              <small>{user?.email ?? ""}</small>
            </span>
          </div>
          <button type="button" className="btn btn-ghost btn-block" onClick={logout}>
            <Logout size={17} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
