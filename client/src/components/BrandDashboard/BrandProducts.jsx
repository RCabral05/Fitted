import React, { useState } from 'react';
import './styles.css';
import { BrandAddProducts } from './BrandAddProducts';

export function BrandProducts(props) {
  const [view, setView] = useState('products'); // 'add' or 'products'
  const allProducts = props.products;
  const store = props.store[0];

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
        allProducts?.length > 0 ? (
          allProducts.map(product => (
            <table key={product._id} className="product">
              <thead>
                <th>Title</th>
                <th>Status</th>
                <th>Quantity</th>
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
