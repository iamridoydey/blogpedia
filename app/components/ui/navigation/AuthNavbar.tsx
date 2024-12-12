import Image from "next/image";
import Link from "next/link";
import blogpedia_logo from "@/public/blogpedia_logo.svg";
import blogpedia_less_width from "@/public/blogpedia_fav.svg";
import { MdArticle } from "react-icons/md";
import { IoPeopleSharp, IoHome, IoSave } from "react-icons/io5";
import SearchBar from "./SearchBar";
import NavProfile from "./NavProfile";

export default function AuthNavbar() {
  return (
    <section className="default_nav_wrapper bg-white border-b-[1px] border-gray-400">
      <nav className="default_navbar max-w-screen-xl m-auto py-2 px-4">
        <div className="nav_items flex items-center justify-between text-xl">
          <ul className="logoAndSearch flex gap-4 items-center">
            <li className="logo">
              <div className="block esm:hidden">
                <Link href="/me/profile">
                  <NavProfile />
                </Link>
              </div>
              <Link href="/" className="hidden esm:block">
                <figure className={`logo_container block sm:hidden w-[64px]`}>
                  <Image
                    src={blogpedia_less_width}
                    alt="Blogpedia Logo"
                    className="w-full"
                  />
                </figure>
                <figure
                  className={`logo_container hidden sm:block max-w-[160px]`}
                >
                  <Image
                    src={blogpedia_logo}
                    alt="Blogpedia Logo"
                    className="w-full"
                  />
                </figure>
              </Link>
            </li>
            <li className="search">
              <span className="">
                <SearchBar />
              </span>
            </li>
          </ul>

          <div className="flex gap-8">
            <ul className="gap-10 items-center justify-between hidden slg:flex">
              <li className="">
                <Link
                  href="/feed"
                  className="hover:text-gray-600 flex flex-col items-center"
                >
                  <span className="text-2xl">
                    <IoHome />
                  </span>
                  <span className="text-[12px]  leading-4">Home</span>
                </Link>
              </li>
              <li className="">
                <Link
                  href="#"
                  className="hover:text-gray-600 flex gap-y-0 flex-col items-center"
                >
                  <span className="text-2xl">
                    <MdArticle />
                  </span>
                  <span className="text-[12px]  leading-4">Blog Posts</span>
                </Link>
              </li>
              <li className="">
                <Link
                  href="/feed"
                  className="hover:text-gray-600 flex flex-col items-center"
                >
                  <span className="text-2xl">
                    <IoPeopleSharp />
                  </span>
                  <span className="text-[12px]  leading-4">Following</span>
                </Link>
              </li>

              <li className="">
                <Link
                  href="#"
                  className="hover:text-gray-600 flex flex-col items-center"
                >
                  <span className="text-2xl">
                    <IoSave />
                  </span>
                  <span className="text-[12px]  leading-4">Save Blog</span>
                </Link>
              </li>
            </ul>
            <div className="hidden esm:block">
              <NavProfile />
            </div>
          </div>
        </div>
      </nav>
    </section>
  );
}
