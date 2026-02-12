import { useNavigate } from "react-router-dom";
import {
  fetchEncryptData,
  getUserId,
  loginRedirectGuest,
} from "../../common_utilities";
import { useDispatch } from "react-redux";
import { AddToWishlist, DeleteFromWishlist } from "../../FrappeIntegration-Services/services/investment-api/investmentService";

const AddToWish = ({ scheme_slug, value = false, onToggleWishlist = null, scheme_code }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleWishList = async () => {
    try {
      const userid = getUserId();

      let res;

      if (userid != null) {
        var payload = {
          scheme_code: scheme_code,
          user_id: userid
        };

        if (value) {
          // config.url = DMF_BASE_URL + "api/wishlist/delete";
          res = await DeleteFromWishlist(payload);
        } else {
          res = await AddToWishlist(payload);
        }
        if (res.status_code === 200) {
          if (onToggleWishlist) {
            onToggleWishlist(scheme_code);
          }
          value ? RemoveAlert() : successAlert();
        }
      } else {
        
        navigate("/login");
        // loginRedirectGuest();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const successAlert = () => {
    dispatch({
      type: "RENDER_TOAST",
      payload: {
        message: "Added to Wishlist!",
        type: "success",
      },
    });
  };
  const RemoveAlert = () => {
    dispatch({
      type: "RENDER_TOAST",
      payload: {
        message: "Removed from Wishlist!",
        type: "success",
      },
    });
  };

  return (
    <div>
      <div className="pointer" onClick={() => toggleWishList()}>
        <img
          src={
            value
              ? process.env.REACT_APP_STATIC_URL + "media/DMF/bookmark1.svg"
              : process.env.REACT_APP_STATIC_URL + "media/DMF/bookmark.png"
          }
          className="addwishbookmark"
        // style={{ width: "20px" }}
        />
      </div>
    </div>
  );
};
export default AddToWish;
