"use client";

import { FC } from "react";

interface DotsProps extends React.HTMLAttributes<HTMLSpanElement> {
  count?: number;
  delayMs?: number;
  duration?: number;
}

const Dots: FC<DotsProps> = ({
  count = 3,
  duration = 500,
  delayMs = 200,
  className = "bg-current",
}) => {
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={`h-2 w-2 rounded-full inline-block opacity-0 animate-pulse ${className}`}
          style={{
            animationDuration: `${duration * count}ms`,
            animationDelay: `${delayMs * index}ms`,
          }}
        ></span>
      ))}
    </span>
  );
};

export default Dots;
