import { Schema, model } from "mongoose";
import { blogComment } from "@/types";

const blogCommentSchema = new Schema<blogComment>(
  {
    content: {
      type: String,
      required: true,
    },
    commentedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    blogPostId: {
      type: Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
    },
  },
  { timestamps: true }
);

const BlogCommentModel = model<blogComment>("BlogComment", blogCommentSchema);

export default BlogCommentModel;
