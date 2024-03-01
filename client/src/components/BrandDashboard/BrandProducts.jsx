import React, { useState } from 'react';
import './styles.css';
import axios from 'axios';

export function BrandProducts(products) {

  console.log('products', products.products);

  const allProducts = products.products

  return (

    <div className="brandproducts">
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
}
