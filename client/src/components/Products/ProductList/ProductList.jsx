import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoriteButton } from '../../FavoriteButton/FavoriteButton';
import './styles.css';

export const ProductList = ({ products }) => {
  const navigate = useNavigate();

  const showProductDetails = (productId, event) => {
    event.stopPropagation(); // Prevents the event from bubbling up to the parent
    navigate(`/product/${productId}`);
  };

  return (
    <div className="productList">
      {products.length > 0 ? (
        products.map(product => (
          <div key={product._id} className="productCard">
            <img src={product?.images[0] || 'default-image-path.jpg'} alt={product.title} className="productImage" onClick={(e) => showProductDetails(product._id, e)}/>
            <h3>{product.title}</h3>
            <p>Price: ${product.price}</p>
            <FavoriteButton productId={product._id} />
            {/* Additional product details can be displayed here */}
          </div>
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};
