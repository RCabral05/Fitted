import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const StoreContext = createContext();

export const useStores = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/stores`);
            setStores(response.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    const createStore = async (formData, userId) => {
        try {
            const dataToSubmit = { ...formData, discordId: userId };
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/create-stores`, dataToSubmit);
            console.log('Store created:', response.data);
            // Optionally update local state, e.g., setStores([...stores, response.data])
        } catch (error) {
            console.error('Error creating store:', error.response?.data || error.message);
        }
    };

    return (
        <StoreContext.Provider value={{ stores, createStore, fetchStores }}>
            {children}
        </StoreContext.Provider>
    );
};
