import React, { useEffect } from "react";

const RedirectNow = () => {
    useEffect(()=> {
        window.location = process.env.PUBLIC_URL + "/direct-mutual-fund/funds/all";
    }, []);
}
export default RedirectNow;