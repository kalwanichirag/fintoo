// Scroll to top on every page load
// - Nil

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const FintooScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const canControlScrollRestoration = "scrollRestoration" in window.history;
    if (canControlScrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
    // find hash id on page
    if(hash) {
      if(document.getElementById(hash.replace("#", "")) != null) {
        var offsetPosition = document.getElementById(hash.replace("#", "")).offsetTop;
        // document.getElementById(hash.replace("#", "")).scrollIntoView();
        window.scrollTo({
          top: offsetPosition + 80,
          behavior: "smooth"
        });   
      }
    } else {
        window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return <></>;
};
export default FintooScrollToTop;
