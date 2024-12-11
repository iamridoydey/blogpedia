import { Schema, model } from "mongoose";
import { Post } from "@/types";

const postSchema = new Schema<Post>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: false,
      default: "",
    },
    tags: {
      type: [String],
      required: true,
    },
    reactedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const PostModel = model<Post>("Post", postSchema);

export default PostModel;
