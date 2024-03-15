import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useStores } from '../../context/StoreContext';

export const Success = () => {
    const location = useLocation();
    const [orderDetails, setOrderDetails] = useState(null);
    const { emptyCart } = useCart();
    const { stores, fetchStores } = useStores();
    const isCartEmptiedRef = useRef(false);
    const fetchedOrderDetailsRef = useRef(false);

    console.log('Success component is rendered');

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const sessionId = queryParams.get('session_id');
        console.log('Stores available:', stores);
        console.log('Session ID:', sessionId);

        const fetchOrderDetails = async () => {
            if (!sessionId) return;

            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/order-details?sessionId=${sessionId}`);
                setOrderDetails(response.data);

                // Check and empty the cart using a ref to ensure it happens once
                if (!isCartEmptiedRef.current) {
                    emptyCart();
                    isCartEmptiedRef.current = true;
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        if (stores.length > 0 && !fetchedOrderDetailsRef.current) {
            fetchOrderDetails();
            fetchedOrderDetailsRef.current = true;
        }

    }, [location, emptyCart, stores]);
    return (
        <div>
           
        </div>
    );
};
