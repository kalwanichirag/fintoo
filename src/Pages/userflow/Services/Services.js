import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Styles from "./Services.module.css";
import Modal from "react-bootstrap/Modal";
function Services() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    document.body.classList.remove("dg-layout");
  
  }, []);
  return (
    <div>
      <div className={`row pt-md-5 ${Styles.planingsection}`}>
        <div className="col-md-5 mt-md-4">
          <p className={`${Styles.Text}`}>Choose Your Plan</p>
          <div className={`${Styles.PlanningBox}`}>
            <div className={`${Styles.planType}`}>Financial Planning</div>
            <div className={`${Styles.PickUP}`}>
              <button onClick={handleShow}>Pick UP</button>
            </div>
          </div>
          <div className={`${Styles.PlanningBox}`}>
            <div className={`${Styles.planType}`}>Retirement Planning</div>
            <div className={`${Styles.PickUP}`}>
              <Link to={process.env.PUBLIC_URL + "/retirement-planning-page/"}>
                <button>Pick UP</button>
              </Link>
            </div>
          </div>
          <div className={`${Styles.PlanningBox}`}>
            <div className={`${Styles.planType}`}>Tax Planning</div>
            <div className={`${Styles.PickUP}`}>
              <Link to={process.env.PUBLIC_URL + "/tax-planning-page/"}>
                <button>Pick UP</button>
              </Link>
            </div>
          </div>
          <div className={`${Styles.PlanningBox}`}>
            <div className={`${Styles.planType}`}>Investment Planning</div>
            <div className={`${Styles.PickUP}`}>
              <Link to={process.env.PUBLIC_URL + "/investment-planning-page/"}>
                <button>Pick UP</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Modal  show={show} centered onHide={handleClose}>
        <Modal.Body className={`${Styles.modalcontent}`}>
          <p className={`${Styles.modalHead}`}>Disclaimer</p>
          <p className={`${Styles.TextBox}`}>
            In order to generate your customised financial planning report. If
            you have already completed the Data Gathering Process, you can view
            the report and download it.
          </p>
          <div className={`d-flex ${Styles.PickUP}`}>
          <Link to={process.env.PUBLIC_URL + "/datagathering/about-you/"}>  <button>Go To Datagathering</button></Link>
          <Link to={process.env.PUBLIC_URL + "/commondashboard/"}>  <button className="ms-3">View Report</button></Link>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}

export default Services;
