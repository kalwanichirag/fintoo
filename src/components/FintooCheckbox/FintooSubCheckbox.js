
// import Checked from "./SubCheck2.png";
// import Unchecked from "./SubCheck1.png";
import './style.css';
import Unchecked from "./SubCheck1.png";
import Checked from "./SubCheck2.svg";
import { imagePath } from "../../constants";

const FintooCheckbox = (props) => {
    return (
        <div className="fintoo-checkbox" onClick={()=> props.onChange()}>
            <img 
                src={props.checked ? imagePath + Checked : Unchecked} />
            <div className="fc-title">{props.title}</div>
        </div>
    );
}

export default FintooCheckbox;
