import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import commonEncode from "../commonEncode";
import { Buffer } from "buffer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchEncryptData,
  getUserId,
  setUserId,
  setItemLocal,
} from "../common_utilities";
// import { CART_UPDATE_URL, GET_CART_DETAILS } from "../constants";

const CheckRedirect = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    document.body.classList.add("white-bg");
    document.body.classList.add("checkredirect");
    onLoadInit();
    return () => {
      document.body.classList.remove("white-bg");
      document.body.classList.remove("checkredirect");
    };
  }, []);

  const onLoadInit = async () => {
    
    // clear localStorage for portfolio
    localStorage.removeItem("UserPANInfo");
    localStorage.removeItem("MFSummaryPortfolio");

    const url = window.location.href;

    var a_ = url.split("?");

    var aaa = {};

    a_ = a_.filter((v) => v.includes("auth=") || v.includes("redirect="));

    a_.forEach((v) => {
      if (v.includes("redirect=")) {
        aaa["redirect"] = v.split("redirect=")[1];
      } 
      if (v.includes("auth=")) {
        aaa["auth"] = v.split("auth=")[1];
      }
    });

    const auth = aaa["auth"] ?? "";
    const redirect = aaa["redirect"] ?? "";

    if (auth) {
      // var u_id = commonEncode.decrypt(Buffer.from(auth, "base64").toString("ascii"));
      let auth1 = commonEncode.decrypt(
        Buffer.from(auth, "base64").toString("ascii")
      );
      let authData = auth1.split("|");
      if (authData) {
        let u_id = authData[0];
        let sky = authData[1];
        setUserId(u_id);
        setItemLocal("sky", sky);
      }
    }
    localStorage.removeItem("redirectURL");
    if (localStorage.getItem("saveHistory")) {
      var b = localStorage.getItem("saveHistory");
      // return;
      localStorage.removeItem("saveHistory");
      localStorage.removeItem("redirectToThis");
      b = JSON.parse(b);
      var payload = { ...b.data };
      payload.data.user_id = getUserId();

      // var encodedData = commonEncode.encrypt(JSON.stringify(payload));
      var response = await fetchEncryptData({ ...payload });

      var d = response;
      if (d.error_code * 1 === 100) {
        await updateCart(payload.data, d.data.cart_id);
        navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/mycart");
        return;
      } else {
        // navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/mycart");
        toast.error(d.message, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/mycart");
      }
    } else {
      
      var a = localStorage.getItem("redirectToThis");
      // ------------------------
      // Written by Nil, do not change code. 1st preference to localStorage, 2nd checking redirect variable in URL get query, 3rd default redirect to common dashboard.
      // ------------------------

      if (a) {
        localStorage.removeItem("redirectToThis");
        window.location = decodeURIComponent(a);
      } else if (redirect && !redirect.includes("session-expired")) {
        window.location = redirect;
      } else {
        window.location = process.env.PUBLIC_URL + "/commondashboard";
      }
    }
  };
  const updateCart = (cartdata, cartId = null) => {
    // if (cartId === null) return;
    // return new Promise(async (resolve, reject) => {
    //   try {
    //     var payload = {
    //       data: { user_id: getUserId() },
    //       method: "post",
    //       url: GET_CART_DETAILS,
    //     };
    //     //
    //     var response = await fetchEncryptData(payload);
    //     //
    //     localStorage.setItem("res8", JSON.stringify(response));
    //     localStorage.setItem("res82", JSON.stringify(cartdata));

    //     //

    //     var updateData = response.data.filter(
    //       (v) =>
    //         v.cart_scheme_code == cartdata.cart_scheme_code &&
    //         v.cart_purchase_type === cartdata.cart_purchase_type
    //     )[0];
    //     var payload = {
    //       url: CART_UPDATE_URL,
    //       data: {
    //         user_id: getUserId(),
    //         cart_id: "" + updateData.cart_id,
    //         cart_folio_no:
    //           updateData.folios.length > 0
    //             ? "" + updateData.folios[0]
    //             : "new_folio",
    //       },
    //       method: "post",
    //     };

    //     var response = await fetchEncryptData(payload);

    //     resolve(response);
    //   } catch (e) {
    //     reject(e);
    //   }
    // });
  };
  return (
    <>
      <ToastContainer />
      <div style={{ height: "110vh", width: "100vw" }}></div>
    </>
  );
};
export default CheckRedirect;
