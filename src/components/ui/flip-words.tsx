"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

export const FlipWords = ({
  words,
  colors,
  duration = 2000,
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
      setIsAnimating(false);
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsAnimating(true);
      }, 500);
    }, duration);

    return () => clearInterval(interval);
  }, [duration, words.length]);

  return (
    <div className="relative inline-block">
      {words.map((word, index) => (
        <span
          key={word}
          className={cn(
            "invisible inline-block",
            colors[index % colors.length]
          )}
          aria-hidden="true"
        >
          {word}
        </span>
      ))}
      <AnimatePresence mode="wait">
        <motion.span
          key={words[currentWordIndex]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 10 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "absolute top-0 left-0 text-left",
            className,
            colors[currentWordIndex % colors.length]
          )}
        >
          {words[currentWordIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};