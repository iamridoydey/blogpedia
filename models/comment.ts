import {Schema, model} from "mongoose"
import {Comment} from "@/types"

const commentSchema = new Schema<Comment>({
  content: {
    type: String,
    required: true,
  },
  commentBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
});


const commentModel = model<Comment>("Comment", commentSchema);

export default commentModel;