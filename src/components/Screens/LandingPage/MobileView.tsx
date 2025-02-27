"use client";
import Image from "next/image";
import React, { useState, useContext } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";

const MobileLanding = () => {
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
  const [openQuestions, setOpenQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );

  const { time } = useContext(AppContext);
  const toggleOpen = (index: number) => {
    setOpenQuestions((prev) =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  const router = useRouter();

  return (
    <>
      <div className="bg-[#0E0E0E] w-full min-h-screen py-[10vw] ">
        {/* container1 */}
        <div className="px-[8vw]">
          <p className="text-right text-[3.25vw] text-white text-opacity-[76%]">
            Where every event is an
          </p>
          <p className="text-right text-[3.25vw] text-white text-opacity-[76%]">
            opportunity
          </p>
        </div>
        <div className="mt-[16vw] relative h-[80vw] px-[8vw] ">
          <Image
            src="/Images/LpImage1(gif).gif"
            alt="Landing Page Image 1"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div className=" mt-[10vw] px-[8vw]">
          <p className="text-[10vw]  text-white text-opacity-[78%] text-left Zenfont font-extralight leading-none">
            Trade
          </p>
          <p className="text-[9.2vw]  text-white text-opacity-[78%] text-left Zenfont font-extralight leading-none mt-[2vw] tracking-[0.03rem]">
            on the Outcome of
          </p>
          <p className="text-[10vw]  text-white text-opacity-[78%] text-left Zenfont font-extralight leading-none mt-[1vw]">
            Global Events
          </p>
          <p className="text-[3.25vw] text-white text-opacity-[78%] text-left font-medium mt-[5vw]">
            Use leverage to bet on real-world events and shape your portfolio in
            a new way.
          </p>
        </div>

        {/* slide bar */}
        <div className="mt-[10vw] px-[8vw]">
          <div className="relative w-full h-[12vw] border-[0.25vw] border-white rounded-full border-opacity-[10%] flex items-center justify-start py-[0.5vw] px-[1.5vw]">
            <div className="blur-[30%] relative flex items-center justify-center bg-[#fff] bg-opacity-10 rounded-full w-[9vw] h-[9vw] mr-[3vw] active:bg-gray-600 transition duration-150 cursor-pointer">
              {/* <FaArrowRightLong className="text-white text-[3vw]" /> */}
              <svg
                width="5vw"
                height="2vw"
                viewBox="0 0 13 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.543 2.618C10.205 2.358 9.841 2.03733 9.451 1.656C9.06967 1.27467 8.73167 0.884667 8.437 0.486L9.217 0.0309995C9.51167 0.412333 9.841 0.789333 10.205 1.162C10.5777 1.526 10.9633 1.87267 11.362 2.202C11.7693 2.52267 12.1637 2.80867 12.545 3.06C12.1637 3.30267 11.7693 3.58867 11.362 3.918C10.9633 4.24733 10.5777 4.59833 10.205 4.971C9.841 5.335 9.51167 5.70767 9.217 6.089L8.437 5.634C8.73167 5.23533 9.06967 4.84533 9.451 4.464C9.841 4.074 10.205 3.75333 10.543 3.502H0.52V2.618H10.543Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="text-white text-[3vw] text-opacity-20 font-normal">
              The journey begins.
            </div>
          </div>
        </div>

        {/* vertical line */}
        <div className="flex justify-center my-[5vw]">
          <svg
            width="2"
            height="70"
            viewBox="0 0 2 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 0L1 70"
              stroke="url(#paint0_linear_522_2504)"
              stroke-dasharray="3 3"
            />
            <defs>
              <linearGradient
                id="paint0_linear_522_2504"
                x1="1.5"
                y1="-2.18557e-08"
                x2="1.5"
                y2="70"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#0E0E0E" />
                <stop offset="0.5" stop-color="#585858" />
                <stop offset="1" stop-color="#0E0E0E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* vertical line */}

        <div className="px-[4vw] sm:px-[10vw] mt-[2vw] justify-center flex items-center">
          <Image
            src="/Images/LpImage2.png"
            alt="Landing Page Image 2"
            width={200}
            height={200}
          />
        </div>
        <div className="px-[8vw]">
          <p className="text-[5vw]  text-[#CACACA] text-center font-light Zenfont">
            Predict real-world outcomes and
          </p>
          <p className="text-[5vw]  text-[#CACACA] text-center font-light Zenfont mt-2">
            profit when you’re right.
          </p>
        </div>
        <div className="pt-[10vw]  flex justify-center items-center gap-[2vw] flex-wrap px-[8vw]">
          {["Sports", "Crypto", "Politics", "Weather"].map((cat) => (
            <span
              key={cat}
              className={`text-[3.5vw] bg-[#B5B5B5] Zenfont ${
                category === cat
                  ? "text-black"
                  : "text-[#B5B5B5] bg-opacity-[13%] "
              } px-[3vw] py-[1vw] rounded-full cursor-pointer`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </span>
          ))}
        </div>
        <div className="pt-[2vw] flex justify-center items-center gap-[2vw] flex-wrap px-[8vw]">
          {["Science", "Culture", "Tech"].map((cat) => (
            <span
              key={cat}
              className={`text-[3.5vw] bg-[#B5B5B5] Zenfont ${
                category === cat
                  ? "text-black"
                  : "text-[#B5B5B5] bg-opacity-[13%]"
              } px-[3vw] py-[1vw] rounded-full cursor-pointer`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </span>
          ))}
        </div>
        <div className="mt-[1vw] relative h-[150vw] ml-[3vw] w-full">
          <Image
            src="/Images/LpImage3(gif).gif"
            alt="Landing Page Image 3"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="mt-[5vw] px-[8vw]">
          <p className="text-[3vw] text-white text-opacity-90 font-thin text-center tracking-wider">
            Leverage on event-based trades,
          </p>
          <p className="text-[3vw] text-white text-opacity-90  font-thin text-center tracking-wider">
            simple onboarding, quick payouts,
          </p>
          <p className="text-[3vw] text-white text-opacity-9s0 font-thin text-center tracking-wider">
            a global selection of events
          </p>
        </div>
        {/* vertical lines */}
        <div className="flex justify-center my-[5vw]">
          <svg
            width="2"
            height="70"
            viewBox="0 0 2 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 0L1 70"
              stroke="url(#paint0_linear_522_2504)"
              stroke-dasharray="3 3"
            />
            <defs>
              <linearGradient
                id="paint0_linear_522_2504"
                x1="1.5"
                y1="-2.18557e-08"
                x2="1.5"
                y2="70"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#0E0E0E" />
                <stop offset="0.5" stop-color="#585858" />
                <stop offset="1" stop-color="#0E0E0E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* vertical lilnes */}
        <div className="mt-[2vw] px-[8vw]">
          <p className="text-[4.5vw] text-[#CACACA] text-center font-light Zenfont tracking-[0.5rem]">
            Start trading in
          </p>
          <p className="text-[18vw]  text-[#CACACA] text-center font-semibold leading-[0.85] Zenfont">
            minutes.
          </p>
          <div className="flex justify-center items-center gap-[2vw] mt-[7vw]">
            <span className="text-[3vw] text-white text-opacity-80 font-thin">
              Your ideal setup, in
            </span>
            <span className="border-[0.25vw] text-[#CEFF00] text-[5.5vw] kaisotia px-[2vw]  border-white rounded-lg mx-[3vw]">
              {time}
            </span>
            <span className="text-[3vw] text-white font-thin text-opacity-80">
              seconds
            </span>
          </div>
        </div>
        {/* No padding along x axis */}
        <div className="relative h-[120vw] ">
          <Image
            src="/Images/LpImage4(gif).gif"
            alt="Landing Page Image 4"
            layout="fill"
            objectFit="cover"
            className="absolute bottom-[20vw] right-20 z-10"
          />
        </div>
        {/* No padding along x axis */}

        <div className="px-[4vw] sm:px-[10vw] mt-[5vw]">
          <p className="text-[3.25vw] text-center text-[#CACACA] font-light">
            A trading platform in your browser for free.
          </p>
        </div>

        {/* slide bar */}
        <div className="mt-[10vw] mx-[8vw]  ">
          <div className="relative w-full h-[10vw] border-[0.25vw] border-white rounded-full border-opacity-[25%] flex items-center justify-start py-[0.5vw] px-[1vw]">
            <div className="blur-[30%] relative flex items-center justify-center bg-[#fff] bg-opacity-10  rounded-full w-[8vw] h-[8vw] mr-[3vw] active:bg-gray-600 transition duration-150 cursor-pointer">
              <svg
                width="5vw"
                height="2vw"
                viewBox="0 0 13 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.543 2.618C10.205 2.358 9.841 2.03733 9.451 1.656C9.06967 1.27467 8.73167 0.884667 8.437 0.486L9.217 0.0309995C9.51167 0.412333 9.841 0.789333 10.205 1.162C10.5777 1.526 10.9633 1.87267 11.362 2.202C11.7693 2.52267 12.1637 2.80867 12.545 3.06C12.1637 3.30267 11.7693 3.58867 11.362 3.918C10.9633 4.24733 10.5777 4.59833 10.205 4.971C9.841 5.335 9.51167 5.70767 9.217 6.089L8.437 5.634C8.73167 5.23533 9.06967 4.84533 9.451 4.464C9.841 4.074 10.205 3.75333 10.543 3.502H0.52V2.618H10.543Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="text-white text-[2.75vw]">
              Change your life with just a flick of this button.
            </div>
          </div>
        </div>

        {/* vertical lines */}

        <div className="flex justify-center my-[5vw]">
          <svg
            width="2"
            height="70"
            viewBox="0 0 2 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 0L1 70"
              stroke="url(#paint0_linear_522_2504)"
              stroke-dasharray="3 3"
            />
            <defs>
              <linearGradient
                id="paint0_linear_522_2504"
                x1="1.5"
                y1="-2.18557e-08"
                x2="1.5"
                y2="70"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#0E0E0E" />
                <stop offset="0.5" stop-color="#585858" />
                <stop offset="1" stop-color="#0E0E0E" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="mt-[5vw] relative h-[50vw]  w-full ">
          <Image
            src="/Images/LpImage7(gif).gif"
            alt="Landing Page Image 7"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="px-[8vw]">
          <p className="text-[11vw] -mt-5 text-center text-[#CACACA] Zenfont font-thin">
            Secure.
          </p>
          <p className="text-[3vw] text-center text-[#CACACA] font-light mt-5">
            Enhanced Protection Against Major Vulnerabilities
          </p>
        </div>

        {/* vertical lines */}

        <div className="flex justify-center my-[5vw]">
          <svg
            width="2"
            height="70"
            viewBox="0 0 2 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 0L1 70"
              stroke="url(#paint0_linear_522_2504)"
              stroke-dasharray="3 3"
            />
            <defs>
              <linearGradient
                id="paint0_linear_522_2504"
                x1="1.5"
                y1="-2.18557e-08"
                x2="1.5"
                y2="70"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#0E0E0E" />
                <stop offset="0.5" stop-color="#585858" />
                <stop offset="1" stop-color="#0E0E0E" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="mt-[5vw] px-[8vw]">
          <p className="text-[8vw] text-[#CACACA] Zenfont font-thin leading-none">
            Intuitive
          </p>
          <p className="text-[11vw] text-[#CACACA] Zenfont font-regular tracking-wide">
            User Interface
          </p>
          <p className="text-[2.5vw] text-[#CACACA] mt-[5vw] font-thin leading-[6vw]">
            EveryX is designed with user-friendly navigation, making it easy for
            users to create predictions and manage trades.
          </p>
          <p className="text-[2.5vw] text-[#CACACA] mt-[5vw]  font-thin leading-[6vw]">
            Whether you&apos;re a beginner or an experienced trader, the
            platform ensures a seamless experience.
          </p>
        </div>
        <div className="relative  h-[150vw] w-full">
          <Image
            src="/Images/LpImage8(gif).gif"
            alt="Landing Page Image 8"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="mt-[10vw] px-[8vw] flex justify-center items-center flex-col">
          <div className="flex justify-center items-center gap-[2vw]">
            <CiCircleInfo className="text-[8vw] opacity-50" />
            <span className="text-[4vw] font-extralight">UIUX Friendly</span>
          </div>
          <button
            className="bg-[#D5D5D5] text-black text-[3.5vw] px-[8vw] py-[3.5vw] rounded-full mt-[5vw] font-medium active:bg-gray-400 transition duration-150 "
            onClick={() => {
              router.push("/trade");
            }}
          >
            Get started
          </button>
        </div>

        <div className="flex justify-center my-[5vw]">
          <svg
            width="2"
            height="70"
            viewBox="0 0 2 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 0L1 70"
              stroke="url(#paint0_linear_522_2504)"
              stroke-dasharray="3 3"
            />
            <defs>
              <linearGradient
                id="paint0_linear_522_2504"
                x1="1.5"
                y1="-2.18557e-08"
                x2="1.5"
                y2="70"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#0E0E0E" />
                <stop offset="0.5" stop-color="#585858" />
                <stop offset="1" stop-color="#0E0E0E" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="mt-[5vw] px-[4vw] sm:px-[10vw]">
          <p className="text-[7.25vw] text-[#CCCCCC] Zenfont">
            More fun things
          </p>
          <p className="text-[7vw] text-[#CCCCCC] Zenfont">
            will be &quot;Coming Soon &quot;
          </p>
          <p className="text-[4vw] text-[#CCCCCC] mt-[5vw] font-thin tracking-widest">
            Desktop, leaderboards,
          </p>
          <p className="text-[4vw] text-[#CCCCCC] font-thin tracking-widest">
            achievement bonuses, And more.
          </p>
        </div>
        <div className="relative h-[97.5vw] sm:h-[105vw] mt-[5vw] w-full">
          <Image
            src="/Images/LpImage9(gif).gif"
            alt="Landing Page Image 9"
            layout="fill"
            objectFit="cover"
          />
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
                <stop stopColor="#0E0E0E" />
                <stop offset="0.5" stopColor="#585858" />
                <stop offset="1" stopColor="#0E0E0E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="my-[12vw] px-[4vw] sm:px-[10vw]">
          <p className="text-[10.25vw] text-center Zenfont">Q&A</p>
        </div>
        <div>
          {questions.map((item, index) => (
            <div key={index} className=" border-b-[0.2px] border-[#1c1c1c]">
              <div
                className={`flex justify-between items-center px-10 py-3 cursor-pointer ${
                  openQuestions[index] ? "bg-[#707070]" : "bg-transparent"
                } bg-opacity-[10%]`}
                onClick={() => toggleOpen(index)}
              >
                <p className="text-[3vw] w-full py-2 font-thin">
                  {item.question}
                </p>
                {openQuestions[index] ? (
                  <svg
                    width="20"
                    height="12"
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
                      width="20"
                      height="12"
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
                <div className="mt-3 px-10 py-10">
                  {item.answer.split("\n").map((para, i) => (
                    <p
                      key={i}
                      className="text-[3vw] mb-3 text-white text-opacity-[50%] font-thin tracking-[0.2rem] leading-[5vw]"
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
    </>
  );
};

export default MobileLanding;
