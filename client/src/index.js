import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import SignUp from "./pages/SignUpPage";
import { AuthProvider } from "./context/AuthContext";
import { CollectionProvider } from "./context/CollectionContext";
import { StoreProvider } from "./context/StoreContext";
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import { MyAdminProvider } from './context/MyAdminContext';
import DiscordConnectPage from "./pages/DiscordPages/DiscordConnectPage";
import SuccessPage from "./pages/DiscordPages/SuccessPage";
import ServerUsersPage from "./pages/DiscordPages/ServerUsersPage";
import ProfilePage from "./pages/WebsitePages/ProfilePage";
import CreateStorePage from "./pages/WebsitePages/CreateStorePage";
import BrandDashboardPage from "./pages/BrandDashboard/BrandDashboardPage";
import BrandProductsPage from "./pages/BrandDashboard/BrandProductsPage";
import ProductPage from "./pages/WebsitePages/ProductPage";
import AllStoresPage from "./pages/WebsitePages/AllStoresPage";
import ProductDetailsPage from "./pages/WebsitePages/ProductDetailsPage";
import CartPage from "./pages/WebsitePages/CartPage";
import MyAdminPage from "./pages/MyAdmin/MyAdminPage";
import PaymentCanceled from "./pages/WebsitePages/PaymentCanceled";
import PaymentSuccessful from "./pages/WebsitePages/PaymentSuccessful";
import ReleaseCalendarPage from "./pages/WebsitePages/ReleaseCalendarPage";


// Create root element
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <AuthProvider>
    <BrowserRouter>
      <ProductsProvider>
        <CartProvider>
          <StoreProvider>
            <CollectionProvider>
              <MyAdminProvider>
                <Routes>
                  <Route path="/" element={<App />}>
                    <Route index element={<ProductPage />} />
                    {/* <Route path="/SignUp" element={<SignUp />} /> */}
                    <Route path="/Connect-Discord" element={<DiscordConnectPage />}/>
                    <Route path="/connect-success" element={<SuccessPage/>} />
                    <Route path="/server-users" element={<ServerUsersPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/create-store" element={<CreateStorePage />} />
                    <Route path="/product/:productId" element={<ProductDetailsPage />} />
                    <Route path="/all-stores" element={<AllStoresPage />} />
                    <Route path="/Cart" element={<CartPage />} />
                    <Route path="/MyAdmin" element={<MyAdminPage />} />
                    <Route path="/release-calendar" element={<ReleaseCalendarPage />} />
                    <Route path="/brand-dashboard" element={<BrandDashboardPage />} />
                    <Route path="/success" element={<PaymentSuccessful />} />
                    <Route path="/cancel" element={<PaymentCanceled />} />
                    <Route path="*" element={<p>Route not found</p>} />
                  
                  </Route>
                </Routes>
              </MyAdminProvider>
            </CollectionProvider>
          </StoreProvider>
        </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
