import { Schema, model } from "mongoose";
import { Post } from "@/types";

const postSchema = new Schema<Post>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  editedAt: {
    type: Date,
    required: false,
    default: null,
  },
  picture: {
    type: String,
    required: false,
    default: null,
  },
  tags: {
    type: [String],
    required: true,
  },
  reactedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
});

const PostModel = model<Post>("Post", postSchema);

export default PostModel;
