import styles from "./style.module.css";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../HTML/Footer";
import Logo from "../../Assets/Images/logo.svg";
import { useEffect } from "react";
import { GrFormClose } from "react-icons/gr";
import { fetchData } from "../../common_utilities";

export function ThankyouSectionInline() {

  return (
    <>
      <section >
        <div className={`${styles.ThanksBox}`} style={{ width: '100%', margin: '0' }}>
          <div className={`${styles.Logo}`}>
            <img
              src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
            />
          </div>
          <br />
          <div className={`${styles.ThankyouTextInline}`} >Thank You for Registering with Fintoo.</div>
          <div className={`${styles.ThanksubTextInkine}`} >
            We appreciate you taking the time to connect with us.
          </div>
          <div className={`${styles.ThanksubTextInkine}`} style={{ fontWeight: '600', fontSize: '1.7rem' }}>
            What’s Next?
          </div>
          <div className={`${styles.ThanksubTextInkine}`}>
            Keep an eye on your inbox—we’ll send you a detailed response shortly to ensure you get the most out of our services.
          </div>
          <div className={`${styles.ThanksubTextInkine}`} style={{ fontWeight: '600' }}>
            We’re excited to work with you and help you achieve your goals. In the meantime, feel free to explore our website and discover more about what we offer.
          </div>
          <br />
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '0.5rem 1rem', fontSize: '1.5rem', fontWeight: '600', color: 'white', backgroundColor: '#042b62', borderRadius: '7px' }}>
              Explore Now
            </div>
          </Link>

        </div>
      </section>
    </>
  );
}

export function CustomPopupSection({ onClose, ActionFun, message, btnTxt }) {

  return (
    <>

      <section className={`${styles["Thankyou-Section"]}`}>
        <div className={`${styles.ThanksBox}`}>
          <div
            className={`${styles.closeIcon}`}
            onClick={() => onClose()}
          >
            <GrFormClose />
          </div>

          <div className={`${styles.ThanksubText}`}>
            {message}
          </div>
          {/* <div className={`${styles.ThankMsg}`}>
            Our Expert will get in touch with you shortly.
          </div> */}
          <br />
          <div style={{ padding: '0.5rem 1rem', fontSize: '1.5rem', fontWeight: '600', color: 'white', backgroundColor: '#042b62', borderRadius: '7px', cursor: 'pointer' }} onClick={() => ActionFun()}>
            {btnTxt}
          </div>
        </div>
      </section>
    </>
  );
}

function ThankyouSection({ onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);
  return (
    <>

      <section className={`${styles["Thankyou-Section"]}`}>
        <div className={`${styles.ThanksBox}`}>
          <div
            className={`${styles.closeIcon}`}
            onClick={() => (onClose ? onClose() : navigate(-1))}
          >
            <GrFormClose />
          </div>
          <div className={`${styles.Logo}`}>
            <img
              src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
            />
          </div>
          <div className={`${styles.ThankyouText}`}>Thank you</div>
          <div className={`${styles.ThanksubText}`}>
            We have successfully received your details.
          </div>
          <div className={`${styles.ThankMsg}`}>
            Our Expert will get in touch with you shortly.
          </div>
        </div>
      </section>
    </>
  );
}

export default ThankyouSection;
