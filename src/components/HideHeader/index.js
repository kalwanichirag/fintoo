import { useEffect } from "react";



const HideHeader = () => {
    
    useEffect(()=> {
        document.body.classList.add('hide-header');
        return ()=> {
            document.body.classList.remove('hide-header');
        }
    }, []);
    return <></>;
}
export default HideHeader;