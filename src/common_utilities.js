import commonEncode from "./commonEncode";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import {
  imagePath,
  DATA_BELONGS_TO,
} from "./constants";
import { Buffer } from "buffer";
import { validate } from "react-email-validator";
import moment from "moment/moment";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { check_all_status_api, fetchUserProfileDetails, getFamilyMember } from "./FrappeIntegration-Services/services/user-management-api/userApiService";
import { GetCartDetails, GetSchemeList } from "./FrappeIntegration-Services/services/investment-api/investmentService";
import { Fetch_User_Mf_Profile_Status } from "./FrappeIntegration-Services/services/financial-planning-api/ndaflow";
import { clearLocalStorageExcept } from "./Utils/storage";
import { ValidateRedirection } from "./FrappeIntegration-Services/services/master-api/masterApiService";

const handleCheckAllStatus = async (userId) => {
  try {
    const isCRM = localStorage.getItem("from_crm") === "1";
    if (isCRM) return;
    if (userId) {
      const result = await check_all_status_api(userId);

      if (result?.status_code == "200") {
        const {
          nda_sign_check,
          data_gethering_check,
          report_check,
          plan_uuid,
          plan_is_expired,
          opportunity_id
        } = result.data;

        setItemLocal("ndasignstatus", nda_sign_check);
        setItemLocal("datagatheringstatus", data_gethering_check);
        setItemLocal("reportstatus", report_check);
        setItemLocal("plan_is_expired", plan_is_expired);
        setItemLocal("plan_uuid", plan_uuid);
        setItemLocal("opportunity_id", opportunity_id);

        if (plan_uuid !== "fp_robo" && plan_uuid !== "") {
          if (plan_is_expired == "N" && nda_sign_check == "N") {
            window.location.href = `${process.env.PUBLIC_URL}/userflow/expert-nda`;
            return;
          }
        }
      } else {
        console.error("Status check failed:", result?.message);
      }
    } else {
      console.error("User ID not found.");
    }
  } catch (error) {
    console.error("Error checking user status:", error);
  }
};

const handleGetFamilyMember = async (userId) => {
  try {
    if (userId) {
      const result = await getFamilyMember(userId);

      if (result?.status_code == 200) {
        const transformedData = result.data.map((member) => ({
          name: member.user_name || '',
          id: member.user_id || '',
          parent_user_id: member.user_parent_id,
          pan: member.pan || '',
          mobile: member.mobile_number || '',
          email: member.user_email || '',
          user_email: member.user_email || '',
          fp_user_details_id: member.user_details_id || '',
          fdmf_is_minor: member.is_minor ? 'Y' : 'N',
        }));
        setItemLocal("member", [...transformedData]);
        setItemLocal("allMemberUser", [...transformedData]);

        const parentUser = result.data.find(member => member.user_id === getParentUserId());
        if (parentUser) {
          const userData = localStorage.getItem("user_data");

          if (userData) {
            const parsedData = JSON.parse(userData);

            parsedData.user_mobile = parentUser?.mobile_number || parsedData?.mobile_number || '';
            parsedData.user_country_code = parentUser?.user_country_code || parsedData?.user_country_code || '';

            localStorage.setItem("user_data", JSON.stringify(parsedData));
          }
        }

      }
    } else {
      console.error('userId not found.');
    }
  } catch (error) {
    console.error('Error fetching members:', error);
  }
}

const hanleprofileDetails = async (userId) => {
  try {
    if (!userId) return;

    const result = await fetchUserProfileDetails(userId);
    if (result?.status_code == 200 && result?.data) {
      const userDataFromProfile = result.data;
      const existingDataString = localStorage.getItem('user_data');
      const existingData = existingDataString ? JSON.parse(existingDataString) : {};

      const mergedData = { ...existingData, ...userDataFromProfile };

      localStorage.setItem('user_data', JSON.stringify(mergedData));
    }
  } catch (error) {
    console.error('Error fetching user profile details:', error);
  }
};

export const kyc_fp_redirection = async (lead_id) => {
  try {
    if (!lead_id) return false;

    const result = await ValidateRedirection(lead_id);
    const message = result?.data?.message;

    if (result?.status === 200 && message?.success) {

      if (message?.kyc_rejected === 1) {
        localStorage.setItem("kyc_rejected", "1");

        if (message?.rejection_message) {
          localStorage.setItem(
            "kyc_rejection_message",
            message.rejection_message
          );
        }

        return true;
      } else {
        localStorage.removeItem("kyc_rejected");
        localStorage.removeItem("kyc_rejection_message");
      }

      if (message?.redirect_to_fp === 1 || message?.redirect_to_kyc === 1) {
        return true;
      }
    }
  } catch (error) {
    console.error("Error checking user status:", error);
  }

  return false;
};

export const isFromCRM = () => {
  return localStorage.getItem("from_crm") === "1";
};

