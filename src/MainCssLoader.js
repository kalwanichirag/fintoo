import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import mainCss from './main.css';
import customCss from './custom.css';
import styleCss from './style.css';

// List of routes where you DO NOT want these CSS files
const EXCLUDED_ROUTES = [
  "/wealth-management-for-indians-and-nri",
  "/financial-planning",
  "/personal-financial-planning",
  "/investment-planning",
  "/financial-advice",
  "/retirement-planning"
];

// List of CSS files to conditionally load

const CSS_FILES = [mainCss, customCss, styleCss];
const MainCssLoader = () => {
  const location = useLocation();

  useEffect(() => {
    CSS_FILES.forEach((file, index) => {
      const id = `conditional-css-${index}`;
      let link = document.getElementById(id);

      if (!EXCLUDED_ROUTES.includes(location.pathname)) {
        if (!link) {
          link = document.createElement("link");
          link.id = id;
          link.rel = "stylesheet";
          link.href = file;
          document.head.appendChild(link);
        }
      } else {
        if (link) {
          link.remove();
        }
      }
    });
  }, [location.pathname]);

  return null;
};

export default MainCssLoader;
