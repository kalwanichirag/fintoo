
import { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { getNumberWithOrdinal } from "../../../common_utilities";

import style from './style.module.css';

const NumberPicker = (props) => {

    const [selected, setSelected] = useState(props.defaultValue * 1 || "");
    const [txtValue, setTxtValue] = useState(props.defaultValue * 1 || "");
    const [show, setShow] = useState(false);
    const refDiv = useRef(null);

    // useEffect(() => {
    //     function handleClickOutside(event) {
    //         if (refDiv.current && !refDiv.current.contains(event.target)) {
    //             setShow(false);
    //         }
    //     }
    //     // Bind the event listener
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         // Unbind the event listener on clean up
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, []);

    // useEffect(()=> {
    //     if(selected == 0) return; 
    //     
    //     props.onChange(selected);
    // }, [selected]);
    // useEffect(()=> {
    //     if(props.defaultValue * 1 > 0) {
    //         setTxtValue(props.defaultValue * 1);
    //         setSelected(props.defaultValue * 1);
    //     }
    // }, [props?.defaultValue]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    const getDateText = (txtVal) => {
        if (props.showMonth) {
            return `${txtVal} ${props.startDate && monthNames[props.startDate.split('-')[1] - 1]}`;
        } else {
            return txtVal;
        }
    }

    return (
        <>
            <input type="text" readOnly onClick={() => {
                setShow(true);
                // }} value={txtValue} onKeyDown={(event) => event.preventDefault()} autoComplete="off" className="number-picker-txt" />
            }} value={getDateText(txtValue)} onKeyDown={(event) => event.preventDefault()} autoComplete="off" className="number-picker-txt" />

            <Modal centered show={show} onHide={() => {
                setShow(false);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>SIP Instalment Date</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className={style['my-date-picker']}>
                        {/* <i onClick={()=> setShow(false)} className={`fa fa-times ${style['close-btn']}`} aria-hidden="true"></i> */}
                        <div className={style['date-text']}>

                            {selected > 0 && (<p>{getNumberWithOrdinal(selected)} of every month</p>)}
                            {selected === 0 && (<p>Select date below</p>)}
                        </div>
                        <div className={style['my-date-picker-inner']}>
                            {[...new Array(28).keys()].map((v) => ++v).map((v) => <div key={`number-picker-dates-${v}`} className={selected == v ? style['my-date-picker-active'] : ''} onClick={() => {
                                setSelected(v);
                                // setShow(false);
                            }}>{v}</div>)}
                        </div>
                        <div className="mt-4">
                            <button className={style['confirm-btn']} onClick={() => {
                                if (props.onChange != undefined) {
                                    props.onChange(selected);
                                }
                                setShow(false);
                                setTxtValue(selected);
                            }}>Confirm</button>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>

        </>
    );
}
export default NumberPicker;