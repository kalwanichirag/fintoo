// Common constants

// Google AUTH CLIENT ID

// stg
// export const GOOGLEAUTHCLIENTID = "305404601485-aoho4ale08t6dp087j079a7beit1l183.apps.googleusercontent.com"
// prod
export const GOOGLEAUTHCLIENTID = "305404601485-eurba4c0uba98gjkev9mahp8feqda6fg.apps.googleusercontent.com"

export const FRAPPE_BASE_URL = "https://fintoodev.frappe.cloud/api/method/";
export const BASE_API_FRAPPE_URL = process.env.REACT_APP_BASE_FRAPPE_API_URL;
export const RAZORPAY_API_URL = "https://ifsc.razorpay.com/";
export const DMF_BASE_URL = process.env.REACT_APP_DMF_BASE_URL;
export const CRM_BASE_URL = process.env.REACT_APP_CRM_BASE_URL;
// export const BASE_API_URL = 'http://127.0.0.1:8000/'; //local
// export const STATIC_URL = 'http://127.0.0.1:8000/static/';
export const FRAPPE_BASE_API_URL = "https://fintoodev.frappe.cloud/";
export const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
export const FRAPPE_API_URL = process.env.REACT_APP_BASE_FRAPPE_API_URL;
export const CRM_FRAPPE_URL = "https://operations.fintoo.in/api/method"
export const CRM_URL = "https://operations.fintoo.in"
export const STATIC_URL = process.env.REACT_APP_STATIC_URL;
export const LOGIN_PAGE = process.env.PUBLIC_URL + "/login";
export const REGISTER_PAGE = process.env.PUBLIC_URL + "/register";
export const BLOG_URL = "https://www.fintoo.in/blog";
export const STOCKPAGE = process.env.REACT_APP_STOCKPAGE;
export const STOCKLIST_PAGE = "";
export const SUPPORT_EMAIL = 'support@fintoo.in'
export const AADHAR_GENERATE_OTP = "https://kyc-api.aadhaarkyc.io//api/v1/aadhaar-v2/generate-otp";
export const AADHAR_SUBMIT_OTP = "https://kyc-api.aadhaarkyc.io//api/v1/aadhaar-v2/submit-otp";
export const AADHAR_HEADERS = {
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2MjAyODU5OSwianRpIjoiNDY1YzUzZDQtNTgyOC00NGI4LTgyMmQtMGU4NjY2NTYwZjc5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmZpbnRvb0BzdXJlcGFzcy5pbyIsIm5iZiI6MTY2MjAyODU5OSwiZXhwIjoxOTc3Mzg4NTk5LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsid2FsbGV0Il19fQ.XIzLSJnukwEGGznLCtNwwyrqWm6pWuwQIt9rzcqoZZ8",
};
export const CALENDLY_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjQ4MjExMjQ0LCJqdGkiOiJmMmM1YWIwOC01N2ZiLTQ0YzAtODNjYy1lM2QxZWZhZGY2YzMiLCJ1c2VyX3V1aWQiOiI0ODVhZTAyZC02ZGNiLTQ1MjktODdiYi01MGY2NDE3NGI4ZWYifQ.5bIIwHH3DTn1Vp7Oj6hZlLkVIbI1q7jxqFogGaGkb1g"


// Digi Locker
export const auth_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2MjAyODU5OSwianRpIjoiNDY1YzUzZDQtNTgyOC00NGI4LTgyMmQtMGU4NjY2NTYwZjc5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmZpbnRvb0BzdXJlcGFzcy5pbyIsIm5iZiI6MTY2MjAyODU5OSwiZXhwIjoxOTc3Mzg4NTk5LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsid2FsbGV0Il19fQ.XIzLSJnukwEGGznLCtNwwyrqWm6pWuwQIt9rzcqoZZ8"
export const digilocker_url = "https://kyc-api.aadhaarkyc.io/api/v1/digilocker"
// export const imagePath = "";
export const imagePath = window.location.origin + "";

// https://stg.minty.co.in/image/?frontend=1&file=

export const SMALLCASE_GATEWAY = 'fintoo'
//  Finvu Constant
// export const FINVU_BASE_API_URL = "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/";
// export const FINVU_BASE_API_URL =  "https://dhanaprayoga.fiu.finfactor.in/finsense/API/V2/";
export const CHATBOT_BASE_API_URL = "https://stgchatbot.wealthtech.ai/chatbot/";
export const GATEWAY_AUTH_NAME = "stg.minty.co.in";
export const CHATBOT_BASE_API_URL_LOCAL = "http://127.0.0.1:8000/chatbot/";
export const CHATBOT_TOKEN_USERNAME = "stgfintoo";
export const CHATBOT_TOKEN_PASSWORD = "stgfintoo@123";
export const FINTOO_BASE_API_URL = "https://stg.minty.co.in/";
export const FINVU_WEBSOCKET_URL = "wss://webvwlive.finvu.in/consentapi";
// export const FINVU_WEBSOCKET_URL = "wss://webvwdev.finvu.in/consentapi";
// Live Finvu Creds
export const FINVU_USER_ID = "channel@fintoo";
export const FINVU_PASSWORD = "85a333fb49044c7e91611a0d962ff8ba";
export const FINVU_AAID = "cookiejaraalive@finvu";
export const FINVU_TEMPLATE_NAME = "BANK_STATEMENT_PERIODIC";
//Dollar to Rupees convertion rate
export const exchange_rate = 87.64
//master password
export const master_psw = "Pl62odf39eqi"
export const RAZOR_PAY_KEY =  process.env.REACT_APP_MODE == "live" ? "rzp_live_rYE1IuyTWkWiDv" : "rzp_test_SA4S6rcFbk4JvI";
export const RAZOR_PAY_SECRET = process.env.REACT_APP_MODE == "live" ? "GOfFTB1HlrGQlqsnrYnCPhmj" : "QSs7JlK5nfW1uEDqcdjgJfYn"
export const ASSESSMENT_YEAR = '2025-26';
export const RAZORPAY_CHECKOUT = "https://checkout.razorpay.com/v1/checkout.js";

