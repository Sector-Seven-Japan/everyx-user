"use client";

import Image from "next/image";
import React, { useContext, useState, useEffect } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import LoadingPage from "@/components/LoadingPage";
import DragSlider from "@/components/drag-slider";

const WebLanding = () => {
  const questions = [
    {
      question: "Q. What is EveryX?",
      answer:
        "EveryX is a prediction market platform that allows users to forecast real-world events and trade based on those predictions. Users can buy and sell shares representing different possible outcomes of an event, with the price reflecting the market's consensus on the probability of each outcome.",
    },
    {
      question: "Q. How does EveryX work?",
      answer:
        "EveryX operates by allowing users to create and participate in markets based on events. Users can trade shares of various potential outcomes, and as new information becomes available, the market's predictions may shift. This creates a dynamic environment where participants can profit from correct predictions and trading strategies.",
    },
    {
      question: "Q. What fees are associated with EveryX?",
      answer:
        "EveryX charges a small fee for each transaction made on the platform. The fee structure may vary based on the volume of trading or the type of event. It's important to check the platform's fee schedule for detailed information before making trades.",
    },
    {
      question: "Q. What types of events can I predict on EveryX?",
      answer:
        "EveryX offers a wide range of events to predict, including political elections, economic indicators, sports outcomes, celebrity gossip, weather events, and even more niche scenarios. The platform continually adds new events based on user demand and current trends.",
    },
    {
      question: "Q. What fees are associated with EveryX?",
      answer:
        "EveryX charges a small transaction fee on each prediction made. This helps maintain the platform and incentivizes market makers to contribute liquidity to prediction markets. Users should be aware of these fees when making trades.",
    },
    {
      question: "Q. How do I start using EveryX?",
      answer:
        "To get started with EveryX, you first need to create an account on the platform. Once your account is set up, you can deposit funds and start exploring active markets. You can place trades, predict outcomes, and monitor your performance over time. It’s recommended to review the platform's tutorials for a detailed guide.",
    },
    {
      question: "Q. Can I trade my predictions?",
      answer:
        "Yes, EveryX allows users to trade their predictions in real-time. If you hold shares in a prediction market, you can sell them to other users at any time before the event concludes. The price of the shares will fluctuate based on the market's assessment of the likelihood of the event's outcome.",
    },
  ];
  const [category, setCategory] = useState("Sports");
  const { time } = useContext(AppContext);
  const [openQuestions, setOpenQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );
  const [isLoading, setIsLoading] = useState(false);

  const toggleOpen = (index: number) => {
    setOpenQuestions((prev) =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  const router = useRouter();

  useEffect(() => {
    const handleImageLoad = () => {
      const images = document.querySelectorAll("img");
      const totalImages = images.length;
      let loadedImages = 0;

      images.forEach((img) => {
        if (img.complete) {
          loadedImages++;
        } else {
          img.addEventListener("load", () => {
            loadedImages++;
            if (loadedImages === totalImages) {
              setIsLoading(false);
            }
          });
        }
      });

      if (loadedImages === totalImages) {
        setIsLoading(false);
      }
    };

    handleImageLoad();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="bg-[#0E0E0E] w-full min-h-screen py-24 lg:px-[19vw] md:px-[20vw] sm:px-[10vw]">
      {/* container1 */}
      <div className="flex justify-between">
        <div>
          <p className="text-[4.5vw]  text-white text-opacity-[78%] text-left Zenfont font-extralight leading-normal">
            Trade
          </p>
          <p className="text-[4vw]  text-white text-opacity-[78%] text-left Zenfont font-extralight leading-none">
            on the Outcome of
          </p>
          <p className=" text-[4.5vw]   text-white text-opacity-[78%] text-left Zenfont font-extralight leading-tight">
            Global Events
          </p>
          <p className="text-[1vw] mt-[5vw] text-white text-opacity-[80%] text-left font-normal leading-[2.5rem] ">
            Use leverage to trade on real-world events and maximize your
            potential gains.
          </p>
          {/* <p className="text-[1.1vw]  text-white text-opacity-[80%] text-left font-normal">
            portfolio in a new way.
          </p> */}
        </div>

        <div className="mt-5">
          <div className="">
            <p className="text-[0.8vw] tracking-[0.2rem] text-right text-white text-opacity-[60%]">
              Where every event is an
            </p>
            <p className=" text-[0.8vw]  tracking-[0.2rem] text-right text-white text-opacity-[60%]">
              opportunity
            </p>
          </div>
          <div className="mt-[5vw] relative">
            <Image
              src="/Images/LpImage1(gif).gif"
              alt="Landing Page Image 1"
              className="rounded-lg object-cover object-center relative left-10"
              height={150}
              width={150}
              style={{ width: "20vw", height: "20vw" }}
            />
          </div>
        </div>
      </div>
      <div className="mt-12">
        <DragSlider text="The journey begins." />
      </div>
      <div className="flex justify-center my-[5vw]">
        <svg
          width="2"
          height="90"
          viewBox="0 0 2 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 0L1 90"
            stroke="url(#paint0_linear_536_1409)"
            stroke-dasharray="3 3"
          />
          <defs>
            <linearGradient
              id="paint0_linear_536_1409"
              x1="1.5"
              y1="-2.18557e-08"
              x2="1.5"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#0E0E0E" />
              <stop offset="0.5" stop-color="#585858" />
              <stop offset="1" stop-color="#0E0E0E" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* container2 */}
      <div className="flex  justify-between gap-10  mt-[5vw] ">
        <div className="flex flex-col items-center justify-center gap-[4vw]  w-[70%] py-20 ">
          <div>
            <p className="text-[4.2vw]  text-[#cacaca] text-center font-light Zenfont leading-none">
              with leverage.
            </p>
            <div className="mt-12 mb-7 flex justify-center items-center gap-3">
              <Image
                src="/Images/tooltip.png"
                alt="tooltip"
                width={10}
                height={10}
                style={{
                  width: "1.6vw",
                  height: "1.6vw",
                }}
              />
              <p className="text-[1.1vw]  text-[#cacaca] text-opacity-80 text-center font-thin Zenfont leading-none  ">
                Limitations and risks apply
              </p>
            </div>
          </div>
          <div>
            <div className="flex justify-center items-center gap-[0.5vw] flex-wrap">
              {["Sports", "Crypto", "Politics", "Weather"].map((cat) => (
                <span
                  key={cat}
                  className={`text-[1vw] bg-[#B5B5B5] ${
                    category === cat
                      ? "text-black"
                      : "text-[#B5B5B5] bg-opacity-[13%]"
                  } px-[2vw] py-[0.5vw] rounded-full cursor-pointer Zenfont`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>
            <div className="pt-[1.5vw] px-[1vw] flex justify-center items-center gap-[0.5vw] flex-wrap">
              {["Science", "Culture", "Tech"].map((cat) => (
                <span
                  key={cat}
                  className={`text-[1vw] bg-[#B5B5B5] ${
                    category === cat
                      ? "text-black"
                      : "text-[#B5B5B5] bg-opacity-[13%]"
                  } px-[2vw] py-[0.5vw] rounded-full cursor-pointer Zenfont`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[1vw] text-white  text-opacity-80 font-thin text-center tracking-[0.2rem]">
              Leverage on event-based trades,
            </p>
            <p className="text-[1vw] text-white  text-opacity-80 font-thin text-center tracking-[0.2rem]">
              simple onboarding, quick payouts,
            </p>
            <p className="text-[1vw] text-white  text-opacity-80 font-thin text-center tracking-[0.2rem]">
              a global selection of events
            </p>
          </div>
        </div>
        <div className="mb-[3vw] relative ">
          <Image
            src="/Images/LpImage3(gif).gif"
            alt="Landing Page Image 3"
            width={100}
            height={250}
            className="relative left-10"
            style={{ width: "24vw", height: "33vw" }}
          />
        </div>
      </div>
      <div className="flex justify-center ">
        <svg
          width="2"
          height="90"
          viewBox="0 0 2 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 0L1 90"
            stroke="url(#paint0_linear_536_1409)"
            stroke-dasharray="3 3"
          />
          <defs>
            <linearGradient
              id="paint0_linear_536_1409"
              x1="1.5"
              y1="-2.18557e-08"
              x2="1.5"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#0E0E0E" />
              <stop offset="0.5" stop-color="#585858" />
              <stop offset="1" stop-color="#0E0E0E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* container3 */}
      <div className="flex gap-10 justify-between items-start relative">
        <div className="mt-[5vw]">
          <div className="flex flex-col items-center justify-center absolute  ">
            <div className="mt-2 ">
              <p className="text-[1.8vw] text-[#CACACA] font-light Zenfont">
                Start trading in
              </p>
              <p className="text-[6.3vw]  text-[#CACACA] font-semibold leading-[0.85] Zenfont">
                minutes.
              </p>
              <div className="mt-20">
                <p className="text-[1.5vw] text-[#CACACA] font-light">
                  A trading platform in your browser for free.
                </p>
              </div>
              <div className="gap-2 mt-10">
                <span className="text-[1.2vw] tracking-widest font-light">
                  Your ideal setup, in
                </span>
                <span className="border-[1px] border-gray-500 px-[1vw] py-[0.5vw] mx-[1vw] rounded-lg text-[#CEFF00] text-[2vw] kaisotia tracking-[0.3rem]">
                  {time}
                </span>
                <span className="text-[1.2vw] tracking-widest font-light">
                  seconds
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <Image
            src="/Images/LpImage4(gif).gif"
            alt="Landing Page Image 4"
            width={400}
            height={500}
            className="relative right-10 top-24"
            style={{ width: "40vw", height: "40vw" }}
          />
        </div>
      </div>

      <div className="mt-32 ">
        <DragSlider text="Predict now on EveryX" />
      </div>

      <div className="flex justify-center mt-[5vw] ">
        <svg
          width="2"
          height="90"
          viewBox="0 0 2 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 0L1 90"
            stroke="url(#paint0_linear_536_1409)"
            stroke-dasharray="3 3"
          />
          <defs>
            <linearGradient
              id="paint0_linear_536_1409"
              x1="1.5"
              y1="-2.18557e-08"
              x2="1.5"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#0E0E0E" />
              <stop offset="0.5" stop-color="#585858" />
              <stop offset="1" stop-color="#0E0E0E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* container4 */}

      <div className="mt-[5vw] flex justify-center items-center">
        <Image
          src="/Images/LpImage7(gif).gif"
          alt="Landing Page Image 7"
          width={800}
          height={600}
          style={{ width: "80vw", height: "35vw" }}
        />
      </div>
      <div>
        <p className="text-[4vw]  text-center -mt-[5vw] text-[#CACACA] Zenfont font-normal">
          Secure.
        </p>
        <p className="text-[1vw] text-center text-[#CACACA] font-light tracking-widest">
          Enhanced Protection Against Major Vulnerabilities
        </p>
      </div>

      <div className="flex justify-center mt-[5vw] ">
        <svg
          width="2"
          height="90"
          viewBox="0 0 2 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 0L1 90"
            stroke="url(#paint0_linear_536_1409)"
            stroke-dasharray="3 3"
          />
          <defs>
            <linearGradient
              id="paint0_linear_536_1409"
              x1="1.5"
              y1="-2.18557e-08"
              x2="1.5"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#0E0E0E" />
              <stop offset="0.5" stop-color="#585858" />
              <stop offset="1" stop-color="#0E0E0E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* container5 */}

      <div className="flex justify-between mt-[5vw] gap-[2.5vw] items-start ">
        <div className="flex flex-col gap-[5vw] justify-center items-start">
          <div>
            <p className="text-[3vw] text-[#CACACA] Zenfont font-normal">
              Intuitive
            </p>
            <p className="text-[4.5vw] text-[#CACACA] Zenfont font-normal leading-none ">
              User Interface
            </p>
            <p className="text-[1.2vw] text-[#CACACA] text-opacity-60 mt-[5vw] tracking-[0.25rem] font-thin">
              EveryX is designed with user-friendly navigation, making it easy
              for users to create predictions and manage trades.
            </p>
            <p className="text-[1.2vw] text-[#CACACA] text-opacity-60 tracking-[0.25rem] font-thin">
              Whether you&apos;re a beginner or an experienced trader, the
              platform ensures a seamless experience.
            </p>
          </div>
          <div className="mt-[4.5vw] flex justify-center items-center flex-col">
            <div className="flex justify-center items-center gap-[1vw] ">
              <CiCircleInfo
                className="text-[2vw] opacity-50 "
                color="#f0f0f0"
              />
              <span className="text-[0.9vw] font-extralight tracking-[0.15rem] text-opacity-50">
                UIUX Friendly
              </span>
            </div>
            <button
              className="bg-[#D5D5D5] text-black text-[1vw]  px-[3vw] py-[1.5vw] rounded-full mt-[1.25vw] font-normal cursor-pointer active:bg-gray-400 transition duration-150"
              onClick={() => {
                router.push("/trade");
              }}
            >
              Get started
            </button>
          </div>
        </div>
        <div className="mt-5">
          <Image
            src="/Images/LpImage8(gif).gif"
            alt="Landing Page Image 8"
            width={500}
            height={300}
            style={{ width: "50vw", height: "42vw" }}
          />
        </div>
      </div>
      <div className="flex justify-center mt-[5vw] ">
        <svg
          width="2"
          height="90"
          viewBox="0 0 2 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 0L1 90"
            stroke="url(#paint0_linear_536_1409)"
            stroke-dasharray="3 3"
          />
          <defs>
            <linearGradient
              id="paint0_linear_536_1409"
              x1="1.5"
              y1="-2.18557e-08"
              x2="1.5"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#0E0E0E" />
              <stop offset="0.5" stop-color="#585858" />
              <stop offset="1" stop-color="#0E0E0E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* container6 */}

      <div>
        <div className="mt-5 ">
          <p className="text-[5vw] text-[#CCCCCC] Zenfont font-extralight tracking-[0.3rem]">
            More fun things
          </p>
          <p className="text-[4.5vw] text-[#CCCCCC] Zenfont leading-none tracking-[0.3rem]">
            will be &quot;Coming Soon &quot;
          </p>
          <p className="text-[1.4vw] text-[#CCCCCC] mt-5   text-opacity-70 font-thin tracking-[0.2rem]">
            Desktop, leaderboards, achievement bonuses, And more.
          </p>
        </div>
        <div className="mt-14 flex items-center justify-center">
          <Image
            src="/Images/LpImage9(gif).gif"
            alt="Landing Page Image 9"
            width={500}
            height={500}
            style={{ width: "26vw", height: "24vw" }}
          />
        </div>
      </div>

      <div className="flex justify-center mt-5 ">
        <svg
          width="2"
          height="90"
          viewBox="0 0 2 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 0L1 90"
            stroke="url(#paint0_linear_536_1409)"
            stroke-dasharray="3 3"
          />
          <defs>
            <linearGradient
              id="paint0_linear_536_1409"
              x1="1.5"
              y1="-2.18557e-08"
              x2="1.5"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#0E0E0E" />
              <stop offset="0.5" stop-color="#585858" />
              <stop offset="1" stop-color="#0E0E0E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* container7 */}
      <div className="mt-16 px-4 sm:px-10 mb[10vw]">
        <p className="text-[3vw] text-center Zenfont">Q&A</p>
      </div>
      <div className="mt-5">
        {questions.map((item, index) => (
          <div key={index} className=" border-b-[0.2px] border-[#1c1c1c]">
            <div
              className={`flex justify-between items-center px-10 py-8 cursor-pointer ${
                openQuestions[index] ? "bg-[#707070]" : "bg-transparent"
              } bg-opacity-[10%]`}
              onClick={() => toggleOpen(index)}
            >
              <p className="text-[1.1vw] w-full py-2 tracking-[0.25rem] font-thin">
                {item.question}
              </p>
              {openQuestions[index] ? (
                <svg
                  width="30"
                  height="18"
                  viewBox="0 0 36 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.21484 18L18.5905 1.42773L34.9522 18"
                    stroke="#EEEEEE"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              ) : (
                <div>
                  <svg
                    width="30"
                    height="18"
                    viewBox="0 0 36 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.36"
                      d="M34.7949 1.23047L17.4193 21.6465L1.05762 1.23047"
                      stroke="#757274"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
            {openQuestions[index] && (
              <div className="mt-3 px-20 py-10">
                {item.answer.split("\n").map((para, i) => (
                  <p
                    key={i}
                    className="text-[1.1vw] mb-3 text-white text-opacity-[50%] font-thin tracking-[0.3rem] leading-[2.5vw]"
                  >
                    {para}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebLanding;
