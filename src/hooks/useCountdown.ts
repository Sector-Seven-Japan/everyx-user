import { useState, useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../app/Context/AppContext";

const useCountdown = (ends_at: string) => {
  const { getCountdown } = useContext(AppContext);
  const [countdown, setCountdown] = useState(getCountdown(ends_at));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(ends_at));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [ends_at, getCountdown]);

  return countdown;
};

export default useCountdown;