export const X_CRM_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4ZjNhZDQ5MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNDY2NzIwMH0.b9cD4qLQZxWm2A8nKpF7S3JvE0R6uT1HhYc5M2X9aQs";
export const X_CRM_USER = "online@fintoo.in";

/******************************************************************************* Frappe API Endpoints ********************************************************************************************************/


export const DATA_BELONGS_TO = "DIR";
export const ADVISORY_FETCH_USER_ASSUMPTIONS = FRAPPE_API_URL + "/fetch_user_assumption"
export const ADVISORY_FETCH_USER_INFLATIONS = FRAPPE_API_URL + "/fetch_user_inflation"
export const FETCH_USER_EXPENSES = FRAPPE_API_URL + "/get_user_expense_details"
export const ADVISORY_UPDATE_USER_SETTINGS_DATA = FRAPPE_API_URL + "/update_user_setting_data"
export const GET_SCORE_CARD = FRAPPE_API_URL + "/get_score_card"
export const GET_LIFE_INSURANCE_URL = FRAPPE_API_URL + "/get_life_insurance"
export const GET_CASH_IN_OUT_FLOW = FRAPPE_API_URL + "/get_cash_in_out_flow"
export const GET_CASHINFLOW_DATA_URL = FRAPPE_API_URL + "/get_cash_in_flow"


export const ADVISORY_GET_NETWORTHLIABILITES_API_URL = FRAPPE_API_URL + "/getnetworthliabilitesbyuser";
export const ADVISORY_GET_ASSETS_SUMMARY_API = FRAPPE_API_URL + "/getassetsummary"
export const ADVISORY_GET_NETWORTHFUNDFLOW_API_URL = FRAPPE_API_URL + "/getnetworthfundflow"
export const ADVISORY_NETWORTHFUNDFLOW_PROJECTION_API_URL = FRAPPE_API_URL + "/getnetworthprojection"
export const ADVISORY_GET_EQUITY_DATA_API = FRAPPE_API_URL + "/getequitydata"
export const ADVISORY_GET_GOAL_SUMMARY = FRAPPE_API_URL + "/goal_summary"
export const ADVISORY_GET_FP_GOALS_ASSET_MAP = FRAPPE_API_URL + "/get_asset_goal_mapping"
export const ADVISORY_DEBT_INVESTMENT_API = FRAPPE_API_URL + "/getdebtdata"
export const ADVISORY_ALTERNATE_INVESTMENT_API = FRAPPE_API_URL + "/getalternatedata"
export const ADVISORY_COMMODITY_INVESTMENT_API = FRAPPE_API_URL + "/getcommoditydata"
export const ADVISORY_REALESTATE_INVESTMENT_API = FRAPPE_API_URL + "/getrealestatedata"
export const ADVISORY_GET_ASSET_GOAL_MAPPING = FRAPPE_API_URL + "/get_asset_goal_mapping"
export const ADVISORY_GET_GOAL_ASSET_MAPPING = FRAPPE_API_URL + "/get_asset_goals"
export const ADVISORY_GET_INSURANCE_DATA = FRAPPE_API_URL + "/get_current_insurance"
export const ADVISORY_GET_MEDICAL_INSURANCE_NEW = FRAPPE_API_URL + "/get_medical_insurance"
export const ADVISORY_GET_RETIREMENT_INFO_API = FRAPPE_API_URL + "/retirement_info"
export const ADVISORY_GET_LIABILITY_DATA = FRAPPE_API_URL + "/getliabilitysummary"
export const ADVISORY_GET_CASHOUTFLOW_DATA = FRAPPE_API_URL + "/get_cash_out_flow"
export const ADVISORY_DOWNLOAD_REPORT = FRAPPE_API_URL + "/download_report_api"
export const ADVISORY_DOWNLOAD_REPORT_SIDEBAR = FRAPPE_API_URL + "/download_report_api"
export const ADVISORY_LIABILITY_NETWORTH_DATA = FRAPPE_API_URL + "/getliabilityfundflow"
export const GET_OTHER_INVESTMENTS = FRAPPE_API_URL + "/fetch_user_asset_details";
export const ADVISORY_ADD_ASSETS_API = FRAPPE_API_URL + "/save_user_asset_details"
export const ADVISORY_UPDATE_ASSETS_API = FRAPPE_API_URL + "/update_user_asset_details"
export const DMF_GET_UPCOMING_TRANSACTION_API_URL = FRAPPE_API_URL + "/get_upcoming_transactions"
export const DMF_GET_MF_TRANSACTIONS_API_URL = FRAPPE_API_URL + "/get_transactions_history";
export const DMF_GETCOUNTRIES_API_URL = FRAPPE_API_URL + "/get_countries_list";
export const DMF_GETSTATES_API_URL = FRAPPE_API_URL + "/get_states_list";
export const DMF_GETCITIES_API_URL = FRAPPE_API_URL + "/get_cities_list";

const financialplanningBaseAPIUrl = BASE_API_FRAPPE_URL;
const moneyManagementBaseAPIUrl = financialplanningBaseAPIUrl;
const userManagementBaseAPIUrl = financialplanningBaseAPIUrl;
const paymentappBaseAPIUrl = financialplanningBaseAPIUrl;
const investmentBaseAPIUrl = financialplanningBaseAPIUrl;
const familyBaseAPIUrl = financialplanningBaseAPIUrl;

export const DELETE_OTHER_INVESTMENTS = `${investmentBaseAPIUrl}/delete_user_asset_details`;

