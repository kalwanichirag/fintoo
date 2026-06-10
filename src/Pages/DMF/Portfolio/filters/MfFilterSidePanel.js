import React, { memo, useEffect, useState } from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import CloseFilter from "../../../../Assets/Images/close.png";
import FintooCheckbox from '../../../../components/FintooCheckbox/FintooCheckbox';
import _ from 'lodash';
import { getMfSummaryPortfolio } from '../../../../FrappeIntegration-Services/services/investment-api/investmentService';
import { getItemLocal, getParentUserId, getUserId, loginRedirectGuest } from '../../../../common_utilities';
import { DATA_BELONGS_TO } from '../../../../constants';
import { fetchUserProfileDetails } from '../../../../FrappeIntegration-Services/services/user-management-api/userApiService';

let subCategoriesObj = {
    equity: [],
    debt: [],
    hybrid: [],
    others: []
};

const defaultFilterOptions = {
    categoryOptions: [],
    amcNamesOptions: [],
};

function MfFilterSidePanel({
    isOpen,
    togglePanel,
    mainData,
    setMainData,
    mfListDataCopy,
    fetchFundsData,
    resetFilterTriggerState,
    setResetFilterTriggerState
}) {

    const [sidePanelWidth, setSidePanelWidth] = useState(25);

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

    const [filterOptions, setFilterOptions] = useState(defaultFilterOptions);

    const [subCategoriesState, setSubCategoriesState] = useState({
        equity: [],
        debt: [],
        hybrid: [],
        others: []
    });

    const buildSubCategoryMap = (list = []) => {
        const map = {
            equity: [],
            debt: [],
            hybrid: [],
            others: []
        };

        list.forEach((v) => {
            const type = v.fintoo_fund_type?.toLowerCase();
            const sub = v.amfitype;

            if (!type || !sub || !map[type]) return;

            if (!map[type].includes(sub)) {
                map[type].push(sub);
            }
        });

        return map;
    };

    const assignFilterOptions = () => {
        let categoryOptions = [];
        let amcNamesOptions = [];

        mfListDataCopy?.forEach((v) => {
            if (!categoryOptions.includes(v.fintoo_fund_type)) {
                categoryOptions.push(v.fintoo_fund_type);
            }

            if (!amcNamesOptions.includes(v.fund_house)) {
                amcNamesOptions.push(v.fund_house);
            }
        });

        const newMap = buildSubCategoryMap(mfListDataCopy);
        subCategoriesObj = newMap;
        setSubCategoriesState(newMap);

        setFilterOptions({ categoryOptions, amcNamesOptions });
    };

    useEffect(() => {
        subCategoriesObj = subCategoriesState;
    }, [subCategoriesState]);

    const sortOptions = [
        { label: 'Current Value', keyName: 'curr_val' },
        { label: 'Invested Amount', keyName: 'inv' },
        { label: 'Gain Percentage', keyName: 'xirr_percentage' },
        { label: 'Gain Value', keyName: 'gain_loss' }
    ];

    const handleSubCategoryChange = (subCat) => {
        setFilterState((prev) => ({
            ...prev,
            subCategories: prev.subCategories.includes(subCat)
                ? prev.subCategories.filter((x) => x !== subCat)
                : [...prev.subCategories, subCat]
        }));
    };

    const handleCategoryChange = (cat) => {
        setFilterState((prev) => ({
            ...prev,
            fundsCategory: prev.fundsCategory === cat ? null : cat,
            subCategories: []
        }));
    };

    const handleAmcNameChange = (v) => {
        setFilterState((prev) => {
            const exists = prev.amcNames.includes(v);
            return {
                ...prev,
                amcNames: exists
                    ? prev.amcNames.filter((x) => x !== v)
                    : [...prev.amcNames, v]
            };
        });
    };

    const familyArray = (typeOfArray) => {
        let new_array = [];
        var new_data = getItemLocal("member");

        switch (typeOfArray) {
            case "pan":
                new_data?.forEach((el) => el.pan && new_array.push(el.pan));
                break;
            case "user_id":
                new_data?.forEach((el) => el.id && new_array.push(el.id.toString()));
                break;
        }
        return new_array;
    };

    const resetFilter = async () => {
        try {
            let new_array = getItemLocal("family") ? familyArray("pan") : [];

            if (getParentUserId() == null) {
                loginRedirectGuest();
                return;
            }

            const userRes = await fetchUserProfileDetails(getUserId());

            const payload = {
                pan: getItemLocal("family") ? new_array : userRes.data.user_pan,
                amc_names: [],
                category: null,
                sub_category: [],
                sort_by: null,
                scheme_type: null,
                platform: null,
                data_belongs_to: DATA_BELONGS_TO
            };

            const res = await getMfSummaryPortfolio(payload);

            setMainData((prev) => ({
                ...prev,
                fund_list: res.data?.fund_list || [],
                portfolio_summary: res.data?.portfolio_summary || {},
            }));

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

            setResetFilterTriggerState({
                triggerReset: false,
                showResetTriggerUi: false,
                filtersActive: false,
            });

            togglePanel(false);

        } catch (e) {
            console.error("Reset API failed", e);
        }
    };

    const applyFilter = async () => {
        let new_array = getItemLocal("family") ? familyArray("pan") : [];

        if (getParentUserId() == null) {
            loginRedirectGuest();
            return;
        }

        const userRes = await fetchUserProfileDetails(getUserId());

        const payload = {
            pan: getItemLocal("family") ? new_array : userRes.data.user_pan,
            amc_names: filterState.amcNames,
            category: filterState.fundsCategory,
            sub_category: filterState.subCategories,
            sort_by: filterState.sort,
            scheme_type: filterState.type !== 'All' ? filterState.type : null,
            platform: filterState.platform !== 'All' ? filterState.platform : null,
            data_belongs_to: DATA_BELONGS_TO
        };

        try {
            const res = await getMfSummaryPortfolio(payload);

            const apiData = res.data?.fund_list || [];

            setMainData((prev) => ({
                ...prev,
                fund_list: apiData,
                portfolio_summary: res.data?.portfolio_summary || {},
            }));

            togglePanel(false);
            setResetFilterTriggerState((prev) => ({ ...prev, filtersActive: true }));

            if (apiData.length === 0) {
                setResetFilterTriggerState((prev) => ({ ...prev, showResetTriggerUi: true }));
            }

        } catch (error) {
            console.error("API Error:", error);
        }
    };

    useEffect(() => {
        assignFilterOptions();
    }, [mfListDataCopy]);

    useEffect(() => {
        function handleResize() {
            setSidePanelWidth(window.innerWidth < 768 ? 100 : 30);
        }

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (resetFilterTriggerState.triggerReset) {
            resetFilter();
        }
    }, [resetFilterTriggerState]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
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
                                        checked={filterState.platform == 'Internal'}
                                        title={'Fintoo'}
                                        onChange={() => filterState.platform == 'Internal' ? setFilterState({ ...filterState, platform: null }) : setFilterState({ ...filterState, platform: 'Internal' })}
                                    />
                                </li>
                                <li className="fltr-items-li fltr-items-li-w50">
                                    <FintooCheckbox
                                        checked={filterState.platform == 'External'}
                                        title={'Others'}
                                        onChange={() => filterState.platform == 'External' ? setFilterState({ ...filterState, platform: null }) : setFilterState({ ...filterState, platform: 'External' })}
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