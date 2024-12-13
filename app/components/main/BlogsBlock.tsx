import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa";
import DefaultPic from "../ui/DefaultPic";

interface Blog {
  _id: string;
  bloglogo: string;
  domain: string;
}

interface BlogsBlockProps {
  limitBlogs: number;
}

export default function BlogsBlock({ limitBlogs }: BlogsBlockProps) {
  const { data: session } = useSession();
  const [blogData, setBlogData] = useState<Blog[]>([]);
  const [followStatus, setFollowStatus] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Fetch data from backend
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        let url = `/api/blogs`;
        if (limitBlogs > 0) {
          url += `?limit=${limitBlogs}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error("Blogs not found!");
        const data: Blog[] = await response.json();
        setBlogData(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBlogData();
  }, [limitBlogs]);

  const handleFollowToggle = async (blogId: string) => {
    try {
      const isCurrentlyFollowed = followStatus[blogId] ?? false;

      // Update user's followingBlogs
      const userResponse = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followingBlogs: {
            [isCurrentlyFollowed ? "remove" : "add"]: blogId,
          },
        }),
      });

      if (!userResponse.ok)
        throw new Error("Failed to update user's following list");

      // Update blog's followedBy
      const blogResponse = await fetch(`/api/blogs/${blogId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followedBy: {
            [isCurrentlyFollowed ? "remove" : "add"]: session?.user?.id,
          },
        }),
      });

      if (!blogResponse.ok)
        throw new Error("Failed to update blog's followers");

      // Update follow status in local state
      setFollowStatus((prevStatus) => ({
        ...prevStatus,
        [blogId]: !isCurrentlyFollowed,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="w-full h-full bg-white rounded shadow-lg pt-1 pb-4">
      <h3 className="px-2 p-1 text-lg font-bold text-gray-700">Latest Blogs</h3>
      <hr className="w-[98%] border-[1px] border-gray-300" />
      {blogData.map((blog, index) => {
        const { _id, bloglogo, domain } = blog;
        const isFollowed = followStatus[_id] ?? false;

        return (
          <div key={index} className="blog_wrapper py-4 px-4">
            <div className="blog_details flex gap-3 items-start">
              <figure className="w-16 h-16 border-white border-[2px] rounded-full">
                {bloglogo ? (
                  <Image
                    src={bloglogo}
                    alt="blog logo"
                    width={100}
                    height={100}
                  />
                ) : (
                  <DefaultPic
                    shortname={`${domain.slice(0,1)[0]}${domain.slice(1, 2)[0]}`}
                  />
                )}
              </figure>
              <div className="details_wrapper">
                <span className="hover:underline decoration-blue-600 font-semibold text-gray-700">
                  <Link href="#">{domain}</Link>
                </span>
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
