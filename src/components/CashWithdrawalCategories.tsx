import { BsWallet2 } from "react-icons/bs";
import { BiTransfer } from "react-icons/bi";
import { AiOutlineTrophy } from "react-icons/ai";
import { VscHistory } from "react-icons/vsc";

// import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CashWithdrawalCategories() {
  const router = useRouter();
  return (
    <div className="w-full bg-[#0E0E0E]">
      <nav className="max-w-4xl mx-auto">
        <ul className="grid grid-cols-4 gap-4">
          <li>
            <button
              type="button"
              className="w-full flex flex-col items-center justify-center p-4 rounded-lg bg-[rgba(255,255,255,0.1)] border border-transparent hover:border-white transition-colors gap-2"
              onClick={() => {
                router.push("/deposit-withdrawal/deposits");
              }}
            >
              <span className="text-[11px] text-white ">Deposits</span>
              <BsWallet2 className="w-4 h-4 text-white" />
            </button>
          </li>
          <li>
            <button
              className="w-full flex flex-col items-center justify-center p-4 rounded-lg bg-[rgba(255,255,255,0.1)] border border-transparent hover:border-white transition-colors gap-2"
              type="button"
              onClick={() => {
                router.push("/deposit-withdrawal/withdrawal");
              }}
            >
              <span className="text-[11px] text-white">Withdrawal</span>
              <BiTransfer className="w-4 h-4 text-white " />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="w-full flex flex-col items-center justify-center p-4 rounded-lg bg-[rgba(255,255,255,0.1)] border border-transparent hover:border-white transition-colors gap-2"
              onClick={() => {
                router.push("/deposit-withdrawal/portfolio");
              }}
            >
              <span className="text-[11px] text-white">Results</span>
              <AiOutlineTrophy className="w-4 h-4 text-white " />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="w-full flex flex-col items-center justify-center p-4 rounded-lg bg-[rgba(255,255,255,0.1)] border border-transparent hover:border-white transition-colors gap-2"
              onClick={() => {
                router.push("/deposit-withdrawal/history");
              }}
            >
              <span className="text-[11px] text-white">History</span>
              <VscHistory className="w-4 h-4 text-white " />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
