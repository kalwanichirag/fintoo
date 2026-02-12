import React, { useEffect, useState } from 'react'
import Styles from "../Stocks/IPOStock/style.module.css";
import { FaShareAlt, FaRegBookmark } from "react-icons/fa";
import BondSection from './BondSection';
import IpoInvestbox from '../Stocks/IPOStock/IpoInvestbox';
import Modal from "react-responsive-modal";
import Bondinvestpopup from "./Bondinvestpopup";
import Bondrightpanel from './Bondrightpanel';
function BondsDetails() {
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isWish, setIsWish] = useState(false);
    const [style, setStyle] = useState("cont");
    const [style2, setStyle2] = useState("cont");
    const [isInWishlist, setIsInWishlist] = useState(null);
    const handleTogglewish = () => {
      setIsWish((prevState) => !prevState);
    };
    const handleToggle = () => {
      setIsOpen((prevState) => !prevState);
    };
    const onCloseModal = () => {
      setOpen(false);
    };
    const changeStyle = () => {
      setIsInWishlist(!isInWishlist);
      setStyle("cont3");
    };
    React.useEffect(() => {
      if (isInWishlist === true) {
      } else if (isInWishlist === false) {
      }
    }, [isInWishlist]);
    const tabs = ["Highlights", "Key Metrics", "Comparison"];
    const [scroll, setScroll] = useState(false);
    useEffect(() => {
      window.addEventListener("scroll", () => {
        setScroll(window.scrollY > 116);
      });
    }, []);
  return (
    <div className="container mt-md-5 mb-3">
    <div className="row">
      <div className="col-md-8">
        <div>
          <div className="mt-4">
            <BondSection tabs={tabs} />
          </div>
        </div>
        {/* <div
          className={scroll ? `${Styles.borderRdRemove}` : ""}
          style={{
            zIndex: "999",
          }}
        >
          <Bondinfo />
        </div> */}
      </div>
      <div className="col-md-4 ">
        <Bondrightpanel />
        {/* <IpoInvestbox onOpenModal={onOpenModal} /> */}
      </div>
    </div>
    <div className={`${Styles.Ipomodal}`}>
      <Modal animationDuration={0} open={open} showCloseIcon={false} center>
        <Bondinvestpopup onCloseModal={onCloseModal} />
      </Modal>
    </div>
  </div>
  )
}

export default BondsDetails