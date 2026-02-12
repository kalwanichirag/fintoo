import React from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import ReactDatePicker from "../../../components/HTML/ReactDatePicker/ReactDatePicker";
import FintooRadio2 from "../../../components/FintooRadio2";
import Switch from "react-switch";
import moment from "moment";
import Slider from "../../../components/HTML/Slider";
import customStyles from "../../../components/CustomStyles";


function Gold(props){
    const setAssetsDetails = props.setAssetsDetails;
    const assetsDetails = props.assetsDetails;
    const familyData = props.familyData;
    const goalData = props.goalData;
    const setDate = props.setDate;

    return (
        <div>
          <form noValidate="novalidate" name="goldassetform">
            {(assetsDetails.asset_sub_category_id == 70 ||
                assetsDetails.asset_sub_category_id == 72)
                && (
                    <>
                    <div className="row">
                        <div className="col-md-5 pt-2">
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Name of Asset*"
                            className="mb-3 material"
                            >
                            <Form.Control
                                type="text"
                                className="shadow-none"
                                placeholder="First Name*"
                                value={assetsDetails.user_asset_name}
                                onChange={(e) => {
                                    setAssetsDetails({
                                    ...assetsDetails,
                                   user_asset_name: e.target.value,
                                    });
                                }}
                                />
                            </FloatingLabel>
                        </div>
                        <div className="col-md-5">
                            <div className="material">
                            <Form.Label> Who is investment For?* </Form.Label>
                            {familyData && (
                                <Select
                                classNamePrefix="sortSelect"
                                isSearchable={false}
                                styles={customStyles}
                                options={familyData}
                                onChange={(e) =>
                                    setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_for: e.value,
                                    })
                                }
                                value={familyData.filter(
                                    (v) => v.value == assetsDetails.user_asset_for
                                )}
                                />
                            )}
                            </div>
                        </div>
                        </div>

                        <div className="row py-md-2">
                            <div className="col-md-5 ">
                                <FloatingLabel
                                controlId="floatingInput"
                                label={
                                    assetsDetails.asset_sub_category_id == 70
                                      ? "No. Of Units*"
                                      : "No. Of Gms*"
                                  }
                                className="mb-3 material d-flex"
                                >
                                <Form.Control
                                    type="text"
                                    placeholder="*"
                                    className="shadow-none"
                                    value={assetsDetails.user_asset_quantity}
                                    onChange={(e) => {
                                    setAssetsDetails({
                                        ...assetsDetails,
                                        user_asset_quantity: e.target.value,
                                    });
                                    }}
                                />
                                <span className="info-hover-box">
                                    <span className="icon">
                                    <img
                                        alt="More information"
                                         src={imagePath + '/static/media/more_information.svg'}
                                    />
                                    </span>
                                    <span className="msg">
                                    We are taking the units to
                                    calculate the exact value and
                                    returns for your investments
                                    according to current market
                                    price.
                                    </span>
                                </span>
                                </FloatingLabel>
                            </div>
                        </div>

                        <div className="row py-md-2">
                        <div className="col-md-5 ">
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Purchase Price (Per gm) (₹)"
                            className="mb-3 material"
                            >
                            <Form.Control
                                type="text"
                                placeholder="*"
                                className="shadow-none"
                                value={assetsDetails.user_asset_avg_purchase_price}
                                onChange={(e) => {
                                setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_avg_purchase_price: e.target.value,
                                });
                                }}
                            />
                            </FloatingLabel>
                        </div>
                        <div className="col-md-5 ">
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Invested Amount (₹)"
                            className="mb-3 material d-flex"
                            >
                            <Form.Control
                                type="text"
                                placeholder="*"
                                className="shadow-none"
                                value={assetsDetails.user_asset_investment_amount}
                                onChange={(e) => {
                                setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_investment_amount: e.target.value,
                                });
                                }}
                            />
                            <span className="info-hover-box">
                                <span className="icon">
                                <img
                                    alt="More information"
                                     src={imagePath + '/static/media/more_information.svg'}
                                />
                                </span>
                                <span className="msg">
                                Auto Calculated by No Of Units
                                and Avg. Buy Price
                                </span>
                            </span>
                            </FloatingLabel>
                        </div>
                        </div>

                        <div className="row py-md-2">
                        <div className="col-md-5 ">
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Current Price (Per gm) (₹)"
                            className="mb-3 material"
                            >
                            <Form.Control
                                type="text"
                                placeholder="*"
                                className="shadow-none"
                                value={assetsDetails.user_asset_current_price}
                                onChange={(e) => {
                                setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_current_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                                });
                                }}
                            />
                            </FloatingLabel>
                        </div>
                            <div className="col-md-5 ">
                                <FloatingLabel
                                controlId="floatingInput"
                                label="Current Value (₹)"
                                className="mb-3 material d-flex"
                                >
                                <Form.Control
                                    type="text"
                                    placeholder="*"
                                    className="shadow-none"
                                    value={assetsDetails.user_asset_current_amount}
                                    onChange={(e) => {
                                    setAssetsDetails({
                                        ...assetsDetails,
                                        user_asset_current_amount: e.target.value,
                                    });
                                    }}
                                />
                                <span className="info-hover-box">
                                    <span className="icon">
                                    <img
                                        alt="More information"
                                         src={imagePath + '/static/media/more_information.svg'}
                                    />
                                    </span>
                                    <span className="msg">
                                    Auto Calculated by No Of Units
                                    and Current Price
                                    </span>
                                </span>
                                </FloatingLabel>
                            </div>
                        </div>

                        <div className="row py-md-2">
                            <div className="col-md-8">
                                <div className="d-md-flex">
                                <Form.Label className=" ">
                                    Consider This Asset In Automated
                                    Linkage*
                                </Form.Label>
                                <span className="info-hover-left-box ms-md-4">
                                    <span Name="icon">
                                    <img
                                        alt="More information"
                                         src={imagePath + '/static/media/more_information.svg'}
                                    />
                                    </span>
                                    <span className="msg">
                                    Select a goal below to map this
                                    investment with a goal of your
                                    choice. Otherwise, Fintoo will
                                    link it automatically with your
                                    high priority goal. In case, you
                                    do not wish to utilize this
                                    investment for any goal, select
                                    "NO".
                                    </span>
                                </span>
                                <div className="d-flex ms-md-4">
                                    <div>No</div>
                                    <Switch
                                    onChange={(v) =>
                                        setAssetsDetails({
                                        ...assetsDetails,
                                          user_asset_automated_linkage : v
                                        })
                                    }
                                     checked={assetsDetails.user_asset_automated_linkage === 1 ? true : false}
                                    className="react-switch px-2"
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    height={20}
                                    width={40}
                                    onColor="#042b62"
                                    offColor="#d8dae5"
                                    />
                                    <div>Yes</div>
                                </div>
                                </div>
                            </div>
                        </div>
                        {assetsDetails.user_asset_automated_linkage === true || assetsDetails.user_asset_automated_linkage === 1 && (
                        <div className="row">
                            <div className="col-md-5 mt-md-2 mt-5">
                                <div className="material">
                                <Form.Label className="link_asset_style">Link This Investment Asset to Goal</Form.Label>
                                    <div className="">
                                    <Select
                                        classNamePrefix="sortSelect"
                                        isSearchable={false}
                                        styles={customStyles}
                                        onChange={(e) =>
                                            setAssetsDetails({
                                            ...assetsDetails,
                                            asset_goal_link_id: e.value,
                                            })
                                        }
                                        value={goalData.filter(
                                            (v) => v.value == assetsDetails.asset_goal_link_id
                                        )}
                                        options={goalData}
                                        />
                                        <span className="info-hover-box">
                                            <span className="icon">
                                            <img
                                                alt="More information"
                                                 src={imagePath + '/static/media/more_information.svg'}
                                            />
                                            </span>
                                            <span className="msg">
                                            You can only assign goals
                                            which are prior to the end
                                            date of the SIP, if any
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                    </>
                )}
            </form>
        </div>
    );
}

export default Gold;