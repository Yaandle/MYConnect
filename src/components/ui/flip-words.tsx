"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

export const FlipWords = ({
  words,
  colors,
  duration = 2000, // Default duration is 2 seconds
  className,
}: {
  words: string[];
  colors: string[];
  duration?: number;
  className?: string;
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(false); // Set isAnimating to false before updating the index
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsAnimating(true); // Set isAnimating to true after updating the index
      }, 500); // Delay of 500ms before updating the index
    }, duration);

    return () => clearInterval(interval);
  }, [duration, words.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={words[currentWordIndex]}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 10 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "z-10 inline-block relative text-left px-2",
          className,
          colors[currentWordIndex % colors.length]
        )}
      >
        {words[currentWordIndex]}
      </motion.span>
    </AnimatePresence>
  );
};