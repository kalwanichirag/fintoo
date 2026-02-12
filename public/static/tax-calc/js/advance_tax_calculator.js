const toggleDiv = (id, btnId) => {
    const element = document.getElementById(id);
    const btnElement = document.getElementById(btnId);
    if (!element.style.display) {
        element.style.display = "block";
        btnElement.innerText = "Hide details";
    } else if (element.style.display === "none") {
        element.style.display = "block";
        btnElement.innerText = "Hide details";
    } else {
        element.style.display = "none";
        btnElement.innerText = "Show details";
    }
};

const clearDeductions = () => {
    document.getElementById("insurance").value = "";
    document.getElementById("payment_annuity").value = "";
    document.getElementById("ppf").value = "";
    document.getElementById("nsc").value = "";
    document.getElementById("ulip").value = "";
    document.getElementById("uti").value = "";
    document.getElementById("housing_loan").value = "";
    document.getElementById("tution_fee").value = "";
    document.getElementById("fixed_deposit").value = "";
    document.getElementById("npf").value = "";
    document.getElementById("self_NPS").value = "";
    document.getElementById("additional_NPS").value = "";
    document.getElementById("employer_NPS").value = "";
    document.getElementById("deductions_input_14").value = "";
    document.getElementById("deductions_input_15").value = "";
    document.getElementById("sukanya_samridhi").value = "";
    document.getElementById("other_deductable").value = "";
    document.getElementById("deductions_input_18").value = "";
    document.getElementById("medi_claim").value = "";
    document.getElementById("medi_treatment").value = "";
    document.getElementById("house_property").value = "";
    document.getElementById("interest_elect_vehicle").value = "";
    document.getElementById("donations").value = "";
    document.getElementById("loan_higher_edu").value = "";
    document.getElementById("loan_resident").value = "";
    document.getElementById("interest_deposits").value = "";
    document.getElementById("deductions_input_27").value = "";
    // document.getElementById("DeductionsInput26").value = "";
    document.getElementById("deduction_80DD_checkbox_number").value = "";
    document.getElementById("deduction_80U_checkbox_number").value = "";
    document.getElementById("EmployersContriTowardsNPS80CCDElement").value = "";

    document.getElementById("eightyDD").checked = false;
    document.getElementById("disability1").checked = false;
    document.getElementById("eightyU").checked = false;
    document.getElementById("disability2").checked = false;
};

const onBlurChange = (e) => {
    if (!e.value || e.value === "") {
        e.style.borderColor = "red";
    } else {
        e.style.borderColor = "#dee2e6";
    }
};

// -----------------------------------------IncomeFromHouseProperty calculations----------------------------------------------------------

const calculateIncomeFromHouseProperty = () => {
    const firstVal = parseInt(
        document.getElementById("income_from_self_occupied_house_property_input").value.replace(/,/g, '')
    );
    const secondVal = parseInt(
        document.getElementById("income_from_let_out_house_property_input").value.replace(/,/g, '')
    );
    document.getElementById("income_from_house_property_main_input_view").value =
        FormatNumberControl(parseValues(secondVal) + parseValues(firstVal));
};

const onHousingLoanInterestFieldChange = (e) => {
    document.getElementById("income_from_self_occupied_house_property_input").value =
    FormatNumberControl(-Math.abs(e.target.value.replace(/,/g, '')));
    calculateIncomeFromHouseProperty();
};

const calculateIncomeFromLetOutHouseProperty = () => {
    const firstVal = parseInt(document.getElementById("rent_received").value.replace(/,/g, ''));
    const secondVal = parseInt(document.getElementById("municipal_tax").value.replace(/,/g, ''));
    const thirdVal = parseInt(document.getElementById("unrealized_rent").value.replace(/,/g, ''));
    const calculatedValue = calculateTotal([
        firstVal,
        -Math.abs(calculateTotal([secondVal, thirdVal])),
    ]);
    document.getElementById("net_anual_value_input").value = FormatNumberControl(calculatedValue);
    document.getElementById("30_deduction_of_net_annual_value_input").value =
        calculatedValue < 0 ? 0 : FormatNumberControl(calculatedValue * 0.3);
    calculateLetOutHouseProperty();
    calculateIncomeFromHouseProperty();
};

