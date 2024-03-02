import React, { useState } from 'react';
import './styles.css';
import { useStores } from '../../../../context/StoreContext'; // Import the StoreContext
import { useProducts } from '../../../../context/ProductsContext';
import { BrandAddProducts } from '../AddProducts/BrandAddProducts';
import { BrandUpdateProducts } from '../EditProducts/BrandUpdateProducts';

export function BrandProducts({ products }) {
  const { stores } = useStores(); // Use the StoreContext
  const [view, setView] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { deleteProduct } = useProducts();

  const toggleView = () => {
    setView(view !== 'products' ? 'products' : 'add');
  };

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setView('update');
  };

  const handleDeleteClick = async (productId) => {
    try {
      await deleteProduct(productId);
      console.log('Product deleted successfully');
      // Optionally, refresh the products list or handle UI changes
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="brandproducts">
      <button onClick={toggleView}>
        {view === 'products' ? 'Add Product' : 'View Products'}
      </button>

      {view === 'add' && <BrandAddProducts store={stores[0]} />}
      {view === 'update' && <BrandUpdateProducts initialData={selectedProduct} store={stores[0]} />}

      {view === 'products' && (
        products?.length > 0 ? (
          products.map(product => (
            <div key={product._id} className="product">
              <h3>{product.title}</h3>
              <p>Status: {product.status}</p>
              <p>Quantity: {product.quantity}</p>
              <button className="edit-button" onClick={() => handleUpdateClick(product)}>Edit</button>
              <button className="delete-button" onClick={() => handleDeleteClick(product._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )
      )}
    </div>
  );
}
