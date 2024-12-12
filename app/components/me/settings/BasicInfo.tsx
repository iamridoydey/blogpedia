"use client"
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Loader from "../../ui/Loader";

interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  occupation: string;
}

const BasicInfo: React.FC = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [tempUser, setTempUser] = useState<User | null>(null);

  const userId = useMemo(() => session?.user?.id, [session]);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/users/${userId}`);
          const data: User = await response.json();
          setUser(data);
          setTempUser(data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchData();
  }, [userId]);

  const handleEdit = useCallback((field: string) => {
    setIsEditing(field);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (tempUser) {
        setTempUser({ ...tempUser, [e.target.name]: e.target.value });
      }
    },
    [tempUser]
  );

  const handleSave = useCallback(async () => {
    if (user && tempUser) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tempUser),
        });

        if (!response.ok) {
          throw new Error("Failed to update user");
        }

        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(null);
        console.log("User updated successfully:", updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  }, [user, tempUser, userId]);

  if (!user || !tempUser) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[744px] mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Basic Info</h2>
      <form className="space-y-6">
        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">First Name*</label>
          <div className="relative">
            <input
              type="text"
              name="firstname"
              value={tempUser.firstname}
              onChange={handleChange}
              className={`block w-full px-4 py-2 ${
                isEditing === "firstname" ? "bg-white" : "bg-gray-100"
              } border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
              readOnly={isEditing !== "firstname"}
              required
            />
            <button
              type="button"
              onClick={() => handleEdit("firstname")}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <FaPencilAlt className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Last Name</label>
          <div className="relative">
            <input
              type="text"
              name="lastname"
              value={tempUser.lastname}
              onChange={handleChange}
              className={`block w-full px-4 py-2 ${
                isEditing === "lastname" ? "bg-white" : "bg-gray-100"
              } border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
              readOnly={isEditing !== "lastname"}
            />
            <button
              type="button"
              onClick={() => handleEdit("lastname")}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <FaPencilAlt className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Username*</label>
          <div className="relative">
            <input
              type="text"
              name="username"
              value={tempUser.username}
              onChange={handleChange}
              className={`block w-full px-4 py-2 ${
                isEditing === "username" ? "bg-white" : "bg-gray-100"
              } border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
              readOnly={isEditing !== "username"}
            />
            <button
              type="button"
              onClick={() => handleEdit("username")}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <FaPencilAlt className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Email*</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={tempUser.email}
              onChange={handleChange}
              className={`block w-full px-4 py-2 ${
                isEditing === "email" ? "bg-white" : "bg-gray-100"
              } border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
              readOnly={isEditing !== "email"}
              required
            />
            <button
              type="button"
              onClick={() => handleEdit("email")}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <FaPencilAlt className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Occupation</label>
          <div className="relative">
            <input
              type="text"
              name="occupation"
              value={tempUser.occupation}
              onChange={handleChange}
              className={`block w-full px-4 py-2 ${
                isEditing === "occupation" ? "bg-white" : "bg-gray-100"
              } border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
              readOnly={isEditing !== "occupation"}
            />
            <button
              type="button"
              onClick={() => handleEdit("occupation")}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <FaPencilAlt className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicInfo;
