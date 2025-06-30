import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaTags,
  FaUsers,
  FaClipboardList,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";
import { useMemo } from "react";

// List of valid admin routes (must match App.jsx)
const validRoutes = [
  "/",
  "/categories",
  "/orchids",
  "/admin-orders",
  "/accounts",
];

const menu = [
  { to: "/", icon: <FaLeaf />, label: "Orchids" },
  { to: "/categories", icon: <FaTags />, label: "Categories" },
  { to: "/orchids", icon: <FaUsers />, label: "Employees" },
  { to: "/admin-orders", icon: <FaClipboardList />, label: "Orders" },
  { to: "/accounts", icon: <FaUserShield />, label: "Accounts" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Memoize valid route check for performance
  const isRouteValid = useMemo(() => {
    const set = new Set(validRoutes);
    return (to) => set.has(to);
  }, []);

  return (
    <aside className="admin-sidebar d-flex flex-column">
      <div className="sidebar-header text-center py-4 mb-2">
        <span className="sidebar-logo fw-bold">🌿 Orchid Admin</span>
      </div>
      <nav className="flex-grow-1">
        <ul className="nav flex-column">
          {menu.map((item) => {
            const valid = isRouteValid(item.to);
            return (
              <li className="nav-item" key={item.to}>
                {valid ? (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      "nav-link sidebar-link d-flex align-items-center" +
                      (isActive ? " active" : "")
                    }
                  >
                    <span className="me-2 fs-5">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ) : (
                  <span
                    className="nav-link sidebar-link d-flex align-items-center disabled-link"
                    title="Coming soon"
                    style={{ cursor: "not-allowed", opacity: 0.5 }}
                  >
                    <span className="me-2 fs-5">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto pb-3 px-3">
        <button
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center sidebar-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" /> Logout
        </button>
      </div>
      <style>{`
        .admin-sidebar {
          width: 220px;
          min-height: 100vh;
          background: linear-gradient(120deg, #1a237e 0%, #283593 60%, #3949ab 100%);
          color: #fff;
          box-shadow: 2px 0 12px #0001;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
          display: flex;
        }
        .sidebar-header {
          font-size: 1.3rem;
          letter-spacing: 0.03em;
        }
        .sidebar-logo {
          color: #ffd54f;
          font-size: 1.4rem;
        }
        .sidebar-link {
          color: #e3e7ef;
          padding: 0.7rem 1.2rem;
          border-radius: 0.5rem;
          margin-bottom: 0.2rem;
          font-size: 1.05rem;
          transition: background 0.18s, color 0.18s;
        }
        .sidebar-link.active, .sidebar-link:hover {
          background: #ffd54f22;
          color: #ffd54f;
        }
        .sidebar-logout {
          font-size: 1.05rem;
          border-radius: 0.5rem;
          border-width: 2px;
        }
        .disabled-link {
          pointer-events: none;
          background: none !important;
          color: #e3e7ef !important;
        }
        @media (max-width: 991px) {
          .admin-sidebar {
            width: 60px;
            min-width: 60px;
          }
          .sidebar-logo, .sidebar-link span:last-child {
            display: none;
          }
          .sidebar-link {
            justify-content: center;
            padding: 0.7rem 0.5rem;
          }
        }
      `}</style>
    </aside>
  );
}
