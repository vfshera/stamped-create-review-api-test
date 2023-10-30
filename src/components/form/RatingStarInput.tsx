"use client";

import { FC, useState } from "react";

interface RatingProps {
  svgClass?: string;
  classes?: string;
  onChange: (value: number) => void;
  value?: number;
}

const RatingStarInput: FC<RatingProps> = ({
  svgClass = "",
  classes = "",
  value = 0,
  onChange,
  ...props
}) => {
  const [hoverIndex, setHoverIndex] = useState(0);
  const [rating, setRating] = useState(value);

  function applyRating(rate: number) {
    setRating(rate);
    onChange(rate);
  }
  return (
    <div
      className={`star-rating-input group/rating-input flex items-center relative w-max gap-4 ${classes} `}
    >
      {[...Array(5)].map((star, index) => {
        return (
          <svg
            key={index}
            onClick={() => applyRating(index + 1)}
            className={`w-10 h-auto   transition-all duration-200 ${
              rating >= index + 1
                ? "fill-yellow-500"
                : "fill-white stroke-brand-green stroke-[5]"
            }
          
            ${
              hoverIndex >= index + 1
                ? "group-hover/rating-input:fill-yellow-500"
                : "group-hover/rating-input:fill-white stroke-yellow-500 stroke-[5]"
            }
            ${svgClass} `}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-1 -79 106 99"
            onMouseOver={() => setHoverIndex(index + 1)}
          >
            <path d="M86.8259 18.8437L86.8259 18.8437Q88.4732 18.8437 89.7187 17.7991L89.7187 17.7991Q91.9286 16.0313 91.3259 13.2187L91.3259 13.2187L84.4955-17.1563L103.5000-39.8973Q105.1875-42.0268 104.2634-44.5982L104.2634-44.5982Q103.2187-47.0893 100.5268-47.4911L100.5268-47.4911L71.7991-51.2679L55.7679-76.0580Q55.0848-77.1027 53.9799-77.7054Q52.8750-78.3080 51.7098-78.1473L51.7098-78.1473Q49.0982-78.0670 47.8125-75.7768L47.8125-75.7768L33.9509-50.4241L4.0580-46.7277Q2.8125-46.5268 1.8080-45.7634Q0.8036-45.0000 0.3214-43.8348L0.3214-43.8348Q-0.7232-41.2634 1.0848-39.2143L1.0848-39.2143L19.4062-16.6339L14.9062 13.1384Q14.7054 14.3839 15.1674 15.5491Q15.6295 16.7143 16.6339 17.4777L16.6339 17.4777Q17.6384 18.2812 18.8839 18.4420Q20.1295 18.6027 21.2545 18.0804L21.2545 18.0804L53.3973 4.4598L84.9375 18.4420Q85.7812 18.8437 86.8259 18.8437Z" />
          </svg>
        );
      })}
    </div>
  );
};

export default RatingStarInput;
