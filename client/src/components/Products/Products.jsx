import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductsContext';
import { ProductList } from './ProductList/ProductList';
import './styles.css';

export const Products = () => {
  const { fetchActiveProducts, products } = useProducts();
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  console.log(products);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching data
        await fetchActiveProducts();
      } catch (error) {
        console.error('Error fetching active products:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching data
      }
    };

    loadProducts();
  }, [fetchActiveProducts]);

  return (
    <div className="products">
      {isLoading ? (
        <div>Loading products...</div> // Display loading message or spinner
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
};
