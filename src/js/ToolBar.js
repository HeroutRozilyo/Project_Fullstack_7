import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../css/toolBar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Toolbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // Check if the current route is either "/login" or "/register"
  const isLoginOrRegister = location.pathname === "/login" || location.pathname === "/register";

  // Don't render the toolbar if the current route is "/login" or "/register"
  if (isLoginOrRegister) {
    return null;
  }

  // Check if the user is an admin
  const isAdmin = user && user.isAdmin;

  return (
    <div className="toolbar">
      <ul className="menuBar">
        <li>
          {/* If the user is an admin, redirect to the admin page */}
          {isAdmin ? (
            <NavLink to={`/admin`} exact className={({ isActive }) => (isActive ? "my-link" : null)}>
              <i className="toolbar-icon fas fa-home"></i>
              Home
            </NavLink>
          ) : (
            <NavLink
              to={`/users/${user && user.UserName}/main`}
              exact
              className={({ isActive }) => (isActive ? "my-link" : null)}
            >
              <i className="toolbar-icon fas fa-home"></i>
              Home
            </NavLink>
          )}
        </li>
        <li>
          <NavLink
            to={`/users/${user && user.UserName}/info`}
            exact
            className={({ isActive }) => (isActive ? "my-link" : null)}
          >
            <i className="toolbar-icon fas fa-info-circle"></i>
            Info
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            exact
            className={({ isActive }) => (isActive ? "my-link" : null)}
            onClick={() => localStorage.clear()}
          >
            <i className="toolbar-icon fas fa-sign-out-alt"></i>
            Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Toolbar;
