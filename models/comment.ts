import {Schema, model} from "mongoose"
import {Comment} from "@/types"

const commentSchema = new Schema<Comment>(
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
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);


const CommentModel = model<Comment>("Comment", commentSchema);

export default CommentModel;