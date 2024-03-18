import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductsContext';
import { ProductList } from './ProductList/ProductList';
import './styles.css';

export const Products = () => {
  const { fetchActiveProducts, activeProducts } = useProducts();
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  console.log(activeProducts);
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      await fetchActiveProducts();
      setIsLoading(false);
    };

    loadProducts();
  }, [fetchActiveProducts]);

  return (
    <div className="products">
      {isLoading ? (
        <div>Loading products...</div> // Display loading message or spinner
      ) : (
        <ProductList products={activeProducts} />
      )}
    </div>
  );
};
