import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const CollectionContext = createContext();

export const useCollections = () => useContext(CollectionContext);

export const CollectionProvider = ({ children }) => {
    const [collections, setCollections] = useState([]);

    const createCollection = useCallback(async (collectionData) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/collections`, collectionData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setCollections(prev => [...prev, response.data]);
        } catch (error) {
            console.error('Error creating collection:', error);
        }
    }, []);

    const fetchCollections = useCallback(async (storeId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/collections/${storeId}`);
            setCollections(response.data.collections);
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    }, []);

    return (
        <CollectionContext.Provider value={{ collections, createCollection, fetchCollections }}>
            {children}
        </CollectionContext.Provider>
    );
};

export default CollectionProvider;
