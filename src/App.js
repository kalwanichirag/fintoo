import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";

const MARKETING_ROUTES = [

  "/financial-planning",
  "/financial-strategy",

  "/personal-financial-planning",
  "/personal-financial-strategy",

  "/wealth-management-for-indians-and-nri",
  "/wealth-management-strategy-for-indians-and-nri",

  "/investment-planning",
  "/investment-advice",
  "/investment-strategy",

  "/financial-advice",
  "/financial-planning-strategy",

  "/retirement-planning",
  "/retirement-strategy",
];


export default function App() {
  const [Shell, setShell] = useState(null);
  const path = window.location.pathname;

  const isMarketingRoute = MARKETING_ROUTES.some(
    p => path === p || path.startsWith(p + "/")
  );

  useEffect(() => {
    if (isMarketingRoute) {
      import("./MarketingApp").then(m => setShell(() => m.default));
    } else {
      import("./AppShell").then(m => setShell(() => m.default));
    }
  }, [isMarketingRoute]);

  if (!Shell) return null;

  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
