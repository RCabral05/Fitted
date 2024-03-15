import express from "express";
import Stripe from "stripe";
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import Models from "../models/Products.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { Products, Variants } = Models;

router.post('/create-checkout-session', async (req, res) => {
  try {
      const { items } = req.body;
      console.log('items', items);

      // Check if items is an array and not undefined
      if (!Array.isArray(items)) {
          throw new Error("Items is not an array or is undefined");
      }
      console.log('i', items);

      const line_items = items.map(item => ({
          price_data: {
              currency: 'usd', // Assuming USD as your currency
              product_data: {
                  name: item.name,
                  metadata: {
                    vendor: item.vendor,
                    size: item.size,
                    productId: item.id,
                    storeId: item.storeId
                  } // Assuming 'name' is a property of your item
                  // Include any other product data needed by Stripe or your application
              },
              unit_amount: parseInt(item.price * 100), // Convert price to cents
          },
          quantity: item.quantity,
      }));
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: line_items,
          mode: 'payment',
          success_url: `http://localhost:3001/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: 'http://localhost:3001/cancel',
          // Include billing and shipping address in the session creation
          // customer_email: billingAddress.email, // Optional, use if you have the customer's email
          billing_address_collection: 'required', // or 'required' if you want to ensure it's collected
          shipping_address_collection: {
              allowed_countries: ['US', 'CA'], // Adjust the countries as needed
          },
          shipping_options: [
              {
                  shipping_rate_data: {
                      type: 'fixed_amount',
                      fixed_amount: {
                          amount: 0, // Free shipping example, set your shipping rate here
                          currency: 'usd',
                      },
                      display_name: 'Standard shipping',
                      // Delivers between 3-5 business days
                      delivery_estimate: {
                          minimum: {
                              unit: 'business_day',
                              value: 3,
                          },
                          maximum: {
                              unit: 'business_day',
                              value: 5,
                          },
                      },
                  },
              },
          ],
      });
    //   console.log(session);

      res.json({ id: session.id });
  } catch (error) {
      console.error("Error in create-checkout-session:", error);
      res.status(500).send(error.message);
  }
});



router.get('/api/order-details', async (req, res) => {
    const sessionId = req.query.sessionId;
  
    if (!sessionId) {
        return res.status(400).send('Session ID is required');
    }
  
    try {
        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ['line_items.data.price.product'], // Ensure line items and products are included
        });
  
        if (session.payment_status === 'paid') {
            // Assuming the session was paid successfully, update product quantities
            const lineItems = session.line_items.data;
            
            for (const item of lineItems) {
                console.log(item);
                const productId = item.price.product.metadata.productId; // Or however you reference your product ID
                const size = item.price.product.metadata.size;
                const quantityPurchased = item.quantity;
                const storeId = item.price.product.metadata.storeId;
                // Update the product quantity in your database
                // This is a pseudo-function, replace it with your actual database update logic
                await updateProductQuantity(productId, size, quantityPurchased);
                await createOrder(productId, size, quantityPurchased, storeId);
            }
  
            res.json({ session, additionalData: 'Order processed successfully' });
        } else {
            // Handle scenarios where payment was not completed
            res.status(402).send('Payment required or not completed');
        }
    } catch (error) {
        console.error('Error fetching order details from Stripe:', error);
        res.status(500).send('Internal Server Error');
    }
  });
  
  async function updateProductQuantity(productId, size, quantityPurchased) {

    try {
        // Retrieve the product by its ID
        const product = await Products.findById(productId).populate('variant');

        if (!product) {
            throw new Error('Product not found.');
        }

       
        // Initialize the variable to store the variant to update
        let variantToUpdate = null;

        // Iterate over the array of variant IDs in the product
        for (let variantId of product.variant) {
            let variant = await Variants.findById(variantId);

            // Ensure the variant exists and has the specified size
            if (variant && variant.variantValues[0].size === size) {
                variantToUpdate = variant;
                break;
            }
        }

        // Check if the variant to update has been found
        if (!variantToUpdate) {
            throw new Error('Variant with specified size not found.');
        }

        // Verify there's enough stock to fulfill the order
        if (variantToUpdate.variantQuantity < quantityPurchased) {
            throw new Error('Not enough stock for the requested quantity.');
        }

        // Update the variant quantity
        variantToUpdate.variantQuantity -= quantityPurchased;
        await variantToUpdate.save();

        return { success: true, message: "Product quantity updated successfully." };
    } catch (error) {
        console.error("Error updating product quantity:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}

async function createOrder(productId, size, quantityPurchased, storeId) {
    console.log("Starting create Order with:", { productId, size, quantityPurchased, storeId });

    try {
       
    } catch (error) {
        
    }
}


  



export default router;
