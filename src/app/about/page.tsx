import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const About: React.FC = () => {
  return (
    <>
      <Navbar home="Terms" />
      <div className={`bg-[#0E0E0E] w-full min-h-screen text-white px-5 py-4`}>
        <h1 className="font-medium text-[29px] text-center">About Us </h1>
        <p className="font-normal text-[13px] opacity-[25%] mt-4 mb-10 text-justify">
          EveryX is a globally recognized leader in the field of prediction
          market platforms, revolutionizing how individuals and organizations
          engage with future outcomes. Our platform is uniquely designed to
          empower users to trade on a wide array of real-world events, from
          fina:ncial markets and political elections to sports outcomes and
          technological advancements. What sets EveryX apart is its unparalleled
          ability to allow users to utilize real money for trading, coupled with
          the innovative integration of leverage, enabling participants to
          amplify their positions and potential returns.
          <br />
          <br />
          The prediction market industry has seen significant growth in recent
          years, but EveryX stands out as a pioneer by offering a secure,
          transparent, and highly intuitive trading environment. Our platform is
          not just about making predictions; it is about fostering an ecosystem
          where data-driven decision-making meets financial opportunities. By
          providing a seamless user experience and cutting-edge tools, EveryX
          ensures that both seasoned traders and newcomers can confidently
          navigate the complexities of prediction markets.
          <br />
          <br />
          At EveryX, we prioritize the needs of our users by implementing
          rigorous security measures, advanced analytics, and real-time updates.
          This commitment to excellence ensures that every trade is backed by
          trust and precision, making us the go-to platform for individuals and
          institutions seeking to engage in prediction trading with confidence.
          Our dedication to compliance with global financial regulations further
          underscores our leadership in this space, as we aim to set the
          standard for integrity and professionalism in the industry.
          <br />
          <br />
          Furthermore, our leverage functionality is a game-changer, providing
          users with the ability to maximize their potential profits while
          maintaining control over their risk exposure. This feature is
          meticulously designed to cater to the diverse needs of our global user
          base, enabling them to tailor their trading strategies to their unique
          goals and risk appetites. Whether it&apos;s a hedge fund exploring
          macroeconomic trends or an individual predicting the outcome of a
          major sporting event, EveryX provides the tools and support necessary
          to succeed.
          <br />
          <br />
          As we look to the future, EveryX remains committed to innovation,
          constantly evolving to meet the ever-changing demands of the
          prediction market landscape. Our team of experts is dedicated to
          developing new features, expanding our range of tradable events, and
          enhancing the overall user experience. By staying at the forefront of
          technology and market trends, EveryX continues to solidify its
          position as the world&apos;s leading prediction market platform.
          <br />
          <br />
          Join the growing community of traders who trust EveryX to provide the
          ultimate prediction market experience. With real money trading,
          leverage options, and a steadfast commitment to quality, EveryX is
          more than a platform—it&apos;s a gateway to unlocking the potential of
          informed predictions and strategic decision-making.
          <br />
          <br />
          ©2025 EveryX. All rights reserved.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default About;
