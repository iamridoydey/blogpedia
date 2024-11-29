import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db";
import UserModel from "@/models/user";

dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;
  const body = req.body;
  let user = null;

  try {
    if (id) {
      user = await UserModel.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
    }
  } catch (err: unknown) {
    return res.status(500).json({ message: `Error fetching user: ${err}` });
  }

  switch (method) {
    case "GET":
      return res.status(200).json(user);

    case "PATCH":
      try {
        const updateQuery: any = {};
        const pushQuery: any = {};

        for (const key in body) {
          if (key === "email") {
            // Check if email already exists in another user
            const isExistEmail = await UserModel.findOne({ email: body[key] });
            if (isExistEmail && isExistEmail._id.toString() !== id) {
              return res.status(409).json({ message: "Email already exists" });
            }
          }

          if (key === "username") {
            // Check if username already exists in another user
            const isExistUsername = await UserModel.findOne({
              username: body[key],
            });
            if (isExistUsername && isExistUsername._id.toString() !== id) {
              return res
                .status(409)
                .json({ message: "Username already exists" });
            }
          }

          if (["followers", "following"].includes(key)) {
            if (!pushQuery.$push) pushQuery.$push = {};
            pushQuery.$push[key] = body[key];
          } else {
            updateQuery[key] = body[key];
          }
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
          id,
          {
            ...updateQuery,
            ...pushQuery,
          },
          { new: true }
        );

        return res.status(200).json(updatedUser);
      } catch (error: any) {
        return res
          .status(500)
          .json({ message: `Error updating user: ${error.message}` });
      }


    case "DELETE":
      await UserModel.findByIdAndDelete(id);
      break;
      
    default:
      return res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
