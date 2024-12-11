import { blog } from "@/types";
import { model, Schema } from "mongoose";

const blogSchema = new Schema<blog>(
  {
    domain: {
      type: String,
      required: true,
    },
    bloglogo: {
      type: String,
      required: false,
      default: "",
    },
    blogCoverPic: {
      type: String,
      required: false,
      default: "",
    },
    followedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: [],
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


const BlogModel = model<blog>("Blog", blogSchema);
export default BlogModel;

