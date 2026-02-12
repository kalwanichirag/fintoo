import React, { useState ,useEffect} from 'react'
import styles from './Style.module.css';
import { AiFillStar } from 'react-icons/ai';
import { useNavigate, useSearchParams } from 'react-router-dom';
import commonEncode from "../../../../commonEncode";
import { getUserId, loginRedirectGuest } from '../../../../common_utilities';



function Plan(props) {
  const navigate = useNavigate();
  const [searchParams,] = useSearchParams();
  const [sdata,setdata] =useState("")
  const [localid ,setlocalid] = useState("")
  
  useEffect(() => {
    
    var id  = commonEncode.decrypt(localStorage.getItem("pid"))
    if(id){
      var newdoc = JSON.parse(id)
      setlocalid(newdoc.plan_id)
      onLoad();
    }
    
  }, [localid]);


  const numberFormat = (value) =>
  new Intl.NumberFormat("en-IN", {
    // style: 'currency',
    currency: "INR",
  }).format(value);


  const onLoad = () => {
    if(localid){

    if (localid == 39) {
      setdata(
        "Connect with our tax expert over a LIVE video call and let the expert help you file your ITR in the most stress-free way and also save maximum tax."
      );
    } else if (localid == 40) {
      setdata(
        "Connect with our tax expert over a LIVE video call and let the expert help you file your ITR in the most stress-free way and also save maximum tax."
      );
    } else if (localid == 41) {
      setdata(
        "Experience complete peace of mind with this innovative way of filing your ITR over a one-on-one video call with our tax expert with in-depth knowledge about taxation for residents and non-residents with foreign income"
        
      );
    } else if (localid == 42) {
      setdata(

        "End-to-end, reliable, and dedicated guidance in filing your ITR under the presumptive income tax filing scheme."

       
      );
    } else {
      setdata(" ");
    }

  }}
  

  return (
    <div className={`${styles.ITRPlanSection}`}>
      <div className="row">
        <div className={`col-12 col-md-6 ${styles.LeftSection}`}>
          <p className={`${styles.planName}`}>{props.planDetails.plan_name}</p>
          <p className={`${styles.planDes}`}>
            {/*File your Income Tax return with Tax Experts. Claim your tax
            benefits under Section 80C and other applicable sections*** */}
            {sdata}
          </p>
          {/* <div className={`${styles.Reviews}`}>
                <p>
                    <span className={`${styles.reviewScore}`}>4.8</span> <span><AiFillStar /> </span> 
                </p>
            </div> */}
        </div>
        <div className={`col-12 col-md-6 `}>
          <div className={`${styles.PlanBox} ${styles.RightSection}`}>
            <p className={`${styles.planName}`}>{props.planDetails.plan_name}</p>
            <div className={`${styles.PriceSection}`}>
              {searchParams.get('country') == 'UAE' ? <div className={`${styles.planPrice}`}>AED {(sessionStorage.getItem('aed_rate') * props.planDetails.plan_amount).toFixed(2)}</div> : <div className={`${styles.planPrice}`}>₹ {numberFormat(props.planDetails.plan_original_price)}</div>}
              
              {/* <div className={`${styles.PlanOffer}`}> */}
              {/* <span className={`${styles.planpricemax}`}>₹1,999</span>{" "} */}
              {/* <span className={`${styles.planOff}`}>(25% OFF)</span> */}
              {/* </div> */}
            </div>
            <div className={`${styles.PlanBuy}`}>
              <button onClick={() => {
                if(getUserId()) {
                  navigate(`${process.env.PUBLIC_URL}/itr-profile`);
                } else {
                  localStorage.setItem('isGuest', 1);
                  loginRedirectGuest("itr", `${window.location.origin}${process.env.PUBLIC_URL}/itr-profile`);
                }
              }}>Buy now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plan