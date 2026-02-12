
import React, { useEffect, useState } from 'react';
import TrackingStepsOverview from '../../components/BankTrackingOverview/TrackingStepsOverview';
import TrackingOption from '../../components/BankTrackingOverview/TrackingOption';
import style from '../../style.module.css';
import ConcentPopupUi from '../../components/BankTrackingOverview/ConcentPopupUi';
import { Modal } from 'react-bootstrap';
import ApplyWhiteBg from '../../../../components/ApplyWhiteBg';
import HideFooter from '../../../../components/HideFooter';
import { useNavigate } from "react-router-dom";
import commonEncode from '../../../../commonEncode';
import { DataProvider } from '../../context/DataContext';
import { useDispatch } from "react-redux";
import { getFpUserDetailId, getMemberId, getParentUserId, getUserId, removeMemberId, setFpUserDetailsId, setItemLocal, setMemberId } from '../../../../common_utilities';
import { getFamilyMember } from '../../../../FrappeIntegration-Services/services/user-management-api/userApiService';

function BankTrackingOverView() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [allMembers, setAllMembers] = useState([]);
    const [parent, setParent] = useState("");

    const dispatch = useDispatch();
    // Define state variable to store users data
    const [usersData, setUsersData] = useState([]);
    useEffect(() => {
    }, [usersData])
    const [selectedUserId, setSelectedUserId] = useState({
        memberId: '',
        fpUserId: ''
    });

    let navigate = useNavigate();

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const handleParentdata = (Rdata) => {
        var getarray1 = Rdata.data.filter((obj) => {
          return obj.user_parent_id == null;
        });
        setParent(getarray1);
    };

    const fetchMembersFromUser = async (userId) => {
    try {
        const r = await fetchData({
        url: "",
        data: {
            // user_id: userId,
            user_id: getParentUserId(),
            data_belongs_to: DATA_BELONGS_TO,
        },
        method: "post",
        });
        const all = r.data.map((v) => ({
        name: v.NAME ? v.NAME : v.email,
        id: v.id,
        parent_user_id: v.parent_user_id,
        pan: v.pan,
        mobile: v.mobile,
        email: v.email,
        }));

        // setItemLocal("allMemberUser", [...all])
    } catch (e) {}
    };

    const fetchMembers = async () => {
    try {
        let parentId = getParentUserId();
        if (parentId) {
            const r = await getFamilyMember(parentId);
            handleParentdata(r);
            const all = r.data.map((v, index) => ({
                name: v.user_name || v.user_email || v.relation || `Unknown`,
                id: v.user_id,
                parent_user_id: v.user_parent_id,
                pan: v.pan,
                mobile: v.mobile_number,
                email: v.user_email,
                user_email: v.user_email,
                fp_user_details_id: v.user_details_id,
                fdmf_is_minor: v.is_minor,
                relation: v.relation,
                relation_id: v.relation_id,
                is_dependent: v.is_dependent,
                gender: v.gender,
                user_age: v.user_age,
                dob: v.dob,
                occupation: v.occupation,
                retirement_age: v.retirement_age,
                life_expectancy_age: v.life_expectancy_age,
            }));
            return all;
            setAllMembers([...all]);
            // setItemLocal("member", [...all]);

            // const currUserId = getUserId();

            // const userData = [...all].filter((data) => data.id == getUserId())[0];
            // if (!Boolean(userData.mobile) || !Boolean(userData.email)) {
            //     fetchMembersFromUser(currUserId);
            // } else {
            //     setItemLocal("allMemberUser", [...all]);
            // }
        }
    } catch (e) {
        return [];
        // Error fetching members
    }
    };
    // useEffect(() => {
    //     // call fetchMembers when component mounts
        
    //     fetchMembers();
    // }, []);

    const closePopupAndNavigate =  async() => {
        if (selectedUserId.memberId == getUserId()) {
            // window.location.href = `${process.env.PUBLIC_URL}/money-management/track-bank-account`
            // navigate(`${process.env.PUBLIC_URL}/money-management/track-bank-account`)
            localStorage.removeItem("family");
            localStorage.removeItem("logged_in");
            window.location.href = `${process.env.PUBLIC_URL}/money-management/track-bank-account`
        } else {
            let allMemData = await fetchMembers();
            // filter from allMembers with selectedUserId.memberId
            const userdata = allMemData.filter((member) => member.id == selectedUserId.memberId)[0];
            userdata["user_id"] = userdata.id;
            localStorage.setItem("user_data", JSON.stringify(userdata));
            removeMemberId();
            setMemberId(selectedUserId.memberId);
            setFpUserDetailsId(selectedUserId.fpUserId);
            localStorage.removeItem("family");
            localStorage.removeItem("logged_in");
            window.location.href = `${process.env.PUBLIC_URL}/money-management/track-bank-account`
        }

    };




    // Fetch users data from local storage and set it to the state variable
    useEffect(() => {


        function checkUserData() {

            if (localStorage.getItem("member")) {
                let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));

                setUsersData(users);
                dispatch({ type: "SET_USER_DETAILS", payload: users[0] });
            }

            if (!Boolean(localStorage.getItem("family"))) {
                setSelectedUserId({
                    memberId: getUserId(),
                    fpUserId: getFpUserDetailId()
                })
            }

        }

        setTimeout(() => { checkUserData() }, 1000)

    }, [])

    return (
        <DataProvider>
            <ApplyWhiteBg />
            <div className={`${style.bankTrackingOverViewContainer}`}>
                <div style={{ width: '100%', background: 'white' }}>
                    <TrackingOption openPopup={openPopup} usersData={usersData} selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId} />
                </div>
                <div style={{ width: '100%', background: '#F3F3F3' }} className={`${style.TrackingStepsOverview}`}>
                    <TrackingStepsOverview />
                </div>
                <Modal
                    className={`${style.moneyManagementModal}`}
                    dialogClassName={`${style.moneyManagementModalDialog}`}
                    centered
                    show={isPopupOpen}
                    size='lg'
                    onHide={closePopup}
                >
                    <ConcentPopupUi closePopup={closePopupAndNavigate} />
                </Modal>
            </div>
        </DataProvider>
    );
}

export default BankTrackingOverView;
