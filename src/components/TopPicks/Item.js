import ICICI from "../../Assets/Images/CommonDashboard/ICICIBank.png";
import { BiUpArrowAlt, BiDownArrowAlt } from "react-icons/bi";
import Style from "./style.module.css";
import { useNavigate } from "react-router-dom";


const TopPickItem = ({data}) => {
  const navigate = useNavigate();
  return (
    <div className={Style.TpBx}>
      <div className={Style.DataItem}>
        <div className={`${Style.imgBox}`}>
          <div>
            <img src={`${process.env.REACT_APP_STATIC_URL}/media/companyicons/${data.amc_code}.png`} style={{width: '30px'}} className="rounded-circle" />
          </div>
        </div>
        <div className="Funds py-3">
          <div className={Style.FundText}>
            <a className={Style.itemLink} href={process.env.PUBLIC_URL + '/direct-mutual-fund/MutualFund/'+data.slug} target="_blank">
              {data.scheme_name}
            </a>
          </div>
        </div>
        <div className={`d-flex justify-content-between ${Style.navbx}`}>
          <div>
            <div
              style={{
                fontSize: ".7em",
                color: "gray",
                fontWeight: "600",
              }}
            >
              NAV
            </div>
            <div
              style={{
                fontSize: "1em",
                color: "gray",
                fontWeight: "700",
              }}
            >
              ₹ {Math.round(data.nav * 100) / 100}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: ".7em",
                color: "gray",
                fontWeight: "600",
              }}
            >
              3 YEAR
            </div>
            <div
              style={{
                fontSize: "1em",
                color: "#9ac04f",
                fontWeight: "700",
              }}
            >
              {Math.round(data.return_3yr * 100) / 100} %{" "}
              <span>
                <BiUpArrowAlt />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopPickItem;
