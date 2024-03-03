import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

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
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/products/store/${storeId}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products for store:', error);
        }
    }, []); // No dependencies, assuming REACT_APP_BASE_URL doesn't change

    const addProduct = useCallback(async (productData) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}add-product`, productData);
            setProducts(currentProducts => [...currentProducts, response.data]);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    }, []); // No dependencies

    const updateProduct = useCallback(async (id, updatedData) => {
        try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}api/products/${id}`, updatedData);
            setProducts(currentProducts => currentProducts.map(product => product.id === id ? { ...product, ...updatedData } : product));
        } catch (error) {
            console.error('Error updating product:', error);
        }
    }, []); // No dependencies

    const deleteProduct = useCallback(async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}api/products/${id}`);
            setProducts(currentProducts => currentProducts.filter(product => product.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }, []); // No dependencies

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

    return (
        <ProductsContext.Provider value={{
            products,
            fetchProductsForStore,
            addProduct,
            updateProduct,
            deleteProduct,
            fetchProductById
        }}>
            {children}
        </ProductsContext.Provider>
    );
};
