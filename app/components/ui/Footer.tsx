import Image from "next/image";
import blogpedia_logo from "../../../public/blogpedia_logo.svg";

export default function Footer(){
  return (
    <footer className="bp_footer flex justify-center bg-white py-6">
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        <figure className="max-w-[90px]">
          <Image src={blogpedia_logo} alt="" />
        </figure>
        <span>&copy; 2024 .</span>
        <span>All Right Reserved</span>
      </div>
    </footer>
  );
}