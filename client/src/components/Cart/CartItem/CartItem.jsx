import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import { useProducts } from '../../../context/ProductsContext';
import './styles.css';
import TrashIcon from '@mui/icons-material/DeleteOutline';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();
    const { fetchProductById } = useProducts();
    const [mainProduct, setMainProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            if (!item.productId) {
                // If the item is not a variant (or doesn't have a productId), don't fetch the main product.
                return;
            }
            try {
                setIsLoading(true);
                const productData = await fetchProductById(item.productId);
                setMainProduct(productData);
                console.log('mp', mainProduct);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [item.productId, item._id, fetchProductById]);

    // Show loading indicator only if we are actually loading data.
    if (isLoading) {
        return <div>Loading product details...</div>;
    }

    // Choose what to display: variant details or main product details
    const imageUrl = item.variantImage || item?.images[0] || "https://divtech-project.s3.us-east-2.amazonaws.com/images/default_prod.png";
    const price = item.variantPrice || item.price || mainProduct?.price;
    const cartQuantity = item.quantity;
    const productQuantity = item.variantQuantity || mainProduct?.quantity || mainProduct?.stockQuantity;
    const title = item.title || mainProduct?.title;
    const size  = item.selectedSize || {};

    const incrementQuantity = () => {
        if (cartQuantity < productQuantity) {
            updateQuantity(item.cartItemId, 'increment');
        } else {
            alert("You've reached the maximum available quantity for this item.");
        }
    };

    const decrementQuantity = () => {
        if (cartQuantity > 1) {
            updateQuantity(item.cartItemId, 'decrement');
        } else {
            alert("Minimum quantity reached. Remove the item if needed.");
        }
    };

    return (
        <div className="CartItem-container">
            <img className="CartItem-image" src={imageUrl} alt="Product" />
            <div className="CartItem-details">
                <h3 className="CartItem-title">{title} - {size}</h3>
                <p className="CartItem-price">${price.toFixed(2)}</p>
                <p className="CartItem-price-total">Total: ${price * cartQuantity.toFixed(2)}</p>
                <div className="CartItem-quantity-controls">
                    <button className="CartItem-quantity-decrease" onClick={decrementQuantity}>-</button>
                    <span className="CartItem-quantity">{cartQuantity}</span>
                    <button className="CartItem-quantity-increase" onClick={incrementQuantity}>+</button>
                    <button className="CartItem-remove" onClick={() => removeFromCart(item.cartItemId)}><TrashIcon /></button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
