import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const FavoriteSchema = new Schema({
  discordId: {
    type: String,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, {
  timestamps: true
});

const Favorite = model('Favorite', FavoriteSchema);

export default Favorite;
