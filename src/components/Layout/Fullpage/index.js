import styles from "./style.module.css";
import "./fullpage.css";
import { useEffect } from "react";
import Footer from "../../HTML/Footer";
import ScrollToTop from "../../HTML/ScrollToTop";
import MainHeader from "../../MainHeader";
const Fullpage = (props) => {

  const currentPath = window.location.pathname

  let hideScrollToTop = currentPath.includes('financial-planning')

  // 
  useEffect(() => {
    document.body.classList.add("mainfintoo");
    return () => {
      document.body.classList.remove("mainfintoo");
    };
  }, []);

  return (
    <>
      {/* <MainHeader /> */}
      <div>{props.children}</div>
      {/* <Footer /> */}
      {
        !hideScrollToTop && <ScrollToTop />
      }
    </>
  );
};
export default Fullpage;
