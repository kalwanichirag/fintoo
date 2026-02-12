import React from "react";
import Styles from "../../report.module.css";

function CategoryReportInfo(props) {

    return (
        <div className={`${Styles.categoryReportInfoContainer}`}>
            {props.children}
        </div>
    );
}

export default CategoryReportInfo;
