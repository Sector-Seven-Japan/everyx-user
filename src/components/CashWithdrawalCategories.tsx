import { BsWallet2 } from "react-icons/bs";
import { BiTransfer } from "react-icons/bi";
import { AiOutlineTrophy } from "react-icons/ai";
import { VscHistory } from "react-icons/vsc";
import { usePathname, useRouter } from "next/navigation";
import {  useState } from "react";
import Loader from "./Loader/Loader";

export default function CashWithdrawalCategories() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const currentPath = usePathname(); // Get the current page path
  // const { getDepositAddress } = useContext(AppContext);

  const handleNavigation = (path: string) => {
    if (currentPath === path) return; // Don't show loader if already on the same page
    setIsLoading(true);
    router.push(path);
  };

  return (
    <div className="w-full bg-transparent">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader />
        </div>
      )}
      <nav className="mx-auto">
        <ul className="grid grid-cols-4 gap-2">
          <li>
            <button
              onClick={() => handleNavigation("/deposits")}
              type="button"
              className="w-full flex flex-col items-center justify-center p-4 lg:p-2 md:p-2 rounded-lg bg-[white] bg-opacity-[5%] border border-transparent hover:border-white transition-colors gap-1"
            >
              <span className="text-[12px] md:text-[10px] lg:text-[10px] text-white">
                Deposits
              </span>
              <BsWallet2 className="w-5 h-5 md:w-5 md:h-5 lg:w-5 lg:h-5 text-white" />
            </button>
          </li>
          <li>
            <button
              className="w-full flex flex-col items-center justify-center p-4 lg:p-2 md:p-2 rounded-lg bg-[white] bg-opacity-[5%] border border-transparent hover:border-white transition-colors gap-1"
              type="button"
              // onClick={() => handleNavigation("/deposit-withdrawal/withdrawal")}
            >
              <span className="text-[12px] md:text-[10px] lg:text-[10px] text-white">
                Withdrawal
              </span>
              <BiTransfer className="w-5 h-5 md:w-5 md:h-5 lg:w-5 lg:h-5 text-white" />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="w-full flex flex-col items-center justify-center p-4 lg:p-2 md:p-2 rounded-lg bg-[white] bg-opacity-[5%] border border-transparent hover:border-white transition-colors gap-1"
              onClick={() => handleNavigation("/deposit-withdrawal/portfolio")}
            >
              <span className="text-[12px] md:text-[10px] lg:text-[10px] text-white">
                Results
              </span>
              <AiOutlineTrophy className="w-5 h-5 md:w-5 md:h-5 lg:w-5 lg:h-5 text-white" />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="w-full flex flex-col items-center justify-center p-4 lg:p-2 md:p-2 rounded-lg bg-[white] bg-opacity-[5%] border border-transparent hover:border-white transition-colors gap-1"
              onClick={() => handleNavigation("/deposit-withdrawal/history")}
            >
              <span className="text-[12px] md:text-[10px] lg:text-[10px] text-white">
                History
              </span>
              <VscHistory className="w-5 h-5 md:w-5 md:h-5 lg:w-5 lg:h-5 text-white" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
