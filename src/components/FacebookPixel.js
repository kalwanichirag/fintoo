import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { removeSlash } from "../common_utilities";

const FacebookPixel = () => {
  const { pathname } = useLocation();

  return (
    <>
      {(window.location.host.indexOf('fintoo.in') > -1) && (
        <img
          key={pathname}
          style={{display: 'none', height: '1px', width: '1px'}}
          src="https://www.facebook.com/tr?id=257265244657888&ev=PageView&noscript=1"
        />
      )}
      {(window.location.host.indexOf('fintoo.ae') > -1) && (
        <img
          key={pathname}
          style={{display: 'none', height: '1px', width: '1px'}}
          src="https://www.facebook.com/tr?id=3441872112791896&ev=PageView&noscript=1"
        />
      )}
    </>
  );
};
export default FacebookPixel;
