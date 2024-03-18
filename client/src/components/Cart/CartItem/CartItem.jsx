import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import { useProducts } from '../../../context/ProductsContext';
import './styles.css';
import TrashIcon from '@mui/icons-material/DeleteOutline';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();
    const { fetchProductById } = useProducts();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            if (!item.productId) {
                return; // If there's no productId, there's no need to fetch the product.
            }
            setIsLoading(true);
            try {
                const productData = await fetchProductById(item.productId);
                console.log('Main product details:', productData);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [item.productId, fetchProductById]);

    if (isLoading) {
        return <div>Loading product details...</div>;
    }

    const imageUrl = item?.images[0] || "https://divtech-project.s3.us-east-2.amazonaws.com/images/default_prod.png";
    const price = item?.price || 0;
    const cartQuantity = item?.quantity || 0;
    const title = item?.title || '';
    const size = typeof item?.selectedSize === 'object' ? item.selectedSize.size : item?.selectedSize;
    // Find the variant that matches the selected size
    const matchingVariant = item.variant.find(v => v.variantValues.find(val => val.size === size));

    // Use the quantity from the matching variant
    const variantQuantity = matchingVariant ? matchingVariant.variantQuantity : null;

    const incrementQuantity = () => {
        if (cartQuantity < variantQuantity) {
            updateQuantity(item.cartItemId, size, 'increment');
        } else {
            alert("You've reached the maximum available quantity for this item.");
        }
    };

    const decrementQuantity = () => {
        if (cartQuantity > 1) {
            updateQuantity(item.cartItemId, size, 'decrement');
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
                <p className="CartItem-price-total">Total: ${(price * cartQuantity).toFixed(2)}</p>
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
