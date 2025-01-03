import { Schema, model } from "mongoose";
import { BlogPost } from "@/types";

const blogPostSchema = new Schema<BlogPost>(
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
    tags: {
      type: [String],
      required: true,
    },
    reactedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: [],
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

const BlogPostModel = model<BlogPost>("BlogPost", blogPostSchema);

export default BlogPostModel;
