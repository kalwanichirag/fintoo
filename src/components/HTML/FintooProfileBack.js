
import { IoChevronBackCircleOutline } from "react-icons/io5";
const FintooProfileBack = (props) => {
    
    return (
        <div className="panel-heading-bx">
          {/* <!-- FintooProfileBack--> */}
            {Boolean(props.onClick) == true && (<span className="panel-back-btn">
              <div
                onClick={() => props.onClick()}
                type="Submit"
              >
                <IoChevronBackCircleOutline className="btn-fintoo-back" />
              </div>
            </span>)}
            <h4 className="">{props.title}</h4>
          </div>
    );
}
export default FintooProfileBack;