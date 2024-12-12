import Image from "next/image";
import Link from "next/link";
import blogpedia_logo from "@/public/blogpedia_logo.svg";
import blogpedia_less_width from "@/public/blogpedia_fav.svg";
import NavProfile from "./NavProfile";


export default function LimitedNavbar() {
  return (
    <section className="default_nav_wrapper bg-white border-b-[1px] border-gray-400">
      <nav className="default_navbar m-auto py-2 px-4">
        <div className="nav_items flex items-center justify-between text-xl">
          <ul className="logoAndSearch flex gap-4 items-center">
            <li className="logo">
              <Link href="/" className="">
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
          </ul>

          <div className="flex gap-8 sm:block">
            <div className="">
              <NavProfile />
            </div>
          </div>
        </div>
      </nav>
    </section>
  );
}
