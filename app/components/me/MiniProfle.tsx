"use client"
import Image from "next/image";
import DefaultPic from "../ui/DefaultPic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { user } from "@/app/dummydata/user";

export default function MiniProfile({title}: {title: string}){
  const { data: session } = useSession();
  const [userData, setUserData] = useState(user);

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

  const { firstname, lastname, profilePic, username } = userData;
  const shortname: string = firstname[0] + (lastname ? lastname[0] : "");

  return (
    <div className="user_details flex items-center gap-2">
      <figure className="w-8 h-8 slg:w-12 slg:h-12 rounded-full bg-white overflow-hidden">
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
      <h3 className="hidden slg:block">
        {title || `${firstname} ${lastname}` || username}
      </h3>
    </div>
  );
}