// user-management-api endpoints
export const userManagementEndpoints = {
  TOKEN: `${userManagementBaseAPIUrl}/token/`,
  GET_DEVICE_INFO: `${userManagementBaseAPIUrl}/get-device-info/`,
  CHECK_EMAIL: `${userManagementBaseAPIUrl}/check_email`,
  CHECK_PAN: `${userManagementBaseAPIUrl}/check_pan`,
  UPDATE_EMAIL: `${userManagementBaseAPIUrl}/update-email/`,
  CHECK_MOBILE: `${userManagementBaseAPIUrl}/check_mobile`,
  SEND_OTP: `${userManagementBaseAPIUrl}/send_otp`,
  VERIFY_OTP: `${userManagementBaseAPIUrl}/verify_otp`,
  SET_RESET_PIN: `${userManagementBaseAPIUrl}/set-reset-pin/`,
  RESET_PIN: `${userManagementBaseAPIUrl}/reset_pin`,
  VERIFY_PIN: `${userManagementBaseAPIUrl}/verify-pin/`,
  REGISTER: `${userManagementBaseAPIUrl}/register_user`,
  REGISTER_MOBILE: `${userManagementBaseAPIUrl}/update_mobile`,
  LOGIN: `${userManagementBaseAPIUrl}/login_user`,
  ADD_FAMILY_MEMBER: `${userManagementBaseAPIUrl}/add_family_member`,
  UPDATE_FAMILY_MEMBER: `${userManagementBaseAPIUrl}/update_family_member`,
  GET_FAMILY_MEMBER: `${userManagementBaseAPIUrl}/get_family_member`,
  GET_MEMBER_DETAILS: `${userManagementBaseAPIUrl}/get_member_details`,
  DELETE_FAMILY_MEMBER: `${userManagementBaseAPIUrl}/delete_family_member`,
  FETCH_DEFAULT_ASSUMPTION: `${userManagementBaseAPIUrl}/fetch-default-assumption/`,
  FETCH_DEFAULT_INFLATION: `${userManagementBaseAPIUrl}/fetch-default-inflation/`,
  FETCH_USER_ASSUMPTION: `${userManagementBaseAPIUrl}/fetch-user-assumption/`,
  FETCH_USER_INFLATION: `${userManagementBaseAPIUrl}/fetch_user_inflation`,
  UPDATE_ROR_DATA: `${userManagementBaseAPIUrl}/update-ror-data/`,
  UPDATE_BASIC_DETAILS: `${userManagementBaseAPIUrl}/update_basic_details`,
  GET_OCCUPATION_LIST: `${userManagementBaseAPIUrl}/get_occupation_list`,
  GET_RELATION_LIST: `${userManagementBaseAPIUrl}/get_relation_list`,
  FETCH_USER_PROFILE_DETAILS: `${userManagementBaseAPIUrl}/fetch_user_profile_details`,
  FETCH_RISK_QUESTIONS: `${userManagementBaseAPIUrl}/fetch-risk-questions/`,
  FETCH_USER_RISK_ANSWERS: `${userManagementBaseAPIUrl}/fetch-user-risk-answers/`,
  ADD_UPDATE_USER_RISK_ANSWERS: `${userManagementBaseAPIUrl}/add-update-user-risk-answers/`,
  UPDATE_USER_SETTING_DATA: `${userManagementBaseAPIUrl}/update_user_setting_data`,
  GET_RECCONTINGENCY_RISK: `${userManagementBaseAPIUrl}/get_reccontingency_risk`,
  GET_CURRENT_INVESTMENT_RECOMMENDATION: `${userManagementBaseAPIUrl}/getcurrentinvestmentrecommendation`,
  SEND_EMAIL: `${userManagementBaseAPIUrl}/send_email`,
  SEND_SMS: `${userManagementBaseAPIUrl}/send_sms`,
  SEND_WHATSAPP_MSG: `${userManagementBaseAPIUrl}/send_whatsapp_msg`,
  EXPERTFINFLOWGETRMEMAIL: `${userManagementBaseAPIUrl}/expertfinflowgetrmemail`,
  CASH_FLOW_RECOMMENDATION: `${userManagementBaseAPIUrl}/cash_flow_recommendation`,
  CASH_IN_FLOW: `${userManagementBaseAPIUrl}/get_cash_in_flow`,
  CASH_OUT_FLOW: `${userManagementBaseAPIUrl}/get_cash_out_flow`,
  GET_EXPERT_DETAILS: `${userManagementBaseAPIUrl}/get_expert_details`,
  GENERATE_LEAD: `${userManagementBaseAPIUrl}/generate_lead_opportunity`,
  GET_APPOINTMENT_DETAILS: `${userManagementBaseAPIUrl}/get_appointment_details`,
  UPDATE_APPOINTMENT_DETAILS: `${userManagementBaseAPIUrl}/update_appointment_details`,
  FETCH_USER_MF_PROFILE_STATUS: `${userManagementBaseAPIUrl}/fetch_user_mf_profile_status`,
  DELETE_BANK_DETAILS: `${userManagementBaseAPIUrl}/delete_bank_details`,
  // UPDATE_CUSTOM_OPPORTUNITY_STATUS: `${userManagementBaseAPIUrl}/update_opportunity_status`,


  // Check All status 

  CHECK_ALL_STATUS_API: `${financialplanningBaseAPIUrl}/check_all_status_api`
};

export const VALIDATE_REDIRECTION = `${CRM_BASE_URL}/validate_redirection`
// money management endpoints

export const FINVU_BASE_API_URL = "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2"

