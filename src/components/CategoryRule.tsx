import { useState } from "react";

export default function CategoryRule() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-5 md:pl-0 mt-10">
      <h1 className="text-[18px] inter mb-8 md:text-[1.5vw] ">Rules</h1>
      <p
        className={`text-[15px] font-light text-[#adadad] md:text-[0.77vw] ${
          expanded ? "" : "line-clamp-6 overflow-hidden md:line-clamp-none"
        }`}
      >
        This market will resolve to &quot;Yes&quot; if both of the following two
        conditions are met: <br />
        <br />
        1) Donald J. Trump wins the 2024 US Presidential election. <br />
        <br />
        2) An armistice, ceasefire, or negotiated settlement is announced by boh
        Ukraine and Russia regarding the ongoing war in Ukraine at any point
        between the Associated Press calling the election for Donald Trump, and
        April 19, 2025, 11:59 PM ET. <br />
        <br />
        Otherwise, this market will resolve to &quot;No&quot;. <br />
        <br />
        If Trump loses the 2024 US Presidential election, this market will
        immediately resolve to &quot;No&quot;. The resolution source for Trump
        winning the presidency is the Associated Press, Fox News, and NBC. This
        portion of the market will resolve once all three sources call the race
        for the same candidate. If all three sources haven&apos;t called the
        race for the same candidate by the inauguration date (January 20, 2025)
        this market will resolve based on who is inaugurated.
      </p>
      <button
        className="text-sm border border-[#fff] w-full rounded-md mb-2 py-3 mt-6 md:hidden"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "View Less" : "View More"}
      </button>
    </div>
  );
}
