import { useState, useEffect, useRef } from 'react';

const useIntersectionObserver = (threshold = 0.5) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        // Callback for the IntersectionObserver
        const observerCallback = ([entry]) => {
            setIsVisible(entry.isIntersecting);
        };

        // Create an IntersectionObserver instance
        const observer = new IntersectionObserver(observerCallback, {
            threshold: threshold, // Trigger visibility based on the threshold
        });

        // Start observing the element if it exists
        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        // Cleanup observer when component unmounts or ref changes
        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [threshold]);

    return [elementRef, isVisible];
};

export default useIntersectionObserver;
