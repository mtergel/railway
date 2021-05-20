import React, { forwardRef } from "react";
import clsx from "clsx";
import { ButtonProps, Button } from "../Button/Button";

type Omitted = "leftIcon" | "isFullWidth" | "rightIcon" | "loadingText" | "ref";

interface BaseButtonProps extends Omit<ButtonProps, Omitted> {}

export interface IconButtonProps extends BaseButtonProps {
  /**
   * The icon to be used in the button.
   * @type React.ReactElement
   */
  icon?: React.ReactElement;
  /**
   * If `true`, the button will be perfectly round. Else, it'll be slightly round
   */
  isRound?: boolean;
  /**
   * A11y: A label that describes the button
   */
  "aria-label": string;
}

const sizeClassesNames = {
  sm: clsx("px-1 text-md py-1"),
  md: clsx("px-2 text-xl py-2"),
  lg: clsx("px-3 text-2xl py-3"),
};

type Ref = HTMLButtonElement;

export const IconButton = forwardRef<Ref, IconButtonProps>((props, ref) => {
  const {
    icon,
    isRound,
    size = "sm",
    "aria-label": ariaLabel,
    children,
    ...rest
  } = props;

  /**
   * Passing the icon as prop or children should work
   */
  const element = icon || children;
  const _children = React.isValidElement(element)
    ? React.cloneElement(element as any, {
        "aria-hidden": true,
        focusable: false,
      })
    : null;

  return (
    <Button
      ref={ref}
      className={clsx(
        sizeClassesNames[size],
        isRound ? "rounded-full" : "rounded-lg"
      )}
      aria-label={ariaLabel}
      data-testid="icon-button"
      {...rest}
    >
      {_children}
    </Button>
  );
});

export default IconButton;
