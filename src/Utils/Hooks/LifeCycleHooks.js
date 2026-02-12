import { useEffect, useRef } from "react";

export const useEffectAfterInitialRender = (
    function_,
    deps
) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) function_();
        else didMount.current = true;
    }, deps);
};