import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import commonEncode from "../commonEncode";
import { apiCall } from "../common_utilities";
import FintooLoader from "../components/FintooLoader";
import "react-toastify/dist/ReactToastify.css";

const PricingPopup = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  let plan_types = {
    1: "Basic",
    2: "Basic Pro",
    3: "Classic",
    4: "Classic Plus",
    5: "Premium",
    6: "Elite",
    7: "Elite Prime",
  };

  const sendCallback = async () => {
    const utm_source = 26;
    const financialdata = {
      tagval: "minty_financial_planning",
      servicename: "financial-planning",
      plan_name: "Financial Plan",
      exp_tag: "fin_web_FP_exp",
      utm_source: utm_source,
    };

    const { email, mobile, user_details: { name }, fp_plan_sub_cat } = props.sessionData;
    const { plan_sub_cat, plan_id } = props.reqplandict;

    const old_plan = plan_types[fp_plan_sub_cat] ? ` from ${plan_types[fp_plan_sub_cat]}` : "";
    const new_plan = plan_types[plan_sub_cat] || "";
    const comment = `change plan request${old_plan} to ${new_plan}`;

    const callbackdata = {
      fullname: name,
      mobile,
      email,
      tagval: "minty_financial_planning",
      servicename: financialdata.servicename,
      plan_name: "Financial Plan",
      tags: "fin_plan_switch_req",
      utm_source: financialdata.utm_source,
      skip_mail: "1",
      service: 98,
      comment,
      ...(plan_id === 31 && { rm_id: localStorage.getItem("rm_id") }),
    };

    try {
      setIsLoading(true);
      const url = '';
      const response_data = await apiCall(url, callbackdata, false, false);
      if (response_data.error_code === "0") {
        toast.success("Callback request sent successfully", {
          position: "bottom-left",
          autoClose: 2000,
        });
      } else {
        throw new Error("API error");
      }
    } catch {
      toast.error("Something went wrong", {
        position: "bottom-left",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
      props.onClose();
    }
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10001,
  };

  const modalDialogStyle = {
    width: "100%",
    maxWidth: "500px",
    margin: "1rem",
  };

  const modalContentStyle = {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
  };

  const modalBodyStyle = {
    padding: "2rem",
  };

  const textStyle = {
    marginBottom: "1.5rem",
    fontSize: "1rem",
    color: "#333",
    lineHeight: "1.5",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  };

  const primaryButtonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "1px solid #007bff",
    padding: "0.75rem 2rem",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.6 : 1,
    transition: "all 0.2s ease",
  };

  const secondaryButtonStyle = {
    backgroundColor: "transparent",
    color: "#6c757d",
    border: "1px solid #6c757d",
    padding: "0.75rem 2rem",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.6 : 1,
    transition: "all 0.2s ease",
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalDialogStyle}>
        <div style={modalContentStyle}>
          <div style={modalBodyStyle}>
            <ToastContainer />
            <FintooLoader isLoading={isLoading} />
            <p style={textStyle}>
              You have already purchased a plan with us. If you wish to change your
              plan, click on Continue and we will get back to you.
            </p>
            <div style={buttonContainerStyle}>
              <button
                style={primaryButtonStyle}
                onClick={sendCallback}
                disabled={isLoading}
                onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = "#0056b3")}
                onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = "#007bff")}
              >
                Continue
              </button>
              <button
                style={secondaryButtonStyle}
                onClick={props.onClose}
                disabled={isLoading}
                onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = "#f8f9fa")}
                onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = "transparent")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPopup;