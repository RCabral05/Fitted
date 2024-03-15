import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../../context/ProductsContext';
import { useCart } from '../../../context/CartContext';
import './styles.css'; // Ensure your CSS file is correctly imported

export const ProductDetails = () => {
  const { productId } = useParams();
  const { fetchProductById } = useProducts();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const fetchedProduct = await fetchProductById(productId);
        setProduct(fetchedProduct);
        if (fetchedProduct && fetchedProduct.images.length > 0) {
          setSelectedImage(fetchedProduct.images[0]);
        }
        if (fetchedProduct && fetchedProduct.variant.length > 0) {
          setSelectedSize(fetchedProduct.variant[0].variantValues[0].size);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, fetchProductById]);

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      selectedSize: selectedSize
    };
    addToCart(itemToAdd);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details-container">
      <div className="product-details-image-slider">
        <img src={selectedImage} alt="Product" style={{ width: '100%', height: 'auto' }} />
        <div className="product-details-thumbnail-container">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="Thumbnail"
              className="product-details-thumbnail"
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </div>
      <div className="product-details-info">
        <h1 className="product-details-title">{product.title}</h1>
        <p className="product-details-description">{product.description}</p>
        <strong className="product-details-price">Price: ${product.price}</strong>
        <h3 className="product-details-size-heading">Select Size:</h3>
        <div className="product-details-sizes">
          {product.variant.map((variant, index) => (
            <button 
              key={index} 
              className={`product-details-size-button ${selectedSize === variant.variantValues[0].size ? 'product-details-selected-size' : ''}`}
              onClick={() => setSelectedSize(variant.variantValues[0].size)}
            >
              {variant.variantValues[0].size}
            </button>
          ))}
        </div>
      </div>
      <button className="product-details-add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductDetails;
