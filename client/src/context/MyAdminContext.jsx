import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const MyAdminContext = createContext();

export const useMyAdmin = () => useContext(MyAdminContext);

export const MyAdminProvider = ({ children }) => {
    const [tags, setTags] = useState([]);

    const createTag = useCallback(async (tagName) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/tags`, { name: tagName });
            const newTag = response.data;
            setTags(currentTags => [...currentTags, newTag]);
        } catch (error) {
            console.error('Error creating tag:', error);
        }
    }, [tags]);

    const editTag = useCallback(async (id, newName) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}api/tags/${id}`, { name: newName });
            const updatedTag = response.data;
            setTags(currentTags => currentTags.map(tag => tag._id === id ? updatedTag : tag));
        } catch (error) {
            console.error('Error updating tag:', error);
        }
    }, [tags]);

    const deleteTag = useCallback(async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}api/tags/${id}`);
            setTags(currentTags => currentTags.filter(tag => tag._id !== id));
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    }, [tags]);

    const fetchTags = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/get-tags`);
            setTags(response.data); // Assuming the response is an array of tags
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    }, []);

    useEffect(() => {
        fetchTags(); // Fetch tags when the component mounts
    }, [fetchTags]);

    return (
        <MyAdminContext.Provider value={{ tags, createTag, editTag, deleteTag }}>
            {children}
        </MyAdminContext.Provider>
    );
};
