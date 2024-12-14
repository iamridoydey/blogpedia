import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";
import dbConnect from "./db";
import { generateUsername } from "@/helperFunction/generateUsername";
import { generateFirstLastName } from "@/helperFunction/generateFirstLastName";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
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
            };

            console.log(userData);
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
    // Github provider
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { prompt: "login" } },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: { params: { scope: "r_emailaddress" } },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ account, profile }) {
      // Connect db first
      await dbConnect();

      // Don't need to include credential provider because this data already being stored in the
      // database

      // Oauth providers data should be saved to the database
      if (account?.provider === "github") {
        const githubProfile = profile as {
          name: string;
          login: string;
          email: string;
          avatar_url: string;
        };

        // Check if user exists
        let existingUser = await UserModel.findOne({
          email: githubProfile.email,
        });
        if (!existingUser) {
          const [firstname, lastname] = generateFirstLastName(
            githubProfile.name
          );
          existingUser = await UserModel.create({
            firstname,
            lastname,
            username: githubProfile.login,
            email: githubProfile.email,
            profilePic: githubProfile.avatar_url,
            authProvider: "github",
            isVerified: true,
          });
        }
      } else if (account?.provider === "linkedin") {
        const linkedinProfile = profile as {
          localizedFirstname: string;
          localizedLastName: string;
          email: string;
          profilePicture: {
            "displayImage~": {
              elements: Array<{
                identifiers: Array<{ identifier: string }>;
              }>;
            };
          };
        };

        // Check if user exists
        let existingUser = await UserModel.findOne({
          email: linkedinProfile.email,
        });
        if (!existingUser) {
          const profilePic =
            linkedinProfile.profilePicture?.["displayImage~"]?.elements?.[0]
              ?.identifiers?.[0]?.identifier || "";

          existingUser = await UserModel.create({
            firstname: linkedinProfile.localizedFirstname,
            lastname: linkedinProfile.localizedLastName,
            username: generateUsername(linkedinProfile.localizedFirstname),
            email: linkedinProfile.email,
            profilePic,
            authProvider: "linkedin",
            isVerified: true,
          });
        }
      }

      // Continue to the next step
      return true;
    },
    async jwt({ token, account, profile }) {
      console.log("Before Adding to token : ", token);
      console.log("jwt account ", account);
      console.log("jwt profile ", profile);
      if (account && profile) {
        const oAuthProfile = profile as {
          id: string;
          email: string;
        };

        const user = await UserModel.findOne({ email: oAuthProfile.email });

        if (user) {
          token.id = user._id.toString();
        }
      } else if (account && !profile) {
        const id = account.providerAccountId;

        const user = await UserModel.findById(id);

        if (user) {
          token.id = id;
        }
      }


      return token;
    },

    async session({ session, token }) {
      console.log("token: ", token);
      if (typeof token?.id == "string") {
        // Store only userId in session
        session.user.id = token.id;
      }

      // Remove all unwanted data
      delete session?.user?.name;
      delete session?.user?.email;
      delete session?.user?.image;

      return session;
    },
  },
  session: {
    strategy: "jwt",
    // Maxium validation of the session is one day
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
