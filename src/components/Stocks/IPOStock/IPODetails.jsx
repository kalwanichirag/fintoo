import React, { useEffect, useState } from "react";
import Styles from "./style.module.css";
import IPOsection from "./IPOsection";
import IpoInvestbox from "./IpoInvestbox";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import Ipomodal from "./Ipomodal";
import { useParams } from "react-router-dom";
import { BASE_API_URL } from "../../../constants";
import { fetchData } from "../../../common_utilities";

function IPODetails(props) {
  const { ipocode } = useParams();
  const [ipoDetails, setIpoDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const [isInWishlist, setIsInWishlist] = useState(null);
  const onCloseModal = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    if (isInWishlist === true) {
    } else if (isInWishlist === false) {
    }
  }, [isInWishlist]);
  const tabs = ["Overview", "Subscription Rate", "IPO Financials", "Objective"];
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 116);
    });
  }, []);

  useEffect(() => {
    if (ipocode) {
      fetchIpoDetails();
    }
  }, [ipocode]);

  const fetchIpoDetails = async () => {
    try {
      let payload = {
        url: BASE_API_URL + "direct-mutual-fund/api/scheme/getipodetails",
        method: "post",
        data: {
          ipo_code: ipocode,
        },
      };
      const response = await fetchData(payload);
      if (response["error_code"] == "100") {
        setIpoDetails(response["data"][0]);
      } else {
        setIpoDetails([]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="container mt-md-5 mb-3">
      <div className="row">
        <div className="col-md-1">
          <div className="d-md-flex d-none align-items-md-center">
            <div className="p-5">
              <Link to={process.env.PUBLIC_URL + "/stocks/?page=ipo"}>
                <img
                  className="pointer"
                  src={`${
                    process.env.REACT_APP_STATIC_URL +
                    "media/MoneyManagement/Back.png"
                  }`}
                  alt="Back-button"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="mt-4">
            <IPOsection tabs={tabs} ipoDetails={ipoDetails} />
          </div>
        </div>
        <div className="col-md-3 ">
          <IpoInvestbox onOpenModal={onOpenModal} />
        </div>
      </div>
      <div className={`${Styles.Ipomodal}`}>
        <Modal open={open} showCloseIcon={false} center>
          <Ipomodal onCloseModal={onCloseModal} />
        </Modal>
      </div>
    </div>
  );
}

export default IPODetails;
