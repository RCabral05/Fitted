import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const StoreSchema = new Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  storeEmail: {
    type: String,
    required: true,
    validate: {
      validator: function(email) {
        // Simple regex for email validation
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: props => `${props.value} is not a valid email address!`
    },
  },
  storeNumber: {
    type: String,
    required: true,
  },
  storeImage: {
    type: String, // URL or path to the image
  },
  referralCode: {
    type: String,
  },
  storeDomain: {
    type: String,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Store = model("Store", StoreSchema);

export default Store;
