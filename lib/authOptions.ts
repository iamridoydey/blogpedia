import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";
import dbConnect from "./db";
import { Types } from "mongoose";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: { email: string; password: string } | undefined
      ) {

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await dbConnect();

          const user = await UserModel.findOne({ email: credentials.email });
          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordValid) {
            const userData = {
              id: user._id.toString(),
              firstname: user.firstname,
              lastname: user.lastname,
              username: user.username,
              email: user.email,
              profilepic: user.profilePic || "",
              occupation: user.occupation,
              followers: user.followers,
              following: user.following,
            };

            return userData;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error during authorization: ", error);
          throw new Error("Authorization error");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {

      if (user) {
        // Store custom user data in the JWT token
        token.id = user.id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.username = user.username;
        token.profilepic = user.profilepic;
        token.occupation = user.occupation;
        token.followers = user.followers;
        token.following = user.following;
      }

      return token;
    },
    async session({ session, token }) {

      // Type assertion for session.user
      const user = token as {
        id: string;
        firstname: string;
        lastname: string;
        username: string;
        profilepic: string;
        occupation: string;
        followers: Types.ObjectId[];
        following: Types.ObjectId[];
      };

      // Transfer the token data to the session
      session.user.id = user.id;
      session.user.firstname = user.firstname;
      session.user.lastname = user.lastname;
      session.user.username = user.username;
      session.user.profilepic = user.profilepic;
      session.user.occupation = user.occupation;
      session.user.followers = user.followers;
      session.user.following = user.following;

      // Don't set name, email, and image in the session which is set by default
      delete session.user.name;
      delete session.user.email;
      delete session.user.image;

      return session;
    },
  },
  session: {
    strategy: "jwt", // Use JWT-based sessions
  },
  secret: process.env.NEXTAUTH_SECRET,
};
