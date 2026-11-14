import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="admin">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="admin__main">
        <Topbar onMenu={() => setNavOpen(true)} />
        <main className="admin__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
