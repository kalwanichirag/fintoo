import { useCallback, useState } from "react";
import Fullpage from "../../Layout/Fullpage";
import CalcDisplay from "./CalcDisplay";
import SearchAndFilter from "./SearchAndFilter";
import styles from './style.module.css'

const taxCalculatorsData = [
    {
        index: '0',
        heading: 'Medical Facility',
        info: ' This calculator enables valuation of perquisite for medical facility provided to an employee by his employer in India or outside India',
        type: ['Individual_HUF', 'Non_Residents', 'Tax_Deductor'],
        redirectUrl: '/tax-calculator/medical-facility/'
    },
    {
        index: '1',
        heading: 'Rent Free Accommodation',
        info: '​This calculator enables calculation of taxable value of perquisites in case the employer provided rent free accomodation to its employees',
        type: ['Individual_HUF', 'Non_Residents', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/rent-free-accomodation/'
    },
    {
        index: '2',
        heading: 'Transport Allowance Calculator',
        info: '​This calculator enables calculation of taxable and exempt portion of Transport allowance given to an employee by his employer ',
        type: ['Individual_HUF', 'Non_Residents', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/transport-allowance/'
    },
    {
        index: '3',
        heading: 'Children education and hostel allowance',
        info: ' ​This calculator enables calculation of taxable and exempt portion of Children Education and Hostel Allowance given to an employee by his employer ',
        type: ['Individual_HUF', 'Non_Residents', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/children-educatoin-and-hostel-allowance/'
    }
    , {
        index: '4',
        heading: 'House rent allowance calculator',
        info: '​​House rent allowance received by an employee is taxable. However exemption is available under section 10(13A). This calculator enables calculation of taxable and exempt portion of HRA',
        type: ['Individual_HUF', 'Non_Residents', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/house-rent-allowance/'
    }
    , {
        index: '5',
        heading: 'Income and Tax calculator',
        info: 'This calculator allows to calculate the Total Income and Tax thereon alongwith interest under section 234 A/B/C',
        type: ['Individual_HUF', 'Non_Residents'],
        redirectUrl: 'tax-calculator/income-and-tax-calculator/'
    }
    , {
        index: '8',
        heading: 'Advance Tax Calculator',
        info: 'This calculator enables estimation of advance tax installments on the basis of taxable income of a tax payer​',
        type: ['Individual_HUF', 'Firm_LLP', 'Company', 'Non_Residents', 'Trust_Societies'],
        redirectUrl: 'tax-calculator/advance-tax-calculator/'
    }
    , {
        index: '9',
        heading: 'Concessional or interest free loan',
        info: 'Employees taking interest free loan or at concessional rates from the employer are taxable on the perquisite value of such benefits. The taxable perquisite is computed at rate of interest charged by SBI for similar loan.​​',
        type: ['Individual_HUF', 'Non_Residents', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/concessional-or-interest-free-loan/'
    }
    , {
        index: '10',
        heading: 'Indexed Cost of acquisition or improvement',
        info: 'Capital gains from sale of a long-term capital asset is calculated after reducing the indexed cost of acquisition/improvement from the sales consideration. Indexed cost is calculated after adjusting impact of inflation on the cost of acquisition.  ​',
        type: ['Individual_HUF', 'Firm_LLP', 'Company', 'Non_Residents', 'Trust_Societies', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/indexed-cost-of-acquisition-or-improvement/'
    },
    {
        index: '11',
        heading: 'Taxability of Agent Commission',
        info: 'Agents earning commission up to Rs. 60,000, who are not maintaining detailed accounts, can claim ad-hoc deduction.​',
        type: ['Individual_HUF'],
        redirectUrl: 'tax-calculator/agent-commission/'
    },
    {
        index: '12',
        heading: 'Tax Calculator',
        info: 'This calculator allows you to compute your tax liability on mere input of your taxable income ​',
        type: ['Individual_HUF', 'Firm_LLP', 'Company', 'Non_Residents', 'Trust_Societies'],
        redirectUrl: 'tax-calculator/tax-calculator/'
    },
    {
        index: '13',
        heading: 'Deduction under Section 80U',
        info: 'This deduction is available to a resident individual who is certified by the medical authority that he/she is a disable person.​​',
        type: ['Individual_HUF', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/deduction-under-section-80U/'
    },
    {
        index: '14',
        heading: 'Presumptive Income under Section 44AE',
        info: 'To give relief to small transporter, Income-tax Act allows them to compute their income from business of plying, hiring or leasing of goods carriages on presumptive basis. An assessee opting for presumptive scheme is not required to maintain regular books of account and is also exempt from getting the books of account audited.​​​',
        type: ['Individual_HUF'],
        redirectUrl: 'tax-calculator/presumptive-income-under-section-44AE/'
    },
    {
        index: '15',
        heading: 'Presumptive Income under Section 44AD',
        info: 'To give relief to small assessees, Income-tax Actallows them to compute their income from business on presumptive basis. An assessee opting for presumptive scheme is notrequired to maintain regular books of account and is also exempt from getting the books of account audited.​',
        type: ['Individual_HUF', 'Firm_LLP'],
        redirectUrl: 'tax-calculator/presumptive-income-under-section-44AD/'
    },
    {
        index: '16',
        heading: 'Depreciation',
        info: 'Tangible and Intangible assets used for purpose of business is subject to depreciation at specified rates. An additional depreciation is also allowed to certain entities on certain ​tangible assets subject to fulfilment of some conditions.​​',
        type: ['Individual_HUF', 'Tax_Deductor', 'Trust_Societies', 'Non_Residents', 'Company', 'Firm_LLP'],
        redirectUrl: 'tax-calculator/depreciation/'
    },
    {
        index: '17',
        heading: 'Gratuity',
        info: 'Gratuity receive by an employee from his employer is exempt up to certain limit if some conditions are satisfied. Gratuity received by a Government employee is fully exempt from tax.​',
        type: ['Individual_HUF', 'Non_Residents', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/gratuity/'
    },
    {
        index: '18',
        heading: 'Motor Car Facility',
        info: 'Use of own car or employer’s car for personal purposes or partly for personal and partly for official purposes is a taxable perquisite. The valuation of such perquisite is dependent on certain factors, i.e., capacity of car, usage of car, etc.',
        type: ['Individual_HUF', 'Non_Residents', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/motor-car-facility/'
    },
    {
        index: '19',
        heading: 'Deduction under Section 80TTA',
        info: 'Almost all taxpayers earn some interest from their saving bank deposits. An assessee can claim deduction up to Rs. 10,000 from such interest income.',
        type: ['Individual_HUF', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/deduction-under-section-80TTA/'
    },
    {
        index: '20',
        heading: 'Deduction under Section 80DD',
        info: 'This deduction is allowed to a taxpayer if he incurs some expenditure to support his disabled family members who is dependent on him for support and maintenance.',
        type: ['Individual_HUF', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/deduction-under-section-80DD/'
    },
    {
        index: '21',
        heading: 'Interest on NSC',
        info: 'National Saving Certificates are issued with a fixed maturity period. The tenure of an NSC certificate is 5 and 10 years for the NSC VIII Issue and NSC IX Issue respectively. However, NSC IX issue has been discontinued with effect from 20-12-2015.',
        type: ['Individual_HUF', 'Non_Residents'],
        redirectUrl: 'tax-calculator/nsc/'
    },
    {
        index: '22',
        heading: 'Residential Status Calculator',
        info: 'Levy of income tax is depends on the residential status of a person. Residential status of a taxpayer is determined in accordance with Section 6 of the Income-tax Act which can be a NRI, a RNOR or an Ordinary Resident in India.',
        type: ['Individual_HUF', 'Non_Residents', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/residential-status/'
    },
    {
        index: '23',
        heading: 'Period of holding of capital asset',
        info: 'Taxability of capital gains depends on the nature of a capital asset which can be either long-term or short-term. Nature of a capital asset is determined on basis of its period of holding since date of acquisition.',
        type: ['Individual_HUF', 'Firm_LLP', 'Company', 'Non_Residents', 'Trust_Societies', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/period-of-holding/'
    },
    {
        index: '24',
        heading: 'Deduction under Section 80D',
        info: 'To promote health insurance plans, a deduction is allowed under Section 80D in respect of premiums paid towards health insurance policies.',
        type: ['Individual_HUF', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/deduction-under-section-80D/'
    },
    {
        index: '25',
        heading: 'Deduction under Section 80C',
        info: 'Deduction under Section 80C is allowed to an individual for investment made by him in life insurance plans, tuition fees, housing loan repayments, etc. Maximum deduction of Rs. 1,50,000 is allowed to a taxpayer under this provision.',
        type: ['Individual_HUF', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/deduction-under-section-80C/'
    },
    {
        index: '26',
        heading: 'Income from house property',
        info: 'Income earned by a taxpayer from letting out his house property is taxable under this head. A house, even if not let out, can be charged to tax if it is deemed to be let-out.',
        type: ['Individual_HUF', 'Firm_LLP', 'Company', 'Non_Residents', 'Trust_Societies', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/income-from-house-property/'
    },
    {
        index: '27',
        heading: 'Leave Encashment',
        info: 'Leave encashment may be received by an employee during employment or on retirement. Its taxability depends upon various factors like employer type, period of employment, etc.',
        type: ['Individual_HUF', 'Non_Residents', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/leave-salary/'
    },
    {
        index: '28',
        heading: 'Partners Remuneration',
        info: 'A partnership firm is allowed to pay remuneration to its partner. Such remuneration can be paid within an overall limit specified under Section 40(b). Any payment above this limit is disallowed.',
        type: ['Individual_HUF', 'Firm_LLP'],
        redirectUrl: 'tax-calculator/partners-remuneration/'
    },
    {
        index: '29',
        heading: 'TDS Calculator',
        info: 'This calculator enables calculation of TDS to be deducted from specified payments being made to resident/non-resident',
        type: ['Individual_HUF', 'Firm_LLP', 'Company', 'Non_Residents', 'Trust_Societies', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/tds/'
    },
    {
        index: '30',
        heading: 'Deferred Tax Calculator',
        info: 'This calculator allows you to calculate the provisions required to be made for deferred tax as per provisions of AS 22',
        type: ['Company'],
        redirectUrl: 'tax-calculator/deferred/'
    },
    {
        index: '31',
        heading: 'Relief under Section 89',
        info: 'This relief is allowed when an employee receives past dues in current year. As amount is taxable in current year, Section 89 aims to provide relief from additional tax paid in the current year on past years income.',
        type: ['Individual_HUF', 'Tax_Deductor'],
        redirectUrl: 'tax-calculator/relief-under-section-89'
    }
]

const CalcListView = () => {

    const [taxCalculatorsDataState, setTaxCalculatorsDataState] = useState(taxCalculatorsData)

    const filterTaxCalcData = useCallback((searchStr, calcType) => {
        const filteredCalcData = taxCalculatorsData.filter((data) => {
            return data.heading.toLowerCase().includes(searchStr.toLowerCase()) && (calcType === 'All' ? true : data.type.includes(calcType));
        })
        setTaxCalculatorsDataState(() => [...filteredCalcData])
    }, [])

    return (
        <Fullpage>
            <div className={styles.MainCOntainer}>
                <div className={styles.ContainerTop}></div>
                <div className={styles.CalcListContainer}>
                    <SearchAndFilter filterTaxCalcData={filterTaxCalcData} />
                    <CalcDisplay calcData={taxCalculatorsDataState} />
                </div>
            </div>
        </Fullpage>
    );
}
export default CalcListView;