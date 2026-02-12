import { useEffect, useState, Fragment } from "react";
import {
  fetchData,
  fetchEncryptData,
  getPublicMediaURL,
} from "../../common_utilities";
// import { DMF_STOP_REASON_API_URL } from "../../constants";
import style from "./style.module.css";
import { useDispatch } from "react-redux";
import { GetStopSipReasons } from "../../FrappeIntegration-Services/services/master-api/masterApiService";

const StopSipReason = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const [allReasons, setAllReasons] = useState([]);
  const [selected, setSelected] = useState({});
  const [textError, setTextError] = useState("");
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const r = await GetStopSipReasons()
    // const r = await fetchData({
    //   url: DMF_STOP_REASON_API_URL,
    //   method: "post",
    // });
    setAllReasons(r.data);
  };

  return (
    <>
      {allReasons.map((v) => (
        <Fragment key={"rsnx-" + v.id}>
          <p
            className={`${style.para} py-2 pointer ${selected?.reason_code == v.reason_code && style.paraselect}`}
            onClick={() => {
              setSelected(v);
            }}
          >
            <img
              src={getPublicMediaURL(
                `/static/media/icons/${
                  selected?.reason_code == v.reason_code ? "check_01.svg" : "check_02.png"
                }`
              )}
              width={17}
            />
            &nbsp;&nbsp;&nbsp;{v.reason}
          </p>
          {selected.reason_code == 13 && v.reason_code == 13 && (
            <div>
              <input
                placeholder="Please specify the reason"
                type="text"
                onChange={(e) => {
                  if(e.target.value) {
                    setTextError("");
                  } else {
                    setTextError("This field is required.");
                  }
                  setSelected((prev) => ({ ...prev, text: e.target.value }));
                }}
                value={selected?.text}
                className={`${style.txt} w-100`}
              />
              {textError && <p className="error">{textError}</p>}
            </div>
          )}
        </Fragment>
      ))}
      <div className="pt-4">
        <div
          className={`${Object.keys(selected).length == 0 && "disabled"} switch-fund-btn mobile-bottom-button`}
          onClick={() => {
            if(Object.keys(selected).length == 0) {
              dispatch({ type: "RENDER_TOAST", payload: { message: 'Please select reason.', type: 'error' } });
            } else if(selected?.reason_code == 13 && !selected?.text) {
              setTextError("This field is required.");
            } else {
              onSubmit(selected);
            }
          }}
        >
          Next
        </div>
      </div>
    </>
  );
};

export default StopSipReason;
