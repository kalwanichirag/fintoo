
import React, { useEffect, useState } from "react";
import "./dashboard.css";
import "./mainData.css";
import "./payment.css";
//import { useEffect, useState } from "react";
import FundList from "./components/Pages/MF_List";
import { HelmetProvider } from "react-helmet-async";
import Main from "./Pages/DMF/Main";
import USstocks from "./Pages/DMF/USstocks";
import Compare from "./components/Pages/Compare";
import MutualFund from "./components/Pages/MutualFund";
import Profile from "./components/Pages/Profile";
import MyCartSelectBank from "./components/Pages/Transaction/MyCartSelectBank";
import MyCartAutoPay from "./components/Pages/Transaction/MyCartAutoPay";
import MyCartSIPInstallment from "./components/Pages/Transaction/MyCartSIPInstallment";
import MyCartPaymentmode from "./components/Pages/Transaction/MyCartPaymentmode";
import CartUPI from "./components/Pages/Transaction/CartUPI";
import Mandate from "./components/Pages/Transaction/Mandate";
import NeftRtgs from "./components/Pages/Transaction/NeftRtgs";
import NetBanking from "./components/Pages/Transaction/NetBanking";
import NeftRtgsDetails from "./components/Pages/Transaction/NeftRtgsDetails";
import MandateDetails from "./components/Pages/Transaction/MandateDetails";
import RedirectNow from "./components/RedirectNow";
import { Provider } from "react-redux";
import { createStore } from "redux";
import fintooReducer from "./fintooReducer";
import ProfileInsiderDashboard from "./Pages/DMF/ProfileInsider/Index";
import ProfileInsiderBankAccount from "./Pages/DMF/ProfileInsider/BankAccount";
import ProfileInsiderNominee from "./Pages/DMF/ProfileInsider/Nominee";
import PaymentSucess from "./components/Pages/ErrosPages/PaymentSuccess";
import PaymentFailed from "./components/Pages/ErrosPages/PaymentFailed";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ProfileMandate from "./Pages/DMF/ProfileInsider/ProfileMandate";
import Manadatestatus from "./Pages/DMF/ProfileInsider/Manadatestatus";
import AddMembers from "./Pages/DMF/ProfileInsider/AddMembers";
import PortfolioDashboard from "./Pages/DMF/Portfolio/Dashboard";
import PortfolioEcasUpload from "./Pages/DMF/Portfolio/EcasUpload";
import PortfolioTransaction from "./Pages/DMF/Portfolio/Transactions/Transaction";
import PortfolioFund from "./Pages/DMF/Portfolio/Fund";
import Terms from "./Pages/Terms";
import PricingPage from "./Pages/Pricing";
import RegisterOTP from "./Pages/RegisterOTP";
import RetirementServices from "./Pages/RetirementServices";
import TaxPlanningStrategies from "./Pages/TaxPlanningStrategies";
import InvestmentPlanning from "./Pages/InvestmentPlanning";
import AboutYou from "./Pages/datagathering/AboutYou";
import IncomeExpense from "./Pages/datagathering/IncomeExpense";
import AssetsLiabilities from "./Pages/datagathering/AssetsLiabilities";
import Goals from "./Pages/datagathering/Goals";
import CommonDashboard from "./Pages/DMF/CommonDashboard/index";
import Investment from "./Pages/DMF/CommonDashboard/Investment";
import Insurance from "./Pages/datagathering/Insurance";
import Intro from "./Pages/datagathering/Intro";
import MyDocuments from "./Pages/datagathering/MyDocuments";
import YourProfile from "./Pages/datagathering/YourProfile";
import AssetsLib from "./Pages/datagathering/AssetsLib";
import Goalanalysis from "./Pages/datagathering/Goalanalysis";
import RetirementPlanning from "./Pages/datagathering/RetirementPlanning";
import CashinFlow from "./Pages/datagathering/CashinFlow";
import Contingencyplanning from "./Pages/datagathering/Contingencyplanning";
import CheckRedirect from "./Pages/CheckRedirect";
import "react-toastify/dist/ReactToastify.css";
import FintooToast from "./components/HTML/FintooToast";
import Logout from "./Pages/Logout";
import GrievanceMechanism from "./Pages/GrievanceMechanism";
import ComplaintsStatus from "./Pages/ComplaintsStatus";
import InvestorCharter from "./Pages/InvestorCharter";
import AboutUs from "./Pages/AboutUs";
import Privacypolicy from "./Pages/Privacypolicy";
import Events from "./Pages/Events";
import News from "./Pages/News";
import Contactus from "./Pages/Contactus";
import NetworthGoals from "./Pages/DMF/CommonDashboard/NetworthGoals";
import Triggers from "./Pages/DMF/ManageTriggers/Triggers";
import PersonalTax from "./Pages/DMF/CommonDashboard/PersonalTax";
import Transaction from "./Pages/DMF/CommonDashboard/Transaction";
import Homepage from "./Pages/index";
import Insurance1 from "./Pages/Insurance1";
import RetirementPlanningPage from "./Pages/RetirementPlanning";
import DirectMF from "./Pages/DirectMF";
import Stockadvisory from "./Pages/Stockadvisory";
import InternationalEquity from "./Pages/InternationalEquity";
import NriTaxitionLandingPage from "./Pages/NriTaxationLandingPage";
import VirtualItrHelpdesk from "./Pages/VirtualItrHelpdesk";
import IpoPage from "./Pages/Ipo";
import TaxPlanning from "./Pages/TaxPlanning";
import BondInvestment from "./Pages/BondInvestment";
import Notices from "./Pages/Notices";
import ThankyouSection from "./components/ThankyouSection";
import InvestPlanning from "./Pages/InvestPlanning";
import EventsPage from "./Pages/EventsPage";
import MainHeader from "./components/MainHeader";
import PlanofAction from "./Pages/DMF/CommonDashboard/PlanofAction";
import Footer from "./components/HTML/Footer";
import NDA from "./Pages/userflow/NDA/NDA";
import Services from "./Pages/userflow/Services/Services";
import ProfileUserFlow from "./Pages/userflow/Profile/Profile";
import ProfileFillDetails from "./Pages/userflow/ProfileFillDetails/Index";
import Invoice from "./Pages/userflow/Invoice/Invoice";
import ComplianceAuditStatus from "./Pages/userflow/ComplianceAuditStatus/ComplianceAuditStatus";
import Expert from "./Pages/Expert/Expert";
import FintooLoader from "./components/FintooLoader";
import IncompleteRegistration from "./components/Portfolio/IncompleteRegistration";
import AssistedUAE from "./Pages/AssistedUAE";
import LInkyourholdings from "./Pages/DMF/Portfolio/LInkyourholdings";
import FintooReport from "./Pages/FintooReport/FintooReport";
import CalcList from "./Pages/CalcList";
import ITRPlan from "./Pages/ITRPlan";
import ITRRegister from "./Pages/ITRFlow/Register/ITRRegister";
import ItrUploadDocs from "./Pages/ItrUploadDocs";
import PlanSubscription from "./Pages/ITRFlow/Subscription/PlanSubscription";
import UpgradePlan from "./Pages/ITRFlow/Subscription/UpgradePlan";

