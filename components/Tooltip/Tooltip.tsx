import { usePopperTooltip } from "react-popper-tooltip";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import { Portal } from "react-portal";
import { Transition } from "@headlessui/react";

// String assertions
export function isString(value: any): value is string {
  return Object.prototype.toString.call(value) === "[object String]";
}

interface TooltipOptions {
  /**
   * The react component to use as the
   * trigger for the tooltip
   */
  children: React.ReactNode;
  /**
   * The label of the tooltip
   */
  label?: React.ReactNode;
  /**
   * The accessible, human friendly label to use for
   * screen readers.
   *
   * If passed, tooltip will show the content `label`
   * but expose only `aria-label` to assistive technologies
   */
  "aria-label"?: string;
}

export type ToolTipProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  TooltipOptions;

export const Tooltip: React.FC<ToolTipProps> = ({
  label,
  "aria-label": ariaLabel,
  children,
}) => {
  const shouldWrap = isString(children);

  const { visible, setTooltipRef, setTriggerRef, getTooltipProps } =
    usePopperTooltip({
      delayShow: 700,
      placement: "bottom",
      trigger: ["hover", "focus"],
    });

  let trigger: React.ReactElement;
  if (shouldWrap) {
    trigger = (
      <span tabIndex={0} ref={setTriggerRef}>
        {children}
      </span>
    );
  } else {
    /**
     * Ensure tooltip has only one child node
     */
    const child = React.Children.only(children) as React.ReactElement & {
      ref?: React.Ref<any>;
    };

    trigger = React.cloneElement(child, {
      ...child.props,
      ref: setTriggerRef,
    });
  }

  /**
   * If the `label` is empty, there's no
   * point showing the tooltip. Let's simply return back the children
   */
  if (!label) {
    return <>{children}</>;
  }

  return (
    <>
      {trigger}
      {visible && (
        <Portal>
          <div
            ref={setTooltipRef}
            {...getTooltipProps({
              className:
                "bg-paper py-1 px-2 rounded-sm text-xs text-text-primary z-50 opacity-90",
            })}
            id="tooltip"
            role="tooltip"
          >
            {label}
          </div>
        </Portal>
      )}
    </>
  );
};

export default Tooltip;