const calculateLetOutHouseProperty = () => {
    const firstVal = parseInt(
        document.getElementById("net_anual_value_input").value.replace(/,/g, '')
    );
    const secondVal = parseInt(
        document.getElementById("30_deduction_of_net_annual_value_input").value.replace(/,/g, '')
    );
    const thirdVal = parseInt(
        document.getElementById("interest_house_loan2").value.replace(/,/g, '')
    );

    const calculatedVal =
        parseValues(firstVal) - parseValues(secondVal) - parseValues(thirdVal);
    document.getElementById("income_from_let_out_house_property_input").value =
        FormatNumberControl(calculatedVal);
    calculateIncomeFromHouseProperty();
};

// ------------------------------------------------------------------------------------------------------------------------------------------------
const calculateIncomeFromOtherSources = () => {
    const firstVal = parseInt(
        document.getElementById("interest").value.replace(/,/g, '')
    );
    const secondVal = parseInt(
        document.getElementById("other_income").value.replace(/,/g, '')
    );
    const thirdVal = parseInt(
        document.getElementById("winnings").value.replace(/,/g, '')
    );

    document.getElementById("income_from_other_sources_main_input_view").value =
        FormatNumberControl(calculateTotal([firstVal, secondVal, thirdVal]));
};

// ------------------------------------------------capital gains--------------------------------------------------------------------------
const toggleCapitlGainsRow5columnInput = (isVisible) => {

    if (isVisible) {
        $('#StermCGainsOtherThan111A1').css('display', 'flex');
        $('#StermCGainsCovered111A1').css('display', 'flex');
        $('#LtermCGains201').css('display', 'flex');
        $('#LtermCGains101').css('display', 'flex');
        $('#LtermCGains112A1').css('display', 'flex');

    } else {
        $('#StermCGainsOtherThan111A1').hide();
        $('#StermCGainsCovered111A1').hide()
        $('#LtermCGains201').hide()
        $('#LtermCGains101').hide()
        $('#LtermCGains112A1').hide()

    }
    document.getElementById('st_other_cover1').value = '';
    document.getElementById('st_covered1').value = '';
    document.getElementById('lt_201').value = '';
    document.getElementById('lt_101').value = '';
    document.getElementById('lt_covered1').value = '';

    calculateICapitalGainsById()
}

const calculateICapitalGainsPart = (e) => {
    calculateICapitalGainsById();
};

const calculateICapitalGainsById = () => {
    const total1 = calculateTotal([parseInt($('#st_other_cover1').val().replace(/,/g, '')),
    parseInt($('#st_other_cover2').val().replace(/,/g, '')),
    parseInt($('#st_other_cover3').val().replace(/,/g, '')),
    parseInt($('#st_other_cover4').val().replace(/,/g, '')),
    parseInt($('#st_other_cover5').val().replace(/,/g, ''))])

    const total2 = calculateTotal([parseInt($('#st_covered1').val().replace(/,/g, '')),
    parseInt($('#st_covered2').val().replace(/,/g, '')),
    parseInt($('#st_covered3').val().replace(/,/g, '')),
    parseInt($('#st_covered4').val().replace(/,/g, '')),
    parseInt($('#st_covered5').val().replace(/,/g, ''))])

    const total3 = calculateTotal([parseInt($('#lt_201').val().replace(/,/g, '')),
    parseInt($('#lt_202').val().replace(/,/g, '')),
    parseInt($('#lt_203').val().replace(/,/g, '')),
    parseInt($('#lt_204').val().replace(/,/g, '')),
    parseInt($('#lt_205').val().replace(/,/g, ''))])

    const total4 = calculateTotal([parseInt($('#lt_101').val().replace(/,/g, '')),
    parseInt($('#lt_102').val().replace(/,/g, '')),
    parseInt($('#lt_103').val().replace(/,/g, '')),
    parseInt($('#lt_104').val().replace(/,/g, '')),
    parseInt($('#lt_105').val().replace(/,/g, ''))])

    const total5 = calculateTotal([getBeforeDecimal($('#lt_covered1').val().replace(/,/g, '')),
    getBeforeDecimal($('#lt_covered2').val().replace(/,/g, '')),
    getBeforeDecimal($('#lt_covered3').val().replace(/,/g, '')),
    getBeforeDecimal($('#lt_covered4').val().replace(/,/g, '')),
    getBeforeDecimal($('#lt_covered5').val().replace(/,/g, ''))])


    // $("#st_other_cover_total").val(FormatNumberControl(total1 === 0 ? $("#st_other_cover_total").val() : total1))

    // $('#st_covered_total').val(FormatNumberControl(total2 === 0 ? $("#st_covered_total").val() : total2))

    // $('#lt_20_total').val(FormatNumberControl(total3 === 0 ? $("#lt_20_total").val() : total3))

    // $('#lt_10_total').val(FormatNumberControl(total4 === 0 ? $("#lt_10_total").val() : total4))

    // $('#lt_covered_total').val(total5 === 0 ? $("#lt_covered_total").val() : total5)

    $("#st_other_cover_total").val(FormatNumberControl(total1))

    $('#st_covered_total').val(FormatNumberControl(total2))

    $('#lt_20_total').val(FormatNumberControl(total3))

    $('#lt_10_total').val(FormatNumberControl(total4))

    $('#lt_covered_total').val(total5)


    calculateICapitalGains()

};

