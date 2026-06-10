import React, { useEffect, useRef, useState } from "react";

export const brand = {
  blue: "#042b62",
  orange: "#dd7300",
};

export function PlannerIcon({ type, className = "tw-h-5 tw-w-5" }) {
  const shared = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    shield: (
      <svg {...shared}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    check: (
      <svg {...shared}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    users: (
      <svg {...shared}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    chat: (
      <svg {...shared}>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </svg>
    ),
    screen: (
      <svg {...shared}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    star: (
      <svg {...shared}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    spark: (
      <svg {...shared}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    money: (
      <svg {...shared}>
        <path d="M12 1v22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    home: (
      <svg {...shared}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    pulse: (
      <svg {...shared}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    clock: (
      <svg {...shared}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    calendar: (
      <svg {...shared}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
    checkCircle: (
      <svg {...shared}>
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    income: (
      <svg {...shared}>
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-8" />
        <path d="M22 20v-5" />
      </svg>
    ),
    tax: (
      <svg {...shared}>
        <path d="M12 1v22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    target: (
      <svg {...shared}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
    stack: (
      <svg {...shared}>
        <path d="M12 3 3 8l9 5 9-5-9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </svg>
    ),
    legacy: (
      <svg {...shared}>
        <path d="M7 10V7a5 5 0 0 1 10 0v3" />
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M12 14v2" />
      </svg>
    ),
    shieldCheck: (
      <svg {...shared}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9.5 12 1.8 1.8 3.7-3.7" />
      </svg>
    ),
  };

  return icons[type] || null;
}

export function PlannerLogo({ footer = false }) {
  return (
    <a href="#top" className={`tw-inline-flex tw-items-center tw-gap-2.5 ${footer ? "tw-mb-3" : ""}`}>
      <span className="tw-flex tw-h-[38px] tw-w-[38px] tw-items-center tw-justify-center tw-rounded-[10px] tw-bg-fintoo-blue tw-text-white">
        <svg viewBox="0 0 24 24" className={`${footer ? "tw-h-5 tw-w-5" : "tw-h-[22px] tw-w-[22px]"}`}>
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor"
            strokeWidth="1.8"
            fill="none"
          />
        </svg>
      </span>
      <span className={` tw-text-fintoo-blue ${footer ? "tw-text-xl tw-text-white" : "tw-text-2xl"}`}>
        fin<span className="tw-text-fintoo-orange">too</span>
      </span>
    </a>
  );
}

export function SectionHeader({ tag, title, subtitle, dark = false, centered = false }) {
  return (
    <div className={centered ? "tw-mx-auto tw-max-w-[560px] tw-text-center" : ""}>
      <div
        className={[
          "tw-mb-[14px] tw-inline-block tw-rounded-full tw-px-[14px] tw-py-[5px] tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[1px]",
          dark ? "tw-bg-fintoo-orange/15 tw-text-fintoo-orange" : "tw-bg-fintoo-orange/10 tw-text-fintoo-orange",
        ].join(" ")}
      >
        {tag}
      </div>
      <h2
        className={[
          "tw-mb-3 tw-text-3xl tw-leading-[1.15] md:tw-text-4xl",
          dark ? "tw-text-white" : "tw-text-fintoo-blue",
        ].join(" ")}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={[
            "tw-max-w-[560px] tw-text-base tw-leading-[1.7]",
            dark ? "tw-text-white/60" : "tw-text-slate-500",
            centered ? "tw-mx-auto" : "",
          ].join(" ")}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function useRevealOnce(options = {}) {
  const targetRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { threshold = 0.2, rootMargin = "0px 0px -10% 0px", immediate = false } = options;

  useEffect(() => {
    if (immediate) {
      setIsVisible(true);
      return undefined;
    }

    const node = targetRef.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [immediate, rootMargin, threshold]);

  return { targetRef, isVisible };
}

export function MotionReveal({
  children,
  className = "",
  delay = 0,
  y = 18,
  scale = 0.985,
  duration = 520,
  threshold = 0.2,
  immediate = false,
}) {
  const { targetRef, isVisible } = useRevealOnce({ threshold, immediate });

  return (
    <div
      ref={targetRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px) scale(1)" : `translateY(${y}px) scale(${scale})`,
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1800,
  className = "",
}) {
  const { targetRef, isVisible } = useRevealOnce({ threshold: 0.45, rootMargin: "0px 0px -5% 0px" });
  const [displayValue, setDisplayValue] = useState(0);
  const formattedValue = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(displayValue);

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    let frameId;
    let startTime;

    const step = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * eased);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(frameId);
  }, [duration, isVisible, value]);

  return (
    <span ref={targetRef} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
