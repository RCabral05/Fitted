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
            // Find if the product with the same size is already in the cart
            const existingProductIndex = currentCart.findIndex(item => 
                item._id === product._id && item.selectedSize === product.selectedSize
            );
    
            let newCart;
            if (existingProductIndex >= 0) {
                // Product with the same size exists, increment the quantity
                newCart = [...currentCart];
                newCart[existingProductIndex].quantity += 1;
            } else {
                // Product with this size doesn't exist, add to the cart with a quantity of 1
                const uniqueId = new Date().getTime(); // Use current timestamp for uniqueness
                newCart = [...currentCart, { ...product, quantity: 1, cartItemId: uniqueId }];
            }
    
            return newCart;
        });
        // Note: Logging here might not reflect the update immediately due to the async nature of setState
    };
    
    

    useEffect(() => {
        // Log each cartItemId whenever the cart changes
        cart.forEach(item => console.log('cartItemId:', item.cartItemId));
    }, [cart]);
    
    

    const updateQuantity = (cartItemId, selectedSize, changeType) => {
        setCart(currentCart => {
            const newCart = currentCart.map(item => {
                // Log the current item to debug
                console.log('i', item);
    
                // Check if the current item matches the cart item ID
                if (item.cartItemId === cartItemId) {
                    // Ensure the item has a variant array and find the matching variant based on the selectedSize
                    const variant = item.variant && item.variant.find(v => v.variantValues[0] && v.variantValues[0].size === selectedSize);
                    console.log(variant);
                    if (variant) {
                        let updatedQuantity = item.quantity;
    
                        if (changeType === 'increment' && updatedQuantity < variant.variantQuantity) {
                            updatedQuantity += 1;
                        } else if (changeType === 'decrement' && updatedQuantity > 1) {
                            updatedQuantity -= 1;
                        }
    
                        // Update the item quantity only if it doesn't exceed the variant quantity
                        if (updatedQuantity <= variant.variantQuantity) {
                            return { ...item, quantity: updatedQuantity };
                        }
                    }
                }
                return item;
            }).filter(item => item.quantity > 0);
    
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
            const id = item._id;
            const title = item.title + (item.variantValues ? ` ${item.variantValues[0].color} ${item.variantValues[0].size}` : '') || item.title;

            // Logging the quantity for each item
            console.log(`Quantity for item ${id}:`, item.quantity);
            console.log('size', item.selectedSize);
            return {
                id: id,
                name: title,
                quantity: item.quantity,  // Directly using the quantity from the item
                price: item.price,
                subtotal: subtotal,
                vendor: item.vendor,
                size: item.selectedSize,
                storeId: item.storeId,
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
