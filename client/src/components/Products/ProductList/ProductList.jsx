import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import { useNavigate } from 'react-router-dom';


export const ProductList = ({ products }) => {
  const allProducts = products;
  const navigate = useNavigate();
  const showProductDetails = (productId) => {
    console.log('ID', productId);
    navigate(`/product/${productId}`);
  };

  return (
    <div className="productList">
      {allProducts.length > 0 ? (
        allProducts.map(product => (
          <div key={product._id} onClick={() => showProductDetails(product._id)} className="productCard">
            <img src={product?.images[0]} alt={product.title} className="productImage"/>
            <h3>{product.title}</h3>
            <p>Price: ${product.price}</p>
            {/* Additional product details can be displayed here */}
          </div>
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

