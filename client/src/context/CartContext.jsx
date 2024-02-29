// CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    const [inactivityTimer, setInactivityTimer] = useState(null);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));

        // Resetting inactivity timer whenever the cart changes
        // resetInactivityTimer();
    }, [cart]);

    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
    
        if (cart.length === 0) {
            // If the cart is empty, do not set any timers
            return;
        }
    
        // First timer for the abandoned cart reminder after 30 minutes
        const reminderTimer = setTimeout(() => {
            if (cart.length > 0) { // Check again as the cart might have changed
                remindAbandonedCart();
    
                // Second timer to clear the cart after an additional 11.5 hours
                const clearCartTimer = setTimeout(() => {
                    if (cart.length > 0) { // Final check before clearing the cart
                        emptyCart();
                    }
                }, 1000 * 60 * 1); 
    
                setInactivityTimer(clearCartTimer);
            }
        }, 1000 * 60 * .5);
    
        setInactivityTimer(reminderTimer);
    };
    const remindAbandonedCart = () => {
        // Implement reminder logic here (e.g., send email or show notification)
        console.log('Reminder: You have items in your cart!');
    };

    const addToCart = (product, variant) => {
        console.log('added to cart', product, variant);
        setCart(currentCart => {
            const productWithVariant = { ...product, selectedVariant: variant };
            const existingProductIndex = currentCart.findIndex(item => 
                item.id === productWithVariant.id && item.selectedVariant.id === variant.id
            );
    
            let newCart;
            if (existingProductIndex >= 0) {
                newCart = [...currentCart];
                newCart[existingProductIndex].quantity += 1;
            } else {
                const uniqueId = new Date().getTime(); // Use current timestamp for uniqueness
                newCart = [...currentCart, { ...productWithVariant, quantity: 1, cartItemId: uniqueId }];
            }
    
            return newCart;
        });
    };

    useEffect(() => {
        // Log each cartItemId whenever the cart changes
        cart.forEach(item => console.log('cartItemId:', item.cartItemId));
    }, [cart]);
    
    

    const updateQuantity = (cartItemId, changeType) => {
        setCart(currentCart => {
            const newCart = currentCart.map(item => {
                if (item.cartItemId === cartItemId) {
                    let updatedQuantity = item.quantity;
                    if (changeType === 'increment') {
                        updatedQuantity += 1;
                    } else if (changeType === 'decrement' && item.quantity > 1) {
                        updatedQuantity -= 1;
                    }
                    return { ...item, quantity: updatedQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0);
            console.log('updating', newCart); // Log the new cart to see if it's updated
            return newCart;
        });
    };
    
    

    const removeFromCart = (cartItemId) => {
        setCart(currentCart => currentCart.filter(item => item.cartItemId !== cartItemId));
    };
    

    

    const emptyCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const checkout = async (subtotal) => {
        console.log('Proceeding to checkout with cart items:', cart);
        console.log('Subtotal:', subtotal);
    
        // Convert cart items to the format expected by your backend / Stripe
        const stripeCartItems = cart.map(item => ({
            id: item.selectedVariant.id,
            name: item.title,
            quantity: item.quantity,
            price: item.selectedVariant.price,
            subtotal: subtotal,
            vendor: item.vendor,
            selectedVariant: item.selectedVariant,
            // Add other necessary item details required by your backend
        }));
        
    
        try {
            const stripe = await stripePromise;
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}create-checkout-session`, {
                items: stripeCartItems,
                successUrl: window.location.origin + '/success', // Add success URL
                cancelUrl: window.location.origin + '/cancel', // Add cancel URL
            });
    
            const session = response.data;
            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });
    
            if (result.error) {
                alert(result.error.message);
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, emptyCart, updateQuantity, removeFromCart, checkout }}>
            {children}
        </CartContext.Provider>
    );
};