const getBeforeDecimal = (str) => {
    return Number(str.split('.')[0])
}

const calculateICapitalGains = () => {

    const firstVal = parseInt(
        document.getElementById("st_other_cover_total").value.replace(/,/g, '')
    );
    const secondVal = parseInt(
        document.getElementById("st_covered_total").value.replace(/,/g, '')
    );
    const thirdVal = parseInt(
        document.getElementById("lt_20_total").value.replace(/,/g, '')
    );
    const fourthVal = parseInt(
        document.getElementById("lt_10_total").value.replace(/,/g, '')
    );
    const fifthVal = parseFloat(
        document.getElementById("lt_covered_total").value.replace(/,/g, '')
    );

    document.getElementById("capital_gains_main_input_view").value = FormatNumberControl(calculateTotal([
        firstVal,
        secondVal,
        thirdVal,
        fourthVal,
        fifthVal
    ]));
};

// ---------------------------------------------------------------------------------------------------------------------------------------------

const calculateDeductionValue = () => {
    const allTypeInputs = Array.from(
        document
            .getElementById("data-deductionInput")
            .querySelectorAll("input[data-deductionInput]")
    );
    const totalField = document.getElementById("deductions_input_18");
    const DeductionsMainInputView = document.getElementById(
        "deductions_main_input_view"
    );
    const InputsForTotal = allTypeInputs.filter(
        (inputElem) => inputElem.getAttribute("data-inTotal") !== null
    );
    totalField.value = calculateTotal(
        InputsForTotal.map((elem) => parseInt(elem.value.replace(/,/g, '')))
    );
    DeductionsMainInputView.value = FormatNumberControl(calculateTotal(
        allTypeInputs.map((elem) => parseInt(elem.value.replace(/,/g, '')))
    ));
};

const calculateTotal = (valueArr) => {
    const total = valueArr.reduce((acc, curr) => {
        if (isNaN(curr)) {
            return acc + 0;
        } else {
            return acc + curr;
        }
    }, 0);

    return total;
};

const calculateTotalNve = (valueArr) => {
    const total = valueArr.reduce((acc, curr) => {
        if (isNaN(curr)) {
            return acc - 0;
        } else {
            return acc - curr;
        }
    }, 0);

    return total;
};

const parseValues = (value) => {
    if (isNaN(value)) {
        return 0;
    } else {
        return value;
    }
};

// --------------------------------------------------advanced tax logic-----------------------------------------------------

