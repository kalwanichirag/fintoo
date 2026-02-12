import { useEffect, useState,  } from "react";
import Styles from "./style.module.css"
import Stepper from "./Stepper";
import ConnectWithBroker from "../../../datagathering/AssetsLibDG/ConnectWithBroker";
import { useDispatch } from "react-redux";
import { CHECK_SESSION } from "../../../../constants";
import { apiCall, getItemLocal, getParentUserId } from "../../../../common_utilities";
const ConnetcBroker = (props) => {
    const dispatch = useDispatch();
    const [session, setSession] = useState({})
    // const checksession = async () => {
    //     try {
    //       let url = CHECK_SESSION;
    //       let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
    //       let session_data = await apiCall(url, data, true, false);
    //       if (session_data["error_code"] == "100") {
    //         setSession(session_data);
    //       }
    //     } catch (e) {
    //       console.log(e);
    //       setIsLoading(false);
    //     }
    //   };
      
      useEffect(()=>{
        // // checksession();
      },[])

    return (
        <>
            <div className={`${Styles.ConnetcBroker}`}>
                <div className={`${Styles.ModalProgressBar}`}>
                    <div className={`${Styles.stepHeading}`}>
                        Just in 5 Easy Step
                    </div>
                    <div >
                        <Stepper isActive={true} stepnumber="1" text1={"Select Broker"} text2={"Just choose your broker"} />
                        <Stepper isActive={true} stepnumber="2" text1={"Login"} text2={"Register with your account"} />
                        <Stepper isActive={true} stepnumber="3" text1={"Fetch Holdings"} text2={"We'll bring over your Holdings"} />
                        <Stepper isActive={true} stepnumber="4" text1={"Select Member"} text2={"Choose a member for these investments"} />
                        <Stepper isActive={true} stepnumber="5" text1={"Completed"} text2={"Woah, Track your investments"} />
                    </div>

                </div>
                <div className={`${Styles.ModalBottomSection}`}>
                    <div className={`${Styles.thirdPartyView}`}>
                        <div className="d-flex align-items-center">
                            <div className={`${Styles.poweredBy}`}>Powered by</div>  <img className="ms-2" width={100} src={process.env.REACT_APP_STATIC_URL + "media/DG/SmallCasen.png"} alt="Close" />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${Styles.linkNowbtn}`}>
                <button onClick={() => {
                    props.ShowClose();
                    dispatch({
                        type: "CONNECT_WITH_BROKER",
                        payload: true,
                    });
                }}>Connect Now</button>
            </div>
            <div className="d-none">
            {session.length>0 &&
            <ConnectWithBroker session={session} />
            }
            </div>
        </>
    );
};
export default ConnetcBroker;
