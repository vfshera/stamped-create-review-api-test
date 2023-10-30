"use client";

import { ElementType, ComponentProps } from "react";

type LabelOwnProps<E extends ElementType = ElementType> = {
  children: string;
  required?: boolean;
  hasError?: boolean;
  as?: E;
};

type LabelProps<E extends ElementType> = LabelOwnProps<E> &
  Omit<ComponentProps<E>, keyof LabelOwnProps>;

const __DEFAULT_ELEMENT__ = "label";

function Label<E extends ElementType = typeof __DEFAULT_ELEMENT__>({
  children,
  required = true,
  as,
  hasError = false,
  ...props
}: LabelProps<E>) {
  const Component = as || __DEFAULT_ELEMENT__;

  return (
    <Component {...props}>
      <span
        className={`text-sm ${hasError ? "text-[#d00]" : "text-[#303533]"}`}
      >
        {children}
      </span>
      {required && (
        <abbr className="text-[#d00]" title="required">
          *
        </abbr>
      )}
    </Component>
  );
}

export default Label;
