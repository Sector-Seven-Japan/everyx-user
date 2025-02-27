import Image from "next/image";

interface searchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBar({ search, setSearch }: searchProps) {
  return (
    <div className="md:px-40">
      <h1 className="text-center hidden md:block text-[36px] md:mt-16 cambria">
        Search Market with EveryX
      </h1>
      <div className="flex gap-3 px-4 py-2 md:py-3 rounded-2xl md:rounded-3xl bg-[#161616] mx-5 mt-7 items-center">
        {/* Search Icon */}

        <Image
          className="pl-2"
          src="/Images/search.svg"
          alt="Search icon"
          width={20}
          height={20}
        />

        {/* Search Input */}
        <input
          type="text"
          className="text-[13px] md:text-[16px] bg-transparent outline-none flex-1 text-[#454545] placeholder-[#454545]"
          placeholder="Search by market"
          aria-label="Search by market"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Image src="/Images/logo_grey.png" alt="" height={20} width={20} className="hidden md:block"/>
      </div>
    </div>
  );
}
