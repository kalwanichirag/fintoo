
import { IoChevronBackCircleOutline } from "react-icons/io5";
const FintooBackButton = (props) => {
    
    return (
        <div
            onClick={() => props.onClick()}
            type="Submit"
        >
            <IoChevronBackCircleOutline className="btn-fintoo-back" />
        </div>
    );
}
export default FintooBackButton;