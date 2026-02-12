import { useEffect } from "react";

const ApplyWhiteBg = () => {
    useEffect(()=> {
        document.body.classList.add('white-bg');
        return ()=> {
            document.body.classList.remove('white-bg');
        }
    }, []);
    return (<></>);
}
export default ApplyWhiteBg;