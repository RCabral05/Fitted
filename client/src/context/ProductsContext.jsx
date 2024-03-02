// ProductsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchStores();
    }, []);

    // Product Functions

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };



    const fetchProductsForStore = async (storeId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/products/store/${storeId}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products for store:', error);
        }
    };

    const addProduct = async (productData) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/products`, productData);
            setProducts([...products, response.data]);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const updateProduct = async (id, updatedData) => {
        try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}api/products/${id}`, updatedData);
            const updatedProducts = products.map(product => product.id === id ? { ...product, ...updatedData } : product);
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}api/products/${id}`);
            const filteredProducts = products.filter(product => product.id !== id);
            setProducts(filteredProducts);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const fetchProductById = async (productId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/products/${productId}`);
            if (response.data) {
                // Assuming you want to set this product in the context
                // setProduct(response.data); // You need to have a state for individual product
                return response.data; // Or simply return the product data
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            throw error; // You might want to throw the error or handle it as needed
        }
    };

// ================================================================================================================================================
// ================================================================================================================================================
// ================================================================================================================================================
// ================================================================================================================================================
// ================================================================================================================================================
// Stores Functions

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
            // Update local state if necessary, e.g., setStores([...stores, response.data])
        } catch (error) {
            console.error('Error creating store:', error.response?.data || error.message);
        }
    };

    return (
        <ProductsContext.Provider value={{ products, stores, createStore, fetchProductsForStore, addProduct, updateProduct, deleteProduct, fetchProductById }}>
            {children}
        </ProductsContext.Provider>
    );
};