import PaymentPage from "./Pages/Payment";
import PaymentExpertPage from "./Pages/PaymentExpert";
import Appointment from "./Pages/ITRFlow/Appointment/Appointment";
import ITRThankyou from "./Pages/ITRFlow/ITRThankyou/ITRThankyou";
import AssistedUAEDubai from "./Pages/AssistedUAEDubai";
import ItrFilling from "./Pages/itr-for-uae/itr-filling";
import ITRFileLanding from "./Pages/ITRFileLanding";
import Contactus2 from "./Pages/Contactus2";
import ITRFileLandingae from "./Pages/ITRFileLandingae";
import VerificationDocuments from "./Pages/datagathering/VerificationDocuments";

// import AskFintoo from "./components/AskFintoo";
import Title from "./components/Title";
import NewFdBondsForm from "./Pages/DMF/CommonDashboard/NewFdBondsFormViews/NewFdBondsForm";
import ItrFillingPrnam from "./Pages/ItrFillingPrnam";
import ITRNewThankyou from "./Pages/ITRFlow/ITRThankyou/ITR-new-thank-you";
import NewInsuranceForm from "./Pages/DMF/CommonDashboard/NewInsuranceFormViews/NewInsuranceForm";
import NewRealEstateForm from "./Pages/DMF/CommonDashboard/NewRealEstateFormViews/NewRealEstateForm";
import NewGoldForm from "./Pages/DMF/CommonDashboard/NewGoldFormViews/NewGoldForm";
import NewGovtSchemesForm from "./Pages/DMF/CommonDashboard/NewGovtSchemesViews/NewGovtSchemesForm";
import NewAlternateAssetsForm from "./Pages/DMF/CommonDashboard/NewAlternateAssetsFormViews/NewAlternateAssetsForm";
import NewLiquidAssetForm from "./Pages/DMF/CommonDashboard/NewLiquidAssetFormViews/NewLiquidAssetForm";
import PortfolioReport from "./Pages/DMF/Portfolio/PortfolioReport";
import ReportDetails from "./components/PortfolioReport/ReportDetails";
import IPODetails from "./components/Stocks/IPOStock/IPODetails";
import DigiLockerSuccess from "./Pages/datagathering/AboutYouPages/DigiLockerSuccess";
import BondsList from "./Pages/Bonds/index";
import BondsDetails from "./components/Bonds/BondsDetails";
import Expertfp from "./Pages/Expertfp";
import PaymentSuccessPopup from "./Pages/PaymentSuccessPopup";
import PaymentFailurePopup from "./Pages/PaymentFailurePopup";
import Wealthmanagement from "./Pages/Wealthmanagement";
import Bankselect from "./Pages/datagathering/BankCashbalance/Bankselect";
import Waiting from "./Pages/datagathering/BankCashbalance/Waiting";
import Accountnotfound from "./Pages/datagathering/BankCashbalance/Accountnotfound";
import MobileNumber from "./Pages/datagathering/BankCashbalance/MobileNumber";
import BankAccountSelection from "./Pages/datagathering/BankCashbalance/BankAccountSelection";
import ConfirmConsent from "./Pages/datagathering/BankCashbalance/ConfirmConsent";
import BankReqProgressBar from "./Pages/datagathering/BankCashbalance/BankReqProgressBar";
import TransactionInfo from "./Pages/DMF/Portfolio/Transactions/TransactionInfo";
import Expertnda from "./Pages/Expertnda";
import SessionExpired from "./components/Pages/ErrosPages/SessionExpired";
import AddMemberOptions from "./Pages/DMF/ProfileInsider/AddMembers/AddMemberOptions";
import AddMinorView from "./Pages/DMF/ProfileInsider/AddMembers/AddMinorView";
import PortfolioHoldingsReportDetails from "./Pages/DMF/Portfolio/reports/PortfolioHoldingsReportDetails";
import Mandate_limit from "./components/Pages/Transaction/Mandate_limit";
import Bankverificationlink from "./components/Pages/Transaction/Bankverificationlink";
import BankTrackingOverView from "./Pages/MoneyManagement/views/BankTrackingOverView/BankTrackingOverView";
import TrackbankAccount from "./Pages/MoneyManagement/views/BankAccountTracking/TrackbankAccount";
import TrackbankAccount2 from "./Pages/MoneyManagement/views/BankAccountTracking/TrackbankAccount2";
import TrackbankAccount3 from "./Pages/MoneyManagement/views/BankAccountTracking/TrackbankAccount3";
import AccountBalance from "./Pages/MoneyManagement/views/AccountBalance/AccountBalance";
import PortfolioBalance from "./components/PortfolioBalance";
import AutoLogout from "./components/AutoLogout";
import SelectBanklumpsum from "./components/Pages/Transaction/SelectBanklumpsum";
import ExpertAppointment from "./Pages/ExpertAppointment";
import TaxPaymentPage from "./Pages/TaxPayment";
import NewOtherAssetsForm from "./Pages/DMF/CommonDashboard/NewOtherAssetsFormViews/NewOtherAssetsForm";
import DashBoard from "./Pages/MoneyManagement/views/AccountBalance/DashBoard";
import UploadDocsPage from "./Pages/UploadDocsPage";
import Personal_finance from "./Pages/Personal_finance";
import Signup from "./Pages/SignUp/Signup";
// import { motion } from "framer-motion";
import FHC from "./Pages/FHC/FHC";
import UpdateUser from "./Pages/UpdateUser";
import SelectBankForSip from "./components/Pages/Transaction/SelectBankForSip";
import NewCart from "./components/Pages/Transaction/NewCart";
import MFSnippet from "./Pages/MFSnippet";
import UserForm from "./Pages/UserForm";
import NewUsEquityForm from "./Pages/DMF/CommonDashboard/NewUsEquityFormViews/NewUsEquityForm";
import NewUnlisted_Aif_EquityForm from "./Pages/DMF/CommonDashboard/NewUnlisted_Aif_EquityFormViews/NewUnlisted_Aif_EquityForm";
import FinancialPlanningPage from "./Pages/FinancialPlanningPage";
import FinancialAdvicePage from "./Pages/financialadvicepage";
import PersonalFinancialPlan from "./Pages/wpPages/Personal-financial-Planning";
import LoanAgainstMF from "./Pages/Lamf/LoanAgainstMF";
import LoanApplyNow from "./Pages/Lamf/LoanApplyNow";
import AddPanDetails from "./Pages/AddPanDetails";
import NewPlanningpage from "./Pages/NewPlanningpage";
import LocationListener from "./LocationListener";
import FinancialPlanningPageCalendly from "./Pages/wpPages/FinancialPlanningPageCalendly";
import WealthManagementCalendly from "./Pages/wpPages/WealthManagementCalendly";
import GlobalLandingPage from "./Pages/wpPages/GlobalLandingPage";
import FinancialPlanningPageMF from "./Pages/MFSnippet";
import { useScrollPercentageTrigger } from "./Utils/PageInteractions/ScrollTracker";
import { AuthPage } from "./Pages/FrappeIntegration-Pages/AuthPage";
import UseFlowInputs from "./components/Onboardflow";
import VerifyMobileNumber from "./Pages/FrappeIntegration-Pages/verify-mobile-number";
import AuthCheck from "./Pages/FrappeIntegration-Pages/AuthFlow/AuthCheck";
import ScrollToTop from "./ScrollToTop";
import ApexChartsPage from "./components/Pages/Graph/Mobile_Graph";
import MobileVerificationPage from "./components/Mobileverifycheck";
import VerificationDocumentCheck from "./components/VerificationDocumentCheck";
import MobileVerify from "./Pages/FrappeIntegration-Pages/verify-mobile-number/page";
import OnboardflowPage from "./components/Mobileverifycheck/Onboardflow";
import ProtectedPage from "./Services/ProtectedPage";
import RetirementPlanningNew from "./Pages/retirement-planning/RetirementPlanningNew";
import InvestmentPlanningNew from "./Pages/Invest-planning/InvestmentPlannning";
import ThankYouPage from "./Pages/Thankyoupage/Thankyoupage";
import AdvanceTaxCalculator from "./Pages/Tax-calculators/AdvanceTaxCalculator";
import InvestmentPlanningNewB from "./Pages/Invest-planning-b/InvestmentPlannning";
import WomoneyaPage from "./Pages/womoneya/WomoneyaPage";
import MainCssLoader from "./MainCssLoader";
import CashfreeCheckoutPage from "./Pages/CashfreePaymentChekout";
const store = createStore(fintooReducer);
function AppShell() {
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [pageurl, setPageurl] = useState(false);

  const currentPath = location.pathname;
  const normalizedPath = currentPath.replace(/\/+$/, "") || "/";


  let containsMutualFundSnippet = normalizedPath.includes('mutual-fund-snippet') || normalizedPath.includes('connect-with-us') || normalizedPath.includes('personal-financial-plan') || normalizedPath.includes('New-Page');

  let hideScrollToTop = normalizedPath.includes('financial-planning')

  useEffect(() => {
    setIsLoading(false);
    // checkLogin();
    // console.log(isUnderMaintena  nce(), "heh");
    // checkUnderMaintenance();
  }, []);

  const checkLogin = async () => {
    // try {
    //   const r = await fetchEncryptData({
    //     method: "post",
    //     url: CHECK_SESSION,
    //     data: {
    //       user_id: getParentUserId(),
    //       sky: getItemLocal("sky"),
    //     },
    //   });
    // } catch (e) { }
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.target.type === 'number') {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    // console.log("isLoading", isLoading);
    if (isLoading == false) {
      document.body.classList.add("bgImagClass");
    } else {
      document.body.classList.remove("bgImagClass");
    }
  }, [isLoading]);

  //check login
  // const checkLogin = async () => {
  //   try {
  //     const r = await fetchEncryptData({
  //       method: "post",
  //       url: CHECK_SESSION,
  //       data: {
  //         user_id: getParentUserId(),
  //         sky: getItemLocal("sky"),
  //       },
  //     });
  //   } catch (e) { }
  // };
  const pageVariants = {
    initial: {
      opacity: 0,
      y: "-100vw" // Initial position outside the viewport to the left
    },
    animate: {
      opacity: 1,
      y: 0, // Move to the center of the viewport
      transition: {
        duration: .7 // Animation duration
      }
    },
    exit: {
      opacity: 0,
      y: "100vw", // Move outside the viewport to the right
      transition: {
        duration: .7 // Animation duration
      }
    }
  };

  useScrollPercentageTrigger((percentage, direction) => {
    if (!window?.webengage?.track) {
      return;
    }

    if (direction === "forward") {
      window.webengage.track("forward scroll", {
        "scroll percentages": percentage
      })
    } else {
      window.webengage.track("backward scroll", {
        "scroll percentages": percentage
      })
    }
  });

