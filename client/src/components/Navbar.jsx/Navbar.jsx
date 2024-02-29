import React from "react";
import './styles.css';

export const Navbar = () => {


  return (
    <div className="navbar">
        <a href="/server-users">Server Users</a>
        <a href="/">Home</a>
        <a href="/Connect-Discord">Sign In</a>
        <a href="/Profile">Profile</a>
    </div>
  );
};