const domestic_company_checkboxes_element = $('#domestic_company_checkboxes_element');
const taxation_opting_select_element = $('#taxation_opting_select_element');
// const cop_sch_115BAD_element = $('#cop_sch_115BAD_element');
const gender_select_element = $('#gender_select_element');
const residential_status_select_element = $('#residential_status_select_element');
const income_form_salary_element = $('#income_form_salary_element');
const income_fomr_house_property_element = $('#income_fomr_house_property_element');
const capital_gains_element = $('#capital_gains_element');
const income_form_other_sources_element = $('#income_form_other_sources_element');
const profits_or_gains_from_business_or_other_profession_element = $('#profits_or_gains_from_business_or_other_profession_element');
const agricultural_income_element = $('#agricultural_income_element');
const deductions_element = $('#deductions_element');
const net_taxable_income_element = $('#net_taxable_income_element');
const income_liable_to_tax_at_normal_rate_element = $('#income_liable_to_tax_at_normal_rate_element');
const short_term_capital_gains_111A_15_element = $('#short_term_capital_gains_111A_15_element');
const long_term_capital_gains_112A_10_element = $('#long_term_capital_gains_112A_10_element');
const long_term_capital_gains_20_element = $('#long_term_capital_gains_20_element');
const long_term_capital_gains_10_element = $('#long_term_capital_gains_10_element');
const lottery_crossword_puzzle_30_element = $('#lottery_crossword_puzzle_30_element');
const income_tax_element = $('#income_tax_element');
const surcharge_element = $('#surcharge_element');
const education_cess_element = $('#education_cess_element');
const secondary_and_higher_secondary_cess_element = $('#secondary_and_higher_secondary_cess_element');
const health_and_education_cess_element = $('#health_and_education_cess_element');
const total_tax_liability_element = $('#total_tax_liability_element');
const relief_element = $('#relief_element');
const TDSTCSMAT_element = $('#TDSTCSMAT_element');
const assessed_tax_element = $('#assessed_tax_element');

const onTaxPayerTypeSelectChange = (e) => {
    switch (e.target.value) {
        case 'individual':
            individualView()
            break;
        case 'huf':
            HUFView()
            break;
        case "aops_boi":
            AOPBOIView()
            break;
        case "domestic_company":
            dCompanyView()
            break;
        case "foreign_company":
            fCompanyView()
            break;
        case "firms":
            firmsView()
            break;
        case "llp":
            LLPView()
            break;
        case "co_operative_society":
            COPSView()
            break;
        default:
            defaultView()
            break;
    }
};

