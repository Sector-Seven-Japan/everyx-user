import Image from "next/image";


interface searchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBar({ search, setSearch }: searchProps) {
  return (
    <div className="flex gap-3 px-4 py-2 rounded-2xl bg-[#161616] mx-5 mt-7 items-center">
      {/* Search Icon */}
      <Image
        className="pl-2"
        src="/images/search.svg"
        alt="Search icon"
        width={20}
        height={20}
      />

      {/* Search Input */}
      <input
        type="text"
        className="text-[14px] bg-transparent outline-none flex-1 text-white placeholder-gray-400"
        placeholder="Search by market"
        aria-label="Search by market"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
