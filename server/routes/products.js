import express from "express";
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from "dotenv";
import axios from 'axios';
import Products from "../models/Products.js";

dotenv.config({ path: "./config.env" });

const router = express.Router();

router.post("/add-product", async (req, res) => {
    console.log('Request body:', req.body);
    try {
        const product = new Products(req.body);
        await product.save();
        res.status(201).send({ message: "Product added successfully", product });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(400).send(error);
    }
});

router.get('/api/products', async (req, res) => {
    try {
      const products = await Products.find({});
      res.json(products);
    } catch (error) {
      console.error('Error fetching all products:', error);
      res.status(500).json({ message: 'Failed to fetch all products', error: error.toString() });
    }
});

router.get('/api/products/store/:storeId', async (req, res) => {
    try {
        const { storeId } = req.params;
        if (!storeId) {
            return res.status(400).send({ message: "Store ID is required" });
        }

        const products = await Products.find({ storeId: storeId });
        if (products.length === 0) {
            return res.status(404).send({ message: "No products found for the given store ID" });
        }

        res.json(products);
    } catch (error) {
        console.error('Error fetching products for store:', error);
        res.status(500).json({ message: 'Failed to fetch products for the specified store', error: error.toString() });
    }
});

router.get('/api/products/:productId', async (req, res) => {
    console.log('in prod id');
    try {
        const { productId } = req.params; // Extracting productId from the URL parameters
        console.log(productId);
        if (!productId) {
            return res.status(400).send({ message: "Product ID is required" });
        }

        const product = await Products.findById(productId); // Fetching the product by its ID
        if (!product) {
            return res.status(404).send({ message: "Product not found" }); // Product with the given ID doesn't exist
        }
        res.json(product); // Sending the found product as the response
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Failed to fetch product', error: error.toString() });
    }
});



export default router;
