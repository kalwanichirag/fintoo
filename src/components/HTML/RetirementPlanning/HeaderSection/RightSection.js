import styles from "./style.module.css";
const RightSection = (props) => {
  return (
    <>
      <div
        className={`${styles["header-section-image-container"]} ${styles.animated} ${styles.animatedFadeInUp} ${styles.fadeInUp} `}
      >
         <img  src={process.env.REACT_APP_STATIC_URL + 'media/wp/Rpplan/retirement.svg'} alt="" />
      </div>
    </>
  );
};
export default RightSection;
