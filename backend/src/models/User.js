import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  personnelCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  line: { type: String, required: true },
  role: { type: String, default: "user" }
});

export default mongoose.model("User", UserSchema);