const defaultView = () => {
    $('#incom-tax-field-label').text('Income Tax');
    $('#relief-field-label').text('Relief');
    $('#net_taxable').removeClass('bg-body-secondary').prop('readonly', false);
    domestic_company_checkboxes_element.hide();
    taxation_opting_select_element.hide();
    // cop_sch_115BAD_element.hide();
    gender_select_element.hide();
    residential_status_select_element.hide();
    income_form_salary_element.hide();
    income_fomr_house_property_element.hide();
    capital_gains_element.hide();
    income_form_other_sources_element.hide();
    profits_or_gains_from_business_or_other_profession_element.hide();
    agricultural_income_element.hide();
    deductions_element.hide();
    net_taxable_income_element.show();
    income_liable_to_tax_at_normal_rate_element.hide();
    short_term_capital_gains_111A_15_element.hide();
    long_term_capital_gains_112A_10_element.hide();
    long_term_capital_gains_20_element.hide();
    long_term_capital_gains_10_element.hide();
    lottery_crossword_puzzle_30_element.hide();
    income_tax_element.show();
    surcharge_element.show();
    education_cess_element.hide();
    secondary_and_higher_secondary_cess_element.hide();
    health_and_education_cess_element.show();
    total_tax_liability_element.show();
    relief_element.show();
    TDSTCSMAT_element.show();
    assessed_tax_element.show();
}
const individualView = () => {
    $('#incom-tax-field-label').html(`Income Tax after relief u/s <span class="linkText">87A<span class="desc87_1">Section 87A of the Income Tax Act, 1961 provides relief to individual taxpayers by reducing the amount of tax payable by them. The relief is in the form of a tax rebate, which is available to individuals whose total income does not exceed a certain limit.</span>
    </span>`);
    $('#relief-field-label').html(`Relief other than relief u/s <span class="linkText">87A<span class="desc87_2">Arrears of salary under section 89 and others.</span></span>`);
    $('#taxation_opting_select_label').html(`Whether opting for
    taxation
    under Section <span class="linkText">115BAC<span class="link115BAC">New Income tax Regime where you can avail benefit of lower tax slabs. However, to avail this lower tax rate, the taxpayer must forgo certain deductions and exemptions.</span>
</span></span> ?`);
    $('#net_taxable').addClass('bg-body-secondary').prop('readonly', true);
    domestic_company_checkboxes_element.hide();
    taxation_opting_select_element.show();
    // cop_sch_115BAD_element.hide();
    gender_select_element.show();
    residential_status_select_element.show();
    income_form_salary_element.show();
    income_fomr_house_property_element.show();
    capital_gains_element.show();
    income_form_other_sources_element.show();
    profits_or_gains_from_business_or_other_profession_element.show();
    agricultural_income_element.show();
    deductions_element.show();
    net_taxable_income_element.show();
    income_liable_to_tax_at_normal_rate_element.show();
    short_term_capital_gains_111A_15_element.show();
    long_term_capital_gains_112A_10_element.show();
    long_term_capital_gains_20_element.show();
    long_term_capital_gains_10_element.show();
    lottery_crossword_puzzle_30_element.show();
    income_tax_element.show()
    surcharge_element.show();
    education_cess_element.hide();
    secondary_and_higher_secondary_cess_element.hide();
    health_and_education_cess_element.show();
    total_tax_liability_element.show();
    relief_element.show()
    TDSTCSMAT_element.show();
    assessed_tax_element.show();

    // showCapitlGains5Row()
    toggleCapitlGainsRow5columnInput(true)
}
const HUFView = () => {
    $('#incom-tax-field-label').text('Income Tax');
    $('#relief-field-label').text('Relief');
    $('#net_taxable').removeClass('bg-body-secondary').prop('readonly', false);
    $('#taxation_opting_select_label').html(`Whether opting for
    taxation
    under Section <span class="linkText">115BAC<span class="link115BAC">New Income tax Regime where you can avail benefit of lower tax slabs. However, to avail this lower tax rate, the taxpayer must forgo certain deductions and exemptions.</span>
</span></span> ?`);
    domestic_company_checkboxes_element.hide();
    taxation_opting_select_element.show();
    // cop_sch_115BAD_element.hide();
    gender_select_element.hide();
    residential_status_select_element.hide();
    income_form_salary_element.hide();
    income_fomr_house_property_element.hide();
    capital_gains_element.hide();
    income_form_other_sources_element.hide();
    profits_or_gains_from_business_or_other_profession_element.hide();
    agricultural_income_element.hide();
    deductions_element.hide();
    net_taxable_income_element.show();
    income_liable_to_tax_at_normal_rate_element.hide();
    short_term_capital_gains_111A_15_element.hide();
    long_term_capital_gains_112A_10_element.hide();
    long_term_capital_gains_20_element.hide();
    long_term_capital_gains_10_element.hide();
    lottery_crossword_puzzle_30_element.hide();
    income_tax_element.show();
    surcharge_element.show();
    education_cess_element.hide();
    secondary_and_higher_secondary_cess_element.hide();
    health_and_education_cess_element.show();
    total_tax_liability_element.show();
    relief_element.show();
    TDSTCSMAT_element.show();
    assessed_tax_element.show();
}
const AOPBOIView = () => {
    $('#incom-tax-field-label').text('Income Tax');
    $('#relief-field-label').text('Relief');
    $('#net_taxable').removeClass('bg-body-secondary').prop('readonly', false);
    domestic_company_checkboxes_element.hide();
    taxation_opting_select_element.hide();
    // cop_sch_115BAD_element.hide();
    gender_select_element.hide();
    residential_status_select_element.hide();
    income_form_salary_element.hide();
    income_fomr_house_property_element.hide();
    capital_gains_element.hide();
    income_form_other_sources_element.hide();
    profits_or_gains_from_business_or_other_profession_element.hide();
    agricultural_income_element.hide();
    deductions_element.hide();
    net_taxable_income_element.show();
    income_liable_to_tax_at_normal_rate_element.hide();
    short_term_capital_gains_111A_15_element.hide();
    long_term_capital_gains_112A_10_element.hide();
    long_term_capital_gains_20_element.hide();
    long_term_capital_gains_10_element.hide();
    lottery_crossword_puzzle_30_element.hide();
    income_tax_element.show();
    surcharge_element.show();
    education_cess_element.hide();
    secondary_and_higher_secondary_cess_element.hide();
    health_and_education_cess_element.show();
    total_tax_liability_element.show();
    relief_element.show();
    TDSTCSMAT_element.show();
    assessed_tax_element.show();
}
const dCompanyView = () => {
    $('#incom-tax-field-label').text('Income Tax');
    $('#relief-field-label').text('Relief');
    $('#net_taxable').removeClass('bg-body-secondary').prop('readonly', false);
    domestic_company_checkboxes_element.show();
    taxation_opting_select_element.hide();
    // cop_sch_115BAD_element.hide();
    gender_select_element.hide();
    residential_status_select_element.hide();
    income_form_salary_element.hide();
    income_fomr_house_property_element.hide();
    capital_gains_element.hide();
    income_form_other_sources_element.hide();
    profits_or_gains_from_business_or_other_profession_element.hide();
    agricultural_income_element.hide();
    deductions_element.hide();
    net_taxable_income_element.show();
    income_liable_to_tax_at_normal_rate_element.hide();
    short_term_capital_gains_111A_15_element.hide();
    long_term_capital_gains_112A_10_element.hide();
    long_term_capital_gains_20_element.hide();
    long_term_capital_gains_10_element.hide();
    lottery_crossword_puzzle_30_element.hide();
    income_tax_element.show();
    surcharge_element.show();
    education_cess_element.hide();
    secondary_and_higher_secondary_cess_element.hide();
    health_and_education_cess_element.show();
    total_tax_liability_element.show();
    relief_element.show();
    TDSTCSMAT_element.show();
    assessed_tax_element.show();
}
const fCompanyView = () => {
    $('#incom-tax-field-label').text('Income Tax');
    $('#relief-field-label').text('Relief');
    $('#net_taxable').removeClass('bg-body-secondary').prop('readonly', false);
    domestic_company_checkboxes_element.hide();
    taxation_opting_select_element.hide();
    // cop_sch_115BAD_element.hide();
    gender_select_element.hide();
    residential_status_select_element.hide();
    income_form_salary_element.hide();
    income_fomr_house_property_element.hide();
    capital_gains_element.hide();
    income_form_other_sources_element.hide();
    profits_or_gains_from_business_or_other_profession_element.hide();
    agricultural_income_element.hide();
    deductions_element.hide();
    net_taxable_income_element.show();
    income_liable_to_tax_at_normal_rate_element.hide();
    short_term_capital_gains_111A_15_element.hide();
    long_term_capital_gains_112A_10_element.hide();
    long_term_capital_gains_20_element.hide();
    long_term_capital_gains_10_element.hide();
    lottery_crossword_puzzle_30_element.hide();
    income_tax_element.show();
    surcharge_element.show();
    education_cess_element.hide();
    secondary_and_higher_secondary_cess_element.hide();
    health_and_education_cess_element.show();
    total_tax_liability_element.show();
    relief_element.show();
    TDSTCSMAT_element.show();
    assessed_tax_element.show();
}
const firmsView = () => {
    $('#incom-tax-field-label').text('Income Tax');
    $('#relief-field-label').text('Relief');
    $('#net_taxable').removeClass('bg-body-secondary').prop('readonly', false);
    domestic_company_checkboxes_element.hide();
    taxation_opting_select_element.hide();
    // cop_sch_115BAD_element.hide();
    gender_select_element.hide();
    residential_status_select_element.hide();
    income_form_salary_element.hide();
    income_fomr_house_property_element.hide();
    capital_gains_element.hide();
    income_form_other_sources_element.hide();
    profits_or_gains_from_business_or_other_profession_element.hide();
    agricultural_income_element.hide();
    deductions_element.hide();
    net_taxable_income_element.show();
    income_liable_to_tax_at_normal_rate_element.hide();
    short_term_capital_gains_111A_15_element.hide();
    long_term_capital_gains_112A_10_element.hide();
    long_term_capital_gains_20_element.hide();
    long_term_capital_gains_10_element.hide();
    lottery_crossword_puzzle_30_element.hide();
    income_tax_element.show();
    surcharge_element.show();
    education_cess_element.hide();
    secondary_and_higher_secondary_cess_element.hide();
    health_and_education_cess_element.show();
    total_tax_liability_element.show();
    relief_element.show();
    TDSTCSMAT_element.show();
    assessed_tax_element.show();
}
const LLPView = () => {
    $('#incom-tax-field-label').text('Income Tax');
    $('#relief-field-label').text('Relief');
    $('#net_taxable').removeClass('bg-body-secondary').prop('readonly', false);
    domestic_company_checkboxes_element.hide();
    taxation_opting_select_element.hide();
    // cop_sch_115BAD_element.hide();
    gender_select_element.hide();
    residential_status_select_element.hide();
    income_form_salary_element.hide();
    income_fomr_house_property_element.hide();
    capital_gains_element.hide();
    income_form_other_sources_element.hide();
    profits_or_gains_from_business_or_other_profession_element.hide();
    agricultural_income_element.hide();
    deductions_element.hide();
    net_taxable_income_element.show();
    income_liable_to_tax_at_normal_rate_element.hide();
    short_term_capital_gains_111A_15_element.hide();
    long_term_capital_gains_112A_10_element.hide();
    long_term_capital_gains_20_element.hide();
    long_term_capital_gains_10_element.hide();
    lottery_crossword_puzzle_30_element.hide();
    income_tax_element.show();
    surcharge_element.show();
    education_cess_element.hide();
    secondary_and_higher_secondary_cess_element.hide();
    health_and_education_cess_element.show();
    total_tax_liability_element.show();
    relief_element.show();
    TDSTCSMAT_element.show();
    assessed_tax_element.show();
}
const COPSView = () => {
    $('#incom-tax-field-label').text('Income Tax');
    $('#relief-field-label').text('Relief');
    $('#taxation_opting_select_label').html(`Co-operative society
    opted and qualify for section <span class="linkText">115BAD<span class="Link115BAD">Section 115BAD is applicable to Resident Cooperative Societies and provides them with the benefit of a lower tax rate of 22% for any previous year relevant to the assessment year beginning on or after 1st April 2021, subject to certain conditions.</span></span>`);
    $('#net_taxable').removeClass('bg-body-secondary').prop('readonly', false);
    domestic_company_checkboxes_element.hide();
    taxation_opting_select_element.show();
    // cop_sch_115BAD_element.show();
    gender_select_element.hide();
    residential_status_select_element.hide();
    income_form_salary_element.hide();
    income_fomr_house_property_element.hide();
    capital_gains_element.hide();
    income_form_other_sources_element.hide();
    profits_or_gains_from_business_or_other_profession_element.hide();
    agricultural_income_element.hide();
    deductions_element.hide();
    net_taxable_income_element.show();
    income_liable_to_tax_at_normal_rate_element.hide();
    short_term_capital_gains_111A_15_element.hide();
    long_term_capital_gains_112A_10_element.hide();
    long_term_capital_gains_20_element.hide();
    long_term_capital_gains_10_element.hide();
    lottery_crossword_puzzle_30_element.hide();
    income_tax_element.show();
    surcharge_element.show();
    education_cess_element.hide();
    secondary_and_higher_secondary_cess_element.hide();
    health_and_education_cess_element.show();
    total_tax_liability_element.show();
    relief_element.show();
    TDSTCSMAT_element.show();
    assessed_tax_element.show();
}

