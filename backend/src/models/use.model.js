import mongoose from "mongoose";

const useSchema = new mongoose.Schema({
  fullname:{
    type: String,
    required: true
  },
  imageurl:{
    type: String,
    required: true
  },
  clerkId:{
    type: String,
    required: true,
    unique: true
  },

}, {timestamps: true});

export const user = mongoose.model("user", useSchema);
