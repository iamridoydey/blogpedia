"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoHome, IoPeopleSharp, IoSave } from "react-icons/io5";
import { MdArticle } from "react-icons/md";

export default function MobileNavbar() {
  const pathname = usePathname();
  const isAllowMobileNav =
    pathname.startsWith("/me") ||
    pathname.startsWith("/blog") ||
    pathname === "/";

  return !isAllowMobileNav ? (
    <nav className="mobile_nav block slg:hidden">
      <ul className="flex fixed bottom-0 items-center justify-around bg-white py-2 w-full  border-t-[2px] border-gray-400">
        <li className="">
          <Link
            href="/feed"
            className="hover:text-gray-600 flex flex-col items-center"
          >
            <span className="text-3xl">
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
            <span className="text-3xl">
              <MdArticle />
            </span>
            <span className="text-[12px]  leading-4">Blog posts</span>
          </Link>
        </li>
        <li className="">
          <Link
            href="/feed"
            className="hover:text-gray-600 flex flex-col items-center"
          >
            <span className="text-3xl">
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
            <span className="text-3xl">
              <IoSave />
            </span>
            <span className="text-[12px]  leading-4">Save Blog</span>
          </Link>
        </li>
      </ul>
    </nav>
  ) : (
    ""
  );
}
