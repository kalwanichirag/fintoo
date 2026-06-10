import { useEffect } from "react";
import { clearLocalStorageExcept } from "../Utils/storage";

const Logout = () => {
  useEffect(() => {
    clearLocalStorageExcept(["leadData"]);
    window.location = process.env.REACT_APP_PYTHON_URL + "/logout";
  }, []);

  return (
    <>
      <div style={{ height: "100vh" }}></div>
    </>
  );
};
export default Logout;
