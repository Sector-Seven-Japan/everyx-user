import { BsWallet2 } from "react-icons/bs";
import { BiTransfer } from "react-icons/bi";
import { AiOutlineTrophy } from "react-icons/ai";
import { VscHistory } from "react-icons/vsc";
import { useRouter } from "next/navigation";

interface CashWithdrawalCategoriesProps {
  openDepositPopup: () => void;
}

export default function CashWithdrawalCategories({
  openDepositPopup,
}: CashWithdrawalCategoriesProps) {
  const router = useRouter();
  return (
    <div className="w-full bg-transparent">
      <nav className="max-w-4xl mx-auto">
        <ul className="grid grid-cols-4 gap-2">
          <li>
            <button
              onClick={openDepositPopup}
              type="button"
              className="w-full flex flex-col items-center justify-center p-4 lg:p-2 md:p-2 rounded-lg bg-[rgba(255,255,255,0.1)] border border-transparent hover:border-white transition-colors gap-1"
            >
              <span className="text-[12px] md:text-[6px] lg:text-[6px] text-white">
                Deposits
              </span>
              <BsWallet2 className="w-5 h-5 md:w-2 md:h-2 lg:w-2 lg:h-2 text-white" />
            </button>
          </li>
          <li>
            <button
              className="w-full flex flex-col items-center justify-center p-4 lg:p-2 md:p-2 rounded-lg bg-[rgba(255,255,255,0.1)] border border-transparent hover:border-white transition-colors gap-1"
              type="button"
              onClick={() => {
                router.push("/deposit-withdrawal/withdrawal");
              }}
            >
              <span className="text-[12px] md:text-[6px] lg:text-[6px] text-white">
                Withdrawal
              </span>
              <BiTransfer className="w-5 h-5 md:w-2 md:h-2 lg:w-2 lg:h-2 text-white" />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="w-full flex flex-col items-center justify-center p-4 lg:p-2 md:p-2 rounded-lg bg-[rgba(255,255,255,0.1)] border border-transparent hover:border-white transition-colors gap-1"
              onClick={() => {
                router.push("/deposit-withdrawal/portfolio");
              }}
            >
              <span className="text-[12px] md:text-[6px] lg:text-[6px] text-white">
                Results
              </span>
              <AiOutlineTrophy className="w-5 h-5 md:w-2 md:h-2 lg:w-2 lg:h-2 text-white" />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="w-full flex flex-col items-center justify-center p-4 lg:p-2 md:p-2 rounded-lg bg-[rgba(255,255,255,0.1)] border border-transparent hover:border-white transition-colors gap-1"
              onClick={() => {
                router.push("/deposit-withdrawal/history");
              }}
            >
              <span className="text-[12px] md:text-[6px] lg:text-[6px] text-white">
                History
              </span>
              <VscHistory className="w-5 h-5 md:w-2 md:h-2 lg:w-2 lg:h-2 text-white" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
