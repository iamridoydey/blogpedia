/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
dbConnect();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();

  try {
    const updateQuery: any = {};
    const pushQuery: any = {};
    const pullQuery: any = {};

    // Handle email uniqueness
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

    // Handle username uniqueness
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

    // Handle other fields
    if (body.firstname) updateQuery.firstname = body.firstname;
    if (body.lastname) updateQuery.lastname = body.lastname;
    if (body.profilePic) updateQuery.profilePic = body.profilePic;
    if (body.coverpic) updateQuery.coverpic = body.coverpic;
    if (body.occupation) updateQuery.occupation = body.occupation;
    if (body.hasBlog) updateQuery.hasBlog = body.hasBlog;
    if (body.password) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);
      updateQuery.password = hashedPassword;
    }
    if (typeof body.isVerified !== "undefined")
      updateQuery.isVerified = body.isVerified;
    if (body.authProvider) updateQuery.authProvider = body.authProvider;

    // Handle followingBlogs
    if (body.followingBlogs) {
      if (body.followingBlogs.add) {
        if (!pushQuery.$push) pushQuery.$push = {};
        pushQuery.$push.followingBlogs = body.followingBlogs.add;
      } else if (body.followingBlogs.remove) {
        if (!pullQuery.$pull) pullQuery.$pull = {};
        pullQuery.$pull.followingBlogs = body.followingBlogs.remove;
      }
    }

    // Handle followers
    if (body.followers) {
      if (body.followers.add) {
        if (!pushQuery.$push) pushQuery.$push = {};
        pushQuery.$push.followers = body.followers.add;
      } else if (body.followers.remove) {
        if (!pullQuery.$pull) pullQuery.$pull = {};
        pullQuery.$pull.followers = body.followers.remove;
      }
    }

    // Handle following
    if (body.following) {
      if (body.following.add) {
        if (!pushQuery.$push) pushQuery.$push = {};
        pushQuery.$push.following = body.following.add;
      } else if (body.following.remove) {
        if (!pullQuery.$pull) pullQuery.$pull = {};
        pullQuery.$pull.following = body.following.remove;
      }
    }

    // Handle socialAccounts as an array
    if (Array.isArray(body.socialAccounts)) {
      const validAccounts = body.socialAccounts.filter(
        (account: { platform: string; link: string }) =>
          account.platform && account.link
      );
      if (validAccounts.length !== body.socialAccounts.length) {
        return NextResponse.json(
          {
            message:
              "Invalid socialAccounts format. Each item must include platform and link.",
          },
          { status: 400 }
        );
      }
      updateQuery.socialAccounts = validAccounts;
    }

    // Handle saving posts or blogposts
    if (body.type && body.id && body.action) {
      const queryField =
        body.type === "post"
          ? "savePost"
          : body.type === "blogpost"
          ? "saveBlogpost"
          : null;
      if (!queryField) {
        return NextResponse.json(
          { message: "Invalid type. Must be either 'post' or 'blogpost'." },
          { status: 400 }
        );
      }

      if (body.action === "add") {
        if (!pushQuery.$push) pushQuery.$push = {};
        pushQuery.$push[queryField] = body.id;
      } else if (body.action === "remove") {
        if (!pullQuery.$pull) pullQuery.$pull = {};
        pullQuery.$pull[queryField] = body.id;
      } else {
        return NextResponse.json(
          { message: "Invalid action. Must be either 'add' or 'remove'." },
          { status: 400 }
        );
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: updateQuery,
        ...pushQuery,
        ...pullQuery,
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



export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json(
      { message: "Successfully deleted the user" },
      { status: 200 }
    );

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
    return NextResponse.json(
      { message: `Error deleting user: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
