import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getItemLocal } from "../../common_utilities";
import * as toastr from "toastr";

const MemberLayout = (props) => {

    const navigate = useNavigate();
    useEffect(() => {
        if (getItemLocal("family") == '1') {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error('Please select member');
            return navigate(`${props.redirectUrl ? props.redirectUrl : process.env.PUBLIC_URL + '/commondashboard'}`);
        }
    }, [])

    return (
        <>
            {props.children}
        </>
    );
}

export default MemberLayout;
