import { useEffect, useState } from "react";
import MainLayout from "../components/Layout/MainLayout";
import style from './ExpertAppointment.module.css'
import { fetchData, getPublicMediaURL, getStarRatingValue } from "../common_utilities";
import { useCalendlyEventListener, InlineWidget } from "react-calendly";
import { Link, useNavigate } from 'react-router-dom';
import { CRM_FRAPPE_URL, CRM_URL, imagePath, taxplanningEndpoints } from "../constants";
import moment from "moment";
import { Modal } from "react-bootstrap";
import StepComponent from "../components/StepsComponent";
import MemberLayout from "../components/Layout/MemberLayout";
import Cookies from 'js-cookie';
import commonEncode from "../commonEncode";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import _ from 'lodash';

const getRatingClass = (rating, position) => {
    const starVal = getStarRatingValue(rating, position);

    if (starVal == 'FULL') return 'fa fa-star'

    if (starVal == 'HALF') return 'fa fa-star-half'

    return ''
}

const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
let userid = user_data.user_id;

export const ExpertNameInfo = ({ appointment, imgClass }) => {
    return (
        <div className={`${style.expertDetailContainer2}`} style={{ display: 'flex', justifyContent: 'center' }}>
            <div className={`${style.expertDetailNameContainer}`} style={{ width: '100%' }}>
                <div className={`${style[imgClass]}`} >
                    <div className={`${style.expertDetailImg}`} style={{ backgroundImage: `url(${CRM_URL + appointment.imagepath})` }}>
                    </div>
                    <div className={`${style.expertDetailStarsContainer}`}>
                        <span
                            className={`${getRatingClass(appointment.rating, 1)}`}
                            style={{
                                color: "orange",
                            }}
                        />
                        <span
                            className={`${getRatingClass(appointment.rating, 2)}`}
                            style={{
                                color: "orange",
                            }}
                        />
                        <span
                            className={`${getRatingClass(appointment.rating, 3)}`}
                            style={{
                                color: "orange",
                            }}
                        />
                        <span
                            className={`${getRatingClass(appointment.rating, 4)}`}
                            style={{
                                color: "orange",
                            }}
                        />
                        <span
                            className={`${getRatingClass(appointment.rating, 5)}`}
                            style={{
                                color: "orange",
                            }}
                        />
                    </div>
                </div>
                <div>
                    <div className={`${style.expertName}`} style={{ fontSize: '.8rem', textUnderlineOffset: '5px' }}>
                        <u>Your Tax Advisor</u>
                    </div>
                    <div className={`${style.expertName}`}>
                        {appointment?.emp_name}
                    </div>
                    <div className={`${style.expertDetails}`}>
                        {appointment?.emp_position && appointment.emp_position + ','}
                        &nbsp;{appointment?.emp_experience}+ years of experience.
                    </div>
                </div>
            </div>
        </div>
    )
}


