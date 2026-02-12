
import Checked from "./radio-on-button.svg";
import Unchecked from "./radio-off-button.svg";
import styles from "./style.module.css";


const FintooRadio2 = (props) => {
    const readOnly = props.readOnly !== undefined ? props.readOnly : false;

    return (
        <div style={{cursor : `${readOnly ? "none" : "pointer"}`, pointerEvents : `${readOnly ? "none" : ""}` }} className={styles.radio} onClick={()=> props.onClick()}>
            <img src={props.checked ? Checked : Unchecked} />
            <div className="fc-title">{props.title}</div>
        </div>
    );
}

export default FintooRadio2;
