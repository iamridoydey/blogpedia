import CommentModel from "@/models/comment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function postComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const { id } = req.query;

  if (method === "GET") {
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid or missing post ID" });
    }

    try {
      const comments = await CommentModel.find({ postId: id });

      if (!comments.length) {
        return res
          .status(404)
          .json({ message: "No comments found for this post" });
      }

      return res.status(200).json(comments);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: `Error fetching comments: ${error.message}` });
    }
  } else {
    return res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