const ExpertAppointment = () => {

    

    const [loading, setLoading] = useState(true)
    const [showSuccess, setShowSuccess] = useState(false)

    const [stepsData, setStepsData] = useState([
        {
            current: false,
            stepCompleted: true,
            name: 'Select the Expert',
        },
        {
            current: false,
            stepCompleted: true,
            name: 'Pay for Consultancy',
        },
        {
            current: true,
            stepCompleted: false,
            name: 'Book an Appointment',
        },
        {
            current: false,
            stepCompleted: false,
            name: 'Upload Documents',
        }
    ])

    const [appointment, SetAppointment] = useState({
        appointment_rescheduled_count: null,
        appointment_id: null,
        appointment_date: null,
        appointment_date_ordial: null,
        appointment_time: null,
        appointment_status: null,
        appointment_link: null,
        name: null,
        email: null,
        emp_id: null,
        emp_name: null,
        emp_position: null,
        emp_experience: null,
        rating: null,
        imagepath: null,
        payment_status: null,
        appointment_status_label: null,
        appointment_uri: '',
    })

    const [appointmentData, SetAppointmentData] = useState({
        event: null,
        invitee: null
    })

    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add("white-bg");
        return (() => document.body.classList.remove("white-bg"))
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [appointmentData])

    useCalendlyEventListener({
        onEventScheduled: (e) => {
            getEventData(e.data.payload.event.uri, e.data.payload.invitee.uri);
        }
    });

    const handleOnContinue = (redirectUrl) => {
        const appointmentInfo = {
            appointment_id: appointment.appointment_id
        }
        localStorage.setItem('FintooUserAppointmentInfo', JSON.stringify(appointmentInfo));
        return navigate(redirectUrl)

    }

    const getSessionData = async () => {

        let member = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
        let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser")));

        const membertUserData = member.filter(data => data.id == userid)[0];
        const currentUserData = users.filter(data => data.id == userid)[0];

        SetAppointment(prev => ({
            ...prev,
            name: membertUserData?.name,
            email: currentUserData?.email,
            phone: currentUserData?.mobile
        }))
    }

    const getIncomeSlabVal = (IncomeSlabTxt) => {
        switch (IncomeSlabTxt) {
            case '0 to 10 Lakh':
                return "0_to_10_lac";
            case '10 Lakh to 25 Lakh':
                return "10_lac_to_25_lac";
            case '25 Lakh to 50 Lakh':
                return "25_lac_to_50_lac";
            case '50 Lakh to 1 Crore':
                return "50_lac_to_1_crore";
            case 'Above 1 Crore':
                return "above_1_crore";
            default:
                return "i_do_not_wish_to_disclose";
        }
    }

    const getEventData = async (eventURL, inviteeURL) => {
        try {
            const r = await fetchData({
                url: eventURL,
                method: "GET",
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjQ4MjExMjQ0LCJqdGkiOiJmMmM1YWIwOC01N2ZiLTQ0YzAtODNjYy1lM2QxZWZhZGY2YzMiLCJ1c2VyX3V1aWQiOiI0ODVhZTAyZC02ZGNiLTQ1MjktODdiYi01MGY2NDE3NGI4ZWYifQ.5bIIwHH3DTn1Vp7Oj6hZlLkVIbI1q7jxqFogGaGkb1g",
                },
            });
            SetAppointmentData(prev => ({ ...prev, event: r.resource }))

            const r2 = await fetchData({
                url: inviteeURL,
                method: "GET",
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjQ4MjExMjQ0LCJqdGkiOiJmMmM1YWIwOC01N2ZiLTQ0YzAtODNjYy1lM2QxZWZhZGY2YzMiLCJ1c2VyX3V1aWQiOiI0ODVhZTAyZC02ZGNiLTQ1MjktODdiYi01MGY2NDE3NGI4ZWYifQ.5bIIwHH3DTn1Vp7Oj6hZlLkVIbI1q7jxqFogGaGkb1g",
                },
            });

            const updateSchedulePayload = {
                date: new Date(r.resource.start_time).toLocaleDateString('en-ca'),
                time: new Date(r.resource.start_time).toLocaleTimeString('en-US', { hour12: false }),
                meeting_link: r.resource.location.join_url,
                appointment_uri: r.resource.uri,
                income_slab: getIncomeSlabVal(r2.resource.questions_and_answers[1]?.answer)
            };

            // Call API to update appointment
            await updateScheduleData(updateSchedulePayload);

            // Set both event & invitee in one state update
            SetAppointmentData(prev => ({ ...prev, invitee: r2.resource }))
            // SetAppointmentData({
            //     event: r.resource,
            //     invitee: r2.resource
            // });

        } catch (error) {
            console.error("Error in getEventData:", error);
        }
    };


    const getScheduleData = async () => {

        const FintooUserPlanInfoInfo = JSON.parse(localStorage.getItem('FintooUserPlanInfoInfo'));
        if (!FintooUserPlanInfoInfo) {
            return navigate(`${process.env.PUBLIC_URL}/commondashboard`);
        }

        try {
            const baseUrl = `${taxplanningEndpoints.GET_APPOINTMENT_DETAILS}?appointment_user_id=${userid}`;
            const token = Cookies.get('token');
            let url = baseUrl;
            if (FintooUserPlanInfoInfo.appointment_id) {
                url += `&appointment_id=${encodeURIComponent(FintooUserPlanInfoInfo.appointment_id)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${token}`
                }
            });

            const data = await response.json();

            if (data.status_code === 200) {
                const responseData = data.data;

                if (responseData.length > 0) {
                    const data1 = responseData[0];

                    if (data1.appointment_rescheduled_count == 3) {
                        return navigate(`${process.env.PUBLIC_URL}/commondashboard`);
                    }

                    setStepsData([
                        {
                            current: false,
                            stepCompleted: true,
                            name: 'Select the Expert',
                        },
                        {
                            current: false,
                            stepCompleted: true,
                            name: 'Pay for Consultancy',
                        },
                        {
                            current: true,
                            stepCompleted: data1.appointment_time,
                            name: 'Book an Appointment',
                        },
                        {
                            current: false,
                            stepCompleted: !(_.isEmpty(data1.appointment_documents)),
                            name: 'Upload Documents',
                        }
                    ]);

                    SetAppointment(prev => ({
                        ...prev,
                        appointment_rescheduled_count: data1.appointment_rescheduled_count,
                        appointment_id: data1.name,
                        appointment_date: data1.appointment_date,
                        appointment_date_ordial: data1.appointment_date_ordial,
                        appointment_time: data1.appointment_time,
                        appointment_status: data1.appointment_status,
                        appointment_link: data1.appointment_link,
                        emp_name: data1.emp_name,
                        emp_id: data1.appointment_expert_id,
                        emp_position: data1.emp_position,
                        emp_experience: data1.emp_experience,
                        rating: data1.rating,
                        imagepath: data1.imagepath,
                        payment_status: data1.payment_status,
                        appointment_status_label: data1.appointment_status_label,
                        appointment_uri: data1.appointment_uri ?? ''
                    }));

                    setLoading(false);

                } else {
                    return navigate(`${process.env.PUBLIC_URL}/commondashboard`);
                }
            } else {
                return navigate(`${process.env.PUBLIC_URL}/commondashboard`);
            }
        } catch (error) {
            console.error('Error in getScheduleData:', error);
            setLoading(false);
        }
    }

    const updateScheduleData = async (scheduleData) => {
        try {
            const token = Cookies.get('token');

            const url = `${taxplanningEndpoints.UPDATE_APPOINTMENT_DETAILS}`;

            const payload = {
                appointment_id: appointment.appointment_id,
                appointment_user_id: String(userid),
                appointment_expert_id: appointment.emp_id,
                appointment_status: "S",  // Assuming "P" is correct as per your backend
                appointment_date: scheduleData.date,
                appointment_time: scheduleData.time,
                income_slab: scheduleData.income_slab,
                appointment_link: scheduleData.meeting_link ?? "",
                appointment_uri: scheduleData.appointment_uri,
                // old_appointment_uri: appointment.appointment_uri,
                appointment_plan_uuid: "tax_plan"
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `token ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.status_code === 200) {
                setShowSuccess(true);
            } else {
                SetAppointmentData({
                    event: null,
                    invitee: null
                });
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error('Appointment update failed. Please try again!');
            }
        } catch (error) {
            console.error('Error in updateScheduleData:', error);
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error('Something went wrong. Please try again!');
        }
    };

    const getOrdinal = (number) => {
        if (number >= 11 && number <= 13) {
            return `${number}th`;
        } else {
            const suffix = { 1: 'st', 2: 'nd', 3: 'rd' }[number % 10] || 'th';
            return `${number}${suffix}`;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '/-/-/';
        }

        const dayWithOrdinal = getOrdinal(date.getDate());
        const formattedDate = ` ${dayWithOrdinal} ${date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        })}`;
        return formattedDate;
    };


    const getTitle = () => {
        if (!appointmentData.event && !appointmentData.invitee) {
            return appointment.appointment_link ? 'Reschedule An Appointment' : 'Book An Appointment'
        } else {
            return 'Appointment Confirmed'
        }
    }

    useEffect(() => {
        getScheduleData();
        getSessionData();
    }, [])

    return (
        <MainLayout>
            <MemberLayout>
                {
                    !loading && (
                        <div className={`${style.topPlaceHolder} container-fluid white-bg`}>
                            <br />
                            <h2 className="upperText text-center" style={{ position: 'relative' }}>
                                {getTitle()}
                            </h2>
                            <br />


                            <div className={`${style.expertAppointmentContainer}`}>

                                <Link to={`${process.env.PUBLIC_URL}/commondashboard`} >
                                    <div className={`${style.backOption}`}>
                                        <img
                                            src="https://stg.minty.co.in/static/userflow/img/icons/back-arrow.svg"
                                            alt="Back Arrow"
                                        />
                                    </div>
                                </Link>

                                <StepComponent stepsData={stepsData} />
                                <br />
                                {
                                    appointment?.appointment_time ? (<div className={`${style.expertDetailContainer}`} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div className={`${style.expertDetailNameContainer}`}>
                                            <div className={`${style.expertDetailImgContainer}`}>
                                                <div className={`${style.expertDetailImg}`} style={{ backgroundImage: `url(${CRM_URL + appointment.imagepath})` }}>
                                                </div>
                                                <div className={`${style.expertDetailStarsContainer}`}>
                                                    <span
                                                        className={`${getRatingClass(appointment.rating, 1)}`}
                                                        style={{
                                                            color: `${appointment.rating - 1 < 0 ? "gray" : "orange"
                                                                }`,
                                                        }}
                                                    />
                                                    <span
                                                        className={`${getRatingClass(appointment.rating, 2)}`}
                                                        style={{
                                                            color: `${appointment.rating - 1 < 0 ? "gray" : "orange"
                                                                }`,
                                                        }}
                                                    />
                                                    <span
                                                        className={`${getRatingClass(appointment.rating, 3)}`}
                                                        style={{
                                                            color: `${appointment.rating - 1 < 0 ? "gray" : "orange"
                                                                }`,
                                                        }}
                                                    />
                                                    <span
                                                        className={`${getRatingClass(appointment.rating, 4)}`}
                                                        style={{
                                                            color: `${appointment.rating - 1 < 0 ? "gray" : "orange"
                                                                }`,
                                                        }}
                                                    />
                                                    <span
                                                        className={`${getRatingClass(appointment.rating, 5)}`}
                                                        style={{
                                                            color: `${appointment.rating - 1 < 0 ? "gray" : "orange"
                                                                }`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className={`${style.expertName}`} style={{ fontSize: '1rem', textUnderlineOffset: '5px' }}>
                                                    <u>Your Tax Advisor</u>
                                                </div>
                                                <div className={`${style.expertName}`}>
                                                    {appointment?.emp_name}
                                                </div>
                                                <div className={`${style.expertDetails}`}>
                                                    {appointment?.emp_position && appointment.emp_position + ','}
                                                    &nbsp;{appointment?.emp_experience}+ years of experience.
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${style.expertDetailTimingContainer}`}>
                                            <div className={`${style.expertDetailTimingText}`}>
                                                <img
                                                    src={getPublicMediaURL("static/media/DG/Images/Celender.svg")}
                                                    alt="DOB"
                                                    width={'20px'}
                                                />
                                                Date :&nbsp;{appointment?.appointment_date ? moment(appointment?.appointment_date).format("DD/MM/YYYY") : '-/-/-'}
                                            </div>
                                            <div className={`${style.expertDetailTimingText}`}>
                                                <img
                                                    src={getPublicMediaURL("static/media/DG/Images/ph_clock.svg")}
                                                    alt="DOB"
                                                    width={'20px'}
                                                />
                                                Time :&nbsp;{appointment?.appointment_time ? moment(appointment?.appointment_time, ["HH:mm:ss"]).format("hh:mm A") : '-:-'}
                                            </div>
                                        </div>
                                    </div>) : (
                                        <ExpertNameInfo appointment={appointment} imgClass={'expertDetailImgContainer2'} />

                                    )
                                }

                                <div className={`${style.expertCalenderContainer}`}>
                                    <InlineWidget
                                        url={`https://calendly.com/fintoo/60-min-consultation-call-tax-planning-?hide_event_type_details=1&hide_gdpr_banner=1&name=${appointment.name ?? ''}&email=${appointment.email ?? ''}&a2=${'91' + (appointment.phone ?? '')}&a4=${appointment.emp_name ?? ''}`}
                                    />
                                </div>
                            </div>

                            <Modal centered show={appointmentData.event && appointmentData.invitee && showSuccess}>
                                <div style={{ padding: '1rem' }}>
                                    <div className={`${style.confirmationImgContainer}`}>
                                        <div className={`${style.expertDetailConfirmText}`} style={{ textAlign: 'center' }}>
                                            Appointment Confirmed
                                        </div>
                                        <br />
                                        <img
                                            src={getPublicMediaURL("static/media/DG/Images/Animation_thumb.gif")}
                                            alt="DOB"
                                        />
                                    </div>
                                    <br />
                                    <div className={`${style.expertCallDetailName}`}>
                                        <div className={`${style.expertDetailImgContainer}`} style={{ width: '17%' }}>
                                            <div className={`${style.expertDetailImg}`} style={{ backgroundImage: `url(${CRM_URL + appointment.imagepath})` }}>
                                            </div>
                                        </div>
                                        <div>
                                            <div className={`${style.expertName}`}>
                                                {appointment?.emp_name}
                                            </div>
                                            <div className={`${style.expertDetails}`}>
                                                {appointment?.emp_position && appointment.emp_position}
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className={`${style.expertCallDetailTiming}`} >
                                        <div className={`${style.expertDetailTimingText}`}>
                                            <img
                                                src={getPublicMediaURL("static/media/DG/Images/Celender.svg")}
                                                alt="DOB"
                                                width={'20px'}
                                            />
                                            Date : &nbsp;{appointmentData?.event?.start_time ? (formatDate(appointmentData.event.start_time)) : ('/-/-/')}
                                        </div>
                                        <div className={`${style.expertDetailTimingText}`} style={{ borderLeft: '3px solid #E6E6E6', paddingLeft: '1rem' }}>
                                            <img
                                                src={getPublicMediaURL("static/media/DG/Images/ph_clock.svg")}
                                                alt="DOB"
                                                width={'20px'}
                                            />
                                            Time :  &nbsp; {appointmentData?.event?.start_time ? moment((new Date(appointmentData.event.start_time)).toLocaleTimeString('en-US', { hour12: false }), ["HH:mm:ss"]).format("hh:mm A") : '-'}
                                        </div>
                                    </div>
                                    <div className={`${style.expertCallDetailTxt}`}>
                                        <br />
                                        <div className={`${style.expertCallDetailTxtThankYou}`} >
                                            Thank you!
                                        </div>
                                        <div className={`${style.expertCallDetailTxtPara}`} >
                                            Your journey to tax savings begins now.<br />
                                            You have the option to either upload a document for your tax advisor to review or skip this step entirely.
                                        </div>
                                    </div>
                                    <div className="text-center ">
                                        <br />
                                        <div className="d-flex justify-content-center gap-3">
                                            <button
                                                onClick={() => handleOnContinue(`${process.env.PUBLIC_URL}/documents-upload`)}
                                                className={`${style.expertCallDetailBtn}`}
                                                type="button"
                                            >
                                                Upload Document
                                            </button>
                                            <button
                                                onClick={() => handleOnContinue(`${process.env.PUBLIC_URL}/commondashboard`)}
                                                className={`${style.expertCallDetailBtn2}`}
                                                type="button"
                                                style={{ width: '30%' }}
                                            >
                                                Skip
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </Modal>
                        </div >
                    )
                }
            </MemberLayout>
        </MainLayout>
    );
};
export default ExpertAppointment;
