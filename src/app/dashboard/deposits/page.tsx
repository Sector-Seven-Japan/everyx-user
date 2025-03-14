"use client";

import { AppContext } from "@/app/Context/AppContext";
import { DepositContext } from "@/app/Context/DepositContext";
import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";
import HeadingSlider from "@/components/HeadingSlider";
import Navbar from "@/components/Navbar";
import type React from "react";
import { useContext, useEffect, useState } from "react";
import { useChainId } from "wagmi";

const Deposit: React.FC = () => {
  const { isMobile, filter, setFilter } = useContext(AppContext);
  const { writeContract, contractData, amount, setAmount, selectedNetwork, setSelectedNetwork } =
    useContext(DepositContext);

  const chainId = useChainId()

  const [value, setValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const networks = [
    { value: "tPOLY", label: "Polygon Amoy Testnet", chainId: 80002 },
    { value: "tBNB", label: "BSC Testnet", chainId: 97 },
  ];

  const [msg, setMsg] = useState<string>("")

  useEffect(() => {
    console.log("Deposit page - Current context amount:", amount);
  }, [amount]);

  useEffect(() => {
    console.log("Deposit page - Current local value:", value);
  }, [value]);

  useEffect(() => {
    if (selectedNetwork && chainId) {
      console.log("Selected network:", selectedNetwork, chainId);
      const selectedNetworkData = networks.find((network) => network.value === selectedNetwork);
      if (selectedNetworkData?.chainId !== chainId)
        setMsg("Kindly switch your network in order to proceed!")
      else
        setMsg("")
    }
  }, [selectedNetwork, chainId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, "");
    console.log("Input changed to:", newValue);
    setValue(newValue);
  };

  const handleNetworkSelect = (network: string) => {
    setSelectedNetwork(network);
    setIsOpen(false);
  };

  const processTXN = async () => {
    try {
      const numericValue = value.replace("$", "");
      if (isNaN(Number.parseFloat(numericValue))) {
        console.error("Invalid amount");
        return;
      }

      const valueInWei = (
        Number.parseFloat(numericValue) *
        10 ** 18
      ).toString();
      console.log("Transferring amount:", numericValue);
      console.log("Using network:", selectedNetwork);
      console.log("ContractData:", contractData[selectedNetwork])

      if (contractData[selectedNetwork].address && contractData[selectedNetwork].abi) {
        writeContract({
          address: contractData[selectedNetwork].address as `0x${string}`,
          abi: contractData[selectedNetwork].abi,
          functionName: "transfer",
          args: ["0x6e22d47D5aFDe5baf633Abc0C805781483BCC69e", valueInWei],
          gas: BigInt(100000), // Increase gas limit (example value, adjust as needed)
          maxFeePerGas: BigInt(50000000000), // 50 Gwei (example value, adjust as needed)
          maxPriorityFeePerGas: BigInt(2000000000), // 2 Gwei (example value, adjust as needed)
        });
      } else {
        console.error("Contract data is not properly initialized");
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value) {
      setAmount(value)
      await processTXN()
    }
  };

  const handleProceed = async () => {
    if (!value)
      console.error("No amount entered")
    setAmount(value)
    await processTXN()
  };

  return (
    <>
      <Navbar />
      {isMobile ? (
        <div className="bg-[#0E0E0E] w-full min-h-screen text-white pt-5 flex flex-col">
          <CurrentCashBalanceCard />
          <div className="bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col items-center rounded-t-3xl mt-10 py-2">
            <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div>

            <div className="mt-10 flex items-center justify-center w-full px-5">
              <button className="text-white text-[16px]">Deposit:</button>
            </div>

            <div className="pt-10 pb-10 w-full px-10">
              <p className="mb-2 text-white font-medium">Select Network:</p>
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="bg-[#1A1A1A] text-white border border-[#333333] hover:border-[#00FFB8] p-3 rounded-xl w-full text-left flex justify-between items-center transition-all duration-200"
                >
                  <span className="flex items-center">
                    {networks.find((n) => n.value === selectedNetwork)?.label}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                      }`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <h6 className="text-[#04fbb8] text-[10px]">{msg || ""}</h6>
                {isOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.3)] z-10 border border-[#333333] backdrop-blur-sm">
                    {networks.map((network) => (
                      <button
                        key={network.value}
                        onClick={() => handleNetworkSelect(network.value)}
                        className={`block w-full text-left px-4 py-3 transition-colors duration-200 flex items-center ${selectedNetwork === network.value
                          ? "bg-[#1A1A1A] text-[#00FFB8]"
                          : "bg-[#262626] text-white hover:bg-[#1A1A1A] hover:text-[#00FFB8]"
                          }`}
                      >
                        {network.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center bg-transparent justify-center px-10">
              <input
                type="text"
                value={value ? `$${value}` : ""}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="0.00"
                className="text-white bg-transparent text-[34px] font-bold outline-none placeholder-[#707070] w-full pl-2 text-center"
                aria-label="Enter deposit amount"
              />
            </div>

            <div className="bg-[#707070] bg-opacity-[20%] px-5 py-1 rounded-3xl mt-5">
              USD
            </div>
            <button
              onClick={handleProceed}
              disabled={true}
              className="bg-[#00FFB8] py-3 w-[80%] mt-10 rounded-md text-black text-[18px] flex items-center justify-center gap-3 md:text-[0.9vw] disable"
            >
              Proceed
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#0E0E0E] px-[20vw] text-white">
          <HeadingSlider filter={filter} setFilter={setFilter} />
          <div className="pt-[4.65%] flex justify-center gap-5 h-screen">
            <div className="bg-[#262626] bg-opacity-[31%] flex flex-col items-center rounded-t-3xl py-2 h-full w-full">
              <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div>

              <div className="mt-10 flex items-center justify-center w-full px-5">
                <button className="text-white text-[16px]">Deposit:</button>
              </div>

              <div className="pt-10 pb-10">
                <p className="mb-2 text-white font-medium">
                  Select Network:
                </p>
                <div className="relative w-[24vw]">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-[#1A1A1A] text-white border border-[#333333] hover:border-[#00FFB8] p-3 rounded-xl w-full text-left flex justify-between items-center transition-all duration-200"
                  >
                    <span className="flex items-center">
                      {networks.find((n) => n.value === selectedNetwork)?.label}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <h6 className="text-[#04fbb8] text-[12px]">{msg || ""}</h6>
                  {isOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.3)] z-10 border border-[#333333] backdrop-blur-sm">
                      {networks.map((network) => (
                        <button
                          key={network.value}
                          onClick={() => handleNetworkSelect(network.value)}
                          className={`block w-full text-left px-4 py-3 transition-colors duration-200 flex items-center ${selectedNetwork === network.value
                            ? "bg-[#1A1A1A] text-[#00FFB8]"
                            : "bg-[#262626] text-white hover:bg-[#1A1A1A] hover:text-[#00FFB8]"
                            }`}
                        >
                          {network.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 flex items-center bg-transparent justify-center px-10">
                <input
                  type="text"
                  value={value ? `$${value}` : ""}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="$0.00"
                  className="text-white bg-transparent text-[34px] font-bold outline-none placeholder-[#707070] w-full pl-2 text-center"
                  aria-label="Enter deposit amount"
                />
              </div>

              <div className="bg-[#707070] bg-opacity-[20%] px-5 py-1 rounded-3xl mt-5">
                USD
              </div>
              <button
                onClick={handleProceed}
                disabled={msg !== "" ? true : false}
                className="bg-[#00FFB8] py-3 w-[20vw] mt-10 rounded-md text-black text-[18px] flex items-center justify-center gap-3 md:text-[0.9vw]"
              >
                Proceed
              </button>
            </div>
            <div className="flex justify-end">
              <CurrentCashBalanceCardWebview />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Deposit;