export const moneyManagementEndpoints = {
  GENERATE_TOKEN: `${moneyManagementBaseAPIUrl}/generate_token`,
  SUBMIT_CONSENT_REQUEST: `${moneyManagementBaseAPIUrl}/submit-consent-request/`,
  BANK_LIST: `${moneyManagementBaseAPIUrl}/bank_list`,
  CATEGORY_LIST: `${moneyManagementBaseAPIUrl}/income_expense_category_list`,
  SAVE_TRANSACTIONS: `${moneyManagementBaseAPIUrl}/upload_data_for_budget_creation`,
  MAP_TRANSACTIONS: `${moneyManagementBaseAPIUrl}/map_transactions`,
  ANALYSE_BANK_ACCOUNT_TRANSACTIONS: `${moneyManagementBaseAPIUrl}/analyse-bank-account-transactions/`,
  FETCH_ACCOUNT_TRANSACTIONS: `${moneyManagementBaseAPIUrl}/fetch_account_transactions`,
  UPDATE_TRACKED_BANK_DETAILS: `${moneyManagementBaseAPIUrl}/update_bank_account_details`,
  FETCH_TRACKED_BANK_DETAILS: `${moneyManagementBaseAPIUrl}/fetch_bank_account_details`,
  FETCH_TRACKED_MOBILE_LIST: `${moneyManagementBaseAPIUrl}/fetch_tracked_mobile_list`,
  AUTO_UPDATE_ACCOUNT_TRANSACTIONS: `${moneyManagementBaseAPIUrl}/auto_update_account_transactions`,
  UNLINK_BANK_ACCOUNT: `${moneyManagementBaseAPIUrl}/unlink_bank_account`,
  ANALYSE_PAST_DATA: `${moneyManagementBaseAPIUrl}/analyse_past_data`,
  GET_DEPENDENT_EARNING_COUNT: `${moneyManagementBaseAPIUrl}/get_dependent_earning_member_count`,
  DUPLICATE_ACCOUNT_CHECK: `${moneyManagementBaseAPIUrl}/duplicate_account_check`,
  // ---------------------------------- finfactor endpoints --------------------------------
  SUBMIT_CONCENT_REQUEST: `${FINVU_BASE_API_URL}/SubmitConsentRequest`,
  FIP_FM_DATA_REPORT: `${FINVU_BASE_API_URL}/FIPfmDataReport`,
  LATEST_METRICS_ALL: `${FINVU_BASE_API_URL}/fips/latest-metrics-all`,
  FINANCIAL_OVERVIEW: `${moneyManagementBaseAPIUrl}/financial_overview`,

};

export const investmentEndpoints = {
  GET_NOMINEE_DETAILS: `${investmentBaseAPIUrl}/get_nominee_details`,
  GET_CART_DETAILS: `${investmentBaseAPIUrl}/get_cart_details`,
  GET_OTHER_INVESTMENTS: `${investmentBaseAPIUrl}/fetch_user_asset_details`,
  ADVISORY_ADD_ASSETS_API: `${investmentBaseAPIUrl}/save_user_asset_details`,
  ADVISORY_UPDATE_ASSETS_API: `${investmentBaseAPIUrl}/update_user_asset_details`,
  DELETE_OTHER_INVESTMENTS: `${investmentBaseAPIUrl}/delete_user_asset_details`,
  DMF_GET_MF_TRANSACTIONS_API_URL: `${investmentBaseAPIUrl}/get_transactions_history`,
  GET_SCHEME_LIST_API_URL: `${investmentBaseAPIUrl}/get_scheme_list`,
  GET_MF_SUMMARY_PORTFOLIO: `${investmentBaseAPIUrl}/get_mf_summary_portfolio`,
  GET_MF_PERFORMANCE: `${investmentBaseAPIUrl}/mf_performance`,
  GET_MF_DETAILED_PORTFOLIO: `${investmentBaseAPIUrl}/get_mf_detailed_portfolio`,
  GET_DASHBOARD_DATA: `${investmentBaseAPIUrl}/get_dashboard_data`,
  GENERATE_MF_JWTTOKEN: `${investmentBaseAPIUrl}/generatemfjwttoken`,
  GENERATE_MF_TXNID_API_URL: `${investmentBaseAPIUrl}/generatemftxnid`,
  SEND_MF_OTP_API_URL: `${investmentBaseAPIUrl}/sendmfotp`,
  VERIFY_MF_OTP_API_URL: `${investmentBaseAPIUrl}/verifymfotp`,
  GET_AMC_LIST_API_URL: `${investmentBaseAPIUrl}/get_amc_list`,
  GET_SCHEME_DETAILS_API_URL: `${investmentBaseAPIUrl}/get_scheme_details`,
  UPDATE_CART_API_URL: `${investmentBaseAPIUrl}/update_cart`,
  ADD_TO_CART_API_URL: `${investmentBaseAPIUrl}/add_to_cart`,
  ADD_SWITCH_TO_CART_API_URL: `${investmentBaseAPIUrl}/add_switch_to_cart`,
  ADD_STP_TO_CART_API_URL: `${investmentBaseAPIUrl}/add_stp_to_cart`,
  UPDATE_CATEGORY_GOAL_LINKAGE: `${investmentBaseAPIUrl}/update_category_goal_linkage`,
  ADD_NOMINEE_DETAILS: `${investmentBaseAPIUrl}/add_nominee_details`,
  UPDATE_NOMINEE_DETAILS: `${investmentBaseAPIUrl}/update_nominee_details`,
  GET_MF_CATEGORIES: `${investmentBaseAPIUrl}/get_mf_categories`,
  DELETE_CART_FUND: `${investmentBaseAPIUrl}/delete_cart`,
  DEACTIVATE_CART_FUND: `${investmentBaseAPIUrl}/deactivate_cart`,
  PLACE_ORDER : `${investmentBaseAPIUrl}/place_order`,
  SUCCESS_ORDER : `${investmentBaseAPIUrl}/success_order`,
  CANCEL_ORDER : `${investmentBaseAPIUrl}/cancel_order`,
  ADD_TO_WISHLIST : `${investmentBaseAPIUrl}/add_to_wishlist`,
  DELETE_FROM_WISHLIST : `${investmentBaseAPIUrl}/delete_from_wishlist`,
  FETCH_MF_WISHLIST : `${investmentBaseAPIUrl}/fetch_wishlist`,
  GET_ASSET_ALLOCATION: `${investmentBaseAPIUrl}/get_asset_allocation`,
  ADD_TRANSACTION: `${investmentBaseAPIUrl}/add_transaction`,
  ADD_SWITCH_TRANSACTION: `${investmentBaseAPIUrl}/add_switch_transaction`,
  SWITCH_ORDER_ENTRY: `${investmentBaseAPIUrl}/switch_order_entry`,
  STP_REGISTERATION: `${investmentBaseAPIUrl}/stp_registration`,
};

