import PostModel from "@/models/post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function postComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const { id } = req.query;

  if (method === "GET") {
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    try {
      const posts = await PostModel.find({ userId: id });

      if (!posts.length) {
        return res
          .status(404)
          .json({ message: "No posts found for this user" });
      }

      return res.status(200).json(posts);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: `Error getting posts: ${error.message}` });
    }
  } else {
    return res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
