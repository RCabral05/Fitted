import express from "express";
import multer from "multer";
import Collection from '../models/Collections.js'; // Adjust the import path as needed
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const router = express.Router();

// Setup multer for file handling
const upload = multer({ dest: 'uploads/' });

router.post('/api/collections', upload.single('collectionImage'), async (req, res) => {
    try {
        const { collectionName, collectionDescription, storeId, productIds } = req.body;
        const collectionImage = req.file ? req.file.path : ''; // Get the path of the uploaded file

        // Validate storeId
        if (!storeId) {
            return res.status(400).json({ message: "Store ID is required" });
        }

        // Ensure productIds is an array, handling it as a string if only one productId is passed
        let parsedProductIds = [];
        if (productIds) {
            parsedProductIds = typeof productIds === 'string' ? [productIds] : productIds.slice();
        }

        // Create a new collection document and save it to the database
        const newCollection = new Collection({
            collectionName,
            collectionDescription,
            collectionImage,
            storeId, // Include the storeId in the collection document
            productIds: parsedProductIds // Save the array of productIds
        });

        await newCollection.save();

        res.status(201).json({
            message: "Collection created successfully",
            collection: newCollection
        });
    } catch (error) {
        console.error('Failed to create collection:', error);
        res.status(500).json({ message: "Failed to create collection", error: error.toString() });
    }
});

router.get('/api/collections/:storeId', async (req, res) => {
    try {
        const { storeId } = req.params;
        if (!storeId) {
            return res.status(400).json({ message: "Store ID is required" });
        }

        const collections = await Collection.find({ storeId });
        res.status(200).json({ collections });
    } catch (error) {
        console.error('Failed to fetch collections:', error);
        res.status(500).json({ message: "Failed to fetch collections", error: error.toString() });
    }
});


export default router;
