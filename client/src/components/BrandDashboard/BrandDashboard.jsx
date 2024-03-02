import React, { useContext, useState, useEffect } from 'react';
import { BrandDetails } from './BrandDetails';
import { BrandAddProducts } from './BrandAddProducts';
import { AuthContext } from '../../context/AuthContext';
import { BrandProducts } from './BrandProducts';
import axios from 'axios';

export function BrandDashboard() {
  const { user } = useContext(AuthContext);
  const [store, setStore] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeView, setActiveView] = useState('details');
  useEffect(() => {
    const fetchStore = async () => {
      if (user && user.id) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/stores/${user.id}`);
          setStore(response.data);
        } catch (error) {
          console.error('Error fetching stores:', error.response?.data || error.message);
        }
      }
    };

    fetchStore();
  }, [user]);

  const fetchProductsForStore = async (storeId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/products/store/${storeId}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (store.length > 0) {
      // Automatically fetch products for the first store as an example
      fetchProductsForStore(store[0]._id);
    }
  }, [store]);

  return (
    <div>
      <button onClick={() => setActiveView('details')}>Details</button>
      <button onClick={() => setActiveView('products')}>Products</button>

      {activeView === 'details' && <BrandDetails store={store} />}
      {activeView === 'products' && <BrandProducts store={store} products={products}/>}
    </div>
  );
}
