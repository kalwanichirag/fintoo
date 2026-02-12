import styles from './style.module.css'
import taxToolSvg from './assets/images/TaxTools.svg'
import { memo, useState } from 'react'

const radioDetailsList = [
    {
        value: 'All',
        text: 'All'
    }, {
        value: 'Individual_HUF',
        text: 'Individual/HUF'
    }
    , {
        value: 'Firm_LLP',
        text: 'Firm/LLP'
    }
    , {
        value: 'Company',
        text: 'Company'
    }
    , {
        value: 'Non_Residents',
        text: 'Non Residents'
    },
     {
        value: 'Trust_Societies',
        text: 'Trust/Societies'
    }, {
        value: 'Tax_Deductor',
        text: 'Tax Deductor'
    }
]

const SearchAndFilter = ({ filterTaxCalcData }) => {

    const [radioState, setRadioState] = useState('All')
    const [searchStr, setSearchStr] = useState('')

    return (
        <>
            <div className={`${styles['search-filter-container']}`}>
                <div className={`${styles['heading-container']}`}>
                    <img src={taxToolSvg} alt="" style={{ width: '40px' }} />
                    <div className={`${styles['heading-text']}`}>Tax Tools</div>
                </div>
                <input className={`${styles['search-input']}`} placeholder='Search Tax Tool' type="text" value={searchStr} onChange={(e) => { setSearchStr(() => e.target.value); filterTaxCalcData(e.target.value, radioState) }} />
            </div>
            <div className={styles.HrSeperator}></div>
            <div className={`${styles['filter-container']}`}>
                {
                    radioDetailsList.map((radioData, index) => <div key={index} className={`${styles['radio-container']}`}>
                        <input type="radio" value={radioData.value} checked={radioState === radioData.value} onChange={(e) => { setRadioState(e.target.value); filterTaxCalcData(searchStr, e.target.value) }} /><label htmlFor="">{radioData.text}</label>
                    </div>)
                }
            </div>
        </>
    );
}
export default memo(SearchAndFilter);