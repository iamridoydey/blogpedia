import { NextApiRequest, NextApiResponse } from "next";
import CommentModel from "@/models/comment";
import { getSession } from "next-auth/react";

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "POST") {
    return res.status(405).json({ message: `Method ${method} not allowed` });
  }

  const { content, postId } = req.body;

  // Validate input
  if (!content || !postId) {
    return res
      .status(400)
      .json({ message: "Content and Post ID are required" });
  }

  try {
    // Check the session
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newComment = new CommentModel({
      content,
      commentBy: session.user._id,
      postId,
    });

    // Save the new comment
    const comment = await newComment.save();

    return res.status(201).json(comment);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Error creating comment: ${error.message}` });
  }
}
