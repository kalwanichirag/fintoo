import React from "react";
import CustomBar from '../Graph/CustomBar'
const Assets = (props) => {
  return <div className="Assets">
    <div>
      {/* <h4>Asset Allocation</h4>  */}
      <CustomBar data={props.data} />
    </div>
    {props.equity * 1 != 0 ?
    (<div className="Sector child-section-asset">
      <h4>Sector Allocation</h4>
      <div className="Sector_All">
      { (props.asset_alloc).length > 0 ? ((props.asset_alloc).map((item)=>(
        <div >
        {item.sector_name !== '' ? item.sector_name : 'Others'}
          <span style={{ float: "right", color: "gray" }}>{item.sector_percentage}%</span>
          <div className="range-outer"><div className="range-inner" style={{width: item.sector_percentage + '%'}}></div></div>
        </div>
        ))):(
          <p> NA </p>
        )}
          </div>
    </div>):(<></>)}
  </div>;
};
export default Assets;