const hidePaths = [
  "/approve-computation",
  "/retirement-planning",
  "/investment-planning",
  "/financial-advice",
   "/thankyou-page",
   "/investment-plan",
 
 ];
  
  

const shouldHideHeaderFooter = hidePaths.some((path) => {
  return normalizedPath === path || normalizedPath.startsWith(`${path}/`);
});

const hideHeaderOnlyPaths = [
  "/womoneya",
  "/womoneya-choice",
];

const shouldHideHeaderOnly = hideHeaderOnlyPaths.some((path) => {
  return normalizedPath === path || normalizedPath.startsWith(`${path}/`);
});

const shouldHideHeader = shouldHideHeaderFooter || shouldHideHeaderOnly;



  return (
    <Provider store={store}>
      <HelmetProvider>
        <FintooLoader isLoading={isLoading} />

        <FintooToast />
        {/* <ScrollToTop
          smooth
          color="#fff"
          style={{
            backgroundColor: "#042b62",
            borderRadius: "50%",
            fontSize: "25px",
            fontWeight: "bold",
            display: "none",
          }}
        /> */}


        {/* <ScrollTracker onTrigger={handleScrollTrigger} /> */}
        <AutoLogout />
        <MobileVerificationPage />
        <VerificationDocumentCheck />
        <OnboardflowPage />
        {/* <ProtectedPage /> */}
          <MainCssLoader/>

          <ScrollToTop />
          <AuthCheck />
          {/* <Header /> */}
          <LocationListener />
          {/* {
            !hideScrollToTop && <FintooScrollToTop />
          } */}
          {/* <CallHeader /> */}
          {!shouldHideHeader && isLoading == false && <MainHeader />}
          <Title />
          {/* <NomineeInfoModal /> */}

          {/* {!containsMutualFundSnippet && <AskFintoo />} */}
          <Routes>
            {/* <Route exact path={`/`} element={<RedirectNow />} /> */}
            <Route element={<ProtectedPage />}></Route>
            
            <Route exact path={`/`} element={<Homepage />} />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/`}
              element={<Homepage />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/tax-calculators`}
              element={<CalcList />}
            />
            {/* <Route
              exact
              path={`${process.env.PUBLIC_URL}/financial-planning-page`}
              element={<FinancialPlan />}
            /> */}

            {/* Catch /blog paths 
            */}
            <Route
              path="/blog/*"
              element={<BlogRedirect />}
            />
                
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/risk-management`}
              element={<Insurance1 />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/advance-tax-calulator`}
              element={<AdvanceTaxCalculator />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-funds`}
              element={<DirectMF />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/international-equity`}
              element={<InternationalEquity />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/nri-taxation`}
              element={<NriTaxitionLandingPage />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/ipo`}
              element={<IpoPage />}
          />
           <Route
              exact
              path={`${process.env.PUBLIC_URL}/womoneya`}
            element={<WomoneyaPage />}
            
          />
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/womoneya-choice`}
            element={<WomoneyaPage variant="association" />}
          />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/tax-planning-page`}
              element={<TaxPlanning />}
            />
            {/* <Route
              exact
              path={`${process.env.PUBLIC_URL}/itr-file`}
              element={<ITRFile />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/itr_2024`}
              element={<ITRFile />}
            /> */}
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/income-tax-filing`}
              element={<ITRFileLanding />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/income-tax-filing-ae`}
              element={<ITRFileLandingae />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/itr-plan`}
              element={<ITRPlan />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/bond-investment`}
              element={<BondInvestment />}
            />
            {/* <Route exact path={`${process.env.PUBLIC_URL}/retirement-planning`} element={<RetirementPlanningNew />} />
            <Route exact path={`${process.env.PUBLIC_URL}/investment-planning`} element={<InvestmentPlanningNew />} />
                        <Route exact path={`${process.env.PUBLIC_URL}/investment-plan`} element={<InvestmentPlanningNewB />} /> */}

            {/* <Route
              exact
              path={`${process.env.PUBLIC_URL}/financial-advice/`}
              element={<FinancialAdvicePage />}
            /> */}
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/notices`}
              element={<Notices />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/retirement-planning-page`}
              element={<RetirementPlanningPage />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/stock-advisory`}
              element={<Stockadvisory />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/virtual-itr-helpdesk`}
              element={<VirtualItrHelpdesk />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/investment-planning-page`}
              element={<InvestPlanning />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/verification-docs`}
              element={<VerificationDocuments />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/thank-you-page`}
              element={<ThankyouSection />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/checkredirect`}
              element={<CheckRedirect />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund`}
              element={<RedirectNow />}
            />
            {/* <Route exact  path={`${process.env.PUBLIC_URL}/direct-mutual-fund/FundList`}element={<FundList />}/> */}
            {/* <Route exact  path={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds`} element={<FundList />}/> */}
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/:tabName`}
              element={<FundList />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/landing-page`}
              element={<Main />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/Us-stocks`}
              element={<USstocks />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/Profile`}
              element={<Profile />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/MyCart`}
              // element={<MyCart />}
              element={<NewCart />}
            />
            {/* <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/new-cart`}
              element={<NewCart />}
            /> */}
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/MyCartSelectBank`}
              element={<MyCartSelectBank />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/select-bank-for-sip`}
              element={<SelectBankForSip />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/MutualFund/:slug`}
              element={<MutualFund />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/Compare`}
              element={<Compare />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/MyCartAutoPay`}
              element={<MyCartAutoPay />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/MyCartPaymentmode`}
              element={<MyCartPaymentmode />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/MyCartSIPInstallment`}
              element={<MyCartSIPInstallment />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/dashboard`}
              element={<ProfileInsiderDashboard />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/AddMembers`}
              element={<AddMembers />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/updateMember`}
              element={<UpdateUser />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/AddMembersOptions`}
              element={<AddMemberOptions />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/AddMinor`}
              element={<AddMinorView />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/dashboard/bankaccount`}
              element={<ProfileInsiderBankAccount />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/dashboard/Nominee`}
              element={<ProfileInsiderNominee />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/dashboard/bankaccount/ProfileMandate`}
              element={<ProfileMandate />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/dashboard/bankaccount/ProfileMandate/Manadatestatus`}
              element={<Manadatestatus />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/CartUPI`}
              element={<CartUPI />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/Mandate`}
              element={<Mandate />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/NeftRtgs`}
              element={<NeftRtgs />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/NeftRtgs`}
              element={<NeftRtgs />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/NetBanking`}
              element={<NetBanking />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/NeftRtgsDetails`}
              element={<NeftRtgsDetails />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/MandateDetails`}
              element={<MandateDetails />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentSucess`}
              element={<PaymentSucess />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentFailed`}
              element={<PaymentFailed />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard`}
              element={<PortfolioDashboard />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/link-your-holdings`}
              element={<LInkyourholdings />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/add-pan-details`}
              element={<AddPanDetails />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/ecas-upload`}
              element={<PortfolioEcasUpload />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/transaction`}
              element={<PortfolioTransaction />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/transactionInfo/:transaction_id`}
              element={<TransactionInfo />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/fund`}
              element={<PortfolioFund />}
            />
            {/* <Route
              exact
              path={`${process.env.PUBLIC_URL}/stocks`}
              element={<StockList />}
            /> */}
            {/* <Route
              exact
              path={`${process.env.PUBLIC_URL}/stocks/list`}
              element={<StockList />}
            /> */}
            {/* <Route
              exact
              path={`${process.env.PUBLIC_URL}/stocks/details`}
              element={<StockDetails />}
            /> */}
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/login/mtP8we29q7h5ZULx/`}
              // element={<Login />}
              element={<AuthPage />}
            />

            {/* <Route
              exact
              path={`${process.env.PUBLIC_URL}/login`}
              element={<LoginWithOTP />}
            /> */}

            {/* <Route exact path={`${process.env.PUBLIC_URL}/login-with-otp`} element={<LoginWithOTP />} /> */}
            {/* <Route
              exact
              path={`${process.env.PUBLIC_URL}/register`}
              element={<Register />}
            /> */}
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/register-otp`}
              element={<RegisterOTP />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/terms-conditions`}
              element={<Terms />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/grievance-mechanism`}
              element={<GrievanceMechanism />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/complaints-status`}
              element={<ComplaintsStatus />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/investor-charter`}
              element={<InvestorCharter />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/compliance-audit-status`}
              element={<ComplianceAuditStatus />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/privacy-policy`}
              element={<Privacypolicy />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/pricing`}
              element={<PricingPage />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/expert-appointment`}
              element={<ExpertAppointment />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/documents-upload`}
              element={<UploadDocsPage />}
            />
            {/* <Route
              exact
              path={`${process.env.PUBLIC_URL}/financial-planning-page`}
              element={<FinancialPlanning />}
            /> */}
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/retirement-services`}
              element={<RetirementServices />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/tax-planning-page-strategies`}
              element={<TaxPlanningStrategies />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/investment-planning-page-page`}
              element={<InvestmentPlanning />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/about-us`}
              element={<AboutUs />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/news`}
              element={<News />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/our-events`}
              element={<Events />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/our-events/:type`}
              element={<Events />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/our-events-page/*`}
              element={<EventsPage />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/contact`}
              element={<Contactus />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/about-you`}
              element={<AboutYou />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/goals`}
              element={<Goals />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/income-expenses`}
              element={<IncomeExpense />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/assets-liabilities`}
              element={<AssetsLiabilities />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/Insurance`}
              element={<Insurance />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/my-document`}
              element={<MyDocuments />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/report/intro`}
              element={<Intro />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/report/profile`}
              element={<YourProfile />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/report/assets-liabilities`}
              element={<AssetsLib />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/report/goal-analysis`}
              element={<Goalanalysis />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/report/risk-management`}
              element={<Contingencyplanning />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/report/retirement-corpus`}
              element={<RetirementPlanning />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/report/cash-flow-management`}
              element={<CashinFlow />}
            />
            {/* <Route exact  path={`${process.env.PUBLIC_URL}/direct-mutual-fund/commondashboard/dashboard`}element={<CommonDashboard />}/>
            <Route exact  path={`${process.env.PUBLIC_URL}/direct-mutual-fund/commondashboard/FinancePlan`}element={<CommonDashboard />}/> */}

            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard`}
              element={<CommonDashboard />}
            />

            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/Investment`}
              element={<Investment />}
            />

            {/* <Route exact path={`${process.env.PUBLIC_URL}/commondashboard/report`} element={< />} /> */}
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/PersonalTax`}
              element={<PersonalTax />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/Transaction`}
              element={<Transaction />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/NetworthGoals`}
              element={<NetworthGoals />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/Plan-of-Action`}
              element={<PlanofAction />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/Trigger/ManageTriggers`}
              element={<Triggers />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/logout`}
              element={<Logout />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/userflow/nda`}
              element={<NDA />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/userflow/Services`}
              element={<Services />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/userflow/Profile`}
              element={<ProfileUserFlow />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/userflow/profile-fill-details`}
              element={<ProfileFillDetails />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/userflow/invoice`}
              element={<Invoice />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/userflow/compliance-audit-status`}
              element={<ComplianceAuditStatus />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/userflow/payment`}
              element={<PaymentPage />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/userflow/expert-payment`}
              element={<TaxPaymentPage />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/userflow/expertpayment`}
              element={<PaymentExpertPage />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/expert`}
              element={<Expert />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/IncompleteRegistration`}
              element={<IncompleteRegistration />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/nri-desk`}
              element={<AssistedUAE />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/nri-desk-dubai`}
              element={<AssistedUAEDubai />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/itr-profile`}
              element={<ITRRegister />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/itr-upload-docs`}
              element={<ItrUploadDocs />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/itr-plan-subscription`}
              element={<PlanSubscription />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/itr-plan-upgrade`}
              element={<UpgradePlan />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/itr-Appointment`}
              element={<Appointment />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/itr-thank-you`}
              element={<ITRThankyou />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/approve-computation`}
              element={<ITRNewThankyou />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/thankyou-page`}
              element={<ThankYouPage />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/fintoo-report`}
              element={<FintooReport />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/itr-for-uae/itr-filling`}
              element={<ItrFilling />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/itr-filing-prnam`}
              element={<ItrFillingPrnam />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/contact-us`}
              element={<Contactus2 />}
            />

            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-fd-bonds`}
              element={<NewFdBondsForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-fd-bonds/:id`}
              element={<NewFdBondsForm />}
            />

            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-insurance`}
              element={<NewInsuranceForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-insurance/:id`}
              element={<NewInsuranceForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-others-asset`}
              element={<NewOtherAssetsForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-others-asset/:id`}
              element={<NewOtherAssetsForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-real-estate`}
              element={<NewRealEstateForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-real-estate/:id`}
              element={<NewRealEstateForm />}
            />

            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-gold-asset`}
              element={<NewGoldForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-gold-asset/:id`}
              element={<NewGoldForm />}
            />

            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-govt-scheme`}
              element={<NewGovtSchemesForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-govt-scheme/:id`}
              element={<NewGovtSchemesForm />}
            />

            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-alternet-asset`}
              element={<NewAlternateAssetsForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-alternet-asset/:id`}
              element={<NewAlternateAssetsForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-liquid-asset`}
              element={<NewLiquidAssetForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-liquid-asset/:id`}
              element={<NewLiquidAssetForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-alternet-asset/:id`}
              element={<NewAlternateAssetsForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-us-equity-asset`}
              element={<NewUsEquityForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-us-equity-asset/:id`}
              element={<NewUsEquityForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-unlisted-aif-equity-asset`}
              element={<NewUnlisted_Aif_EquityForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/investment/new-unlisted-aif-equity-asset/:id`}
              element={<NewUnlisted_Aif_EquityForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/Report`}
              element={<PortfolioReport />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/Report-details`}
              element={<ReportDetails />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/commondashboard/Portfolio-Holdings-Report-details`}
              element={<PortfolioHoldingsReportDetails />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/digilocker/success`}
              element={<DigiLockerSuccess />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/stocks/ipo-details/:ipocode`}
              element={<IPODetails />}
            />
            {/* <Route exact path={`${process.env.PUBLIC_URL}/stocks/:id`} element={<IPODetails />} /> */}
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/bonds/all`}
              element={<BondsList />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/bonds/bond-details`}
              element={<BondsDetails />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/expert-fp`}
              element={<Expertfp />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/razor_pay_payment_success/`}
              element={<PaymentSuccessPopup />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/payment_failure/`}
              element={<PaymentFailurePopup />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/wealth-management/`}
              element={<Wealthmanagement />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-list`}
              element={<Bankselect />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-Details-loading`}
              element={<Waiting />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-not-found`}
              element={<Accountnotfound />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-mobile-number`}
              element={<MobileNumber />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-select`}
              element={<BankAccountSelection />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-account-confirmation`}
              element={<ConfirmConsent />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-data`}
              element={<BankReqProgressBar />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/userflow/expert-nda`}
              element={<Expertnda />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/session-expired`}
              element={<SessionExpired />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/mycart-mandate-limit`}
              element={<Mandate_limit />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/bank-verification`}
              element={<Bankverificationlink />}
            />
            {/* ----------------------------------------------money management--------------------------------------- */}
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/money-management/bank-tracking-overview`}
              element={<BankTrackingOverView />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/money-management/track-bank-account`}
              element={<TrackbankAccount />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/money-management/track-bank-account`}
              element={<TrackbankAccount />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/money-management/link-bank-account`}
              element={<TrackbankAccount2 />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/money-management/map-transactions`}
              element={<TrackbankAccount3 />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/money-management/dashboard`}
              element={<AccountBalance />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/money-management/overview`}
              element={<DashBoard />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/portfolio-balance`}
              element={<PortfolioBalance />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/direct-mutual-fund/select-bank-for-lumpsum`}
              element={<SelectBanklumpsum />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/personal-finance`}
              element={<Personal_finance />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/login`}
              element={
                // <motion.div
                //   variants={pageVariants}
                //   initial="initial"
                //   animate="animate"
                //   exit="exit"
                // >
                // <Loginpage />
                <AuthPage />
                // </motion.div>
              }
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/register`}
              element={
                // <motion.div
                //   variants={pageVariants}
                //   initial="initial"
                //   animate="animate"
                //   exit="exit"
                // >
                <Signup />
                // </motion.div>
              }
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/financial-health-checkup`}
              element={<FHC />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/mutual-fund-snippet`}
              element={<MFSnippet />}
            />
            {/* <Route
              exact
              path={`${process.env.PUBLIC_URL}/personal-financial-plan`}
              element={<FinancialPlanningPage />}
            /> */}
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/personal-financial-plan-mf`}
              element={<FinancialPlanningPageMF />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/connect-with-us`}
              element={<UserForm />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/personal-financial-planning`}
              element={<PersonalFinancialPlan />}
            />
           
           
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/loan-against-mutual-funds`}
              element={<LoanAgainstMF />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/loan-against-mutual-funds-apply`}
              element={<LoanApplyNow />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/financial-planning-page`}
              element={<NewPlanningpage />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/financial-planning-page-new`}
              element={<FinancialPlanningPage />}
            />
           
            
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/wealth-management-consultation-landing-page-calendly-fintoo5/`}
              element={<WealthManagementCalendly />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/wealth-management-consultation-landing-page-calendly/`}
              element={<WealthManagementCalendly />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/assisted-advisory-landing-page-global/`}
              element={<GlobalLandingPage />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/onboard-flow`}
              element={<UseFlowInputs />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/verify-mobile-number`}
              element={<VerifyMobileNumber />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/mobile-scheme-graph`}
              element={<ApexChartsPage />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/mobile-verfication`}
              element={<MobileVerify />}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/checkout-payment`}
              element={<CashfreeCheckoutPage />}
            />
          </Routes>
          {!shouldHideHeaderFooter && isLoading == false && <Footer />}
      </HelmetProvider>
    </Provider>
  );
}

function BlogRedirect() {
  React.useEffect(() => {
    const pathAfterBlog = window.location.pathname; // /blog/... or /wealthmanagement/...
    const search = window.location.search; // preserve query params
    const targetDomain = "https://blog.fintoo.in";

    window.location.replace(`${targetDomain}${pathAfterBlog}${search}`);
  }, []);

  return <p>Redirecting to blog...</p>;
}

export default AppShell;
