"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface DragSliderProps {
  text: string;
  redirectTo?: string;
  width?: string;
  className?: string;
}

export default function DragSlider({
  text,
  redirectTo = "/trade",
  width = "100%",
  className = "",
}: DragSliderProps) {
  const [isDragged, setIsDragged] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  // console.log(isDragged);

  // Motion values for interactive animations
  const x = useMotionValue(0);
  const dragProgress = useTransform(x, [0, 180], [0, 1]);

  // Dynamic styling based on drag progress - using original color scheme
  const progressBackground = useTransform(
    dragProgress,
    [0, 0.8, 1],
    [
      "rgba(255, 255, 255, 0)",
      "rgba(255, 255, 255, 0.05)",
      "rgba(255, 255, 255, 0.07)",
    ]
  );

  const buttonBackground = useTransform(
    dragProgress,
    [0, 1],
    ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.2)"]
  );

  const textOpacity = useTransform(dragProgress, [0, 0.5], [1, 0]);
  // const successTextOpacity = useTransform(dragProgress, [0.8, 1], [0, 1]);

  // Calculate the width of the progress background based on button position
  // This ensures it stays close to the button
  const progressWidth = useTransform(x, (value) => {
    return value + 60; // Button width (40px) + small offset (20px)
  });

  const handleDragEnd = (
    event: MouseEvent | TouchEvent,
    info: { offset: { x: number; y: number } }
  ) => {
    if (!sliderRef.current) return;

    const sliderWidth = sliderRef.current.offsetWidth;
    const offset = info.offset.x;
    const completeThreshold = sliderWidth * 0.75; // Reduced threshold for better UX

    if (offset >= completeThreshold) {
      // Success animation
      animate(x, sliderWidth - 50, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          setTimeout(() => {
            router.push(redirectTo);
          }, 300); // Small delay for better visual feedback
        },
      });
    } else {
      // Reset animation
      setIsDragged(false);
      animate(x, 0, {
        type: "spring",
        stiffness: 500,
        damping: 30,
      });
    }
  };

  return (
    <motion.div
      ref={sliderRef}
      className={`relative h-14 border border-gray-500 rounded-full border-opacity-25 overflow-hidden ${className}`}
      style={{ width }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress background that follows the button closely */}
      <motion.div
        className="absolute inset-y-0 left-0 h-full rounded-full pointer-events-none"
        style={{
          backgroundColor: progressBackground,
          width: progressWidth,
          zIndex: 1,
        }}
      />

      {/* Container for button and text */}
      <div className="relative h-full flex items-center px-[5px] py-[2px]">
        {/* Draggable Button */}
        <motion.div
          className="relative z-10 flex items-center justify-center rounded-full w-10 h-10 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 1000 }}
          dragElastic={0.1}
          style={{ x, backgroundColor: buttonBackground }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onDragStart={() => setIsDragged(true)}
          onDragEnd={handleDragEnd}
        >
          <ArrowRight className="text-white w-5 h-5" />
        </motion.div>

        {/* Instruction Text */}
        <motion.div
          className="ml-4 text-white text-[13px] text-opacity-75 font-thin relative z-10"
          style={{ opacity: textOpacity }}
        >
          {text}
        </motion.div>
      </div>
    </motion.div>
  );
}
