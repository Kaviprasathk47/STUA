import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: {
    type:String,
    required:false
  },
  date_login: {
    type: Date,
    default: Date.now
  }
});
const User = mongoose.model("User", userSchema);
export default User;

