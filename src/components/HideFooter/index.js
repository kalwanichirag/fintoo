import { useEffect } from "react";

const HideFooter = () => {
    
    useEffect(()=> {
        document.body.classList.add('hide-footer');
        return ()=> {
            document.body.classList.remove('hide-footer');
        }
    }, []);
    return <></>;
}
export default HideFooter;