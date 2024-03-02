import React, { useState } from 'react';
import './styles.css';
import { BrandAddProducts } from './BrandAddProducts';

export function BrandProducts({ products, store }) {
  const [view, setView] = useState('products'); // 'add' or 'products'

  const toggleView = () => {
    setView(view === 'products' ? 'add' : 'products');
  };

  return (
    <div className="brandproducts">
      <button onClick={toggleView}>
        {view === 'products' ? 'Add Product' : 'View Products'}
      </button>

      {view === 'add' && <BrandAddProducts store={store} />}

      {view === 'products' && (
        products?.length > 0 ? (
          products.map(product => (
            <table key={product._id} className="product">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{product.title}</td>
                  <td>{product.status}</td>
                  <td>{product.quantity}</td>
                </tr>
              </tbody>
            </table>
          ))
        ) : (
          <p>No products found.</p>
        )
      )}
    </div>
  );
}
