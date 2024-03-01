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
    type: String // Assuming URLs to the images
  }],
  price: {
    type: Number,
    required: true
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
  collection: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const Products = model("Product", ProductSchema);

export default Products;
