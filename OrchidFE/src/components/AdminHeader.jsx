import React from "react";
import { FaUserCircle, FaChevronDown, FaSignOutAlt } from "react-icons/fa";

export default function AdminHeader() {
  const username = localStorage.getItem("username") || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <header className="admin-header d-flex align-items-center justify-content-between px-4 shadow-sm">
      <div className="d-flex align-items-center gap-2">
        <span className="admin-header-logo fs-3">🌿</span>
        <span className="admin-header-title fw-bold fs-4">Orchid Admin</span>
      </div>
      <div className="d-flex align-items-center gap-2 position-relative">
        <FaUserCircle className="fs-3 text-accent" />
        <span className="fw-semibold text-dark">{username}</span>
        <div className="dropdown">
          <button
            className="btn btn-link p-0 ms-1 dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FaChevronDown />
          </button>
          <ul className="dropdown-menu dropdown-menu-end mt-2">
            <li>
              <button
                className="dropdown-item d-flex align-items-center gap-2"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      <style>{`
        .admin-header {
          height: 58px;
          background: #fff;
          border-bottom: 1.5px solid #e3e7ef;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1100;
        }
        .admin-header-logo {
          color: #3949ab;
        }
        .admin-header-title {
          color: #283593;
          letter-spacing: 0.03em;
        }
        .text-accent {
          color: #ffd54f !important;
        }
        .dropdown-toggle::after {
          display: none;
        }
        .dropdown-menu {
          min-width: 140px;
          font-size: 1rem;
        }
        @media (max-width: 991px) {
          .admin-header-title {
            font-size: 1.1rem;
          }
          .admin-header-logo {
            font-size: 1.7rem;
          }
        }
      `}</style>
    </header>
  );
}
