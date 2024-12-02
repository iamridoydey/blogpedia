/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function GET(req: NextRequest, { params }: any) {
  const { id } = await params;

  try {
    await dbConnect()
    const user = await UserModel.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error fetching user: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: any) {
  const { id } = await params;
  const body = await req.json();

  try {
    await dbConnect()
    const updateQuery: any = {};
    const pushQuery: any = {};

    for (const key in body) {
      if (key === "email") {
        const isExistEmail = await UserModel.findOne({ email: body[key] });
        if (isExistEmail && isExistEmail._id.toString() !== id) {
          return NextResponse.json(
            { message: "Email already exists" },
            { status: 409 }
          );
        }
      }

      if (key === "username") {
        const isExistUsername = await UserModel.findOne({
          username: body[key],
        });
        if (isExistUsername && isExistUsername._id.toString() !== id) {
          return NextResponse.json(
            { message: "Username already exists" },
            { status: 409 }
          );
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

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error updating user: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params;

  try {
    await dbConnect();
    // Delete the user by ID
    const deletedUser = await UserModel.findByIdAndDelete(id);

    // If no user is found and deleted, return a 404 status
    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return a 204 status for successful deletion without a response body
    return NextResponse.json({ message: "Successfully Deleted The User"}, { status: 200 });
  } catch (error: any) {
    // Catch any error and return a 500 status with an error message
    return NextResponse.json(
      { message: `Error deleting user: ${error.message}` },
      { status: 500 }
    );
  }
}


export async function OPTIONS() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
