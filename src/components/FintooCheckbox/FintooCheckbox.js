
import Checked from "./check_01.svg";
import Unchecked from "./check_mark_02.svg";
import { imagePath } from "../../constants";

import './style.css';

const FintooCheckbox = (props) => {
    return (
        <div className="fintoo-checkbox" onClick={()=> props.onChange()}>
            <img src={props.checked ? Checked : Unchecked} />
            {/* <img src={props.checked ?  imagePath + "/static/assets/img/check_mark.svg" : Unchecked} /> */}
            <div className={(props.title == "AMC") ? "fc-title-amc" : "fc-title"}>{props.title}</div> 
        </div>
    );
}

export default FintooCheckbox;
