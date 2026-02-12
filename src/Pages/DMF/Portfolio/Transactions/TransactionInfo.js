import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ExploreStock from "../../../../components/HTML/ExploreStock";
import PortfolioLayout from "../../../../components/Layout/Portfolio";
import StepComponent from "./stepComponent";
import style from './style.module.css';
import axios from "axios";
import { DATA_BELONGS_TO, DMF_GET_MF_TRANSACTIONS_API_URL } from "../../../../constants";
import { getTransactionsHistory } from "../../../../FrappeIntegration-Services/services/investment-api/investmentService";
import {
    getUserId,
    getItemLocal,
    fetchEncryptData,
    indianRupeeFormat,
    fetchData,
} from "../../../../common_utilities";
import moment from "moment";
import FintooLoader from "../../../../components/FintooLoader";

const TransactionInfo = (props) => {

    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mfTransactions, setMfTransactions] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const transaction_id = useParams().transaction_id;
   
    const getMfTransactions = async (reset = false) => {
        try {
            setIsLoading(true);
            let payload = {
                user_id: "" + getUserId(),
                transaction_id: parseInt(transaction_id) || 0,
                data_belongs_to: DATA_BELONGS_TO
            };

            var results = await getTransactionsHistory(payload);
            
            if (results?.status_code == 200 && Array.isArray(results?.data)) {
                setMfTransactions(results.data);
            }else {
                setMfTransactions([]);
            }
        } catch (e) {
            setMfTransactions([]);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        getMfTransactions();
    }, []);

    const navigate = useNavigate();
    
    return (
        <>
            <PortfolioLayout>
                <FintooLoader isLoading={isLoading} />
                <div className={`${style.infoHeaderContainer}`}>
                    <span style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                        <div className="pointer" style={{ transform: 'rotate(180deg)' }} onClick={() => navigate(-1)}>
                            <ExploreStock />
                        </div>
                        <h3>Order Summary</h3>
                    </span>
                </div>
                {mfTransactions.length > 0 &&
                    mfTransactions.map((val) => (
                    <div key={val.user_transaction_id} className={`${style.infoContainer}`}>
                        <div style={{ padding: '1rem' }}>
                            <div className={`${style.transactionInfoContainer}`}>
                                <div className="fundNameTd">
                                    <div className="fundName9">
                                        <img
                                        src={`${process.env.REACT_APP_STATIC_URL}/media/companyicons/${val.amc_code}.png`}
                                        onError={(e) => {
                                          e.target.src = `${process.env.PUBLIC_URL}/static/media/companyicons/amc_icon.png`;
                                          e.onError = null;
                                        }}
                                      />                                    
                                        <span className={`${style.transactionInfoContainerTitle}`}>{val.s_name}</span>
                                    </div>
                                </div>
                                <div className={`${style.transactionInfoContainerAmountContainer}`}> 
                                    <span className={`${style.transactionInfoContainerAmount}`}>{indianRupeeFormat(val.cart_amount)} </span>
                                </div>
                            </div>
                            <div className={`${style.transactionInfoDataContainer}`}>
                                <div className={`${style.transactionInfoDataItemLeft}`}>
                                    <div className={`${style.transactionInfoDataItemLabel}`}>Transaction Type</div>
                                    <div className={`${style.transactionInfoDataItemLabelVal}`}>
                                        {val.user_transaction_type}
                                    </div>
                                </div>
                                <div className={`${style.transactionInfoDataItemRight}`}>
                                    <div className={`${style.transactionInfoDataItemLabel}`}>Transaction Date</div>
                                    <div className={`${style.transactionInfoDataItemLabelVal}`}>
                                        {moment(val.user_transaction_date).format("DD-MM-YYYY")}
                                    </div>
                                </div>
                                <div className={`${style.transactionInfoDataItemLeft}`}>
                                    <div className={`${style.transactionInfoDataItemLabel}`}>Folio</div>
                                    <div className={`${style.transactionInfoDataItemLabelVal}`}>
                                        {val.user_transaction_folio_no == 'new_folio' ? 'New Folio' : val.user_transaction_folio_no}
                                    </div>
                                </div>
                                <div className={`${style.transactionInfoDataItemRight}`}>
                                    <div className={`${style.transactionInfoDataItemLabel}`}>Bank Account</div>
                                    <div className={`${style.transactionInfoDataItemLabelVal}`}>{val.bank_acc_no}</div>
                                </div>
                                <div className={`${style.transactionInfoDataItemLeft}`}>
                                    <div className={`${style.transactionInfoDataItemLabel}`}>NAV</div>
                                    <div className={`${style.transactionInfoDataItemLabelVal}`}>
                                        {val.nav ? indianRupeeFormat(val.nav) : '-'}
                                    </div>
                                </div>
                                <div className={`${style.transactionInfoDataItemRight}`}>
                                    <div className={`${style.transactionInfoDataItemLabel}`}>Units</div>
                                    <div className={`${style.transactionInfoDataItemLabelVal}`}>{val.cart_units || '0'}</div>
                                </div>
                                <div className={`${style.transactionInfoDataItemLeft}`}>
                                    <div className={`${style.transactionInfoDataItemLabel}`}>NAV Date</div>
                                    <div className={`${style.transactionInfoDataItemLabelVal}`}>
                                        {val.nav_date && val.nav_date !== '-' ? moment(val.nav_date, "YYYY-MM-DD").format("DD-MM-YYYY") : '-'}
                                    </div>
                                </div>
                                <div className={`${style.transactionInfoDataItemRight}`}>
                                    <div className={`${style.transactionInfoDataItemLabel}`}>Purchased by</div>
                                    <div className={`${style.transactionInfoDataItemLabelVal}`}>{val.name || '-'}</div>
                                </div>
                                <div className={`${style.transactionInfoDataItemLeft}`}>
                                    <div className={`${style.transactionInfoDataItemLabel}`}>Order Amount</div>
                                    <div className={`${style.transactionInfoDataItemLabelVal}`}>{indianRupeeFormat(val.cart_amount)}</div>
                                </div>
                                <div className={`${style.transactionInfoDataItemRight}`}>
                                    <div className={`${style.transactionInfoDataItemLabel}`}>Order Id</div>
                                    <div className={`${style.transactionInfoDataItemLabelVal}`}>{val.bse_order_id || '0'}</div>
                                </div>
                                {val.cart_purchase_type === 'SIP' && (
                                    <>
                                    <div className={`${style.transactionInfoDataItemLeft}`}>
                                        <div className={`${style.transactionInfoDataItemLabel}`}>First SIP Date</div>
                                        <div className={`${style.transactionInfoDataItemLabelVal}`}>
                                            {val.cart_sip_start_date ? moment(val.cart_sip_start_date).format("DD-MM-YYYY") : '-'}
                                        </div>
                                    </div>
                                    <div className={style.transactionInfoDataItemRight}>
                                        <div className={style.transactionInfoDataItemLabel}>Mandate Id</div>
                                        <div className={style.transactionInfoDataItemLabelVal}>{val.transaction_mandate_id || '-'}</div>
                                    </div>
                                    </>
                                )}
                                {val.cart_purchase_type === 'P' && (
                                    <>
                                    <div className={style.transactionInfoDataItemLeft}>
                                        <div className={style.transactionInfoDataItemLabel}>Payment Mode</div>
                                        <div className={style.transactionInfoDataItemLabelVal}>{val.user_transaction_payment_mode || '-'}</div>
                                    </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={`${style.transactionInfoStepContainer}`}>
                            <div>
                                <StepComponent />
                            </div>
                        </div>
                    </div>
                ))}
                {mfTransactions.length > 0 && <div className={`${style.investmoreBtn}`}>
                    <Link to={`${process.env.PUBLIC_URL}/direct-mutual-fund/MutualFund/${mfTransactions[0]["schemecode"]}`}>
                        <button>Invest More</button>
                    </Link>
                </div>}
            </PortfolioLayout>
        </>
    );
};

export default TransactionInfo;
