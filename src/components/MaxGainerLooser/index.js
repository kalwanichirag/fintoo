import { useEffect, useState } from "react";
import style from "./style.module.css";
import { indianRupeeFormat } from "../../common_utilities";

const TableData = (props) => {
  
  return (
    <>
    <td className={style.table_data}>
    <div className="d-flex align-items-center">
      <div className={style.icon}>
        <img width={30} src={`${process.env.REACT_APP_STATIC_URL}/media/companyicons/${props.data.amc_code}.png`} style={{borderRadius:"50%"}}/>
      </div>
      <a href={`${process.env.PUBLIC_URL}/direct-mutual-fund/MutualFund/${props.data.slug}`} style={{textDecoration: "none"}}>
        <div className={style.boldText}>{props.data.scheme}</div>
      </a>
    </div>
    </td>
    {props?.data?.day_change_perc > 0 ? (
      <td className={style.boldText}>
        <span className={style.boldText}> {props?.data?.curr_nav ? indianRupeeFormat(props?.data?.curr_nav) : "-"}</span><span className={style.greenText}> ({props.data.day_change_perc}%)</span>
      </td>
    ) : (
      <td className={style.boldText}>
        <span className={style.boldText}> {props?.data?.curr_nav ? indianRupeeFormat(props?.data?.curr_nav) : "-"} </span><span className={style.redText}>({props.data.day_change_perc}%)</span>
      </td>
    ) 
    }
    <td className={style.boldText}>{props?.data?.curr_val ? indianRupeeFormat(props.data.curr_val) : "-"}</td>
    </>
  );
};

const MaxGainerLooser = (props) => {
  const [activeButton, setActiveButton] = useState("fund");
  const [gainer, setGainer] = useState(true);
  const [data, setData] = useState({});
  
  useEffect(()=> {
    if (gainer) {
      setData(props?.gainerData);
    } else {
      setData(props?.loserData);
    }
  }, [gainer, props]);
  useEffect(() => {
  if (!data || !data.length) return;

  const dayChangePerc = `${data[0]?.day_change_perc}%`;

  if (window.webengage) {
    window.webengage.user.setAttribute(
      "Day Change Percentage",
      dayChangePerc
    );
  }

}, [data]);


  return (
    <>
      <div>
        <p className={style.boxtitle}>Max Gainer | Loser</p>
        <div className="d-flex align-items-center justify-content-between py-4">
          <div className="d-flex align-items-center">
            <div className={style.btn_con}>
              <p
                onClick={() => {
                  setActiveButton("fund");
                }}
                className={`mb-0 ${style.button} ${
                  activeButton == "fund" ? style.active : ""
                }`}
              >
                Mutual Fund
              </p>
            </div>
            {/* <div className={style.btn_con}>
              <p
                onClick={() => {
                  setActiveButton("stocks");
                }}
                className={`mb-0 ${style.button} ${
                  activeButton == "stocks" ? style.active : ""
                }`}
              >
                Stocks
              </p>
            </div> */}
          </div>
          <div>
            <p className={`mb-0 ${style.button}`} onClick={()=> setGainer((v)=> !v)}>
              {gainer ? 'Gainer' : 'Loser'} &nbsp;&nbsp;<i class="fa-solid fa-filter"></i>
            </p>
          </div>
        </div>

        {data.length > 0 ? (
          <table className={` table`}>
            <thead className={style.header}>
              <tr>
                <th>Scheme Name</th>
                <th>NAV & Day Change </th>
                <th>Curr Valuation</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item)=> (
                <tr>
                  <TableData data={item}/>
                </tr>
              ))}
            </tbody>
          </table>
        ) : 
        <p style={{textAlign: "center", fontSize: "2em"}}>Nothing to show here.</p>}
      </div>
    </>
  );
};
export default MaxGainerLooser;
