import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductsContext';
import { ProductList } from '../Products/ProductList/ProductList';

export const SearchProducts = ({ activeProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProducts(activeProducts);
    } else {
      setFilteredProducts(activeProducts.filter(product => {
        const productName = product.title;
        return productName && productName.toLowerCase().includes(searchTerm.toLowerCase());
      }));
    }
  }, [searchTerm, activeProducts]);

  return (
    <div className="search-active-products">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ProductList products={filteredProducts} />
    </div>
  );
};
