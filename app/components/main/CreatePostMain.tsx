import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import DefaultPic from "../ui/DefaultPic";
import { AiOutlinePicture } from "react-icons/ai";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebaseConfig";
import CreatePostModal from "./CreatePostModel"

interface User {
  firstname: string;
  lastname: string;
  profilePic: string;
}

export default function CreatePostMain() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedPhotoURL, setUploadedPhotoURL] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setUserDetails(data);
          } else {
            console.error("Failed to fetch user details");
          }
        } catch (err) {
          console.error("Error fetching user details", err);
        }
      }
    };

    fetchUserDetails();
  }, [session?.user?.id]);

  const handlePostClick = () => {
    setIsModalOpen(true);
    setUploadedPhotoURL(null); // Clear previous photo if any
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoUpload = (url: string) => {
    setUploadedPhotoURL(url);
    setUploading(false);
    setIsModalOpen(true); // Open modal after photo is uploaded
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      setIsModalOpen(true); // Open modal when upload starts
      const storageRef = ref(storage, `photos/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: Monitor the upload progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading file", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
          handlePhotoUpload(downloadURL);
        }
      );
    }
  };

  const shortname = userDetails
    ? userDetails.firstname[0] +
      (userDetails.lastname ? userDetails.lastname[0] : "")
    : "U";

  return (
    <div className="main-component w-full">
      <div className="bg-white rounded shadow p-4 flex items-center gap-4">
        <div className="profile-picture w-12 h-12">
          {userDetails?.profilePic ? (
            <Image
              src={userDetails.profilePic}
              alt="Profile Picture"
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <DefaultPic shortname={shortname} />
          )}
        </div>
        <button
          className="start-post-button bg-gray-100 rounded-full px-4 py-2 flex-grow text-left hover:bg-gray-200"
          onClick={handlePostClick}
        >
          Start a post
        </button>
        <div className="post-options flex items-center gap-2">
          <button
            className="photo-option flex items-center gap-1 text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={handlePhotoClick}
          >
            <AiOutlinePicture />
            Photo
          </button>
          {/* <button
            className="write-blog-option flex items-center gap-1 text-blue-500 hover:text-blue-700"
            onClick={handlePostClick}
          >
            <AiOutlineFileText />
            Write blog
          </button> */}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      {isModalOpen && (
        <CreatePostModal
          uploadedPhotoURL={uploadedPhotoURL}
          uploading={uploading}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
