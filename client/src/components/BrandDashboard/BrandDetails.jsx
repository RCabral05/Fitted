import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export function BrandDetails() {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      if (user && user.id) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/stores/${user.id}`);
          setStores(response.data); // Assuming this is an array of store objects
        } catch (error) {
          console.error('Error fetching stores:', error.response?.data || error.message);
        }
      }
    };

    fetchStores();
  }, [user]);

  return (
    <div>
      {stores.length > 0 ? (
        <ul>
          {stores.map((store, index) => (
            <li key={index}>
              <h2>{store.storeName}</h2>
              <p>Email: {store.storeEmail}</p>
              <p>Number: {store.storeNumber}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No stores found.</p>
      )}
    </div>
  );
}
