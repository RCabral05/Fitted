import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useStores } from '../../context/StoreContext';

export const Success = () => {
    const location = useLocation();
    const [orderDetails, setOrderDetails] = useState(null);
    const [itemsByVendor, setItemsByVendor] = useState({});
    const [isCartEmptied, setIsCartEmptied] = useState(false);
    const { emptyCart } = useCart();
    const { stores, fetchStores } = useStores();
    console.log('Success component is rendered');

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const sessionId = queryParams.get('session_id');
        console.log(stores);
        console.log('session', sessionId);
        const fetchOrderDetails = async () => {
            if (!sessionId) return;

            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/order-details?sessionId=${sessionId}`);
                setOrderDetails(response.data);
                console.log(orderDetails);
                

                // Empty the cart here if it has not been emptied yet
                if (!isCartEmptied) {
                    emptyCart();
                    setIsCartEmptied(true);
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        if (stores.length > 0) {
            fetchOrderDetails();
        }

   
    }, [location, isCartEmptied, emptyCart, stores]); // Dependency on stores to ensure they are loaded before fetching order details

    return (
        <div>
           
        </div>
    );
};
