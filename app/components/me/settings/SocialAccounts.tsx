/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  FaPencilAlt,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaReddit,
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import Loader from "../../ui/Loader";

interface SocialAccount {
  platform: string;
  link: string;
}

interface User {
  socialAccounts: SocialAccount[];
}

const SocialAccounts: React.FC = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [tempSocialAccounts, setTempSocialAccounts] = useState<SocialAccount[]>(
    [
      { platform: "github", link: "" },
      { platform: "twitter", link: "" },
      { platform: "linkedin", link: "" },
      { platform: "facebook", link: "" },
      { platform: "reddit", link: "" },
    ]
  );

  const userId = useMemo(() => session?.user?.id, [session]);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/users/${userId}`);
          const data: User = await response.json();
          console.log("Fetched user data:", data);
          setUser(data);

          // Merge existing social accounts with defaults
          const mergedSocialAccounts = tempSocialAccounts.map((account) => {
            const existingAccount = data.socialAccounts.find(
              (acc) => acc.platform === account.platform
            );
            return existingAccount ? existingAccount : account;
          });
          setTempSocialAccounts(mergedSocialAccounts);
        } catch (error) {
          console.log("Failed to fetch user data:", error);
        }
      }
    };

    fetchData();
  }, [userId]);

  const handleEdit = useCallback((platform: string) => {
    setIsEditing(platform);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, platform: string) => {
      setTempSocialAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.platform === platform
            ? { ...account, link: e.target.value }
            : account
        )
      );
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (user) {
      try {
        const nonEmptySocialAccounts = tempSocialAccounts.filter(
          (account) => account.link.trim() !== ""
        );

        console.log(
          "Attempting to update social accounts with data:",
          nonEmptySocialAccounts
        );

        const response = await fetch(`/api/users/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ socialAccounts: nonEmptySocialAccounts }),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to update social accounts: ${errorMessage}`);
        }

        const updatedUser = await response.json();
        console.log("Updated user data:", updatedUser);
        setUser(updatedUser);
        setIsEditing(null);
      } catch (error: any) {
        console.error("Error updating social accounts:", error);
        alert(`Error updating social accounts: ${error.message}`);
      }
    }
  }, [user, tempSocialAccounts, userId]);



  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[744px] mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Social Accounts</h2>
      <form className="space-y-6">
        {tempSocialAccounts.map(({ platform, link }) => (
          <div key={platform} className="space-y-2">
            <label className="block text-gray-600 font-medium capitalize">
              {platform}
            </label>
            <div className="relative flex items-center">
              {
                {
                  github: <FaGithub className="text-gray-600 mr-2" />,
                  twitter: <FaTwitter className="text-blue-400 mr-2" />,
                  linkedin: <FaLinkedin className="text-blue-700 mr-2" />,
                  facebook: <FaFacebook className="text-blue-600 mr-2" />,
                  reddit: <FaReddit className="text-orange-600 mr-2" />,
                }[platform]
              }
              <input
                type="url"
                name={platform}
                value={link}
                onChange={(e) => handleChange(e, platform)}
                className={`block w-full px-4 py-2 ${
                  isEditing === platform ? "bg-white" : "bg-gray-100"
                } border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
                readOnly={isEditing !== platform}
              />
              <button
                type="button"
                onClick={() => handleEdit(platform)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <FaPencilAlt className="text-gray-500" />
              </button>
            </div>
          </div>
        ))}
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

export default SocialAccounts;
