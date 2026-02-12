import { useState } from "react";
import CustomBar from '../Graph/CustomBar'
const Sector = props => {
 

  return (

    <div className="Sector child-section">
       <CustomBar data={props.data} asset_allo = {props.asset_alloc} />
      {/* <div className="Sector_All">
        <div >
          Bank
          <span style={{ float: "right", color: "gray" }}>15.37%</span>
          <br />
          <input  type="range" value="15.37" max="50" min="0" />
        </div>
        <div>
          Crude Oil
          <span style={{ float: "right", color: "gray" }}>6.37%</span>
          <br />
          <input  type="range" value="6.37" max="50" min="0" />
        </div>
        <div>
          Healthcare
          <span style={{ float: "right", color: "gray" }}>5.19%</span>
          <br />
          <input  type="range" value="5.19" max="50" min="0" />
        </div>
        <div>
          Logistics
          <span style={{ float: "right", color: "gray" }}>3.19%</span>
          <br />
          <input  type="range" value="3.19" max="50" min="0" />
        </div>
        <div>
          Non - Ferrous Metals
          <span style={{ float: "right", color: "gray" }}>2.76%</span>
          <br />
          <input  type="range" value="2.76" max="50" min="0" />
        </div>
        <div>
          Finance
          <span style={{ float: "right", color: "gray" }}>13.27%</span>
          <br />
          <input  type="range" value="13.27" max="50" min="0" />
        </div>
        <div>
          Iron Steel
          <span style={{ float: "right", color: "gray" }}>6.20%</span>
          <br />
          <input  type="range" value="6.20" max="50" min="0" />
        </div>
        <div>
          IT <span style={{ float: "right", color: "gray" }}>3.97%</span>
          <br />
          <input  type="range" value="3.97" max="50" min="0" />
        </div>
        <div>
          Telecom
          <span style={{ float: "right", color: "gray" }}>2.99%</span>
          <br />
          <input  type="range" value="2.99" max="50" min="0" />
        </div>
      </div> */}
    </div>
  );
};
export default Sector;