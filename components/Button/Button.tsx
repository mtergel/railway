import React, {
  ButtonHTMLAttributes,
  Component,
  DetailedHTMLProps,
  forwardRef,
} from "react";
import clsx from "clsx";
import { MetroSpinner } from "react-spinners-kit";
import { mergeClasses } from "../../lib/mergeClass";

interface ButtonOptions {
  /**
   * If `true`, the button will show a spinner.
   */
  isLoading?: boolean;
  /**
   * If `true`, the button will be disabled.
   */
  isDisabled?: boolean;
  /**
   * If `true`, the button will be width 100% else auto.
   */
  isFullWidth?: boolean;
  /**
   * The label to show in the button when `isLoading` is true
   * If no text is passed, it only shows the spinner
   */
  loadingText?: string;
  /**
   * Button type
   */
  type?: "button" | "reset" | "submit";
  /**
   * The variant's of the button
   */
  variant?: "solid" | "outline" | "ghost";
  /**
   * The sizes's of the button
   */
  size?: "sm" | "md" | "lg";
  /**
   * If added, the button will show an icon before the button's label.
   * @type React.ReactElement
   */
  leftIcon?: React.ReactElement;
  /**
   * If added, the button will show an icon after the button's label.
   * @type React.ReactElement
   */
  rightIcon?: React.ReactElement;
  /**
   * Extra classes
   * @type string
   */
  className?: string;
  color?: "primary";
  as?: any;
}

type Ref = HTMLButtonElement;

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  ButtonOptions;

export const Button = forwardRef<Ref, ButtonProps>((props, ref) => {
  const {
    isDisabled,
    isLoading,
    isFullWidth,
    leftIcon,
    rightIcon,
    loadingText,
    type = "button",
    variant = "solid",
    size = "md",
    children,
    color,
    className,
    as: Component = "button",
    ...rest
  } = props;

  const sizeClassesNames = {
    sm: clsx(leftIcon || rightIcon ? "px-1" : "px-2", "text-xs py-1"),
    md: clsx(leftIcon || rightIcon ? "px-4" : "px-6", "text-md py-2"),
    lg: clsx(leftIcon || rightIcon ? "px-6" : "px-8", "text-lg py-3"),
  };

  const defaultColorStyle = clsx(
    "ring-gray-300",
    variant === "solid" && [
      "bg-gray-200",
      "dark:bg-white",
      "dark:bg-opacity-10",
      "hover:bg-gray-300",
      "dark:hover:bg-opacity-20",
      "dark:ring-gray-500",
    ],
    variant === "outline" && [
      "bg-transparent",
      "border-2",
      "border-gray-400",
      "hover:bg-gray-200",
      "dark:hover:bg-opacity-10",
      "dark:ring-gray-700",
    ],
    variant === "ghost" && [
      "bg-transparent",
      "hover:bg-gray-200",
      "dark:hover:bg-gray-700",
      "dark:ring-gray-500",
    ]
  );

  const primaryColorStyle = clsx(
    "ring-primary-500 dark:ring-primary-300",
    variant === "solid" && [
      "bg-primary-400",
      "text-white",
      "dark:bg-primary-300",
      "dark:text-default",
    ],
    variant === "outline" && [
      "bg-gray-400",
      "bg-opacity-0",
      "border-2",
      "border-primary-400 dark:border-primary-200",
      "text-primary-400 dark:text-primary-200",
      "hover:bg-opacity-10",
    ],
    // cant add bg-primary cause of
    // https://github.com/tailwindlabs/tailwindcss/issues/1692
    variant === "ghost" && [
      "bg-transparent",
      "hover:bg-gray-200",
      "dark:hover:bg-gray-700",
      "text-primary-400 dark:text-primary-200",
    ]
  );

  const getColor = (color?: "primary") => {
    switch (color) {
      case "primary": {
        return primaryColorStyle;
      }
      default:
        return defaultColorStyle;
    }
  };

  return (
    <Component
      className={mergeClasses(
        clsx(
          sizeClassesNames[size],
          "inline-flex",
          "appearance-none",
          "items-center",
          "justify-center",
          "transition-all",
          "select-none",
          "relative",
          "whitespace-nowrap",
          "align-middle",
          "rounded-lg",
          "box-border",
          "font-bold",
          "disabled:opacity-40",
          "disabled:cursor-not-allowed",
          "focus:ring-2",
          "focus:outline-none",
          "focus:ring-offset-2",
          "border",
          "border-transparent",

          isFullWidth ? "w-full" : "w-auto",
          getColor(color)
        ),
        className
      )}
      ref={ref}
      disabled={isDisabled || isLoading}
      type={type}
      data-testid="button"
      {...rest}
    >
      {leftIcon && !isLoading && (
        <ButtonIcon className="mr-2">{leftIcon}</ButtonIcon>
      )}

      {isLoading && (
        <div
          className={`flex items-center text-base ${
            loadingText ? "relative mr-2" : "absolute"
          }`}
        >
          <MetroSpinner loading={isLoading} size={22} />
        </div>
      )}

      {isLoading
        ? loadingText || <span className="opacity-0 invisible">{children}</span>
        : children}
      {rightIcon && !isLoading && (
        <ButtonIcon className="ml-2">{rightIcon}</ButtonIcon>
      )}
    </Component>
  );
});

const ButtonIcon: React.FC<{ className?: string }> = (props) => {
  const { children, className, ...rest } = props;

  const _children = React.isValidElement(children)
    ? React.cloneElement(children, {
        "aria-hidden": true,
        focusable: false,
      })
    : children;

  return (
    <span {...rest} className={className}>
      {_children}
    </span>
  );
};

export default Button;
