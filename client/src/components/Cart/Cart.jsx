import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem/CartItem';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export const Cart = () => {
    const { cart, emptyCart, checkout } = useCart();
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log('Cart updated:', cart);
    }, [cart]);

    const calculateSubtotal = () => {
        return cart.reduce((total, item) => {
            console.log('item', item);
            // Check if a selectedVariant exists and use its price, otherwise default to a predefined value
            return total + (item.price || item.variantPrice * item.quantity);
        }, 0);
    };
    

    const handleCheckout = () => {
        const subtotal = calculateSubtotal();
        checkout(subtotal); 
    };

    const startShopping = () => {
        navigate('/');
    }

    return (
        <div className="Cart-container">
            <h1><span style={{ color: 'rgb(49, 180, 255)'}}>| </span>Checkout</h1>
            <div className="Cart-items-container">
                {cart.length === 0 ? (
                    <p className="Cart-empty-message">Your cart is empty. <span onClick={startShopping} style={{ color: 'rgb(49, 180, 255)', textDecoration: 'underline', cursor: 'pointer' }}>Start Shopping!</span></p>
                ) : (
                    cart.map((item) => <CartItem key={item.cartItemId} item={item} />)
                )}
            </div>
            {cart.length > 0 && (
                <div className="Cart-footer">
                    <div className="Cart-subtotal">
                        <p className="Cart-subtotal-text"><span style={{ color: 'rgb(49, 180, 255)'}}>Total: </span> ${calculateSubtotal().toFixed(2)}</p>
                        <div className="Cart-actions">
                            <button className="Cart-empty-button" onClick={emptyCart}>Empty Cart</button>
                            <button className="Cart-checkout-button" onClick={handleCheckout}>
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
