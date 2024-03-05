import React, { useContext, useEffect } from 'react';
import { useProducts } from '../../context/ProductsContext'; // Import the context you created
import { ProductList } from './ProductList/ProductList';
// import './styles.css';

export const Products = () => {
  // Use useContext hook to access the context values and functions
  const { products } = useProducts();

  useEffect(() => {
    console.log('Products:', products);
  }, [products]); // useEffect will re-run when products or stores change

  return (
    <div className="products">
      <ProductList products={products} />
    </div>
  );
};