export const masterEndpoints = {
  GET_BANK_LIST: `${financialplanningBaseAPIUrl}/get_bank_list`,
  GET_BANK_TYPES_LIST: `${financialplanningBaseAPIUrl}/get_bank_types_list`,
  CHECK_PROFILE_STATUS_API: `${financialplanningBaseAPIUrl}/check_profile_status_api`,
  GET_PAN_STATUS_API_URL: `${financialplanningBaseAPIUrl}/get_pan_status`,
  ADD_FATCA_DETAILS: `${financialplanningBaseAPIUrl}/add_fatca_details`,
  GET_FATCA_DETAILS: `${financialplanningBaseAPIUrl}/get_fatca_details`,
  GET_COUNTRIES: `${financialplanningBaseAPIUrl}/get_countries_list`,
  GET_STATES: `${financialplanningBaseAPIUrl}/get_states_list`,
  GET_CITIES: `${financialplanningBaseAPIUrl}/get_cities_list`,
  GET_NOMINEE_DETAILS: `${financialplanningBaseAPIUrl}/get_nominee_details`,
  ADD_NEW_CITY: `${financialplanningBaseAPIUrl}/add_new_city`,
  PENNYDROP_VALIDATION: `${financialplanningBaseAPIUrl}/bank_pennydrop_validation`,
  ADD_BANK: `${financialplanningBaseAPIUrl}/add_update_bank_details`,
  GET_CODES: `${financialplanningBaseAPIUrl}/get_codes`,
  GET_USER_BANKS_DETAILS: `${financialplanningBaseAPIUrl}/get_user_banks`,
  FETCH_USER_PROFILE_STATUS: `${financialplanningBaseAPIUrl}/fetch_user_mf_profile_status`,
  GENERATE_AOF: `${financialplanningBaseAPIUrl}/generate_aof`,
  AOF_IMAGE_UPLOAD: `${financialplanningBaseAPIUrl}/aof_image_upload`,
  GET_SLAB_LIST: `${financialplanningBaseAPIUrl}/get_slab_list`,
  GET_OCCUPATION_LIST: `${financialplanningBaseAPIUrl}/get_occupation_list`,
  CLIENT_BSE_REGISTRATION: `${financialplanningBaseAPIUrl}/client_bse_registration`,
  FATCA_UPLOAD: `${financialplanningBaseAPIUrl}/fatca_upload`,
  MANDATE_REGISTER: `${financialplanningBaseAPIUrl}/mandate_register`,
  GET_EMANDATE_AUTH_URL: `${financialplanningBaseAPIUrl}/get_emandate_auth_url`,
  SWP_REGISTERATION : `${financialplanningBaseAPIUrl}/swp_registeration`,
  SWP_CANCELLATION : `${financialplanningBaseAPIUrl}/swp_cancellation`,
  STP_CANCELLATION : `${financialplanningBaseAPIUrl}/stp_cancellation`,
  XSIPORDER_ENTRY : `${financialplanningBaseAPIUrl}/xsiporder_entry`,
  NORMALORDER_ENTRY : `${financialplanningBaseAPIUrl}/normalorder_entry`,
  GET_STOP_SIP_REASONS : `${financialplanningBaseAPIUrl}/get_stop_sip_reasons`,
  PAYMENT_GATEWAY_RESPONSE : `${financialplanningBaseAPIUrl}/payment_gateway_response`,
  // GET_PASSWORD : `${financialplanningBaseAPIUrl}/get_password`,
  // CHEQUE_IMAGE_UPLOAD : `${financialplanningBaseAPIUrl}/cheque_image_upload`, 
  // UPDATE_CLIENT_CODE : `${financialplanningBaseAPIUrl}/update_client_code`,
  // UPDATE_MANDATE_STATUS : `${financialplanningBaseAPIUrl}/update_mandate_status`,
  // UPDATE_XSIP_PAYMENT_STATUS : `${financialplanningBaseAPIUrl}/update_xsip_payment_status`,
  // MANDATE_XSIP_ORDER : `${financialplanningBaseAPIUrl}/mandate_xsip_order`,
  // UPDATE_BSE_STATUS : `${financialplanningBaseAPIUrl}/update_bse_status`,

};




// export const GET_OCCUPATION_LIST = BASE_API_FRAPPE_URL + 'master_app.api.get_occupation_list'

export const NDADETAILS = BASE_API_FRAPPE_URL + 'getndadoc'

// DG Report API End points
export const DgReportEndpoints = {
  GET_ADVISORY_RISK_APPETITE: `${financialplanningBaseAPIUrl}/get_risk_appetite`,
  GET_SURPLUS_DATA: `${financialplanningBaseAPIUrl}/get_surplus_data`,
  GET_CASH_IN_OUT_FLOW: `${financialplanningBaseAPIUrl}/get_cash_in_out_flow`,
  GET_ASSET_RECOMMENDATION: `${financialplanningBaseAPIUrl}/get_asset_recommendation`,
};

