import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const AskFintoo = () => {
  const openChatBot = useSelector((state) => state.openChatBot);
  const dispatch = useDispatch();
  const [showResults, setShowResults] = useState(false);
  const onClick = () => setShowResults(true);
  const onClickClose = () => setShowResults(false);
  const [counter, setCounter] = useState(0);
  const [chatUrl, setChatUrl] = useState("");
  const location = useLocation();
  useEffect(() => {
    if (location.search.indexOf('chat_module') > -1 && location.search.indexOf('tagval') > -1) {
      dispatch({ type: "OPENCHATBOT", payload: true });
    }
  }, [openChatBot]);


  
  const url = process.env.PUBLIC_URL + "/wealth-management/";
  const afterWealthManagement = url.substring(url.indexOf("/wealth-management/") + "/wealth-management/".length);
 
  return (
    <>
      {/* {location.pathname == "" ||
      [
        process.env.PUBLIC_URL + "/income-tax-filing",
        process.env.PUBLIC_URL + "/nri-desk-dubai",
        process.env.PUBLIC_URL + "/income-tax-filing",
        process.env.PUBLIC_URL + "/contact-us",
        process.env.PUBLIC_URL + "/wealth-management/",
        process.env.PUBLIC_URL + "/wealth-management",
        process.env.PUBLIC_URL + "/personal-finance",
        process.env.PUBLIC_URL + "/financial-health-checkup",
        afterWealthManagement
      ].indexOf(location.pathname) > -1 ? (
        <></>
      ) : (
        <>
         {openChatBot == false ? (
            <>
              <div className={`${styles.AskFintooAI} ${styles.AskFintooImage}`}>
                <img
                  onClick={() => {
                    dispatch({ type: "OPENCHATBOT", payload: true });
                  }}
                  src={
                    process.env.REACT_APP_STATIC_URL + "/media/wp/AskFintoo.png"
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  width: "100vw",
                  height: "100vh",
                  position: "fixed",
                  left: 0,
                  top: 0,
                  backgroundColor: "rgba(0,0,0,.6)",
                  zIndex: 9999,
                }}
              ></div>
              <div className={`${styles.IframeAI} `}>
                <iframe
                  className={`${
                    showResults
                      ? `${styles.IfrmaeLoadani} ${styles.animated} ${styles.animatedFadeInUp} ${styles.fadeInUp}`
                      : ""
                  }`}
                  key={"ifm" + counter}
                  src={chatUrl}
                  
                  title="Iframe Example"
                ></iframe>
                <div
                  onClick={() => {
                    setCounter((v) => ++v);
                  }}
                  className={`${styles.AskFintooAIReload}`}
                >
                  <img
                    className=""
                    src={
                      process.env.REACT_APP_STATIC_URL + "/media/wp/Reload.png"
                    }
                  />
                </div>
                <div
                  onClick={() => {
                    dispatch({ type: "OPENCHATBOT", payload: false });
                  }}
                  className={`${styles.AskFintooAI}`}
                >
                  <img
                    className=""
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "/media/wp/Closeiframe.png"
                    }
                  />
                </div>
              </div>
            </>
          )}
        </>
      )} */}
    </>
  );
};
export default AskFintoo;
