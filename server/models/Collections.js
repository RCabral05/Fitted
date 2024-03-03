import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const collectionSchema = new Schema({
  collectionName: {
    type: String,
    required: [true, 'A collection must have a name'],
    trim: true,
  },
  collectionDescription: {
    type: String,
    trim: true,
  },
  collectionImage: {
    type: String,
    required: [true, 'A collection must have an image'],
  },
  productIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'A collection must be associated with a store']
  }
}, {
  timestamps: true
});

const Collection = model('Collection', collectionSchema);

export default Collection;
