import express from "express";
import Stripe from "stripe";
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  try {
      const { items } = req.body;
      

      // Check if items is an array and not undefined
      if (!Array.isArray(items)) {
          throw new Error("Items is not an array or is undefined");
      }

      const line_items = items.map(item => ({
          price_data: {
              currency: 'usd', // Assuming USD as your currency
              product_data: {
                  name: item.name,
                  metadata: {
                    vendor: item.vendor,
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
        expand: ['line_items.data.price.product'], // Add this line to expand the line_items
      });
      // Send back the necessary order details
      res.json({ session, additionalData: '...' }); // Replace 'additionalData' with actual data you wish to send
  } catch (error) {
      console.error('Error fetching order details from Stripe:', error);
      res.status(500).send('Internal Server Error');
  }
});



export default router;
