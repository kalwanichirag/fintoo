import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../Assets/Images/logo.svg";
import { connect } from "react-redux";
import { ReactComponent as ProfilePic } from "../../Assets/Images/profile-picture.svg";
import styles from "./style.module.css";
import { useEffect, useRef, useState } from "react";
import FintooLogo from "./images/logo.svg";
import { CHECK_SESSION, DATA_BELONGS_TO } from "../../constants";
import Button from "react-bootstrap/Button";
import commonEncode from "../../commonEncode";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  TbHome,
  TbHeadset,
  TbShoppingBag,
  TbPhone,
} from "react-icons/tb";
import {
  compareMemberWithUser,
  fetchData,
  apiCall,
  fetchEncryptData,
  getItemLocal,
  getMemberId,
  getParentUserId,
  getProfilePercentage,
  getUserId,
  loginRedirectGuest,
  removeMemberId,
  setItemLocal,
  setMemberId,
  removeSlash,
  updateCartCount,
  updateGuestCartCount,
  setFpUserDetailsId,
  getFpUserDetailId,
  getCookie,
} from "../../common_utilities";

import ProfileSubmenuItem from "./ProfileSubmenuItem";

import { useLocation, useNavigate } from "react-router-dom";
import FintooInlineLoader from "../FintooInlineLoader";
import WhiteOverlay from "../HTML/WhiteOverlay";
import IncompleteRegistration from "../IncompleteRegistration";
import InfoStrip from "../InfoComponents/InfoStrip";
import {
  fetchUserProfileDetails,
  getFamilyMember,
  updateBasicDetails,
  userLogout,
} from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { Fetch_User_Mf_Profile_Status } from "../../FrappeIntegration-Services/services/financial-planning-api/ndaflow";
import { clearLocalStorageExcept } from "../../Utils/storage";

const safeWebEngageSetAttribute = (key, value) => {
  try {
    const setAttr = window?.webengage?.user?.setAttribute;
    if (typeof setAttr !== "function") return;
    setAttr(key, value);
  } catch (err) {
    // Ignore SDK readiness/user-state timing errors.
    console.warn("WebEngage setAttribute skipped:", key, err);
  }
};

