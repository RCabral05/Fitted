import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'unavailable', 'discontinued'] // Example statuses
  },
  images: [{
    type: String, // Assuming URLs to the images
    required: true
  }],
  price: {
    type: Number,
    required: true
  },
  sku: {
    type: Number,
  },
  quantity: {
    type: Number,
    default: 0 // Set to 0 to handle 'unlimited' by not setting a maximum
  },
  variant: [{
    type: Schema.Types.ObjectId, // Referencing products themselves if they are variants
    ref: 'Product'
  }],
  vendor: {
    type: String,
    required: true
  },
  collections: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  storeId: {
    type: Schema.Types.ObjectId, // Assuming the storeId is an ObjectId
    ref: 'Store', // Adjust this to your actual store model name if it's different
    required: true
  },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const Products = model("Products", ProductSchema);

export default Products;
