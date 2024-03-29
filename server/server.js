// Imports
import express, { json } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import stores from './routes/stores.js';
import discord from './routes/discord.js';
import { connectToServer } from "./db/conn.js";
import products from './routes/products.js';
import collections from './routes/collections.js';
import myAdmin from './routes/myAdmin.js';
import stripe from './routes/stripe.js';
import favorite from './routes/favorite.js'

// Initialize Express
const app = express();

// Environment setup
dotenv.config({ path: "./config.env" });

// Middleware setup
app.use(cors());
app.use(json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(discord);
app.use(stores);
app.use(products);
app.use(collections);
app.use(myAdmin);
app.use(stripe);
app.use(favorite);
// Constants
const port = process.env.PORT || 3001;

// Start Server
app.listen(port, () => {
    // Connect to database
    connectToServer((err) => {
        if (err) console.error(err);
    });
    console.log(`Server is running on port: ${port}`);
});
