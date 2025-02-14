import { AppContext } from "@/app/Context/AppContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

interface HeadingSliderProps {
  setFilter: (filter: string) => void;
  filter: string;
}

const HeadingSlider: React.FC<HeadingSliderProps> = ({ setFilter, filter }) => {
  const router = useRouter();
  const { categories,setIsLoading,setIsOrderMade } = useContext(AppContext);

  // Safely process categories (string or Category objects)
  const processedCategories = categories.map((category) => {
    if (typeof category === "string") {
      return { name: category, slug: category.toLowerCase() };
    } else {
      return category; // Category already has name and slug
    }
  });

  return (
    <div className="w-full overflow-x-scroll mb-1 px-4 py-2 no-scrollbar border-t border-gray-900 bg-[#0E0E0E]">
      <ul className="flex whitespace-nowrap gap-10 pt-1">
        {processedCategories.map((category, index) => (
          <li
            key={index}
            onClick={() => {
              setIsOrderMade(false)
              setIsLoading(true)
              setFilter(category.name); // Use category.name here
              router.push(`/explore/category/${category.slug}`); // Use category.slug here
            }}
            className={`cursor-pointer text-[13px] flex flex-col items-center gap-1 ${
              filter === category.name ? "text-white" : "text-[#707070]"
            }`}
          >
            {category.name}
            {filter === category.name && (
              <div className="w-1 h-1 bg-white rounded-full"></div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeadingSlider;
