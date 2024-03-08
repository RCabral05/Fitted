// CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useProducts } from './ProductsContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    const { fetchProductById } = useProducts();


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
    let detailedCartItems = [];

    for (const item of cart) {
        if (item.productId) {
            try {
                const productDetails = await fetchProductById(item.productId);
                detailedCartItems.push({ ...productDetails, ...item });  // Ensuring cart item's quantity is preserved
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        } else {
            detailedCartItems.push(item);
        }
    }

    console.log('Detailed cart items:', detailedCartItems);

    // Convert cart items to the format expected by your backend / Stripe
    const stripeCartItems = detailedCartItems.map(item => {
        const id = item.variantValues?.[0]?._id || item._id;
        const title = item.title + (item.variantValues ? ` ${item.variantValues[0].color} ${item.variantValues[0].size}` : '') || item.title;

        // Logging the quantity for each item
        console.log(`Quantity for item ${id}:`, item.quantity);

        return {
            id: id,
            name: title,
            quantity: item.quantity,  // Directly using the quantity from the item
            price: item.price,
            subtotal: subtotal,
            vendor: item.vendor,
        };
    });

    console.log('Stripe cart items:', stripeCartItems);
    
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
