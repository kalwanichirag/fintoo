import React, { memo, useEffect, useState } from 'react';
// import style from './style.module.css';
import style from '../../moneymanagement.module.css';
import _ from 'lodash';
import SlidingPanel from 'react-sliding-side-panel';
import FintooCheckbox from '../../../../components/FintooCheckbox/FintooCheckbox';
import CloseFilter from "../../../../Assets/Images/close.png";
import axios from 'axios';
import MonthPicker from '../../components/MonthPicker';
import { useSelector } from 'react-redux';
import { findSmallestDate } from '../../utils/DateUtils';

function MapTransactionFilterPanel({ isOpen, activeBank, togglePanel, transactionOptions, entryType,filterStateData, setFilterStateData, applyDateAndCategoryFilter }) {

    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const [sidePanelWidth, setSidePanelWidth] = useState(25);

    const [filterState, setFilterState] = useState({
        TransactionMonth: null,
        // categories: [],
        inflowCategories: [],
        outflowCategories: [],
        startDate: new Date(),
        endDate: new Date(),
        minDate: new Date()
    });

    const linkedAccountData = useSelector((state) => state.linkedAccountData);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) {
                setSidePanelWidth(100);
            } else {
                setSidePanelWidth(30);
            }
        }

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const applyFilter = () => {
        togglePanel(false);
        setFilterStateData(prev => ({
            ...prev,
            inflowCategories: filterState.inflowCategories, outflowCategories: filterState.outflowCategories, TransactionMonth: filterState.startDate, startDate: filterState.startDate, endDate: filterState.endDate
        }));
        setIsPickerOpen(false);
        applyDateAndCategoryFilter([...filterState.inflowCategories, ...filterState.outflowCategories], filterState.startDate, filterState.endDate)
    };

    const resetFilter = () => {
        setFilterState(prev => ({
            ...prev,
            TransactionMonth: new Date(),
            inflowCategories: [],
            outflowCategories: [],
            startDate: new Date(),
            endDate: new Date()
        }));
        togglePanel(false);
        setFilterStateData(prev => ({
            ...prev,
            inflowCategories: [], outflowCategories: [], TransactionMonth: null, startDate: null, endDate: null
        }))
        setIsPickerOpen(false)
        applyDateAndCategoryFilter([], null, null)
    };

    const categories = entryType == 'CREDIT' ? (transactionOptions.income_cat ?? {}) : (transactionOptions.expense_cat ?? {});

    const handleCategoryChange = (categoryKey) => {
        // let catName = [...filterState.categories];
        let inFlowCatName = [...filterState.inflowCategories];
        let outFlowCatName = [...filterState.outflowCategories];

        if (filterStateData.entryType === 'CREDIT') {
            if (inFlowCatName.findIndex((x) => x == categoryKey) > -1) {
                inFlowCatName.splice(inFlowCatName.findIndex((x) => x == categoryKey), 1);
            } else {
                inFlowCatName.push(categoryKey);
            }
        } else {
            if (outFlowCatName.findIndex((x) => x == categoryKey) > -1) {
                outFlowCatName.splice(outFlowCatName.findIndex((x) => x == categoryKey), 1);
            } else {
                outFlowCatName.push(categoryKey);
            }
        }
        setFilterState({
            ...filterState,
            // categories: catName, 
            inflowCategories: inFlowCatName, outflowCategories: outFlowCatName
        });
    };

    const handleDateChange = (date) => {
        if (date[1] === undefined) return;
        setFilterState({
            ...filterState, TransactionMonth: date[0],
            startDate: date[0],
            endDate: date[1]
        });
    };

    useEffect(() => {
        if (!isOpen) {
            setFilterState(prev => ({
                ...prev,
                TransactionMonth: null,
                // categories: [],
                inflowCategories: [],
                outflowCategories: [],
                startDate: new Date(),
                endDate: new Date()
            }))
            setIsPickerOpen(false);
        } else {
            setFilterState(prev => ({
                ...prev,
                // categories: filterStateData.categories,
                inflowCategories: filterStateData.inflowCategories,
                outflowCategories: filterStateData.outflowCategories,
                TransactionMonth: filterStateData.TransactionMonth,
                startDate: filterStateData.startDate,
                endDate: filterStateData.endDate
            }))
        }
    }, [isOpen])

    const getsmallesrDate = () => {
        const dateArr = linkedAccountData.filter(data => data.mm_account_masked_id === activeBank).map(data => data.mm_daterange_from);
        const minDate = findSmallestDate(dateArr);
        return minDate;
    }

    const handleAccountChange = () => {
        const smallestDate = new Date(getsmallesrDate())
        setFilterState(prev => ({ ...prev, minDate: smallestDate }))
    }

    useEffect(() => { handleAccountChange() }, [activeBank])

    return (

        <SlidingPanel
            className="Filter_Panel"
            type={"right"}
            isOpen={isOpen}
            size={sidePanelWidth}
            backdropClicked={() =>
                togglePanel(false)
            }
        >
            <div id="FilterData" className="d-flex flex-column">
                <div className="ps-3 pe-3 pt-3">
                    <div className="SideBar_Filter">
                        <div className="filter_text">Filters</div>
                        <div>
                            <button type="button" onClick={() =>
                                togglePanel(false)
                            }>
                                <img src={CloseFilter} alt="" srcset="" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-3" style={{ flexGrow: "1", overflow: "auto" }}>
                    <div className="fltr-section">
                        <h4>Transaction Month</h4>
                        <MonthPicker
                            onInputClick={() => setIsPickerOpen(true)}
                            dateFormat="MM/yyyy"
                            minDate={filterState.minDate}
                            maxDate={new Date()}
                            selected={filterState.startDate}
                            showMonthYearPicker
                            onChange={(date) => {
                                handleDateChange(date)
                                if (date[1]) {
                                    setIsPickerOpen(false);
                                }
                            }}
                            selectsRange
                            startDate={filterState.startDate}
                            endDate={filterState.endDate}
                            open={isPickerOpen}
                        />
                    </div>

                    <div className="fltr-section">
                        <h4>Category</h4>
                        <div className="Category_Filter" >
                            <ul className="fltr-items" style={{ maxHeight: '100%' }}>
                                {Object.entries(categories).map(([categoryKey, categoryValue]) => (
                                    <li key={categoryKey} className="fltr-items-li fltr-items-li-w100">
                                        <FintooCheckbox
                                            checked={filterStateData.entryType === 'CREDIT' ? filterState.inflowCategories.includes(categoryKey) : filterState.outflowCategories.includes(categoryKey)}
                                            title={categoryValue}
                                            onChange={() => handleCategoryChange(categoryKey)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
                <div className="p-3 Filter_Btn_panel">
                    <div>
                        <button
                            onClick={applyFilter}
                        >Apply</button>
                    </div>
                    <div
                        style={{ paddingLeft: "5%" }}
                        className="Filter_Btn_panel"
                    >
                        <button
                            className="Reset"
                            type="button"
                            onClick={resetFilter}
                        >
                            Reset All
                        </button>
                    </div>
                </div>
            </div>
        </SlidingPanel>
    );
}

export default memo(MapTransactionFilterPanel);