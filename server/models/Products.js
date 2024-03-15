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
  variant: [{
    type: Schema.Types.ObjectId,
    ref: 'Variants'
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
    type: String,
    ref: 'Tag'
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
  variantQuantity: {
    type: Number,
    default: 0
  },
  variantName: {
    type: String,
  },
  variantValues: [{
    color: String,
    size: String,
    style: String,
    material: String,
  }]
  
});


const Products = model("Products", ProductSchema);
const Variants = model("Variants", VariantSchema);

export default { Products, Variants };
