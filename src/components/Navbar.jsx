import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, BarChart3, CircleHelp, UserRound, LockKeyhole, LogOut, Menu, X, ScanLine } from "lucide-react";
import BrandMark from "./BrandMark";
import LanguageSelector from "./LanguageSelector";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onLogin }) {
  const { loggedIn, logout } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const links = [
    ["/", t("nav.home"), Home, false],
    ["/prediction", t("nav.prediction"), BarChart3, true],
    ["/rice-disease-detection", t("nav.riceDisease"), ScanLine, false],
    ["/help", t("nav.help"), CircleHelp, false],
    ["/profile", t("nav.profile"), UserRound, true]
  ];

  const handleProtected = (e, protectedRoute) => {
    if (protectedRoute && !loggedIn) {
      e.preventDefault();
      onLogin?.("/prediction");
    }
    setOpen(false);
  };

  return (
    <header className="site-header">
      <div className="top-tricolor" />
      <div className="nav-shell">
        <NavLink to="/" className="brand-link" onClick={() => setOpen(false)}>
          <BrandMark />
        </NavLink>

        <nav className="desktop-nav">
          {links.map(([to, label, Icon, protectedRoute]) => (
            <NavLink
              key={to}
              to={to}
              onClick={(e) => handleProtected(e, protectedRoute)}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={20} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}

          <LanguageSelector />

          {loggedIn ? (
            <button className="login-button" onClick={logout}>
              <LogOut size={20} /> {t("nav.logout")}
            </button>
          ) : (
            <button className="login-button" onClick={() => onLogin?.("/prediction")}>
              <LockKeyhole size={20} /> {t("nav.login")}
            </button>
          )}
        </nav>

        <button className="mobile-menu" aria-label="Open menu" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="mobile-nav">
          <LanguageSelector mobile />
          {links.map(([to, label, Icon, protectedRoute]) => (
            <NavLink key={to} to={to} onClick={(e) => handleProtected(e, protectedRoute)} className="mobile-nav-item">
              <Icon size={21} /> {label}
            </NavLink>
          ))}
          <button className="mobile-nav-login" onClick={() => { setOpen(false); loggedIn ? logout() : onLogin?.("/prediction"); }}>
            {loggedIn ? <><LogOut size={21} /> {t("nav.logout")}</> : <><LockKeyhole size={21} /> {t("nav.login")}</>}
          </button>
        </div>
      )}
    </header>
  );
}