// FP Report - Retirement Planning Cashflow API End points

// FP Report - Retirement Planning Cashflow API End points
export const ReportRetirementPlanningCashflowEndpoints = {
  GET_RETIREMENT_CASHFLOW: `${financialplanningBaseAPIUrl}/retirement_cashflow`,
  GET_RECOMMENDATION_RETIREMENT_CASHFLOW: `${financialplanningBaseAPIUrl}/recommendation_retirement_cashflow`,
  GET_RETIREMENT_CORPUS: `${financialplanningBaseAPIUrl}/retirement_corpus`,
};
// FP Report - Cashflow Analysis
export const ReportCashflowAnalysisEndpoints = {
  Get_Cash_Surplus_Shortfall: `${financialplanningBaseAPIUrl}/get_cash_surplus_shortfall`,
};
// Pricing-Page-api endpoints

export const PaymentappEndpoints = {
  GET_PRICING_PLAN_LIST: `${paymentappBaseAPIUrl}/getplanlist`,
  CREATEORDERID: `${paymentappBaseAPIUrl}/createorderid`,
  GETCOUPONLIST: `${paymentappBaseAPIUrl}/getcouponlist`,
  GETEXPERTDETAILS: `${paymentappBaseAPIUrl}/get_expert_details`,
  GETPAYMENTSTATUS: `${paymentappBaseAPIUrl}/get_payment_status`,
  GETPAYMENTSUCCESS: `${paymentappBaseAPIUrl}/payment_success`,
  GETNDADOC: `${paymentappBaseAPIUrl}/getndadoc`,
  GETEXPERTNDA: `${paymentappBaseAPIUrl}/get_expert_nda`,
  PAYMENTFAIL: `${paymentappBaseAPIUrl}/paymentfail`,
  GET_BILLING_DETAILS: `${paymentappBaseAPIUrl}/get_billing_details`,
  GET_INVOICE_LIST: `${paymentappBaseAPIUrl}/get_invoice_list`,
  RENEW_PAYMENT: `${paymentappBaseAPIUrl}/renew_payment`,
  VERIFY_PAYMENT: `${paymentappBaseAPIUrl}/verify_cashfree_payment_status`,
};

export const DashboardEndpoints = {
  GET_SCORECARD_API_URL: `${financialplanningBaseAPIUrl}/get_score_card`,
  GET_NETWORTHLIABILITES_API_URL: `${financialplanningBaseAPIUrl}/getnetworthliabilitesbyuser`,
  PAR_S3_UPLOAD: `${financialplanningBaseAPIUrl}/pars3Upload`,
}

export const FpAgreementEndpoints = {
  GET_EXPERT_FP_DOCUMENT: `${financialplanningBaseAPIUrl}/get_expert_fp_document`,
  FP_EXPERT: `${financialplanningBaseAPIUrl}/fp_expert`,
  SIGN_DESK_API: `${financialplanningBaseAPIUrl}/sign_desk_api`,
  SIGN_DESK_API_CHECK: `${financialplanningBaseAPIUrl}/sign_desk_api_check`,
}

// DG - About you

export const financialplanningYourprofileEndpoints = {
  FETCH_RISK_QUESTIONS_URL: `${financialplanningBaseAPIUrl}/fetch_risk_questions`,
  FETCH_USER_RISK_ANSWERS_URL: `${financialplanningBaseAPIUrl}/fetch_user_risk_answers`,
  ADD_UPDATE_USER_RISK_ANSWERS_URL: `${financialplanningBaseAPIUrl}/add_update_user_risk_answers`,
  GET_USER_ASSUMPTIONS: `${financialplanningBaseAPIUrl}/get_user_assumptions`,
  GET_USER_INFLATIONS: `${financialplanningBaseAPIUrl}/get_user_inflations`,
}

export const financialplanningContingencyPlanningEndpoints = {
  GET_CURRENT_INSURANCE_API_URL: `${financialplanningBaseAPIUrl}/get_current_insurance`,
}

// income-api endpoints

export const financialplanningincomeEndpoints = {
  GET_USER_INCOME_CATEGORIES: `${financialplanningBaseAPIUrl}/fetch_income_categories`,
  GET_USER_INCOME_DETAILS: `${financialplanningBaseAPIUrl}/get_user_income_details`,
  ADD_USER_INCOME_DETAILS: `${financialplanningBaseAPIUrl}/add_user_income_details`,
  UPDATE_USER_INCOME_DETAILS: `${financialplanningBaseAPIUrl}/update_user_income_details`,
  DELETE_USER_INCOME_DETAILS: `${financialplanningBaseAPIUrl}/delete_user_income_details`,
  GET_INCOME_DETAILS_BY_DATE: `${financialplanningBaseAPIUrl}/get_incomedetails_bydate`,
};

// expense-api endpoints

export const financialplanningexpenseEndpoints = {
  GET_USER_EXPESNE_CATEGORIES: `${financialplanningBaseAPIUrl}/fetch_expense_categories`,
  GET_USER_EXPESNE_DETAILS: `${financialplanningBaseAPIUrl}/get_user_expense_details`,
  ADD_USER_EXPESNE_DETAILS: `${financialplanningBaseAPIUrl}/add_user_expense_details`,
  UPDATE_USER_EXPESNE_DETAILS: `${financialplanningBaseAPIUrl}/update_user_expense_details`,
  DELETE_USER_EXPESNE_DETAILS: `${financialplanningBaseAPIUrl}/delete_user_expense_details`,
  GET_EXPENSE_DETAILS_BY_DATE: `${financialplanningBaseAPIUrl}/get_expensedetails_bydate`,
};

