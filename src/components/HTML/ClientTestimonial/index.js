import React from "react";
import { useLocation } from "react-router-dom";
import BoldSectionHeader from "../../BoldSectionHeader";
import Testimonial from "../../Testimonial";
import ClientReviews from "../ClientReviews";
import styles from "./style.module.css";
import BorderDivider from "../../BorderDivider";

const ClientTestimonial = () => {
  const location = useLocation();
  const isMutualFundSnippet = location.pathname === "/web/mutual-fund-snippet" || location.pathname === "/web/mutual-fund-snippet/";

  return (
    <section className={`${styles.investsection} py-5`}>
      <div className="text-center">
        <span className={`${styles["section-title"]}`}>
          Wall of <span className={`${styles.DiffText}`}>Trust</span>{" "}
          {isMutualFundSnippet ? (
            <span>
             - Your Wealth, Our Expertise.
            </span>
          ) : (
            "@ Fintoo"
          )}
        </span>
        <BorderDivider />
      </div>
      <div>
        <ClientReviews />
      </div>
    </section>
  );
};

export default ClientTestimonial;
