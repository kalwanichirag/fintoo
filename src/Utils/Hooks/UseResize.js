import { useLayoutEffect, useRef } from 'react';

export default function UseResize(callback) {
    // const [size, setSize] = useState < Size > ({
    //     width: 0,
    //     height: 0
    // })

    const ref = useRef(null)

    useLayoutEffect(() => {
        const element = ref?.current;

        if (!element) {
            return;
        }

        const observer = new ResizeObserver((entries) => {
            callback(element, entries[0]);
        });

        observer.observe(element);
        return () => {
            observer.disconnect();
        };
    }, [callback, ref]);

    return ref
}