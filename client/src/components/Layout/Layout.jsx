import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import './styles.css';
import { Navbar } from "../Navbar.jsx/Navbar";

export const Layout = () => {
  const location = useLocation();


  return (
    <div className="layout">
        <Navbar/>
        <Outlet />
    </div>
  );
};
