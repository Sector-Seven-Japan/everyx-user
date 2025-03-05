"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface DragSliderProps {
  text: string;
  redirectTo?: string;
  width?: string;
}

export default function DragSlider({
  text,
  redirectTo = "/trade",
  width = "100%",
}: DragSliderProps) {
  const [isDragged, setIsDragged] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Motion values for interactive animations
  const x = useMotionValue(0);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent,
    info: { offset: { x: number; y: number } }
  ) => {
    // Ensure we have a reference to the slider
    if (!sliderRef.current) return;

    // Get the total width of the slider
    const sliderWidth = sliderRef.current.offsetWidth;

    // Calculate the drag offset
    const offset = info.offset.x;

    // Threshold for considering the drag complete (90% of slider width)
    const completeThreshold = sliderWidth * 0.9;

    if (offset >= completeThreshold) {
      // Animate to full width and redirect
      animate(x, sliderWidth - 40, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          router.push(redirectTo);
        },
      });
    } else {
      // Not dragged far enough, animate back
      setIsDragged(false);
      animate(x, 0, {
        type: "spring",
        stiffness: 500,
        damping: 30,
      });
    }
  };

  const dragProgress = useTransform(x, [0, 180], [0, 1]);
  const backgroundColor = useTransform(
    dragProgress,
    [0, 0.8, 1],
    [
      "rgba(255, 255, 255, 0)",
      "rgba(255, 255, 255, 0.15)",
      "rgba(255, 255, 255, 0.3)",
    ]
  );

  return (
    <motion.div
      ref={sliderRef}
      className="relative w-full h-14 border border-gray-500 rounded-full border-opacity-25 flex items-center justify-start py-[2px] px-[5px] overflow-hidden"
      style={{ width }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress background */}
      <motion.div
        className="absolute inset-0 w-full h-full rounded-full pointer-events-none origin-left"
        style={{
          backgroundColor,
          scaleX: dragProgress,
          transformOrigin: "left",
        }}
      />

      {/* Draggable Arrow Button */}
      <motion.div
        className="relative z-10 flex items-center justify-center bg-white bg-opacity-10 rounded-full w-10 h-10 mr-3 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 1000 }}
        dragElastic={0.3}
        style={{ x }}
        whileTap={{ scale: 0.95 }}
        onDragStart={() => setIsDragged(true)}
        onDragEnd={handleDragEnd}
        animate={{
          scale: 1,
          backgroundColor: isDragged
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(255, 255, 255, 0.1)",
        }}
      >
        <FaArrowRightLong className="text-white" />
      </motion.div>

      {/* Text with Fade Out Effect */}
      <motion.div
        className="text-white text-[13px]  text-opacity-75 font-thin relative z-10"
        style={{ opacity: useTransform(dragProgress, [0, 0.5], [1, 0]) }}
      >
        {text}
      </motion.div>
    </motion.div>
  );
}
