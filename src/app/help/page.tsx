"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Help: React.FC = () => {
  // Dataset containing only the questions and answers (no 'open' state here)
  const questions = [
    {
      question: "What are prediction markets and event trading?",
      answer:
        "A prediction market is a platform where participants can trade based on the outcomes of future events, such as elections, sports, or economic indicators. The market prices reflect the collective probability of an event occurring, aggregating diverse information and insights from participants. It is useful for its ability to provide real-time, accurate forecasts based on crowd wisdom and incentivized decision-making.\n\nEvent trading involves making an investment based on the anticipated outcome of various events, such as a horse race, an election, economic reports, or even weather conditions. Participants can leverage any available assets—such as specialized knowledge, breaking news, or personal experience—to form an informed opinion and trade accordingly.\n\nEvents are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
    {
      question: "Why Event Trading?",
      answer:
        "Event trading involves making an investment based on the anticipated outcome of various events, such as a horse race, an election, economic reports, or even weather conditions. Participants can leverage any available assets—such as specialized knowledge, breaking news, or personal experience—to form an informed opinion and trade accordingly.",
    },
    {
      question: "What types of events are there?",
      answer:
        "Events are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
    {
      question: "What is necessary to have a good event?",
      answer:
        "Events are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
    {
      question: "Can I suggest an event?",
      answer:
        "Events are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
    {
      question: "Market Mechanics",
      answer:
        "Events are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
    {
      question: "Leverage",
      answer:
        "Events are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
    {
      question: "Stops",
      answer:
        "Events are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
    {
      question: "Event Trading",
      answer:
        "Events are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
    {
      question: "Deposit",
      answer:
        "Events are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
    {
      question: "Withdrawal",
      answer:
        "Events are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
    {
      question: "General",
      answer:
        "Events are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
    {
      question: "Account",
      answer:
        "Events are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
    {
      question: "How To Guides",
      answer:
        "Events are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
    {
      question: "Important Terms",
      answer:
        "Events are typically quoted in terms of probability. A 100% probability indicates that the event is certain to occur, while 0% signifies it will not happen. Most events offer several outcomes to choose from, and the sum of the probabilities for all outcomes will always equal 100%.",
    },
  ];

  // State to manage open/close for each question
  const [openQuestions, setOpenQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );

  const toggleOpen = (index: number) => {
    setOpenQuestions((prev) =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  return (
    <>
      <Navbar home="Help" />
      <div className="bg-[#0E0E0E] w-full min-h-screen text-white px-5 pt-4">
        <h1 className="font-medium text-[29px] text-center">Q & A</h1>
        <div className="mt-5 font-normal mb-10">
          <p className="text-[14px]">Event Trading</p>

          {/* Map through the questions and render each */}
          {questions.map((item, index) => (
            <div key={index} className="my-5">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleOpen(index)} // Now clicking anywhere toggles the answer
              >
                <p className="text-[13px]">{item.question}</p>
                {openQuestions[index] ? (
                  <FaChevronUp size={15} color="#fff" />
                ) : (
                  <FaChevronDown size={15} color="#fff" />
                )}
              </div>

              {openQuestions[index] && (
                <div className="mt-3">
                  {item.answer.split("\n").map((para, i) => (
                    <p key={i} className="text-[13px] mb-3 opacity-[38%]">
                      {para}
                    </p> // Add spacing between paragraphs
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Help;
