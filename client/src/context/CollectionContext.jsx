import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const CollectionContext = createContext();

export const useCollections = () => useContext(CollectionContext);

export const CollectionProvider = ({ children }) => {
    const [collections, setCollections] = useState([]);

    // Memoizing the function using useCallback
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
    }, []); // No dependencies

    // Include any additional functions here, memoized with useCallback if they will be used as dependencies or passed to children

    return (
        <CollectionContext.Provider value={{ collections, createCollection }}>
            {children}
        </CollectionContext.Provider>
    );
};

export default CollectionProvider;
