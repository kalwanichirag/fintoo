import { Link } from "react-router-dom";
// import Trade from "../../Assets/Images/CommonDashboard/buy_taxplan.png";
import Trade from "../../Assets/Images/CommonDashboard/buy_taxplan.png"
import NextImg from "../../Assets/Images/CommonDashboard/Next.svg";
import { BASE_API_URL, imagePath } from "../../constants";

const BuyTaxPlan = () => {
  return (
    <div className="PlanBox NewPlanbox">
        <div className="d-md-flex justify-content-between">
          {/* <div className="TradeImg">
            <img src={Trade} />
          </div> */}
          <div className="TradeText">
            <div className="BigPlanText">Make Your Tax Planning Easy</div>
            <div className="SmallPlanText">
              Personalised Tax Planning Solutions for every Individual, <br /> Entrepreneur, Professional and Business.
            </div>
            <div className="ExploreherePlan">
              <Link to={process.env.PUBLIC_URL + "/tax-planning-page"}>
                <button>Explore Now</button>
              </Link>
            </div>
          </div>
          <div>
            <div className="d-md-block d-none" style={{
              float: "right",
              // marginTop : "15rem",
              marginLeft: "1rem",
              paddingTop: "7rem"

            }}>
              <img
                width={200}
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/Person.svg"
                }
              />
            </div>
          </div>
        </div>
      </div>
  );
};
export default BuyTaxPlan;
