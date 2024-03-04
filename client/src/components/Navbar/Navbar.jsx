import React from "react";
import './styles.css';

export const Navbar = () => {


  return (
    <div className="navbar">
        <a href="/server-users">Server Users</a>
        <a href="/">Home</a>
        <a href="/Connect-Discord">Sign In</a>
        <a href="/Profile">Profile</a>
        <a href="/create-store">Create Store</a>
        <a href="/brand-dashboard">Brand Dash</a>
        <a href="/all-stores">All Stores</a>
        <a href="/cart">Cart</a>
    </div>
  );
};
