import { useEffect, useState } from "react";
import Styles from '../../moneymanagement.module.css';
const Snippet = () => {

    return (
        <>
            <div className={`${Styles.downloadview}`}>
                <div className={`${Styles.Headtitle}`}>
                    Your money management report is ready to download
                </div>
                <div className={`${Styles.ButtonBox}`}>
                    <button className="d-flex align-items-center">
                        <span>Download now</span>
                        <span>
                            <img width={30} className='pointer ms-2' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/Download.svg"}`} alt="Download" />
                        </span>
                    </button>
                    <button className="d-flex align-items-center">
                        <span>Send on Email</span>
                        <span>
                            <img width={30} className='pointer ms-2' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/Mail.svg"}`} alt="Mail" />
                        </span>
                    </button>
                    <button className="d-flex align-items-center"><span>Send on WhatsApp</span>
                        <span>
                            <img width={30} className='pointer ms-2' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/WP.svg"}`} alt="WhatsApp" />
                        </span> </button>
                </div>
            </div>
        </>
    );
};
export default Snippet;