export const storeUserSession = async (queryParams) => {
  const { userdata, token, redirect_to } = queryParams;

  sessionStorage.removeItem("kyc_skipped");

  const isCRMUser = queryParams?.from_crm === "1";
  if (isCRMUser) {
    localStorage.setItem("from_crm", "1");
  }

  if (userdata && token) {
    try {
      const userData = JSON.parse(commonEncode.decrypt(userdata));
      const userToken = commonEncode.decrypt(token);

      removeMemberId();
      setUserId(userData?.user_id);
      Cookies.set("token", userToken, { expires: 1 });
      localStorage.setItem("sky", token);
      localStorage.setItem("token", token);
      localStorage.setItem(
        'user_data',
        JSON.stringify({ ...userData })
      );

      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith("mf_performance_cache_") ||
          key.startsWith("stock_summary_cache_") ||
          key === "asset_allocation_cache"
        ) {
          localStorage.removeItem(key);
        }
      });
      setItemLocal("family", 1);
      await handleCheckAllStatus(userData?.user_id);
      await handleGetFamilyMember(userData?.user_id);
      await hanleprofileDetails(userData?.user_id);

      const userDataString = localStorage.getItem("user_data");
      const user_Data = userDataString ? JSON.parse(userDataString) : {};

      if (isCRMUser) {
        window.location.replace(
          process.env.PUBLIC_URL + "/datagathering/verification-docs"
        );
        return;
      }

      if (user_Data.mobile_verified === false) {
        window.location.replace(process.env.PUBLIC_URL + "/mobile-verfication");
        return;
      }

      if (user_Data.user_onboarding_status === false) {
        window.location.replace(process.env.PUBLIC_URL + "/onboard-flow");
        return;
      }

      localStorage.removeItem("auth_view");
      localStorage.removeItem("verification_flow");

      if (redirect_to == "report") {
        window.location.replace("/report/intro");
      }
      if (redirect_to == "datagathering") {
        window.location.replace("/datagathering/about-you");
      }
      if (redirect_to == "cart") {
        window.location.replace("/direct-mutual-fund/mycart");
      }
      if (redirect_to == "verification-docs") {
        window.location.replace("/datagathering/verification-docs");
      }
    } catch (error) {
      console.error("Error storing user session:", error);
    }
  }
};

export const getDownActivityStateFromLS = (type) => {
  try {
    var r = localStorage.getItem("down-activity");
    if (r != null) {
      r = JSON.parse(r);
      return r.filter((v) => v.key == type)[0] ?? {};
    }
  } catch (e) {
    return {};
  }
};

export const isFamilySelected = () => {
  return Boolean(localStorage.getItem("family"));
};

export const fetchMembers = async () => {
  try {
    const r = await getFamilyMember(getParentUserId());
    return r.data;
  } catch (e) {
    Promise.reject(e);
  }
};

export const getPublicMediaURL = (path) => {
  return (
    process.env.PUBLIC_URL +
    "/" +
    path
      .split("/")
      .filter((v) => v != "")
      .join("/")
  );
  // if (window.location.host.includes("fintoo.in")) {
  //   return (
  //     process.env.REACT_APP_STATIC_MEDIA_URL +
  //     path
  //       .split("/")
  //       .filter((v) => v != "")
  //       .join("/")
  //   );
  // } else {
  //   return (
  //     process.env.PUBLIC_URL +
  //     "/" +
  //     path
  //       .split("/")
  //       .filter((v) => v != "")
  //       .join("/")
  //   );
  // }
};

export const getSchemeDataStorage = async () => {
  try {
    if (localStorage.getItem("getschemeData") == null) {
      const payload = {
        group_by_category: "Y",
        all_record: 1
      };

      let getschemeData = await GetSchemeList(payload);
      if (getschemeData?.status_code == 200) {
        localStorage.setItem("getschemeData", JSON.stringify(getschemeData));
        return getschemeData;
      }
    } else {
      return JSON.parse(localStorage.getItem("getschemeData"));
    }
  } catch (err) {
    console.error(err);
  }
};

export const isUnderMaintenance = (details) => {
  let from = moment("10/14/2023 03:00");
  let to = moment("10/15/2023 10:00");

  if (details)
    return {
      isActive: moment().isBetween(from, to),
      from: from.format("LLLL"),
      to: to.format("LLLL"),
      html: (
        <p className="mb-0">
          Due to the scheduled maintenance activities on the BSE StAR MF
          Platform, you will not be able to perform any activity related to your
          MF investments on <strong>{from.format("Do MMMM YYYY, dddd")}</strong>{" "}
          from <strong>{from.format("h:mm a").toUpperCase()}</strong> to{" "}
          <strong>{to.format("h:mm a").toUpperCase()}.</strong>
        </p>
      ),
      string: `<p class="mb-0">Due to the scheduled maintenance activities on the BSE StAR MF Platform, you will not be able to perform any activity related to your MF investments on <strong>${from.format(
        "Do MMMM YYYY, dddd"
      )}</strong> from <strong>${from
        .format("h:mm a")
        .toUpperCase()}</strong> to <strong>${to
          .format("h:mm a")
          .toUpperCase()}.</strong></p>`,
    };
  else return moment().isBetween(from, to);
};

