import React from 'react';
import ReactDOM from 'react-dom/client';

import 'react-calendar/dist/Calendar.css';
import "react-datepicker/dist/react-datepicker.css";
import 'sweetalert/dist/sweetalert.css'
import 'bootstrap/dist/css/bootstrap.min.css';


// import './style.css';
// import './custom.css';
import './dashboard.css';
// import './main.css';
import './mainData.css';
import './payment.css';

import App from './App';

import { initWebEngage } from "./Utils/Webengage/webengage";

initWebEngage();

const root = ReactDOM.createRoot(document.getElementById('root'));

// function DisplayFooter()
// {
//     console.log("window", window.location.pathname);
// }

root.render(
    <App />
    // <DisplayFooter />
);


