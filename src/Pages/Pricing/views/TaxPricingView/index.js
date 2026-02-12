import { Link, useNavigate } from "react-router-dom";
import { CheckSession, getParentUserId, getPublicMediaURL, getUserId } from "../../../../common_utilities";
import style from './TaxPricingView.module.css'
import { useEffect } from "react";
import { BASE_API_URL, imagePath } from "../../../../constants";
import commonEncode from "../../../../commonEncode";
import { useSelector } from "react-redux";
import { generateLead } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
// import {
//     imagePath
// } from "../constants";

const category_name = "Assisted Advisory"

const TaxPricingView = ({ taxPricingData }) => {

    const loggedIn = useSelector(state => state.loggedIn);

    const navigate = useNavigate();

    const getCallbackFun = async () => {
        if (!loggedIn) {
            navigate(`${process.env.PUBLIC_URL}/login`)
            return;// checksession();
        }
        let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser")));
        let memberUsers = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));

        const currentUserData = users.filter(data => data.id == getUserId())[0]

        const memberUsersData = memberUsers.filter(data => data.id == getUserId())[0]

        let payload = {
              "services": ["income_tax_notices"],
              "user_id": getParentUserId(),
              "source": "Website Callback",
              "tag": "itr_notice",
              "email": currentUserData.email,
              "full_name": memberUsersData.name,
              "mobile": currentUserData.mobile,
              "rm_id": "", // add 24 static
              "slab": ""
        
            }

        // const payload = {
        //     "fullname": memberUsersData.name,
        //     "mobile": currentUserData.mobile,
        //     "mailid": currentUserData.email,
        //     "country_code": 91,
        //     "tags": "itr_notice",
        //     "status": "Entry",
        //     "service": 35, 
        //     "rm_id": 24
        // };
        try {
            let response = await generateLead(payload);
            if (response.status_code == "200") {
                navigate(`${process.env.PUBLIC_URL}/thank-you-page`)
                return;
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };



    const expertDetails = (plan_uuid) => {

        localStorage.setItem("plan_uuid", plan_uuid);
        navigate(`${process.env.PUBLIC_URL}/expert?service=tax-planning`);
    };


    return (
        <div className="container-fluid white-bg">
            <br /><br />
            <div>
                <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-12 w-100">
                        <div className="text-center mb-80">
                            <h2 className="upperText">
                                Looking for Tax Advisor? Our team of Tax Experts is at your service!
                            </h2>
                            <p
                                className="mt-2 BottomText"
                                style={{
                                    color: "gray",
                                }}
                            >
                                Your friends can advise you on movies, let Fintoo Tax Experts take care of your taxes
                            </p>
                        </div>
                    </div>
                </div>
                <div className={`${style.TaxPricingContainer}`}>

                    <div className={`${style.TaxPricingMainContainer}`}>
                        <div className={`${style.TaxPricingMainContainerTitle}`}>How it works</div>

                        <div className={`${style.TaxPricingStepsContainer}`} >
                            <div className={`${style.TaxPricingStepItem}`}>
                                <div className={`${style.TaxPricingStepItemImg}`}> <img style={{ width: '100%' }} src={getPublicMediaURL("static/media/DG/Images/book_expert.svg")} alt="" /> </div>
                                <div className={`${style.TaxPricingStepsText}`}>Select the Expert</div>
                            </div>
                            <div>
                                <div className={`${style.TaxPricingStepItemConnector}`}> <img src={getPublicMediaURL("static/media/DG/Images/steps_after.svg")} alt="" /> </div>
                            </div>
                            <div className={`${style.TaxPricingStepItem}`}>
                                <div className={`${style.TaxPricingStepItemImg}`}> <img style={{ width: '100%' }} src={getPublicMediaURL("static/media/DG/Images/pay-fees.svg")} alt="" /> </div>
                                <div className={`${style.TaxPricingStepsText}`}>Pay for Consultancy</div>
                            </div>
                            <div>
                                <div className={`${style.TaxPricingStepItemConnector}`}> <img style={{ width: '100%' }} src={getPublicMediaURL("static/media/DG/Images/steps_after.svg")} alt="" /> </div>
                            </div>
                            <div className={`${style.TaxPricingStepItem}`}>
                                <div className={`${style.TaxPricingStepItemImg}`}> <img style={{ width: '100%' }} src={getPublicMediaURL("static/media/DG/Images/pricing_calender.svg")} alt="" /> </div>
                                <div className={`${style.TaxPricingStepsText}`}>Book an Appointment</div>
                            </div>
                            <div>
                                <div className={`${style.TaxPricingStepItemConnector}`}> <img style={{ width: '100%' }} src={getPublicMediaURL("static/media/DG/Images/steps_after.svg")} alt="" /> </div>
                            </div>
                            <div className={`${style.TaxPricingStepItem}`}>
                                <div className={`${style.TaxPricingStepItemImg}`}> <img style={{ width: '100%' }} src={getPublicMediaURL("static/media/DG/Images/get_call.svg")} alt="" /> </div>
                                <div className={`${style.TaxPricingStepsText}`}>Upload Documents</div>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="pric-tables price-table">
                                <div className="PricingBox">
                                    {
                                        taxPricingData.map((x, idx) =>
                                            <div style={{ marginTop: "2rem" }}
                                                key={idx}
                                                className={`item sm-mb50 item-active`}
                                            >
                                                <div className="type Price-type text-center mb-15">
                                                    <div style={{ fontWeight: "bold", color: "#fff" }}>
                                                        {x.plan_name.toUpperCase()}
                                                    </div>
                                                </div>
                                                <br />
                                                <div className="amount2 text-center mb-40">
                                                    {x.plan_uuid == "tax_plan" ? (
                                                        <h4>₹ {parseInt(x.plan_amount).toLocaleString()}</h4>
                                                    ):(<h4>{"Custom"}</h4>)}
                                                </div>

                                                {x.plan_uuid == "income_tax" ? (
                                                    <div className="text-center custombtmText text-gray p">
                                                        Get a completely customised plan according
                                                        to your unique requirement
                                                    </div>
                                                )
                                                    :
                                                    <div className="text-center custombtmText text-gray p">
                                                        Onwards
                                                    </div>

                                                }

                                                <div className="feat">
                                                    <ul>
                                                        {
                                                            x.plan_description.offered_services.map((data, idx) =>
                                                                <li className="d-flex align-items-center" key={idx}>
                                                                    <span>
                                                                        {data.is_available == 0 && (
                                                                            <img
                                                                                className="pe-2"
                                                                                style={{ width: "16px" }}
                                                                                src={
                                                                                    process.env.REACT_APP_STATIC_URL +
                                                                                    "media/Pricing/cancel.png"
                                                                                }
                                                                                alt=""
                                                                            />
                                                                        )}
                                                                        {data.is_available == 1 && (
                                                                            <img
                                                                                className="pe-2 checkPng"
                                                                                style={{ width: "16px" }}
                                                                                src={process.env.REACT_APP_STATIC_URL + "media/Pricing/check.svg"}
                                                                                alt=""
                                                                            />
                                                                        )}
                                                                    </span>
                                                                    <span
                                                                        className={`ml-2`}
                                                                    >
                                                                        {data.title}
                                                                    </span>
                                                                </li>
                                                            )
                                                        }
                                                    </ul>
                                                </div>
                                                <div className="BtnBox">
                                                    {x.plan_uuid == "income_tax" ? (
                                                        <button onClick={() => getCallbackFun()}>
                                                            {" "}
                                                            Request a Callback{" "}
                                                        </button>
                                                    )
                                                        :
                                                        <button onClick={() => expertDetails(x.plan_uuid)}>
                                                            Get Started
                                                        </button>
                                                    }
                                                </div>
                                                <br></br>
                                            </div>
                                        )
                                    }

                                </div>
                            </div>
                        </div>
                    </div>

                    <br />
                </div>


            </div>

        </div>


    );
};
export default TaxPricingView;
