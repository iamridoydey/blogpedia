import PostModel from "@/models/post";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== "POST") {
    return res.status(405).json({ message: `Method ${method} not allowed` });
  }

  try {
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, content, picture, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Create post
    const post = new PostModel({
      title,
      content,
      createdAt: Date.now(),
      editedAt: null,
      picture,
      tags,
      userId: session.user._id, // Assuming `id` is available in session
    });

    const newPost = await post.save();
    return res.status(201).json(newPost);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Error Creating Post: ${error.message}` });
  }
}
