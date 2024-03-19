import express from "express";
import Favorite from "../models/Favorite.js"; // Adjust the path as necessary
// Import other required models, like User or Product, if needed
import Models from "../models/Products.js";
const { Products, Variants } = Models;
const router = express.Router();

// Route to add a product to favorites
router.post("/api/favorites", async (req, res) => {
    const { userId, productId } = req.body;
  
    try {
      // Check if the favorite already exists
      const existingFavorite = await Favorite.findOne({ discordId: userId, product: productId });
      
      if (existingFavorite) {
        return res.status(409).json({ message: "This product is already in favorites." });
      }
  
      const newFavorite = await Favorite.create({
        discordId: userId,
        product: productId
      });
  
      res.status(201).json({ message: "Product added to favorites", data: newFavorite });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  

// Route to remove a product from favorites
router.delete("/api/favorites/:userId/:productId", async (req, res) => {
    try {
      const { userId, productId } = req.params;
  
      const favorite = await Favorite.findOneAndDelete({
        discordId: userId,  // Ensure this matches the schema field name
        product: productId
      });
  
      if (!favorite) {
        return res.status(404).json({ message: "Favorite not found" });
      }
  
      res.status(200).json({ message: "Product removed from favorites" });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

// Route to get all favorites for a user
router.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.find({ discordId: userId });

    if (!favorites.length) {
      return res.status(404).json({ message: "No favorites found" });
    }

    const productIds = favorites.map(fav => fav.product);

    const products = await Products.find({
      '_id': { $in: productIds }
    }).populate('variant');

    res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get('/api/favorites/:userId/:productId', async (req, res) => {
    const { userId, productId } = req.params;

    try {
        // Look for the favorite record in the database
        const favorite = await Favorite.findOne({
            discordId: userId, 
            product: productId
        });

        // Respond with the favorite status: true if found, false otherwise
        res.status(200).json({ isFavorite: !!favorite });
    } catch (error) {
        console.error('Error fetching favorite status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
