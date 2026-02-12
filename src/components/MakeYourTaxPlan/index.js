import { Link } from "react-router-dom";
import { BASE_API_URL } from "../../constants";
import { ReactComponent as FintooNext } from "./images/fintooNextIc.svg";
import style from "./style.module.css";
import NextImg from "../../Assets/Images/CommonDashboard/Next.svg";
import Trade from "../../Assets/Images/CommonDashboard/buy_taxplan.png";


const MakeYourTaxPlan = () => {
  return (
    <Link to={process.env.PUBLIC_URL + "/tax-planning-page"} style={{
      textDecoration: 'none'
    }}>
    <div className={style.PlanBox}>
      <div className={`d-md-flex align-items-center ${style.tradebox}`}>
        <div className={style.TradeImg}>
        <img  width={200} src={Trade} />
        </div>
        <div className={style.TradeText}>
          <div className={style.BigPlanText}>Make Your Tax Planning Easy</div>
          <div className={style.SmallPlanText}>
            Personalised Tax Planning Solutions for every Individual, 
            Entrepreneur, Professional and Business.
          </div>
        </div>
        <div className={`${style.TradeNextImg} d-none d-md-block`}>
            <img src={imagePath + NextImg} width={28} height={28} />
        </div>
      </div>
    </div>
    </Link>
  );
};
export default MakeYourTaxPlan;
