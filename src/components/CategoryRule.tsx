export default function CategoryRule() {
  return (
    <div className="px-5 mt-10">
      <h1 className="text-[23px] mb-8">Rule</h1>
      <p className="text-[15px] font-light text-[#9d9d9d]">
        This market will resolve to &quot;Yes&quot; if both of the following two
        conditions are met: <br /><br />
        1) Donald J. Trump wins the 2024 US Presidential
        election. <br /><br />
        2) An armistice, ceasefire, or negotiated settlement is
        announced by both Ukraine and Russia regarding the ongoing war in
        Ukraine at any point between the Associated Press calling the election
        for Donald Trump, and April 19, 2025, 11:59 PM ET. <br /><br />
        
        Otherwise, this market will resolve to &quot;No&quot;. <br /><br />
        
        If Trump loses the 2024 US Presidential election,
        this market will immediately resolve to &quot;No&quot;. The resolution source for
        Trump winning the presidency is the Associated Press, Fox News, and NBC.
        This portion of the market will resolve once all three sources call the
        race for the same candidate. If all three sources haven&apos;t called the
        race for the same candidate by the inauguration date (January 20, 2025)
        this market will resolve based on who is inaugurated.
      </p>
    </div>
  );
}