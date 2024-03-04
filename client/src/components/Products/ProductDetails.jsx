import React, { useEffect, useState, useContext } from 'react';
// import './styles.css';
import { useProducts } from '../../context/ProductsContext'; // Adjust this import as needed
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const ProductDetails = () => {
    const { productId } = useParams();
    const { fetchProductById } = useProducts(); // Use the newly created function
    const [product, setProduct] = useState(null);
    const [productNotFound, setProductNotFound] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const fetchedProduct = await fetchProductById(productId);
                setProduct(fetchedProduct);
            } catch (error) {
                console.error("Error fetching product:", error);
                setProductNotFound(true);
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId, fetchProductById]);

    return (
        <div className="product-details-container">
            {product ? (
                <div>
                    <li>{product.title}</li>
                    <button id='addCart' onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
            ) : (
                productNotFound ? <p>Product not found.</p> : <p>Loading product...</p>
            )}
        </div>
    );
};

export default ProductDetails;
