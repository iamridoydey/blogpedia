import {Types} from "mongoose"

export interface User {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  profilePic?: string;
  coverpic: string;
  occupation: string;
  password: string;
  isVerified: boolean;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  socialAccounts?: { platform: string; link: string }[];
  authProvider: string;
}

export interface Post{
  title: string;
  content: string;
  picture?: string | null;
  tags: string[];
  reactedBy: Types.ObjectId[];
  userId: Types.ObjectId;
}

export interface Comment {
  content: string;
  commentedBy: Types.ObjectId;
  postId: Types.ObjectId;
}

export interface Blog{
  domain: string;
  bloglogo: string;
  blogCoverPic: string;
  followedBy: Types.ObjectId[];
  userId: Types.ObjectId;
}

export interface BlogPost {
  title: string;
  thumbnail: string;
  content: string;
  tags: string[];
  reactedBy: Types.ObjectId[];
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface BlogComment{
  content: string;
  commentedBy: Types.ObjectId;
  blogPostId: Types.ObjectId;
}


export interface Tag{
  tag: string,
  usage: number
}