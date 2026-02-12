import { useState, useEffect } from "react";
import { imagePath } from "../../constants";

const RegisterForm = () => {

    return (<>
        <div style={{ paddingTop: '19%' }}>
            <h2 class="page-header text-center" style={{
                fontWeight: "600"
            }}>Fill in your details</h2>
            <div className="row justify-content-center mt-3">
                <div className="col-md-8">
                    <div className="material input">
                        <input type="text" tabindex="1" placeholder="Name*" />
                    </div>
                </div>
            </div>
            <div className="row justify-content-center mt-3">
                <div className="col-md-8">
                    <div className="material input">
                        <input type="text" tabindex="1" placeholder="Email Address*" />
                    </div>
                </div>
            </div>
            <div className="row justify-content-center mt-3">
                <div className="col-md-8">
                    <div className="material input">
                        <input type="text" tabindex="1" placeholder="Mobile Number*" />
                    </div>
                </div>
            </div>
            {/* <div className="row justify-content-center mt-3">
                <div className="col-md-8">
                    <div className="material input">
                        <input type="text" tabindex="1" placeholder="Select Expert*" />
                    </div>
                </div>
            </div> */}
            <div className="expertcallback_captcha_div pt-3">
                <div className="row form-row justify-content-center mt-3">
                    <div className="col-md-4">
                        <div id="captcha_block">
                            <img src={require('../../Assets/Images/main/captcha.png')} style={{ float: "left" }} draggable="false" />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <img
                            src={imagePath + "/static/media/Images/assets/img/refresh_captcha.svg"}
                            className="refresh_captcha"
                            alt="REFRESH CAPTCHA"
                        />

                    </div>
                </div>
            </div>
            <div className="row justify-content-center mt-3">
                <div className="col-md-8">
                    <div className="material input">
                        <input type="text" tabindex="1" placeholder="Captcha*" />
                    </div>
                </div>
            </div>
            <div className="btn-container text-center">
                <button
                    type="button"
                    value="Submit"
                    className="default-btn"
                >
                    Submit
                </button>

            </div>
        </div>
    </>);
}
export default RegisterForm;