$(".chb").change(function () {
    $(".chb").not(this).prop('checked', false);
});

const taxationOptingSelectElementChange = (e) => {
    const childArr = Array.from(
        document.getElementById("data-deductionInput").children
    );

    if (e.target.value === "1") {
        childArr.forEach((elem) => {
            if (elem.id !== "EmployersContriTowardsNPS80CCDElement") {
                elem.style.display = "none";
            }
        });
        $('#IncomeFromSelfOccupiedPropertyElement').hide()
        $('#interest_house_loan').val('')
        $('#income_from_self_occupied_house_property_input').val('')
        $('#income-from-salary-label').text("Income from salary (Income from Salary before Exemptions/Deductions)")
    } else {
        childArr.forEach((elem) => (elem.style.display = ""));
        $('#IncomeFromSelfOccupiedPropertyElement').show()
        $('#interest_house_loan').val('')
        $('#income_from_self_occupied_house_property_input').val('')
        $('#income-from-salary-label').text("Income from Salary (Income from salary after standard deduction of Rs.50000.)")
    }
    calculateIncomeFromHouseProperty();
    clearDeductions();
    calculateDeductionValue();
};

const calculateDeductionForMaintenanceCheckboxForAdvanceTax = () => {
    const firstVal = document.getElementById(
        "eightyDD"
    ).checked;
    const secondVal = document.getElementById(
        "disability1"
    ).checked;
    const deduction80DDCheckboxnumber = document.getElementById(
        "deduction_80DD_checkbox_number"
    );

    if (firstVal && secondVal) {
        deduction80DDCheckboxnumber.value = 125000;
    } else if (firstVal) {
        deduction80DDCheckboxnumber.value = 75000;
    } else {
        deduction80DDCheckboxnumber.value = 0;
    }

    calculateDeductionValue();
};

