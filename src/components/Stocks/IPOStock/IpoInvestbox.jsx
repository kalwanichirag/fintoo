import React from "react";
import Styles from "./style.module.css";
import { Link } from "react-router-dom";
function IpoInvestbox(props) {
  return (
    <>
      <div className={`d-md-block d-none ${Styles.IpoInvestbox}`}>
        <div>
          <div>
            <img
              className="pt-4"
              src={process.env.REACT_APP_STATIC_URL + "/media/ipoinvest.svg"}
              style={{ width: 150 }}
            />
          </div>
          <p className={`${Styles.label}`}>Start your Invesment in IPO Now</p>
        </div>
        <button onClick={props.onOpenModal} className={`${Styles.InvestBtn}`}>
          Invest
        </button>
      </div>
      <div  className="mobile-purchase-btns d-flex justify-content-center d-md-none">
        <button onClick={props.onOpenModal} className={`${Styles.InvestBtn}`}>
          Invest
        </button>
      </div>
      {/* Ask Expert */}
      <div className="d-none">
      <div className={`d-md-block d-none ${Styles.IpoInvestbox}`}>
        <div>
          <div>
            <img
              className="pt-4"
              src={process.env.REACT_APP_STATIC_URL + "/media/ipoinvest.svg"}
              style={{ width: 150 }}
            />
          </div>
          <p className="pt-4 pb-0" style={{
            color: "#042b62",
            fontWeight: "600",
            fontSize: "1.1rem"
          }}>Looking to invest your money ?</p>
        </div>
        <p className={`p-0 pt-1 ps-4 pe-4 ${Styles.label}`}>
          Connect with Our Wealth Experts for Finacial Advisory
        </p>
        <button className={`${Styles.InvestBtn}`}>
          <Link className="text-decoration-none text-white"
            to={process.env.PUBLIC_URL + "/expert"}
          >
            Ask Expert
          </Link>
        </button>
      </div>
      <div className="mobile-purchase-btns d-flex justify-content-center d-md-none">
        <button className={`${Styles.InvestBtn}`}>
          <Link className="text-decoration-none text-white"
            to={process.env.PUBLIC_URL + "/expert"}>
            Ask Expert
          </Link>
        </button>
      </div>
      </div>
    </>
  );
}

export default IpoInvestbox;
