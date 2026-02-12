import { useEffect, useState } from "react";

import HideHeader from "../../components/HideHeader";
import HideFooter from "../../components/HideFooter";
export default function AdvanceTaxCalculator() {
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch("/tax-calc/advance_tax_calculator.html")
      .then((res) => res.text())
      .then((data) => {
        setHtml(data);
      })
      .catch((err) => {
        console.error("Error loading HTML:", err);
      });
  }, []);

  return (
    <>
      <HideHeader/>
      <div
      className="tax-calculator-container"
      dangerouslySetInnerHTML={{ __html: html }}
      />
      <HideFooter/>
      </>

  );
}
