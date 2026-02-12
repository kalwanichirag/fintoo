import React, { useEffect, useState } from 'react';
import style from '../../style.module.css';
import { apiCall, getParentUserId, getPublicMediaURL } from '../../../../common_utilities';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_API_URL, CRM_FRAPPE_URL, CRM_URL } from '../../../../constants';
import moment from 'moment';
import Slider from 'react-slick';
// import CopyIcon from "../../Assets/Images/copy_icon.svg";
import CopyIcon from "../../../../Assets/Images/copy_icon.svg";
import commonEncode from '../../../../commonEncode';

const ScheduleDetailsUi = ({ appointmentData }) => {
    const [membertUserData, setMembertUserData] = useState(null);
    const [allMemberUserData, setAllMemberUserData] = useState(null);

    let navigate = useNavigate();

    const handleUploadClick = () => {
        const appointmentInfo = {
            appointment_id: appointmentData.appointment_id
        }
        localStorage.setItem('FintooUserAppointmentInfo', JSON.stringify(appointmentInfo));
        return navigate(`${process.env.PUBLIC_URL}/documents-upload`)

    }

    const handleSchedule = (appointment_id) => {
        const planInfo = {
            appointment_id: appointment_id
        }
        localStorage.setItem('FintooUserPlanInfoInfo', JSON.stringify(planInfo));
        return navigate(`${process.env.PUBLIC_URL}/expert-appointment`)

    }

    const assignUserData = () => {

        if (commonEncode.decrypt(localStorage.getItem("member")) && commonEncode.decrypt(localStorage.getItem("allMemberUser"))) {
            let member = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
            let allMemberUser = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser")));

            const membertUserInfo = member.filter(data => data.id == appointmentData.appointment_user_id)[0];
            const allMemberUserInfo = allMemberUser.filter(data => data.id == appointmentData.appointment_user_id)[0];

            setMembertUserData(membertUserInfo);
            setAllMemberUserData(allMemberUserInfo);
        }

    }

    useEffect(() => {
        setTimeout(() => {
            assignUserData()
        }, 1000)
    }, [])


    return (
        <div className={`autoAdvisory lifeInsurance ${style.savingAccountInfoSectionContainer} ${style.savingAccountInfoSectionContainer2}`}>
            <div className={`${style.ScheduleDetailSectionHeader}`}>
                {/* <div className={`${style.ScheduleDetailSectionHeaderTxt}`}>plan_name</div>
                <div className={`${style.ScheduleDetailSectionHeaderTxt}`}>membertUserData</div> */}
                <div className={`${style.ScheduleDetailSectionHeaderTxt}`}>{appointmentData.plan_name}</div>
                <div className={`${style.ScheduleDetailSectionHeaderTxt}`}>{membertUserData?.name}</div>
            </div>
            <div className={`${style.ScheduleDetailSectionInnerContainer}`}>
                <div className={`${style.expertCallDetailName}`}>
                    <div className={`${style.expertDetailImgContainer}`}>
                        <div className={`${style.expertDetailImg}`} style={{ backgroundImage: `url(${CRM_URL + appointmentData.imagepath})` }}>
                        </div>
                    </div>
                    <div>
                        <div className={`${style.expertName}`} style={{ width: '100%' }}>
                            {appointmentData.emp_name}
                        </div>
                        <div className={`${style.expertDetails}`}>
                            {appointmentData.emp_position}
                        </div>
                    </div>

                    {
                        appointmentData.appointment_link && <span className={`${style.expertCallDetailMeetingOption}`}>

                            <span style={{ marginTop: '0' }}>
                                <img
                                    onClick={() => handleUploadClick()}
                                    src={getPublicMediaURL("static/media/DG/Images/upload.svg")}
                                    alt="DOB"
                                    width={'15px'}
                                    title='Upload Documents'
                                />
                            </span>

                            <a href={appointmentData.appointment_link} target='_blank' style={{ marginLeft: '0.5rem' }}>
                                <img
                                    src={getPublicMediaURL("static/media/DG/Images/schedule_meeting_btn.svg")}
                                    alt="DOB"
                                    width={'20px'}
                                    title='Join Meeting'
                                />
                            </a>


                            <span className={`${style.shareElemContainer}`}>
                                <img
                                    style={{ marginLeft: '0.5rem', marginTop: '0.2rem' }}
                                    src={getPublicMediaURL("static/media/DG/Images/shareIcon.svg")}
                                    alt="DOB"
                                    width={'15px'}
                                    title='Share Meeting'
                                />
                                <div className={`${style.shareElem}`}>
                                    <a
                                        className=""
                                        rel="nofollow"
                                        target="_blank"
                                        onClick={() => {
                                            navigator.clipboard.writeText(appointmentData.appointment_link)
                                            alert("Copied on clipboard!")
                                        }}
                                    >
                                        <img
                                            id="Copy"
                                            src={CopyIcon}
                                            alt="copy"
                                            title="Copy"
                                            width={20}
                                        />

                                    </a>
                                    <a
                                        href={`mailto:${allMemberUserData?.email ?? ''}?&body=${appointmentData.appointment_link}`}
                                        className=""
                                        rel="nofollow"
                                        target="_blank"
                                    >
                                        <img width={20}
                                            title='Share via Mail'
                                            src={
                                                process.env.PUBLIC_URL +
                                                "/static/media/DMF/Report/email.svg"
                                            } alt="" style={{ cursor: 'pointer' }} />
                                    </a>
                                    <a
                                        href={
                                            "https://api.whatsapp.com/send?text=" +
                                            encodeURI(appointmentData.appointment_link)
                                        }
                                        className=""
                                        rel="nofollow"
                                        target="_blank"
                                        data-action="share/whatsapp/share"
                                    >
                                        <img width={20}
                                            title='Share on whatsapp'
                                            src={
                                                process.env.PUBLIC_URL +
                                                "/static/media/DMF/Report/whatsapp.svg"
                                            } alt="" style={{ cursor: 'pointer' }} />
                                    </a>
                                </div>
                            </span>
                        </span>
                    }

                </div>

                {
                    appointmentData.appointment_link ? (
                        <div className={`${style.expertCallDetailTiming}`}>
                            <div style={{ width: `${appointmentData.appointment_rescheduled_count == 3 ? '100%' : '65%'}` }}>
                                <div style={{ flexDirection: 'column', borderRight: '1px solid #E6E6E6' }} >
                                <div
                                    className={style.expertDetailTimingText}
                                    style={{ marginBottom: '0.5rem' }}
                                    >
                                    <img
                                        src={getPublicMediaURL("static/media/DG/Images/Celender.svg")}
                                        alt="DOB"
                                        width="15px"
                                    />
                                    Date :- &nbsp;
                                    {moment(appointmentData.appointment_date, 'YYYY-MM-DD').format('dddd')},{" "}
                                    {moment(appointmentData.appointment_date, 'YYYY-MM-DD').format('D')}{" "}
                                    {moment(appointmentData.appointment_date, 'YYYY-MM-DD').format('MMMM')}
                                </div>
                                    <div className={`${style.expertDetailTimingText}`}>
                                        <img
                                            src={getPublicMediaURL("static/media/DG/Images/ph_clock.svg")}
                                            style={{ color: 'black' }}
                                            alt="DOB"
                                            width={'15px'}
                                        />
                                        Time :- &nbsp;{moment(appointmentData.appointment_time, ["HH:mm:ss"]).format("hh:mm A")} - {moment(appointmentData.appointment_time, ["HH:mm:ss"]).add(1, 'hours').format("hh:mm A")}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '35%' }}>
                                <div className={`${style.addAccountBtnContainer}`}>
                                    {
                                        appointmentData.appointment_rescheduled_count == 3 ?
                                            <div className={`${style.btn1}`} style={{ background: '#517787', cursor: 'default' }} >
                                                Scheduled
                                            </div>
                                            :
                                            <div className={`${style.btn1}`} onClick={() => handleSchedule(appointmentData.name)}>
                                                Reschedule
                                            </div>

                                    }
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className={`${style.expertCallDetailSchedule}`}>
                            <div style={{ width: '100%', padding: '0.5rem 0' }}>
                                <div className={`${style.expertDetailTimingText}`} style={{ display: 'unset', marginBottom: '0.5rem' }}>
                                    <b>Payment successful</b>, Click now to book a convenient time and connect with our expert.
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: '100%' }}>
                                <div className={`${style.addAccountBtnContainer}`}>
                                    <div className={`${style.btn1}`} style={{ fontWeight: '600' }} onClick={() => handleSchedule(appointmentData.name)}>
                                        Schedule Now
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

const ScheduleDetails = ({ appointmentData }) => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplaySpeed: 8000,
        autoplay: false,
        fade: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        margin: 20,
        dotsClass: "slick-dots categories-slick-dots dashboard-slick-dots",
    };

    return (
        <div className={`Section lifeInsurance ${style.ScheduleDetailSectionContainer}`} style={{ margin: '0' }}>
            <div className='pt-4'>
                <div className="GoalText default-grey" style={{ marginBottom: '1rem' }}>Upcoming Schedule</div>
                {
                    // Boolean(localStorage.getItem("family")) ?
                    appointmentData.appointmentData.length > 1 ?
                        <Slider {...settings}>
                            {
                                appointmentData.appointmentData.map((appointmentData, idx) =>
                                    <ScheduleDetailsUi appointmentData={appointmentData} key={idx} forFamilyView={true} />)
                            }
                        </Slider>

                        :
                        <ScheduleDetailsUi appointmentData={appointmentData.appointmentData[0]} forFamilyView={false} />
                }
            </div>
        </div >
    );
};

export default ScheduleDetails;
