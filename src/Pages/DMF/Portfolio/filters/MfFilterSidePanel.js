import React, { memo, useEffect, useState } from 'react';
import Form from "react-bootstrap/Form";
import SlidingPanel from 'react-sliding-side-panel';
import CloseFilter from "../../../../Assets/Images/close.png";
import FintooCheckbox from '../../../../components/FintooCheckbox/FintooCheckbox';
import axios from 'axios';
// import { flushSync } from 'react-dom';
import _ from 'lodash';

const subCategoriesObj = {
    equity: [
        // "Large-Cap",
        // "Mid-Cap",
        // "Sector - Healthcare",
        // "Sector - Technology",
        // "Sector - FMCG",
        // "Sector - Energy",
        // "Sector - Financial Services",
        // "Equity - Other",
        // "ELSS (Tax Savings)",
        // "Global - Other",
        // "Multi-Cap",
        // "Equity - Infrastructure",
        // "Small-Cap",
        // "Large & Mid-Cap",
        // "Value",
        // "Contra",
        // "Dividend Yield",
        // "Focused Fund",
        // "Index Funds",
        // "Equity–Consumption",
        // "Equity - ESG",
        // "Flexi Cap"
    ],
    debt: [
        // "Short Duration",
        // "Ultra Short Duration",
        // "10 yr Government Bond",
        // "Government Bond",
        // "Short-Term Government Bond",
        // "Liquid",
        // "Fixed Maturity Short-Term Bond",
        // "Fixed Maturity Ultrashort Bond",
        // "Medium to Long Duration",
        // "Long Duration",
        // "Fixed Maturity Intermediate-Term Bond",
        // "Credit Risk",
        // "Dynamic Bond",
        // "Low Duration",
        // "Money Market",
        // "Medium Duration",
        // "Corporate Bond",
        // "Banking & PSU",
        // "Floating Rate",
        // "Overnight",
        // "Index - Fixed Income"
    ],
    hybrid: [
        // "Balanced Allocation",
        // "Conservative Allocation",
        // "Arbitrage Fund",
        // "Aggressive Allocation",
        // "Dynamic Asset Allocation",
        // "Multi Asset Allocation",
        // "Equity Savings",
        // "Fund of Funds"
    ],
    others: [
        // "Sector - Precious Metals",
        // "Retirement",
        // "Children"
    ]
}

const defaultFilterOptions = {
    categoryOptions: [],
    amcNamesOptions: [],
}

