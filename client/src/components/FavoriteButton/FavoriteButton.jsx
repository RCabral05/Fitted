import React, { useState, useContext, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AuthContext } from '../../context/AuthContext'; // Adjust the import path as per your directory structure
import { useProducts } from '../../context/ProductsContext'; // Import the useProducts hook
import axios from 'axios';

export const FavoriteButton = ({ productId }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const { user } = useContext(AuthContext); // Retrieve the discordId from AuthContext
    const { addToFavorites, removeFromFavorites } = useProducts(); // Use the context functions

    useEffect(() => {
        // Optionally, check if the product is already a favorite
        const fetchFavoriteStatus = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/favorites/${user.id}/${productId}`);
                setIsFavorite(response.data.isFavorite);
            } catch (error) {
                console.error('Error fetching favorite status:', error);
            }
        };

        if (user?.id && productId) {
            fetchFavoriteStatus();
        }
    }, [user.id, productId]);

    const toggleFavorite = async () => {
        if (isFavorite) {
            try {
                await removeFromFavorites(productId, user.id);
                setIsFavorite(false);
            } catch (error) {
                console.error('Error removing from favorites:', error);
            }
        } else {
            try {
                await addToFavorites(productId, user.id);
                setIsFavorite(true);
            } catch (error) {
                console.error('Error adding to favorites:', error);
            }
        }
    };

    return (
        <IconButton onClick={toggleFavorite} aria-label="add to favorites">
            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
    );
};
