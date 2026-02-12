import React, { useState } from "react";
import Styles from "./style.module.css";

function ServiceCard(props) {
  const [open2, setOpen2] = useState(false);

  const handleStartClick = () => {
    setOpen2(true);
  };
  return (
    <div className={`${Styles.card} mt-4 mb-4 `} onClick={handleStartClick}>
      <div className={Styles.cardBox}>
        <div className={Styles.cardHover}>
          <p>
            Minty uses cutting edge Artificial intelligence technology to best
            gauge your financial situation. The foundation of your future
            security lies in the steps you take today - let Minty guide you in
            the right direction.
          </p>
          <div>
            <button
              className="btn mybtn default-btn"
              onClick={() => {
                props.onClick();
                setTimeout(() => {
                  setOpen2(false);
                }, 2000);
              }}
            >
              Start
            </button>
          </div>
        </div>
        <img
          className={`card-img-top ${Styles.cardImgTop}`}
          src={props.image}
          alt="Card cap"
          width="300"
        />
        <div className={Styles.cardBody}>
          <h5 className="card-title">{props.title}</h5>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