function MfFilterSidePanel({ isOpen, togglePanel, mainData, setMainData, mfListDataCopy, fetchFundsData, resetFilterTriggerState, setResetFilterTriggerState }) {

    const [sidePanelWidth, setSidePanelWidth] = useState(25);
    // const [amcList, setAmcList] = useState([]);

    const [filterState, setFilterState] = useState({
        amcFilter: false,
        amcNames: [],
        fundsCategory: null,
        sort: null,
        category: null,
        type: 'All',
        platform: 'All',
        subCategories: []
    });

    const [filterOptions, setFilterOptions] = useState(defaultFilterOptions)

    const assignSubCategoriesObj = (data) => {
        const fundType = data.fintoo_fund_type.toLowerCase()
        if (fundType === 'debt') {
        }
        if (subCategoriesObj[fundType]) {
            if (data.amfitype) {
                if (!subCategoriesObj[fundType].includes(data.amfitype)) {
                    subCategoriesObj[fundType] = [...subCategoriesObj[fundType], data.amfitype]
                }
            }
        }
    }

    const assignFilterOptions = () => {
        let categoryOptions = [];
        let amcNamesOptions = [];

        mfListDataCopy ? mfListDataCopy.forEach((v) => {
            if (categoryOptions.findIndex((x) => x == v.fintoo_fund_type) == -1) {
                categoryOptions.push(v.fintoo_fund_type);
            }
            if (!amcNamesOptions.includes(v.fund_house)) {
                amcNamesOptions.push(v.fund_house)
            }
            assignSubCategoriesObj(v)
        }) : [];
        setFilterOptions({ categoryOptions, amcNamesOptions });
    }

    const sortOptions = [{ label: 'Current Value', keyName: 'curr_val' }, { label: 'Invested Amount', keyName: 'inv' }, { label: 'Gain Percentage', keyName: 'xirr_percentage' }, { label: 'Gain Value', keyName: 'gain_loss' }]
    const categoryOptions = ['Equity', 'Debt', 'Hybrid', 'Solution Oriented', 'Others']

    const handleSubCategoryChange = (subCat) => {
        if (!filterState.subCategories.includes(subCat)) {
            setFilterState(prev => ({ ...prev, subCategories: [...prev.subCategories, subCat] }))
        } else {
            const arr = [...filterState.subCategories]
            const index = filterState.subCategories.indexOf(subCat)
            arr.splice(index, 1)
            setFilterState(prev => ({ ...prev, subCategories: arr }))
        }
    }

    const handleCategoryChange = (cat) => {
        // if (cat !== filterState.fundsCategory && filterState.fundsCategory !== null) {
        //     setFilterState({ ...filterState, subCategories: [] })
        // }
        if (filterState.fundsCategory === cat) {
            setFilterState({ ...filterState, fundsCategory: null })
        } else {
            setFilterState({ ...filterState, fundsCategory: cat });
        }

        setFilterState(prev => ({ ...prev, subCategories: [] }))
    }

    const handleAmcNameChange = (v) => {
        let amcName = filterState.amcNames;
        if (amcName.findIndex((x) => x == v) > -1) {
            amcName.splice(amcName.findIndex((x) => x == v), 1);
        } else {
            amcName.push(v);
        }
        setFilterState({ ...filterState, amcNames: amcName });
    };

    const getAmcList = async () => {
        // var config = {
        //     method: "post",
        //     url: DMF_GET_AMC_LIST,
        //     data: "{}",
        // };
        // var res = await axios(config);
        // setAmcList(res.data);
    };

    const resetFilter = () => {
        setFilterState({
            amcFilter: false,
            amcNames: [],
            fundsCategory: null,
            sort: null,
            category: null,
            type: 'All',
            platform: 'All',
            subCategories: []
        });
        setMainData((prev) => ({
            ...prev,
            fund_list: [...mfListDataCopy],
            fund_details: [...mfListDataCopy],
        }));
        setResetFilterTriggerState(() => ({
            triggerReset: false,
            showResetTriggerUi: false,
            filtersActive: false,
        }));
        togglePanel(false);
    };

    const applyFilter = () => {

        let filteredData = [...mfListDataCopy]
        if (filterState.amcNames.length > 0) {
            filteredData = filteredData.filter((v) =>
                filterState.amcNames.includes(v.fund_house)
            );
        }

        if (filterState.fundsCategory) {
            filteredData = filteredData.filter(
                (v) => {
                    if (filterState.subCategories.length <= 0) {
                        return v.fintoo_fund_type.toLowerCase() == filterState.fundsCategory.toLowerCase()
                    } else {
                        return (v.fintoo_fund_type.toLowerCase() == filterState.fundsCategory.toLowerCase()) && filterState.subCategories.includes(v.amfitype)
                    }

                }

            );
        }

        if (filterState.sort) {
            switch (filterState.sort) {
                case "curr_val":
                    filteredData = filteredData.sort((a, b) => b.curr_val - a.curr_val);
                    break;
                case "inv":
                    filteredData = filteredData.sort((a, b) => b.inv - a.inv);
                    break;
                case "xirr_percentage":
                    filteredData = filteredData.sort((a, b) => b.xirr_percentage - a.xirr_percentage);
                    break;
                case "gain_loss":
                    filteredData = filteredData.sort((a, b) => b.gain_loss - a.gain_loss);
                    break;
                default:
                    break;
            }
        }

        if (filterState.type) {

            if (filterState.type.toLowerCase() !== 'all') {
                filteredData = filteredData.filter(
                    (v) => v.scheme_type === filterState.type.toLowerCase()
                );
            }

        }

        if (filterState.platform) {
            if (filterState.platform !== 'All') {
                filteredData = filteredData.filter(
                    (v) => filterState.platform === 'Fintoo' ? v.fund_registrar !== 'ecas' : v.fund_registrar === 'ecas'
                );
            }
        }
        setMainData((prev) => ({
            ...prev,
            fund_list: [...filteredData],
            fund_details: [...filteredData],
        }));
        togglePanel(false);
        setResetFilterTriggerState((prev) => ({ ...prev, filtersActive: true }));
        if (filteredData.length == 0 && mfListDataCopy.length > 0) {
            setResetFilterTriggerState((prev) => ({ ...prev, showResetTriggerUi: true }));
        }

    }

    useEffect(() => {
        assignFilterOptions()
    }, [mfListDataCopy])

    useEffect(() => {
        // getAmcList();
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
            className="Filter_Panel"
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
                        <h4>Funds Category</h4>
                        <div className="Category_Filter">
                            <ul className="fltr-items">
                                <li className="fltr-items-li fltr-items-li-w50" >
                                    <FintooCheckbox
                                        checked={filterState.fundsCategory == 'Equity'}
                                        title={'Equity'}
                                        onChange={() => handleCategoryChange('Equity')}
                                    />
                                </li>
                                <li className="fltr-items-li fltr-items-li-w50" >
                                    <FintooCheckbox
                                        checked={filterState.fundsCategory == 'Debt'}
                                        title={'Debt'}
                                        onChange={() => handleCategoryChange('Debt')} />
                                </li>
                                <li className="fltr-items-li fltr-items-li-w50" >
                                    <FintooCheckbox
                                        checked={filterState.fundsCategory == 'Hybrid'}
                                        title={'Hybrid'}
                                        onChange={() => handleCategoryChange('Hybrid')} />
                                </li>
                                <li className="fltr-items-li fltr-items-li-w50" >
                                    <FintooCheckbox
                                        checked={filterState.fundsCategory == 'Others'}
                                        title={'Others'}
                                        onChange={() => handleCategoryChange('Others')} />
                                </li>
                            </ul>
                        </div>
                    </div>

                    {
                        filterState.fundsCategory && subCategoriesObj[filterState.fundsCategory.toLowerCase()].length > 0 && <div className="fltr-section">
                            <div>
                                <h4>Subcategory Filter</h4> <div className="Category_Filter">
                                    <ul className="fltr-items">
                                        {
                                            subCategoriesObj[filterState.fundsCategory.toLowerCase()].map((subCat) => <li key={subCat} className="fltr-items-li fltr-items-li-w100" >
                                                <FintooCheckbox
                                                    checked={filterState.subCategories.includes(subCat)}
                                                    title={subCat}
                                                    // onChange={() => !filterState.subCategories.includes(subCat) ? setFilterState(prev => ({ ...prev, subCategories: [...prev.subCategories, subCat] })) : setFilterState(prev => ({ ...prev, subCategories: prev.subCategories.splice(prev.subCategories.indexOf(subCat), 1) }))}
                                                    onChange={() => handleSubCategoryChange(subCat)}
                                                />
                                            </li>)
                                        }
                                    </ul>
                                </div></div>

                        </div>
                    }


                    <div style={{ marginTop: "1rem" }} className="Line"></div>
                    <div className="fltr-section" style={{ paddingTop: '0' }}>
                        <h4>Fund House</h4>
                        <div className="Category_Filter">
                            <ul className="fltr-items">
                                {filterOptions.amcNamesOptions.map((v) => (
                                    <li className="fltr-items-li-amc">
                                        <FintooCheckbox
                                            checked={filterState.amcNames.includes(v)}
                                            title={v}
                                            onChange={() => handleAmcNameChange(v)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="fltr-section">
                        <h4>Type</h4>
                        <div className="Category_Filter">
                            <ul className="fltr-items">
                                <li className="fltr-items-li fltr-items-li-w50">
                                    <FintooCheckbox
                                        checked={filterState.type == 'All'}
                                        title={'All'}
                                        onChange={() => filterState.type == 'All' ? setFilterState({ ...filterState, type: null }) : setFilterState({ ...filterState, type: 'All' })}
                                    />
                                </li>
                                <li className="fltr-items-li fltr-items-li-w50">
                                    <FintooCheckbox
                                        checked={filterState.type == 'Regular'}
                                        title={'Regular'}
                                        onChange={() => filterState.type == 'Regular' ? setFilterState({ ...filterState, type: null }) : setFilterState({ ...filterState, type: 'Regular' })}
                                    />
                                </li>
                                <li className="fltr-items-li fltr-items-li-w50">
                                    <FintooCheckbox
                                        checked={filterState.type == 'Direct'}
                                        title={'Direct'}
                                        onChange={() => filterState.type == 'Direct' ? setFilterState({ ...filterState, type: null }) : setFilterState({ ...filterState, type: 'Direct' })}
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="fltr-section">
                        <h4>Investment Platform</h4>
                        <div className="Category_Filter">
                            <ul className="fltr-items">

                                <li className="fltr-items-li fltr-items-li-w50">
                                    <FintooCheckbox
                                        checked={filterState.platform == 'All'}
                                        title={'All'}
                                        onChange={() => filterState.platform == 'All' ? setFilterState({ ...filterState, platform: null }) : setFilterState({ ...filterState, platform: 'All' })}
                                    />
                                </li>
                                <li className="fltr-items-li fltr-items-li-w50">
                                    <FintooCheckbox
                                        checked={filterState.platform == 'Fintoo'}
                                        title={'Fintoo'}
                                        onChange={() => filterState.platform == 'Fintoo' ? setFilterState({ ...filterState, platform: null }) : setFilterState({ ...filterState, platform: 'Fintoo' })}
                                    />
                                </li>
                                <li className="fltr-items-li fltr-items-li-w50">
                                    <FintooCheckbox
                                        checked={filterState.platform == 'Others'}
                                        title={'Others'}
                                        onChange={() => filterState.platform == 'Others' ? setFilterState({ ...filterState, platform: null }) : setFilterState({ ...filterState, platform: 'Others' })}
                                    />
                                </li>
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

export default memo(MfFilterSidePanel);