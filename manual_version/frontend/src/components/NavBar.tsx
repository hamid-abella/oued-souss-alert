import React from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-3 flex items-center gap-2">
      <span className="font-semibold text-gray-900 mr-6">Oued-Souss Alert</span>
      <NavLink to="/" end className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/alertes" className={linkClass}>
        Alertes
      </NavLink>
      <NavLink to="/capteurs" className={linkClass}>
        Capteurs
      </NavLink>
    </nav>
  );
};

export default Navbar;