const MainHeader = (props) => {
  const loginCookie = getCookie("token");


  const location = useLocation();

  const cartCount = useSelector((state) => state.cartCount);
  const forceReloadCartCount = useSelector(
    (state) => state.forceReloadCartCount
  );
  const memberChanged = useSelector((state) => state.memberChanged);
  const loggedIn = useSelector((state) => state.loggedIn);

  // const temporaryDisplayName = useSelector((state) => state.temporaryDisplayName);

  const [isLoading, setIsLoading] = useState(false);

  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const [percent, setPercent] = useState("");
  const [pageurl, setPageurl] = useState(false);
  const [urlData, setUrlData] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    // Preserve cart count before clearing localStorage
    const currentCartCount = cartCount || 0;
    if (currentCartCount > 0) {
      updateGuestCartCount(currentCartCount);
    }

    clearLocalStorageExcept(["leadData"]);

    // Restore guest cart count after clearing
    if (currentCartCount > 0) {
      updateGuestCartCount(currentCartCount);
    }

    dispatch({ type: "LOGGIN_LOGOUT", payload: false });

    // Also clear the cart count from Redux state
    dispatch({ type: "UPDATE_CART_COUNT", payload: 0 });
  };

  const [openMenu, setOpenMenu] = useState(false);
  const [submenu, setSubmenu] = useState("");
  const [openProfile, setOpenProfile] = useState(false);
  // const [reRender, setRerender] = useState("")
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [mainData, setMainData] = useState({});
  const [statusData, setStatusData] = useState({});
  const [allMembers, setAllMembers] = useState([]);
  const [parent, setParent] = useState("");
  const [selectedMember, setSelectedMember] = useState({});
  const [tempSelectedMember, setTempSelectedMember] = useState({});
  const isLoadedRef = useRef(false);
  const dispatch = useDispatch();
  const [value, setvalue] = useState("");

  useEffect(() => {
    userProfileState();
    // checkUserLoggedIn();
    localStorage.removeItem("combinedDetails");

    // Check for existing cart data first
    const checkExistingCartData = () => {
      const cartData = localStorage.getItem("cart_data");
      if (cartData) {
        try {
          const parsedCartData = JSON.parse(cartData);
          if (parsedCartData && parsedCartData.length > 0) {
            dispatch({
              type: "UPDATE_CART_COUNT",
              payload: parsedCartData.length,
            });
            return true; // Found cart data, no need to fetch
          }
        } catch (e) {
          console.error("Error parsing existing cart data:", e);
        }
      }
      return false; // No cart data found, need to fetch
    };

    // Check for existing cart data first
    const hasExistingCartData = checkExistingCartData();

    // If no existing cart data, fetch from API
    if (!hasExistingCartData) {
      if (getUserId()) {
        fetchCartCount();
      } else {
        // fetchCartCountForGuest();
      }
    }
  }, []);

  useEffect(() => {
    const queryString = window.location.search;

    // Check if the 'update' key is present in the query string
    if (queryString.includes("update=1")) {
      setvalue("update");
    }
  }, []);

  const checkUserLoggedIn = async () => {
    //     let url = '';
    // // let url = CHECK_SESSION;
    //     let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
    //     let respData = await apiCall(url, data, true, false);
    //     if (respData["error_code"] == "100") {
    //     } else {
    //       dispatch({ type: "LOGGIN_LOGOUT", payload: false });
    //     }
  };
  const userProfileState = async () => {
    try {
      const userdata = await fetchUserProfileDetails(getUserId());

      var details1 = await Fetch_User_Mf_Profile_Status(getUserId());

      if (userdata.status_code === 200 && window.webengage?.user) {
        const kycStatus = Number(userdata.data.kyc_verified) === 1;
        safeWebEngageSetAttribute("kyc_status", kycStatus ? "true" : "false");
      }
      // Setuserdata(details1);
      if (
        details1?.data?.kyc_verified == "No" &&
        userdata.data.user_pan !== ""
      ) {
        let url = DMF_GETPANSTATUS_API_URL;

        let data = {
          pan: userdata?.pan ?? "",
          user_id: getUserId(),
          data_belongs_to: DATA_BELONGS_TO,
        };

        let respData = await fetchEncryptData({ url, data, method: "post" });

        if (respData["error_code"] === "100") {
          let name =
            respData["data"]["kyc_name"] !== ""
              ? respData["data"]["kyc_name"]
              : "";

          let v = 1;

          if (name) {
            let url = DMF_UPDATEBASICDETAILS_API_URL;

            let payload = {
              user_id: getUserId(),
              pan: userdata?.data?.user_pan,
              first_name: name,
              kyc_user_name: name,
              kyc_verified: v,
              data_belongs_to: DATA_BELONGS_TO,
            };
            let datagatheringinsert = await fetchEncryptData({
              url,
              data,
              method: "post",
            });
            // var response = await updateBasicDetails(payload);
          }
        }
      }
      const p = await getProfilePercentage(getUserId());
      setPercent(p);
    } catch (e) {
      console.error("error", e);
    }
  };

  useEffect(() => {
    // startAnimation();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;

    // new err free code
    const headerEl = document.querySelector("." + styles.header);
    if (!headerEl) return; // 💡 Safely exit if element not found
    if (scrollPosition > 50) {
      headerEl.classList.add(styles.fixedheader);
    } else {
      headerEl.classList.remove(styles.fixedheader);
    }

    // err of classlist
    // if (scrollPosition > 50) {
    //   document
    //     .querySelector("." + styles.header)
    //     .classList.add(styles.fixedheader);
    // } else {
    //   document
    //     .querySelector("." + styles.header)
    //     .classList.remove(styles.fixedheader);
    // }
  };

  useEffect(() => {
    // alert(88);
    if (getUserId()) {
      dispatch({ type: "LOGGIN_LOGOUT", payload: true });
      fetchMembers();
      // if member selected and reload window
      if (getMemberId() != null) {
      }
    }
  }, []);


  useEffect(() => {
    if (forceReloadCartCount == true) {
      fetchCartCount();
      dispatch({ type: "FORCE_UPDATE_CART_COUNT", payload: false });
    }
  }, [forceReloadCartCount]);

  useEffect(() => {
    if (allMembers.length > 0) {
      if (getItemLocal("family") || getItemLocal("logged_in")) {
        setSelectedMember({ name: "Family" });
      } else if (getMemberId() != null) {
        setSelectedMember({
          ...allMembers.filter((v) => v.id === getMemberId())[0],
        });
        var member = allMembers.filter((v) => v.id === getMemberId())[0];
        // setFpUserDetailsId("" + member?.fp_user_details_id);
      } else {
        // window.alert("flag")

        setSelectedMember({
          ...allMembers.filter((v) => v.parent_user_id === null)[0],
        });
        var member = allMembers.filter((v) => v.parent_user_id === null)[0];
        setFpUserDetailsId("" + member?.fp_user_details_id);
      }
    }
  }, [allMembers]);

  const fetchCartCount = async () => {
    const getGuestCount = () => {
      try {
        const cartData = JSON.parse(localStorage.getItem("cart_data") || "[]");
        if (cartData.length > 0) return cartData.length;
      } catch { }
      const guestCartCount = parseInt(localStorage.getItem("guestCartCount"));
      return guestCartCount > 0 ? guestCartCount : 0;
    };

    try {
      const apiCount = await updateCartCount(DATA_BELONGS_TO);

      if (loggedIn) {
        dispatch({ type: "UPDATE_CART_COUNT", payload: apiCount });
        return;
      }

      const count = apiCount > 0 ? apiCount : getGuestCount();
      dispatch({ type: "UPDATE_CART_COUNT", payload: count });

    } catch (error) {
      console.error("Cart count error:", error);

      const count = loggedIn ? 0 : getGuestCount();
      dispatch({ type: "UPDATE_CART_COUNT", payload: count });
    }
  };

  const fetchMembers = async () => {
    try {
      let parentId = getParentUserId();
      if (parentId) {
        const r = await getFamilyMember(parentId);
        handleParentdata(r);
        const all = r.data.map((v, index) => ({
          name: v.user_name || v.user_email || v.relation || `Unknown`,
          id: v.user_id,
          parent_user_id: v.user_parent_id,
          pan: v.pan,
          mobile: v.mobile_number,
          email: v.user_email,
          user_email: v.user_email,
          fp_user_details_id: v.user_details_id,
          fdmf_is_minor: v.is_minor,
          relation: v.relation,
          relation_id: v.relation_id,
          is_dependent: v.is_dependent,
          gender: v.gender,
          user_age: v.user_age,
          dob: v.dob,
          occupation: v.occupation,
          retirement_age: v.retirement_age,
          life_expectancy_age: v.life_expectancy_age,
        }));

        setAllMembers([...all]);
        setItemLocal("member", [...all]);

        const currUserId = getUserId();

        const userData = [...all].filter((data) => data.id == getUserId())[0];
        if (!Boolean(userData.mobile) || !Boolean(userData.email)) {
          fetchMembersFromUser(currUserId);
        } else {
          setItemLocal("allMemberUser", [...all]);
        }
      }
    } catch (e) {
      // Error fetching members
    }
  };

  const fetchMembersFromUser = async (userId) => {
    try {
      const r = await fetchData({
        url: "",
        data: {
          // user_id: userId,
          user_id: getParentUserId(),
          data_belongs_to: DATA_BELONGS_TO,
        },
        method: "post",
      });
      const all = r.data.map((v) => ({
        name: v.NAME ? v.NAME : v.email,
        id: v.id,
        parent_user_id: v.parent_user_id,
        pan: v.pan,
        mobile: v.mobile,
        email: v.email,
      }));

      // setItemLocal("allMemberUser", [...all])
    } catch (e) {}
  };

  const handleParentdata = (Rdata) => {
    var getarray1 = Rdata.data.filter((obj) => {
      return obj.user_parent_id == 0;
    });
    setParent(getarray1);
  };

  const handleMenuChange = (v) => {
    v === submenu ? setSubmenu("") : setSubmenu(v);
  };

  const onMemberClick = async (v) => {
    localStorage.removeItem("family");
    localStorage.removeItem("logged_in");

    if (v._id != getParentUserId()) {
      openNewMember({ ...v, missingDetails: true });
    } else if (
      Boolean(v.pan) == false &&
      location.pathname.indexOf("/commondashboard") === -1
    ) {
      setIsProfileIncomplete(true);
      setTempSelectedMember({ ...v });
    } else {
      var percent = await getProfilePercentage(v);
      if (percent == 100) {
        openNewMember(v);
      } else {
        setIsProfileIncomplete(true);
        setTempSelectedMember({ ...v });
      }
    }
  };

  const openNewMember = (changedMember) => {
    
    if (changedMember.parent_user_id === null) {
      removeMemberId();
      setFpUserDetailsId("" + changedMember.fp_user_details_id);
    } else {
      setMemberId("" + changedMember.id);
      setFpUserDetailsId("" + changedMember.fp_user_details_id);
    }

    if (location.pathname.toLowerCase().includes("profile/addminor")) {
      window.location = process.env.PUBLIC_URL + "/direct-mutual-fund/profile";
      return;
    }
    if (location.pathname.toLowerCase().includes("/dashboard/fund")) {
      window.location =
        process.env.PUBLIC_URL + "/direct-mutual-fund/portfolio/dashboard/";
      return;
    }
    if (location.pathname.toLowerCase().includes("/commondashboard")) {
      window.location.reload();
      return;
    } else if (
      changedMember.id == getParentUserId() &&
      location.pathname.indexOf("/addmembers") > -1
    ) {
      window.location =
        process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard";
    } else if (location.pathname.includes("dashboard/fund")) {
      window.location =
        process.env.PUBLIC_URL + "/direct-mutual-fund/portfolio/dashboard/";
    } else {
      if (location.pathname.includes("web/direct-mutual-fund")) {
        if (
          changedMember.id != getParentUserId() &&
          changedMember.fdmf_is_minor !== true
        ) {
          if (
            changedMember.email == parent[0].user_email ||
            changedMember.mobile == parent[0].mobile_number
          ) {
            window.location =
              process.env.PUBLIC_URL +
              "/direct-mutual-fund/profile/addmembers?update=1";
          } else if (
            changedMember.mobile == null ||
            changedMember.mobile == "" ||
            changedMember.email == null ||
            changedMember.email == ""
          ) {
            window.location =
              process.env.PUBLIC_URL +
              "/direct-mutual-fund/profile/addmembers?update=1";
          } else if (
            changedMember.pan == "" ||
            changedMember.pan == null ||
            Boolean(changedMember.incomplete) == true
          ) {
            window.location =
              process.env.PUBLIC_URL + "/direct-mutual-fund/profile";
          } else {
            if (value ?? value) {
              window.location =
                process.env.PUBLIC_URL +
                "/direct-mutual-fund/profile/dashboard";
            } else {
              window.location.reload();
            }
          }
        } else if (
          changedMember.pan != "" ||
          changedMember.pan != null ||
          Boolean(changedMember.incomplete) == false
        ) {
          window.location.reload();
        } else {
          window.location = process.env.PUBLIC_URL + "/commondashboard";
        }
      } else {
        window.location.reload();
      }
    }
  };

  const toggleLoader = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    if (
      location.pathname != "/web/direct-mutual-fund/portfolio/dashboard/fund" &&
      tempSelectedMember
    ) {
      dispatch({ type: "SET_TEMP_NAME", payload: "" });
    }
  }, [location]);

  useEffect(() => {
    if (!allMembers || allMembers.length === 0) return;
    safeWebEngageSetAttribute("family_member_count", String(allMembers.length));
  }, [allMembers]);


  return (
    <>
      <div className={`NDA-Space ${styles.fakeSpace} fakeSpace_rn_k9`}></div>
      <header className={styles.header + " main-header"}>
        {/* <InfoStrip /> */}
        <WhiteOverlay show={isLoading} />
        <IncompleteRegistration
          open={isProfileIncomplete}
          onCloseModal={() => {
            setIsProfileIncomplete(false);
          }}
          handleSubmit={() => {
            openNewMember({ ...tempSelectedMember, incomplete: true });
          }}
        />
        <div className="d-block d-lg-none container-fluid">
          <div
            className={` ${styles["mobile-menu"]} d-flex align-items-center justify-content-between`}
          >
            <div
              className={styles["menu-button"]}
              onClick={() => setOpenMenu(true)}
            >
              <div className={styles.hamburger} />
              <div className={styles.hamburger} />
              <div className={styles.hamburger} />
            </div>
            <a
              href={process.env.REACT_APP_PYTHON_URL}
              target="_self"
              className="mobile-logo"
            >
              <img
                src={
                  process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"
                }
                alt="Fintoo logo"
              />
            </a>
            <div className={styles.headerActions}>
              <Link
                to={process.env.PUBLIC_URL + "/direct-mutual-fund/mycart"}
                className={` ${styles.cart}`}
                aria-label="Cart"
              >
                {cartCount > 0 && (
                  <div>
                    <span>{cartCount}</span>
                  </div>
                )}
                <TbShoppingBag className={styles.headerIcon} />
              </Link>
              <div onClick={() => setOpenProfile(true)}>
                {Object.keys(selectedMember).length > 0 && (
                  <img
                    width={38}
                    className="rounded-circle"
                    src={
                      selectedMember.name
                        ? "https://ui-avatars.com/api/?name=" +
                          selectedMember.name.charAt(0) +
                          "&length=1"
                        : "https://ui-avatars.com/api/?name="
                    }
                  />
                )}
              </div>
            </div>

            <div
              className={`${styles["mobile-menu-wrapper"]} ${
                openMenu ? styles["active"] : ""
              } `}
              id="hamburger"
            >
              <div className={styles["mobile-menu-block"]}>
                <a
                  onClick={() => setOpenMenu(false)}
                  className={styles["close-menu"]}
                >
                  ×
                </a>
                <ul className={`${styles["mobile-nav"]}`}>
                  <li className={styles["mn-li"]}>
                    <div
                      className="d-block"
                      onClick={() => handleMenuChange("menu1")}
                    >
                      Advisory{" "}
                      <span
                        className={`${styles.aspan} ${styles.mobilespan} ${
                          submenu == "menu1" ? styles["mobilespan-open"] : ""
                        }`}
                      >
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </div>
                    {submenu == "menu1" && (
                      <ul className={styles["submenu"]}>
                        <li>
                          <Link
                            target="_self"
                            onClick={() => {
                              setOpenMenu(false);
                            }}
                            to={
                              process.env.PUBLIC_URL +
                              "/financial-planning-page/"
                            }
                          >
                            Financial Planning
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_self"
                            onClick={() => setOpenMenu(false)}
                            to={
                              process.env.PUBLIC_URL +
                              "/retirement-planning-page/"
                            }
                          >
                            Retirement Planning
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_self"
                            to={
                              process.env.PUBLIC_URL +
                              "/investment-planning-page/"
                            }
                            onClick={() => setOpenMenu(false)}
                          >
                            Investment Planning
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_self"
                            to={process.env.PUBLIC_URL + "/tax-planning-page/"}
                            onClick={() => setOpenMenu(false)}
                          >
                            Tax Planning
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_self"
                            to={process.env.PUBLIC_URL + "/risk-management/"}
                            onClick={() => setOpenMenu(false)}
                          >
                            Risk Management
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li className={styles["mn-li"]}>
                    <div
                      className="d-block"
                      onClick={() => handleMenuChange("menu5")}
                    >
                      Invest{" "}
                      <span className={`${styles.aspan} ${styles.mobilespan}`}>
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </div>
                    {submenu == "menu5" && (
                      <ul className={styles["submenu"]}>
                        <li>
                          <Link
                            to={`${process.env.PUBLIC_URL}/direct-mutual-funds`}
                            onClick={() => setOpenMenu(false)}
                          >
                            Mutual Fund
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`${process.env.PUBLIC_URL}/bond-investment`}
                            onClick={() => setOpenMenu(false)}
                          >
                            Bond
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`${process.env.PUBLIC_URL}/stock-advisory`}
                            onClick={() => setOpenMenu(false)}
                          >
                            Domestic Equity
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`${process.env.PUBLIC_URL}/international-equity`}
                            onClick={() => setOpenMenu(false)}
                          >
                            International Equity
                          </Link>
                        </li>
                        <li>
                          <Link
                            onClick={() => setOpenMenu(false)}
                            to={`${process.env.PUBLIC_URL}/ipo`}
                          >
                            IPO
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>

                  <li className={styles["mn-li"]}>
                    <div
                      className="d-block"
                      onClick={() => handleMenuChange("menu2")}
                    >
                      Tax{" "}
                      <span className={`${styles.aspan} ${styles.mobilespan}`}>
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </div>
                    {submenu == "menu2" && (
                      <ul className={styles["submenu"]}>
                        {/* {process.env.REACT_APP_MODE != "live" && (
                          <li>
                            <Link
                              target="_self"
                              onClick={() => setOpenMenu(false)}
                              to={`${process.env.PUBLIC_URL}/itr-file/`}
                            >
                              File your ITR
                            </Link>
                          </li>
                        )} */}
                        <li>
                          <Link
                            target="_self"
                            onClick={() => setOpenMenu(false)}
                            to={`${process.env.PUBLIC_URL}/nri-taxation/`}
                          >
                            NRI Taxation
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_self"
                            onClick={() => setOpenMenu(false)}
                            to={`${process.env.PUBLIC_URL}/notices/`}
                          >
                            Notices
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_self"
                            to={process.env.PUBLIC_URL + "/tax-planning-page"}
                            onClick={() => setOpenMenu(false)}
                          >
                            Tax Planning
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_self"
                            onClick={() => setOpenMenu(false)}
                            to={`${process.env.PUBLIC_URL}/tax-calculators`}
                          >
                            Tax Calculators
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li className={styles["mn-li"]}>
                    <Link
                      style={{
                        fontWeight: "normal",
                        fontSize: "1.5rem",
                      }}
                      onClick={() => {
                        setOpenMenu(false);
                      }}
                      target="_self"
                      to={`${process.env.PUBLIC_URL}/pricing/`}
                    >
                      Pricing
                    </Link>
                  </li>

                  <li className={styles["mn-li"]}>
                    <div onClick={() => handleMenuChange("menu3")}>
                      Knowledge Base
                      <span className={`${styles.aspan} ${styles.mobilespan}`}>
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </div>
                    {submenu == "menu3" && (
                      <ul className={styles["submenu"]}>
                        <li>
                          <a target="_self" href="https://www.fintoo.in/blog">
                            Blogs
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li className={styles["mn-li"]}>
                    <Link
                      style={{
                        fontWeight: "normal",
                        fontSize: "1.5rem",
                      }}
                      onClick={() => {
                        setOpenMenu(false);
                      }}
                      target="_self"
                      to={`${process.env.PUBLIC_URL}/womoneya`}
                    >
                      Womoneya 3.0
                    </Link>
                  </li>

                  {/*  */}
                  <li className={styles["mn-li"]}>
                    <a
                      style={{
                        fontWeight: "normal",
                      }}
                      className="d-block"
                      onClick={() => handleMenuChange("menu2323")}
                    >
                      <span
                        style={{
                          verticalAlign: "textBottom",
                        }}
                      >
                        {" "}
                        <TbHeadset className={styles.headerIcon} />{" "}
                      </span>
                      <span> Help Support</span>
                      <span className={`${styles.aspan} ${styles.mobilespan}`}>
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </a>
                    {submenu == "menu2323" && (
                      <ul className={styles["submenu"]}>
                        <li className="pb-0">
                          <span>
                            <TbPhone className={styles.supportPhoneIcon} />{" "}
                          </span>
                          <span>
                            <a
                              className="text-decoration-none text-black ps-1"
                              href="tel:+91-9699 800 600"
                            >
                              +91-9699 800 600
                            </a>
                          </span>
                        </li>
                        <li>
                          <a
                            onClick={() => {
                              setOpenMenu(false);
                            }}
                            className={`text-decoration-none ${styles.Region} custom-color`}
                            href="https://fintoo.freshdesk.com/support/home"
                          >
                            Customer Help Center
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                  {Boolean(loggedIn) == false && (
                    <li
                      className={`${styles["link-url"]} ${styles["link-url-mobile"]}`}
                      onClick={() => {
                        loginRedirectGuest(_, _, true);
                      }}
                    >
                      Login
                      {/* </a> */}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="d-none d-lg-block container-fluid p-0">
          <div className={` ${styles["in-container"]}`}>
            <div className="row align-items-center">
              <div className="col-md-5">
                <a href="/">
                  {/* <Logo /> */}
                  <img
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/wp/Fintoologo_.svg"
                    }
                    alt="Fintoo logo"
                  />
                </a>
              </div>
              <div className="col-md-7">
                <ul className={styles["main-navigation"]}>
                  <li>
                    <div
                      className={` ${styles["link-url"]} main_header_link_url`}
                      href={process.env.PUBLIC_URL + "#"}
                    >
                      Advisory{" "}
                      <span className={styles.aspan}>
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </div>
                    {}
                    <div className={styles["submenu-container"]}>
                      <ul className={styles.submenu}>
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={`${process.env.PUBLIC_URL}/financial-planning-page`}
                            onClick={() => toggleLoader()}
                          >
                            Financial Planning
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={`${process.env.PUBLIC_URL}/retirement-planning-page`}
                            onClick={() => toggleLoader()}
                          >
                            Retirement Planning
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={`${process.env.PUBLIC_URL}/investment-planning-page`}
                            onClick={() => toggleLoader()}
                          >
                            Investment Planning
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={`${process.env.PUBLIC_URL}/tax-planning-page`}
                            onClick={() => toggleLoader()}
                          >
                            Tax Planning
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={`${process.env.PUBLIC_URL}/risk-management`}
                            onClick={() => toggleLoader()}
                          >
                            Risk Management
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <div
                      className={` ${styles["link-url"]} main_header_link_url`}
                      href={process.env.PUBLIC_URL + "#"}
                    >
                      Invest{" "}
                      <span className={styles.aspan}>
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </div>
                    <div className={styles["submenu-container"]}>
                      <ul className={styles.submenu}>
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={`${process.env.PUBLIC_URL}/direct-mutual-funds`}
                            // to={`${process.env.PUBLIC_URL}/landing-page`}
                            onClick={() => toggleLoader()}
                          >
                            Mutual Fund
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={`${process.env.PUBLIC_URL}/bond-investment`}
                            onClick={() => toggleLoader()}
                          >
                            Bond
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={`${process.env.PUBLIC_URL}/stock-advisory`}
                            onClick={() => toggleLoader()}
                          >
                            Domestic Equity
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={`${process.env.PUBLIC_URL}/international-equity`}
                            onClick={() => toggleLoader()}
                          >
                            International Equity
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={`${process.env.PUBLIC_URL}/ipo`}
                            onClick={() => toggleLoader()}
                          >
                            IPO
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <div
                      className={` ${styles["link-url"]} main_header_link_url`}
                      href={process.env.PUBLIC_URL + "#"}
                    >
                      Tax{" "}
                      <span className={styles.aspan}>
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </div>
                    <div className={styles["submenu-container"]}>
                      <ul className={styles.submenu}>
                        {/* {process.env.REACT_APP_MODE != "live" && (
                          <li>
                            <Link
                              className={` ${styles["link-url"]} main_header_link_url`}
                              to={`${process.env.PUBLIC_URL}/itr-file?utm_service=91&utm_source=26&tags=itr_filing_2025&rm_id=96`}
                              onClick={() => toggleLoader()}
                            >
                              File your ITR
                            </Link>
                          </li>
                        )} */}
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={`${process.env.PUBLIC_URL}/nri-taxation/`}
                            onClick={() => toggleLoader()}
                          >
                            NRI Taxation
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={`${process.env.PUBLIC_URL}/notices/`}
                            onClick={() => toggleLoader()}
                          >
                            Notices
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={process.env.PUBLIC_URL + "/tax-planning-page"}
                            onClick={() => setOpenMenu(false)}
                          >
                            Tax Planning
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={` ${styles["link-url"]} main_header_link_url`}
                            to={`${process.env.PUBLIC_URL}/tax-calculators`}
                            onClick={() => toggleLoader()}
                          >
                            Tax Calculators
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <Link
                      className={` ${styles["link-url"]} main_header_link_url`}
                      to={`${process.env.PUBLIC_URL}/pricing`}
                      onClick={() => toggleLoader()}
                    >
                      Pricing
                    </Link>
                    {/* <a
                      className={styles["link-url"]}
                      href="https://www.fintoo.in/pricing/"
                    >
                      Pricing
                    </a> */}
                  </li>

                  <li>
                    <div
                      className={` ${styles["link-url"]} main_header_link_url`}
                      href={process.env.PUBLIC_URL + "#"}
                    >
                      Knowledge Base{" "}
                      <span className={styles.aspan}>
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </div>
                    <div className={styles["submenu-container"]}>
                      <ul className={styles.submenu}>
                        <li>
                          <a
                            className={` ${styles["link-url"]} main_header_link_url`}
                            href="https://www.fintoo.in/blog"
                          >
                            Blogs
                          </a>
                        </li>
                        {/* <li>
                          <a className={styles["link-url"]} href="">
                            Media Room
                          </a>
                        </li>
                        <li>
                          <a className={styles["link-url"]} href="">
                            Bytes
                          </a>
                        </li> */}
                        {/* <li>
                          <Link
                            className={styles["link-url"]}
                            to={`${process.env.PUBLIC_URL}/our-events-page/`}
                            onClick={()=> toggleLoader()}
                          >
                            Events
                          </Link>
                        </li> */}
                      </ul>
                    </div>
                  </li>
                  <li>
                    <Link
                      className={` ${styles["link-url"]} main_header_link_url`}
                      to={`${process.env.PUBLIC_URL}/womoneya`}
                      onClick={() => toggleLoader()}
                    >
                      Womoneya 3.0
                    </Link>
                  </li>
                  {/* <li>
                    <a
                      className={styles["link-url"]}
                      href={process.env.PUBLIC_URL + "#"}
                    >
                      Corporate Care
                      <span className={styles.aspan}>
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </a>
                    <div className={styles["submenu-container"]}>
                      <ul className={styles.submenu}>
                        <li>
                          <a className={styles["link-url"]} href="">
                            About CCP
                          </a>
                        </li>
                        <li>
                          <a className={styles["link-url"]} href="">
                            Request Webinar
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li> */}
                  {loggedIn && (
                    <li className={styles["mn-li"]}>
                      <Link
                        style={{
                          fontWeight: "normal",
                        }}
                        className="d-block"
                        onClick={() => {
                          setOpenMenu(false);
                        }}
                        to={`${process.env.PUBLIC_URL}/commondashboard/`}
                      >
                        <span
                          style={{
                            verticalAlign: "textBottom",
                          }}
                        >
                          <TbHome
                            className={styles.headerIcon}
                            aria-label="Dashboard"
                            title="Dashboard"
                          />
                        </span>
                      </Link>
                    </li>
                  )}
                  <li className={`pointer ${styles.regionselectordialog}`}>
                    <div className={styles["link-url"]}>
                      <TbHeadset
                        className={styles.headerIcon}
                        aria-label="Customer support"
                        title="Customer support"
                      />
                      {/* 
Customer Help Center */}
                    </div>
                    <div className={styles["submenu-container"]}>
                      <div
                        className={`${styles.submenu}, ${styles.GlobalMenu} ${styles.CallSupport}`}
                      >
                        <div className={`w-100`}>
                          <div className={`${styles.CallOption}`}>
                            <span>
                              <TbPhone className={styles.supportPhoneIcon} />{" "}
                            </span>
                            <span>
                              <a
                                className="text-decoration-none text-black ps-1"
                                href="tel:+91-9699 800 600"
                              >
                                +91-9699 800 600
                              </a>
                            </span>
                          </div>
                          <div className={`pt-3 ${styles.CallOption}`}>
                            <a
                              className="text-decoration-none custom-color"
                              // className={styles["link-url"]}
                              target="blank"
                              href="https://fintoo.freshdesk.com/support/home"
                            >
                              Customer Help Center
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  {/* desktop */}
                  <li className="px-0">
                    <Link
                      to={process.env.PUBLIC_URL + "/direct-mutual-fund/mycart"}
                      className={`pe-2 ${styles.cart}`}
                      aria-label="Cart"
                    >
                      {cartCount > 0 && (
                        <div>
                          <span className={styles.cartCount}>{cartCount}</span>
                        </div>
                      )}
                      <TbShoppingBag className={styles.headerIcon} />
                    </Link>
                  </li>

                  {loginCookie ? (
                    <li style={{ margin: "0 25px" }}>
                      <div className={styles.username}>
                        <div className={styles.usercon}>
                          <strong className={styles.strong}>
                            {Object.keys(selectedMember).length &&
                              (selectedMember.name && selectedMember.name.trim()
                                ? selectedMember.name.split(" ")[0].trim()
                                : selectedMember.email
                                ? selectedMember.email.split("@")[0]
                                : "User")}
                          </strong>
                        </div>
                        <div>
                          <span className={styles.aspan}>
                            <i
                              className="fa fa-angle-down"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </div>
                      </div>
                      <ProfileMenu
                        allMembers={allMembers}
                        selectedMember={selectedMember}
                        onMemberClick={onMemberClick}
                      />
                    </li>
                  ) : (
                    <li
                      className={` ${styles["link-url"]} main_header_link_url`}
                      onClick={() => {
                        loginRedirectGuest(_, _, true);
                      }}
                    >
                      Login
                    </li>
                  )}

                  {/* {Boolean(loggedIn) === false && (
                    <li
                      className={` ${styles["link-url"]} main_header_link_url`}
                      onClick={() => {
                        loginRedirectGuest(_, _, true);
                      }}
                    >
                      Login
                    </li>
                  )} */}

                  {/* {Boolean(loggedIn) === true && (
                    <>
                      <li className="px-4">
                        <Link
                          to={
                            process.env.PUBLIC_URL +
                            "/direct-mutual-fund/mycart"
                          }
                          className={`pe-2 ${styles.cart}`}
                        >
                          {cartCount > 0 && (
                            <div>
                              <span className={styles.cartCount}>
                                {cartCount}
                              </span>
                            </div>
                          )}
                          <TbShoppingBag className={styles.headerIcon} />
                        </Link>
                      </li>

                      <li style={{ margin: "0 25px" }}>
                        <div className={styles.username}>
                          <div className={styles.usercon}>
                            <strong className={styles.strong}>
                              {Object.keys(selectedMember).length &&
                                (selectedMember.name && selectedMember.name.trim() 
                                  ? selectedMember.name.split(' ')[0].trim() 
                                  : (selectedMember.email ? selectedMember.email.split("@")[0] : "User"))}
                            </strong>
                          </div>
                          <div>
                            <span className={styles.aspan}>
                              <i
                                className="fa fa-angle-down"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </div>
                        </div>
                        <ProfileMenu
                          allMembers={allMembers}
                          selectedMember={selectedMember}
                          onMemberClick={onMemberClick}
                        />
                      </li>
                    </>
                  )} */}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${styles.profilemenu} ${
            openProfile ? styles.openprofilemenu : ""
          }`}
        >
          <a
            onClick={() => setOpenProfile(false)}
            className={styles["close-menu"]}
          >
            ×
          </a>
          <ProfileMenu
            allMembers={allMembers}
            selectedMember={selectedMember}
            onMemberClick={onMemberClick}
            onClose={() => {
              setOpenProfile(false);
            }}
          />
        </div>
        {/* Modal  */}
        <Modal
          centered
          show={show}
          onHide={handleClose}
          className={styles["modal-content"]}
        >
          <div className="m-2 DMFPopup">
            <div
              className="popup-container"
              style={{
                padding: "10px 40px",
              }}
            >
              <div className="popup-wrapper text-center">
                <div
                  className="header-box popup-header  d-flex justify-content-center"
                  style={{ top: "-14px" }}
                >
                  <h3>
                    <span
                      className="pink-link"
                      style={{
                        color: "#f0806d",
                        fontSize: ".8em",
                      }}
                    >
                      Disclaimer
                    </span>
                  </h3>
                </div>
                <div className="popup-body">
                  <div className="offer-content mt-2">
                    <div className="row justify-content-center">
                      <div className="col-md-12 mb-3">
                        <p
                          style={{
                            lineHeight: "22px",
                          }}
                        >
                          This is to inform you that by Clicking on the ‘I
                          Agree’, you will be Leaving Fintoo and entering
                          website operated by third parties. Fintoo does not
                          control or endorse such third party website and is not
                          responsible for its content and/or functionality. The
                          use of such website is Subject to the applicable terms
                          and conditions of such third party.
                        </p>
                      </div>
                    </div>
                    <button
                      className={styles["green-btn"]}
                      // className="green-btn d-block"
                      type="button"
                    >
                      <a
                        style={{
                          textDecoration: "none",
                        }}
                        href={process.env.REACT_APP_PYTHON_URL}
                      >
                        I Agree
                      </a>
                    </button>
                    <button
                      className={styles["green-btn"]}
                      style={{
                        margin: "20px auto",
                        padding: " 8px 40px",
                      }}
                      type="button"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </header>
    </>
  );
};

const ProfileMenu = ({
  allMembers = [],
  selectedMember = {},
  onMemberClick,
  onClose = () => {},
}) => {
  const location = useLocation();
  const [dis, setDis] = useState();
  const [parentCheck, setParentCheck] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isStockPages, setIsStockPages] = useState(false);
  let x = location.pathname;

  useEffect(() => {
    if (location.pathname.indexOf("/stocks") > -1) {
      setIsStockPages(false);
    }
  }, [location]);

  const logout = () => {
    clearLocalStorageExcept(["leadData"]);
    dispatch({ type: "LOGGIN_LOGOUT", payload: false });
    navigate(process.env.PUBLIC_URL + "/logout");
  };

  const dropdownChanges = () => {
    let result =
      x.includes("MyCartSelectBank") ||
      x.includes("MyCartAutoPay") ||
      x.includes("MyCartPaymentmode") ||
      x.includes("NetBanking") ||
      x.includes("Mandate") ||
      x.includes("CartUPI") ||
      x.includes("NeftRtgs");
    if (result) {
      setDis(true);
    } else {
      setDis(false);
    }
  };

  useEffect(() => {
    dropdownChanges();
  }, [x]);

  useEffect(() => {
    if (getUserId() != getParentUserId()) {
      setParentCheck(false);
    } else {
      setParentCheck(true);
    }
  }, []);

  const myfun = () => {
    setItemLocal("family", 1);
    localStorage.removeItem("MFSummaryPortfolio");
    localStorage.removeItem("UserPANInfo");
  };

  // const location = useLocation();
  return (
    <>
      {dis ? (
        <div className={`${styles["submenu-container"]}`}>
          <div className={`${styles["profile-submenu"]}`}>
            <div className={` ${styles.card}`}>
              <div className={`${styles["card-in-2"]} d-flex`}>
                <div className="pe-3">
                  {Object.keys(selectedMember).length > 0 && (
                    <img
                      src={
                        selectedMember.name
                          ? "https://ui-avatars.com/api/?name=" +
                            selectedMember.name.charAt(0) +
                            "&length=1"
                          : "https://ui-avatars.com/api/?name="
                      }
                      width={40}
                      className="rounded-circle"
                    />
                  )}
                </div>
                <div>
                  <p className={styles.profilename}>
                    {Object.keys(selectedMember).length && selectedMember.name}
                  </p>
                  {isStockPages === false && (
                    <div>
                      <Link
                        to={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/dashboard`}
                        className={`${styles["profile-link"]} ps-0`}
                      >
                        <span className="profile_link_span_sec custom-border-color custom-color">
                          Profile{" "}
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles["profile-inner-dv"]}>
              {isStockPages === false && (
                <>
                  <Link
                    style={{ textDecoration: "none", color: "#042b62" }}
                    to={process.env.PUBLIC_URL + "/commondashboard"}
                  >
                    <ProfileSubmenuItem
                      text={"Dashboard"}
                      image={
                        process.env.REACT_APP_STATIC_URL +
                        "media/Header/Dashboard.png"
                      }
                    />
                  </Link>
                  <Link
                    style={{ textDecoration: "none", color: "#042b62" }}
                    to={
                      process.env.PUBLIC_URL +
                      "/direct-mutual-fund/portfolio/dashboard"
                    }
                  >
                    <ProfileSubmenuItem
                      text={"Portfolio"}
                      // image={require("./images/01_All_stocks_white.png")}
                    />
                  </Link>
                  <ProfileSubmenuItem
                    text={"Invoices"}
                    image={
                      process.env.REACT_APP_STATIC_URL +
                      "media/Header/invoice.png"
                    }
                  />
                </>
              )}
              <div
                style={{ textDecoration: "none", color: "#042b62" }}
                // to={process.env.PUBLIC_URL + "/logout"}
                onClick={() => {
                  userLogout();
                }}
              >
                <ProfileSubmenuItem text={"Logout"} className="bb-0" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${styles["submenu-container"]}`}>
          <div className={`${styles["profile-submenu"]}`}>
            <div className={` ${styles.card}`}>
              <div className={`${styles["card-in-2"]} d-flex`}>
                <div></div>

                <div className="pe-3">
                  {Object.keys(selectedMember).length > 0 && (
                    <img
                      src={
                        selectedMember.name
                          ? "https://ui-avatars.com/api/?name=" +
                            selectedMember.name.charAt(0) +
                            "&length=1"
                          : "https://ui-avatars.com/api/?name="
                      }
                      width={40}
                      className="rounded-circle"
                    />
                  )}
                </div>
                <div>
                  <p className={styles.profilename}>
                    {/* {Object.keys(selectedMember).length && selectedMember.name} */}
                    {Object.keys(selectedMember).length &&
                      (selectedMember.name && selectedMember.name.trim()
                        ? selectedMember.name.split(" ")[0].trim()
                        : selectedMember.email
                        ? selectedMember.email.split("@")[0]
                        : "User")}
                  </p>
                  {isStockPages === false && (
                    <div>
                      {getItemLocal("family") ? (
                        ""
                      ) : (
                        <Link
                          to={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/dashboard`}
                          className={`${styles["profile-link"]} ps-0`}
                          onClick={() => {
                            onClose();
                          }}
                        >
                          <span className="profile_link_span_sec">Profile</span>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles["profile-inner-dv"]}>
              {isStockPages === false && (
                <div className={styles["scrollable-profile-section"]}>
                  {allMembers
                    .filter(
                      (v) =>
                        !(
                          Object.keys(selectedMember).length &&
                          v?.id === selectedMember.id
                        )
                    )
                      .map((v) => {
                        const displayName = v?.name || v?.relation || "Unknown";
                        const displayText = `${displayName
                          .split(" ")
                          .slice(0, 2)
                          .join(" ")
                          .trim()} ${v?.fdmf_is_minor ? "#m" : ""}`;
                      const avatarName = v?.name || v?.relation || "U";

                      return (
                        <ProfileSubmenuItem
                          key={"memberidp" + v?.id}
                          text={displayText}
                          image={`https://ui-avatars.com/api/?name=${avatarName.charAt(
                            0
                          )}&length=1`}
                          roundedImage={true}
                          onMemberClick={() => onMemberClick(v)}
                        />
                      );
                    })}
                </div>
              )}

              {allMembers.length > 0 && (
                <Link
                  style={{ textDecoration: "none", color: "#042b62" }}
                  // to={
                  //   process.env.PUBLIC_URL +
                  //   "/direct-mutual-fund/profile/addmembers"
                  // }
                  onClick={() => {
                    myfun();
                    window.location.reload();
                  }}
                >
                  {/* {location.pathname.indexOf("/profile/dashboard") ==
                        -1 && (
                        <ProfileSubmenuItem
                          text={"Family"}
                          image={require("./images/group.png")}
                        />
                      )} */}

                  {Boolean(getItemLocal("family")) == false && (
                    <ProfileSubmenuItem
                      text={"Family"}
                      image={
                        process.env.REACT_APP_STATIC_URL +
                        "media/Header/group.png"
                      }
                    />
                  )}
                </Link>
              )}

              {isStockPages === false && (
                <>
                  {parentCheck && (
                    <Link
                      style={{ textDecoration: "none", color: "#042b62" }}
                      onClick={() => {
                        onClose();
                      }}
                      to={
                        process.env.PUBLIC_URL +
                        "/direct-mutual-fund/profile/AddMembersOptions"
                      }
                    >
                      <ProfileSubmenuItem
                        text={"Add New Member"}
                        image={
                          process.env.REACT_APP_STATIC_URL +
                          "media/Header/add_member.png"
                        }
                      />
                    </Link>
                  )}

                  <Link
                    style={{ textDecoration: "none", color: "#042b62" }}
                    to={process.env.PUBLIC_URL + "/commondashboard"}
                    onClick={() => {
                      onClose();
                    }}
                  >
                    <ProfileSubmenuItem
                      text={"Dashboard"}
                      image={
                        process.env.REACT_APP_STATIC_URL +
                        "media/Header/Dashboard.png"
                      }
                    />
                  </Link>

                  <Link
                    style={{ textDecoration: "none", color: "#042b62" }}
                    to={process.env.PUBLIC_URL + "/userflow/invoice"}
                    onClick={() => {
                      onClose();
                    }}
                  >
                    <ProfileSubmenuItem
                      text={"Invoices"}
                      image={
                        process.env.REACT_APP_STATIC_URL +
                        "media/Header/invoice.png"
                      }
                    />
                  </Link>
                </>
              )}

              <div
                style={{ textDecoration: "none", color: "#042b62" }}
                // to={process.env.PUBLIC_URL + "/logout"}
                onClick={() => {
                  onClose();
                  userLogout();
                }}
              >
                <ProfileSubmenuItem
                  text={"Logout"}
                  className="bb-0"
                  image={
                    process.env.REACT_APP_STATIC_URL +
                    "media/Header/logout-88.png"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainHeader;
