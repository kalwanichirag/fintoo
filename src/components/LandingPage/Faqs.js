import React, { Fragment } from "react";
import Faq from "react-faq-component";
import data from "./data";

export default function Faqs() {
  return (
    <Fragment >
      <Faq 
        data={data}
        styles={{
          bgColor: "white",
          titleTextColor: "#48482a",
          rowTitleColor: "#78789a",
          rowTitleTextSize: "large",
          rowContentColor: "#48484a",
          rowContentTextSize: "16px",
          rowContentPaddingTop: "10px",
          rowContentPaddingBottom: "10px",
          rowContentPaddingLeft: "0px",
          rowContentPaddingRight: "150px",
          arrowColor: "black"
        }}
        config={{
          animate: true
        }}
      />
    </Fragment>
  );
}
