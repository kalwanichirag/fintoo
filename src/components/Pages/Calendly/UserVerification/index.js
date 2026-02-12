import { useState } from 'react';
import Styles from '../style.module.css'
import Details from './Details';
import OtpView from './OtpView';
import { BASE_API_URL } from '../../../../constants';
import { apiCall } from '../../../../common_utilities';
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { sendOTP } from '../../../../FrappeIntegration-Services/services/user-management-api/userApiService';


const initialContactFormData = {
    fullname: "",
    mobile: "",
    email: ""
};

function UserVerification({ setCurrAppointmentView, logo, formData }) {

    const [currView, setCurrView] = useState('DETAILS');
    const [formState, SetFormState] = useState(initialContactFormData);

    const sendOtp = async () => {
        try {
            const payload = {
                identifier: formState.mobile,
                for_otp: "mobile"
            }
            const result = await sendOTP(payload);
            if (result.status_code != 200) {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error(result.message);
            }
        } catch (error) {

        }

    }

    return (
        <div className={Styles.detailContainer} style={{ position: 'relative' }}>
            {
                logo == false ? <br /> :
                    <div className={Styles.logoContainer}>
                        <img
                            alt="logo"
                            src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
                            style={{ width: '200px', margin: '0 auto' }}
                        />
                    </div>
            }
            {
                currView === 'DETAILS' && <Details setCurrView={setCurrView} formState={formState} SetFormState={SetFormState} sendOtp={sendOtp} />
            }
            {
                currView === 'OTP' && <OtpView setCurrView={setCurrView} setCurrAppointmentView={setCurrAppointmentView} formState={formState} sendOtp={sendOtp} />
            }

        </div>
    );
}

export default UserVerification;
