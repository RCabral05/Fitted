import express from "express";
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from "dotenv";
import axios from 'axios';
import Products from "../models/Products.js";
import { multerUpload, uploadImage } from '../services/aws/bucket.js';



dotenv.config({ path: "./config.env" });

const router = express.Router();

router.post("/api/add-product", multerUpload.array('images', 5), async (req, res) => {
    try {
        let uploadedImages = [];
        const files = req.files;
        console.log(files);
        // Ensure there are files to upload
        if (files.length) {
            const uploadPromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    uploadImage(file, (error, data) => {
                        if (error) {
                            console.log('Upload error for file:', file.originalname, error);
                            reject(error);
                        } else {
                            resolve(data.Location);
                        }
                    });
                });
            });

            // Wait for all uploads to complete
            uploadedImages = await Promise.all(uploadPromises).catch(error => {
                throw new Error(`Failed to upload an image to S3: ${error}`);
            });
        }

        const productData = {
            ...req.body,
            images: uploadedImages, // includes the S3 URLs
        };

        const product = new Products(productData);
        await product.save();
        res.status(201).send({ message: "Product added successfully", product });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).send({ message: "Failed to upload product", error: error.toString() });
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
        // console.log('sid', storeId);
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

router.put('/api/products/:id', async (req, res) => {
    const { id } = req.params; // Extracting the product ID from URL parameters
    const updatedData = req.body; // The updated product data from the request body

    try {
        // Attempting to find the product by ID and update it with the new data
        const product = await Products.findByIdAndUpdate(id, updatedData, { new: true });
        if (!product) {
            // If no product is found with the given ID, send a 404 response
            return res.status(404).send({ message: "Product not found" });
        }

        // If the product is successfully found and updated, send back the updated product data
        res.json({ message: "Product updated successfully", product });
    } catch (error) {
        // If there's an error during the process, log it and send a 500 response
        console.error('Error updating product:', error);
        res.status(500).send({ message: "Failed to update product", error: error.toString() });
    }
});

// In your Express router file

router.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Products.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.send({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send({ message: "Failed to delete product", error: error.toString() });
    }
});



export default router;