const calculateDeductionIncaseDisableCheckboxForAdvanceTax = () => {
    const firstVal = document.getElementById(
        "eightyU"
    ).checked;
    const secondVal = document.getElementById(
        "disability2"
    ).checked;
    const deduction80UCheckboxnumber = document.getElementById(
        "deduction_80U_checkbox_number"
    );

    if (firstVal && secondVal) {
        deduction80UCheckboxnumber.value = 125000;
    } else if (firstVal) {
        deduction80UCheckboxnumber.value = 75000;
    } else {
        deduction80UCheckboxnumber.value = 0;
    }

    calculateDeductionValue();
};

// ------------------------------------Hover events-----------------------------------------------
const toolTipElements = document.querySelectorAll(
    "[data-tooltip='data-tooltip']"
);
toolTipElements.forEach((elem) =>
    elem.addEventListener("mouseover", () => {
        document.getElementById("uuuu").style.display = "block";
        document.body.style.overflow = "hidden";
    })
);
toolTipElements.forEach((elem) =>
    elem.addEventListener("mouseleave", () => {
        document.getElementById("uuuu").style.display = "none";
        document.body.style.overflow = "scroll";
    })
);

// ---------------------------------------------------------input validations-------------------------------------------------

const numberValidation = (n, t) => {
    try {
        if (n.readOnly == !0)
            return !0;
        var i, r;
        if (window.event)
            i = window.event.keyCode;
        else if (t)
            i = t.which;
        else
            return !0;
        return i == 46 ? !1 : i == null || i == 0 || i == 8 || i == 13 || i == 27 || i == 46 ? !0 : (r = String.fromCharCode(i),
            /\d/.test(r) ? (window.status = "",
                !0) : (window.status = "Field accepts numbers only.",
                    !1))
    } catch (u) {
        alert("An error has occurred: " + u.message)
    }
}

