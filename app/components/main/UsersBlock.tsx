import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import DefaultPic from "../ui/DefaultPic";
import Link from "next/link";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai"; // Importing icons
import { FaArrowRight } from "react-icons/fa";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  profilePic: string;
  occupation: string;
  isFollowed?: boolean; // Optional isFollowed property
}

interface UsersBlockProps {
  limitUsers: number;
}

export default function UsersBlock({ limitUsers }: UsersBlockProps) {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<User[]>([]);

  // Fetch data from backend
  useEffect(() => {
    if (session?.user?.id) {
      const fetchUserData = async () => {
        try {
          let url = `/api/users?currentUserId=${session.user.id}`;
          if (limitUsers > 0) {
            url += `&limit=${limitUsers}`;
          }
          const response = await fetch(url);
          if (!response.ok) throw new Error("Users not found!");
          const data: User[] = await response.json();
          setUserData(data.map((user) => ({ ...user, isFollowed: false }))); // Initialize isFollowed as false
        } catch (err) {
          console.log(err);
        }
      };

      fetchUserData();
    }
  }, [limitUsers, session?.user?.id]);

  const handleFollowToggle = async (userId: string) => {
    try {
      const user = userData.find((u) => u._id === userId);
      if (!user) return;

      const isCurrentlyFollowed = user.isFollowed ?? false;

      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          following: {
            [isCurrentlyFollowed ? "remove" : "add"]: userId,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to update following list");

      setUserData((prevData) =>
        prevData.map((user) =>
          user._id === userId
            ? { ...user, isFollowed: !isCurrentlyFollowed }
            : user
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="w-full h-full bg-white rounded shadow-lg pt-1 pb-4">
      <h3 className="px-2 p-1 text-lg font-bold text-gray-700">
        Add to your list
      </h3>
      <hr className="w-[98%] border-[1px] border-gray-300" />
      {userData.map((user, index) => {
        const { _id, firstname, lastname, profilePic, occupation, isFollowed } =
          user;
        const shortname: string = firstname[0] + (lastname ? lastname[0] : "");

        return (
          <div key={index} className="follower_main py-4 px-4">
            <div className="follower_wrapper flex gap-3 items-start">
              <figure className="w-16 h-16 border-white border-[2px] rounded-full">
                {profilePic ? (
                  <Image
                    src={profilePic}
                    alt="profile pic"
                    width={100}
                    height={100}
                  />
                ) : (
                  <DefaultPic shortname={shortname} />
                )}
              </figure>

              <div className="details_wrapper">
                <div className="userinfo">
                  <span className="hover:underline decoration-blue-600 font-semibold text-gray-700">
                    <Link href="#">{`${firstname} ${lastname}`}</Link>
                  </span>
                  <h3 className="text-sm pb-2">{`Occupation: ${occupation}`}</h3>
                </div>

                <button
                  onClick={() => handleFollowToggle(_id)}
                  className={`px-4 py-2 mt-2 rounded ${
                    isFollowed
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  } hover:bg-blue-700 hover:text-white flex items-center gap-2`}
                >
                  {isFollowed ? <AiOutlineCheck /> : <AiOutlinePlus />}
                  {isFollowed ? "Following" : "Follow"}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <hr className="w-[98%] mx-auto border-[1px] border-gray-300 mt-4" />
      <div className="text-center flex justify-center">
        <Link
          className="hover:underline decoration-blue-600 flex items-center gap-1"
          href="#"
        >
          <span>View more</span>
          <span>
            <FaArrowRight />
          </span>
        </Link>
      </div>
    </section>
  );
}
