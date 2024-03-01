import express from "express";
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import Store from '../models/Store.js'; // Ensure this path is correct

const router = express.Router();

// Apply rate limiting to the route to prevent abuse
const createAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Validation and sanitization middleware array
const validateStore = [
    body('discordId').trim().isLength({ min: 1 }).withMessage('Discord ID is required.').escape(),
    body('storeName').trim().isLength({ min: 1 }).withMessage('Store name is required.').escape(),
    body('storeEmail').isEmail().withMessage('A valid email is required.').normalizeEmail(),
    body('storeNumber').trim().escape(),
    body('storeImage').optional({ checkFalsy: true }).isURL().withMessage('Store image must be a valid URL.'),
    body('referralCode').optional().trim().escape(),
    body('storeDomain').optional({ checkFalsy: true }).isURL().withMessage('Store domain must be a valid URL.'),
];
  

router.post('/api/stores', createAccountLimiter, validateStore, async (req, res) => {
    console.log('in store');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { discordId, storeName, storeEmail, storeNumber, storeImage, referralCode, storeDomain } = req.body;

    // Here, you'd check if the user has the right to create a store
    // if (!userHasPermission(req.user)) {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    const newStore = new Store({
      discordId,
      storeName,
      storeEmail,
      storeNumber,
      storeImage,
      referralCode,
      storeDomain
    });

    const savedStore = await newStore.save();
    res.status(201).json(savedStore);
  } catch (error) {
    console.error('Error creating the store:', error);
    res.status(500).json({ message: 'Failed to create the store', error});
  }
  
});

// GET route to fetch stores by discordId
router.get('/api/stores/:discordId', async (req, res) => {
    try {
      const { discordId } = req.params;
      const stores = await Store.find({ discordId: discordId });
      res.json(stores);
    } catch (error) {
      console.error('Error fetching stores:', error);
      res.status(500).json({ message: 'Failed to fetch stores', error: error.toString() });
    }
  });
  

export default router;
