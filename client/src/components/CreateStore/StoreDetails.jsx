import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";

export function StoreDetails() {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    discordId: user?.id || '',
    storeName: '',
    storeEmail: '',
    storeNumber: '',
    storeImage: '',
    referralCode: '',
    storeDomain: ''
  });

  useEffect(() => {
    if (user.id) {
        setFormData(formData => ({ ...formData, discordId: user?.id || '' }));
    }
  }, [user.id]); // Only re-run the effect if discordId changes


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure the discordId is included in the formData when submitting
    const dataToSubmit = { ...formData, discordId: user?.id };
    console.log('Submitting:', dataToSubmit);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/stores`, dataToSubmit);
      console.log('Store created:', response.data);
      // Handle success, perhaps redirect or clear form
    } catch (error) {
      console.error('Error creating store:', error.response?.data || error.message);
      // Handle error, show feedback to user
    }
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


