import { Schema, Types, model } from "mongoose";
import { User } from "@/types";

const socialAccountSchema = new Schema({
  platform: { type: String, required: true },
  link: { type: String, required: true },
});

const userSchema = new Schema<User>(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: false,
      default: "",
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String,
      required: false,
      default: "",
    },
    coverpic: {
      type: String,
      required: false,
      default: "",
    },
    occupation: {
      type: String,
      required: false,
      default: "Developer",
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider == "credentials";
      },
    },
    hasBlog: {
      type: Boolean,
      default: false
    },
    followers: [
      {
        type: Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    followingBlogs: [
      {
        type: Types.ObjectId,
        ref: "Blog",
        default: [],
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    socialAccounts: {
      type: [socialAccountSchema],
      default: [],
    },
    savePost: [
      {
        type: Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
    saveBlogpost: [
      {
        type: Types.ObjectId,
        ref: "BlogPost",
        default: [],
      },
    ],
    authProvider: {
      type: String,
      enum: ["local", "github", "linkedin", "google"],
      required: true,
      default: "local",
    },
  },
  { timestamps: true }
);

const UserModel = model<User>("User", userSchema);

export default UserModel;
