import mongoose from 'mongoose';

mongoose.connect("mongodb://127.0.0.1:27017/testDB");

const { Schema } = mongoose;

const charitiesSchema = new Schema({
  created_by: String,
  charity_name: String,
  charity_description: String,
  current_funding: Number,
  target_funding: Number,
}, { timestamps: true });

export const Charities = mongoose.model("Charities", charitiesSchema);