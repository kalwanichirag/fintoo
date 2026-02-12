const INITIAL_STATE = {
  progressValue: 0,
  progressTitle: null,
  hideSideBar: false,
  loggedIn: null,
  cartCount: 0,
  forceReloadCartCount: false,
  toastMessage: {},
  memberInfo: {},
  memberChanged: "",
  isBackVisible: true,
  page: "dashboard",
  selectedRM: {},
  addBankStepCount: 0,
  investDashboardTabActiveTab: "mf",
  resetDragzone: false,
  dubaiLive: false,
  hideMainFooter: false,
  openChatBot: false,
  temporaryDisplayName: "",
  assetsUpdated: false,
  otherinvUpdated: false,
  reloadAdvisorySideBar: false,
  profileStatusData: [],
  connectWithBroker: false,
  trggerEquityHolding: false,
  // triggerRefreshData: {}
  statementAccountsData: [],
  allFetchedAccountData: [],
  maxAmountLimit: 0,
  allBankAccounts: [],
  customerInfoData: {},
  userDetails: {},
  bankIdDetails: {},
  linkedAccountData: [],
  fetchTxnDataAccount: [],
  transactionOptions: [],
  dgSidebarData: {
    kyc_waiting: true,
    kyc_verify: "0",
    percentage: "0",
    profileData: {}
  },
  reportDownload: 1,
  par_report_data: {},
  leadData: {
    fullname: "",
    mobile: "",
    email: ""
  },
  par_pan_mobile_prefilled: true,
  member_data : []
};

const fintooReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_PROGRESS":
      return Object.assign({}, state, {
        progressValue: action.payload,
      });
    case "SET_PROGRESS_NAME":
      return Object.assign({}, state, {
        progressTitle: action.payload,
      });
    case "HIDE_SHOW_SIDEBAR":
      return Object.assign({}, state, {
        hideSideBar: action.payload,
      });
    case "LOGGIN_LOGOUT":
      return Object.assign({}, state, {
        loggedIn: action.payload,
      });
    case "UPDATE_CART_COUNT":
      return Object.assign({}, state, {
        cartCount: action.payload,
      });
    case "FORCE_UPDATE_CART_COUNT":
      return Object.assign({}, state, {
        forceReloadCartCount: action.payload,
      });
    // case "CHANGE_MEMBER":
    //   return Object.assign({}, state, {
    //     memberInfo: action.payload,
    //   });
    case "CHANGE_MEMBER":
      return Object.assign({}, state, {
        memberChanged: action.payload,
      });
    case "RENDER_TOAST":
      return Object.assign({}, state, {
        toastMessage: action.payload,
      });
    case "PROFILE_BACK":
      return Object.assign({}, state, {
        isBackVisible: action.payload,
      });
    case "CHANGE_COMMONDASHBOARD":
      return Object.assign({}, state, {
        page: action.payload,
      });
    case "RM_DETAILS":
      return Object.assign({}, state, {
        selectedRM: action.payload,
      });
    case "BANK_ADD_COUNT":
      return Object.assign({}, state, {
        addBankStepCount: state.addBankStepCount + 1,
      });

    case "NOMINEE BACK":
      return Object.assign({}, state, {
        nominee_back: state.nominee_back,
      });
    case "INVEST_DASHBOARD_CHANGE_TAB":
      return Object.assign({}, state, {
        investDashboardTabActiveTab: action.payload,
      });
    case "RESET_DRAGZONE":
      return Object.assign({}, state, {
        resetDragzone: action.payload,
      });
    case "DUBAI_LIVE":
      return Object.assign({}, state, {
        dubaiLive: action.payload,
      });
    case "HIDE_FOOTER":
      return Object.assign({}, state, {
        hideMainFooter: action.payload,
      });
    case "OPENCHATBOT":
      return Object.assign({}, state, {
        openChatBot: action.payload,
      });
    case "ASSETS_UPDATE":
      return Object.assign({}, state, {
        assetsUpdated: action.payload,
      });
    case "OTHERINVESTMENT_UPDATE":
      return Object.assign({}, state, {
        otherinvUpdated: action.payload,
      });
    case "SET_TEMP_NAME":
      return Object.assign({}, state, {
        temporaryDisplayName: action.payload,
      });
    case "RELOAD_SIDEBAR":
      return Object.assign({}, state, {
        reloadAdvisorySideBar: action.payload,
      });
    case "UPDATE_PROFILE":
      return Object.assign({}, state, {
        profileStatusData: action.payload,
      });
    case "CONNECT_WITH_BROKER":
      return Object.assign({}, state, {
        connectWithBroker: action.payload,
      });
    case "TRIGGER_EQUITY_HOLDING":
      return Object.assign({}, state, {
        trggerEquityHolding: action.payload,
      });
    // case "TRIGGER_REFRESH_HOLDING":
    //   return Object.assign({}, state, {
    //     triggerRefreshData: action.payload,
    //   });
    case "SET_STATEMENT_ACCOUNT_DATA":
      return Object.assign({}, state, {
        statementAccountsData: action.payload,
      });
    case "SET_MAX_AMOUNT_LIMIT":
      return Object.assign({}, state, {
        maxAmountLimit: action.payload,
      });
    case "SET_ALL_FETCHED_ACCOUNT_DETAILS":
      return Object.assign({}, state, {
        allFetchedAccountData: action.payload,
      });
    case "SET_ALL_FETCHED_BANK_ACCOUNTS":
      return Object.assign({}, state, {
        allBankAccounts: action.payload,
      });
    case "SET_TRANSACTION_OPTIONS":
      return Object.assign({}, state, {
        transactionOptions: action.payload,
      });

    case "SET_CUSTOMER_INFO":
      return Object.assign({}, state, {
        customerInfoData: action.payload,
      });
    case "SET_USER_DETAILS":
      return Object.assign({}, state, {
        userDetails: action.payload,
      });
    case "SET_BANK_ID_DETAILS":
      return Object.assign({}, state, {
        bankIdDetails: action.payload,
      });
    case "SET_LINKED_ACCOUNT_DATA":
      return Object.assign({}, state, {
        linkedAccountData: action.payload,
      });
    case "SET_FETCH_TXN_DATA_ACCOUNT":
      return Object.assign({}, state, {
        fetchTxnDataAccount: action.payload,
      });
    case "DG_SIDEBAR_DATA":
      return Object.assign({}, state, {
        dgSidebarData: action.payload,
      });
    case "REPORT_DOWNLOAD_STATUS":
      return Object.assign({}, state, {
        reportDownload: action.payload,
      });
    case "SET_PAR_REPORT_DATA":
      return Object.assign({}, state, {
        par_report_data: action.payload,
      });
    case "SET_LEAD_DATA":
      return Object.assign({}, state, {
        leadData: action.payload,
      });
    case "SET_PAR_PAN_MOBILE_PREFILLED":
      return Object.assign({}, state, {
        par_pan_mobile_prefilled: action.payload,
      });
    case "SET_MEMBER_DATA":
      return Object.assign({}, state, {
        member_data: action.payload,
      });
    default:
      return state;
  }
};

export default fintooReducer;
