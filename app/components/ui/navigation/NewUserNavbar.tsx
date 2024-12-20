import Image from "next/image";
import Link from "next/link";
import blogpedia_logo from "@/public/blogpedia_logo.svg";
import { MdArticle } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { usePathname } from "next/navigation";

export default function NewUserNavbar() {
   const pathname = usePathname();
   const isAuthPage = pathname.startsWith("/auth");

  return (
    <section className="default_nav_wrapper bg-white">
      <nav className="default_navbar max-w-screen-xl m-auto py-2 px-4">
        <ul className="nav_items flex items-center justify-between text-xl">
          <li>
            <Link href="/">
              <figure
                className={`logo_container ${
                  isAuthPage ? "max-w-[180px]" : "max-w-[160px]"
                } `}
              >
                <Image
                  src={blogpedia_logo}
                  alt="Blogpedia Logo"
                  className="w-full"
                />
              </figure>
            </Link>
          </li>

          {!isAuthPage && (
            <li className="self-start">
              <div className="flex gap-8">
                <Link
                  href="#"
                  className="hover:text-gray-600 flex flex-col items-center"
                >
                  <span className="text-3xl">
                    <MdArticle />
                  </span>
                  <span className="text-sm">Blog Post</span>
                </Link>
                <Link
                  href="#"
                  className="hover:text-gray-600 flex flex-col items-center"
                >
                  <span className="text-3xl">
                    <IoPeopleSharp />
                  </span>
                  <span className="text-sm">People</span>
                </Link>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </section>
  );
}
