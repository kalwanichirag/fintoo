import styles from "./style.module.css";

const ProfileSubmenuItem = ({text, className = "", image, roundedImage = false, onMemberClick}) => (
    <div className={`pointer ${className}  ${styles.card}`} onClick={onMemberClick}>
      <div className={`${styles['card-in-1']} d-flex align-items-center`}>
        <div className="pe-3">
          <img className={`${ roundedImage ? 'rounded-circle' : '' }`} src={image ? image : require("./images/account.png")} width={25} />
        </div>
        <div>
          <p className={styles.membername}>{text.includes("#m") ? <><span>{text.replace("#m", "")}</span><span className={styles["minor-overlay"]}>Minor</span></> : text}</p>
        </div>
      </div>
    </div>
  );

export default ProfileSubmenuItem;
