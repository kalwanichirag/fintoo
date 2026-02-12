import style from "./style.module.css";
import { ReactComponent as FintooNext } from "./images/fintooNextIc.svg";


const getImg = (title) => {
  switch (title) {
      case 'Equity':
          return process.env.REACT_APP_STATIC_URL + "media/DMF/01_equity.svg";
      case 'Debt':
          return process.env.REACT_APP_STATIC_URL + "media/DMF/02_debt.png";
      case 'Real Estate':
          return process.env.REACT_APP_STATIC_URL + "media/DMF/03_real_estate.png";
      case 'Liquid':
          return process.env.REACT_APP_STATIC_URL + "media/DMF/04_liquid.svg";
      case 'Alternate':
          return process.env.REACT_APP_STATIC_URL + "media/DMF/05_alternate.png";
      case 'Gold':
          return process.env.REACT_APP_STATIC_URL + "media/DMF/06_gold.png";
      case 'Other':
          return process.env.REACT_APP_STATIC_URL + "media/DMF/07_other.png";
      default:
          return process.env.REACT_APP_STATIC_URL + "media/DMF/01_equity.svg";
  }
}

const PortfolioCategory = (props) => {
  return (
    <>
      <div className={`d-flex align-items-center ${style.gridItem}`}>
        <div className={`d-none d-md-block ${style.clsName}`}>
          {/* <img  src={process.env.REACT_APP_STATIC_URL + "media/DMF/test_82.svg"} width={20} /> */}
          <img style={{ width: '29px' }} src={getImg(props.data.title)} alt="" />
        </div>
        <div className="px-3">
          <p className={`mb-0 ${style.clsN}`}>
            {props.data ? props.data.title : ""}
          </p>
          <p className={`mb-0 ${style.clsN1}`}>
            ₹ {props.data ? props.data.title_invested_value : ""}{" "}
            <span>{props.data ? props.data.title_percentage_value : ""}%</span>
          </p>
        </div>
        {props.data.title_percentage_value * 1 != 0 && (
          <a
            href={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/`}
          >
            <div>
              <FintooNext width={15} height={15} />
            </div>
          </a>
        )}
      </div>
    </>
  );
};

export default PortfolioCategory;
