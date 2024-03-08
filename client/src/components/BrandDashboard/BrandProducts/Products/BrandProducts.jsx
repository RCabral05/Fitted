import React, { useState } from 'react';
import './styles.css';
import { useStores } from '../../../../context/StoreContext'; // Adjust the import path as needed
import { useProducts } from '../../../../context/ProductsContext';
import { BrandAddProducts } from '../AddProducts/BrandAddProducts';
import { BrandUpdateProducts } from '../EditProducts/BrandUpdateProducts';

export function BrandProducts({ products, store }) {
  const { stores } = useStores();
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
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="brandproducts">
      <button onClick={toggleView}>
        {view === 'products' ? 'Add Product' : 'View Products'}
      </button>

      {view === 'add' && <BrandAddProducts store={store} />}
      {view === 'update' && <BrandUpdateProducts initialData={selectedProduct} store={stores[0]} />}

      {view === 'products' && (
        products?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product.title}</td>
                  <td>{product.status}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleUpdateClick(product)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteClick(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products found.</p>
        )
      )}
    </div>
  );
}
