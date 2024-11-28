import {Schema, Types, model} from "mongoose";
import { User } from "@/types";

const userSchema = new Schema<User>({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    required: false,
    default: null,
  },
  occupation: {
    type: String,
    required: true,
    default: "Developer",
  },
  password: {
    type: String,
    required: true,
  },
  followers: [
    {
      type: Types.ObjectId,
      ref: "User",
      default: []
    },
  ],
  following: [
    {
      type: Types.ObjectId,
      ref: "User",
      default: []
    },
  ],
});


const UserModel = model<User>("User", userSchema);

export default UserModel;