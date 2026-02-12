import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import Footer from "../components/MainComponents/Footer";
import { ReactComponent as Logo } from "../Assets/Images/logo.svg";
import MainHeader from "../components/MainHeader";

import { useNavigate, useParams } from "react-router-dom";
import { imagePath } from "../constants";
function Events() {
  // const navigate = useNavigate();
  const { type } = useParams();


  const [show, setShow] = useState(false);
  const target = useRef(null);
  const [pageInfo, setPageInfo] = useState({});
  useEffect(() => {
    document.body.classList.add("main-layout");
  }, []);
  useEffect(() => {
    switch (type) {
      case "ongoing":
        setPageInfo({ title: "Ongoing" });
        break;
      case "upcoming":
        setPageInfo({ title: "Upcoming" });
        break;
      case "previous":
        setPageInfo({ title: "Previous" });
        break;
      default:
        setPageInfo({ title: "Upcoming" });
        break;
    }
  }, [type]);



  return (
    <div className="Events" onHide={!show}>
      {/* <MainHeader /> */}
      <div
        className="knowledge-base sectionPadding  our-events"
        ng-init="init()"
      >
        <div className="container">
          <h2
            style={{ textAlign: "center", fontWeight: "600", color: "#042b62" }}
          >
            <span id="event_id" style={{ textTransform: "capitalize" }}>
              {pageInfo?.title}{" "}
            </span>
            Events
          </h2>
          <div
            className="row jjustify-content-center align-items-center">
            <div className="col-md-9 offset-md-1">
              <form
                method="post"
                className="search-wrapper ng-pristine ng-valid"
              >
                <input
                  type="text"
                  className="textbox ng-pristine ng-valid ng-empty ng-touched"
                  placeholder="Search for a Event"
                  ng-model="searchText.event_name"
                  style={{}}
                />
                <button type="button" className="search-btn">
                  <img
                    src={imagePath + "/static/media/Images//events/img/search.svg"}
                    alt=""
                  />
                </button>
              </form>
            </div>
            <div className="col-md-2 text-right">
              <div className="sorting d-inline-block">
                <a
                  className="color-blue font-bold sort-by pointer"
                  ref={target}
                  onClick={() => setShow(!show)}
                >
                  Sort By{" "}
                  <img
                    src={imagePath + '/static/media/DG/assets-liabilities/sort.svg'}
                    alt=""
                  />
                </a>
                {/* <ul className="sort-menu">
                  <li>
                    <a href="" ng-click="sortBy('event_date')">
                      By Date
                    </a>
                  </li>
                  <li>
                    <a href="" ng-click="sortBy('event_name')">
                      By Name
                    </a>
                  </li>
                </ul> */}
              </div>
            </div>
            <Overlay
              className="DataSort"
              target={target.current}
              show={show}
              placement="bottom"
            >
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  <div className="SortList">
                    <p className="pointer text-left ps-0 ms-0">By Date</p>
                  </div>
                  <div className="pt-2 SortList">
                    <p className="pointer text-left">By Name</p>
                  </div>
                </Tooltip>
              )}
            </Overlay>
            {/* <div class="alert" role="alert" id="result"></div> */}
            <div className="col-md-12">
              <div className="event-register" id="eventRegister">
                {/* <a
                  ng-click="removeClassFromId('eventRegister')"
                  className="closebtn"
                >
                  ×
                </a> */}
                <div className="row justify-content-center event-row d-none">
                  <div className="col-md-5">
                    <h2>Register here to watch the event!</h2>
                  </div>
                  <div className="offset-md-1 col-md-5">
                    <form
                      name="userForm"
                      id="registerFormEvent"
                      className="login-form registration-form event-form ng-pristine ng-valid ng-valid-maxlength ng-valid-email"
                      method="post"
                      autoComplete="off"
                      noValidate="novalidate"
                    >
                      <div className="row form-row">
                        <div className="col-md-10">
                          <div className="position-relative">
                            <div className="material input">
                              <input
                                type="text"
                                name="fullname"
                                id="fullname"
                                ng-model="financialformdata.name"
                                placeholder="Name*"
                                readOnly=""
                                className="ng-pristine ng-untouched ng-valid ng-not-empty"
                              />
                            </div>
                            <div className="error-msg event_error_msg" />
                          </div>
                        </div>
                      </div>
                      <div className="row form-row">
                        <div className="col-md-10">
                          <div className="position-relative">
                            <div className="material input">
                              <input
                                type="number"
                                maxLength={10}
                                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                id="mobile"
                                ng-model="financialformdata.mobile"
                                name="mobile"
                                placeholder="Mobile Number*"
                                readOnly=""
                                className="ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-maxlength"
                              />
                            </div>
                            <div className="error-msg event_error_msg" />
                          </div>
                        </div>
                      </div>
                      <div className="row form-row">
                        <div className="col-md-10">
                          <div className="position-relative">
                            <div className="material input">
                              <input
                                type="email"
                                ng-model="financialformdata.email"
                                name="mailid"
                                id="mailid"
                                placeholder="Email*"
                                readOnly=""
                                className="ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-email"
                              />
                            </div>
                            <div className="error-msg event_error_msg" />
                          </div>
                        </div>
                      </div>
                      {/*  */}
                      <div className="row form-row">
                        <div className="col-md-10">
                          <div
                            className="material select incomeslabselectmenuparent"
                            style={{ padding: "0px !important" }}
                          >
                            <select
                              className="required ng-pristine ng-untouched ng-valid ng-empty"
                              id="event_incomeslab"
                              name="event_incomeslab"
                              ng-model="financialformdata.incomeslab"
                              placeholder="Select Income Slab*"
                              style={{ display: "none" }}
                            >
                              <option value="" selected="selected">
                                Select Income Slab*
                              </option>
                              <option value={1}>0 to 5 Lac</option>
                              <option value={2}>5 Lac to 10 Lac</option>
                              <option value={3}>10 Lac to 25 Lac</option>
                              <option value={4}>25 Lac to 50 Lac</option>
                              <option value={5}>50 Lac to 1 Crore</option>
                              <option value={6}>Above 1 Crore</option>
                            </select>
                            <span
                              tabIndex={0}
                              id="event_incomeslab-button"
                              role="combobox"
                              aria-expanded="false"
                              aria-autocomplete="list"
                              aria-owns="event_incomeslab-menu"
                              aria-haspopup="true"
                              className="ui-selectmenu-button ui-selectmenu-button-closed ui-corner-all ui-button ui-widget"
                            >
                              <span className="ui-selectmenu-icon ui-icon ui-icon-triangle-1-s" />
                              <span className="ui-selectmenu-text">
                                Select Income Slab*
                              </span>
                            </span>
                            <div className="ui-selectmenu-menu ui-front">
                              <ul
                                aria-hidden="true"
                                aria-labelledby="event_incomeslab-button"
                                id="event_incomeslab-menu"
                                role="listbox"
                                tabIndex={0}
                                className="ui-menu ui-corner-bottom ui-widget ui-widget-content"
                              />
                            </div>
                          </div>
                          <div className="error-msg event_error_msg" />
                        </div>
                      </div>
                      <div className="row form-row">
                        <div className="col-md-10">
                          <div
                            className="material select designationselectmenuparent"
                            style={{ padding: "0px !important" }}
                          >
                            <select
                              className="required ng-pristine ng-untouched ng-valid ng-empty"
                              id="event_designation"
                              name="event_designation"
                              ng-model="financialformdata.designation"
                              placeholder="Select Designation*"
                              style={{ display: "none" }}
                            >
                              <option value="" selected="selected">
                                Select Designation*
                              </option>
                              <option value={1}>life planner</option>
                              <option value={2}>
                                business development manager
                              </option>
                              <option value={3}>
                                junior associate-fundamental research
                              </option>
                              <option value={4}>marketing executive</option>
                              <option value={5}>product head</option>
                              <option value={6}>director</option>
                              <option value={7}>proprietor</option>
                              <option value={8}>associate manager</option>
                              <option value={9}>creative director</option>
                              <option value={10}>
                                advocate &amp; legal consultant
                              </option>
                              <option value={11}>chief executive</option>
                              <option value={12}>president</option>
                              <option value={13}>
                                chief photo feature editor
                              </option>
                              <option value={14}>tech director</option>
                              <option value={15}>a g m marketing</option>
                              <option value={16}>executive director</option>
                              <option value={17}>business</option>
                              <option value={18}>
                                assistant manager business development
                              </option>
                              <option value={19}>
                                associate partner for raigad district
                              </option>
                              <option value={20}>
                                managing director fire &amp; safety
                              </option>
                              <option value={21}>
                                consulting engineer for pulp &amp; paper
                                industries
                              </option>
                              <option value={22}>editor</option>
                              <option value={23}>
                                regional sales manager west &amp; north
                              </option>
                              <option value={24}>partner</option>
                              <option value={25}>
                                financial analyst family office
                              </option>
                              <option value={26}>msc engg germany</option>
                              <option value={27}>managing director</option>
                              <option value={28}>
                                assistant manager maintenance
                              </option>
                              <option value={29}>
                                sales support engineer amea
                              </option>
                              <option value={30}>
                                senior executive sales (commercial)
                              </option>
                              <option value={31}>advocate high court</option>
                              <option value={32}>general manager</option>
                              <option value={33}>
                                manager proposal engineering
                              </option>
                              <option value={34}>sales manager</option>
                              <option value={35}>relationship executive</option>
                              <option value={36}>project engineer</option>
                              <option value={37}>
                                assistant manager database management
                              </option>
                              <option value={38}>sales manager saarc</option>
                              <option value={39}>branch incharge</option>
                              <option value={40}>
                                senior marketing executive
                              </option>
                              <option value={41}>director-exports</option>
                              <option value={42}>
                                sales &amp; purchase officer
                              </option>
                              <option value={43}>sales officer</option>
                              <option value={44}>group head-events</option>
                              <option value={45}>senior consultant</option>
                              <option value={46}>
                                head business development
                              </option>
                              <option value={47}>
                                assistant manager-sales
                              </option>
                              <option value={48}>
                                assistant manager sales &amp; services
                              </option>
                              <option value={49}>
                                founder &amp; chief financial coach
                              </option>
                              <option value={50}>
                                premier agent &amp; advisor
                              </option>
                              <option value={51}>
                                assistant branch manager - agency
                              </option>
                              <option value={52}>branch sales manager</option>
                              <option value={53}>area sales manager</option>
                              <option value={54}>
                                founder &amp; managing partner
                              </option>
                              <option value={55}>marketing - engineer</option>
                              <option value={56}>development leader</option>
                              <option value={57}>regional head</option>
                              <option value={58}>manager - sales</option>
                              <option value={59}>key account manager</option>
                              <option value={60}>account manager sales</option>
                              <option value={61}>
                                section head - technology
                              </option>
                              <option value={62}>senior manager sales</option>
                              <option value={63}>account director sales</option>
                              <option value={64}>
                                business development executive
                              </option>
                              <option value={65}>
                                assistant vice president
                              </option>
                              <option value={66}>associate</option>
                              <option value={67}>
                                relationship manager-bancassurance
                              </option>
                              <option value={68}>
                                associate mergers &amp; acquisitions (tax)
                              </option>
                              <option value={69}>marketing manager</option>
                              <option value={70}>mba it</option>
                              <option value={71}>ca</option>
                              <option value={72}>ipsos</option>
                              <option value={73}>
                                business relationship manager
                              </option>
                              <option value={74}>
                                chief executive officer &amp; co-founder
                              </option>
                              <option value={75}>marketing head</option>
                              <option value={76}>
                                founder &amp; chief executive officer
                              </option>
                              <option value={77}>business manager</option>
                              <option value={78}>
                                founder, managing partner
                              </option>
                              <option value={79}>
                                chief manager-technical
                              </option>
                              <option value={80}>assistant manager</option>
                              <option value={81}>management trainee</option>
                              <option value={82}>
                                vice president marketing
                              </option>
                              <option value={83}>co-founder and dir</option>
                              <option value={84}>
                                assistant manager-business development
                              </option>
                              <option value={85}>co-founder</option>
                              <option value={86}>
                                channel development manager
                              </option>
                              <option value={87}>sales executive</option>
                              <option value={88}>
                                executive (marketing graphite specialty)
                              </option>
                              <option value={89}>
                                assistant manager (q a)
                              </option>
                              <option value={90}>
                                director &amp; co-founder
                              </option>
                              <option value={91}>
                                channel support manager
                              </option>
                              <option value={92}>
                                project head-west &amp; south
                              </option>
                              <option value={93}>
                                senior manager-materials
                              </option>
                              <option value={94}>
                                in charge-production &amp; planning
                              </option>
                              <option value={95}>
                                chief executive officer
                              </option>
                              <option value={96}>research associate</option>
                              <option value={97}>
                                senior manager (production)
                              </option>
                              <option value={98}>marketing officer</option>
                              <option value={99}>project manager</option>
                              <option value={100}>
                                technical advisor production
                              </option>
                              <option value={101}>marketing director</option>
                              <option value={102}>
                                marketing co-ordinator
                              </option>
                              <option value={103}>
                                area sales manager-products
                              </option>
                              <option value={104}>senior manager-sales</option>
                              <option value={105}>ad marketing</option>
                              <option value={106}>
                                senior manager-business development
                              </option>
                              <option value={107}>financial advisor</option>
                              <option value={108}>
                                acoustical interior designer investment adviser
                              </option>
                              <option value={109}>business head</option>
                              <option value={110}>
                                accounting staff analyst
                              </option>
                              <option value={111}>purchase engineer</option>
                              <option value={112}>
                                vice president commercial
                              </option>
                              <option value={113}>sales director</option>
                              <option value={114}>financial planner</option>
                              <option value={115}>
                                national manager risk management &amp; survey
                              </option>
                              <option value={116}>
                                manager risk management &amp; survey
                              </option>
                              <option value={117}>
                                manager (sales &amp; marketing)
                              </option>
                              <option value={118}>
                                deputy general manager (marketing)
                              </option>
                              <option value={119}>assistant manager mkt</option>
                              <option value={120}>manager sales</option>
                              <option value={121}>development officer</option>
                              <option value={122}>
                                manager of product quality
                              </option>
                              <option value={123}>technical consultant </option>
                              <option value={124}>technical head</option>
                              <option value={125}>be mechanical</option>
                              <option value={126}>
                                director -institutions -promoter equity
                              </option>
                              <option value={127}>head marketing</option>
                              <option value={128}>
                                business head surface finishing
                              </option>
                              <option value={129}>managing partner</option>
                              <option value={130}>manager-sales</option>
                              <option value={131}>junior engineer</option>
                              <option value={132}>manager purchase</option>
                              <option value={133}>prezes zarzadu</option>
                              <option value={134}>purchase executive</option>
                              <option value={135}>exitor &amp; purchase</option>
                              <option value={136}>
                                transaction &amp; delivery
                              </option>
                              <option value={137}>technical supports</option>
                              <option value={138}>
                                corporate sales executive
                              </option>
                              <option value={139}>
                                deputy general manager-maintenance &amp; project
                              </option>
                              <option value={140}>country director</option>
                              <option value={141}>senior manager-qa</option>
                              <option value={142}>
                                chief operating officer
                              </option>
                              <option value={143}>
                                co-founder &amp; director
                              </option>
                              <option value={144}>founder</option>
                              <option value={145}>operation manager</option>
                              <option value={146}>
                                assistant manager-buss development
                              </option>
                              <option value={147}>
                                head-value added services
                              </option>
                              <option value={148}>
                                avp-investor relations &amp; communications
                              </option>
                              <option value={149}>founder director</option>
                              <option value={150}>
                                chief marketing officer
                              </option>
                              <option value={151}>
                                finance &amp; insurance consultant
                              </option>
                              <option value={152}>manager-marketing</option>
                              <option value={153}>principal</option>
                              <option value={154}>outreach manager</option>
                              <option value={155}>social entrepreneur</option>
                              <option value={156}>
                                regional technical manager west
                              </option>
                              <option value={157}>
                                relationship manager-customer interaction
                              </option>
                              <option value={158}>buss analyst</option>
                              <option value={159}>
                                assistant sales manager
                              </option>
                              <option value={160}>investment banker</option>
                              <option value={161}>technical director</option>
                              <option value={162}>senior sales manager</option>
                              <option value={163}>
                                regional director-asia
                              </option>
                              <option value={164}>designer</option>
                              <option value={165}>
                                penstoner-customer exe
                              </option>
                              <option value={166}>it manager-technology</option>
                              <option value={167}>
                                business development manager-fire safety
                              </option>
                              <option value={168}>
                                assistant purchase manager
                              </option>
                              <option value={169}>fire safety</option>
                              <option value={170}>
                                project engineer-automation
                              </option>
                              <option value={171}>
                                founder of planghar.com
                              </option>
                              <option value={172}>finance advisor</option>
                              <option value={173}>consultant</option>
                              <option value={174}>c m-corp</option>
                              <option value={175}>businessman</option>
                              <option value={176}>manager-production</option>
                              <option value={177}>
                                company representative
                              </option>
                              <option value={178}>occupation</option>
                              <option value={179}>service</option>
                              <option value={180}>owner</option>
                              <option value={181}>
                                eng workshop-marketing
                              </option>
                              <option value={182}>strategy head</option>
                              <option value={183}>hsf manager</option>
                              <option value={184}>doctor</option>
                              <option value={185}>
                                sales coordinator-marketing
                              </option>
                              <option value={186}>govt services</option>
                              <option value={187}>manager</option>
                              <option value={188}>technician</option>
                              <option value={189}>territory manager</option>
                              <option value={190}>actuarial-intern</option>
                              <option value={191}>teacher</option>
                              <option value={192}>computer operator</option>
                              <option value={193}>job</option>
                              <option value={194}>housewife</option>
                              <option value={195}>mechanical engineer</option>
                              <option value={196}>fire service</option>
                              <option value={197}>service engineer</option>
                              <option value={198}>student</option>
                              <option value={199}>guest</option>
                              <option value={200}>media</option>
                              <option value={201}>entrepreneur</option>
                              <option value={202}>
                                vice president-insurance sme
                              </option>
                              <option value={203}>lawyer</option>
                              <option value={204}>business development</option>
                              <option value={205}>service prdn manager</option>
                              <option value={206}>architect</option>
                              <option value={207}>self employed</option>
                              <option value={208}>retired</option>
                              <option value={209}>fire work</option>
                              <option value={210}>risk analyst</option>
                              <option value={211}>senior executive </option>
                              <option value={212}>director-finance</option>
                              <option value={213}>auto industries</option>
                              <option value={214}>insurance consultant</option>
                              <option value={215}>unemployed</option>
                              <option value={216}>c a</option>
                              <option value={217}>fsa</option>
                              <option value={218}>officer-finance</option>
                              <option value={219}>pg service</option>
                              <option value={220}>stock broking</option>
                              <option value={221}>works manager</option>
                              <option value={222}>sales</option>
                              <option value={223}>
                                vice president-business development
                              </option>
                              <option value={224}>avp</option>
                              <option value={225}>assistant manager-sme</option>
                              <option value={226}>professional</option>
                              <option value={227}>banker</option>
                              <option value={228}>
                                mechanical engineer-projects
                              </option>
                              <option value={229}>deputy manager</option>
                              <option value={230}>office incharge</option>
                              <option value={231}>services</option>
                              <option value={232}>officer</option>
                              <option value={233}>
                                service-store incharge
                              </option>
                              <option value={234}>it engineer</option>
                              <option value={235}>sales coordinator</option>
                              <option value={236}>financial consultant</option>
                              <option value={237}>finance</option>
                              <option value={238}>senior manager</option>
                              <option value={239}>investor</option>
                              <option value={240}>company secretary</option>
                              <option value={241}>broker</option>
                              <option value={242}>safety inspector</option>
                              <option value={243}>project incharge</option>
                              <option value={244}>joint dist pro</option>
                              <option value={245}>regional manager</option>
                              <option value={246}>service advisor</option>
                              <option value={247}>am-it</option>
                              <option value={248}>service/trader</option>
                              <option value={249}>sub broker</option>
                              <option value={250}>
                                deputy general manager
                              </option>
                              <option value={251}>marketing</option>
                              <option value={252}>job export executive</option>
                              <option value={253}>
                                corporate sales manager
                              </option>
                              <option value={254}>inland world logistiz</option>
                              <option value={255}>sales trainee</option>
                              <option value={256}>safety officer</option>
                              <option value={257}>tech founder</option>
                              <option value={258}>cam engineer</option>
                              <option value={259}>manager-operations</option>
                              <option value={260}>counsellor</option>
                              <option value={261}>h r manager</option>
                              <option value={262}>trader</option>
                              <option value={263}>
                                sales manager-marketing
                              </option>
                              <option value={264}>business director</option>
                              <option value={265}>equity dealers</option>
                              <option value={266}>
                                assistant manager-acetech
                              </option>
                              <option value={267}>software professional</option>
                              <option value={268}>cfp</option>
                              <option value={269}>pvt job</option>
                              <option value={270}>seo </option>
                              <option value={271}>marine engineer</option>
                              <option value={272}>
                                real estate consultant
                              </option>
                              <option value={273}>
                                corporate relations executive
                              </option>
                              <option value={274}>cre</option>
                              <option value={275}>ifa</option>
                              <option value={276}>
                                dora financial manager
                              </option>
                              <option value={277}>business (investment)</option>
                              <option value={278}>
                                project manager-plumbing
                              </option>
                              <option value={279}>medical analyst</option>
                              <option value={280}>tech consultant</option>
                              <option value={281}>purchase</option>
                              <option value={282}>p m</option>
                              <option value={283}>pwd</option>
                              <option value={284}>process expert opr</option>
                              <option value={285}>avp special projects</option>
                              <option value={286}>
                                senior manager-sales accs
                              </option>
                              <option value={287}>film production</option>
                              <option value={288}>sdmm</option>
                              <option value={289}>engineer</option>
                              <option value={290}>civil engineer</option>
                              <option value={291}>research analyst</option>
                              <option value={292}>business-prop</option>
                              <option value={293}>gis analyst</option>
                              <option value={294}>mgmt dept</option>
                              <option value={295}>
                                computer service engineer
                              </option>
                              <option value={296}>
                                electronics &amp; comm engineer
                              </option>
                              <option value={297}>
                                professor &amp; head training &amp; placement
                              </option>
                              <option value={298}>admin</option>
                              <option value={299}>
                                zonal manager-operations
                              </option>
                              <option value={300}>
                                regional sales manager
                              </option>
                              <option value={301}>assistant professor</option>
                              <option value={302}>vice chairman</option>
                              <option value={303}>purchase-manager</option>
                              <option value={304}>diamond</option>
                              <option value={305}>software engineer</option>
                              <option value={306}>f &amp; b consultant</option>
                              <option value={307}>para planner</option>
                              <option value={308}>planner</option>
                              <option value={309}>govt service</option>
                              <option value={310}>analyst</option>
                              <option value={311}>advisor</option>
                              <option value={312}>erm</option>
                              <option value={313}>relationship officer</option>
                              <option value={314}>co founder</option>
                              <option value={315}>amc</option>
                              <option value={316}>ba</option>
                              <option value={317}>participant</option>
                              <option value={318}>
                                snr-software consultant
                              </option>
                              <option value={319}>
                                web development &amp; designer
                              </option>
                              <option value={320}>dealer</option>
                              <option value={321}>
                                web developer &amp; designer
                              </option>
                              <option value={322}>ea</option>
                            </select>
                            <span
                              tabIndex={0}
                              id="event_designation-button"
                              role="combobox"
                              aria-expanded="false"
                              aria-autocomplete="list"
                              aria-owns="event_designation-menu"
                              aria-haspopup="true"
                              className="ui-selectmenu-button ui-selectmenu-button-closed ui-corner-all ui-button ui-widget"
                            >
                              <span className="ui-selectmenu-icon ui-icon ui-icon-triangle-1-s" />
                              <span className="ui-selectmenu-text">
                                Select Designation*
                              </span>
                            </span>
                            <div className="ui-selectmenu-menu ui-front">
                              <ul
                                aria-hidden="true"
                                aria-labelledby="event_designation-button"
                                id="event_designation-menu"
                                role="listbox"
                                tabIndex={0}
                                className="ui-menu ui-corner-bottom ui-widget ui-widget-content"
                              />
                            </div>
                          </div>
                          <div className="error-msg event_error_msg" />
                        </div>
                      </div>
                      <link
                        href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css"
                        rel="stylesheet"
                      />
                      <div className="row form-row">
                        <div className="col-md-10">
                          <div
                            className="material select companyselectmenuparent"
                            style={{ padding: "0px !important" }}
                          >
                            <select
                              className="form-control required select2 select2-hidden-accessible ng-pristine ng-untouched ng-valid ng-empty"
                              id="ev_company_new"
                              ng-model="financialformdata.company"
                              placeholder="Select Company*"
                              data-select2-id="ev_company_new"
                              tabIndex={-1}
                              aria-hidden="true"
                            >
                              <option
                                value=""
                                data-select2-id={2}
                                selected="selected"
                              >
                                Select Company*
                              </option>
                              <option value={1277}> Adfactors PR</option>
                              <option value={1274}>
                                {" "}
                                HICOOL Electronic Industries
                              </option>
                              <option value={1053}>20Cube Logistics</option>
                              <option value={730}>360 reality</option>
                              <option value={1194}>
                                3TANDAI INDIA PRIVATE LIMITED
                              </option>
                              <option value={206}>3i-Infotech</option>
                              <option value={1049}>
                                5PAISA CAPITAL LIMITED
                              </option>
                              <option value={496}>5Paisa Capital Ltd</option>
                              <option value={1387}>91 Spring Board</option>
                              <option value={1285}>
                                AAKS &amp; BROS Ventures Ltd.
                              </option>
                              <option value={969}>ABB INDIA LIMITED</option>
                              <option value={184}>
                                ABBOTT HEALTHCARE PVT LTD
                              </option>
                              <option value={509}>ABBOTT INDIA LIMITED</option>
                              <option value={577}>
                                ABSA INDIA INTERNATIONAL PVT LTD
                              </option>
                              <option value={1406}>ACC Limited</option>
                              <option value={776}>
                                ACCENT TECHNO SOLUTIONS PVT
                              </option>
                              <option value={148}>
                                ACCENTURE SOLUTIONS PRIVATE LIMITED
                              </option>
                              <option value={1388}>ACF Group</option>
                              <option value={1379}>
                                ACTIMEDIA PRIVATE LIMITED
                              </option>
                              <option value={1126}>AD INNOVATIONS</option>
                              <option value={682}>ADANI CAPITAL PVT LTD</option>
                              <option value={468}>ADCB PJSC</option>
                              <option value={248}>
                                ADITYA BIRLA FINANCE LIMITED
                              </option>
                              <option value={286}>
                                ADITYA BIRLA SUN LIFE AMC LIMITED
                              </option>
                              <option value={1335}>
                                ADOBE SYSTEM INDIA PRIVATE LIMITED
                              </option>
                              <option value={1389}>ADOPT</option>
                              <option value={252}>ADP India Pvt Ltd</option>
                              <option value={214}>
                                AECOM INDIA PRIVATE LIMITED
                              </option>
                              <option value={209}>AECON</option>
                              <option value={80}>
                                AGILITY LOGISTICS - CAPITAL GA
                              </option>
                              <option value={79}>
                                AGILITY LOGISTICS - NORMAL FIL
                              </option>
                              <option value={881}>AIR ASIA</option>
                              <option value={1318}>AIR INDIA LIMITED</option>
                              <option value={74}>AIRCEL</option>
                              <option value={73}>AIRTEL</option>
                              <option value={1122}>ALANKIT ASSIGNMENTS</option>
                              <option value={1024}>
                                ALEMBIC PHARMACEUTICALS LIMITED
                              </option>
                              <option value={1085}>
                                AMBIT CAPITAL PRIVATE LIMITED
                              </option>
                              <option value={1133}>
                                AMBIT PRIVATE LIMITED
                              </option>
                              <option value={1208}>
                                AMBIT WEALTH MANAGEMENT PRIVATE LIMITED
                              </option>
                              <option value={797}>AMIT&amp;CO.</option>
                              <option value={1270}>ANDROMEDA</option>
                              <option value={1095}>ANY</option>
                              <option value={1168}>
                                ANZ SUPPORT SERVICES INDIA PRIVATE LIMITED
                              </option>
                              <option value={1163}>
                                APOLLO SUPPLY CHAIN PRIVATE LIMITED
                              </option>
                              <option value={570}>
                                APOTEX RESEARCH PRIVATE LIMITED
                              </option>
                              <option value={67}>APTARA</option>
                              <option value={1145}>
                                APTARA TECHNOLOGIES PRIVATE LIMITED
                              </option>
                              <option value={242}>APTASK</option>
                              <option value={993}>
                                ARC WORLD WIDE PVT LTD
                              </option>
                              <option value={690}>ARHAM INTERNATIONAL</option>
                              <option value={434}>
                                ARISTO PHARMACEUTICALS PVT LTD
                              </option>
                              <option value={323}>ARVIND LTD.</option>
                              <option value={911}>ASHOK NARAYAN BHOSLE</option>
                              <option value={458}>ASIAN PAINTS LIMITED</option>
                              <option value={326}>
                                ASMEnterpriseSolutionsPvtLtd
                              </option>
                              <option value={610}>ASPL</option>
                              <option value={425}>
                                ASTARC MANAGEMENT SERVICES PVT LTD
                              </option>
                              <option value={1077}>
                                ASUS INDIA PRIVATE LIMITED
                              </option>
                              <option value={392}>ASUS India Pvt. Ltd.</option>
                              <option value={46}>ASUS Technology</option>
                              <option value={406}>ATKEARNEY LTD</option>
                              <option value={205}>
                                ATOS INDIA PRIVATE LIMITED
                              </option>
                              <option value={192}>
                                ATOS IT SERVICES PVT LTD
                              </option>
                              <option value={516}>AUTO DIGITECH PVT LTD</option>
                              <option value={1143}>
                                AVANSE FINANCIAL SERVICES LIMITED
                              </option>
                              <option value={1207}>
                                AVENDUS WEALTH MANAGEMENT PRIVATE LIMITED
                              </option>
                              <option value={1190}>
                                AVVASHYA CCI LOGISTICS PRIVATE LIMITED
                              </option>
                              <option value={1189}>
                                AVVASHYA CCI LOGISTICS PVT. LTD.
                              </option>
                              <option value={1084}>AXIS BANK LIMITED</option>
                              <option value={289}>
                                AXISCADES Aerospace &amp; Technologies Pvt Ltd
                              </option>
                              <option value={662}>
                                Aakash Educational Services Private limited
                              </option>
                              <option value={1329}>Aarti Industries Ltd</option>
                              <option value={948}>
                                Aastrid Life Sciences Pvt Ltd
                              </option>
                              <option value={571}>Abott</option>
                              <option value={1265}>
                                Abzooba India Infotech Pvt. Ltd.
                              </option>
                              <option value={616}>Acc</option>
                              <option value={1151}>
                                Accenture Solutions Private Lomited
                              </option>
                              <option value={1144}>Acuris</option>
                              <option value={116}>Acusis</option>
                              <option value={1411}>
                                Addteq Software India Pvt Ltd
                              </option>
                              <option value={470}>Adecco India Pvt. Ltd</option>
                              <option value={473}>
                                Aditya Birla Retail Limited
                              </option>
                              <option value={963}>
                                Advance Life insurance Brokers Pvt Ltd
                              </option>
                              <option value={1433}>
                                Advanced Bio-Agro Tech Limited (ABTL)
                              </option>
                              <option value={1261}>
                                Advik Hi-Tech Pvt Ltd
                              </option>
                              <option value={130}>
                                Aegis Customer Support Services Pvt Ltd
                              </option>
                              <option value={1447}>Aegonlife</option>
                              <option value={1246}>AffinityX</option>
                              <option value={1304}>
                                Agnimitra Chakraborty
                              </option>
                              <option value={397}>Air India</option>
                              <option value={1337}>
                                Air work india engineering proivat elimited
                              </option>
                              <option value={321}>Ajmera</option>
                              <option value={1102}>
                                Aker Solutions Pvt. Ltd.
                              </option>
                              <option value={477}>
                                Akola Urban Co op Bank
                              </option>
                              <option value={166}>Al-Tayyar Travels</option>
                              <option value={539}>Alembic Pharma</option>
                              <option value={1230}>
                                Alexis Multispecialty Hospital
                              </option>
                              <option value={429}>
                                Ali Yavar Jung National Institute Of Speech and
                                Hearing Disabilities
                              </option>
                              <option value={950}>
                                All Cargo Logistics Ltd
                              </option>
                              <option value={224}>
                                All India Radio, Prasar Bharati
                              </option>
                              <option value={659}>
                                Allanasons Private Limited
                              </option>
                              <option value={855}>
                                Altisource Solutions PVT LTD
                              </option>
                              <option value={641}>Altran</option>
                              <option value={1425}>
                                Amazon development centre india private limited
                              </option>
                              <option value={894}>Ambay financial</option>
                              <option value={550}>Ambit</option>
                              <option value={580}>
                                Anandilal and Ganesh Podar Society
                              </option>
                              <option value={603}>
                                Anjali Mukerjee Health Total &amp; Self Employed
                              </option>
                              <option value={1401}>
                                Apollo Global Management
                              </option>
                              <option value={476}>
                                Apollo Health and Lifestyle Ltd.
                              </option>
                              <option value={1267}>Apptio</option>
                              <option value={1384}>
                                Apsara industrial works
                              </option>
                              <option value={896}>Aqua saft</option>
                              <option value={39}>Arezzosky</option>
                              <option value={461}>Arihant</option>
                              <option value={1443}>
                                Arihant Insurance Broking Service Limited
                              </option>
                              <option value={599}>Army</option>
                              <option value={860}>Arpitha Studio</option>
                              <option value={895}>Artex textile</option>
                              <option value={822}>Aryan associate</option>
                              <option value={398}>Aspira pathlabs</option>
                              <option value={835}>
                                Asus India Pvt limited
                              </option>
                              <option value={924}>Atharva jues center</option>
                              <option value={1245}>
                                Atlas Copco (India) Ltd.
                              </option>
                              <option value={1225}>
                                Aurionpro Solutions Limited
                              </option>
                              <option value={833}>
                                Aurionpro Solutions Ltd
                              </option>
                              <option value={832}>
                                Aurionpro Solutions Pvt Ltd
                              </option>
                              <option value={437}>
                                Avacend solution pvt ltd
                              </option>
                              <option value={746}>
                                Avenue Supermarts Limited
                              </option>
                              <option value={529}>Axis Securities</option>
                              <option value={134}>Axis bank ltd</option>
                              <option value={1262}>Axxess</option>
                              <option value={765}>
                                B.K.L Walawalkar Rural Medical College
                              </option>
                              <option value={244}>B4U media</option>
                              <option value={1312}>
                                BA CONTINUAM INNDIA PRIVATE LIMITED
                              </option>
                              <option value={1100}>BA Continuum</option>
                              <option value={231}>BAJAJ FINANCE LIMITED</option>
                              <option value={1216}>
                                BAJAJ HOUSING FINANCE LIMITED
                              </option>
                              <option value={544}>BALAJI TRUST</option>
                              <option value={269}>BANK OF INDIA</option>
                              <option value={265}>BARCLAYS</option>
                              <option value={1149}>
                                BECTON DICKINSON INDIA PRIVATE LIMITED
                              </option>
                              <option value={72}>BEST SELLER</option>
                              <option value={1106}>
                                BEST UNITED INDIA COMFORTS PRIVATE LIMITED
                              </option>
                              <option value={1187}>
                                BESTSELLER FASHION INDIA PRIVATE LIMITED
                              </option>
                              <option value={1212}>
                                BESTSELLER WHOLESALE INDIA PRIVATE LIMITED
                              </option>
                              <option value={453}>
                                BHAI PARMANAND VIDYA MANDIR
                              </option>
                              <option value={523}>BHARTI AIRTEL LIMITED</option>
                              <option value={932}>
                                BILKIS HOTEL AND RESTAURANT
                              </option>
                              <option value={1197}>BIRLASOFT LIMITED</option>
                              <option value={702}>BLOOM SYSTEM PVT LTD</option>
                              <option value={1013}>BLUE STAR LIMITED</option>
                              <option value={55}>BLUE STAR SAKI NAKA</option>
                              <option value={628}>BMO</option>
                              <option value={301}>
                                BNP PARIBAS INDIA SOLUTIONS PRIVATE LIMITED
                              </option>
                              <option value={280}>BNP Paribas</option>
                              <option value={1117}>
                                BOEHRINGER INGELHEIM INDIA PRIVATE LIMITED
                              </option>
                              <option value={519}>
                                BOX CO WORLD LOGISTICS
                              </option>
                              <option value={1026}>
                                BOXCO LOGISTICS INDIA PRIVATE LIMITED
                              </option>
                              <option value={233}>
                                BP Exploration (Alpha) Ltd.
                              </option>
                              <option value={36}>
                                BPCL All Branches Includes
                              </option>
                              <option value={967}>
                                BPL MEDICAL TECHNOLOGIES PVT LTS
                              </option>
                              <option value={976}>
                                BSI Group India Pvt Ltd
                              </option>
                              <option value={342}>BSR ASSOCIATES</option>
                              <option value={791}>BYJUS</option>
                              <option value={1086}>Bain and Co</option>
                              <option value={909}>
                                Bajaj Electricals - Financial Planning (23rd
                                October,2019 Wednesday)
                              </option>
                              <option value={186}>Bank of Baroda</option>
                              <option value={179}>Bank of Maharashtra</option>
                              <option value={1263}>Belgian Waffle</option>
                              <option value={266}>Benison</option>
                              <option value={272}>Benison Technologies</option>
                              <option value={630}>Best Saller </option>
                              <option value={329}>
                                Bharat Petroleum Corporation ltd.
                              </option>
                              <option value={1124}>
                                Bharat Serums and Vaccines Limited
                              </option>
                              <option value={940}>
                                Bhardwaj shiksha samiti ghat laxmangarh alwar
                                Rajasthan India
                              </option>
                              <option value={645}>Bic Cello</option>
                              <option value={1303}>
                                Bigtree entertainment pvt limited
                              </option>
                              <option value={1007}>Birlasoft</option>
                              <option value={99}>Black &amp; Veatch</option>
                              <option value={1278}>
                                Black Box Corporation
                              </option>
                              <option value={257}>BlackRock Pvt ltd</option>
                              <option value={1164}>
                                Bloom energy India Pvt ltd
                              </option>
                              <option value={37}>Blue Star</option>
                              <option value={637}>Bluedart</option>
                              <option value={795}>
                                Bluejay finlease limited
                              </option>
                              <option value={965}>Bmcri</option>
                              <option value={38}>Boehringer Ingelheim</option>
                              <option value={1354}>
                                Boku Network Service In Private Limited
                              </option>
                              <option value={1116}>Bombay Pharma</option>
                              <option value={1127}>
                                Bombay Scottish School
                              </option>
                              <option value={40}>Book My Show</option>
                              <option value={106}>Boxco Logistics</option>
                              <option value={664}>Bridgewaymotors LLp</option>
                              <option value={1371}>
                                Bright Lifecare Private Limited
                              </option>
                              <option value={420}>Bristlecone</option>
                              <option value={1233}>Broker</option>
                              <option value={208}>
                                Bunge India Private Limited
                              </option>
                              <option value={1183}>
                                Bureau Veritas (I) Pvt Ltd
                              </option>
                              <option value={1407}>Burger King</option>
                              <option value={163}>Business</option>
                              <option value={442}>Business Consultant</option>
                              <option value={1136}>Bytedance</option>
                              <option value={1184}>CADD E SOLUTIONS</option>
                              <option value={1307}>
                                CAPAGEMINI TECHNOLOGY SERVICE INDIA LIMITED
                              </option>
                              <option value={1330}>
                                CATERPILLAR INDIA PRIVATE LIMITED
                              </option>
                              <option value={140}>CBRE</option>
                              <option value={669}>CCI</option>
                              <option value={101}>CCI Project</option>
                              <option value={1255}>
                                CHEGG INDIA PRIVATE LIMITED
                              </option>
                              <option value={104}>CII</option>
                              <option value={1031}>CIPLA LIMITED</option>
                              <option value={1159}>
                                CITIUSTECH HEALTHCARE TECHNOLOGY PRIVATE LIMITED
                              </option>
                              <option value={275}>CLARION TECHNOLOGIES</option>
                              <option value={427}>CLASSIC STRIPES</option>
                              <option value={426}>CLASSIC STRIPES PVT</option>
                              <option value={1069}>CLUBHOUSE inches</option>
                              <option value={705}>CM Constructions</option>
                              <option value={814}>CMS</option>
                              <option value={1300}>
                                COGNIZANT TECHNOLOGY SOLUTION INDIA PRIVATE
                                LIMITED
                              </option>
                              <option value={1041}>
                                COGNIZANT TECHNOLOGY SOLUTIONS INDIA PRIVATE
                              </option>
                              <option value={721}>COGOPORT</option>
                              <option value={493}>
                                CONCORDE MOTORS INDIA LIMITED{" "}
                              </option>
                              <option value={1081}>
                                CONSERVE BUILDCON LLP
                              </option>
                              <option value={1191}>
                                CONTINENTAL AUTOMOTIVE COMPONENTS (INDIA)
                                PRIVATE
                              </option>
                              <option value={882}>
                                CONTROLLER OF DEFENSE ACCOUNTS
                              </option>
                              <option value={992}>
                                CONVONIX SYSTEMS PRIVATE LIMITED
                              </option>
                              <option value={1214}>
                                CREDIT SUISSE BUSINESS ANALYTICS (INDIA) PRIVATE
                              </option>
                              <option value={735}>
                                CREDIT SUISSE BUSINESS ANALYTICS (INDIA) PRIVATE
                                LIMITED
                              </option>
                              <option value={1066}>
                                CRIMSON INTERACTIVE PRIVATE LIMITED
                              </option>
                              <option value={202}>
                                CROMPTON GREAVES CONSUMER ELECTRICALS LIMITED
                              </option>
                              <option value={930}>CSC Center</option>
                              <option value={1395}>CSIR</option>
                              <option value={411}>CWT INDIA PVT</option>
                              <option value={724}>Cactus Communications</option>
                              <option value={169}>Capgemini</option>
                              <option value={845}>
                                Capital Small Finance Bank LTD
                              </option>
                              <option value={918}>
                                Capitasoft technologies
                              </option>
                              <option value={926}>Carpenter</option>
                              <option value={402}>Castrol</option>
                              <option value={1140}>
                                Celio Future Fashion Private Limited
                              </option>
                              <option value={748}>
                                Centre for development of telematics
                              </option>
                              <option value={1210}>Centrix</option>
                              <option value={1437}>
                                Chakradhara Aerospace &amp; Cargo Pvt Ltd
                              </option>
                              <option value={153}>
                                Chambal Fertilisers and Chemicals Ltd.
                              </option>
                              <option value={623}>
                                Channelplay India Pvt. Ltd
                              </option>
                              <option value={322}>
                                Chemimpex India IT Services Pvt Ltd
                              </option>
                              <option value={495}>
                                Chirpn Education Pvt Ltd
                              </option>
                              <option value={933}>Chitransh mart</option>
                              <option value={343}>Cipla</option>
                              <option value={200}>
                                Citius tech health care
                              </option>
                              <option value={1043}>Classic Marble</option>
                              <option value={928}>
                                Classic infra developers
                              </option>
                              <option value={405}>
                                CloudSpotter Technologies
                              </option>
                              <option value={136}>
                                Cognizant Technology Solutions India
                              </option>
                              <option value={617}>
                                Coldweld Engineers Pvt Ltd
                              </option>
                              <option value={1132}>
                                Colgate Global Business Services Private Limited
                              </option>
                              <option value={1250}>Comstor</option>
                              <option value={1211}>Conde Nast</option>
                              <option value={133}>Contractor Hafeez</option>
                              <option value={1436}>Coverfox</option>
                              <option value={86}>
                                Cross-tab Marketing Services P
                              </option>
                              <option value={954}>Csc</option>
                              <option value={898}>
                                Custom hiring centre mandvi
                              </option>
                              <option value={1414}>Cyient Limited</option>
                              <option value={447}>D A V PUBLIC SCHOOL </option>
                              <option value={819}>D Trade</option>
                              <option value={629}>D.B Corp Limited</option>
                              <option value={1333}>DB ORCHID OZONE</option>
                              <option value={778}>DBS Bank LTD</option>
                              <option value={689}>DCB BANK</option>
                              <option value={880}>DDecor</option>
                              <option value={1336}>DELHI PUBLIC SCHOOL</option>
                              <option value={1096}>
                                DELL INTERNATIONAL SERVICES INDIA PRIVATE
                                LIMITED
                              </option>
                              <option value={1114}>
                                DELOITTE CONSULTING INDIA PRIVATE LIMITED
                              </option>
                              <option value={606}>DHFL</option>
                              <option value={532}>
                                DHL EXPRESS INDIA PRIVATE LIMITED
                              </option>
                              <option value={223}>
                                DHL LOGISTICS PRIVATE LIMITED
                              </option>
                              <option value={85}>DHL SUPPLY CHAIN</option>
                              <option value={413}>
                                DIGITAL RADIO MUMBAI BROADCASTING LIMITED
                              </option>
                              <option value={1234}>
                                DIPTY LAL JUDGE MAL PVT. LTD.
                              </option>
                              <option value={1011}>
                                DLF POWER &amp; SERVICES LIMITED
                              </option>
                              <option value={670}>DORSCH HOLDING GMBH</option>
                              <option value={1176}>DSK Legal</option>
                              <option value={1153}>DY PATIL SCHOOL</option>
                              <option value={341}>DY Patil Hospital</option>
                              <option value={1426}>Dabur</option>
                              <option value={844}>Dana India pvt ltd</option>
                              <option value={267}>Danone</option>
                              <option value={1386}>
                                Dassault Systemes India Pvt Limited
                              </option>
                              <option value={636}>Data</option>
                              <option value={1430}>
                                Datamatics Business Solutions Limited
                              </option>
                              <option value={1226}>
                                Datamatics Global Services Limited
                              </option>
                              <option value={1241}>
                                Datametica Solutions Private Limited
                              </option>
                              <option value={968}>
                                Dboi Global Services Private Limited
                              </option>
                              <option value={357}>
                                Decision Resources Group
                              </option>
                              <option value={454}>Decolab India Pvt Ltd</option>
                              <option value={712}>Defence</option>
                              <option value={154}>
                                Deloitte Consulting India Pvt. Limited
                              </option>
                              <option value={512}>
                                Deloitte Touche Tohmatsu India LLP
                              </option>
                              <option value={1440}>Den Networks </option>
                              <option value={1264}>Diebold Nixdorf</option>
                              <option value={986}>Digitas</option>
                              <option value={704}>Disney</option>
                              <option value={1367}>Disney Hotstar</option>
                              <option value={64}>
                                Doshi Jain &amp; Co. (IFC Auditors
                              </option>
                              <option value={353}>
                                Dow Chemical International Private Limited
                              </option>
                              <option value={973}>Dr Reddy Laboratories</option>
                              <option value={339}>
                                Dream11 Fantasy Private Limited
                              </option>
                              <option value={877}>
                                Dtds courier and logistic
                              </option>
                              <option value={949}>Dun &amp; Bradstreet</option>
                              <option value={737}>Dutta medicine</option>
                              <option value={687}>
                                Dwarkadas J Sanghvi College of Engineering
                              </option>
                              <option value={907}>
                                E&amp;Y - 27th September,2091
                              </option>
                              <option value={31}>E- Bay</option>
                              <option value={71}>E-BAY</option>
                              <option value={754}>
                                EBIX TECHNOLOGIES PRIVATE LIMITED
                              </option>
                              <option value={1170}>
                                ECU INTERNATIONAL (ASIA) PRIVATE LIMITED
                              </option>
                              <option value={1027}>
                                EDWARDS LIFESCIENCES (INDIA) PRIVATE LIMITED
                              </option>
                              <option value={62}>EFKON</option>
                              <option value={633}>EIH LTD</option>
                              <option value={1131}>
                                EIT SERVICES INDIA PRIVATE LIMITED
                              </option>
                              <option value={1022}>
                                EMCURE PHARMACEUTICALS LIMITED
                              </option>
                              <option value={718}>EMSTPL</option>
                              <option value={1251}>EMotorad</option>
                              <option value={1089}>EPAM India</option>
                              <option value={309}>
                                ERICSSON INDIA GLOBAL SERVICES PRIVATE LIMITED
                              </option>
                              <option value={624}>ERNST &amp; young LLp</option>
                              <option value={762}>ESIC HOSPITAL</option>
                              <option value={854}>
                                ETERNAL FLAME PRODUCTIONS LLP
                              </option>
                              <option value={1128}>
                                ETHAN INFOTECH PRIVATE LIMITED
                              </option>
                              <option value={499}>EUPHORIA TECNOLOGIES</option>
                              <option value={535}>
                                EURO SCHOOL EDUCATION TRUST
                              </option>
                              <option value={369}>EVOLVE TECH</option>
                              <option value={901}>Eastern Railway</option>
                              <option value={220}>Eaton</option>
                              <option value={563}>Edelweiss</option>
                              <option value={915}>
                                Edward Food Research and analysis center Limited
                              </option>
                              <option value={109}>
                                Edwards Life sciences Pvt Ltd
                              </option>
                              <option value={1396}>
                                Eicher Motors Limited
                              </option>
                              <option value={768}>Electonic Eye</option>
                              <option value={744}>Ellaquai Dehati Bank</option>
                              <option value={931}>
                                Elyzium technologies pvt. Ltd
                              </option>
                              <option value={1404}>Emami Limited</option>
                              <option value={237}>Emcure</option>
                              <option value={1249}>
                                Emcure Pharmaceuticals
                              </option>
                              <option value={759}>
                                Employer-1: SECURE METERS LTD.
                              </option>
                              <option value={1390}>Enrich Beauty</option>
                              <option value={1196}>
                                Equinix India Pvt Ltd
                              </option>
                              <option value={714}>Equitas Bank</option>
                              <option value={801}>Eurasia</option>
                              <option value={609}>
                                Evonik India Private Limited
                              </option>
                              <option value={686}>
                                Excel controlinkage Pvt. Ltd
                              </option>
                              <option value={1118}>Excel industries Ltd</option>
                              <option value={1258}>Exela Technologies</option>
                              <option value={482}>Experies It</option>
                              <option value={646}>Exult Infosolutions</option>
                              <option value={1009}>Ezetap</option>
                              <option value={1073}>
                                FAMOUS INNOVATIONS DIGITAL CREATIVE PRIVATE
                                LIMITED
                              </option>
                              <option value={1033}>
                                FIDELIS CORPORATE SOLUTIONS PRIVATE LIMITED
                              </option>
                              <option value={1035}>
                                FIDELITY BUSINESS SERVICES INDIA PRIVATE LIMITED
                              </option>
                              <option value={440}>FIGmd India Pvt Ltd</option>
                              <option value={590}>
                                FINE TECH CORPORATION PRIVATE LIMITED
                              </option>
                              <option value={697}>
                                FIRSTRAND SERVICES PRIVATE LIMITED
                              </option>
                              <option value={438}>
                                FIS SOLUTIONS (INDIA) PRIVATE LIMITED
                              </option>
                              <option value={515}>
                                FLYJAC LOGISTICS PVT LTD
                              </option>
                              <option value={1012}>
                                FMC technologies India Pvt LTD
                              </option>
                              <option value={1331}>
                                FORD MOTOR PRIVATE LIMITED
                              </option>
                              <option value={729}>FORECAST ADVERTISING</option>
                              <option value={361}>
                                FOUNTAINHEAD ENTERTAINMENT PRIVATE LIMITED
                              </option>
                              <option value={679}>FP client</option>
                              <option value={1023}>
                                FRACTAL INK DESIGN STUDIO PRIVATE LIMITED
                              </option>
                              <option value={1341}>
                                FRANCO INDIAN PHARMACEUTICLS PVT LIMITED
                              </option>
                              <option value={1182}>
                                FRIGORIFICO ALLANA PRIVATE LIMITED
                              </option>
                              <option value={446}>
                                FULCRO CONSULTING PVT. LTD.
                              </option>
                              <option value={393}>FUTURE ENTERPRISE LTD</option>
                              <option value={511}>
                                FUTURE ENTERPRISES LIMITED
                              </option>
                              <option value={1339}>
                                FUTURE GENERAL INDIA LIFE INSURANCECOMPANY
                                LIMITED
                              </option>
                              <option value={1042}>
                                FUTURE GENERALI INDIA LIFE INSURANCE COMPANY
                                LIMITED
                              </option>
                              <option value={1313}>
                                FUTURE LIFESTYLE FASHION LMITED
                              </option>
                              <option value={320}>FUTURE RETAIL LIMITED</option>
                              <option value={331}>
                                FUTURE SPECIALITY RETAIL LIMITED
                              </option>
                              <option value={337}>
                                FUTURE SUPPLY CHAIN SOLUTIONS LIMITED
                              </option>
                              <option value={1286}>
                                Fabtech Technologies International Ltd.
                              </option>
                              <option value={196}>Farmer</option>
                              <option value={876}>Fedbank</option>
                              <option value={1417}>Fedex Express</option>
                              <option value={502}>
                                Ferro Tech India Pvt Ltd
                              </option>
                              <option value={644}>
                                Fintoo Wealth Private Limited - External Events
                              </option>
                              <option value={110}>
                                Fintoo Wealth Private Limited
                              </option>
                              <option value={1259}>Fintoo Wealth Private Limited</option>
                              <option value={906}>
                                Fincare Small Finance Bank
                              </option>
                              <option value={871}>
                                Fintech Ltd. &amp; Hindustan Platinum.
                              </option>
                              <option value={232}>FirstRand Services </option>
                              <option value={1441}>Flexiloan</option>
                              <option value={602}>Fly Dubai</option>
                              <option value={66}>For Bhopal </option>
                              <option value={401}>
                                Forbes Marshall Pvt Ltd
                              </option>
                              <option value={45}>Fountain Head MKTG</option>
                              <option value={276}>
                                Fountainhead enterainment pvt ltd
                              </option>
                              <option value={1446}>Fourth Force</option>
                              <option value={883}>Franko</option>
                              <option value={416}>Free lancing</option>
                              <option value={701}>
                                Frigorifico Allana Pvt Ltd
                              </option>
                              <option value={1172}>Fruit Business</option>
                              <option value={958}>Furniture</option>
                              <option value={573}>
                                Future Focus Infotech{" "}
                              </option>
                              <option value={428}>
                                Future Generali India Insurance Co Ltd
                              </option>
                              <option value={91}>
                                Future Generali Life Insurance
                              </option>
                              <option value={44}>Future Group</option>
                              <option value={381}>
                                Future lifestyle fashions limited
                              </option>
                              <option value={1087}>G</option>
                              <option value={235}>GATEWAY TECHNOLABS</option>
                              <option value={627}>
                                GAVS TECHNOLOGIES PRIVATE LIMITED
                              </option>
                              <option value={1378}>
                                GE OIL AND GAS INDIA PRIVATE LIMITED
                              </option>
                              <option value={989}>
                                GEBBS HEALTHCARE SOLUTIONS PVT LTD
                              </option>
                              <option value={1352}>GENESIS</option>
                              <option value={1010}>GENPACT</option>
                              <option value={1090}>
                                GENPACT INDIA PRIVATE LIMITED
                              </option>
                              <option value={1368}>
                                GERSON LEHRMAN GROUP INDIA PRIVATE LIMITED
                              </option>
                              <option value={723}>
                                GH Watch And Mobile Centre
                              </option>
                              <option value={685}>GHCL</option>
                              <option value={1266}>GHV India Pvt Ltd</option>
                              <option value={90}>GIFC - GUNJAN</option>
                              <option value={548}>GLAXOSMITHKLINE </option>
                              <option value={1155}>
                                GLOBAL E-BUSINESS OPERATIONS PRIVATE LIMITED
                              </option>
                              <option value={373}>GLOBALLOGIC INDIA LTD</option>
                              <option value={157}>
                                GLOBEOP FINANCIAL SERVICES TECHNOLOGIES (INDIA)
                                PRIVATE LIMITED
                              </option>
                              <option value={546}>
                                GLOBEOP FINANCIAL SERVICES TECHNOLOGIES (INDIA)
                                PRIVATE LIMITED{" "}
                              </option>
                              <option value={51}>GO AIR</option>
                              <option value={743}>
                                GPRO SERVICES INDIA PRIVATE LIMITED,POWAI,MUMBAI
                              </option>
                              <option value={742}>
                                GPRO Services India Pvt Limited
                              </option>
                              <option value={227}>GRAB GRECO LLP</option>
                              <option value={1055}>
                                GROUP M MEDIA INDIA PRIVATE LIMITED
                              </option>
                              <option value={692}>GS ENGG AND CONST.</option>
                              <option value={1412}>GTT</option>
                              <option value={1361}>GXO Logistics</option>
                              <option value={942}>
                                Galderma India Pvt Ltd
                              </option>
                              <option value={498}>Gansons Limited</option>
                              <option value={467}>Gartner India Pvt Ld.</option>
                              <option value={962}>
                                Gati Logistics Limited
                              </option>
                              <option value={626}>Gavs technology </option>
                              <option value={1409}>
                                General Mills Pvt Ltd
                              </option>
                              <option value={875}>Genius Consultant</option>
                              <option value={676}>
                                Global services corpn.
                              </option>
                              <option value={727}>
                                GoQuest Media Ventures
                              </option>
                              <option value={170}>Godrej</option>
                              <option value={961}>
                                Godrej &amp; Boyce Mfg. Co.Ltd
                              </option>
                              <option value={1310}>Godrej Construction</option>
                              <option value={332}>
                                Gokuldham High School &amp; Junior College
                              </option>
                              <option value={193}>
                                GoldenSource International
                              </option>
                              <option value={716}>
                                Goldmine Advertising ltd
                              </option>
                              <option value={1200}>
                                Goldmine Advertising Ltd
                              </option>
                              <option value={506}>
                                Gourmat Investment Pvt LTD
                              </option>
                              <option value={146}>Goverment servant</option>
                              <option value={372}>Government School</option>
                              <option value={147}>Government servant</option>
                              <option value={731}>Govt.</option>
                              <option value={228}>Grab Greco</option>
                              <option value={770}>Gram Panchayat</option>
                              <option value={796}>
                                Greenpark hotels and resorts ltd
                              </option>
                              <option value={513}>
                                Grey Orange India Private Limited
                              </option>
                              <option value={596}>Gromor Finance</option>
                              <option value={826}>Group M</option>
                              <option value={514}>Growel &amp; Weil</option>
                              <option value={89}>Gunjan</option>
                              <option value={1138}>H-Energy</option>
                              <option value={256}>HAFELE INDIA PVT. LTD</option>
                              <option value={121}>HALUL OFFSHORE-MILAHE</option>
                              <option value={303}>HCL TECHNOLOGIES</option>
                              <option value={1219}>HDFC</option>
                              <option value={1322}>HDFC BANK</option>
                              <option value={263}>HDFC BANK LIMITED</option>
                              <option value={260}>HDFC Ergo</option>
                              <option value={785}>
                                HDFC Life insurance company limited
                              </option>
                              <option value={1374}>
                                HINDUSTAN PETROLEUM CORPN LTD
                              </option>
                              <option value={1030}>
                                HINDUSTAN THOMPSON ASSOCIATES PRIVATE LIMITED
                              </option>
                              <option value={1287}>
                                HOME CREDIT INDIA FINANCE PRIVATE LIMITED
                              </option>
                              <option value={562}>HOME TUITIONS</option>
                              <option value={168}>HOUSE WIFE - NO JOB</option>
                              <option value={1058}>
                                HSBC SOFTWARE DEVELOPMENT (INDIA) PVT. LTD.
                              </option>
                              <option value={1169}>
                                HUGHES SYSTIQUE PRIVATE LIMITED
                              </option>
                              <option value={974}>HURUIYASS</option>
                              <option value={668}>
                                Harshita Water Supplier
                              </option>
                              <option value={445}>Hathway</option>
                              <option value={977}>Havells India Limited</option>
                              <option value={995}>Hexagon Nutrition</option>
                              <option value={656}>Hexaware Technologies</option>
                              <option value={385}>
                                Hindustan Pencils Pvt Ltd
                              </option>
                              <option value={395}>
                                Hindustan Petroleum Corporation Limited
                              </option>
                              <option value={421}>Hindustan Unilever</option>
                              <option value={635}>Hitachi</option>
                              <option value={1383}>Hitachi Astemo</option>
                              <option value={436}>
                                Holostik India Limited
                              </option>
                              <option value={707}>Home based tution</option>
                              <option value={1376}>Homefirst India</option>
                              <option value={412}>Homemaker</option>
                              <option value={955}>Hotel archie regency</option>
                              <option value={999}>Hotelivate</option>
                              <option value={905}>House of Anita Dongre</option>
                              <option value={371}>House wife</option>
                              <option value={282}>Household income</option>
                              <option value={198}>Housewife</option>
                              <option value={96}>I-FIN Financials</option>
                              <option value={1112}>
                                IBM INDIA PRIVATE LIMITED
                              </option>
                              <option value={117}>IBM India Pvt Ltd</option>
                              <option value={1161}>ICICI BANK LIMITED</option>
                              <option value={464}>ICICI Bank</option>
                              <option value={1373}>
                                ICICI LOMBARD GENERAL INSURANCE CO. LTD.
                              </option>
                              <option value={183}>ICICI SECURITIES LTD</option>
                              <option value={1083}>IDFC BANK LIMITED</option>
                              <option value={409}>IDFC Bank</option>
                              <option value={491}>IIFL</option>
                              <option value={82}>IIFL - Capital Gain</option>
                              <option value={299}>
                                IIFL DISTRIBUTION SERVICES LIMITED
                              </option>
                              <option value={484}>
                                IIFL HOME FINANCE LIMITED
                              </option>
                              <option value={261}>
                                IIFL SECURITIES LIMITED
                              </option>
                              <option value={574}>IIGM-PRIVATE LTD</option>
                              <option value={81}>IIIFL - Normal filing</option>
                              <option value={531}>IIPL</option>
                              <option value={783}>
                                IKEA INDIA PRIVATE LIMITED
                              </option>
                              <option value={487}>
                                INDIA INFOLINE FINANCE LIMITED
                              </option>
                              <option value={399}>INDIA INFOLINE LTD</option>
                              <option value={1321}>
                                INDIA MEDTRONIC PRIVATE LIMITED
                              </option>
                              <option value={367}>
                                INDIANIVESH FUND MANAGERS PRIVATE LIMITED
                              </option>
                              <option value={1306}>
                                INDOCO REMEDIES LIMITED
                              </option>
                              <option value={1338}>
                                INDOTHERMO FURNANCE AND ENGINEERIMG PRIVATE
                                LIMITED
                              </option>
                              <option value={65}>INFINX </option>
                              <option value={1094}>
                                INFODART TECHNOLOGIES LIMITED
                              </option>
                              <option value={1178}>INFOSYS BPM LIMITED</option>
                              <option value={595}>
                                INIDAN OIL CORPORATION LIMITED
                              </option>
                              <option value={997}>
                                INTELYM TECHNOLOGIES PRIVATE LIMITED
                              </option>
                              <option value={150}>
                                INTERGLOBE AVIATION LIMITED
                              </option>
                              <option value={142}>
                                INTERVET INDIA PRVT LTD.{" "}
                              </option>
                              <option value={47}>INVENTIA HEALTH CARE</option>
                              <option value={1088}>
                                INVENTIA HEALTHCARE LIMITED
                              </option>
                              <option value={239}>
                                INVIMATIC SOLUTIONS LLP
                              </option>
                              <option value={155}>IQVIA</option>
                              <option value={1079}>
                                IRON MOUNTAIN SERVICES PRIVATE LIMITED
                              </option>
                              <option value={455}>ISOURCEOPPPORTUNITIES</option>
                              <option value={197}>
                                ISS Facility Services India Pvt Ltd
                              </option>
                              <option value={941}>ITP Media Group</option>
                              <option value={850}>Iaf</option>
                              <option value={598}>Idea Cellular Ltd</option>
                              <option value={1453}>Imaging End Points</option>
                              <option value={870}>
                                Impresario Entertainment and Hospitality Pvt.
                                Ltd.
                              </option>
                              <option value={897}>
                                India government mint, Mumbai
                              </option>
                              <option value={108}>
                                IndiaFirst Life Insurance Comp
                              </option>
                              <option value={710}>Indial airfoce</option>
                              <option value={760}>Indian Air force</option>
                              <option value={504}>Indian Navy</option>
                              <option value={1369}>
                                Indian Oil corporation limited
                              </option>
                              <option value={857}>Indian army</option>
                              <option value={675}>Indian made</option>
                              <option value={983}>Indigo Consulting</option>
                              <option value={255}>
                                Indoscent Electronic Pvt Ltd.
                              </option>
                              <option value={585}>
                                Indus Software Pvt Ltd
                              </option>
                              <option value={238}>IndusInd Bank</option>
                              <option value={1050}>
                                Infinx Services Pvt. Ltd.
                              </option>
                              <option value={187}>Infodesk</option>
                              <option value={459}>Infogain</option>
                              <option value={190}>Infosys</option>
                              <option value={747}>
                                Infrasoft Technologies Ltd
                              </option>
                              <option value={851}>
                                Ingenero Technologies India Pvt. Ltd.
                              </option>
                              <option value={33}>Ingram Micro</option>
                              <option value={1326}>
                                Ingram Micro India Private Limited
                              </option>
                              <option value={1424}>
                                Inkoniq it solution private limited
                              </option>
                              <option value={460}>
                                Innova Solutions Pvt Ltd.
                              </option>
                              <option value={910}>Innovative Solutions</option>
                              <option value={1167}>Innoviti</option>
                              <option value={809}>Inscape Cowork</option>
                              <option value={1044}>
                                Inspira Enterprise India Private Limited
                              </option>
                              <option value={566}>
                                Insteel Engineers Pvt. Ltd.
                              </option>
                              <option value={607}>Insurance Agent</option>
                              <option value={862}>
                                Intas pharmaceutical Ltd
                              </option>
                              <option value={327}>
                                Intelenet Global Services
                              </option>
                              <option value={534}>Inter globe</option>
                              <option value={251}>
                                Invascent Advisory Private Ltd.
                              </option>
                              <option value={1111}>Investec</option>
                              <option value={706}>Iprocess</option>
                              <option value={951}>Ivl india. Pvt ltd</option>
                              <option value={542}>
                                J P MORGAN SERVICES INDIA PRIVATE LIMITED
                              </option>
                              <option value={547}>J.M.Baxi &amp; Co</option>
                              <option value={149}>JEBI Technologies LLP</option>
                              <option value={359}>
                                JET AIRWAYS (INDIA) LIMITED
                              </option>
                              <option value={1018}>
                                JIO PLATFORMS LIMITED
                              </option>
                              <option value={444}>JLT</option>
                              <option value={105}>JM Baxi</option>
                              <option value={1016}>
                                JM FINANCIAL ASSET RECONSTRUCTION COMPANY
                                LIMITED
                              </option>
                              <option value={97}>JM Financials</option>
                              <option value={620}>JNS</option>
                              <option value={1317}>
                                JOHANSON AND JOHANSON PRIVATE LIMITED
                              </option>
                              <option value={54}>JOHNSON &amp; JOHNSON</option>
                              <option value={333}>JP MORGAN</option>
                              <option value={325}>
                                JP Morgan India Services Pvt ltd
                              </option>
                              <option value={161}>JSW</option>
                              <option value={1438}>JSW GBS</option>
                              <option value={867}>JSW Steel Ltd.</option>
                              <option value={1290}>JW marriott Sahar</option>
                              <option value={929}>Jai durga health care</option>
                              <option value={452}>Jet Airways</option>
                              <option value={1006}>Jio</option>
                              <option value={1429}>John Deere India</option>
                              <option value={145}>
                                Johnson &amp; Johnson Pvt Ltd
                              </option>
                              <option value={533}>Johnson&amp;Johnson</option>
                              <option value={295}>Jones Lang LaSallae</option>
                              <option value={779}>
                                Joshi Autowheels Pvt Ltd
                              </option>
                              <option value={313}>Jupiter capital</option>
                              <option value={740}>Justdail</option>
                              <option value={653}>K raheja Corp</option>
                              <option value={1003}>
                                KALAYAN SIR ONLINE IAS
                              </option>
                              <option value={666}>
                                KALP INSURANCE MARKETING PVT. LTD. MUZAFFARNAGAR
                              </option>
                              <option value={612}>KARVY</option>
                              <option value={734}>KAVERI GRAMEENA BANK</option>
                              <option value={88}>KCLGUNJAN</option>
                              <option value={657}>KGP Auto Ltd Pune</option>
                              <option value={294}>
                                KNIGHT FRANK INDIA PVT. LTD
                              </option>
                              <option value={317}>KOHINOOR</option>
                              <option value={1137}>
                                KOTAK MAHINDRA BANK LIMITED
                              </option>
                              <option value={1192}>
                                KPIT TECHNOLOGIES LIMITED
                              </option>
                              <option value={370}>KSB PUMPS PVT. LTD</option>
                              <option value={394}>KSHITIJ YOG CENTER</option>
                              <option value={923}>Kale Logistics</option>
                              <option value={1193}>Kalpataru Limited</option>
                              <option value={900}>Kanakia</option>
                              <option value={587}>
                                Kanpur Division Lower Ganga Canal
                              </option>
                              <option value={1175}>
                                Kasturba Medical College
                              </option>
                              <option value={813}>
                                Kataria automobile Pvt. LTD.
                              </option>
                              <option value={934}>Katariya mobile point</option>
                              <option value={27}>Kelloggs</option>
                              <option value={1253}>Ketto</option>
                              <option value={1394}>Knight Frank</option>
                              <option value={1283}>Knowlarity</option>
                              <option value={1244}>Kofax</option>
                              <option value={1427}>
                                Komaf Financial Services Private Limited
                              </option>
                              <option value={1372}>
                                Konecranes and Demag Private Limited
                              </option>
                              <option value={1166}>
                                Korloy India Tooling (P) Ltd
                              </option>
                              <option value={59}>Kotak Bank</option>
                              <option value={764}>
                                Kotak Mahindra Life Insurance Company Limited
                              </option>
                              <option value={945}>Kotak Mutual Fund</option>
                              <option value={843}>Kotak securities</option>
                              <option value={953}>Kumar traders</option>
                              <option value={189}>L &amp; T , Parel</option>
                              <option value={1315}>
                                L &amp; T HYDROCARBON ENGINEERNG LIMITED
                              </option>
                              <option value={291}>L&amp;K</option>
                              <option value={1288}>
                                L&amp;T HYDROCARBON ENGINEERING LIMITED
                              </option>
                              <option value={230}>L&amp;T Infotech</option>
                              <option value={165}>L&amp;T Reality</option>
                              <option value={1039}>
                                LARSEN &amp; TOUBRO INFOTECH LIMITED
                              </option>
                              <option value={1075}>
                                LARSEN AND TOUBRO LIMITED
                              </option>
                              <option value={557}>LAUREN IT PVT. LTD.</option>
                              <option value={772}>LIC of India</option>
                              <option value={75}>LIFESTYLE</option>
                              <option value={1410}>LOreal India Pvt Ltd</option>
                              <option value={1323}>LTCG</option>
                              <option value={87}>LUPIN</option>
                              <option value={1296}>LUPIN LIMITED</option>
                              <option value={1034}>LUXOFT INDIA LLP</option>
                              <option value={604}>
                                LUXURY BOULEVARD AGENCIES PRIVATE LIMITED SANJAY
                                RAGHUNATH MORE
                              </option>
                              <option value={756}>
                                Lajwanti B Garela High School
                              </option>
                              <option value={938}>Lakme Lever Pvt Ltd</option>
                              <option value={1243}>Landmark</option>
                              <option value={639}>
                                Landmark Insurance Brokers Pvt Ltd
                              </option>
                              <option value={30}>
                                Larsen &amp; Toubro (L&amp;T India)
                              </option>
                              <option value={253}>
                                Larsen &amp; Toubro Hydrocarbon Engineering
                              </option>
                              <option value={677}>Lavkush enterprisea</option>
                              <option value={201}>Lawer</option>
                              <option value={688}>Laxmi ladies wear</option>
                              <option value={1456}>Leadsquared</option>
                              <option value={1455}>Learning Mate</option>
                              <option value={247}>
                                LearningMate solutions pvt ltd
                              </option>
                              <option value={1181}>Lenskart</option>
                              <option value={696}>
                                Life care ortho and neuro physiotherapy center
                              </option>
                              <option value={1445}>Limechat</option>
                              <option value={886}>Linq store</option>
                              <option value={660}>
                                Litmus Information Systems LLP
                              </option>
                              <option value={551}>
                                Locon Solutions Private Limited
                              </option>
                              <option value={501}>Lodha Group</option>
                              <option value={829}>Logicserve Digital</option>
                              <option value={391}>Lokmanya Gurukul</option>
                              <option value={1048}>
                                Lokmat Media Pvt. Ltd.
                              </option>
                              <option value={879}>M + R LOGISTICS</option>
                              <option value={593}>
                                M/s Roshni Enterprises
                              </option>
                              <option value={804}>
                                MA IT Solutions Pvt. Ltd.
                              </option>
                              <option value={380}>MAERSK LINE </option>
                              <option value={1036}>
                                MAERSK LINE INDIA PRIVATE LIMITED
                              </option>
                              <option value={305}>
                                MAERSK LINE INDIA PVT LTD
                              </option>
                              <option value={1101}>
                                MAHANAGAR TELEPHONE NIGAM LIMITED - MUMBAI
                                (SOUTH
                              </option>
                              <option value={520}>MAHANAGR</option>
                              <option value={1052}>
                                MAHINDRA FIRST CHOICE SERVICES LIMITED
                              </option>
                              <option value={1019}>
                                MAKE ME EASY SOLUTIONS PRIVATE LIMITED
                              </option>
                              <option value={1340}>
                                MAKE MY TRIP INDIA PRIVAT ELIMITED
                              </option>
                              <option value={347}>
                                MANTHAN SYSTEMS PVT LTD
                              </option>
                              <option value={175}>MCX</option>
                              <option value={1400}>
                                MED- REVEAL LASER PRIVATE LIMITED
                              </option>
                              <option value={1179}>
                                MERCEDES BENZ RESEARCH AND DEVELOPMENT INDIA
                              </option>
                              <option value={297}>MERIL ENDO SURGERY</option>
                              <option value={1148}>
                                MERIL ENDO SURGERY PRIVATE LIMITED
                              </option>
                              <option value={717}>
                                METLIFE GLOBAL OPERATIONS SUPPORT CENTER PRIVATE
                                LIMITED
                              </option>
                              <option value={611}>METRO SHOES LTD</option>
                              <option value={1123}>
                                METROPOLIS HEALTHCARE LIMITED
                              </option>
                              <option value={1289}>
                                MG MOTOR INDIA PRIVATE LIMITED
                              </option>
                              <option value={1271}>
                                MIHIKA INSURANCE &amp; FINANCIAL SERVICES PVT
                                LTD
                              </option>
                              <option value={1015}>
                                MIHIKA INSURANCE MARKETING FIRM LLP
                              </option>
                              <option value={177}>
                                MILLWARD BROWN MARKET RESEARCH SERVICES INDIA
                                PRIVATE LIMITED
                              </option>
                              <option value={1195}>
                                MILVIK TECHNOLOGY SERVICES INDIA PRIVATE LIMITED
                              </option>
                              <option value={815}>MMT</option>
                              <option value={1125}>
                                MODERN ROAD MAKERS PRIVATE LIMITED
                              </option>
                              <option value={435}>MOL-IPS</option>
                              <option value={1299}>
                                MOMONTIVE PERFORMANCE MATERIAL INDIA PRIVATE
                                LIMITED
                              </option>
                              <option value={528}>
                                MONDELEZ INDIA FOODS PVT. LTD
                              </option>
                              <option value={1129}>MPHASIS LIMITED</option>
                              <option value={1237}>MPower</option>
                              <option value={441}>MRSS India</option>
                              <option value={982}>
                                MSC Software India Pvt. Ltd.
                              </option>
                              <option value={980}>MSL</option>
                              <option value={914}>MSL Group</option>
                              <option value={129}>MTNL</option>
                              <option value={246}>MUMBAI AIRPORT</option>
                              <option value={195}>MUMBAI PORT TRUST</option>
                              <option value={1324}>
                                MUNCIPAL CORPORATION OF GREATER MUMBAI
                              </option>
                              <option value={583}>
                                MUNICIPAL COPRATION OF GREATER MUMBAI
                              </option>
                              <option value={878}>
                                MUNICIPAL CORPORATION OF GREATER MUMBAI
                              </option>
                              <option value={863}>MUTHOOT FINCORP LTD</option>
                              <option value={979}>MX Player</option>
                              <option value={808}>
                                Ma Nanda Financial Services
                              </option>
                              <option value={77}>Macleods</option>
                              <option value={1076}>
                                Magic Wand Empowerment Private limited
                              </option>
                              <option value={143}>
                                Maharashtra State Government - ICDS
                              </option>
                              <option value={221}>Mahindra</option>
                              <option value={738}>
                                Mahindra &amp; Mahindra Financial Services Ltd
                              </option>
                              <option value={41}>Mahindra First Choice</option>
                              <option value={569}>Majesco</option>
                              <option value={787}>
                                Make Me Easy Solutions Pvt Ltd
                              </option>
                              <option value={545}>Make me easy</option>
                              <option value={846}>Makkar poly exports</option>
                              <option value={605}>
                                Malayala Manorama Co. Ltd
                              </option>
                              <option value={1206}>Manipal Cigna</option>
                              <option value={288}>
                                Margo networks pvt. ltd. Mumbai
                              </option>
                              <option value={1334}>Marriott Group</option>
                              <option value={490}>Mastek</option>
                              <option value={417}>Mastercard</option>
                              <option value={93}>Max Bupa Health</option>
                              <option value={94}>
                                Max Life Insurance Co. Ltd.
                              </option>
                              <option value={693}>
                                Medley Pharmaceuticals limited
                              </option>
                              <option value={1000}>
                                Medulla Communications
                              </option>
                              <option value={769}>
                                Mercados Energy Markets India Private Limited
                              </option>
                              <option value={728}>
                                Messe Muenchen India Pvt Ltd
                              </option>
                              <option value={1220}>Microsoft</option>
                              <option value={1238}>
                                Mihika Financial Services Private Limited
                              </option>
                              <option value={167}>Miki Enterprises</option>
                              <option value={758}>
                                Minda sai Component Division
                              </option>
                              <option value={699}>Ministry of Railway</option>
                              <option value={912}>Mobile Shop</option>
                              <option value={592}>
                                Mobinext Technologies Pvt Ltd
                              </option>
                              <option value={268}>
                                Modern Road Makers Pvt Ltd
                              </option>
                              <option value={1171}>
                                Modern Road Makers Pvt.Ltd.
                              </option>
                              <option value={240}>
                                Modus Information System
                              </option>
                              <option value={185}>
                                Modus Information System Ltd
                              </option>
                              <option value={816}>Mohota Industries Ltd</option>
                              <option value={885}>Mojika real Estate</option>
                              <option value={485}>
                                Mondelez International
                              </option>
                              <option value={889}>
                                Monocept Consulting Pvt. Ltd.
                              </option>
                              <option value={181}>Morgan Stanley</option>
                              <option value={946}>Motilal Mutual Fund</option>
                              <option value={996}>
                                Motilal Oswal Financial Services Ltd
                              </option>
                              <option value={207}>Mphasis</option>
                              <option value={803}>Mr.</option>
                              <option value={691}>Ms traders</option>
                              <option value={302}>
                                Mukesh Patel School of Engineering &amp;
                                Technology
                              </option>
                              <option value={874}>My Prop Docs Pvt Ltd</option>
                              <option value={781}>
                                NATIONAL INSURANCE COMPANY LIMITED
                              </option>
                              <option value={1448}>
                                NAYARA ENERGY LIMITED
                              </option>
                              <option value={158}>NDS Infoserv</option>
                              <option value={825}>
                                NEARBY TECHNOLOGIES PVT LTD
                              </option>
                              <option value={408}>
                                NETSCRIBES INDIA PVT LTD
                              </option>
                              <option value={1002}>NIKHIL ADHESIVES LTD</option>
                              <option value={1284}>NMIMS</option>
                              <option value={191}>NO WORK</option>
                              <option value={1393}>
                                NOT APPLICABLE AS RETIRED FROM SERVICES
                              </option>
                              <option value={1301}>
                                NOVARTHIS HEALTH CARE PRIVATE LIMITED
                              </option>
                              <option value={588}>
                                NRC MARATHI PRIMARY SCHOOL
                              </option>
                              <option value={107}>NSE</option>
                              <option value={956}>NSEIT</option>
                              <option value={351}>NTH DIMENSION LLP</option>
                              <option value={389}>
                                NUFUTURE DIGITAL (INDIA) LIMITED
                              </option>
                              <option value={1121}>
                                NUFUTURE DIGITAL (INDIA) LIMITED.
                              </option>
                              <option value={284}>
                                NUTRICIA INTERNATIONAL PRIVATE LIMITED
                              </option>
                              <option value={314}>
                                Naam Bengaluru Foundation
                              </option>
                              <option value={76}>Nabard</option>
                              <option value={443}>
                                Nabhiraja Software Design Pvt. Ltd
                              </option>
                              <option value={564}>
                                Naprod Life Sciences, Pvt. Ltd
                              </option>
                              <option value={899}>
                                National board of computer education
                              </option>
                              <option value={1257}>
                                National pension Authority
                              </option>
                              <option value={966}>Navy Officer</option>
                              <option value={1062}>Nayara Energy Ltd</option>
                              <option value={1272}>
                                Neeyamo Enterprise Solutions
                              </option>
                              <option value={383}>Neosoft </option>
                              <option value={382}>Neosoft Technologies</option>
                              <option value={1309}>Nestle group</option>
                              <option value={1305}>Net Receipt</option>
                              <option value={29}>Net Scribe</option>
                              <option value={492}>Netmagic </option>
                              <option value={430}>
                                Netscribes (India) Private Limited
                              </option>
                              <option value={994}>
                                New India Assurance Co. Ltd.
                              </option>
                              <option value={1260}>Nichrome</option>
                              <option value={296}>Night Frank</option>
                              <option value={792}>Nil</option>
                              <option value={439}>Nilkamal Ltd</option>
                              <option value={310}>
                                Niraamaya retreats Private Limited
                              </option>
                              <option value={750}>
                                Nissan Motor Corporation
                              </option>
                              <option value={922}>No</option>
                              <option value={658}>No company</option>
                              <option value={274}>
                                Nokia solution &amp; networks limited
                              </option>
                              <option value={1180}>
                                Northern Trust Operating Services
                              </option>
                              <option value={259}>Not Employed</option>
                              <option value={469}>Not Working, None </option>
                              <option value={790}>Not any</option>
                              <option value={258}>Not applicable</option>
                              <option value={613}>
                                Not working got a capital gain
                              </option>
                              <option value={478}>Novartis</option>
                              <option value={281}>
                                Nuance Transcription Services India Private
                                Limited
                              </option>
                              <option value={217}>
                                Nutricia India Private Limited
                              </option>
                              <option value={1154}>
                                Nutricia International Pvt. Ltd.
                              </option>
                              <option value={1130}>
                                Nyk ship management pte Ltd
                              </option>
                              <option value={869}>O</option>
                              <option value={1355}>
                                OCS group india private limited
                              </option>
                              <option value={1362}>OEConnection</option>
                              <option value={1248}>
                                OGPEX Geoscience Pvt. Ltd.
                              </option>
                              <option value={1325}>
                                OIL AND NATURAL GAS CORPORATION LIMITED
                              </option>
                              <option value={709}>
                                OMKAR REALTORS AND DEVELOPERS PRIVATE LIMITED
                              </option>
                              <option value={1070}>
                                OMKAR REALTORS MAHALAXMI PROJECT LLP
                              </option>
                              <option value={1359}>ONGC</option>
                              <option value={1314}>
                                ONGC, PUBLIC SECTOR UNERTAKING
                              </option>
                              <option value={1134}>
                                ONLY RETAIL PRIVATE LIMITED
                              </option>
                              <option value={292}>ONLY retail pvt. ltd.</option>
                              <option value={939}>
                                OOCL - Orient Overseas (International) Limited
                              </option>
                              <option value={236}>
                                ORACLE FINANCIAL SERVICES SOFTWARE LIMITED
                              </option>
                              <option value={1291}>OTHERS</option>
                              <option value={53}>OTIS</option>
                              <option value={1040}>
                                OTIS ELEVATOR CO (INDIA) LTD
                              </option>
                              <option value={283}>Oberoi </option>
                              <option value={517}>
                                Ogilvy &amp; Mather Pvt. Ltd.
                              </option>
                              <option value={817}>Ola</option>
                              <option value={952}>Om SAI HERBAL INDIA</option>
                              <option value={935}>Om tours trevle</option>
                              <option value={1092}>OmanAir</option>
                              <option value={497}>
                                Onward Technologies Limited
                              </option>
                              <option value={554}>
                                Optimum Logistics Pvt. Ltd.
                              </option>
                              <option value={422}>Oscar pneumatics </option>
                              <option value={777}>
                                Owens Corning (I) Pvt. Ltd.
                              </option>
                              <option value={998}>Own</option>
                              <option value={1222}>
                                Ozone Pharmaceuticals Ltd
                              </option>
                              <option value={1320}>P &amp; C</option>
                              <option value={304}>PACE JR SCI COLLEGE</option>
                              <option value={684}>
                                PALIA FRAINY EDDIE (PROP. CLINICAL DIAGNOSTIC
                                LABO RATORIES)
                              </option>
                              <option value={293}>PAYPAL INDIA PVT LTD</option>
                              <option value={250}>PD HINDUJA HOSPITAL</option>
                              <option value={1188}>
                                PDS INTERNATIONAL PRIVATE LIMITED
                              </option>
                              <option value={505}>
                                PETROFAC ENGINEERING INDIA PRIVATE LIMITED
                              </option>
                              <option value={1256}>PFRDA</option>
                              <option value={1160}>
                                PHILIPS INDIA LIMITED
                              </option>
                              <option value={1319}>
                                PIDILITE INDUSTRIES LTD
                              </option>
                              <option value={376}>
                                PLASTIBLENDS INDIA LTD.
                              </option>
                              <option value={1252}>
                                PMG Integrated Communications Pvt. Ltd.
                              </option>
                              <option value={466}>
                                PMJ GEMS &amp; JEWELS PVT LTD
                              </option>
                              <option value={649}>PNB METLIFE</option>
                              <option value={465}>
                                POWERSCHOOL INDIA PRIVATE LIMITED
                              </option>
                              <option value={360}>
                                PRAXIS HOME RETAIL, FUTURE RETAIL
                              </option>
                              <option value={650}>PRNAM</option>
                              <option value={300}>
                                PRNAM &amp; ASSOCIATES LLP
                              </option>
                              <option value={643}>
                                PRNAM &amp; Associates - External Events
                              </option>
                              <option value={1074}>
                                PUBLICIS COMMUNICATIONS PRIVATE LIMITED
                              </option>
                              <option value={298}>PUMA ENERGY</option>
                              <option value={681}>PUSHPANJALI READYMADE</option>
                              <option value={287}>
                                PVPP College of Engineering
                              </option>
                              <option value={1295}>Page Industries Ltd</option>
                              <option value={32}>Pan India Food Pvt Ltd</option>
                              <option value={1268}>Pari Robotics</option>
                              <option value={836}>
                                Parksons Packaging Ltd
                              </option>
                              <option value={892}>
                                Paschim Banga Gramin Bank
                              </option>
                              <option value={749}>
                                Patna Bhaktiyarpur Tollway Limited
                              </option>
                              <option value={462}>Pensioner</option>
                              <option value={1365}>
                                People Teach Enterprises Private Limited
                              </option>
                              <option value={1005}>Performics India</option>
                              <option value={784}>Philips</option>
                              <option value={719}>Pidilite Industires</option>
                              <option value={1402}>Pinnacle Consulting</option>
                              <option value={964}>Pittie Group</option>
                              <option value={1152}>Poddar hospital</option>
                              <option value={1199}>
                                Portescap India Pvt Ltd
                              </option>
                              <option value={171}>Prabhat Dairy Ltd.</option>
                              <option value={925}>
                                Prabhat Engineering Works
                              </option>
                              <option value={920}>
                                Prafful overseas Pvt Ltd panoli Ankleshwar
                                gujrat
                              </option>
                              <option value={1008}>Pragati Leadership</option>
                              <option value={782}>Pranjal Consultants</option>
                              <option value={839}>Preet Beauty Parlour</option>
                              <option value={638}>Premco Global</option>
                              <option value={335}>
                                Pricewaterhousecoopers
                              </option>
                              <option value={144}>
                                Principal Kendriya Vidyalay
                              </option>
                              <option value={959}>
                                Privi Organics Pvt Ltd
                              </option>
                              <option value={123}>
                                Prnam and Associates LLP
                              </option>
                              <option value={1242}>Probus</option>
                              <option value={708}>Profession</option>
                              <option value={663}>Property advisor</option>
                              <option value={985}>Publicis Media</option>
                              <option value={991}>Publicis Worldwide</option>
                              <option value={838}>Punjab National Bank</option>
                              <option value={597}>
                                Purnartha Investment Advisers
                              </option>
                              <option value={859}>
                                Purple Martin education company
                              </option>
                              <option value={741}>Pvt.</option>
                              <option value={1213}>
                                Pyramid Softsol Private Limited
                              </option>
                              <option value={1205}>
                                QUALCOMM INDIA PRIVATE LIMITED
                              </option>
                              <option value={1174}>
                                QUALITEST INDIA PRIVATE LIMITED
                              </option>
                              <option value={386}>QUESS CORP LIMITED</option>
                              <option value={52}>QUINNOX</option>
                              <option value={1038}>
                                QWIK SUPPLY CHAIN PRIVATE LIMITED
                              </option>
                              <option value={802}>Qaish INFOTECH</option>
                              <option value={102}>Quanical Technologies</option>
                              <option value={277}>R&amp;R CONSULTANT</option>
                              <option value={1280}>
                                RAJASTHAN ANTIBIOTICS LIMITED
                              </option>
                              <option value={60}>RAK Ceramics</option>
                              <option value={540}>RAO</option>
                              <option value={818}>RAPIDSTALL</option>
                              <option value={1397}>RARE Hospitility</option>
                              <option value={868}>
                                RATYAL CONSTRUCTIONS PRIVATE LIMITED
                              </option>
                              <option value={1204}>
                                RAYMOND APPAREL LIMITED
                              </option>
                              <option value={725}>RBL Bank Ltd</option>
                              <option value={526}>
                                REACHLOCAL SERVICES PRIVATE LIMITED
                              </option>
                              <option value={84}>RED FM</option>
                              <option value={1109}>
                                REDIFF.COM INDIA LIMITED
                              </option>
                              <option value={1032}>
                                RELIANCE CORPORATE IT PARK LIMITED
                              </option>
                              <option value={726}>
                                RELIANCE CORPORATE IT PARK LTD
                              </option>
                              <option value={1025}>
                                RELIANCE INDUSTRIES LIMITED
                              </option>
                              <option value={1020}>
                                RELIANCE JIO INFOCOMM LIMITED
                              </option>
                              <option value={194}>
                                RELIANCE JIO INFOCOMM LTD
                              </option>
                              <option value={1014}>
                                RELIANCE PAYMENT SOLUTIONS LIMITED
                              </option>
                              <option value={1017}>
                                RELIANCE PROJECTS &amp; PROPERTY MANAGEMENT
                                SERVICES
                              </option>
                              <option value={379}>
                                RELIANCE STRATEGIC MANPOWER SOLUTIONS PVT LTD
                              </option>
                              <option value={849}>RENEWBUY.COM</option>
                              <option value={1157}>
                                RENTLY SOFTWARE DEVELOPMENT PRIVATE LIMITED
                              </option>
                              <option value={127}>RETIRED</option>
                              <option value={365}>
                                RETIRED AND GOVERRNMENT EMPLOYEE{" "}
                              </option>
                              <option value={1370}>
                                REVERATE TECH PRIVATE LIMITED
                              </option>
                              <option value={1141}>
                                RICHMOND EDUCATIONAL SOCIETY
                              </option>
                              <option value={798}>RK FINANCE SERVICES</option>
                              <option value={1380}>
                                ROQUETTE INDIA PRIVATE LIMITED
                              </option>
                              <option value={1113}>
                                RPG LIFE SCIENCES LIMITED
                              </option>
                              <option value={1162}>RUDRAX XEROX</option>
                              <option value={536}>
                                Rahul Packaging PVT LTD.
                              </option>
                              <option value={698}>Railway</option>
                              <option value={1344}>Randstad India</option>
                              <option value={632}>
                                Randstad India Private Limited
                              </option>
                              <option value={1416}>
                                Randstad Offshore Services
                              </option>
                              <option value={786}>Raymond</option>
                              <option value={1415}>
                                Red Hat India Private Limited
                              </option>
                              <option value={34}>Reliance</option>
                              <option value={215}>Reliance , Ghansoli</option>
                              <option value={35}>Reliance ADA</option>
                              <option value={1392}>
                                Reliance BP Mobility Limited
                              </option>
                              <option value={70}>
                                Reliance Foreign Income
                              </option>
                              <option value={68}>Reliance Free</option>
                              <option value={362}>Reliance JIO</option>
                              <option value={572}>
                                Reliance Nippon Life Insurance Company Limited{" "}
                              </option>
                              <option value={188}>
                                Reliance Retail Limited
                              </option>
                              <option value={69}>Reliance capital gain</option>
                              <option value={902}>
                                Religare Broking LImited
                              </option>
                              <option value={388}>
                                Retail Light Techniques India Ltd
                              </option>
                              <option value={732}>Retired Individual</option>
                              <option value={884}>Retired officer</option>
                              <option value={780}>Reymond</option>
                              <option value={1279}>
                                Rich Products Corporation{" "}
                              </option>
                              <option value={908}>Ring plus aqua</option>
                              <option value={842}>
                                Rivigo service pvt ltd
                              </option>
                              <option value={1458}>Roche</option>
                              <option value={225}>Roche Products</option>
                              <option value={1442}>Rossari Biotech </option>
                              <option value={456}>Rosyblue</option>
                              <option value={1391}>Rotary CLub</option>
                              <option value={678}>
                                Royal sundaram insurance company
                              </option>
                              <option value={927}>Rps pharma</option>
                              <option value={823}>Rs associates</option>
                              <option value={488}>
                                Rubique Technologies India Pvt Ltd
                              </option>
                              <option value={774}>
                                Rui change technologis pvt ltd
                              </option>
                              <option value={463}>
                                Rural Development Trust (RDT)
                              </option>
                              <option value={1405}>
                                Rusk Media Private Limited
                              </option>
                              <option value={654}>S</option>
                              <option value={375}>
                                S Mobile Devices Limited
                              </option>
                              <option value={788}>
                                S T Mehta Womens Junior College
                              </option>
                              <option value={711}>S. K. Associates</option>
                              <option value={264}>SAMSUNG</option>
                              <option value={1198}>SAP Labs India</option>
                              <option value={713}>SARASWATHI MALIGAI</option>
                              <option value={872}>SBAHC</option>
                              <option value={211}>SBI</option>
                              <option value={132}>
                                SBI FUNDS MANAGEMENT PRIVATE LIMITED
                              </option>
                              <option value={1201}>
                                SBI General Insurance
                              </option>
                              <option value={944}>SBI Mutual Fund</option>
                              <option value={1028}>
                                SCHNEIDER ELECTRIC SYSTEMS INDIA PRIVATE LIMITED
                              </option>
                              <option value={1408}>SCL</option>
                              <option value={1202}>
                                SECURITRANS INDIA PRIVATE LIMITED
                              </option>
                              <option value={404}>SELF EMPLOYED</option>
                              <option value={1185}>SHAREit Technology</option>
                              <option value={1047}>
                                SHEMAROO ENTERTAINMENT LIMITED
                              </option>
                              <option value={396}>
                                SHINING DEW DROPS SCHOOL
                              </option>
                              <option value={543}>SHOPPERS STOP LIMITED</option>
                              <option value={349}>SHOPPERSSTOPLTD</option>
                              <option value={1382}>
                                SHRI BOMBAY AND MANGROL JAIN SABHA
                              </option>
                              <option value={1108}>
                                SI CREVA CAPITAL SERVICES PRIVATE LIMITED
                              </option>
                              <option value={1056}>
                                SIEMENS HEALTHCARE PRIVATE LIMITED
                              </option>
                              <option value={312}>SIEMENS LIMITED</option>
                              <option value={751}>SILVERMOADA PVT LTD</option>
                              <option value={243}>
                                SIRO CLINPHARM PVT LTD
                              </option>
                              <option value={1103}>
                                SKODA AUTO VOLKSWAGEN INDIA PRIVATE LIMITED
                              </option>
                              <option value={921}>SOFP INDIA</option>
                              <option value={812}>SPACEMORE</option>
                              <option value={1120}>
                                SPINE TECHNO SERVICES
                              </option>
                              <option value={987}>SSP</option>
                              <option value={1292}>
                                STATE BANK OF INDIA ERANDAWANE BR
                              </option>
                              <option value={403}>STERIA INDIA LIMITED</option>
                              <option value={978}>
                                STERLING INFORMATION RESOURCES INDIA PRIVATE
                                LIMITED
                              </option>
                              <option value={254}>
                                STERLITE POWER GRID VENTURES LIMITED
                              </option>
                              <option value={1218}>
                                STRATACACHE INDIA PRIVATE LIMITED
                              </option>
                              <option value={1119}>
                                STRATSOL SOFTWARE SYSTEMS PRIVATE LIMITED
                              </option>
                              <option value={229}>SULPHUR MILLS LTD</option>
                              <option value={135}>
                                SUMITOMO CHEMICAL INDIA PVT LTD
                              </option>
                              <option value={1203}>SUMMER FIELDS SCHOOL</option>
                              <option value={162}>SUN PHARMACEUTICALS</option>
                              <option value={431}>
                                SUNDARAM ASSET MANAGEMENT COMPANY LIMITED
                              </option>
                              <option value={1221}>SWYM Corporation</option>
                              <option value={216}>Saatchi &amp; Saatchi</option>
                              <option value={794}>Sahu Traders</option>
                              <option value={736}>Sai maritime</option>
                              <option value={683}>
                                Sami Labs Ltd, Bangalore
                              </option>
                              <option value={1065}>Sapience Analytics</option>
                              <option value={1147}>
                                Sapient Consulting Private Limited
                              </option>
                              <option value={672}>Saraswati</option>
                              <option value={594}>
                                Saraswati Education Society
                              </option>
                              <option value={648}>
                                Sarvotham Care Limited
                              </option>
                              <option value={834}>Sati dairy farm</option>
                              <option value={957}>
                                Satija tour and travels
                              </option>
                              <option value={971}>
                                Satin Creditcare Netword Ltd
                              </option>
                              <option value={793}>Sb sacffolding</option>
                              <option value={761}>
                                Schindler India Pvt Ltd
                              </option>
                              <option value={720}>Schlumberger</option>
                              <option value={346}>School</option>
                              <option value={640}>
                                Seaspan India Corporation
                              </option>
                              <option value={1327}>Sedin</option>
                              <option value={270}>
                                Seeh Al Sarya Engineering LLC
                              </option>
                              <option value={182}>
                                Self Employed Businessman
                              </option>
                              <option value={1235}>Self Practice</option>
                              <option value={151}>Self employes</option>
                              <option value={348}>
                                Servion Global Solution Ltd
                              </option>
                              <option value={1282}>
                                Seth Jai Parkash Polytechnic Damla
                              </option>
                              <option value={1357}>Shadowfax</option>
                              <option value={866}>Shakun Motors Pvt.LTD</option>
                              <option value={1209}>
                                Shalina Laboratories ltd
                              </option>
                              <option value={1072}>Shapoorji Pallonji</option>
                              <option value={853}>Sharaf Cargo</option>
                              <option value={695}>Sharda Enterprises</option>
                              <option value={1450}>Share India</option>
                              <option value={174}>Sharekhan Ltd</option>
                              <option value={138}>
                                ShawMan Software private limited
                              </option>
                              <option value={139}>Shawman</option>
                              <option value={141}>Shawman software</option>
                              <option value={1078}>Shell</option>
                              <option value={674}>Shriram Grand city</option>
                              <option value={245}>Shriram Housing</option>
                              <option value={1423}>
                                Shriram Transport Finance Company Limited
                              </option>
                              <option value={364}>Shudh Plus Hygine </option>
                              <option value={311}>Sify Technologies</option>
                              <option value={715}>Simran Suri</option>
                              <option value={1236}>
                                Sitel India Pvt. Ltd.
                              </option>
                              <option value={579}>
                                Sixsigma Softsolution PVT LTD
                              </option>
                              <option value={180}>
                                Sleek International Pvt Ltd
                              </option>
                              <option value={1413}>Smollan</option>
                              <option value={1431}>
                                Smollan India Pvt Ltd
                              </option>
                              <option value={450}>
                                Smt Indira Gandhi College of Engineering
                              </option>
                              <option value={916}>Softyoug solution</option>
                              <option value={615}>
                                Solsynch Technologies Private Limited
                              </option>
                              <option value={1444}>Solutelab</option>
                              <option value={530}>Sparkle</option>
                              <option value={837}>Sphinix Worldbiz Ltd</option>
                              <option value={173}>Spi Global</option>
                              <option value={414}>
                                Spine Technologies Ltd.
                              </option>
                              <option value={888}>
                                Spirited Auto Cars (I) Ltd
                              </option>
                              <option value={1059}>Srikanth Sridharan</option>
                              <option value={673}>
                                Standard chartered bank
                              </option>
                              <option value={95}>Star Health</option>
                              <option value={861}>Star India Pvt Ltd</option>
                              <option value={800}>Star Support Services</option>
                              <option value={124}>Sugar Factory</option>
                              <option value={828}>
                                Surekha engineering pvt ltd
                              </option>
                              <option value={1067}>
                                Suroj Buildcon Pvt Ltd
                              </option>
                              <option value={821}>
                                Suvision Holdings Pvt Ltd
                              </option>
                              <option value={631}>
                                Swadeshi Footwear Pvt Ltd
                              </option>
                              <option value={363}>Swiss Re Insurance</option>
                              <option value={1269}>Synacor Inc.</option>
                              <option value={1254}>
                                Syncworks Solutions Pvt. Ltd.
                              </option>
                              <option value={775}>Syndicate bank</option>
                              <option value={634}>Synechron Tecnologies</option>
                              <option value={486}>Syntel</option>
                              <option value={508}>TAJ HOTELS</option>
                              <option value={204}>
                                TATA AIA LIFE INSURANCE COMPANY LIMITED
                              </option>
                              <option value={852}>
                                TATA CAPITAL FINANCIAL SERVICES LIMITED
                              </option>
                              <option value={582}>
                                TATA COMMUNICATIONS LIMITED
                              </option>
                              <option value={1348}>
                                TATA CONSULTANCY SERVICE LIMITED
                              </option>
                              <option value={111}>
                                TATA CONSULTANCY SERVICES LIMITED
                              </option>
                              <option value={1093}>
                                TATA TECHNOLOGIES LIMITED
                              </option>
                              <option value={475}>
                                TATA TRENT HYPERMARKET
                              </option>
                              <option value={1071}>TATA UNISTORE LTD</option>
                              <option value={28}>TCS</option>
                              <option value={471}>
                                TDS Management Consultant Pvt.Ltd
                              </option>
                              <option value={308}>
                                TEACHER (DARODE JOG PRATHAMIC VIDYALA)
                              </option>
                              <option value={58}>TECH MAHINDRA</option>
                              <option value={1063}>
                                TECH MAHINDRA LIMITED
                              </option>
                              <option value={262}>
                                TECHNOWEB MARKETING PVT LTD
                              </option>
                              <option value={1224}>
                                TECOSIM Engineering Services Pvt Ltd.
                              </option>
                              <option value={1139}>TESCO</option>
                              <option value={1308}>
                                THE BRITISH SCHOOL SOCIETY
                              </option>
                              <option value={56}>THE GOLDEN SOURCE</option>
                              <option value={57}>
                                THE GOLDEN SOURCE - CAPITAL GA
                              </option>
                              <option value={622}>
                                THE HIMALAYA DRUG COMPANY
                              </option>
                              <option value={433}>THE LALIT</option>
                              <option value={1381}>
                                THINK AND LEARN PRIVATE
                              </option>
                              <option value={518}>THOMSON REUTERS</option>
                              <option value={43}>THYSSENKRUPP</option>
                              <option value={415}>
                                TIBCO Software India Pvt. Ltd.
                              </option>
                              <option value={1021}>
                                TLG INDIA PRIVATE LIMITED
                              </option>
                              <option value={984}>TLG India Pvt Ltd</option>
                              <option value={1142}>TNSI Retail Pvt Ltd</option>
                              <option value={600}>TOI</option>
                              <option value={377}>TORM</option>
                              <option value={1064}>
                                TRAFIGURA GLOBAL SERVICES PRIVATE LIMITED
                              </option>
                              <option value={63}>
                                TRAFIGURA GLOBAL SERVICES PVT{" "}
                              </option>
                              <option value={1156}>
                                TRIGENT SOFTWARE LIMITED
                              </option>
                              <option value={1054}>
                                TRISTAR MANAGEMENT SERVICES PRIVATE LIMITED
                              </option>
                              <option value={1158}>
                                TTEC INDIA CUSTOMER SOLUTIONS PRIVATE LIMITED
                              </option>
                              <option value={541}>TTK Prestige Ltd</option>
                              <option value={1273}>TVS Motor Company</option>
                              <option value={92}>
                                Tata AIG General insurance
                              </option>
                              <option value={423}>
                                Tata Housing Development Company
                              </option>
                              <option value={1385}>Tata Projects</option>
                              <option value={472}>Tata Teleservices Ltd</option>
                              <option value={820}>
                                Tata international limited
                              </option>
                              <option value={306}>
                                Tayana Software Solutions Private Limited
                              </option>
                              <option value={1029}>
                                Team Lease Services Pvt Ltd
                              </option>
                              <option value={591}>
                                Techmahindra business services ltd
                              </option>
                              <option value={810}>
                                Telebu Communications LLP
                              </option>
                              <option value={213}>
                                Teradata India Pvt Ltd
                              </option>
                              <option value={1247}>Test</option>
                              <option value={745}>
                                Thakur institute of Management studies and
                                research
                              </option>
                              <option value={565}>
                                The Boston Consulting Group Pvt Ltd
                              </option>
                              <option value={98}>The Freight Center</option>
                              <option value={203}>The Lalit Hotel</option>
                              <option value={1091}>The Orbis School</option>
                              <option value={481}>
                                Tiberewala Electricals
                              </option>
                              <option value={619}>TikDot</option>
                              <option value={1399}>Times Internet</option>
                              <option value={917}>Tiwari saflayar</option>
                              <option value={1275}>Tom Tom</option>
                              <option value={128}>TomTom</option>
                              <option value={1223}>Top-Guinee SARL</option>
                              <option value={552}>
                                Torrent Phamaceuticals Ltd
                              </option>
                              <option value={771}>Tour Nd travels</option>
                              <option value={249}>
                                Tracers India Search Pvt Ltd
                              </option>
                              <option value={407}>Trafigura</option>
                              <option value={733}>Transasia Biomedicals</option>
                              <option value={307}>Transsion Holdings</option>
                              <option value={350}>
                                Transsion Holdings Ltd
                              </option>
                              <option value={319}>
                                Transsion Holdings Ltd.
                              </option>
                              <option value={352}>
                                Transsion India Pvt Ltd
                              </option>
                              <option value={1107}>
                                True north management
                              </option>
                              <option value={805}>
                                Tulsidas khimji pvt ltd
                              </option>
                              <option value={988}>
                                Twenty Twenty Media Pvt. Ltd
                              </option>
                              <option value={919}>UB company</option>
                              <option value={1045}>
                                UBS BUSINESS SOLUTIONS (INDIA) PRIVATE LIMITED
                              </option>
                              <option value={522}>UCB</option>
                              <option value={1001}>UHD</option>
                              <option value={354}>UNICHEM</option>
                              <option value={1377}>UNION BANK OF INDIA</option>
                              <option value={1418}>
                                UNITED IRON AND STEEL LLC
                              </option>
                              <option value={890}>UPADHYAY &amp; SONS</option>
                              <option value={279}>UPG College</option>
                              <option value={1281}>US CONSULATE</option>
                              <option value={1080}>
                                US TECHNOLOGY INTERNATIONAL PRIVATE LIMITED
                              </option>
                              <option value={556}>
                                UTI ASSET MANAGEMENT COMPANY LIMITED
                              </option>
                              <option value={1177}>
                                UltraTech Cement Limited
                              </option>
                              <option value={432}>Unemployed</option>
                              <option value={1316}>
                                Unilever industries private limited
                              </option>
                              <option value={913}>
                                V inspirer facility Management Private limited
                              </option>
                              <option value={448}>
                                VACS Technology Pvt Ltd
                              </option>
                              <option value={1366}>
                                VENTURE INDIA PRIVATE LIMITED
                              </option>
                              <option value={621}>
                                VERO MODA PRIVATE LIMITED
                              </option>
                              <option value={1105}>
                                VERO MODA RETAIL PRIVATE LIMITED
                              </option>
                              <option value={218}>VESIT </option>
                              <option value={1343}>VFS Global</option>
                              <option value={537}>VGHJ</option>
                              <option value={893}>
                                VIDHYA ALANKAR SCHOOL OF INFORMATION TECHNOLOGY
                              </option>
                              <option value={199}>
                                VIDYA MANDIR HIGH SCHOOL
                              </option>
                              <option value={1293}>VIP Industries</option>
                              <option value={1276}>
                                VMWARE SOFTWARE INDIA PRIVATE LIMITED
                              </option>
                              <option value={83}>VODAFONE - Gunjan</option>
                              <option value={42}>VOLTAS</option>
                              <option value={61}>
                                VOLTAS - NORMAL ITR FILING
                              </option>
                              <option value={1037}>VOLTAS LIMITED</option>
                              <option value={559}>
                                VULCAN EXPRESS PRIVATE LIMITED
                              </option>
                              <option value={1351}>VVF INDIA LIMITED</option>
                              <option value={1349}>Valeo</option>
                              <option value={1439}>Varvali</option>
                              <option value={858}>
                                Vector Consulting Group
                              </option>
                              <option value={1398}>
                                Vector Green Energy Pvt. Ltd
                              </option>
                              <option value={700}>Vedanta Limited</option>
                              <option value={694}>Vedwati foods</option>
                              <option value={936}>
                                Vetphage Pharmaceuticals
                              </option>
                              <option value={521}>
                                Vijay Transtech Pvt Ltd
                              </option>
                              <option value={586}>Virtela India</option>
                              <option value={667}>Virtuous Retail</option>
                              <option value={584}>Virtusa</option>
                              <option value={970}>Virtusa, Inventech</option>
                              <option value={840}>Vision India Realtors</option>
                              <option value={1217}>Viteos Capital</option>
                              <option value={739}>
                                Vivek Vas &amp; Associates
                              </option>
                              <option value={558}>
                                Vivira Retail Foods Pvt Ltd
                              </option>
                              <option value={903}>Volkswagen</option>
                              <option value={975}>Voltas Ltd</option>
                              <option value={960}>
                                VoltasBeko Home Appliances Pvt Ltd
                              </option>
                              <option value={318}>VoltasLtd</option>
                              <option value={489}>WEB WORKS</option>
                              <option value={753}>
                                WEIR MINERALS (INDIA) PRIVATE
                              </option>
                              <option value={1051}>
                                WEIR MINERALS (INDIA) PRIVATE LIMITED
                              </option>
                              <option value={752}>
                                WEIR MINERALS (INDIA) PRIVATE LTD.
                              </option>
                              <option value={241}>
                                WEIR MINERALS INDIA PVT LTD
                              </option>
                              <option value={1146}>WIPRO LIMITED</option>
                              <option value={78}>WOCKHARDT</option>
                              <option value={278}>WOCKHARDT LTD.</option>
                              <option value={618}>Walmart</option>
                              <option value={1061}>
                                Walsingham House School
                              </option>
                              <option value={642}>
                                Webinar - Open Participants
                              </option>
                              <option value={1435}>Wellness Forever</option>
                              <option value={1228}>
                                Wellthy Therapeutics Pvt Ltd
                              </option>
                              <option value={1403}>Welspun Group</option>
                              <option value={1004}>
                                Westcon Middle East Ltd
                              </option>
                              <option value={1082}>Willis Towers Watson</option>
                              <option value={665}>
                                Winny Immigration &amp; Education Services Pvt
                                Ltd.
                              </option>
                              <option value={451}>Wipro</option>
                              <option value={285}>Wipro Ltd</option>
                              <option value={1229}>Wockhardt Foundation</option>
                              <option value={1232}>
                                Wockhardt Global School
                              </option>
                              <option value={1227}>Wockhardt Hospitals</option>
                              <option value={1231}>
                                Wockhardt Research Centre
                              </option>
                              <option value={847}>World Class PVT.LTD</option>
                              <option value={366}>
                                XPO LOGISTICS WORLDWIDE INDIA PRIVATE LIMITED
                              </option>
                              <option value={1345}>
                                XYLAM WATER SOLUTION INDIA PRIAVTE LIMITED
                              </option>
                              <option value={549}>
                                Xoriant Solutions Pvt Ltd
                              </option>
                              <option value={1350}>Xoxoday</option>
                              <option value={1311}>YCMA UNIVERSITY</option>
                              <option value={1342}>
                                YCMA UNIVERSITYOF SCIENCE AND TECHNOLOGY
                                FARIDABAD
                              </option>
                              <option value={560}>
                                YUM RESTAURANTS INDIA PRIVATE LIMITED
                              </option>
                              <option value={722}>
                                Yello Resturant Civil Line Nagpur
                              </option>
                              <option value={848}>Yes Bank</option>
                              <option value={1099}>
                                ZEN QUALITY ASSURANCE PRIVATE LIMITED
                              </option>
                              <option value={553}>
                                ZS Associates India Pvt Ltd
                              </option>
                              <option value={1356}>
                                ZUVENTS HEALTHCARE LTD
                              </option>
                              <option value={943}>Zamil Steel India</option>
                              <option value={608}>ZenLive Media Pvt Ltd</option>
                              <option value={1110}>Zensar Technologies</option>
                              <option value={601}>Zerodha</option>
                              <option value={1353}>Zivame</option>
                              <option value={904}>Ziyad telecom store</option>
                              <option value={763}>
                                Zycus Infotech Pvt Ltd
                              </option>
                              <option value={500}>Zydus</option>
                              <option value={1432}>a raja shekar</option>
                              <option value={581}>abhudaya </option>
                              <option value={614}>adroitinfotech</option>
                              <option value={1186}>air india ltd</option>
                              <option value={479}>
                                alcatel lucent india ltd
                              </option>
                              <option value={887}>
                                alkem laboratories Ltd
                              </option>
                              <option value={449}>asus</option>
                              <option value={480}>atul Industries</option>
                              <option value={410}>atul LTD</option>
                              <option value={799}>australian embasy</option>
                              <option value={324}>bennett coleman</option>
                              <option value={152}>best</option>
                              <option value={527}>biocon</option>
                              <option value={680}>bookmyshow</option>
                              <option value={503}>cardinal</option>
                              <option value={334}>ccd</option>
                              <option value={159}>cera</option>
                              <option value={1297}>
                                cogzinant technology solution india private
                                limited
                              </option>
                              <option value={1363}>
                                colour creative private limited
                              </option>
                              <option value={789}>cong</option>
                              <option value={424}>
                                creative garments pvt ltd
                              </option>
                              <option value={755}>creative industries</option>
                              <option value={806}>crpf</option>
                              <option value={418}>customer</option>
                              <option value={160}>dimension data</option>
                              <option value={1150}>
                                disha comprehensive rehab centre
                              </option>
                              <option value={271}>
                                e-Hub Corporate Services Private Limited
                              </option>
                              <option value={1328}>ePayLater</option>
                              <option value={864}>
                                eQuantX Pharma Analytics Solutions
                              </option>
                              <option value={1421}>
                                enterprise system solution pvt road
                              </option>
                              <option value={137}>ex.siemens ltd.</option>
                              <option value={290}>fUJITSU</option>
                              <option value={1057}>
                                fractal ink design studio pvt ltd
                              </option>
                              <option value={387}>
                                future consumer limited
                              </option>
                              <option value={1294}>
                                future general india life insurance company
                                limited
                              </option>
                              <option value={525}>future gerali</option>
                              <option value={358}>future group vikhroli</option>
                              <option value={661}>g s textiles</option>
                              <option value={831}>
                                gb international school
                              </option>
                              <option value={338}>glenmark</option>
                              <option value={1135}>
                                healthium meditech pvt ltd
                              </option>
                              <option value={1115}>hindustan petroleum</option>
                              <option value={315}>home maker</option>
                              <option value={856}>
                                home maker, not in any job
                              </option>
                              <option value={1215}>housewife.</option>
                              <option value={390}>
                                hypercity retail india ltd
                              </option>
                              <option value={824}>
                                i2e consulting pvt ltd
                              </option>
                              <option value={330}>icici wealth</option>
                              <option value={767}>
                                iffco tokio general insurance
                              </option>
                              <option value={1302}>
                                industrial development bannk
                              </option>
                              <option value={210}>ipk partners</option>
                              <option value={164}>jana small</option>
                              <option value={589}>jethealthval Pvt Ltd </option>
                              <option value={873}>
                                jumbo corporate society
                              </option>
                              <option value={1364}>
                                kakad Housing Corporation
                              </option>
                              <option value={112}>kellogg</option>
                              <option value={578}>kelly service </option>
                              <option value={457}>l&amp;t</option>
                              <option value={507}>leighton india</option>
                              <option value={178}>lic</option>
                              <option value={1434}>lightbox creations</option>
                              <option value={219}>
                                mahatma education society
                              </option>
                              <option value={1420}>
                                mait india foundation equipment private limited
                              </option>
                              <option value={1347}>
                                malad cosmos education trust
                              </option>
                              <option value={336}>man global ltd</option>
                              <option value={807}>naval dockyaed</option>
                              <option value={561}>netscribes</option>
                              <option value={766}>newfancydresses</option>
                              <option value={830}>nnsdhsd</option>
                              <option value={273}>nokia networks</option>
                              <option value={1097}>not appliceble</option>
                              <option value={524}>not working</option>
                              <option value={1046}>nri</option>
                              <option value={1165}>
                                nutrica international private ltd
                              </option>
                              <option value={344}>omkar</option>
                              <option value={345}>omkar reality</option>
                              <option value={1060}>
                                omkar realtors &amp; developers pvt ltd
                              </option>
                              <option value={474}>
                                p&amp;b housing financial ltd
                              </option>
                              <option value={328}>pantaloons</option>
                              <option value={226}>passed away</option>
                              <option value={156}>pc patni</option>
                              <option value={575}>pfizer india</option>
                              <option value={1332}>presumtive</option>
                              <option value={1346}>
                                pricewaterhouse coopers private li mited
                              </option>
                              <option value={400}>prime focus limited</option>
                              <option value={671}>q</option>
                              <option value={384}>reired</option>
                              <option value={176}>reitred</option>
                              <option value={356}>reliance petroluem</option>
                              <option value={368}>ril</option>
                              <option value={652}>sagar</option>
                              <option value={811}>samco securities</option>
                              <option value={555}>sanofi pasteur</option>
                              <option value={494}>saraswat bank</option>
                              <option value={937}>school express</option>
                              <option value={655}>sdsdsd</option>
                              <option value={703}>seaferer</option>
                              <option value={510}>secure value</option>
                              <option value={625}>self</option>
                              <option value={567}>seya industries</option>
                              <option value={1173}>spicejet</option>
                              <option value={222}>state bank of india</option>
                              <option value={773}>super knit</option>
                              <option value={827}>supreme ltd</option>
                              <option value={355}>
                                syntel private limited
                              </option>
                              <option value={865}>tata</option>
                              <option value={172}>teacher</option>
                              <option value={1419}>testing</option>
                              <option value={374}>thakur village</option>
                              <option value={981}>
                                the great eastern shipping
                              </option>
                              <option value={1422}>
                                the oriental insurance company limited
                              </option>
                              <option value={212}>titan</option>
                              <option value={316}>tyssenkrupp</option>
                              <option value={568}>uk based</option>
                              <option value={1068}>varanasi cafe</option>
                              <option value={1098}>
                                vidal health insurance tpa
                              </option>
                              <option value={538}>
                                walter tools india private ltd
                              </option>
                              <option value={1298}>
                                writer business service private limited
                              </option>
                              <option value={841}>
                                yesjey consultancy services
                              </option>
                              <option value={576}>
                                zarika Hussain Delhi College
                              </option>
                              <option value={378}>zee media</option>
                              <option value={100}>Other</option>
                            </select>
                            <span
                              className="select2 select2-container select2-container--default"
                              dir="ltr"
                              data-select2-id={1}
                              style={{ width: "369.164px" }}
                            >
                              <span className="selection">
                                <span
                                  className="select2-selection select2-selection--single"
                                  role="combobox"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                  tabIndex={0}
                                  aria-labelledby="select2-ev_company_new-container"
                                >
                                  <span
                                    className="select2-selection__rendered"
                                    id="select2-ev_company_new-container"
                                    role="textbox"
                                    aria-readonly="true"
                                    title="Select Company*"
                                  >
                                    Select Company*
                                  </span>
                                  <span
                                    className="select2-selection__arrow"
                                    role="presentation"
                                  >
                                    <b role="presentation" />
                                  </span>
                                </span>
                              </span>
                              <span
                                className="dropdown-wrapper"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                          <div className="error-msg event_error_msg" />
                        </div>
                      </div>
                      <br />
                      <div className="row form-row" id="event_captcha_div">
                        <div className="col-md-5" style={{ minHeight: 65 }}>
                          <div className="position-relative">
                            <input
                              type="hidden"
                              name="captcha_code"
                              id="captcha_code"
                              defaultValue="MTc1MGE2"
                              autoComplete="off"
                            />
                            <div id="captcha_block">
                              <img
                                src="static/assets/img/captcha_MTc1MGE2.png"
                                style={{ float: "left" }}
                                draggable="false"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="position-relative">
                            <img
                              src={imagePath + "/static/media/Images/assets/img/refresh_captcha.png"}
                              onclick="getcaptcha('event_captcha_div')"
                              className="refresh_captcha"
                              alt="REFRESH CAPTCHA"
                            />
                          </div>
                        </div>
                        <br />
                        <div className="col-md-10">
                          <div className="position-relative">
                            <div className="material input">
                              <input
                                type="text"
                                autoComplete="off"
                                placeholder="Captcha*"
                                name="captcha"
                                id="captcha"
                                defaultValue=""
                                className="default-input"
                              />
                              <span className="bar" />
                            </div>
                            <div className="error-msg event_error_msg"></div>
                          </div>
                        </div>
                      </div>
                      <br />
                      <input
                        id="tag"
                        name="tag"
                        type="hidden"
                        ng-value="event_data.tag"
                        autoComplete="off"
                      />
                      <input
                        type="hidden"
                        id="event_name"
                        name="event_name"
                        ng-value="event_data.event_name"
                        autoComplete="off"
                      />
                      <input
                        type="hidden"
                        id="event_location"
                        name="event_location"
                        ng-value="event_data.location"
                        autoComplete="off"
                      />
                      <input
                        type="hidden"
                        id="timing"
                        name="timing"
                        ng-value="event_data.timing"
                        autoComplete="off"
                      />
                      <input
                        type="hidden"
                        id="datetiming"
                        name="datetiming"
                        ng-value="event_data.event_date"
                        autoComplete="off"
                      />
                      <input
                        type="hidden"
                        id="event_param"
                        name="event_param"
                        ng-value="event_data.event_param"
                        autoComplete="off"
                      />
                      <input
                        type="hidden"
                        id="event_company"
                        name="event_company"
                        ng-value="event_data.event_company"
                        autoComplete="off"
                      />
                      <input
                        type="hidden"
                        id="event_registration_company"
                        name="event_registration_company"
                        ng-value="event_data.event_registration_company"
                        autoComplete="off"
                      />
                      <input
                        type="hidden"
                        id="event_date"
                        name="event_date"
                        ng-value="event_data.event_date"
                        autoComplete="off"
                      />
                      <div className="row form-row">
                        <div className="col-md-10">
                          <div className="btn-container">
                            <button
                              type="submit"
                              value="Login"
                              className="default-btn"
                            >
                              Register
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div
                      className="form-success-msg text-center middle-form"
                      id="form-success-msg"
                      style={{ display: "none" }}
                    >
                      <img
                        height={300}
                        width={300}
                        src={imagePath + "/static/media/Images/assets/img/reports/thank-you-illustration.svg"}
                        alt=""
                        className="form-illustration"
                      />
                      <h3 className="m-0">
                        Thank you for Registering for '
                        <span
                          ng-bind="event_data.event_name "
                          className="ng-binding"
                        />
                        '
                      </h3>
                      <p>We will remind you post Webinar/ Seminar</p>
                    </div>
                    <div
                      className="form-success-msg text-center"
                      id="form-error-msg"
                      style={{ display: "none" }}
                    >
                      <h1>Something went wrong!!</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 wizard-body mt-3">
                {"title" in pageInfo && pageInfo.title.toLowerCase() ==
                  "upcoming" && (
                    <>
                      <div
                        id="ongoing"
                        className="mt-3"

                      >
                        <div className="row">
                          {/* ngRepeat: knowledge in ongoingPlansArr | filter:searchText| orderObjectBy:propertyName */}
                          <div
                            className="col-md-12"
                            ng-show="( ongoingPlans|filter:searchText).length == 0 ||ongoingPlans.length == 0"
                          >
                            <div className="col-md-12">
                              <div className="no-events-img text-center">
                                {/* <img src="https://images.minty.co.in/static/events/img/no-events.svg" alt=""> */}
                                <img
                                  src={imagePath + "/static/media/Images/events/img/no-events.svg"}
                                  alt=""
                                />
                                <h2 className="mt-3">No events found!</h2>
                              </div>
                            </div>
                          </div>
                          {/* pagination */}
                          {/* <div className="col-md-12 ng-hide" ng-show="nav2">
                            <nav aria-label="..." style={{ float: "right" }}>
                              <ul className="pagination">
                                <li
                                  className="page-item disabled previousPage2"
                                  data="previous"
                                  ng-click="pagePrevious2($event)"
                                >
                                  <a
                                    className="page-link"
                                    href="#"
                                    tabIndex={-1}
                                  >
                                    Previous
                                  </a>
                                </li>
                                <li
                                  className="page-item nextPage2"
                                  ng-class="{disabled: disabled2}"
                                  data="next"
                                  ng-click="pageNext2($event)"
                                >
                                  <a className="page-link" href="#">
                                    Next
                                  </a>
                                </li>
                              </ul>
                            </nav>
                          </div> */}
                        </div>
                      </div>
                    </>
                  )}

                {"title" in pageInfo && pageInfo.title.toLowerCase() ==
                  "ongoing" && (
                    <>
                      <div
                        id="ongoing"
                        className="mt-3"

                      >
                        <div className="row">
                          {/* ngRepeat: knowledge in ongoingPlansArr | filter:searchText| orderObjectBy:propertyName */}
                          <div
                            className="col-md-12"
                            ng-show="( ongoingPlans|filter:searchText).length == 0 ||ongoingPlans.length == 0"
                          >
                            <div className="col-md-12">
                              <div className="no-events-img text-center">
                                {/* <img src="https://images.minty.co.in/static/events/img/no-events.svg" alt=""> */}
                                <img
                                  src={imagePath + "/static/media/Images/events/img/no-events.svg"}
                                  alt=""
                                />
                                <h2 className="mt-3">No events found!</h2>
                              </div>
                            </div>
                          </div>
                          {/* pagination */}
                          {/* <div className="col-md-12 ng-hide" ng-show="nav2">
                            <nav aria-label="..." style={{ float: "right" }}>
                              <ul className="pagination">
                                <li
                                  className="page-item disabled previousPage2"
                                  data="previous"
                                  ng-click="pagePrevious2($event)"
                                >
                                  <a
                                    className="page-link"
                                    href="#"
                                    tabIndex={-1}
                                  >
                                    Previous
                                  </a>
                                </li>
           
                                <li
                                  className="page-item nextPage2"
                                  ng-class="{disabled: disabled2}"
                                  data="next"
                                  ng-click="pageNext2($event)"
                                >
                                  <a className="page-link" href="#">
                                    Next
                                  </a>
                                </li>
                              </ul>
                            </nav>
                          </div> */}

                        </div>
                      </div>
                    </>
                  )}

                {"title" in pageInfo && pageInfo.title.toLowerCase() ==
                  "previous" && (
                    <>
                      <div
                        id="previous"
                        className="mt-3 justify-content-center align-items-center"

                      >
                        <div className="row">
                          {/* ngRepeat: knowledge in previousPlansArr | filter:searchText| orderObjectBy:propertyName */}
                          <div
                            className="col-md-6 ng-scope"
                            ng-repeat="knowledge in previousPlansArr | filter:searchText| orderObjectBy:propertyName"
                          >
                            <div className="video-cover knowledge-base-cover events-cover">
                              <div className="video-slider-content video">
                                <div className="video-slider-content video">
                                  {/* ngIf: knowledge.background_image */}
                                  <div
                                    className="video-thumb-grid ng-scope"
                                    ng-if="knowledge.background_image"
                                  >
                                    <a
                                      href="event-details/event_un20221204-530"
                                      target="_self"
                                    >
                                      <img
                                        width={300}
                                        height={300}
                                        className="video-banner-img"
                                        ng-src="https://www.financialhospital.in/event/img/box cricket league  1440 -650-01.jpg"
                                        alt=""
                                        src="https://www.financialhospital.in/event/img/box cricket league  1440 -650-01.jpg"
                                      />
                                    </a>
                                  </div>
                                  {/* end ngIf: knowledge.background_image */}
                                </div>
                              </div>
                              <div className="testimonial-media knowledge-base-media">
                                <a
                                  href="mailto:?subject=Fintoo invites you to register for Box Cricket League&body=Hi%2C %0D%0A %0D%0A Here is an invitation for the event Box Cricket League on 2022-12-03 8:00 AM at Gurgaon.%0D%0A %0D%0A Do click the link below to join the event and register yourself.%0D%0A %0D%0Ahttps://www.fintoo.in/event-details/event_un20221204-530%0D%0A %0D%0A We are looking forward to see you attend the event.%0D%0A %0D%0A Thanks."
                                  className="share-icon d-ng-block"
                                  id="shareIcon"
                                />
                                <div className="client-info">
                                  <a
                                    className="event_name ng-binding"
                                    href="event-details/event_un20221204-530"
                                    target="_self"
                                  >
                                    Box Cricket League
                                  </a>
                                  <p className="event_hashtag ng-binding" />
                                  <div className="event-details mt-2">
                                    <div className="date-details col-md-8">
                                      <p className="event-date">
                                        {" "}
                                        <img
                                          src="https://static.fintoo.in/static/events/img/calendar.svg"
                                          alt=""
                                        />{" "}
                                        <span className="ng-binding">
                                          2022-12-03
                                        </span>{" "}
                                        |{" "}
                                        <span className="ng-binding">
                                          8:00 AM
                                        </span>
                                      </p>
                                      <p className="event-location">
                                        {" "}
                                        <img
                                          src="https://static.fintoo.in/static/events/img/grey-location.svg"
                                          alt=""
                                        />
                                        <span className="ng-binding">
                                          Gurgaon
                                        </span>
                                      </p>
                                    </div>
                                    <div className="col-md-4">
                                      {/* ngIf: knowledge.event_video_link */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* end ngRepeat: knowledge in previousPlansArr | filter:searchText| orderObjectBy:propertyName */}
                          <div
                            className="col-md-6 ng-scope"
                            ng-repeat="knowledge in previousPlansArr | filter:searchText| orderObjectBy:propertyName"
                          >
                            <div className="video-cover knowledge-base-cover events-cover">
                              <div className="video-slider-content video">
                                <div className="video-slider-content video">
                                  {/* ngIf: knowledge.background_image */}
                                  <div
                                    className="video-thumb-grid ng-scope"
                                    ng-if="knowledge.background_image"
                                  >
                                    <a
                                      href="event-details/event_fp20221111-529"
                                      target="_self"
                                    >
                                      <img
                                        width={300}
                                        height={300}
                                        className="video-banner-img"
                                        ng-src="static/events/img/event-slider.jpg"
                                        alt=""
                                        src="https://www.fintoo.in/static/events/img/event-slider.jpg"
                                      />
                                    </a>
                                  </div>
                                  {/* end ngIf: knowledge.background_image */}
                                </div>
                              </div>
                              <div className="testimonial-media knowledge-base-media">
                                <a
                                  href="mailto:?subject=Fintoo invites you to register for  Plan and Save your finance smartly&body=Hi%2C %0D%0A %0D%0A Here is an invitation for the event  Plan and Save your finance smartly on 2022-11-11 5:00 PM at MUMBAI.%0D%0A %0D%0A Do click the link below to join the event and register yourself.%0D%0A %0D%0Ahttps://www.fintoo.in/event-details/event_fp20221111-529%0D%0A %0D%0A We are looking forward to see you attend the event.%0D%0A %0D%0A Thanks."
                                  className="share-icon d-ng-block"
                                  id="shareIcon"
                                />
                                <div className="client-info">
                                  <a
                                    className="event_name ng-binding"
                                    href="event-details/event_fp20221111-529"
                                    target="_self"
                                  >
                                    {" "}
                                    Plan and Save your finance smartly
                                  </a>
                                  <p className="event_hashtag ng-binding" />
                                  <div className="event-details mt-2">
                                    <div className="date-details col-md-8">
                                      <p className="event-date">
                                        {" "}
                                        <img
                                          src="https://static.fintoo.in/static/events/img/calendar.svg"
                                          alt=""
                                        />{" "}
                                        <span className="ng-binding">
                                          2022-11-11
                                        </span>{" "}
                                        |{" "}
                                        <span className="ng-binding">
                                          5:00 PM
                                        </span>
                                      </p>
                                      <p className="event-location">
                                        {" "}
                                        <img
                                          src="https://static.fintoo.in/static/events/img/grey-location.svg"
                                          alt=""
                                        />
                                        <span className="ng-binding">
                                          MUMBAI
                                        </span>
                                      </p>
                                    </div>
                                    <div className="col-md-4">
                                      {/* ngIf: knowledge.event_video_link */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* end ngRepeat: knowledge in previousPlansArr | filter:searchText| orderObjectBy:propertyName */}
                          <div
                            className="col-md-6 ng-scope"
                            ng-repeat="knowledge in previousPlansArr | filter:searchText| orderObjectBy:propertyName"
                          >
                            <div className="video-cover knowledge-base-cover events-cover">
                              <div className="video-slider-content video">
                                <div className="video-slider-content video">
                                  {/* ngIf: knowledge.background_image */}
                                  <div
                                    className="video-thumb-grid ng-scope"
                                    ng-if="knowledge.background_image"
                                  >
                                    <a
                                      href="event-details/event_fp20221110-528"
                                      target="_self"
                                    >
                                      <img
                                        width={300}
                                        height={300}
                                        className="video-banner-img"
                                        ng-src="static/events/img/event-slider.jpg"
                                        alt=""
                                        src="https://www.fintoo.in/static/events/img/event-slider.jpg"
                                      />
                                    </a>
                                  </div>
                                  {/* end ngIf: knowledge.background_image */}
                                </div>
                              </div>
                              <div className="testimonial-media knowledge-base-media">
                                <a
                                  href="mailto:?subject=Fintoo invites you to register for  Know more about NPS&body=Hi%2C %0D%0A %0D%0A Here is an invitation for the event  Know more about NPS on 2022-11-10 4:00 PM at Virtual.%0D%0A %0D%0A Do click the link below to join the event and register yourself.%0D%0A %0D%0Ahttps://www.fintoo.in/event-details/event_fp20221110-528%0D%0A %0D%0A We are looking forward to see you attend the event.%0D%0A %0D%0A Thanks."
                                  className="share-icon d-ng-block"
                                  id="shareIcon"
                                />
                                <div className="client-info">
                                  <a
                                    className="event_name ng-binding"
                                    href="event-details/event_fp20221110-528"
                                    target="_self"
                                  >
                                    {" "}
                                    Know more about NPS
                                  </a>
                                  <p className="event_hashtag ng-binding" />
                                  <div className="event-details mt-2">
                                    <div className="date-details col-md-8">
                                      <p className="event-date">
                                        {" "}
                                        <img
                                          src="https://static.fintoo.in/static/events/img/calendar.svg"
                                          alt=""
                                        />{" "}
                                        <span className="ng-binding">
                                          2022-11-10
                                        </span>{" "}
                                        |{" "}
                                        <span className="ng-binding">
                                          4:00 PM
                                        </span>
                                      </p>
                                      <p className="event-location">
                                        {" "}
                                        <img
                                          src="https://static.fintoo.in/static/events/img/grey-location.svg"
                                          alt=""
                                        />
                                        <span className="ng-binding">
                                          Virtual
                                        </span>
                                      </p>
                                    </div>
                                    <div className="col-md-4">
                                      {/* ngIf: knowledge.event_video_link */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* end ngRepeat: knowledge in previousPlansArr | filter:searchText| orderObjectBy:propertyName */}
                          <div
                            className="col-md-6 ng-scope"
                            ng-repeat="knowledge in previousPlansArr | filter:searchText| orderObjectBy:propertyName"
                          >
                            <div className="video-cover knowledge-base-cover events-cover">
                              <div className="video-slider-content video">
                                <div className="video-slider-content video">
                                  {/* ngIf: knowledge.background_image */}
                                  <div
                                    className="video-thumb-grid ng-scope"
                                    ng-if="knowledge.background_image"
                                  >
                                    <a
                                      href="event-details/event_fp20221020-527"
                                      target="_self"
                                    >
                                      <img
                                        width={300}
                                        height={300}
                                        className="video-banner-img"
                                        ng-src="https://www.financialhospital.in/event/img/Website-for-Wockhardt.jpg"
                                        alt=""
                                        src="https://www.financialhospital.in/event/img/Website-for-Wockhardt.jpg"
                                      />
                                    </a>
                                  </div>
                                  {/* end ngIf: knowledge.background_image */}
                                </div>
                              </div>
                              <div className="testimonial-media knowledge-base-media">
                                <a
                                  href="mailto:?subject=Fintoo invites you to register for Understand Your CIBIL Score&body=Hi%2C %0D%0A %0D%0A Here is an invitation for the event Understand Your CIBIL Score on 2022-10-20 4:00 PM at Virtual.%0D%0A %0D%0A Do click the link below to join the event and register yourself.%0D%0A %0D%0Ahttps://www.fintoo.in/event-details/event_fp20221020-527%0D%0A %0D%0A We are looking forward to see you attend the event.%0D%0A %0D%0A Thanks."
                                  className="share-icon d-ng-block"
                                  id="shareIcon"
                                />
                                <div className="client-info">
                                  <a
                                    className="event_name ng-binding"
                                    href="event-details/event_fp20221020-527"
                                    target="_self"
                                  >
                                    Understand Your CIBIL Score
                                  </a>
                                  <p className="event_hashtag ng-binding" />
                                  <div className="event-details mt-2">
                                    <div className="date-details col-md-8">
                                      <p className="event-date">
                                        {" "}
                                        <img
                                          src="https://static.fintoo.in/static/events/img/calendar.svg"
                                          alt=""
                                        />{" "}
                                        <span className="ng-binding">
                                          2022-10-20
                                        </span>{" "}
                                        |{" "}
                                        <span className="ng-binding">
                                          4:00 PM
                                        </span>
                                      </p>
                                      <p className="event-location">
                                        {" "}
                                        <img
                                          src="https://static.fintoo.in/static/events/img/grey-location.svg"
                                          alt=""
                                        />
                                        <span className="ng-binding">
                                          Virtual
                                        </span>
                                      </p>
                                    </div>
                                    <div className="col-md-4">
                                      {/* ngIf: knowledge.event_video_link */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* end ngRepeat: knowledge in previousPlansArr | filter:searchText| orderObjectBy:propertyName */}
                          <div
                            className="col-md-12 d-none"
                            ng-show="( previousPlans|filter:searchText).length == 0 ||previousPlans.length == 0"
                          >
                            <div className="col-md-12">
                              <div className="no-events-img text-center">
                                {/* <img src="https://static.fintoo.in/static/events/img/no-events.svg" alt=""> */}
                                <img
                                  src="https://static.fintoo.in/static/events/img/no-events.svg"
                                  alt=""
                                />
                                <h2 className="mt-3">No events found!</h2>
                              </div>
                            </div>
                          </div>
                          {/* pagination */}
                          {/* <div className="col-md-12" ng-show="nav3">
                            <nav aria-label="..." style={{ float: "right" }}>
                              <ul className="pagination">
                                <li
                                  className="page-item disabled previousPage3"
                                  data="previous"
                                  ng-click="pagePrevious3($event)"
                                >
                                  <a
                                    className="page-link"
                                    href="#"
                                    tabIndex={-1}
                                  >
                                    Previous
                                  </a>
                                </li>
                             
                                <li
                                  className="page-item pageno_0 active"
                                  data={0}
                                  ng-class="{'active': $first}"
                                  ng-click="pageClick3($event, page)"
                                  ng-repeat="page in previousPageArr"
                                >
                                  <a className="page-link ng-binding" href="#">
                                    1
                                  </a>
                                </li>
                              
                                <li
                                  className="page-item nextPage3 disabled"
                                  ng-class="{disabled: disabled3}"
                                  data="next"
                                  ng-click="pageNext3($event)"
                                >
                                  <a className="page-link" href="#">
                                    Next
                                  </a>
                                </li>
                              </ul>
                            </nav>
                          </div> */}
                          {/* pagination */}
                        </div>
                      </div>
                    </>
                  )}

              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Events;
