import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <>
      <form>
        <div className="searchbar_container bg-gray-200 flex px-4 py-1 gap-1 items-center rounded-sm focus-within:border-black border-2 w-[200px] emini:focus-within:w-[100%] mini:focus-within:w-[125%] esm:focus-within:w-[120%] transition-all duration-1000">
          <label htmlFor="search" className="">
            <FaSearch color="#6e6b6b" />
          </label>
          <input
            type="text"
            placeholder="Search"
            className="w-full block outline-none placeholder:text-gray-600 text-gray-600 bg-transparent text-[16px] peer"
            name="search"
            id="search"
          />
        </div>
      </form>
    </>
  );
}
