import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import dashboardIcon from "../../images/dashboard-icon.svg";
import expensesIcon from "../../images/expenses-icon.svg";
import settingsIcon from "../../images/settings-icon.svg";
import Logo from "../../images/Logo.svg";
import LogoDarkM from "../../images/Logo-white.svg";
import logoutIcon from "../../images/logout-icon.svg";
import darkMode from "../../images/darkMode.png";
import menuDark from "../../images/menuDark.svg";
import menuLight from "../../images/menuLight.svg";
import "./Navbar.css";

export default function Navbar(props) {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch {
      setError("Logout failed");
    }
  };

  const [title, setTitle] = React.useState("");
  const location = useLocation();

  useEffect(() => {
    setTitle(updateTitle());
  }, [location]);

  function updateTitle() {
    switch (window.location.pathname) {
      case "/settings":
        return "Settings";
      case "/expenses":
        return "Expenses";
      default:
        return "Dashboard";
    }
  }

  const [showNav, setShowNav] = useState(false);
  function handleShow(e) {
    setShowNav(prev => !prev);
  }

  return (
    <div
      className={props.toggleDarkMode ? "nav-container dark" : "nav-container"}
    >
      <div className="desktop-version">
        <nav>
          <img
            className="logo"
            src={props.toggleDarkMode ? LogoDarkM : Logo}
            alt="logo"
          />
          <div className="nav-links">
            <NavLink to="/" className="navlink-dashboard">
              <img src={dashboardIcon} alt="dashboard-button" />
              Dashboard
            </NavLink>
            <NavLink to="/expenses" className="navlink-expenses">
              <img src={expensesIcon} alt="expenses-button" />
              Expenses
            </NavLink>
            <NavLink to="/settings" className="navlink-settings">
              <img src={settingsIcon} alt="settings-button" />
              Settings
            </NavLink>
            <button onClick={props.handleDark} className="dark-btn">
              <img
                src={darkMode}
                className={
                  props.toggleDarkMode ? "toggle darkMode" : "toggle lightMode"
                }
                alt="dark-mode-button"
              />
              {props.toggleDarkMode ? "Dark" : "Light"}
            </button>
          </div>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <img src={logoutIcon} alt="logout" />
          Log out
        </button>
      </div>

      <div className="mobile">
        <section className="mobile-header">
          <button className="expand-icon" onClick={handleShow}>
            <img
              src={props.toggleDarkMode ? menuDark : menuLight}
              alt="dark-mode-button"
            />
          </button>
          <h2 className="title">{title}</h2>
        </section>
        <div className={showNav ? "nav-links mobile-nav" : "mobile-nav-hidden"}>
          <NavLink to="/" className="navlink-dashboard" onClick={handleShow}>
            <img src={dashboardIcon} alt="dashboard-button" />
            Dashboard
          </NavLink>
          <NavLink
            to="/expenses"
            className="navlink-expenses"
            onClick={handleShow}
          >
            <img src={expensesIcon} alt="expenses-button" />
            Expenses
          </NavLink>
          <NavLink
            to="/settings"
            className="navlink-settings"
            onClick={handleShow}
          >
            <img src={settingsIcon} alt="settings-button" />
            Settings
          </NavLink>
          <section className="nav-footer">
            <button onClick={props.handleDark} className="dark-btn">
              <img
                src={darkMode}
                className={
                  props.toggleDarkMode ? "toggle darkMode" : "toggle lightMode"
                }
                alt="dark-mode-button"
              />
              {props.toggleDarkMode ? "Dark" : "Light"}
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <img src={logoutIcon} alt="logout-button" />
              Log out
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
