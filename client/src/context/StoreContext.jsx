import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const StoreContext = createContext();

export const useStores = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const [stores, setStores] = useState([]);

    const fetchStores = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/stores`);
            setStores(response.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    }, []); // No dependencies

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    const createStore = useCallback(async (formData, userId) => {
        try {
            const dataToSubmit = { ...formData, discordId: userId };
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/create-stores`, dataToSubmit);
            setStores(currentStores => [...currentStores, response.data]);
            console.log('Store created:', response.data);
        } catch (error) {
            console.error('Error creating store:', error.response?.data || error.message);
        }
    }, []); // No dependencies

    return (
        <StoreContext.Provider value={{ stores, createStore, fetchStores }}>
            {children}
        </StoreContext.Provider>
    );
};
