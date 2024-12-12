"use client";

import { MdArrowDropDown } from "react-icons/md";
import Image from "next/image";
import DefaultPic from "../DefaultPic";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { user } from "@/app/dummydata/user";
import Link from "next/link";

export default function NavProfile() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(user);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch data from backend
  useEffect(() => {
    if (session?.user?.id) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          if (!response.ok) throw new Error("User not found!");
          const data = await response.json();
          setUserData(data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchUserData();
    }
  }, [session?.user?.id]);

  console.log(userData)

  const { firstname, lastname, profilePic, username } = userData;
  const shortname: string = firstname[0] + (lastname ? lastname[0] : "");

  // Dropdown behaviour
  const toggleDropdown = () => setDropdownVisible((prev) => !prev);
  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  // Logout user
  const handleLogout = async()=>{
    await signOut({callbackUrl: "/"});
  }

  return (
    <ul className="relative">
      <li>
        <div
          ref={dropdownRef}
          className="hover:text-gray-600 flex flex-col items-center justify-between cursor-pointer"
          onClick={toggleDropdown}
        >
          <figure
            className={`w-8 h-8 esm:w-[24px] esm:h-[24px] rounded-full overflow-hidden ${
              profilePic ? "bg-white border-2 border-gray-400" : ""
            } mb--2`}
          >
            {profilePic ? (
              <Image
                src={profilePic}
                alt="profile pic"
                className="w-full h-full object-cover"
                width="100"
                height="100"
              />
            ) : (
              <span className="w-full h-full">
                <DefaultPic shortname={shortname} />
              </span>
            )}
          </figure>

          <div className="hidden esm:flex items-center leading-3">
            <span className="text-[12px]">me</span>
            <span className="ml-[-2px]">
              <MdArrowDropDown />
            </span>
          </div>
        </div>

        {isDropdownVisible && (
          <div className="absolute right-0 mt-4 dropdown w-[200px] bg-white rounded shadow-lg transition-all duration-700 z-[100]">
            <div className="user_details flex items-center gap-2 p-2">
              <figure className="w-12 h-12 rounded-full bg-white overflow-hidden">
                {profilePic ? (
                  <Image
                    src={profilePic}
                    className="w-full h-full rounded"
                    width={100}
                    height={100}
                    alt="profile pic"
                  />
                ) : (
                  <DefaultPic shortname={shortname} />
                )}
              </figure>
              <h3>{username}</h3>
            </div>
            <div className="px-3">
              <Link
                href="/me/profile"
                className="text-sm border-2 border-blue-600 rounded-full px-12 py-1 hover:bg-blue-500 hover:text-white"
              >
                View Profile
              </Link>
            </div>
            <ul className="p-2 text-lg">
              <li className="py-1 px-2 hover:text-blue-500">
                <Link href={`/me/${session?.user?.id}`}>My Blog</Link>
              </li>
              <li className="py-1 px-2 hover:text-blue-500">
                <Link href="/me/settings">Settings</Link>
              </li>
              <li className="py-1 px-2 hover:text-blue-500">
                <Link onClick={handleLogout} href="#">Log Out</Link>
              </li>
            </ul>
          </div>
        )}
      </li>
    </ul>
  );
}