// liabilities-api endpoints
export const financialplanningliablitiesEndpoints = {
  GET_LIABILITY_CATEGORY: `${financialplanningBaseAPIUrl}/fetch_liability_categories`,
  GET_USER_LIABILITY_DEATILS: `${financialplanningBaseAPIUrl}/get_user_liability_details`,
  ADD_USER_LIABILITY_DEATILS: `${financialplanningBaseAPIUrl}/create_user_liability_details`,
  UPDATE_USER_LIABILITY_DEATILS: `${financialplanningBaseAPIUrl}/update_user_liability_details`,
  DELETE_USER_LIABILITY_DEATILS: `${financialplanningBaseAPIUrl}/delete_user_liability_details`,
  FETCH_EXTERNAL_USER_LOAN_DETAILS: `${financialplanningBaseAPIUrl}/fetch_user_loan_details`,
  UPDATE_EXTERNAL_USER_LOAN_DETAILS: `${financialplanningBaseAPIUrl}/update_user_loan_details`,
  DELETE_EXTERNAL_LOANS: `${financialplanningBaseAPIUrl}/delete_user_loan_details`,
  FETCHEXTERNALHOLDINGDETAILS: `${financialplanningBaseAPIUrl}/fetchexternalholdingdetails`,

};

// Goal-api endpoints
export const financialplanninggoalEndpoints = {
  GET_USER_GOAL_CATEGORIES: `${financialplanningBaseAPIUrl}/fetch_goal_categories`,
  GET_USER_GOAL_DETAILS: `${financialplanningBaseAPIUrl}/get_user_goal_details`,
  ADD_USER_GOAL_DETAILS: `${financialplanningBaseAPIUrl}/add_user_goal_details`,
  UPDATE_USER_GOAL_DETAILS: `${financialplanningBaseAPIUrl}/update_user_goal_details`,
  DELETE_USER_GOAL_DETAILS: `${financialplanningBaseAPIUrl}/delete_user_goal_details`,
  GET_FINAL_GOAL_RECOMMENDATION: `${financialplanningBaseAPIUrl}/get_final_goal_recommendations`,
  GENERATE_RECORDENT_TOKEN: `${financialplanningBaseAPIUrl}/generate_recordent_token`,
  SEND_RECORDENT_OTP: `${financialplanningBaseAPIUrl}/send_recordent_consent_otp`,
  RESEND_RECORDENT_OTP: `${financialplanningBaseAPIUrl}/resend_recordent_consent_otp`,
  VERIFY_RECORDENT_OTP: `${financialplanningBaseAPIUrl}/verify_recordent_consent_otp`,
  FETCH_RECORDENT_REPORT: `${financialplanningBaseAPIUrl}/fetch_recordent_report`,
};

// Insurance-api endpoints
export const financialplanningInsuranceEndpoints = {
  GET_USER_INSURANCE_CATEGORIES: `${financialplanningBaseAPIUrl}/fetch_insurance_categories`,
  GET_USER_FETCH_ULIP_LIST: `${financialplanningBaseAPIUrl}/fetch_ulip_list`,
  GET_USER_INSURANCE_DETAILS: `${financialplanningBaseAPIUrl}/get_user_insurance_details`,
  ADD_USER_INSURANCE_DETAILS: `${financialplanningBaseAPIUrl}/add_user_insurance_details`,
  UPDATE_USER_INSURANCE_DETAILS: `${financialplanningBaseAPIUrl}/update_user_insurance_details`,
  DELETE_USER_INSURANCE_DETAILS: `${financialplanningBaseAPIUrl}/delete_user_insurance_details`,
  GET_INSURANCE_TYPE: `${financialplanningBaseAPIUrl}/get_insurance_category_type`,
  KNOW_YOUR_MEDICLAIM: `${financialplanningBaseAPIUrl}/fetch_mediclaim_questionnaire`,
  ADD_UPDATE_KNOW_YOUR_MEDICLAIM_ANSWERS: `${financialplanningBaseAPIUrl}/add_update_mediclaim_answers`,
  FETCH_KNOW_YOUR_MEDICLAIM_ANSWERS: `${financialplanningBaseAPIUrl}/fetch_user_mediclaim_answers`,
  GET_INSURANCE_IDEAL_EXISTING_COVER: `${financialplanningBaseAPIUrl}/get_insurance_ideal_existing_cover`,
  GET_MEDICAL_INSURANCE: `${financialplanningBaseAPIUrl}/get_medical_insurance`,
};

// Asset-api endpoints

export const financialplanningAssetEndpoints = {
  GET_USER_ASSET_CATEGORIES: `${financialplanningBaseAPIUrl}/fetch_asset_categories`,
  FECTH_USER_ASSET_DETAILS: `${financialplanningBaseAPIUrl}/userassetdetails`,
  ADD_USER_ASSET_DETAILS: `${financialplanningBaseAPIUrl}/save_user_asset_details`,
  UPDATE_USER_ASSET_DETAILS: `${financialplanningBaseAPIUrl}/update_user_asset_details`,
  DELETE_USER_ASSET_DETAILS: `${financialplanningBaseAPIUrl}/delete_user_asset_details`,
  CALCULATE_EPF_MATURITY_AMOUNT: `${financialplanningBaseAPIUrl}/calculate_epf_maturity_amount`,
  GET_SCHEME_LIST_BY_CATEGORY: `${financialplanningBaseAPIUrl}/get_scheme_list_by_category`
};

export const financialplanningDocumentEndpoints = {
  GET_USER_DOCUMENT_DETAILS: `${financialplanningBaseAPIUrl}/fetch_user_document_details`,
  UPLOAD_USER_DOCUMENT_API: `${financialplanningBaseAPIUrl}/upload_user_document_details`,
  DELETE_USER_DOCUMENT_API: `${financialplanningBaseAPIUrl}/delete_user_document_details`,
  GET_DOCTYPE_API: `${financialplanningBaseAPIUrl}/get_doctype`,
};

