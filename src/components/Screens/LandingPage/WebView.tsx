"use client";
import Image from "next/image";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { CiCircleInfo } from "react-icons/ci";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

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
      question: "Q. How do I start using EveryX?",
      answer:
        "To get started with EveryX, you first need to create an account on the platform. Once your account is set up, you can deposit funds and start exploring active markets. You can place trades, predict outcomes, and monitor your performance over time. It's recommended to review the platform's tutorials for a detailed guide.",
    },
    {
      question: "Q. Can I trade my predictions?",
      answer:
        "Yes, EveryX allows users to trade their predictions in real-time. If you hold shares in a prediction market, you can sell them to other users at any time before the event concludes. The price of the shares will fluctuate based on the market's assessment of the likelihood of the event's outcome.",
    },
  ];
  const [category, setCategory] = useState("Sports");
  const [isLoading, setIsLoading] = useState(true);
  const [openQuestions, setOpenQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );

  const toggleOpen = (index: number) => {
    setOpenQuestions((prev) =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  return (
    <div className="bg-[#0E0E0E] w-full min-h-screen py-8 px-4 md:py-20 md:px-8 lg:px-48">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="">
          <p className="text-3xl md:text-5xl text-white text-opacity-[78%] text-left ZenAntiqueFont font-bold">
            Trade
          </p>
          <p className="text-2xl md:text-[40px] text-white text-opacity-[78%] text-left ZenAntiqueFont font-bold">
            on the Outcome of
          </p>
          <p className="text-2xl md:text-[40px] text-white text-opacity-[78%] text-left ZenAntiqueFont font-bold">
            Global Events
          </p>
          <p className="text-sm md:text-[16px] text-white text-opacity-[78%] text-left font-thin mt-5">
            Use leverage to bet on real-world events and shape your portfolio in
            a new way.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end">
          <div className="flex flex-col items-center md:items-end">
            <p className="text-center md:text-right text-xs md:text-[13px] text-white text-opacity-[76%]">
              Where every event is an
            </p>
            <p className="text-center md:text-right text-xs md:text-[13px] text-white text-opacity-[76%]">
              opportunity
            </p>
          </div>
          <div className="mt-8 md:mt-16 relative w-full md:w-auto">
            <Image
              src="/Images/LpImage1(web).png"
              alt="Landing Page Image 1"
              className="rounded-lg object-cover object-center mx-auto md:mx-0"
              height={200}
              width={200}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 md:mt-16">
        <div className="relative w-full h-10 border-[1px] border-white rounded-full border-opacity-[25%] flex items-center justify-start py-[2px] px-[4px]">
          <div className="blur-[30%] relative flex items-center justify-center bg-[#161616] rounded-full w-8 h-8 mr-3">
            <FaArrowRight className="text-white text-sm" />
          </div>
          <div className="text-white text-xs md:text-sm">
            The journey begins.
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 md:mt-20 px-4 md:px-32">
        <div className="flex flex-col items-center justify-center gap-8 md:gap-10">
          <div>
            <p className="text-base md:text-[21px] text-[#CACACA] text-center font-light">
              Predict real-world outcomes and
            </p>
            <p className="text-base md:text-[21px] text-[#CACACA] text-center font-light">
              profit when you're right.
            </p>
          </div>
          <div>
            <div className="flex justify-center items-center gap-2 flex-wrap">
              {["Sports", "Crypto", "Politics", "Weather"].map((cat) => (
                <span
                  key={cat}
                  className={`text-xs md:text-[14px] bg-[#B5B5B5] ${
                    category === cat
                      ? "text-black"
                      : "text-[#B5B5B5] bg-opacity-[13%]"
                  } px-3 py-1 rounded-full cursor-pointer`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>
            <div className="pt-2 px-4 sm:px-10 flex justify-center items-center gap-2 flex-wrap">
              {["Science", "Culture", "Tech"].map((cat) => (
                <span
                  key={cat}
                  className={`text-xs md:text-[14px] bg-[#B5B5B5] ${
                    category === cat
                      ? "text-black"
                      : "text-[#B5B5B5] bg-opacity-[13%]"
                  } px-3 py-1 rounded-full cursor-pointer`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs md:text-[13px] text-white font-semibold text-center tracking-wider">
              Leverage on event-based trades,
            </p>
            <p className="text-xs md:text-[13px] text-white font-semibold text-center tracking-wider">
              simple onboarding, quick payouts,
            </p>
            <p className="text-xs md:text-[13px] text-white font-semibold text-center tracking-wider">
              a global selection of events
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start justify-center">
          <Image
            src="/Images/LpImage3(web).png"
            alt="Landing Page Image 3"
            height={300}
            width={300}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 md:mt-20">
        <div className="flex flex-col items-center md:items-start justify-center">
          <div className="mt-2">
            <p className="text-lg md:text-[19px] text-[#CACACA] font-light ZenAntiqueFont text-center md:text-left">
              Start trading in
            </p>
            <p className="text-4xl md:text-6xl text-[#CACACA] font-semibold leading-[0.75] Zenfont text-center md:text-left">
              minutes.
            </p>
            <div className="mt-5">
              <p className="text-xs md:text-[13px] text-[#CACACA] font-light text-center md:text-left">
                A trading platform in your browser for free.
              </p>
            </div>
            <div className="gap-2 mt-5 text-center md:text-left">
              <span className="text-xs md:text-[13px]">
                Your ideal setup, in
              </span>
              <span className="border-[1px] text-[#CEFF00] text-xs md:text-[13px]">
                00:05:93
              </span>
              <span className="text-xs md:text-[13px]">seconds</span>
            </div>
          </div>
        </div>
        <div className="relative md:right-48 md:top-28">
          <Image
            src="/Images/LpImage4(web).png"
            alt="Landing Page Image 4"
            width={500}
            height={500}
            className="mx-auto md:mx-0"
          />
        </div>
      </div>

      <div className="mt-20 md:mt-44 px-4 sm:px-10">
        <div className="relative w-full h-10 border-[1px] border-white rounded-full border-opacity-[25%] flex items-center justify-start py-[2px] px-[4px]">
          <div className="blur-[30%] relative flex items-center justify-center bg-[#161616] rounded-full w-8 h-8 mr-3">
            <FaArrowRight className="text-white text-sm" />
          </div>
          <div className="text-white text-[11px]">
            Change your life with just a flick of this button.
          </div>
        </div>
      </div>
      <div className="mt-16 md:mt-32 flex justify-center items-center">
        <Image
          src="/Images/LpImage7.png"
          alt="Landing Page Image 7"
          width={800}
          height={600}
          className="w-full max-w-[800px]"
        />
      </div>
      <div>
        <p className="text-2xl md:text-[50px] text-center text-[#CACACA] ZenAntiqueFont font-semibold mt-8 md:mt-16">
          Secure.
        </p>
        <p className="text-xs md:text-[14px] text-center text-[#CACACA] font-light mt-2">
          Enhanced Protection Against Major Vulnerabilities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 md:mt-20">
        <div className="flex flex-col gap-12 md:gap-20 justify-center items-center md:items-start">
          <div className="mt-5 px-4 sm:px-10 text-center md:text-left">
            <p className="text-2xl md:text-3xl text-[#CACACA] ZenAntiqueFont font-semibold">
              Intuitive
            </p>
            <p className="text-3xl md:text-4xl text-[#CACACA] ZenAntiqueFont font-regular">
              User Interface
            </p>
            <p className="text-xs md:text-[13px] text-[#CACACA] mt-6 md:mt-10">
              EveryX is designed with user-friendly navigation, making it easy
              for users to create predictions and manage trades.
            </p>
            <p className="text-xs md:text-[13px] text-[#CACACA] mt-2">
              Whether you&apos;re a beginner or an experienced trader, the
              platform ensures a seamless experience.
            </p>
          </div>
          <div className="mt-5 px-4 sm:px-10 flex justify-center items-center flex-col">
            <div className="flex justify-center items-center gap-2">
              <CiCircleInfo className="text-lg" />
              <span className="text-xs md:text-[13px] font-extralight">
                UIUX Friendly
              </span>
            </div>
            <button className="bg-[#D5D5D5] text-black text-xs md:text-[12px] px-5 py-2 rounded-full mt-5 font-medium">
              Get started
            </button>
          </div>
        </div>
        <div className="mt-1 flex justify-center md:justify-start">
          <Image
            src="/Images/LpImage8.png"
            alt="Landing Page Image 8"
            width={300}
            height={300}
          />
        </div>
      </div>

      <div className="mt-16 md:mt-20 flex flex-col items-center">
        <div className="mt-5 px-4 sm:px-10 text-center md:text-left">
          <p className="text-3xl md:text-[60px] text-[#CCCCCC] ZenAntiqueFont ">
            More fun things
          </p>
          <p className="text-3xl md:text-[60px] text-[#CCCCCC] ZenAntiqueFont mt-6">
            will be &quot;Coming Soon &quot;
          </p>
          <p className="text-sm md:text-[15px] text-gray-500 mt-5">
            Desktop, leaderboards, achievement bonuses, And more.
          </p>
        </div>
        <div className="mt-10">
          <Image
            src="/Images/LpImage9.png"
            alt="Landing Page Image 9"
            width={500}
            height={500}
            className="w-full max-w-[500px]"
          />
        </div>
      </div>
      <div className="my-12 px-4 sm:px-10">
        <p className="text-3xl md:text-[41px] text-center Zenfont">Q&A</p>
      </div>
      <div>
        {questions.map((item, index) => (
          <div key={index} className="my-5 border-b border-gray-800">
            <div
              className={`flex justify-between items-center px-4 sm:px-10 cursor-pointer ${
                openQuestions[index] ? "bg-[#707070]" : "bg-transparent"
              } bg-opacity-[10%]`}
              onClick={() => toggleOpen(index)}
            >
              <p className="text-xs md:text-[13px] w-full py-2">
                {item.question}
              </p>
              {openQuestions[index] ? (
                <FaChevronUp size={15} color="#000" />
              ) : (
                <FaChevronDown size={15} color="#000" />
              )}
            </div>
            {openQuestions[index] && (
              <div className="mt-3 px-4 sm:px-10">
                {item.answer.split("\n").map((para, i) => (
                  <p
                    key={i}
                    className="text-xs md:text-[13px] mb-3 opacity-[38%]"
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
