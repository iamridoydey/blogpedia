import { Schema, model } from "mongoose";
import { BlogComment } from "@/types";

const blogCommentSchema = new Schema<BlogComment>(
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

const BlogCommentModel = model<BlogComment>("BlogComment", blogCommentSchema);

export default BlogCommentModel;
