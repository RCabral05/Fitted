// CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

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

    

    const addToCart = (product) => {
        console.log('added to cart', product);
        setCart(currentCart => {
            // Find if the product is already in the cart based on its unique ID
            const existingProductIndex = currentCart.findIndex(item => item._id === product._id);
    
            let newCart;
            if (existingProductIndex >= 0) {
                // Product exists, increment the quantity
                newCart = [...currentCart];
                newCart[existingProductIndex].quantity += 1;
            } else {
                // Product doesn't exist, add to the cart with a quantity of 1
                const uniqueId = new Date().getTime(); // Use current timestamp for uniqueness
                newCart = [...currentCart, { ...product, quantity: 1, cartItemId: uniqueId }];
            }
    
            return newCart;
        });
        console.log('cart', cart);
    };
    

    useEffect(() => {
        // Log each cartItemId whenever the cart changes
        cart.forEach(item => console.log('cartItemId:', item.cartItemId));
    }, [cart]);
    
    

    const updateQuantity = (cartItemId, changeType) => {
        setCart(currentCart => {
            const newCart = currentCart.map(item => {
                console.log(item);
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
