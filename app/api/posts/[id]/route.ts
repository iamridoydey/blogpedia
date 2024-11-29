import { NextApiRequest, NextApiResponse } from "next";
import PostModel from "@/models/post";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const { id } = req.query;
  const body = req.body;

  let post = null;
  try {
    if (id) {
      post = await PostModel.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });
    }
  } catch (err: unknown) {
    return res.status(500).json({ message: `Error fetching post: ${err}` });
  }

  switch (method) {
    case "GET":
      return res.status(200).json(post);

    case "PATCH":
      try {
        const updateQuery: any = {};

        for (const key in body) {
          updateQuery[key] = body[key];
        }

        // Update the post in database
        const updatedPost = await PostModel.findByIdAndUpdate(
          id,
          {
            ...updateQuery,
            editedAt: Date.now(),
          },
          { new: true }
        );

        return res.status(200).json(updatedPost);
      } catch (error: any) {
        return res
          .status(500)
          .json({ message: `Error updating post: ${error.message}` });
      }

    case "DELETE":
      try {
        await PostModel.findByIdAndDelete(id);
        return res.status(204).end(); // 204 No Content
      } catch (error: any) {
        return res
          .status(500)
          .json({ message: `Error deleting post: ${error.message}` });
      }

    default:
      return res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
