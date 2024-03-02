import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './styles.css';
import { useNavigate } from 'react-router-dom';


export const ProductList = (products) => {
  const allProducts= products.products;
  const navigate = useNavigate();

  const showProductDetails = (productId) => {
    console.log('ID', productId);
    navigate(`/product/${productId}`);
  };

  return (
    <div className="productList">
      {allProducts.length > 0 ? (
        allProducts.map(product => (
          <div key={product._id}  onClick={() => showProductDetails(product._id)}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            {/* Additional product details can be displayed here */}
          </div>
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};
