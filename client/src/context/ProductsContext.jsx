import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [activeProducts, setActiveProducts] = useState([]);
    const [tags, setTags] = useState([]);
    const [storeProducts, setStoreProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // State to manage loading status
    const [favorites, setFavorites] = useState([]);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, []); // No dependencies

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const fetchProductsForStore = useCallback(async (storeId) => {
        console.log(storeId);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/products/store/${storeId}`);
            setStoreProducts(response.data);

        } catch (error) {
            console.error('Error fetching products for store:', error);
        }
    }, []); // No dependencies, assuming REACT_APP_BASE_URL doesn't change

    const addProduct = useCallback(async (productData) => {
        for (let [key, value] of productData.entries()) {
            console.log(key, value);
        }
          try {

            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/add-product`, productData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            setProducts(currentProducts => [...currentProducts, response.data.product]); // Assuming the response includes the product

        } catch (error) {
            console.error('Error adding product:', error);
            throw error; // It's usually a good practice to rethrow the error for further handling
        }
    }, []);


    const fetchActiveProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/active-products`);
            setActiveProducts(response.data);
        } catch (error) {
            console.error('Error fetching active products:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);
      

    useEffect(() => {
        fetchActiveProducts();
    }, [fetchActiveProducts]);
    

    const updateProduct = useCallback(async (id, updatedData) => {
        try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}api/products/${id}`, updatedData);
            setProducts(currentProducts => currentProducts.map(product => product.id === id ? { ...product, ...updatedData } : product));
        } catch (error) {
            console.error('Error updating product:', error);
        }
    }, []); // No dependencies

  // Inside your ProductsProvider
    const deleteProduct = useCallback(async (productId) => {
        try {
        await axios.delete(`${process.env.REACT_APP_BASE_URL}api/products/${productId}`);
        setProducts(currentProducts => currentProducts.filter(product => product._id !== productId));
        console.log('Product deleted successfully');
        } catch (error) {
        console.error('Error deleting product:', error);
        }
    }, []);
  

    const fetchProductById = useCallback(async (productId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/products/${productId}`);
            // You might want to handle the fetched product here
            return response.data;
        } catch (error) {
            console.error("Error fetching product:", error);
            throw error;
        }
    }, []); // No dependencies

    const fetchTags = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/get-tags`);
            setTags(response.data); // Assuming the response is an array of tags
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    }, []);
    // Inside ProductsProvider component

    // Add these functions inside the ProductsProvider component

    // Inside ProductsProvider component

    const addToFavorites = useCallback(async (productId, userId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/favorites`, { userId, productId });
            console.log('Added to favorites:', response.data);
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    }, []);
    
    
    const removeFromFavorites = useCallback(async (productId, userId) => {
        try {
            const url = `${process.env.REACT_APP_BASE_URL}api/favorites/${userId}/${productId}`;
            const response = await axios.delete(url);
            console.log('Removed from favorites:', response.data);
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    }, []);

    const fetchFavorites = useCallback(async (userId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/favorites/${userId}`);
            setFavorites(response.data.data); // Adjust according to your API response structure
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    



    useEffect(() => {
        fetchTags(); // Fetch tags when the component mounts
    }, [fetchTags]);
    return (
        <ProductsContext.Provider value={{
            products,
            storeProducts,
            tags,
            fetchProductsForStore,
            addProduct,
            updateProduct,
            deleteProduct,
            fetchProductById,
            fetchTags,
            fetchActiveProducts,
            addToFavorites,
            removeFromFavorites,
            fetchFavorites,
            favorites,
            activeProducts,
        }}>
            {children}
        </ProductsContext.Provider>
    );
};
