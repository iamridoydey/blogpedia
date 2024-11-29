import { NextApiRequest, NextApiResponse } from "next";
import CommentModel from "@/models/comment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content } = req.body;
  const { id } = req.query; // ID from dynamic route
  const method = req.method;

  if (!id) {
    return res.status(400).json({ message: "Comment ID is required" });
  }

  try {
    switch (method) {
      case "PATCH":
        if (!content) {
          return res.status(400).json({ message: "Content is required" });
        }

        const updatedComment = await CommentModel.findByIdAndUpdate(
          id,
          { content },
          { new: true }
        );

        if (!updatedComment) {
          return res.status(404).json({ message: "Comment not found" });
        }

        return res.status(200).json(updatedComment);

      case "DELETE":
        const deletedComment = await CommentModel.findByIdAndDelete(id);

        if (!deletedComment) {
          return res.status(404).json({ message: "Comment not found" });
        }

        return res
          .status(200)
          .json({ message: "Successfully deleted the comment" });

      default:
        return res
          .status(405)
          .json({ message: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
}