// financial Planning report endpoints
export const financialPlanningReportsEndpoints = {
  GET_PLAN_OF_ACTION: `${financialplanningBaseAPIUrl}/get_plan_of_action`,
};

export const taxplanningEndpoints = {
  GET_APPOINTMENT_DETAILS: `${financialplanningBaseAPIUrl}/get_appointment_details`,
  UPDATE_APPOINTMENT_DETAILS: `${financialplanningBaseAPIUrl}/update_appointment_details`,
  CREATE_APPOINTMENT_DETAILS: `${financialplanningBaseAPIUrl}/create_appointment`,
  GET_DOCUMENT_DETAILS: `${financialplanningBaseAPIUrl}/get_appointment_documents`,
  UPLOAD_DOCUMENT_DETAILS: `${financialplanningBaseAPIUrl}/upload_appointment_documents`,
  DELETE_DOCUMENT_DETAILS: `${financialplanningBaseAPIUrl}/delete_appointment_documents`,
  GET_DOCUMENT_LIST_BY_CATEGORY: `${financialplanningBaseAPIUrl}/get_document_list_by_category`,
};

export const familyEndpoints = {
  ADD_FAMILY_MEMBER: `${familyBaseAPIUrl}/add_family_member`,
};

export const reportHubEndpoints = {
  SEND_OTP_FOR_CAMS: `${financialplanningBaseAPIUrl}/send_otp_for_cams`,
  CAPITAL_GAIN_REPORT_URL: `${financialplanningBaseAPIUrl}/capital_gain_report`,
  GET_CAPITAL_GAIN_STATUS: `${userManagementBaseAPIUrl}/get_capital_gain_status`
};

// Portfolio Report API endpoints
export const portfolioReportEndpoints = {
  PORTFOLIO_REPORT_API: `${financialplanningBaseAPIUrl}/generate_portfolio_report`,
  GET_ASSET_LIST: `${financialplanningBaseAPIUrl}/get_asset_list`,
  GET_SC_CHECK_STATUS: `${financialplanningBaseAPIUrl}/fetch_ecas_status`,
};

// For SchemeList API endpoints

export const ExternalAPIListEndpoints = {

  // For MF, usEquity
  GETSCHEMEMFLIST: `${financialplanningBaseAPIUrl}/getschemelist`,
  GETUSEQUITYLIST: `${financialplanningBaseAPIUrl}/getusequityshares`,
  GETSHARESDATA: `${financialplanningBaseAPIUrl}/get_shares_data`,
  GET_US_EQUITY_SHARES: `${financialplanningBaseAPIUrl}/get_us_equity_shares`,



  // For Link your holdings mf

  CHECKPANEXISTS: `${financialplanningBaseAPIUrl}/check_pan`,
  GETJWTTOKEN: `${financialplanningBaseAPIUrl}/generatemfjwttoken`,
  GETTRANSACTION: `${financialplanningBaseAPIUrl}/generatemftxnid`,
  SENDMFOTP: `${financialplanningBaseAPIUrl}/sendmfotp`,
  VERIFYMFOTP: `${financialplanningBaseAPIUrl}/verifymfotp`,
  FETCHEXTERNALHOLDINGDETAILS: `${financialplanningBaseAPIUrl}/fetchexternalholdingdetails`,
  FETCHEXTERNALMFDETAILS: `${financialplanningBaseAPIUrl}/fetchexternalmfdetails`,
  DELETESMALLCASEACCOUNT: `${financialplanningBaseAPIUrl}/deleteexternalmfholdings`,
  AUTOFETCHFINVUDATA: `${financialplanningBaseAPIUrl}/autofetchfinvudata`,

  FETCHECASDATA: `${financialplanningBaseAPIUrl}/fetch_ecas_data`,

  GENERATEPARSNIPPET: `${financialplanningBaseAPIUrl}/generateParSnippet`,

  // For Link your holdings EPF

  // GETUANEXITS: `${financialplanningBaseAPIUrl}/check-uan-exists`,
  // GETEPFDATA: `${financialplanningBaseAPIUrl}/get-epf-data`,
  // DELETEEPFDATA: `${financialplanningBaseAPIUrl}/delete-epf-data`,
  // SENDEPFOTP: `${financialplanningBaseAPIUrl}/send-epf-otp`,
  // VERIFYEPFOTP: `${financialplanningBaseAPIUrl}/verify-epf-otp`,

  CHECK_UAN_EXISTS: `${financialplanningBaseAPIUrl}/check_uan_exists`,
  SEND_EPF_OTP: `${financialplanningBaseAPIUrl}/send_epf_otp`,
  VERIFY_EPF_OTP: `${financialplanningBaseAPIUrl}/verify_epf_otp`,
  GET_EPF_DATA: `${financialplanningBaseAPIUrl}/get_epf_data`,
  // GET_EPF_DATA: `${financialplanningBaseAPIUrl}/get_epf_data`,
  DELETE_EXTERNAL_EPF_HOLDINGS: `${financialplanningBaseAPIUrl}/delete_external_epf_holdings`,


  // For Finvu CDSL & NSDL

  FINVULOGIN: 'https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/User/Login',
  FINVUCONSENTREQUESTPLUS: 'https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/ConsentRequestPlus',

  // Link your Demat

  UPDATEEXTERNALSTOCKHOLDINGS: `${financialplanningBaseAPIUrl}/updateexternalstockholdings`,
  DELETEEXTERNALSTOCKHOLDINGS: `${financialplanningBaseAPIUrl}/deleteexternalstockholdings`,
}

export const CrmAPIEndPoints = {
  MAINTENANCE_DETAILS: `${CRM_FRAPPE_URL}/get_maintenance_info`,
}