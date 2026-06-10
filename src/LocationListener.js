import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function LocationListener() {
    const location = useLocation();

    useEffect(() => {
        if (window?.webengage?.track) {
            window.webengage.track("page viewed", {
                "page_url": window.location.href ?? ""
            });
        }
    }, [location]);

    return null;
}

export default LocationListener;
