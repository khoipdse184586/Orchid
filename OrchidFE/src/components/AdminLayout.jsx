import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout d-flex flex-column min-vh-100">
      <AdminHeader />
      <div
        className="d-flex flex-grow-1"
        style={{ minHeight: "calc(100vh - 58px)" }}
      >
        <AdminSidebar />
        <main className="admin-main flex-grow-1">{children}</main>
      </div>
      <style>{`
        .admin-layout {
          background: #f4f6fb;
        }
        .admin-main {
          margin-left: 220px;
          margin-top: 58px;
          padding: 2.2rem 2.2rem 1.2rem 2.2rem;
          min-height: calc(100vh - 58px - 60px);
          background: #f4f6fb;
          transition: margin-left 0.2s;
        }
        @media (max-width: 991px) {
          .admin-main {
            margin-left: 60px;
            padding: 1.1rem 0.5rem 1rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
