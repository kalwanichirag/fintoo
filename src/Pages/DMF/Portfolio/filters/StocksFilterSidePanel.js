import React, { memo, useEffect, useState } from 'react';
import Form from "react-bootstrap/Form";
import SlidingPanel from 'react-sliding-side-panel';
import CloseFilter from "../../../../Assets/Images/close.png";
import FintooCheckbox from '../../../../components/FintooCheckbox/FintooCheckbox';
import FintooSubCheckbox from "../../../../components/FintooCheckbox/FintooSubCheckbox";
import axios from 'axios';
// import { flushSync } from 'react-dom';
import _ from 'lodash';

const brokersList = [
    "Growww",
    "ShareKhan LTD",
    "Angel Broking"
]

function StocksFilterSidePanelz({ isOpen, togglePanel, mainData, setMainData, stockListDataCopy, fetchFundsData, resetFilterTriggerState, setResetFilterTriggerState }) {

    const [sidePanelWidth, setSidePanelWidth] = useState(25);
    const [sectorList, setSectorList] = useState([]);
    const [brokerList, setBrokerList] = useState([]);
    // const [amcList, setAmcList] = useState([]);

    const [filterState, setFilterState] = useState({
        sort: null,
        sectors: [],
        industries: [],
        brokers: [],
        type: null
    });

    const sortOptions = [{ label: 'Current Value', keyName: 'cr_val' }]

    const handleFilterListChange = (value, key) => {
        let filterVal = filterState[key];
        let updatedIndustriesArr = filterState['industries'];

        if (filterVal.includes(value)) {

            if (key === 'sectors') {
                filterVal.splice(filterVal.findIndex((x) => x == value), 1);
                updatedIndustriesArr = filterState.industries.filter(item => !getIndustriesData(value).includes(item))
            } else {
                filterVal.splice(filterVal.findIndex((x) => x == value), 1);
            }
        } else {
            filterVal.push(value);
        }

        if (key === 'sectors') {
            setFilterState((prev) => ({ ...prev, sectors: filterVal, industries: updatedIndustriesArr }));
        } else {
            setFilterState((prev) => ({ ...prev, [key]: filterVal }));
        }
    };

    const resetFilter = () => {
        setFilterState({
            sort: null,
            sectors: [],
            industries: [],
            brokers: [],
            type: null
        });
        setMainData((prev) => ({ ...prev, equity_shares: { ...prev.equity_shares, stocks_details: [...stockListDataCopy] } }))
        setResetFilterTriggerState(() => ({ triggerReset: false, showResetTriggerUi: false, filtersActive: false }));
        togglePanel(false);
    };

    const getIndustriesData = (sector) => {
        let indeustriesArr = []

        stockListDataCopy ? stockListDataCopy.forEach((v) => {
            if (v.sector_name === sector && !indeustriesArr.includes(v.industry_name)) {
                indeustriesArr.push(v.industry_name)
            }
        }) : [];

        return indeustriesArr
    }

    const applyFilter = () => {

        let filteredData = [...stockListDataCopy]

        if (filterState.sectors.length > 0) {
            filteredData = filteredData.filter((v) =>
                filterState.sectors.includes(v.sector_name)
            );
        }

        if (filterState.industries.length > 0) {
            filteredData = filteredData.filter((v) => {
                // if(getIndustriesData(v.sector_name).includes(v.industry_name)){
                if (getIndustriesData(v.sector_name).every(item => !filterState.industries.includes(item))) {
                    return true
                } else {
                    return filterState.industries.includes(v.industry_name)
                }
            }
            );
        }

        if (filterState.brokers.length > 0) {
            filteredData = filteredData.filter((v) =>
                filterState.brokers.includes(v.broker_name)
            );
        }

        if (filterState.sort) {
            switch (filterState.sort) {
                case "cr_val":
                    filteredData = filteredData.sort((a, b) => b.cr_val - a.cr_val);
                    break;
                case "inv_val":
                    filteredData = filteredData.sort((a, b) => b.inv_val - a.inv_val);
                    break;
                case "today_rtn":
                    filteredData = filteredData.sort((a, b) => b.today_rtn - a.today_rtn);
                    break;
                case "gain_val":
                    filteredData = filteredData.sort((a, b) => b.gain_val - a.gain_val);
                    break;
                default:
                    break;
            }
        }

        setMainData((prev) => ({ ...prev, equity_shares: { ...prev.equity_shares, stocks_details: [...filteredData] } }))
        togglePanel(false);
        setResetFilterTriggerState((prev) => ({ ...prev, filtersActive: true }));
        if (filteredData.length == 0 && stockListDataCopy.length > 0) {
            setResetFilterTriggerState((prev) => ({ ...prev, showResetTriggerUi: true }));
        }

    }

    useEffect(() => {
        // Extract unique sectors from stockListDataCopy
        const extractUniqueSectors = () => {
            if (!stockListDataCopy || !Array.isArray(stockListDataCopy)) {
                return [];
            }
            
            const sectors = stockListDataCopy.map(stock => stock.sector_name).filter(Boolean);
            const uniqueSectors = [...new Set(sectors)];
            return uniqueSectors;
        };

        // Extract unique brokers from stockListDataCopy
        const extractUniqueBrokers = () => {
            if (!stockListDataCopy || !Array.isArray(stockListDataCopy)) {
                return [];
            }
            
            const brokers = stockListDataCopy.map(stock => stock.broker_name).filter(Boolean);
            const uniqueBrokers = [...new Set(brokers)];
            return uniqueBrokers;
        };

        setSectorList(extractUniqueSectors());
        setBrokerList(extractUniqueBrokers());
    }, [stockListDataCopy])

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

    useEffect(() => {
        if (resetFilterTriggerState.triggerReset) {
            resetFilter();
            setResetFilterTriggerState(() => ({ triggerReset: false, showResetTriggerUi: false, filtersActive: false }));
        }
    }, [resetFilterTriggerState])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            window.scrollTo(0, 0)
        }
        return () => document.body.style.overflow = 'unset';
    }, [isOpen]);

    return (

        <SlidingPanel
            className="Filter_Panel stock-styling"
            type={"right"}
            isOpen={isOpen}
            size={sidePanelWidth}
            backdropClicked={() => togglePanel(false)}
        >
            <div id="FilterData" className="d-flex flex-column">
                <div className="ps-3 pe-3 pt-3">
                    <div className="SideBar_Filter">
                        <div className="filter_text">Sort</div>
                        <div>
                            <button type="button" onClick={() => togglePanel(false)}>
                                <img src={CloseFilter} alt="" srcset="" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-3" style={{ flexGrow: "1", overflow: "auto" }}>
                    <div className="fltr-section" style={{ borderBottom: 'none', paddingTop: '0', paddingBottom: '0' }}>
                        <div className="Category_Filter">
                            <ul className="fltr-items">
                                {sortOptions.map((v) => (
                                    <li className="fltr-items-li fltr-items-li-w50">
                                        <FintooCheckbox
                                            checked={filterState.sort == v.keyName}
                                            title={v.label}
                                            onChange={() => filterState.sort == v.keyName ? setFilterState({ ...filterState, sort: null }) : setFilterState({ ...filterState, sort: v.keyName })}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="pt-3">
                        <div className="SideBar_Filter">
                            <div className="filter_text">Filters</div>
                        </div>
                    </div>
                    <div className="fltr-section">
                        <h4>Sector</h4>
                        <div className="Category_Filter">
                            <ul className="fltr-items">
                                {
                                    sectorList.map((sector, index) => <li key={`sector-${index}-${sector}`} className="fltr-items-li fltr-items-li-w100" >
                                        <FintooCheckbox
                                            checked={filterState.sectors.includes(sector)}
                                            title={sector}
                                            onChange={() => handleFilterListChange(sector, 'sectors')}
                                        />
                                        {
                                            filterState.sectors.includes(sector) && (<div className="FilterData">
                                                <div style={{ paddingLeft: '2rem' }}>
                                                    {
                                                        getIndustriesData(sector).map((data, industryIndex) => <FintooSubCheckbox
                                                            key={`industry-${industryIndex}-${data}`}
                                                            checked={filterState.industries.includes(data)}
                                                            title={data}
                                                            onChange={() => handleFilterListChange(data, 'industries')}
                                                        />)
                                                    }
                                                </div>
                                            </div>)
                                        }

                                    </li>)
                                }

                            </ul>
                        </div>
                    </div>
                    <div className="fltr-section">
                        <h4>Broker</h4>
                        <div className="Category_Filter">
                            <ul className="fltr-items">
                                {
                                    brokerList.map((broker, index) => <li key={`broker-${index}-${broker}`} className="fltr-items-li fltr-items-li-w100" >
                                        <FintooCheckbox
                                            checked={filterState.brokers.includes(broker)}
                                            title={broker}
                                            onChange={() => handleFilterListChange(broker, 'brokers')}
                                        />
                                    </li>)
                                }

                            </ul>
                        </div>
                    </div>
                </div>
                <div className="p-3 Filter_Btn_panel">
                    <div>
                        <button onClick={() => applyFilter()}>Apply</button>
                    </div>
                    <div
                        style={{ paddingLeft: "5%" }}
                        className="Filter_Btn_panel"
                    >
                        <button
                            className="Reset"
                            type="button"
                            onClick={() => resetFilter()}
                        >
                            Reset All
                        </button>
                    </div>
                </div>
            </div>
        </SlidingPanel>
    );
}

export default memo(StocksFilterSidePanelz);