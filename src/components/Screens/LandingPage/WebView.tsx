"use client";

import Image from "next/image";
import React, { useContext, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { CiCircleInfo } from "react-icons/ci";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";

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

  const toggleOpen = (index: number) => {
    setOpenQuestions((prev) =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  const router = useRouter();

  return (
    <div className="bg-[#0E0E0E] w-full min-h-screen py-20 lg:px-[15vw] md:px-[20vw] sm:px-[10vw]">
      {/* container1 */}
      <div className="flex justify-between">
        <div className="">
          <p className="text-[4.5vw]  text-white text-opacity-[78%] text-left ZenAntiqueFont font-bold">
            Trade
          </p>
          <p className="text-[4.5vw]  text-white text-opacity-[78%] text-left ZenAntiqueFont font-bold">
            on the Outcome of
          </p>
          <p className=" text-[4.5vw]   text-white text-opacity-[78%] text-left ZenAntiqueFont font-bold">
            Global Events
          </p>
          <p className="text-[1.2vw] mt-20 text-white text-opacity-[78%] text-left font-thin ">
            Use leverage to bet on real-world events and shape your
          </p>
          <p className="text-[1.2vw]  text-white text-opacity-[78%] text-left font-thin">
            portfolio in a new way.
          </p>
        </div>

        <div className="mt-5">
          <div className="">
            <p className="text-[1vw] tracking-widest text-right text-white text-opacity-[76%]">
              Where every event is an
            </p>
            <p className=" text-[1vw] tracking-widest text-right text-white text-opacity-[76%]">
              opportunity
            </p>
          </div>
          <div className="mt-[5vw] relative">
            <Image
              src="/Images/LpImage1.png"
              alt="Landing Page Image 1"
              className="rounded-lg object-cover object-center relative left-14"
              height={150}
              width={150}
              style={{ width: "20vw", height: "20vw" }}
            />
          </div>
        </div>
      </div>
      <div className="mt-16 ">
        <div className="relative w-full h-10 border-[1px] border-white rounded-full border-opacity-[25%] flex items-center justify-start py-[2px] px-[4px]">
          <div className="blur-[30%] relative flex items-center justify-center bg-[#161616] rounded-full w-8 h-8 mr-3">
            <FaArrowRight className="text-white text-sm" />
          </div>
          <div className="text-white text-sm">The journey begins.</div>
        </div>
      </div>
      {/* container2 */}
      <div className="flex  justify-between mt-[10vw] ">
        <div className="flex flex-col items-center justify-center gap-[2.5vw] ">
          <div>
            <p className="text-[2.5vw]  text-[#fff] text-center font-light">
              Predict real-world outcomes and
            </p>
            <p className="text-[2.5vw]  text-[#fff] text-center font-light">
              profit when you’re right.
            </p>
          </div>
          <div>
            <div className="flex justify-center items-center gap-[0.5vw] flex-wrap">
              {["Sports", "Crypto", "Politics", "Weather"].map((cat) => (
                <span
                  key={cat}
                  className={`text-[0.9vw] bg-[#B5B5B5] ${
                    category === cat
                      ? "text-black"
                      : "text-[#B5B5B5] bg-opacity-[13%]"
                  } px-[1vw] py-[0.5vw] rounded-full cursor-pointer`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>
            <div className="pt-[0.5vw] px-[1vw] flex justify-center items-center gap-[0.5vw] flex-wrap">
              {["Science", "Culture", "Tech"].map((cat) => (
                <span
                  key={cat}
                  className={`text-[0.9vw] bg-[#B5B5B5] ${
                    category === cat
                      ? "text-black"
                      : "text-[#B5B5B5] bg-opacity-[13%]"
                  } px-[1vw] py-[0.5vw] rounded-full cursor-pointer`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[1vw] text-white text-opacity-30 font-semibold text-center tracking-wider">
              Leverage on event-based trades,
            </p>
            <p className="text-[1vw] text-white text-opacity-30 font-semibold text-center tracking-wider">
              simple onboarding, quick payouts,
            </p>
            <p className="text-[1vw] text-white text-opacity-30 font-semibold text-center tracking-wider">
              a global selection of events
            </p>
          </div>
        </div>
        <div className="mb-[10vw]">
          <Image
            src="/Images/LpImage3(web).png"
            alt="Landing Page Image 3"
            width={100}
            height={250}
            className=""
            style={{ width: "25vw", height: "40vw" }}
          />
        </div>
      </div>

      {/* container3 */}
      <div className="flex gap-10 justify-between mt-[5vw] items-start relative">
        <div className="mt-[5vw]">
          <div className="flex flex-col items-center justify-center absolute  ">
            <div className="mt-2 ">
              <p className="text-[2vw] text-[#CACACA] font-light ZenAntiqueFont">
                Start trading in
              </p>
              <p className="text-[5vw]  text-[#CACACA] font-semibold leading-[0.75] Zenfont">
                minutes.
              </p>
              <div className="mt-5">
                <p className="text-[1.2vw] text-[#CACACA] font-light">
                  A trading platform in your browser for free.
                </p>
              </div>
              <div className="gap-2 mt-5">
                <span className="text-[1.5vw] tracking-widest font-light">
                  Your ideal setup, in
                </span>
                <span className="border-[1px] px-[1vw] py-[0.5vw] mx-[1vw] rounded-lg text-[#CEFF00] text-[1vw]">
                  {time}
                </span>
                <span className="text-[1.5vw] tracking-widest font-light">
                  seconds
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Image
            src="/Images/LpImage4(web).png"
            alt="Landing Page Image 4"
            width={400}
            height={500}
            style={{ width: "40vw", height: "40vw" }}
          />
        </div>
      </div>

      <div className="mt-16">
        <div className="relative w-full h-10 border-[1px] border-white rounded-full border-opacity-[25%] flex items-center justify-start py-[2px] px-[4px]">
          <div className="blur-[30%] relative flex items-center justify-center bg-[#161616] rounded-full w-8 h-8 mr-3">
            <FaArrowRight className="text-white text-sm" />
          </div>
          <div className="text-white text-[11px]">
            Change your life with just a flick of this button.
          </div>
        </div>
      </div>

      {/* container4 */}

      <div className="mt-[15vw] flex justify-center items-center">
        <Image
          src="/Images/LpImage7.png"
          alt="Landing Page Image 7"
          width={800}
          height={600}
          style={{ width: "80vw", height: "40vw" }}
        />
      </div>
      <div>
        <p className="text-[5vw]  text-center text-[#CACACA] ZenAntiqueFont font-semibold">
          Secure.
        </p>
        <p className="text-[1.5vw] text-center text-[#CACACA] font-light tracking-widest">
          Enhanced Protection Against Major Vulnerabilities
        </p>
      </div>

      {/* container5 */}

      <div className="flex justify-between mt-[10vw] gap-[2.5vw] items-start ">
        <div className="flex flex-col gap-[5vw] justify-center items-start">
          <div>
            <p className="text-[3vw] text-[#CACACA] ZenAntiqueFont font-semibold">
              Intuitive
            </p>
            <p className="text-[4vw] text-[#CACACA] ZenAntiqueFont font-semibold leading-none ">
              User Interface
            </p>
            <p className="text-[1vw] text-[#CACACA] text-opacity-40 mt-[5vw] tracking-widest">
              EveryX is designed with user-friendly navigation, making it easy
              for users to create predictions and manage trades.
            </p>
            <p className="text-[1vw] text-[#CACACA] text-opacity-40 tracking-widest">
              Whether you&apos;re a beginner or an experienced trader, the
              platform ensures a seamless experience.
            </p>
          </div>
          <div className="mt-[3vw] flex justify-center items-center flex-col">
            <div className="flex justify-center items-center gap-[0.5vw]">
              <CiCircleInfo className="text-[1.5vw]" />
              <span className="text-[1.5vw] font-extralight">
                UIUX Friendly
              </span>
            </div>
            <button
              className="bg-[#D5D5D5] text-black text-[1.5vw] px-[1.25vw] py-[0.5vw] rounded-full mt-[1.25vw] font-medium cursor-pointer active:bg-gray-400 transition duration-150"
              onClick={() => {
                router.push("/trade");
              }}
            >
              Get started
            </button>
          </div>
        </div>
        <div className="mt-[4vw]">
          <Image
            src="/Images/LpImage8.png"
            alt="Landing Page Image 8"
            width={500}
            height={300}
            style={{ width: "30vw", height: "35vw" }}
          />
        </div>
      </div>

      {/* container6 */}

      <div>
        <div className="mt-5 ">
          <p className="text-[5vw] text-[#CCCCCC] ZenAntiqueFont ">
            More fun things
          </p>
          <p className="text-[5vw] text-[#CCCCCC] ZenAntiqueFont ">
            will be &quot;Coming Soon &quot;
          </p>
          <p className="text-[1.5vw] text-[#CCCCCC] mt-5  tracking-widest text-opacity-40">
            Desktop, leaderboards, achievement bonuses, And more.
          </p>
        </div>
        <div className="mt-10 flex items-center justify-center">
          <Image
            src="/Images/LpImage9.png"
            alt="Landing Page Image 9"
            width={500}
            height={500}
            style={{ width: "30vw", height: "30vw" }}
          />
        </div>
      </div>

      {/* container7 */}
      <div className="my-12 px-4 sm:px-10">
        <p className="text-[41px] text-center Zenfont">Q&A</p>
      </div>
      <div>
        {questions.map((item, index) => (
          <div key={index} className="my-5 border-b border-gray-800">
            <div
              className={`flex justify-between items-center px-5  py-3 cursor-pointer ${
                openQuestions[index] ? "bg-[#707070]" : "bg-transparent"
              } bg-opacity-[10%]`}
              onClick={() => toggleOpen(index)}
            >
              <p className="text-[13px] w-full py-2">{item.question}</p>
              {openQuestions[index] ? (
                <FaChevronUp size={15} color="#000" />
              ) : (
                <FaChevronDown size={15} color="#000" />
              )}
            </div>
            {openQuestions[index] && (
              <div className="mt-3 px-4 sm:px-10">
                {item.answer.split("\n").map((para, i) => (
                  <p key={i} className="text-[13px] mb-3 opacity-[38%]">
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
