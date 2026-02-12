import React from "react";
import Styles from "./Investplan/Investplan.style.module.css";
function Planofactionpopup(props) {
  return (
    <div>
      <div className="text-center">
        <p className="HeaderText">Disclaimer</p>
      </div>
      <div className={`${Styles.Content}`}>
        This is to inform you that by Clicking on the ‘I Agree’, you will be
        Leaving Fintoo and entering website operated by third parties. Fintoo
        does not control or endorse such third party website and is not
        responsible for its content and/or functionality. The use of such
        website is Subject to the applicable terms and conditions of such third
        party.
      </div>
      <div className={`${Styles.Buttons}`}>
        <div>
          {props.lifeins ? (
            <a
              className="text-decoration-none"
              href="/direct-mutual-fund/funds/all"
            >
              <button className="custom-background-color">I Agree</button>
            </a>
          ) : (
            <a
              className="text-decoration-none"
              href="/direct-mutual-fund/funds/all"
            >
              <button className="custom-background-color">I Agree</button>
            </a>
          )}
        </div>
        <div>
          <button onClick={props.onClose} className="custom-background-color">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Planofactionpopup;
