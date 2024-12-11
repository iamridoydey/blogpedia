import { Schema, model } from "mongoose";
import { blogPost } from "@/types";

const blogPostSchema = new Schema<blogPost>(
  {
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: false,
      default: "",
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
    tags: {
      type: [String],
      required: true,
    },
    reactedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: []
      },
    ],
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const BlogPostModel = model<blogPost>("BlogPost", blogPostSchema);

export default BlogPostModel;
