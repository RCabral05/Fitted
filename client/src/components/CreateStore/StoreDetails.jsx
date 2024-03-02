import React, { useState, useContext } from 'react';
import { useProducts } from '../../context/ProductsContext'; 
import { AuthContext } from "../../context/AuthContext";

export function StoreDetails() {
  const { user } = useContext(AuthContext);
  const { createStore } = useProducts();

  const [formData, setFormData] = useState({
    storeName: '',
    storeEmail: '',
    storeNumber: '',
    storeImage: '',
    referralCode: '',
    storeDomain: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createStore(formData, user?.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="storeName"
        value={formData.storeName}
        onChange={handleChange}
        placeholder="Store Name"
        required
      />
      <input
        type="email"
        name="storeEmail"
        value={formData.storeEmail}
        onChange={handleChange}
        placeholder="Store Email"
        required
      />
      <input
        type="text"
        name="storeNumber"
        value={formData.storeNumber}
        onChange={handleChange}
        placeholder="Store Number"
        required
      />
      <input
        type="text"
        name="storeImage"
        value={formData.storeImage}
        onChange={handleChange}
        placeholder="Store Image URL"
      />
      <input
        type="text"
        name="referralCode"
        value={formData.referralCode}
        onChange={handleChange}
        placeholder="Referral Code"
      />
      <input
        type="text"
        name="storeDomain"
        value={formData.storeDomain}
        onChange={handleChange}
        placeholder="Store Domain"
      />
      <button type="submit">Create Store</button>
    </form>
  );
}


