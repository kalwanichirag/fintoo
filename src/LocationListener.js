import { useLocation } from "react-router-dom";

function LocationListener() {
    const location = useLocation();

    webengage.track("page viewed", {
        "page_url": window.location.href ?? ''
    });

    return null;
}

export default LocationListener;