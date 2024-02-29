import { connect, set } from "mongoose";
import mongoose from 'mongoose';
// import Store from '../models/Store.js'

export function connectToServer() {
  set("strictQuery", false);
  connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(async function () {
      console.log("mongodb connected");
      // await Store.syncIndexes();
    })
    .catch(function (err) {
      console.log(err);
    });
}