"use client";

import { FC } from "react";
import Label from "./Label";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hasError?: boolean;
  isRequired?: boolean;
}

const Input: FC<InputProps> = ({
  label,
  className: classes = "",
  hasError = false,
  isRequired = true,
  id,
  ...props
}) => {
  const name = props.name || "";
  const Id = id || name.charAt(0).toUpperCase() + name.substring(1);

  return (
    <div
      data-has-error={`${hasError}`}
      className="input-field w-full  flex flex-col  "
    >
      {!!label && (
        <Label htmlFor={Id} hasError={hasError} required={isRequired}>
          {label}
        </Label>
      )}

      <div className="relative">
        <input
          id={Id}
          className={`p-2.5 bg-white text-sm h-[41px] w-full text-black rounded-sm  border ${
            hasError ? "border-[#d00]" : "border-[#949494]"
          } ${classes}`}
          {...props}
        />

        {hasError && (
          <svg
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            xmlSpace="preserve"
            aria-hidden="true"
            focusable="false"
            className="absolute right-[5px] h-5 w-auto top-1/2 fill-[#d00] -translate-y-1/2"
          >
            <path d="M507.333 424.604l-.01-.01C473.238 354.677 416.1 255.51 365.692 168.021c-26.376-45.792-51.294-89.031-69.305-121.896-8.5-15.521-23.605-24.792-40.398-24.792s-31.897 9.271-40.397 24.792c-18.022 32.885-42.95 76.167-69.357 121.99C95.858 255.583 38.741 354.708 4.667 424.604 1.573 430.969 0 437.708 0 444.615c0 25.396 20.511 46.052 45.731 46.052L256 490.646l210.269.021c25.22 0 45.731-20.656 45.731-46.052 0-6.907-1.573-13.646-4.667-20.011zM256 448.01c-11.76 0-21.333-9.573-21.333-21.333 0-11.76 9.573-21.333 21.333-21.333s21.333 9.573 21.333 21.333c0 11.76-9.573 21.333-21.333 21.333zm21.333-74.666a10.66 10.66 0 01-10.667 10.667h-21.333a10.66 10.66 0 01-10.667-10.667V138.677a10.66 10.66 0 0110.667-10.667h21.333a10.66 10.66 0 0110.667 10.667v234.667z"></path>
          </svg>
        )}
      </div>
    </div>
  );
};

export default Input;