const floatValidation = (t, e) => {

    const regexx = /^[.-\d]*$/g

    if (!regexx.test(t.value + e.key)) {
        return false
    }
    if (e.key === "." && !t.value.includes('.')) return;
    if (e.key === "." && t.value.includes('.')) return false;

    let selection = document.getSelection();
    let strSelection = selection.toString();


    if (strSelection) {
        if (strSelection === t.value) return

        if (e.key === "-") {
            if (t.value.startsWith(strSelection)) {
                return
            } else {
                return false
            }
        }
        return
    }

    if ((t.value + e.key).length > 1 && e.key === "-") {
        if (!t.value.includes('-')) {
            t.value = e.key + t.value
            return false
        } else {
            return false
        }
    }

    if (t.value.length > 0)
        if (e.key === "." && t.value.includes('.')) {
            return false
        }
    if (e.key === "-" && t.value.includes('-')) {
        return false
    }
    if (t.value.includes('.') && t.value.includes('-')) {
        if (t.value.length == 17) return false;
    } else if (t.value.includes('.') || t.value.includes('-')) { if (t.value.length == 16) return false; }

    else if (t.value.length == 15) return false;

}

function ValidateAndFormatNumberControl(n) {
    var t = n.value;
    t = t.replace(/,/g, "");
    t += "";
    x = t.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    for (var i = /(\d+)(\d{3})/, r = 0, f = String(x1).length, u = parseInt(f / 2 - 1); i.test(x1);)
        if (r > 0 ? x1 = x1.replace(i, "$1,$2") : (x1 = x1.replace(i, "$1,$2"),
            i = /(\d+)(\d{2})/),
            r++,
            u--,
            u == 0)
            break;
    n.value = x1 + x2
}

function FormatNumberControl(n) {
    var t = n.toString();
    t = t.replace(/,/g, "");
    t += "";
    x = t.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    for (var i = /(\d+)(\d{3})/, r = 0, f = String(x1).length, u = parseInt(f / 2 - 1); i.test(x1);)
        if (r > 0 ? x1 = x1.replace(i, "$1,$2") : (x1 = x1.replace(i, "$1,$2"),
            i = /(\d+)(\d{2})/),
            r++,
            u--,
            u == 0)
            break;
    return n.value = x1 + x2
}

// ---------------------------------------------------------------alert--------------------------------------------------------------
const showAlert = () => $('.alert').show();
const hideAlert = () => $('.alert').hide();
const LogoShiftDown = () => $('.container-fluid').css('padding-top','3rem');
const LogoShiftUp = () => $('.container-fluid').css('padding-top','1rem');