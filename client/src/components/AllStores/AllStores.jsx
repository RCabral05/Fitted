import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './styles.css';

export const AllStores = () => {
  const [stores, setStores] = useState([]);
  
  useEffect(() => {

    const fetchStores = async () => {
      try {
        const storesResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}api/stores`);
        setStores(storesResponse.data);
      } catch (error) {
        console.error('Error fetching stores:', error.response?.data || error.message);
      }
    };

    fetchStores();
  }, []);

  console.log('Stores:', stores);

  return (
    <div className="stores">
      {stores.length > 0 ? (
        stores.map(store => (
          <div key={store._id} className="store">
            <h3>{store.storeName}</h3>
            <p>{store.storeEmail}</p>
          </div>
        ))
      ) : (
        <p>No stores found.</p>
      )}
    </div>
  );
};
