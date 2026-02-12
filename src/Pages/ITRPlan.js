import React from "react";
import { useState, useEffect } from "react";
import Plan from "../components/HTML/ITRPlans/HeroSection/Plan";
import ApplyWhiteBg from "../components/ApplyWhiteBg";
import AboutPlan from "../components/HTML/ITRPlans/PlanAbout/AboutPlan";
import { getItemLocal } from "../common_utilities";
import { useNavigate } from "react-router-dom";

function ITRPlan() {
  const [planDetails, setPlanDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    onLoadInit();
    return () => {};
  }, []);

  const onLoadInit = () => {
    try {
      let plan = getItemLocal("pid");
      setPlanDetails(plan);
      if (plan == undefined || plan == '' || plan == null){
        navigate(`${process.env.PUBLIC_URL}/itr-file`);
      }
      
    } catch (e) {
      console.log(e);
      navigate(`${process.env.PUBLIC_URL}/itr-file`);
    }
  };

  return (
    <>
      <ApplyWhiteBg />
      <div>
        <Plan planDetails={planDetails} />
        <AboutPlan />
      </div>
    </>
  );
}

export default ITRPlan;
