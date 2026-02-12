
import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import style from './style.module.css'
import { HiOutlineInformationCircle } from 'react-icons/hi';

const getIcons = (variant) => {
    switch (variant) {
        case 'error':
            return <HiOutlineInformationCircle size={20} />
        default:
            return <HiOutlineInformationCircle size={20} />
    }
}

function AlertComponent({ variant, message, timeout, closeError }) {

    useEffect(() => {
        if (message != '') {
            setTimeout(() => {
                closeError();
            }, timeout)
        }

    }, [message])

    return (

        <>
            {
                (message === '') ? <></> : <div style={{ marginTop: '1rem', width: 'fit-content' }}>
                    <Alert className={style[variant]}>
                        {getIcons(variant)}
                        <span className={style['apertTxt']}>{message}</span>
                    </Alert>
                </div>
            }
        </>


    );
}

export default AlertComponent;
