import mongoose from "mongoose";

//creating a new Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: {},
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0, //it is set to false
    },
  },
  { timestamps: true } //everytime a user is created, the created time is mentioned
);

export default mongoose.model("users", userSchema); //User is the name of the model, users is the name of the collection we have created in the ecommerce database
