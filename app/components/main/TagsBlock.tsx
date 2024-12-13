/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { dummyTag } from "@/app/dummydata/tags";
import Link from "next/link";

export default function TagsBlock({ numberOfTags }: { numberOfTags: number }) {
  const { data: session } = useSession();
  const [tagData, setTagData] = useState([dummyTag]);

  // Fetch data from backend
  useEffect(() => {
    if (session?.user?.id) {
      const fetchUserData = async () => {
        try {
          let url = `/api/tags`;
          if (numberOfTags !== -1 && numberOfTags > 0) {
            url += `?limit=${numberOfTags}`;
          }
          const response = await fetch(url);
          if (!response.ok) throw new Error("Tags not found!");
          const data = await response.json();
          setTagData(data);
        } catch (err: any) {
          console.log(err);
        }
      };

      fetchUserData();
    }
  }, [session?.user?.id, numberOfTags]);

  return (
    <section className="w-full h-full bg-white rounded shadow-lg pt-2 pb-4">
      <h3 className="text-lg text-gray-600 font-bold px-2">Trending</h3>
      <hr className="w-[98%] mx-auto border-[1px] border-gray-300" />
      <ul className="px-4 pt-2">
        {tagData.map((t, index) => (
          <li key={index}>
            <Link className="hover:underline decoration-blue-600" href="#">
              #{t.tag}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="w-[98%] mx-auto border-[1px] border-gray-300 mt-4" />
      <div className="text-center">
        <Link className="hover:underline decoration-blue-600" href="#">
          show more
        </Link>
      </div>
    </section>
  );
}
