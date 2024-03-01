import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './styles.css';

export const ProductList = (products) => {
  const allProducts= products.products;

  return (
    <div className="productList">
      {allProducts.length > 0 ? (
        allProducts.map(product => (
          <div key={product._id} className="product">
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
