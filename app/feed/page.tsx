"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaHeart, FaComment } from "react-icons/fa";

interface Post {
  _id: string;
  title: string;
  content: string;
  picture?: string;
  tags: string[];
  reactedBy: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch("/api/posts");
      const data = await response.json();
      console.log(data);
      setPosts(data);
    }
    fetchPosts();
  }, [posts.length]);

  return (
    <div className="container w-full mx-auto box-border mt-4">
      <h1 className="text-xl font-bold">Posts</h1>
      <hr className="pb-4"/>
      {posts.map((post) => (
        <div key={post._id} className="bg-white rounded-sm shadow p-4 mb-4">
          {post.picture ? (
            <Image
              src={post.picture}
              alt={post.title}
              width={500}
              height={300}
              className="mb-2 max-w-full h-auto rounded"
            />
          ) : (
            ""
          )}
          <h2 className="text-2xl font-semibold">{post.title}</h2>
          <p className="mb-2">{post.content}</p>
          <div className="flex items-center space-x-4">
            <button className="text-red-500 flex items-center">
              <FaHeart className="mr-1" /> {post.reactedBy.length}
            </button>
            <button className="text-blue-500 flex items-center">
              <FaComment className="mr-1" /> Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
