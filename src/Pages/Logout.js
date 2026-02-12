import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    localStorage.clear();
    window.location = process.env.REACT_APP_PYTHON_URL + "/logout";
  }, []);

  return (
    <>
      <div style={{ height: "100vh" }}></div>
    </>
  );
};
export default Logout;
