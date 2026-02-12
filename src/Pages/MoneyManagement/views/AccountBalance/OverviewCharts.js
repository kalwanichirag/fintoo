import Styles from "../../moneymanagement.module.css";
import OverviewChart from "../../components/OverviewCharts/OverviewChart";
import MonthPicker from "../../components/MonthPicker";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import commonEncode from "../../../../commonEncode";
import { getMemberId, getUserId } from "../../../../common_utilities";
import { useEffectAfterInitialRender } from "../../../../Utils/Hooks/LifeCycleHooks"
import { Link } from "react-router-dom";
import { findLargestDate, findSmallestDate, findSmallesttDate } from "../../utils/DateUtils";
import { fetchTrackedBankDetails as fetchTrackedBankDetailsFun, analysePastData as analysePastDataFun } from "../../../../FrappeIntegration-Services/services/money-management-api/moneyManagementService";



const getChartViewLabels = (label) => {
    switch (label) {
        case 'INFLOW':
            return 'Gross Inflow'
        case 'OUTFLOW':
            return 'Gross Outflow'
        case 'INVESTMENT':
            return 'Gross Investment'
        default:
            return 'Overview';
    }
}

const OverviewCharts = () => {

    const [chartViewData, setChartViewData] = useState([])
    const [accounts, setAccounts] = useState([]);
    const [currentChartView, setCurrentChartView] = useState('DEFAULT')

    const [filterData, setFilterData] = useState({
        date: new Date(),
        account: "All Account",
        startDate: new Date(),
        endDate: new Date(),
        MinDate: new Date()
    })

    const [isOpen, setIsOpen] = useState(false);

    const linkedAccountData = useSelector((state) => state.linkedAccountData);

    const getMemberIdFn = () => {
        let isFamilySelected = Boolean(localStorage.getItem("family"));
        if (!isFamilySelected) {
            const userId = getUserId();
            const userIdArray = [userId];
            return userIdArray;
        } else {
            let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
            const idsArray = users.map(item => String(item.id));
            return idsArray;
        }
    };

    const getCurrentMonthAndYear = (date) => {
        const currentDate = date;
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();

        return `${month}${year}`;
    };


    const FetchTrackedBankDetails = async (fromDate, toDate, bank_accounts) => {
        const user_id = getMemberIdFn();
        // var myHeaders = new Headers();
        const payload = {
            user_id: user_id,
            fromDate: fromDate,
            bank_accounts: bank_accounts,
            toDate: toDate
        };
        try {
            const result = await fetchTrackedBankDetailsFun(payload);
            if (result["status_code"] == 200) {
                if (result["data"].length === 0) {
                    navigate('/commondashboard');
                }
                setChartViewData(result["data"]["total_overview_data"]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAccountSelection = () => {
        const fromDate = getCurrentMonthAndYear(filterData.startDate);
        const toDate = getCurrentMonthAndYear(filterData.endDate);
        const selectedAccountIds = filterData.account === "All Account" ? accounts.map(account => account.mm_account_masked_id) : [filterData.account];
        FetchTrackedBankDetails(fromDate, toDate, selectedAccountIds);
    };

    useEffect(() => {

        if (linkedAccountData && linkedAccountData.length > 0) {

            const flattenedAccounts = linkedAccountData.flat();

            const updatedAccounts = flattenedAccounts.map((account) => {
                return {
                    bankLogo: account.mm_bank_logo,
                    mm_fip_name: account.mm_fip_name,
                    mm_account_masked_id: account.mm_account_masked_id,
                    mm_last_updated: account.mm_last_updated,
                    mm_total_balance: account.mm_total_balance,
                    mm_consent_id: account.mm_consent_id,
                    mm_user_id: account.mm_user_id,
                    mm_daterange_from: account.mm_daterange_from
                };
            });

            setAccounts(updatedAccounts);

            const dateArr = filterData.account === "All Account" ? updatedAccounts.map(data => data.mm_daterange_from) : updatedAccounts.filter(data => data.mm_account_masked_id === filterData.account).map(data => data.mm_daterange_from);
            const minDate = findSmallestDate(dateArr);
            const smallestDate = new Date(minDate)
            setFilterData(prev => ({ ...prev, startDate: smallestDate, MinDate: smallestDate }))
        } else {
        }
    }, [linkedAccountData]);

    useEffectAfterInitialRender(() => {
        if (filterData.endDate === null) return;
        handleAccountSelection()
    }, [accounts, filterData])

    const getsmallesrDate = () => {
        const dateArr = filterData.account === "All Account" ? accounts.map(data => data.mm_daterange_from) : accounts.filter(data => data.mm_account_masked_id === filterData.account).map(data => data.mm_daterange_from);
        const minDate = findSmallestDate(dateArr);
        return minDate;
    }

    const handleAccountChange = (accountName) => {
        const smallestDate = new Date(getsmallesrDate())
        setFilterData(prev => ({ ...prev, account: accountName, startDate: smallestDate, MinDate: smallestDate }))
    }

    return (
        <div>
            {/* <div className={`${Styles.OptionsContainer}`}> */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 'bold' }}>
                        Track By:
                    </div>
                    <div className={`${Styles['fltr-section']} ${Styles.OverviewTitleContainer}`}>
                        <div className={`${Styles['styled-select']} `} style={{ width: '200px' }} >
                            <div>
                                {filterData.account}
                            </div>
                            <span className={`${Styles['fa-sort-desc']}`}></span>
                        </div>
                        <div className={`${Styles.OverviewTitleItemsContainer}`} style={{ width: '100%', borderRadius: '5px', backgroundColor: 'white', padding: '0.3rem 0' }}>
                            <div onClick={() => handleAccountChange('All Account')} className={`${Styles.OverviewTitleItem}`} style={{ padding: '0.5rem 1rem' }}>All Account</div>
                            {accounts.map((data, index) => (
                                <div key={index} onClick={() => handleAccountChange(data.mm_account_masked_id)} className={`${Styles.OverviewTitleItem}`} style={{ padding: '0.5rem 1rem' }}>{data.mm_account_masked_id}</div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`${Styles['fltr-section']} ${Styles.OverviewTitleContainer}`}>
                    <div style={{ fontWeight: 'bold' }}>
                        Filter By:
                    </div>
                    <div className={`${Styles['styled-select']} `} style={{ width: '200px' }} >
                        <div>
                            {getChartViewLabels(currentChartView)}
                        </div>
                        <span className={`${Styles['fa-sort-desc']}`}></span>
                    </div>
                    <div className={`${Styles.OverviewTitleItemsContainer}`} style={{ width: '100%', borderRadius: '5px', backgroundColor: 'white', padding: '0.3rem 0' }}>
                        <div onClick={() => setCurrentChartView('DEFAULT')} className={`${Styles.OverviewTitleItem}`} style={{ padding: '0.5rem 1rem' }}>Overview</div>
                        <div onClick={() => setCurrentChartView('INFLOW')} className={`${Styles.OverviewTitleItem}`} style={{ padding: '0.5rem 1rem' }}>Gross Inflow</div>
                        <div onClick={() => setCurrentChartView('OUTFLOW')} className={`${Styles.OverviewTitleItem}`} style={{ padding: '0.5rem 1rem' }}>Gross Outflow</div>
                        <div onClick={() => setCurrentChartView('INVESTMENT')} className={`${Styles.OverviewTitleItem}`} style={{ padding: '0.5rem 1rem' }}>Gross Investment</div>
                    </div>
                </div>

                <div style={{ marginBottom: '-0.5rem' }}>
                    <div style={{ fontWeight: 'bold' }}>
                        Month Range:
                    </div>
                    <MonthPicker
                        onInputClick={() => setIsOpen(true)}
                        // minDate={new Date("01-01-2021")}
                        minDate={new Date(filterData.MinDate)}
                        maxDate={new Date()}
                        onChange={(date) => {
                            // if (date[1] != undefined) {
                            setFilterData(prev => ({ ...prev, date: date[0], startDate: date[0], endDate: date[1] }))
                            if (date[1]) {
                                setIsOpen(false);
                            }
                            // }
                        }}
                        selected={filterData.startDate}
                        selectsRange
                        startDate={filterData.startDate}
                        endDate={filterData.endDate}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        open={isOpen}
                    />
                </div>
            </div>
            {/* </div> */}
            <br />
            <div>
                {
                    currentChartView == 'DEFAULT' && <OverviewChart chartData={chartViewData} chartKey={'Gross_data'} changeView={setCurrentChartView} />
                }
                {
                    currentChartView == 'INFLOW' && <OverviewChart chartData={chartViewData} chartKey={'income_cat'} title={'Inflow Overview'} backFun={() => setCurrentChartView('DEFAULT')} colColor='#042b62' />
                }
                {
                    currentChartView == 'OUTFLOW' && <OverviewChart chartData={chartViewData} chartKey={'expense_cat'} title={'Outflow Overview'} backFun={() => setCurrentChartView('DEFAULT')} colColor='#5b85f5' />
                }
                {
                    currentChartView == 'INVESTMENT' && <OverviewChart chartData={chartViewData} chartKey={'investment'} title={'Outflow Overview'} backFun={() => setCurrentChartView('DEFAULT')} colColor='#8fadff' />
                }
                {/* <br /> */}
                {
                    currentChartView != 'DEFAULT' &&
                    <Link to={`${process.env.PUBLIC_URL}/money-management/map-transactions`} style={{ textDecoration: 'none' }}>
                        <div
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                padding: '1rem 0',
                                backgroundColor: '#042b62',
                                borderRadius: '10px',
                                color: '#FFF',
                                fontSize: '1rem',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginTop: '1rem',
                                textDecoration: 'none'
                            }}
                        >
                            View all Categories
                        </div></Link>

                }

            </div>

        </div>
    );
};
export default OverviewCharts;

