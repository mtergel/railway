import { TimeHTMLAttributes, DetailedHTMLProps, forwardRef } from "react";
import { mergeClasses } from "../../lib/mergeClass";
import Tooltip from "../Tooltip/Tooltip";

interface TimestampOptions {
  /**
   * Date for relative time
   */
  date?: string;
  /**
   * Display variant
   */
  variant?: "short" | "long";
  /**
   * Extra classes
   */
  className?: string;
}

type Ref = HTMLTimeElement;

export type TimestampProps = DetailedHTMLProps<
  TimeHTMLAttributes<HTMLTimeElement>,
  HTMLTimeElement
> &
  TimestampOptions;

export const Timestamp = forwardRef<Ref, TimestampProps>((props, ref) => {
  const {
    date = new Date().toISOString(),
    variant = "short",
    className,
    ...rest
  } = props;

  const comp = (
    <time
      ref={ref}
      dateTime={date}
      className={mergeClasses(
        "whitespace-nowrap text-text-secondary",
        className
      )}
      {...rest}
    >
      {parseTwitterDate(date, variant)}
    </time>
  );

  if (variant === "short") {
    return <Tooltip label={parseTwitterDate(date, "long")}>{comp}</Tooltip>;
  }

  return comp;
});

const parseTwitterDate = (tdate: string, variant: "short" | "long") => {
  var system_date = new Date(Date.parse(tdate));
  var user_date = new Date();

  if (variant === "long") {
    return `${new Intl.DateTimeFormat("en-us", {
      hour: "numeric",
      minute: "numeric",
    }).format(system_date)} · ${system_date.toLocaleDateString("default", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;

    //   1:06 PM · Aug 23, 2019
  } else {
    var diff = Math.floor((user_date.valueOf() - system_date.valueOf()) / 1000);

    if (diff < 0) {
      return `${new Intl.DateTimeFormat("en-us", {
        hour: "numeric",
        minute: "numeric",
      }).format(system_date)} · ${system_date.toLocaleDateString("default", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }

    if (diff <= 1) {
      return "just now";
    }
    if (diff < 20) {
      return diff + "s";
    }
    if (diff <= 90) {
      return "1m";
    }
    if (diff <= 3540) {
      return Math.round(diff / 60) + "m";
    }
    if (diff <= 5400) {
      return "1 hour ago";
    }
    if (diff <= 86400) {
      return Math.round(diff / 3600) + "h";
    }
    return system_date.toLocaleDateString("default", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

export default Timestamp;
