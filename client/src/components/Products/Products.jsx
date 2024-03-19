import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductsContext';
import { ProductList } from './ProductList/ProductList'; // Ensure the path is correct
import './styles.css';

export const Products = () => {
  const { fetchActiveProducts, activeProducts } = useProducts();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      await fetchActiveProducts();
      setIsLoading(false);
    };

    loadProducts();
  }, [fetchActiveProducts]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProducts(activeProducts);
    } else {
      const filtered = activeProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, activeProducts]);

  return (
    <div className="products">
      {isLoading ? (
        <div>Loading products...</div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <ProductList products={filteredProducts.length > 0 ? filteredProducts : activeProducts} />
        </>
      )}
    </div>
  );
};