export const isValidEmail = (str) => {
  return validate(str);
};

export const apiCall = async (
  url,
  data = "",
  enc = true,
  checkSession = true
) => {
  try {
    let reqData = "";
    let respData = "";
    let req = "";

    if (enc && data && data !== "") {
      reqData = commonEncode.encrypt(JSON.stringify(data));
    } else {
      reqData = data;
    }
    if (data && data !== "") {
      req = { method: "post", url: url, data: reqData };
    } else {
      req = { method: "get", url: url };
    }

    return new Promise(function (resolve, reject) {
      axios(req)
        .then((data) => {
          if (enc == true) {
            let decRespData = commonEncode.decrypt(data.data);
            respData = JSON.parse(decRespData);
          } else {
            respData = data.data;
          }
          resolve(respData);
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (err) {
    return err;
  }
};

export const restApiCall = async (url, data = "", headers = "") => {
  try {
    let respData = "";
    let req = "";

    if (data && data !== "") {
      req = {
        method: "post",
        url: url,
        data: commonEncode.encrypt(JSON.stringify(data)),
      };
    } else {
      req = { method: "get", url: url };
    }

    return new Promise(function (resolve, reject) {
      axios(req)
        .then((data) => {
          let respData;
          try {
            respData = JSON.parse(commonEncode.decrypt(data.data));
            if (!respData) throw true;
          } catch (e) {
            try {
              respData = Object.assign({}, data.data);
              if (respData.data != "") {
                let decRespData = commonEncode.decrypt(respData.data);
                respData["data"] = JSON.parse(decRespData);
              }
            } catch (e) {
              respData = Object.assign({}, data.data);
            }
          }
          resolve(respData);
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (err) {
    return err;
  }
};

export const getRestApiHeaders = async (
  gatewayName = "https://stg.minty.co.in"
) => {
  // try {
  //   let encGateWayName = btoa(gatewayName);
  //   let url =
  //     constClass.GET_ACCESSTOKEN_API_URL + "?gatewayname=" + encGateWayName;
  //   let data = await apiCall(url);
  //   if (data["error_code"] == "100") {
  //     let ret_data = {
  //       gatewayname: gatewayName,
  //       gatewayauthtoken: data["data"]["token"],
  //     };
  //     return ret_data;
  //   }
  //   return false;
  // } catch (e) {
  //   return false;
  // }
};

export const CheckSession = async () => {
  return <></>;
};

export const loginRedirect = () => {
  let tempParamItrPage = localStorage.getItem("itr-page");
  clearLocalStorageExcept(["leadData"]);
  if (tempParamItrPage) {
    localStorage.setItem("itr-page", tempParamItrPage);
  }
  let curr_url = window.location.href.split("?");
  let redirect_uri = curr_url[0];
  let redirect_params = "";
  if (curr_url.length > 1) {
    redirect_params = curr_url[1];
  }
  let red_uri =
    LOGIN_PAGE +
    "?src=" +
    Buffer.from(commonEncode.encrypt("dmf")).toString("base64") +
    "&redirect_uri=" +
    Buffer.from(commonEncode.encrypt(redirect_uri)).toString("base64");
  if (curr_url.length > 1) {
    red_uri =
      red_uri +
      "&redirect_params=" +
      Buffer.from(commonEncode.encrypt(redirect_params)).toString("base64");
  }

  let redirectToThis = window.location.href;
  let checkAuth = window.location.href.split("auth");
  if (checkAuth.length > 1) {
    redirectToThis = checkAuth[0].substring(0, checkAuth[0].length - 1);
  }
  localStorage.setItem("redirectToThis", redirectToThis);

  window.location.replace(red_uri);
  return;
};

export const loginRedirectGuest = (src = "dmf", url = "", fromLoginBtn) => {
  if (fromLoginBtn) {
    var goToLink = window.location.origin + "/login";
    window.location = goToLink;
  }
  return;
  localStorage.removeItem("userid");
  let lastVisitedUrl = localStorage.getItem("lastVisited");
  let t = url ? url : lastVisitedUrl ? lastVisitedUrl : window.location.href;
  if (window.location.pathname == "/") {
    t = t + "web/commondashboard";
  }
  localStorage.setItem("redirectToThis", encodeURIComponent(t));

  var loginRegisterUrl = getLoginRegisterUrl();
  var goTo =
    loginRegisterUrl +
    "?src=" +
    Buffer.from(commonEncode.encrypt(src)).toString("base64");

  let mainUrl = new URL(t);
  //console.log(mainUrl.searchParams.get("utm_source"));
  if (mainUrl.searchParams.get("utm_source")) {
    goTo = goTo + "&utm_source=" + mainUrl.searchParams.get("utm_source");
  }
  if (mainUrl.searchParams.get("utm_medium")) {
    goTo = goTo + "&utm_medium=" + mainUrl.searchParams.get("utm_medium");
  }
  if (mainUrl.searchParams.get("utm_campaign")) {
    goTo = goTo + "&utm_campaign=" + mainUrl.searchParams.get("utm_campaign");
  }
  if (mainUrl.searchParams.get("utm_campaign")) {
    goTo = goTo + "&utm_campaign=" + mainUrl.searchParams.get("utm_campaign");
  }
  if (mainUrl.searchParams.get("tags")) {
    goTo = goTo + "&tags=" + mainUrl.searchParams.get("tags");
  }
  if (mainUrl.searchParams.get("rm_id")) {
    goTo = goTo + "&rm_id=" + mainUrl.searchParams.get("rm_id");
  }
  if (mainUrl.searchParams.get("utm_service")) {
    goTo = goTo + "&utm_service=" + mainUrl.searchParams.get("utm_service");
  }

  window.location = goTo;
};

export const getLoginRegisterUrl = () => {
  let curUrl = window.location.href;
  if (
    curUrl.includes("income-tax-filing") ||
    curUrl.includes("/itr-file") ||
    curUrl.includes("/itr_2024")
  ) {
    return REGISTER_PAGE;
  }
  return LOGIN_PAGE;
};

export const successAlert = (msg) => {
  Swal.fire({
    title: "",
    html: msg,
    icon: "success",
  });
};

export const errorAlert = (msg = "Something went wrong") => {
  return Swal.fire({
    title: "",
    html: msg,
    icon: "error",
  });
};

export const formatPrice = (v) => {
  switch (true) {
    case v / 10000000 >= 1:
      return indianRupeeFormat((v / 10000000).toFixed(2) * 1) + "Cr.";
    case v / 100000 >= 1:
      return indianRupeeFormat((v / 100000).toFixed(2) * 1) + "L";
    case v / 1000 >= 1:
      return indianRupeeFormat((v / 1000).toFixed(2) * 1) + "K";
    default:
      return indianRupeeFormat(v);
  }
};

export const formatNegative = (v) => {
  v = v.replace("₹ ", "₹ (");
  switch (true) {
    case v.indexOf("Cr.") > -1:
      return v.replace("Cr.", ")Cr.");
    case v.indexOf("L") > -1:
      return v.replace("L", ")L");
    case v.indexOf("K") > -1:
      return v.replace("K", ")K");
    default:
      return v + ")";
  }
};

export const indianRupeeFormat = (v, decimal = null) => {
  const amount = typeof v === "string" ? parseFloat(v.replace(/,/g, "")) : v;

  if (amount == null || isNaN(amount)) return "-"; // ✅ safe fallback

  var options = {
    style: "currency",
    currency: "INR",
  };
  if (decimal != null) {
    options.maximumFractionDigits = decimal;
  }

  var s = amount.toLocaleString("en-IN", options);
  return s.replace("₹", "₹ ");
};
export const indianRupeeFormat1 = (v, decimal = null) => {
  const amount = typeof v === "string" ? parseFloat(v.replace(/,/g, "")) : v;

  if (amount == null || isNaN(amount)) return "-"; // ✅ safe fallback

  const options = {
    style: "currency",
    currency: "INR",
    ...(decimal != null && { maximumFractionDigits: decimal }),
  };

  const s = amount.toLocaleString("en-IN", options);
  return s.replace("₹", "₹ ");
};

export const numberFormat = (v, decimal = null) => {
  var options = {
    style: "currency",
    currency: "INR",
  };
  if (decimal != null) {
    options.maximumFractionDigits = decimal;
  }
  var s = Number(v).toLocaleString("en-IN", options);
  return s.replace("₹", "");
};

export const getNumberWithOrdinal = (n) => {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const getCartDetails = async () => {
  try {
    let payload = {
      user_id: getUserId(),
      data_belongs_to: DATA_BELONGS_TO
    };
    //
    let r = await GetCartDetails(payload);
    return r.data;
  } catch (err) {
    throw err;
  }
};

export const updateCartCount = async (data_belongs_to = DATA_BELONGS_TO) => {
  try {

    let isGuest = getUserId() == null;

    if (getItemLocal("family")) {
      var new_array = [];
      var new_data = getItemLocal("member");
      new_data.forEach((element) => {
        new_array.push(element.id);
      });
    }

    // Guest User - return localStorage count only
    if (isGuest) {
      const guestCartCount = localStorage.getItem("guestCartCount");
      return guestCartCount ? parseInt(guestCartCount) : 0;
    }

    // Logged-In User - Get count from API
    var payload = {
      user_id: getItemLocal("family") ? new_array : getUserId(),
      data_belongs_to: DATA_BELONGS_TO,
    };

    var res = await GetCartDetails(payload);
    const cartdStr = res.data?.data || res.data || [];
    const count = Array.isArray(cartdStr) ? cartdStr.length : 0;
    return count;

  } catch (e) {
    console.error("Error in updateCartCount:", e);

    let isGuest = getUserId() == null;
    if (!isGuest) return 0;

    const guestCartCount = localStorage.getItem("guestCartCount");
    return guestCartCount ? parseInt(guestCartCount) : 0;
  }
};

// Helper function to update guest cart count
export const updateGuestCartCount = (count) => {
  if (count >= 0) {
    localStorage.setItem("guestCartCount", count.toString());
  }
};

export const fetchEncryptData = async (req) => {
  try {
    const data = await axios(req);
    return data.data;
  } catch (err) {
    throw err;
  }
};

export const fetchData = async (req) => {
  try {
    const data = await axios(req);
    return data.data;
  } catch (err) {
    throw err;
  }
};

export const FV = (rate, nper, pmt, pv, type) => {
  var pow = Math.pow(1 + rate, nper),
    fv;
  if (rate) {
    fv = (pmt * (1 + rate * type) * (1 - pow)) / rate - pv * pow;
  } else {
    fv = -1 * (pv + pmt * nper);
  }
  return fv.toFixed(2);
};

export const getSumOfProperty = (Arr, property) => {
  let sum = 0;
  for (let i of Arr) {
    sum += 1 * i[property];
  }
  return sum;
};

export const memberId = () => {
  if (localStorage.getItem("newmember") == null) {
    return getUserId();
  } else {
    return localStorage.getItem("newmember");
  }
};

export const setItemLocal = (property, value, enc = true) => {
  try {
    if (enc) {
      localStorage.setItem(
        property,
        commonEncode.encrypt(JSON.stringify(value))
      );
    } else {
      localStorage.setItem(property, JSON.stringify(value));
    }
  } catch (err) {
    return false;
  }
};

export const getItemLocal = (property) => {
  let val;
  try {
    try {
      val = JSON.parse(commonEncode.decrypt(localStorage.getItem(property)));
    } catch {
      val = commonEncode.decrypt(localStorage.getItem(property));
    }
  } catch {
    val = JSON.parse(localStorage.getItem(property));
  }

  if (typeof val == "number") {
    val = String(val);
  }

  return val;
};

export const getUserId = () => {
  if (getMemberId() == null) {
    return getParentUserId();
  } else {
    return getMemberId();
  }
};

export const getFpLogId = async () => {
  var data = commonEncode.encrypt(JSON.stringify({ user_id: getUserId() }));
  // var config = {
  //   method: "post",
  //   url: 'ADVISORY_GET_FP_LOG',
  //   data: data,
  // };
  // var res = await axios(config);
  // if (res.data["error_code"] == "100") {
  //   return res?.data?.data?.fp_log_id ? res.data.data.fp_log_id : "";
  // } else {
  //   return "";
  // }
};

export const getFpUserDetailsId = async () => {
  let a = getItemLocal("member");
  let x = a.find((item) => item.id == getUserId());
  return x.fp_user_details_id ?? "";
};

export const setUserId = (v) => {
  localStorage.setItem("dXNlcmlk", commonEncode.encrypt("" + v));
};

export const setMinorUserId = (v) => {
  localStorage.setItem("klmclNXd", commonEncode.encrypt("" + v));
};

export const removeUserId = (v) => {
  localStorage.removeItem("dXNlcmlk");
};

export const setFplogid = (v) => {
  localStorage.setItem("ZnBsb2dpZA==", commonEncode.encrypt("" + v));
};
export const getParentUserId = () => {
  if (localStorage.getItem("dXNlcmlk") == null) {
    return null;
  } else {
    return commonEncode.decrypt(localStorage.getItem("dXNlcmlk"));
  }
};

export const getParentUserDetails = () => {
  let allmember = JSON.parse(
    commonEncode.decrypt(localStorage.getItem("member"))
  );
  const parent = allmember.filter((v) => v.id == getParentUserId());
  return parent[0];
};

export const getMinorUserId = () => {
  if (localStorage.getItem("klmclNXd") == null) {
    return null;
  } else {
    return commonEncode.decrypt(localStorage.getItem("klmclNXd"));
  }
};

export const getParentFpLogId = () => {
  if (localStorage.getItem("ZnBsb2dpZA==") == null) {
    return null;
  } else {
    return commonEncode.decrypt(localStorage.getItem("ZnBsb2dpZA=="));
  }
};

export const setMemberId = (v) => {
  localStorage.setItem("bWVtYmVySWQ=", commonEncode.encrypt("" + v));
};
export const getMemberId = () => {
  if (localStorage.getItem("bWVtYmVySWQ=") == null) {
    return null;
  } else {
    return commonEncode.decrypt(localStorage.getItem("bWVtYmVySWQ="));
  }
};
export const removeMemberId = (v) => {
  localStorage.removeItem("bWVtYmVySWQ=");
};

export const setFpUserDetailsId = (v) => {
  localStorage.setItem(
    "ZnBfdXNlcl9kZXRhaWxzX2lk=",
    commonEncode.encrypt("" + v)
  );
};
export const getFpUserDetailId = () => {
  if (localStorage.getItem("ZnBfdXNlcl9kZXRhaWxzX2lk=") == null) {
    return null;
  } else {
    return commonEncode.decrypt(
      localStorage.getItem("ZnBfdXNlcl9kZXRhaWxzX2lk=")
    );
  }
};
export const removeFpUserDetailsId = (v) => {
  localStorage.removeItem("ZnBfdXNlcl9kZXRhaWxzX2lk=");
};

export const fetchUserData = async (alldata = false) => {
  //console.log("fetchUserData called");
};

export const addSuffix = (i) => {
  var a = i % 10,
    b = i % 100;

  if (a == 1 && b != 11) {
    return "st";
  } else if (a == 2 && b != 12) {
    return "nd";
  } else if (a == 3 && b != 13) {
    return "rd";
  } else {
    return "th";
  }
};

export const defaultamclogo = () => {
  return `${process.env.PUBLIC_URL}/static/media/companyicons/amc_icon.png`;
};

export const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

export const getProfilePercentage = async (v) => {
  if (Boolean(v?.pan) == false) {
    return 0;
  }
  try {
    const response = await Fetch_User_Mf_Profile_Status(v.id);
    setItemLocal("profile", response);
    if (response.status_code == 200) {
      return Number(response.user_profile_progress.profile_status);
    } else {
      return 0;
    }
  } catch (e) {
    throw "Something went wrong";
  }
};

export const getProfileStatusData = async (v) => {
  if (Boolean(v.pan) == false) {
    return 0;
  }
  try {
    const r = await Fetch_User_Mf_Profile_Status(v.id);
    setItemLocal("profile", r);
    if (Number(r.status_code) === 200) {
      return r.data;
    }
  } catch (e) {
    throw "Something went wrong";
  }
};

export const getCurrentUserDetails = async () => {
  try {
    const payload = {
      url: "",
      data: {
        user_id: getUserId(),
      },
      method: "post",
    };
    const r = await fetchData(payload);
    return r.data;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const removeSlash = (str) => {
  while (str.substr(-1) === "/") {
    str = str.substr(0, str.length - 1);
  }
  return str;
};

export const rsFilter = (input) => {
  if (!isNaN(input)) {
    var is_negative = false;
    var result = 0;

    var result = Math.floor(input).toString();

    if (result.indexOf("-") !== -1) {
      result = result.replace("-", "");
      is_negative = true;
    }
    var lastThree = result.substring(result.length - 3);

    var otherNumbers = result.substring(0, result.length - 3);

    if (otherNumbers != "") lastThree = "," + lastThree;
    var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    if (is_negative == true) {
      output = "-" + output;
    }

    return output;
  }
};

export const makePositive = (input) => {
  return Math.abs(input);
};

export const getSubtracion = (val1, val2) => {
  var total = 0;
  total = parseFloat(val1 - val2);
  return total;
};

export const toPascalCase = (str) => {
  if (str && typeof str === "string") {
    return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
      letter.toUpperCase()
    );
  } else {
    return "";
  }
};

export const toTitleCase = (str) => {
  return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export const generateSortFn = (props) => {
  return function (a, b) {
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      var name = prop.name;
      var reverse = prop.reverse;
      if (a[name] < b[name]) return reverse ? 1 : -1;
      if (a[name] > b[name]) return reverse ? -1 : 1;
    }
    return 0;
  };
};

export const bytesToMegabytes = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

export const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const fv = (rate, nper, pmt, pv) => {
  nper = parseFloat(nper);
  pmt = parseFloat(-pmt);
  pv = parseFloat(-pv);
  rate = parseFloat(rate) / 100;
  if (rate == 0) {
    // Interest rate is 0
    var fv_value = -(pv + pmt * nper);
  } else {
    var x = Math.pow(1 + rate, nper);
    var fv_value = -(-pmt + x * pmt + rate * x * pv) / rate;
  }
  return fv_value;
};

export const dateDiff = (date) => {
  date = date.split("/");
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const yy = parseInt(date[2]);
  const mm = parseInt(date[1]);
  const dd = parseInt(date[0]);

  let years, months, days;

  // months
  months = mm - month;
  if (day > dd) {
    months = months - 1;
  }

  // years
  years = yy - year;
  if (mm * 100 + dd < month * 100 + day) {
    years = years - 1;
    months = months + 12;
  }

  // days
  days = Math.floor(
    new Date(year + years, month + months - 1, day).getTime() /
    (24 * 60 * 60 * 1000) -
    today.getTime()
  );

  months = months + years * 12;

  return months;
};

export const PMT = (ir, np, pv, fv, type) => {
  if (np != "") {
    np = dateDiff(np);
    np = np + 1;
    if (np == 1) {
      np = 2;
    }
    var pmt, pvif;

    fv || (fv = 0);
    type || (type = 0);

    if (ir === 0) return (pv + fv) / np;

    pvif = Math.pow(1 + ir, np);
    pmt = (-ir * pv * (pvif + fv)) / (pvif - 1);

    if (type === 1) pmt /= 1 + ir;

    return parseFloat(-pmt.toFixed(2)) == Infinity
      ? 0
      : parseFloat(-pmt.toFixed(2));
  }
};

export const calculateEMI = (principal, interestRate, loanTenureInMonths) => {
  const monthlyInterestRate = interestRate / (12 * 100);
  const emi =
    (principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, loanTenureInMonths)) /
    (Math.pow(1 + monthlyInterestRate, loanTenureInMonths) - 1);
  return emi;
};

export const setBackgroundDivImage = () => {
  const background_div = document.getElementsByClassName("background-div")[0];


  if (!background_div) {
    return;
  }

  if (window.location.hostname === "localhost") {
    background_div.style.background = `url(${imagePath}/static/media/DG/dg_back.svg) no-repeat left bottom`;
  } else {
    background_div.style.background = `url(${imagePath}/static/media/DG/dg_back.svg) no-repeat left bottom`;
    // or keep your CDN path:
    // background_div.style.background = `url("/image/?frontend=1&file=/static/assets/img/bg/dg_back.svg") no-repeat left bottom`;
  }

  background_div.style.backgroundSize = "cover";
};

export const goalFilter = (goals, maturityDate) => {
  const parseDate = (str) => {
    if (str) {
      var d = new Date(str.split("/").reverse().join("/"));

      return d;
    }
  };
  const datediff = (first, second) => {
    if (first && second) {
      return Math.ceil(
        (second.getTime() - first.getTime()) / 1000 / 60 / 60 / 24
      );
    }
  };

  var filteredGoals = goals.filter((goal) => {
    if (goal.goal_isRecurring == "0") {
      if (maturityDate) {
        if (
          datediff(
            parseDate(maturityDate),
            parseDate(goal.goal_end_date)
          ) >= 0
        ) {
          return true;
        }
      }
    } else {
      if (maturityDate) {
        if (
          datediff(parseDate(maturityDate), parseDate(goal.goal_start_date)) >=
          0
        ) {
          return true;
        }
      }
    }
  });
  return filteredGoals;
};

export const insuranceGoalFilter = (goals, c_years, payment_start_date) => {
  const parseDate = (str) => {
    if (str) {
      var d = new Date(str.split("/").reverse().join("/"));
      return d;
    }
  };

  const datediff = (first, second) => {
    if (first && second) {
      return Math.ceil(
        (second.getTime() - first.getTime()) / 1000 / 60 / 60 / 24
      );
    }
  };
  if (c_years != undefined && c_years != "") {
    var dateStr = payment_start_date;
    var parts = dateStr.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var year = parseInt(parts[2], 10);
    var date = new Date(year, month, day);
    date.setFullYear(date.getFullYear() + parseInt(c_years));
    date.setDate(date.getDate() + 1);
    const pad = (n) => n.toString().padStart(2, "0");
    var c_date =
      pad(date.getDate()) +
      "/" +
      pad(date.getMonth() + 1) +
      "/" +
      date.getFullYear();
    if (c_date != undefined) {
      var filteredGoals = goals.filter((goal) => {
        if (datediff(parseDate(c_date), parseDate(goal.goal_end_date)) >= 0) {
          return true;
        }
      });
    }
    return filteredGoals;
  }
};
export const maskBankAccNo = (str, mask = "X", n = 4) => {
  return ("" + str).slice(0, -n).replace(/./g, mask) + ("" + str).slice(-n);
};

export const getprofilestatus = async (session_data) => {
  try {
    let api_data = {
      user_id: session_data["data"]["id"],
      fp_log_id: session_data["data"]["fp_log_id"],
      web: 1,
    };
    var payload_data = commonEncode.encrypt(JSON.stringify(api_data));
    var res = await apiCall("", payload_data, false, false);
    let decoded_res = JSON.parse(commonEncode.decrypt(res));
    if (decoded_res["error_code"] == "100") {
      const profile_completed_mapping = {
        17: 117.496,
        50: 70.4973,
        67: 46.9982,
        83: 23.4991,
        100: 0,
      };

      const profile_completed =
        decoded_res["data"][13]["profile_completed"] === 66
          ? 67
          : decoded_res["data"][13]["profile_completed"];
      const sectionIdsToCheck = [1, 3, 5, 6, 7, 8];
      const allConditionsMet = sectionIdsToCheck.every((sectionId) => {
        const matchingEntry = decoded_res["data"].find(
          (entry) => entry.section_id === sectionId
        );
        return matchingEntry && matchingEntry.total > 0;
      });

      const sectionIdsToCheckk = [1, 3];
      const allConditionsMett = sectionIdsToCheckk.every((sectionId) => {
        const matchingEntryy = decoded_res["data"].find(
          (entry) => entry.section_id === sectionId
        );
        return matchingEntryy && matchingEntryy.total > 0;
      });

      let newNumber;
      if (allConditionsMet) {
        newNumber = "1";
      } else {
        newNumber = "0";
      }

      let newNumberr;
      if (allConditionsMett) {
        newNumberr = "1";
      } else {
        newNumberr = "0";
      }
      const sectionTextMap = {
        1: "About You",
        3: "About You",
        5: "Goals",
        6: "Income & Expenses",
        7: "Income & Expenses",
        8: "Assets & Liabilities",
      };

      const filteredData = decoded_res["data"].filter((item) =>
        [1, 3, 5, 6, 7, 8].includes(item.section_id)
      );

      const sectionsWithTotalZeroTextArray = filteredData
        .filter((item) => item.total === 0)
        .map((item) => sectionTextMap[item.section_id]);

      const uniqueSectionsWithTotalZeroTextArray = [
        ...new Set(sectionsWithTotalZeroTextArray),
      ];
      const sectionsWithTotalZeroText =
        uniqueSectionsWithTotalZeroTextArray.join(", ");

      if (
        uniqueSectionsWithTotalZeroTextArray.includes("About You") &&
        uniqueSectionsWithTotalZeroTextArray.includes("Income & Expenses") &&
        uniqueSectionsWithTotalZeroTextArray.includes("Assets & Liabilities")
      ) {
        sessionStorage.setItem("showAboutYouToast", "1");
      } else if (
        uniqueSectionsWithTotalZeroTextArray.includes("Income & Expenses") &&
        uniqueSectionsWithTotalZeroTextArray.includes("Assets & Liabilities")
      ) {
        window.location.href =
          process.env.PUBLIC_URL + "/datagathering/income-expenses";
      } else if (
        uniqueSectionsWithTotalZeroTextArray.includes("Income & Expenses")
      ) {
        window.location.href =
          process.env.PUBLIC_URL + "/datagathering/income-expenses";
      } else if (
        uniqueSectionsWithTotalZeroTextArray.includes("Assets & Liabilities")
      ) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("In Assets & Liabilities section Assets is incomplete");
      } else if (uniqueSectionsWithTotalZeroTextArray.includes("About You")) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error('In About You section "Your Info" is Mandatory');
      }
    }
  } catch (e) {
    console.error("eeee---->", e);
  }
};

export const alphanumeric_custom = (val) => {
  // "Special characters not allowed"
  if (/^[^-\s][a-zA-Z0-9_\s-&+-\[\]$%]+$/.test(val)) {
    return true;
  }
  return false;
};

export const customspacing = (val) => {
  // "No white spaces are allowed at beginning/end"
  if (/^[a-zA-Z0-9_()_&.\/,-]+( +[a-zA-Z0-9_()_.&\/,-]+)*$/.test(val)) {
    return true;
  }
  return false;
};

export const special_start = (val) => {
  // "Special characters not allowed"
  if (/^[a-zA-Z0-9\s]+(?:[-:%#&@/\\()\u2122.+][a-zA-Z0-9\s]+)*$/.test(val)) {
    return true;
  }
  return false;
};

export const createCookie = (name, value, minutes) => {
  if (minutes) {
    var date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    var expires = "; expires=" + date.toGMTString();
  } else {
    var expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
};

export const getCookieData = (name) => {
  var pairs = document.cookie.split("; "),
    count = pairs.length,
    parts;
  while (count--) {
    parts = pairs[count].split("=");
    if (parts[0] === name) return parts[1];
  }
  return false;
};

export const deleteCookie = (name) => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export const getStarRatingValue = (rating, position) => {
  return Number(rating) >= position
    ? "FULL"
    : Number(rating) >= position - 0.5
      ? "HALF"
      : null;
};

export const base64ToBlob = (base64, mimeType) => {
  let byteCharacters = atob(base64.split(",")[1]);
  let byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    let slice = byteCharacters.slice(offset, offset + 1024);
    let byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: mimeType });
};

let axiosInterceptorId;

export const setupHttpClients = () => {
  const token = Cookies.get("token");

  // ---- AXIOS SETUP ----
  if (token) {
    // Eject any previously added interceptor
    if (axiosInterceptorId !== undefined) {
      axios.interceptors.request.eject(axiosInterceptorId);
    }

    // Add fresh interceptor
    axiosInterceptorId = axios.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `token ${token}`;
        return config;
      }
      // (error) => Promise.reject(error)
    );
  }
};
