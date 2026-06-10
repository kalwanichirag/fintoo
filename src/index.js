import React from 'react';
import ReactDOM from 'react-dom/client';

import 'react-calendar/dist/Calendar.css';
import "react-datepicker/dist/react-datepicker.css";
import 'sweetalert/dist/sweetalert.css'
import 'bootstrap/dist/css/bootstrap.min.css';


import App from './App';

import { initWebEngage } from "./Utils/Webengage/webengage";

const startWebEngage = () => {
    if ("requestIdleCallback" in window) {
        requestIdleCallback(() => initWebEngage(), { timeout: 2500 });
    } else {
        setTimeout(() => initWebEngage(), 1500);
    }
};

if (document.readyState === "complete") {
    startWebEngage();
} else {
    window.addEventListener("load", startWebEngage, { once: true });
}

const root = ReactDOM.createRoot(document.getElementById('root'));

// function DisplayFooter()
// {
//     console.log("window", window.location.pathname);
// }

root.render(
    <App />
    // <DisplayFooter />
);
