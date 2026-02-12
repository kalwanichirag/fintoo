import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Style from './style.module.css';
// import './style.css';
import ApplyWhiteBg from "../ApplyWhiteBg";

const NRIHeaderLayout  = (props) => {
    useEffect(()=> {
        document.body.classList.add('NRI-header');
        document.body.classList.remove('no-header');
        return ()=> {
           
            document.body.classList.remove('NRI-header');
        }
    }, []);    
    return (
        <>
        <ApplyWhiteBg />
        {props.children}
        </>
    );
}
export default NRIHeaderLayout ;