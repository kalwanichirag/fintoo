import React, { useState } from "react";
import Styles from "./Networth.module.css";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import customStyles from "../../../../CustomStyles";
function formatToIndianRupee(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
}
const NetworthLeftSection = ({ toggleProjection, members }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        // You can perform additional actions here with the selected option
    };
    let CurrentNw = 20520647;
    let AssetNw = 720647;
    let LibNw = 1520647;
    const options = [
        { value: 'AllMembers', label: 'All Members' },
        { value: 'Father', label: 'Father' },
        { value: 'Mother', label: 'Mother' },
        { value: 'Son', label: 'Son' },
    ];

    return (
        <>
            <div className={`${Styles.dd}`}>
                <div className={`${Styles.selectBg}`}>
                    <div className="mb-0 mt-2" style={{fontWeight : 'bold'}}>
                        Select Family Member *
                    </div>
                    <Select
                        classNamePrefix="sortSelect"
                        isSearchable={true}
                        styles={customStyles}
                        options={members}
                        value={selectedOption}
                        onChange={handleSelectChange}
                    />
                </div>
                <div className={`d-md-flex justify-content-md-between d-grid ${Styles.CurrentNw}`}>
                    <div>
                        <div>
                            Current Networth
                        </div>
                        <div className={`${Styles.currnwamt}`}>
                            {formatToIndianRupee(CurrentNw)}
                        </div>
                    </div>
                    <div className={`${Styles.NwBtn}`}>
                        <button onClick={toggleProjection}>View Projection</button>
                    </div>
                </div>
                <div className={`d-md-flex justify-content-md-between d-grid ${Styles.CurrentNw}`}>
                    <div className={`${Styles.assetLibval}`}>
                        <div className="text-center">
                            Assets
                        </div>
                        <div className={`${Styles.amt}`}>
                            {formatToIndianRupee(AssetNw)}
                        </div>
                    </div>
                    <div className={`ms-md-5 mt-md-0 mt-3 ${Styles.assetLibval}`}>
                        <div className="text-center">
                            Liabilities
                        </div>
                        <div className={`${Styles.amt}`}>
                            {formatToIndianRupee(LibNw)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NetworthLeftSection;