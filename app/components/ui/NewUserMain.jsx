import Image from "next/image";
import blogpedia_front from "../../../public/blogpedia_front.svg";
import handshake_users from "../../../public/handshake_users.svg";
import Link from "next/link";

export default function NewUserMain() {
  return (
    <main className="main_wrapper">
      <section className="hero_wrapper flex flex-col sm:flex-row md:justify-between gap-8 mt-8 max-w-screen-xl m-auto px-4 overflow-hidden">
        <article className="greeting_section flex flex-col gap-4">
          <h1 className="md:w-[400px] text-4xl md:text-6xl font-bold text-gray-500">
            Welcome To Your Tech Blogger Community
          </h1>
          <h3 className="text-3xl font-semibold text-gray-600">
            New To Blogpedia?
          </h3>

          <Link
            href="/auth/signup"
            className="w-full bg-blue-600 text-white px-10 py-3 rounded-full text-center font-semibold self-center hover:bg-slate-500"
          >
            JOIN NOW
          </Link>
          <div className="flex items-center">
            <span className="flex-grow border-t border-gray-400"></span>
            <span className="px-4 text-gray-600">or</span>
            <span className="flex-grow border-t border-gray-400"></span>
          </div>
          <Link
            href="/auth/signin"
            className="w-full bg-slate-500 text-white px-10 py-3 rounded-full text-center font-semibold self-center hover:bg-blue-700"
          >
            Sign In
          </Link>
        </article>
        <section className="user_view_section">
          <figure className="img_container min-w-[300px] max-w-[520px] ">
            <Image src={blogpedia_front} alt="Blogger In Blogpedia" />
          </figure>
        </section>
      </section>

      <section className="blog_writing_wrapper py-16 bg-stone-300 mt-6">
        <article className="blog_main max-w-screen-xl m-auto px-4">
          <h1 className="text-3xl font-bold text-gray-500">
            Wanna write blog based on your tech skills that can reach to
            millions of people?
          </h1>
          <div className="skill_items_container mt-8">
            <ul className="skill_items flex flex-wrap gap-4">
              <li className="border-2 border-gray-600 whitespace-nowrap p-3 rounded-full hover:bg-gray-400 font-medium">
                Programming language
              </li>
              <li className="border-2 border-gray-600 whitespace-nowrap p-3 rounded-full hover:bg-gray-400 font-medium">
                Web Development
              </li>
              <li className="border-2 border-gray-600 whitespace-nowrap p-3 rounded-full hover:bg-gray-400 font-medium">
                Backend Development
              </li>
              <li className="border-2 border-gray-600 whitespace-nowrap p-3 rounded-full hover:bg-gray-400 font-medium">
                Frontend Development
              </li>
              <li className="border-2 border-gray-600 whitespace-nowrap p-3 rounded-full hover:bg-gray-400 font-medium">
                Mobile Development
              </li>
              <li className="border-2 border-gray-600 whitespace-nowrap p-3 rounded-full hover:bg-gray-400 font-medium">
                Devops
              </li>
              <li className="border-2 border-gray-600 whitespace-nowrap p-3 rounded-full hover:bg-gray-400 font-medium">
                Cybersecurity
              </li>
              <li className="border-2 border-gray-600 whitespace-nowrap p-3 rounded-full hover:bg-gray-400 font-medium">
                Machine Learning
              </li>
              <li className="border-2 border-gray-600 whitespace-nowrap p-3 rounded-full hover:bg-gray-400 font-medium">
                Data Science
              </li>
              <li className="border-2 border-gray-600 whitespace-nowrap p-3 rounded-full hover:bg-gray-400 font-medium">
                Basic Computing
              </li>
            </ul>
          </div>
        </article>
      </section>
      <section className="meet_people_wrapper py-8 mt-6">
        <article className="meet_people_main max-w-screen-xl m-auto px-4">
          <h1 className="meet_people_title text-3xl font-bold text-gray-500">
            Get in touch with skillful person from where you can learn?
          </h1>
          <div className="meet_people_data_container pt-8 flex flex-col md:flex-row md:gap-8 md:justify-between">
            <div className="meet_people_paragraph">
              <h1 className="text-3xl font-bold text-gray-600 mb-4">
                Let&apos;s start
              </h1>
              <ul className="list-[square] pl-5 text-2xl font-bold text-gray-700">
                <li className="before:text-12">Read</li>
                <li>Write</li>
                <li>Love</li>
                <li>Comment</li>
                <li>Collaborate</li>
                <li>Share</li>
              </ul>
            </div>
            <figure className="min-w-[300px] max-w-[520px]">
              <Image src={handshake_users} alt="Handshake Users" />
            </figure>
          </div>
        </article>
      </section>
    </main>
  );
}
