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
    enum: ['available', 'unavailable', 'discontinued']
  },
  images: [{
    type: String,
    required: true
  }],
  price: {
    type: Number,
    required: true
  },
  compareAtPrice: {
    type: Number
  },
  costPerItem: {
    type: Number
  },
  sku: {
    type: Number,
  },
  quantity: {
    type: Number,
    default: 0
  },
  variant: [{
    type: Schema.Types.ObjectId,
    ref: 'Variant'
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
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
}, {
  timestamps: true
});

const VariantSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    // required: true
  },
  variantImage: {
    type: String
  },
  variantPrice: {
    type: Number,
  },
  variantCostPerItem: {
    type: Number
  },
  variantSku: {
    type: Number
  },
  variantQuantity: {
    type: Number,
    default: 0
  },
  variantName: {
    type: String,
  },
  variantValues: [{
    type: String
  }]
});


const Products = model("Products", ProductSchema);
const Variants = model("Variants", VariantSchema);

export default { Products, Variants };
