import { user } from "@/app/dummydata/user";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import default_background from "@/public/default_background.svg";
import Image from "next/image";
import DefaultPic from "../ui/DefaultPic";
import Link from "next/link";

export default function ProfileBlock() {
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

  const { firstname, lastname, profilePic, coverpic, occupation, followers } =
    userData;
  const shortname: string = firstname[0] + (lastname ? lastname[0] : "");

  return (
    <section className="w-full h-full bg-white rounded shadow-lg pt-1 pb-8">
      <div className="picture_view h-20 relative">
        <figure
          className="w-full h-full"
          style={{
            backgroundImage: `url(${coverpic || default_background.src})`,
          }}
        >
          <div className="w-full h-full bg-cover bg-center"></div>
        </figure>
        <figure className="w-16 h-16 lg:w-20 lg:h-20 absolute left-1/2 transform -translate-x-1/2 bottom--1/2 -translate-y-1/2 border-2 border-white rounded-full">
          {profilePic ? (
            <Image
              src={profilePic}
              alt="profile pic"
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <DefaultPic shortname={shortname} />
          )}
        </figure>
      </div>
      <div className="userdetails pt-10 lg:pt-12 px-4 text-lg text-center">
        <span className="hover:underline decoration-blue-600">
          <Link href="#">{`${firstname} ${lastname}`}</Link>
        </span>
        <h3 className="text-sm pb-2">{`Occupation: ${occupation}`}</h3>
      </div>
      <hr className="w-[98%] mx-auto border-[1px] border-gray-300" />
      <div className="otherdetils px-4 pt-2">
        <h3 className="text-[15px]">{`Followers: ${followers.length}`}</h3>
        <span className="text-[15px]">
          <Link className="hover:underline decoration-blue-600" href="#">
            My Blog
          </Link>
        </span>
      </div>
    </section>
  );
}
