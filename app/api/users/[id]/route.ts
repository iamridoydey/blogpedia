/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function GET(req: NextRequest, { params }: any) {
  const { id } = await params;

  try {
    await dbConnect();
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
  const { id } = params;
  const body = await req.json();

  try {
    await dbConnect();
    const updateQuery: any = {};
    const pushQuery: any = {};

    if (body.email) {
      const isExistEmail = await UserModel.findOne({ email: body.email });
      if (isExistEmail && isExistEmail._id.toString() !== id) {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 409 }
        );
      }
      updateQuery.email = body.email;
    }

    if (body.username) {
      const isExistUsername = await UserModel.findOne({
        username: body.username,
      });
      if (isExistUsername && isExistUsername._id.toString() !== id) {
        return NextResponse.json(
          { message: "Username already exists" },
          { status: 409 }
        );
      }
      updateQuery.username = body.username;
    }

    if (body.followers) {
      if (!pushQuery.$push) pushQuery.$push = {};
      pushQuery.$push.followers = body.followers;
    }

    if (body.following) {
      if (!pushQuery.$push) pushQuery.$push = {};
      pushQuery.$push.following = body.following;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: updateQuery,
        ...pushQuery,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error updating user: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = await params;

  try {
    await dbConnect();
    // Delete the user by ID
    const deletedUser = await UserModel.findByIdAndDelete(id);

    // If no user is found and deleted, return a 404 status
    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create a response to indicate the user was deleted
    const response = NextResponse.json(
      { message: "successfully Deleteed The User" },
      { status: 200 }
    );

    // Clear the session cookie by setting it to an empty value and expired
    response.headers.set(
      "Set-Cookie",
      "next-auth.session-token=; path=/; HttpOnly; Max-Age=0;"
    );
    response.headers.set(
      "Set-Cookie",
      `next-auth.csrf-token=; Path=/; HttpOnly; Max-Age=0`
    );

    return response;
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
