import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  date_login: {
    type: Date,
    default: Date.now
  },
  preferences: {
    transportMode: { type: String, default: 'Car' },
    emissionUnit: { type: String, default: 'kg' },
    distanceUnit: { type: String, default: 'km' }
  },
  isOnboarded: {
    type: Boolean,
    default: false
  }
});
const User = mongoose.model("User", userSchema);
export default User;

