import React, { useState, useEffect, useRef } from 'react';
import style from '../../style.module.css';
import { Form, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import commonEncode from "../../../../commonEncode";
import * as toastr from "toastr";
import {
  apiCall,
  getMemberId,
  getUserId
} from '../../../../common_utilities';
import SavingAccountInfoSection from '../../components/SavingAccountCommonDashboardUi/SavingAccountInfoSection';
import { BiFilter } from 'react-icons/bi';
import TabElement from '../../components/TabElement/TabElement';
import ReactPaginate from 'react-paginate';
import MapTransactionFilterPanel from '../Filter/MapTransactionFilterPanel';
import { indianRupeeFormat } from '../../../../common_utilities';
import { useEffectAfterInitialRender } from '../../../../Utils/Hooks/LifeCycleHooks';
import TransactionAccordion from './TransactionAccordion';
import { getInflowCheckedTransactions, getOutflowCheckedTransactions, modifyCreditDebit } from './transactionObjUpdate';
import _ from 'lodash'
import { fetchTrackedBankDetails as fetchTrackedBankDetailsFun, fetchTransactions, getCategoryList, mapTransactions } from '../../../../FrappeIntegration-Services/services/money-management-api/moneyManagementService';

const formatDateMonthStr = (datestr) => {
  // const d = new Date(datestr);
  // const year = d.getFullYear();
  // const month = (d.getMonth() + 1).toString().padStart(2, '0');
  // return `${year}-${month}`;

  const d = new Date(datestr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based index
  const day = String(d.getDate()).padStart(2, '0');

  return `${month}${year}`;
}

const formatDateStr = (datestr) => {
  // const d = new Date(datestr);
  // const year = d.getFullYear();
  // const month = (d.getMonth() + 1).toString().padStart(2, '0');
  // return `${year}-${month}`;

  const d = new Date(datestr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based index
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isDateLessThan(date1, date2) {
  const [year1, month1] = date1.split('-').map(Number);
  const [year2, month2] = date2.split('-').map(Number);

  if (year1 < year2) {
    return true;
  } else if (year1 === year2 && month1 <= month2) {
    return true;
  }

  return false;
}

function isDateGreaterThan(date1, date2) {
  const [year1, month1] = date1.split('-').map(Number);
  const [year2, month2] = date2.split('-').map(Number);

  if (year1 > year2) {
    return true;
  } else if (year1 === year2 && month1 >= month2) {
    return true;
  }

  return false;
}

function isSameYearAndMonth(date1, date2) {
  const [year1, month1] = date1.split('-').map(Number);
  const [year2, month2] = date2.split('-').map(Number);

  return year1 === year2 && month1 === month2;
}

const initialFilterStateData = {
  entryType: "CREDIT",
  mappingStatus: 'Unmapped',
}

const initialFilterStateStateData = {

  inflowCategories: [],
  outflowCategories: [],
  TransactionMonth: null,
  startDate: null,
  endDate: null

}



const BankAccountDataTransactionTableView = () => {

  const transactionsTable = useRef(null)

  const [accordionArr, setAccordionArr] = useState([]);

  const [allTransactionsObj, setAllTransactionsObj] = useState({
    mapped: {},
    unmapped: {}
  });

  const [finalTransactionsTwo, setFinalTransactionsTwo] = useState([]);

  const [paginationData, setPaginationData] = useState({
    currentPageNo: 0,
    recordsPerPage: 10
  })

  const [totalPages, setTotalPages] = useState(0)

  const [filterStateData, setFilterStateData] = useState(initialFilterStateData)
  const [filterSliderStateData, setFilterSliderStateData] = useState(initialFilterStateStateData)

  const [show, setShow] = useState(false);
    const location = useLocation(); 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchTxnDataAccount = useSelector((state) => state.fetchTxnDataAccount)


  const [mappedCategoryList, setMappedCategoryList] = useState([]);
  const [totalBankAcc, setTotalBankAcc] = useState(0);
  const [totalBankbalance, setTotalBankBalance] = useState(0);
  const [dashboardData, setDashboardData] = useState("");
  const [allllAccountData, setAllAccountData] = useState(null);
  const [currentUserIds, setCurrentUserIds] = useState([]);


  let totalBalance = 0;
  let accountNumbers = [];
  let user_details = [];
  let user_contact = [];

  const [transactionOptions, setTransactionOptions] = useState({
    expense_cat: {},
    income_cat: {}
  });
  const [activeBank, setActiveBank] = useState("");

  const [isFilterPanelActive, setIsFilterPanelActive] = useState(false);

  const applyDateAndCategoryFilter = async (categories, fromDate, toDate) => {
    const user_info = getMemberIdFn();

    const payloadData = {
      category: categories,
      fromDate: fromDate == toDate ? null : formatDateMonthStr(fromDate),
      toDate: fromDate == toDate ? null : formatDateMonthStr(toDate)
    }

    if (fetchTxnDataAccount.length !== 0) {
      await FetchAccountTransactionsAPI(user_info, [activeBank], allllAccountData, payloadData);
    } else {
      await FetchAccountTransactionsAPI(user_info, [activeBank], allllAccountData, payloadData);
    }

  }

  const FetchAccountTransactionsAPI = async (user_id, bank_accounts, trackedAccountsData, payloadData = null) => {

    let userIdForAccount = undefined;

    const currAccount = trackedAccountsData ? trackedAccountsData?.filter(data => data.mm_account_masked_id == bank_accounts[0]) : undefined;

    userIdForAccount = currAccount ? currAccount[0]?.mm_user_id : undefined;

    // var myHeaders = new Headers();
    const payload = {
      "user_id": userIdForAccount ?? parseInt(user_id),
      "bank_accounts": bank_accounts
    };

    if (payloadData) {
      if (payloadData.category.length > 0) {
        payload["category"] = payloadData.category
      }

      if (payloadData.fromDate !== null && payloadData.toDate !== null) {
        payload["fromDate"] = payloadData.fromDate
        payload["toDate"] = payloadData.toDate
      }
    }

    // myHeaders.append("Content-Type", "application/json");
    try {
      let result = await fetchTransactions(payload)


      // let result = JSON.parse(JSON.stringify(dummyData));

      if (result["status_code"] === 200) {

        result = modifyCreditDebit(result["data"]);

        setAllTransactionsObj(prev => ({
          ...prev, mapped: _.isEmpty(result["mapped_data"]) ? {
            CREDIT: [],
            DEBIT: []
          } : result.mapped_data[bank_accounts[0]],
          unmapped: _.isEmpty(result.unmapped_data) ? {
            CREDIT: [],
            DEBIT: []
          } : result["unmapped_data"][bank_accounts[0]]
        }))
        setActiveBank(bank_accounts[0]);
      } else {
        setAllTransactionsObj(prev => ({
          ...prev, mapped: {
            CREDIT: [],
            DEBIT: []
          },
          unmapped: {
            CREDIT: [],
            DEBIT: []
          }
        }))
        setActiveBank(bank_accounts[0]);

      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("No transactions found");
    }
  };


  const GetExpenseCategoryList = async () => {
    try {

      const result = await getCategoryList();
      if (result.status_code == 200) {
        const mappedOptions = result.data;
        setTransactionOptions(mappedOptions);
        return result;
      }
    } catch (error) {
      console.error('Error updating tracked bank details:', error);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Internal Server Error");
    }
  };

  const getMemberIdFn = () => {
    let isFamilySelected = Boolean(localStorage.getItem("family"));
    if (!isFamilySelected) {
      if (getMemberId()) {
        const memberId = getMemberId();
        const memberIdArray = [memberId];
        return memberIdArray;
      } else {
        const userId = getUserId();
        const userIdArray = [userId];
        return userIdArray;
      }
    } else {
      let users = "";
      let idsArray = [];

      if (localStorage.getItem("member")) {
        users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")))
        idsArray = users.map(item => String(item.id));
      }

      return idsArray;
    }
  };

  const handleTabChange = (tabIdx) => {
    setMappedCategoryList([]);
    setFilterStateData(prev => ({ ...prev, entryType: tabIdx == 1 ? 'CREDIT' : 'DEBIT' }))

  }

  const handleDoneClick = async () => {

    const InflowCheckedTransactions = getInflowCheckedTransactions(allTransactionsObj).map(data => ({
      txnId: data.txnId,
      mode: data.mode,
      reference: data.reference,
      date: data.date,
      chqNo: data.chqNo,
      narration: data.narration,
      amount: data.amount,
      category: data.category,
      balance: data.balance,
      index: data.index,
      type: data.type,
      isMapped: true,
    }))

    if (InflowCheckedTransactions.length != 0) {
      await uploadDatatoS3(currentUserIds, activeBank, InflowCheckedTransactions);
    }
    setFilterStateData(prev => ({ ...prev, entryType: 'DEBIT' }));
    setMappedCategoryList([]);

  };


  const handleDoneProceedClick = async () => {

    const OutflowCheckedTransactions = getOutflowCheckedTransactions(allTransactionsObj).map(data => ({
      txnId: data.txnId,
      mode: data.mode,
      reference: data.reference,
      date: data.date,
      chqNo: data.chqNo,
      narration: data.narration,
      amount: data.amount,
      category: data.category,
      balance: data.balance,
      index: data.index,
      type: data.type,
      isMapped: true,
    }))

    if (OutflowCheckedTransactions.length != 0) {
      await uploadDatatoS3(currentUserIds, activeBank, OutflowCheckedTransactions);
    }

    navigate(`${process.env.PUBLIC_URL}/money-management/dashboard`, { state: { accountNoList: [[activeBank]] } });
  };

  const handleSkipClick = async () => {
    handleTabChange(2);
    setShow(false);
  };

  const handleSkipProceedClick = async () => {
    navigate(`${process.env.PUBLIC_URL}/money-management/dashboard`, { state: { accountNoList: [[activeBank]] } });
  };



  const uploadDatatoS3 = async (user_id, accountNo, mappedCategoryList) => {

    const payload = {
      accountNo: accountNo,
      mappingTransactions: mappedCategoryList,
      user_id: user_id[0]
    };
    try {
      const response = await mapTransactions(payload)
      if (response.status_code == 200) {
        await applyDateAndCategoryFilter([...filterSliderStateData.inflowCategories, ...filterSliderStateData.outflowCategories], filterSliderStateData.startDate, filterSliderStateData.endDate)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const FetchTrackedBankDetails = async () => {
    var myHeaders = new Headers();

    const payload = {
      user_id: user_details
    };
    try {
      const result = await fetchTrackedBankDetailsFun(payload);
      if (result.status_code == 200) {

        const filteredAccounts = result.data;
        dispatch({ type: "SET_LINKED_ACCOUNT_DATA", payload: filteredAccounts });
        setTotalBankAcc(result.data.length);
        result.data.forEach(account => {
          const balance = account.mm_total_balance;
          totalBalance += balance;
          accountNumbers.push(account.mm_account_masked_id);
          user_contact.push(account.mm_mobile_number);
        });
        setTotalBankBalance(totalBalance);
        setDashboardData(filteredAccounts);
        setAllAccountData(filteredAccounts);
        // setUserContactNo(user_contact);
        return filteredAccounts;


      } else {
        return [];
      }
    } catch (error) {
      return [];
      console.error('Error fetching data:', error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setPaginationData(prev => ({ ...prev, currentPageNo: selected }));
  };


  useEffect(() => {
    user_details = getMemberIdFn();
    const processData = async () => {
      try {


        const trackedBanksResult = await FetchTrackedBankDetails();
        if (accountNumbers.length == 0) {
          return navigate('/money-management/overview');
        }
        if (fetchTxnDataAccount.length !== 0) {
          await FetchAccountTransactionsAPI(user_details, fetchTxnDataAccount, trackedBanksResult);
        } else {
          await FetchAccountTransactionsAPI(user_details, [accountNumbers[0]], trackedBanksResult);
        }

        await GetExpenseCategoryList();

      } catch (error) {
        console.error('Error:', error);
      }
    };

    processData();

    setCurrentUserIds(user_details);

  }, []);

  const changeAccountData = async (accountData) => {
    setPaginationData({
      currentPageNo: 0,
      recordsPerPage: 10
    })
    setFilterStateData(() => ({ ...initialFilterStateData }))
    setFilterSliderStateData(() => ({ ...initialFilterStateStateData }))
    await FetchAccountTransactionsAPI(getMemberIdFn(), [accountData.mm_account_masked_id], allllAccountData);
  }


  const getFilteredTransactionsTwo = () => {
    let finalTransactionsListTwo = [];

    if (Object.keys(allTransactionsObj.mapped).length === 0 && Object.keys(allTransactionsObj.unmapped).length === 0) {
      return;
    }

    switch (filterStateData.mappingStatus) {
      case 'All':
        if (filterStateData.entryType == 'CREDIT') {
          finalTransactionsListTwo = [...allTransactionsObj.mapped.CREDIT, ...allTransactionsObj.unmapped.CREDIT];
        } else {
          finalTransactionsListTwo = [...allTransactionsObj.mapped.DEBIT, ...allTransactionsObj.unmapped.DEBIT];
        }
        break;
      case 'Unmapped':
        if (filterStateData.entryType == 'CREDIT') {
          finalTransactionsListTwo = [...allTransactionsObj.unmapped.CREDIT];
        } else {
          finalTransactionsListTwo = [...allTransactionsObj.unmapped.DEBIT];
        }
        break;
      case 'Mapped':
        if (filterStateData.entryType == 'CREDIT') {
          finalTransactionsListTwo = [...allTransactionsObj.mapped.CREDIT];
        } else {
          finalTransactionsListTwo = [...allTransactionsObj.mapped.DEBIT];
        }
        break;
    }

    setTotalPages(Math.ceil(finalTransactionsListTwo.length / paginationData.recordsPerPage))

    const indexOfLastTransaction = (paginationData.currentPageNo + 1) * paginationData.recordsPerPage;
    const calculatedIndexOfFirstTransaction = paginationData.currentPageNo * paginationData.recordsPerPage;

    setFinalTransactionsTwo(() => finalTransactionsListTwo.slice(calculatedIndexOfFirstTransaction, indexOfLastTransaction))

  }

  const getCatSelectVal = (transaction, isMapped) => {
    var matchingTransactionIndex = mappedCategoryList.filter(txn =>
      txn.txnId === transaction.txnId &&
      txn.date === transaction.date &&
      txn.narration === transaction.narration &&
      txn.amount === transaction.amount &&
      txn.type === transaction.type
    );

    if (isMapped || (matchingTransactionIndex.length > 0)) {
      if (matchingTransactionIndex.length > 0) {
        return { value: matchingTransactionIndex[0].category, label: transactionOptions[filterStateData.entryType === 'CREDIT' ? 'income_cat' : 'expense_cat'][matchingTransactionIndex[0].category] }
      } else {
        return { value: transaction.category, label: transactionOptions[filterStateData.entryType === 'CREDIT' ? 'income_cat' : 'expense_cat'][transaction.category] }
      }
    }
    return { value: '', label: 'Select Category' }
  }

  const getMainCatSelectVal = (category, isMapped) => {
    if (Boolean(isMapped) && category != '') {
      return { value: category, label: transactionOptions[filterStateData.entryType === 'CREDIT' ? 'income_cat' : 'expense_cat'][category] }
    }
    return { value: '', label: 'Select Category' }
  }

  const getCatOptions = (isMapped) => {

    if (isMapped) {
      return Object.entries(filterStateData.entryType === 'CREDIT' ? transactionOptions.income_cat : transactionOptions.expense_cat)
        .map(([key, value]) => ({ value: key, label: value }))
    } else {
      return [{ value: '', label: 'Select Category' }].concat(Object.entries(filterStateData.entryType === 'CREDIT' ? transactionOptions.income_cat : transactionOptions.expense_cat)
        .map(([key, value]) => ({ value: key, label: value })))
    }
  }

  const getRangeString = () => {

    if (!filterSliderStateData.startDate || !filterSliderStateData.endDate) return ''
    var lastDayOfMonth = new Date(filterSliderStateData.endDate.getFullYear(), filterSliderStateData.endDate.getMonth() + 1, 0).getDate();
    filterSliderStateData.endDate.setDate(lastDayOfMonth);
    return `Date of Transaction :- ${filterSliderStateData.startDate.toLocaleDateString('en-GB')} To ${filterSliderStateData.endDate.toLocaleDateString('en-GB')}`
  }

  useEffect(() => {
    getFilteredTransactionsTwo();
    setPaginationData({
      currentPageNo: 0,
      recordsPerPage: 10
    })
  }, [filterStateData])


  useEffect(() => {
    getFilteredTransactionsTwo();
  }, [allTransactionsObj, paginationData])

  useEffectAfterInitialRender(() => {

    document.getElementById('transactionTableScrollRef').scrollIntoView({ behavior: "smooth" })

  // }, [paginationData.currentPageNo]);
}, [paginationData.currentPageNo, filterStateData.entryType]);

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const type = params.get("type");

  if (type === "income") {
    setFilterStateData(prev => ({
      ...prev,
      entryType: "CREDIT",
    }));
  }

  if (type === "expense") {
    setFilterStateData(prev => ({
      ...prev,
      entryType: "DEBIT",
    }));
  }
}, [location.search]);
  return (
    <div>

      <div className={`${style.bankAccountDataViewContainer2}`}>
        <div className={`${style.topBanner}`}>
          <div className={`${style.topBannerImg}`}>
            <img style={{ width: '100%' }} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/trademark_activity.svg"} />
          </div>

          <div className={`${style.topBannerHeading}`}>Welcome to your Transaction Mapping Zone!</div>
          <div
            className={`${style.topBannerTxt}`}>
            Here, you can effortlessly categorize your transactions for a clearer financial picture. Spot any unmapped transactions or need to adjust categories? Simply assign each transaction to its rightful income or expense category. Your input ensures precise tracking of your finances and helps us tailor insights just for you. Let's unravel your financial journey together!
          </div>
        </div>
        <div className='page-Commondashboard' id='transactionTableScrollRef'>
          <div className='Section'>
            <SavingAccountInfoSection totalBanks={totalBankAcc} totalBankBalance={totalBankbalance} dashboardData={dashboardData} userContactNumber={user_contact} hideAddBtn={true} activeBank={activeBank} headingColor={'#042b62'} onAccountClick={(accounData) => changeAccountData(accounData)} />
          </div>
        </div>
        <div ></div>

        <div style={{ display: 'block' }}>
          <TabElement activeTab={filterStateData.entryType == 'CREDIT' ? 1 : 2}
            onTabChange={(tabIdx) => { handleTabChange(tabIdx); setFilterStateData(prev => ({ ...prev, entryType: tabIdx == 1 ? 'CREDIT' : 'DEBIT' })) }}
          />
        </div>

        <div ref={transactionsTable} className={`${style.FilterOptionsContainer}`}>
          <div className={`${style.FilterOptionsBtns}`}>
            <div
              className={`${style.FilterOptionsBtn} ${filterStateData.mappingStatus === 'All' && style.FilterOptionsActiveBtn}`}
              onClick={() => setFilterStateData(prev => ({ ...prev, mappingStatus: 'All' }))}
            >All</div>
            <div
              className={`${style.FilterOptionsBtn} ${filterStateData.mappingStatus === 'Mapped' && style.FilterOptionsActiveBtn}`}
              onClick={() => setFilterStateData(prev => ({ ...prev, mappingStatus: 'Mapped' }))}
            >Mapped</div>
            <div
              className={`${style.FilterOptionsBtn} ${filterStateData.mappingStatus === 'Unmapped' && style.FilterOptionsActiveBtn}`}
              onClick={() => setFilterStateData(prev => ({ ...prev, mappingStatus: 'Unmapped' }))}
            >Unmapped</div>


          </div>
          <div className='searchbar-desktop'>
            <button
              onClick={() =>
                setIsFilterPanelActive((prev) => !prev)
              }
              className="Btn btn-filter"
              style={{ marginLeft: '0' }}
            >
              <span>
                Filter{" "}
                <BiFilter
                  style={{ fontSize: "1.5em", color: "#042b62" }}
                />
              </span>
            </button>
          </div>
        </div>


        <div className={`${style.BankTransactionTable}`}>
          <table className={` ${style.bankAccountDataTransactionTable}`}>
            <tbody >
              {finalTransactionsTwo.length == 0 ? (
                <tr>
                  <td colSpan="5" style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '18px', padding: '20px' }}>No transactions found</td>
                </tr>
              ) : (

                finalTransactionsTwo.map((transaction, index) => (

                  <TransactionAccordion
                    key={transaction.id}
                    filterStateData={filterStateData}
                    transaction={transaction}
                    getCatOptions={getCatOptions}
                    getCatSelectVal={getCatSelectVal}
                    getMainCatSelectVal={getMainCatSelectVal}
                    indexNo={index}
                    accordionArr={accordionArr}
                    setAccordionArr={setAccordionArr}
                    allTransactionsObj={allTransactionsObj}
                    setAllTransactionsObj={setAllTransactionsObj} />
                ))
              )}
            </tbody>
          </table>
        </div>
        <br />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: '600' }}>
            {getRangeString()}
          </div>
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-end"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={'active'}
            forcePage={paginationData.currentPageNo == undefined ? 0 : paginationData.currentPageNo}
          />
        </div>

        <br />
        <div className={`${style.desktopView}`}>
          <div className={`${style.btnContainer} `}>
            {filterStateData.entryType == 'CREDIT' ? (
              <>
                <div
                  onClick={handleSkipClick}
                  className={`${style.btnOutline}`}
                >
                  Skip & proceed to outflow
                </div>
                <div onClick={handleDoneClick} className={`${style.btn3}`}>
                  Save & proceed to outflow
                </div>
              </>
            ) : (
              <>
                <div
                  onClick={handleSkipProceedClick}
                  className={`${style.btnOutline}`}
                >
                  Skip & proceed
                </div>
                <div onClick={handleDoneProceedClick} className={`${style.btn3}`}>
                  Save & proceed
                </div>
              </>
            )}
          </div>
        </div>

        <div className={`${style.mobileView}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', margin: '0.5rem' }}>
            <div className={`${style.chip2}`}>Powered by</div>
            <img
              style={{ width: '90px', cursor: 'pointer' }}
              src={process.env.REACT_APP_STATIC_URL + 'media/MoneyManagement/finvulogo.svg'}
            />
          </div>
        </div>
      </div>
      <div className={`${style.desktopView}`}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            position: 'absolute',
            bottom: '0',
            right: '0',
            margin: '0.5rem',
          }}
        >
          <div className={`${style.chip2}`}>Powered by</div>
          <img
            style={{ width: '90px', cursor: 'pointer' }}
            src={process.env.REACT_APP_STATIC_URL + 'media/MoneyManagement/finvulogo.svg'}
          />
        </div>
      </div>

      <div className={`${style.mobileView}`}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            paddingTop: '1rem',
          }}
        >
          <div
            onClick={() => {
              setShow(true);
            }}
            className={`${style.btnOutline}`}
            style={{ width: '100%', textAlign: 'center' }}
          >
            Skip
          </div>
          <div className={`${style.btn3}`} style={{ width: '100%', textAlign: 'center' }}>
            Done
          </div>
        </div>
      </div>

      <Modal className="popupmodal p-2" centered show={show} onHide={() => setShow(false)}>
        <Modal.Header style={{ display: 'block' }} className="ModalHead">
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}
            className="text-center"
          >
            Please Confirm
          </div>
        </Modal.Header>
        <div className=" p-4 d-grid place-items-center align-item-center">
          <div className=" HeaderModal">
            <div
              style={{
                fontSize: '1rem',
                textAlign: 'center',
                fontWeight: '400',
              }}
            >
              <div>Are you sure about skipping this step?</div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center pb-5">
          <button
            style={{
              background: 'transparent',
              outline: '0',
              border: '0',
              padding: '.5rem 3rem',
              border: '1px solid #042b62',
              color: '#042b62',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '500',
            }}
            onClick={() => setShow(false)}
            className="outline-btn m-2"
          >
            No
          </button>
          <button
            style={{
              background: ' #042b62',
              outline: '0',
              border: '0',
              padding: '.5rem 3rem',
              border: '1px solid #042b62',
              color: '#fff',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '500',
            }}
            onClick={() => setShow(false)}
            className="outline-btn m-2"
          >
            Yes
          </button>
        </div>
      </Modal>

      <MapTransactionFilterPanel
        isOpen={isFilterPanelActive}
        activeBank={activeBank}
        transactionOptions={transactionOptions}
        entryType={filterStateData.entryType}
        filterStateData={filterSliderStateData}
        togglePanel={setIsFilterPanelActive}
        category={transactionOptions}
        setFilterStateData={setFilterSliderStateData}
        applyDateAndCategoryFilter={applyDateAndCategoryFilter}
      />
    </div >
  );
};

export default BankAccountDataTransactionTableView;
