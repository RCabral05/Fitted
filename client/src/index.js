import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import SignUp from "./pages/SignUpPage";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from './context/CartContext';
import DiscordConnectPage from "./pages/DiscordPages/DiscordConnectPage";
import SuccessPage from "./pages/DiscordPages/SuccessPage";
import ServerUsersPage from "./pages/DiscordPages/ServerUsersPage";
import ProfilePage from "./pages/WebsitePages/ProfilePage";

// Create root element
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <AuthProvider>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<App />}>
            {/* <Route path="/SignUp" element={<SignUp />} /> */}
            <Route path="/Connect-Discord" element={<DiscordConnectPage />}/>
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/server-users" element={<ServerUsersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<p>Route not found</p>} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
