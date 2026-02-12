import { useEffect } from "react";
import { useSelector } from "react-redux";
import { CheckSession, loginRedirectGuest } from "../common_utilities";

const CheckSessionLayout = () => {
    const loggedIn = useSelector(state=> state.loggedIn);

    useEffect(()=> {
      // checksession();
    }, []);

    useEffect(()=> {
        if(loggedIn === false) {
            // checksession();
        }
      }, [loggedIn]);
    return <></>;
}
export default CheckSessionLayout;