import { useEffect, useRef } from "react";

export const useScrollPercentageTrigger = (callback) => {
  const triggeredForward = useRef(new Set());
  const triggeredBackward = useRef(new Set());
  const lastScrollY = useRef(window.scrollY);
  const lastDirection = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const percentFromTop = Math.round((scrollTop / maxScroll) * 100);
      const percentFromBottom = 100 - percentFromTop;

      const direction = scrollTop > lastScrollY.current ? 'forward' : 'backward';

      if (direction !== lastDirection.current) {
        if (direction === 'forward') triggeredBackward.current.clear();
        else triggeredForward.current.clear();
        lastDirection.current = direction;
      }

      lastScrollY.current = scrollTop;

      const thresholds = [25, 50, 75, 100];

      thresholds.forEach((threshold) => {
        if (direction === 'forward') {
          if (
            percentFromTop >= threshold &&
            !triggeredForward.current.has(threshold)
          ) {
            triggeredForward.current.add(threshold);
            callback(threshold, 'forward');
          }
        } else {
          if (
            percentFromBottom >= threshold &&
            !triggeredBackward.current.has(threshold)
          ) {
            triggeredBackward.current.add(threshold);
            callback(threshold, 'backward');
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback]);
};

