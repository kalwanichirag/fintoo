import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "../../MainComponents/Link";
import InvestSelectBank from "./InvestSelectBank";
import MainLayout from "../../Layout/MainLayout";
import {  DATA_BELONGS_TO } from "../../../constants";
import commonEncode from "../../../commonEncode";
import {

    apiCall,
    errorAlert,
    getDownActivityStateFromLS,
    getUserId,
    isFamilySelected

} from "../../../common_utilities";
import ApplyWhiteBg from "../../ApplyWhiteBg";
import InvestSelectBanklumpsum from "./InvestSelectBanklumpsum";
import { useNavigate } from "react-router-dom";
import { getUserBankDetails } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";

const AddFund = () => { };
const CloseFund = () => { };


export default function SelectBanklumpsum() {
    const navigate = useNavigate();

    const [bankList, getBankList] = useState([]);
    const [error, setError] = useState(false);

    useEffect(function () {
        onLoadInIt();
    }, []);

    const onLoadInIt = async () => {
        if (isFamilySelected()) {
            setTimeout(() => {
                navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/mycart");
            }, 300);
            return;
        }
        const Payload = {
            user_id: getUserId(),
            data_belongs_to : DATA_BELONGS_TO
        }
        let respData = await getUserBankDetails(Payload);

        if (respData["status_code"] == 200) {

            let data = respData["data"];

            getBankList(data);
        } else if (respData["error_code"] == "102") {
            if (respData["message"] != "") {
                errorAlert(respData["message"]);
            } else {
                errorAlert();
            }
            return;
        }
    };

    return (
        <MainLayout>
            <ApplyWhiteBg />
            <div className="Transaction">
                <Container>
                    <span></span>
                    <div>
                        <div className="col-12 col-lg-12">
                            <div className="MainPanel d-flex">
                                <div className="">
                                    <p>
                                        <span className="Rupeees">
                                            <Link to="/direct-mutual-fund/MyCart/">
                                                {" "}
                                                <img
                                                    className="BackBtn"
                                                    src={process.env.REACT_APP_STATIC_URL + "media/DMF/left-arrow.svg"}
                                                    alt=""
                                                    srcSet=""
                                                />
                                            </Link>
                                        </span>
                                    </p>
                                </div>
                                <div className="text-label align-items-center text-center  w-75 ">
                                    <h4 className="trans-head text-center">
                                        Select Bank Account
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div
                            className="col-lg-12 col-12"
                            style={{
                                display: "grid",
                                placeItems: "center",
                            }}
                        >
                            <div className="CartSelectBank mt-4 col-lg-8 col-12">
                                {error && <div>Something went wrong.!!!</div>}

                                {Boolean(Number(getDownActivityStateFromLS('maintenance')?.active) ?? 0) ? <>
                                    <div className="col-7 m-auto">
                                        <br />
                                        <p>{getDownActivityStateFromLS('maintenance')?.value}</p>
                                    </div>
                                </> : <>
                                    <div className="SelectedBank ">
                                        {bankList.map((item) => (
                                            <InvestSelectBanklumpsum banklist={item} />
                                        ))}
                                    </div>
                                </>}

                            </div>
                        </div>
                    </div>
                </Container>
                <br />
                <br />
                <br />
            </div>
        </MainLayout>
    );
}