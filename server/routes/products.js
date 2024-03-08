import express from "express";
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from "dotenv";
import axios from 'axios';
import Models from "../models/Products.js";
import Tags from '../models/Tags.js';


import { multerUpload, uploadImage } from '../services/aws/bucket.js';


const { Products, Variants } = Models;

dotenv.config({ path: "./config.env" });

const router = express.Router();


router.post("/api/add-product", multerUpload, async (req, res) => {
    const images = req.files['images'] || [];
    const variantImages = req.files['variantImages'] || [];
    console.log('img', images);
    console.log('vimg', variantImages);

    try {
        let uploadedImages = [];
        let uploadedVariantImages = [];

        if (images.length > 0) {
            uploadedImages = await Promise.all(images.map(file => {
                return new Promise((resolve, reject) => {
                    uploadImage(file, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data.Location);
                        }
                    });
                });
            }));
        }

        // Upload variant images
        if (variantImages.length > 0) {
            uploadedVariantImages = await Promise.all(variantImages.map(file => {
                return new Promise((resolve, reject) => {
                    uploadImage(file, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data.Location);
                        }
                    });
                });
            }));
        }

        console.log('Uploaded images:', uploadedImages);
        console.log('Uploaded variant images:', uploadedVariantImages);


        // Extract product data, variants, and tags from req.body
        let { variants = [], ...productData } = req.body;
        productData.images = uploadedImages;

        // Parse tags if they are stringified
        let tags = [];
        try {
            tags = JSON.parse(req.body.tags || '[]');
        } catch (error) {
            console.error('Error parsing tags:', error);
        }

        // Create the product instance
        const newProduct = new Products({ ...productData, storeId: req.body.storeId });

        // Handle tags
        let tagIds = await handleTags(tags);
        newProduct.tags = tagIds;

        // Save the product
        await newProduct.save();

        // Handle variants
        let updatedVariants = await handleVariants(variants, newProduct._id, uploadedVariantImages);

        // Update the product with saved variants
        newProduct.variant = updatedVariants.map(variant => variant._id);
        await newProduct.save();

        res.status(201).send({ message: "Product and variants added successfully", product: newProduct });
    } catch (error) {
        console.error('Error saving product and variants:', error);
        res.status(500).send({ message: "Failed to upload product and variants", error: error.toString() });
    }
});

// Handle the creation or retrieval of tags
async function handleTags(tags) {
    return await Promise.all(tags.map(async tagName => {
        let tag = await Tags.findOne({ name: tagName });
        if (!tag) {
            tag = new Tags({ name: tagName });
            await tag.save();
        }
        return tag._id;
    }));
}

// Handle the creation of variants
async function handleVariants(variants, productId, uploadedVariantImages) {
    return await Promise.all(variants.map(async (variant, index) => {
        console.log('Processing variant:', variant);
        const variantData = {
            ...variant,
            productId: productId,
            variantImage: uploadedVariantImages[index] || '',
            variantValues: {
                color: variant.color || '',
                size: variant.size || '',
                style: variant.style || '',
                material: variant.material || '',
            }
        };
        console.log('Variant data with image:', variantData);
        const newVariant = new Variants(variantData);
        const savedVariant = await newVariant.save();
        console.log('Saved variant:', savedVariant);
        return savedVariant;
    }));
}


router.get('/api/products', async (req, res) => {
    try {
        // Fetch all products and populate the variant field to include variant details
        const products = await Products.find({})
                                        .populate('variant')
                                        .populate('tags');
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
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).send({ message: "Product ID is required" });
        }

        // Fetch the product by ID and populate the variant field
        const product = await Products.findById(productId)
                                                    .populate('variant')
                                                    .populate('tags');
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.json(product);
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

//TAGS
//
//

router.get('/api/get-tags', async (req, res) => {
    try {
        const tags = await Tags.find({});
        res.status(200).json(tags);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ message: "Failed to fetch tags", error: error.toString() });
    }
});



export default router;
