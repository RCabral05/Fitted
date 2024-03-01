import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductList } from './ProductList';
// import './styles.css';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  console.log(products);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}api/products`);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching products:', error.response?.data || error.message);
      }
    };

    const fetchStores = async () => {
      try {
        const storesResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}api/stores`);
        setStores(storesResponse.data);
      } catch (error) {
        console.error('Error fetching stores:', error.response?.data || error.message);
      }
    };

    fetchProducts();
    fetchStores();
  }, []);

  console.log('Products:', products);
  console.log('Stores:', stores);

  return (
    <div className="products">
      <ProductList products={products}/>
    </div>
  );
};
