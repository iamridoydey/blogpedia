import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface Post {
  title: string;
  content: string;
  picture?: string;
  tags: string[];
  userId: string;
}

interface CreatePostModalProps {
  uploadedPhotoURL: string | null;
  uploading: boolean;
  onClose: () => void;
}

export default function CreatePostModal({
  uploadedPhotoURL,
  uploading,
  onClose,
}: CreatePostModalProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState("");

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(" ")) {
      setTags([...tags, value.trim()]);
      setInputTag("");
    } else {
      setInputTag(value);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      alert("User not logged in");
      return;
    }

    const newPost: Post = {
      title,
      content,
      picture: uploadedPhotoURL || "",
      tags,
      userId: session.user.id,
    };

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      onClose();
      setTitle("");
      setContent("");
      setTags([]);
      setInputTag("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post. Please try again.");
    }
  };

  return (
    <div className="create-post-modal fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-xl mx-4">
        <h2 className="text-2xl font-bold mb-4">Create Post</h2>
        <form onSubmit={handlePostSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={5}
              required
            />
          </div>
          {uploading && <p>Uploading image, please wait...</p>}
          {uploadedPhotoURL && !uploading && (
            <div className="mb-4">
              <Image
                src={uploadedPhotoURL}
                alt="Uploaded"
                className="w-full h-auto rounded-md"
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="tags" className="block text-gray-700">
              Tags (use # to separate tags)
            </label>
            <input
              type="text"
              id="tags"
              value={inputTag}
              onChange={handleTagChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded mb-2"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 mr-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
