import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import News1 from "../../Assets/Images/CommonDashboard/News1.jpg";
import NextImg from "../../Assets/Images/CommonDashboard/Next.svg";
import { BASE_API_URL, imagePath } from "../../constants";

// import News1 from "../";
const NewsBox = ({ data }) => (
  <div className="Newsbox mt-md-2 ml-auto">
    <div>
      <div className="NewsImg">
        <img src={data.img} />
      </div>
      <div className="NewsHeading">
        <div>{data.title}</div>
      </div>
      <div className="d-flex justify-content-between">
        <div className="NewsText">
          Lorem ipsum dolor sit, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt. Lorem ipsum dolor sit,
        </div>
        <div className="me-3 mt-2">
          <img className="pointer" src={imagePath + NextImg} width={20} />
        </div>
      </div>
    </div>
  </div>
);

export default NewsBox;