"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { CiCircleInfo } from "react-icons/ci";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import LoadingPage from "@/components/LoadingPage";
// import { useRouter } from "next/navigation";

const LandingPage = () => {
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
  const [isLoading, setIsLoading] = useState(true);
  // const router = useRouter();
  // State to manage open/close for each question
  const [openQuestions, setOpenQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleOpen = (index: number) => {
    setOpenQuestions((prev) =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Navbar home="" />
      <div className="bg-[#0E0E0E] w-full min-h-screen py-10">
        <div className="px-10">
          <p className="text-right text-[13px] text-white text-opacity-[76%]">
            Where every event is an
          </p>
          <p className="text-right text-[13px] text-white text-opacity-[76%]">
            opportunity
          </p>
        </div>
        {/* Use the layout property for image resizing */}
        <div className="mt-16 relative -mx-1 h-[300px]">
          <Image
            src="/Images/LpImage1.png"
            alt="Landing Page Image 1"
            layout="fill"
            objectFit="cover" // Ensures the image covers the container
            className="rounded-lg"
          />
        </div>
        <div className="px-10 ">
          <p className=" text-[33px] text-white text-opacity-[78%] text-left ZenAntiqueFont font-bold ">
            Trade
          </p>
          <p className=" text-[33px] text-white text-opacity-[78%] text-left ZenAntiqueFont font-bold">
            on the Outcome of
          </p>
          <p className=" text-[33px] text-white text-opacity-[78%] text-left ZenAntiqueFont font-bold">
            Global Events
          </p>
          <p className=" text-[13px] text-white text-opacity-[78%] text-left font-medium mt-5">
            Use leverage to bet on real-world events and shape your portfolio in
            a new way.
          </p>
        </div>
        <div className="mt-10 px-10">
          <div className="relative w-full h-10 border-[1px] border-white rounded-full border-opacity-[25%]  flex items-center justify-start py-[2px]  px-[4px]">
            {/* Right Arrow Icon */}
            <div className="blur-[30%] relative flex items-center justify-center bg-[#161616] rounded-full w-8 h-8 mr-3">
              <FaArrowRight className="text-white text-sm" />
            </div>
            {/* Text */}
            <div className="text-white text-sm">The journey begins.</div>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <div className="w-1 h-[50px] border-l-2 border-dashed border-[#8B8B8B]"></div>
        </div>
        <div className="px-10 mt-2 justify-center flex items-center">
          <Image
            src="/Images/LpImage2.png"
            alt="Landing Page Image 2"
            width={200}
            height={200}
          />
        </div>
        <div>
          <p className="text-[21px] text-[#CACACA] text-center font-light">
            Predict real-world outcomes and
          </p>
          <p className="text-[21px] text-[#CACACA] text-center font-light">
            profit when you’re right.
          </p>
        </div>
        <div className="pt-10 px-10 flex  justify-center items-center gap-2">
          <span
            className={`text-[14px] bg-[#B5B5B5] ${
              category == "Sports"
                ? "text-black"
                : "text-[#B5B5B5] bg-opacity-[13%]"
            } px-3 py-1 rounded-full `}
            onClick={() => setCategory("Sports")}
          >
            Sports
          </span>
          <span
            className={`text-[14px] bg-[#B5B5B5] ${
              category == "Crypto"
                ? "text-black"
                : "text-[#B5B5B5] bg-opacity-[13%]"
            } px-3 py-1 rounded-full `}
            onClick={() => setCategory("Crypto")}
          >
            Crypto
          </span>
          <span
            className={`text-[14px] bg-[#B5B5B5] ${
              category == "Politics"
                ? "text-black"
                : "text-[#B5B5B5] bg-opacity-[13%]"
            } px-3 py-1 rounded-full `}
            onClick={() => setCategory("Politics")}
          >
            Politics
          </span>
          <span
            className={`text-[14px] bg-[#B5B5B5] ${
              category == "Weather"
                ? "text-black"
                : "text-[#B5B5B5] bg-opacity-[13%]"
            } px-3 py-1 rounded-full `}
            onClick={() => setCategory("Weather")}
          >
            Weather
          </span>
        </div>
        <div className=" pt-2 px-10 flex  justify-center items-center gap-2">
          <span
            className={`text-[14px] bg-[#B5B5B5] ${
              category == "Science"
                ? "text-black"
                : "text-[#B5B5B5] bg-opacity-[13%]"
            } px-3 py-1 rounded-full `}
            onClick={() => setCategory("Science")}
          >
            Science
          </span>
          <span
            className={`text-[14px] bg-[#B5B5B5] ${
              category == "Culture"
                ? "text-black"
                : "text-[#B5B5B5] bg-opacity-[13%]"
            } px-3 py-1 rounded-full `}
            onClick={() => setCategory("Culture")}
          >
            Culture
          </span>
          <span
            className={`text-[14px] bg-[#B5B5B5] ${
              category == "Tech"
                ? "text-black"
                : "text-[#B5B5B5] bg-opacity-[13%]"
            } px-3 py-1 rounded-full `}
            onClick={() => setCategory("Tech")}
          >
            Tech
          </span>
        </div>
        <div className="mt-1 relative -mx-50 -my-20   h-[650px] w-full">
          <Image
            src="/Images/LpImage3.png"
            alt="Landing Page Image 3"
            layout="fill"
            objectFit="cover"
            className=""
          />
        </div>
        <div>
          <p className="text-[13px]  text-white font-semibold text-center tracking-wider ">
            Leverage on event-based trades,
          </p>
          <p className="text-[13px] text-white font-semibold text-center tracking-wider">
            simple onboarding, quick payouts,
          </p>
          <p className="text-[13px] text-white font-semibold text-center tracking-wider">
            a global selection of events
          </p>
        </div>
        <div className="flex justify-center mt-10">
          <div className="w-1 h-[50px] border-l-2 border-dashed border-[#8B8B8B]"></div>
        </div>
        <div className="mt-2">
          <p className="text-[19px] text-[#CACACA] text-center font-light ZenAntiqueFont ">
            Start trading in
          </p>
          <p className="text-6xl text-[#CACACA] text-center font-semibold leading-[0.75] Zenfont">
            minutes.
          </p>
          <div className="flex justify-center items-center gap-2 mt-5">
            <span className="text-[13px]">Your ideal setup, in</span>
            <span className="border-[1px] text-[#CEFF00] text-[13px]">
              00:05:93
            </span>
            <span className="text-[13px]">seconds</span>
          </div>
        </div>
        <div className=" relative -my-11 h-[600px] w-full">
          <Image
            src="/Images/LpImage4.png"
            alt="Landing Page Image 4"
            layout="fill"
            objectFit="cover"
            className=""
          />
        </div>
        <div className="flex  items-center mt-10 justify-center">
          <Image
            src="/Images/LpImage5.png"
            alt="Landing page Image 5"
            width={100}
            height={50}
          />
        </div>
        <div className="px-10 mt-5">
          <p className="text-[13px] text-center text-[#CACACA] font-light">
            A trading platform in your browser for free.
          </p>
        </div>
        <div className="mt-10 px-10">
          <div className="relative w-full h-10 border-[1px] border-white rounded-full border-opacity-[25%]  flex items-center justify-start py-[2px]  px-[4px]">
            {/* Right Arrow Icon */}
            <div className="blur-[30%] relative flex items-center justify-center bg-[#161616] rounded-full w-8 h-8 mr-3">
              <FaArrowRight className="text-white text-sm" />
            </div>
            {/* Text */}
            <div className="text-white text-[11px]">
              Change your life with just a flick of this button.
            </div>
          </div>
        </div>
        <div className="flex  items-center mt-10 justify-center">
          <Image
            src="/Images/LpImage6.png"
            alt="Landing page Image 6"
            width={150}
            height={50}
          />
        </div>
        <div className="mt-1 relative -mx-50 -my-16  h-[300px] w-full">
          <Image
            src="/Images/LpImage7.png"
            alt="Landing Page Image 7"
            layout="fill"
            objectFit="cover"
            className=""
          />
        </div>
        <div>
          <p className="text-[50px] text-center text-[#CACACA]  zenAntiqueFont font-semibold">
            Secure.
          </p>
          <p className="text-[14px] text-center text-[#CACACA] font-light">
            Enhanced Protection Against Major Vulnerabilities
          </p>
        </div>
        <div className="flex justify-center mt-10">
          <div className="w-1 h-[50px] border-l-2 border-dashed border-[#8B8B8B]"></div>
        </div>
        <div className="mt-5 px-10">
          <p className="text-3xl text-[#CACACA] zenAntiqueFont font-semibold">
            Intuitive
          </p>
          <p className="text-4xl text-[#CACACA] zenAntiqueFont font-regular">
            User Interface
          </p>
          <p className="text-[13px] text-[#CACACA] mt-5">
            EveryX is designed with user- friendlynavigation, making it easy for
            users to create predictions and manage trades.
          </p>
          <p className="text-[13px] text-[#CACACA] mt-5">
            Whether you&apos;re a beginner or an experienced trader, the
            platform ensures a seamless experience.
          </p>
        </div>
        <div className="relative  mt-1 -my-14 h-[600px] w-full">
          <Image
            src="/Images/LpImage8.png"
            alt="Landing Page Image 8"
            layout="fill"
            objectFit="contain"
            className=""
          />
        </div>

        <div className="mt-10 px-10 flex  justify-center items-center flex-col">
          <div className="flex justify-center items-center gap-2 ">
            <CiCircleInfo className="text-lg" />
            <span className="text-[13px] font-extralight">UIUX Friendly</span>
          </div>
          <button className="bg-[#D5D5D5] text-black text-[12px] px-5 py-2 rounded-full mt-5 font-medium">
            Get started
          </button>
        </div>
        <div className="flex justify-center mt-10">
          <div className="w-1 h-[50px] border-l-2 border-dashed border-[#8B8B8B]"></div>
        </div>
        <div className="mt-5 px-10">
          <p className="text-[29px] text-[#CCCCCC] ZenAntiqueFont">
            More fun things
          </p>
          <p className="text-[29px] text-[#CCCCCC] ZenAntiqueFont">
            will be &quot;Coming Soon &quot;
          </p>
          <p className="text-[13px] text-[#CCCCCC] mt-5">
            Desktop, leaderboards,
          </p>
          <p className="text-[13px] text-[#CCCCCC]">
            achievement bonuses,And more.
          </p>
        </div>
        <div className=" relative -1 -mb-10 h-[420px] w-full">
          <Image
            src="/Images/LpImage9.png"
            alt="Landing Page Image 9"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex justify-center mt-5">
          <div className="w-1 h-[50px] border-l-2 border-dashed border-[#8B8B8B]"></div>
        </div>

        <div className="my-12 px-10">
          <p className="text-[41px] text-center zenfont">Q&A</p>
        </div>
        <div className="">
          {/* Map through the questions and render each */}
          {questions.map((item, index) => (
            <div
              key={index}
              className="my-5 border-b border-gray-800" // Add bottom border
            >
              <div
                className={`flex justify-between items-center px-10 cursor-pointer ${
                  openQuestions[index] ? "bg-[#707070]" : "bg-transparent"
                } bg-opacity-[10%]`}
                onClick={() => toggleOpen(index)} // Toggle state when clicking anywhere in the row
              >
                <p className="text-[13px] w-full py-2">{item.question}</p>
                {openQuestions[index] ? (
                  <FaChevronUp size={15} color="#000" />
                ) : (
                  <FaChevronDown size={15} color="#000" />
                )}
              </div>

              {openQuestions[index] && (
                <div className="mt-3 px-10">
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
        <div>
          <p className="text-center text-[12px] font-extralight">
            view more &gt;{" "}
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
