import mongoose from 'mongoose';

mongoose.connect("mongodb://127.0.0.1:27017/testDB");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
