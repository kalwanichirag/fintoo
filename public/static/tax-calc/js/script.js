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

const addTableRow = (tableBodyId, rowClass) => {
    const tBody = document.getElementById(tableBodyId);
    const tRow = document.getElementsByClassName(rowClass)[0];
    const clonetRow = tRow.cloneNode(true);
    const rowInputs = Array.from(clonetRow.querySelectorAll('input'));
    rowInputs.forEach((ip, idx) => {
        ip.value = ''
        if (idx === 0) {
            ip.id = `date_${tBody.childElementCount}`
        } else {
            ip.id = `amt_${tBody.childElementCount}`
        }
    })
    clonetRow.id = tBody.childElementCount;

    tBody.appendChild(clonetRow);
};

const removeTableRow = (tableBodyId, rowClass, e) => {
    const row = e.parentNode;
    if (row.parentNode.childElementCount === 1) {
        return;
    }
    row.parentNode.removeChild(row);

    const tBody = document.getElementById(tableBodyId);
    const tRow = document.getElementsByClassName(rowClass);
    Array.from(tRow).forEach((row, id) => {
        row.id = id;
        Array.from(row.querySelectorAll('input')).forEach((ip, idx) => {
            if (idx === 0) {
                ip.id = `date_${id}`
            } else {
                ip.id = `amt_${id}`
            }
        });
    })
};

const futureAndCurrentYearStrArr = ["1", "2", "3", "4"];
const PastYearStrArr = [
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
];

const onSelectChange = (e) => {
    sel_index=$("#AssessmentYearSelect").val();
    // alert(sel_index);
    if (sel_index !=""){
        var year2=parseInt($("#AssessmentYearSelect option:selected").text().substr(0,4))
        var year1=year2-1
        if (sel_index >7){
            $('#stcgOtherL1').text('From 01/04/'+year1+' to 15/09/'+year1)
            $('#stcgOtherL2').text('From 16/09/'+year1+' to 15/12/'+year1)
            $('#stcgOtherL3').text('From 16/12/'+year1+' to 15/03/'+year2)
            $('#stcgOtherL4').text('From 16/03/'+year2+' to 31/03/'+year2)

            $('#stcgCoveredL1').text('From 01/04/'+year1+' to 15/09/'+year1)
            $('#stcgCoveredL2').text('From 16/09/'+year1+' to 15/12/'+year1)
            $('#stcgCoveredL3').text('From 16/12/'+year1+' to 15/03/'+year2)
            $('#stcgCoveredL4').text('From 16/03/'+year2+' to 31/03/'+year2)

            $('#ltcgCharged20L1').text('From 01/04/'+year1+' to 15/09/'+year1)
            $('#ltcgCharged20L2').text('From 16/09/'+year1+' to 15/12/'+year1)
            $('#ltcgCharged20L3').text('From 16/12/'+year1+' to 15/03/'+year2)
            $('#ltcgCharged20L4').text('From 16/03/'+year2+' to 31/03/'+year2)

            $('#ltcgCharged10L1').text('From 01/04/'+year1+' to 15/09/'+year1)
            $('#ltcgCharged10L2').text('From 16/09/'+year1+' to 15/12/'+year1)
            $('#ltcgCharged10L3').text('From 16/12/'+year1+' to 15/03/'+year2)
            $('#ltcgCharged10L4').text('From 16/03/'+year2+' to 31/03/'+year2)
        }
        else{
            $('#stcgOtherL1').text('From 01/04/'+year1+' to 15/06/'+year1)
            $('#stcgOtherL2').text('From 16/06/'+year1+' to 15/09/'+year1)
            $('#stcgOtherL3').text('From 16/09/'+year1+' to 15/12/'+year1)
            $('#stcgOtherL4').text('From 16/12/'+year1+' to 15/03/'+year2)
            $('#stcgOtherL5').text('From 16/03/'+year2+' to 31/03/'+year2)

            $('#stcgCoveredL1').text('From 01/04/'+year1+' to 15/06/'+year1)
            $('#stcgCoveredL2').text('From 16/06/'+year1+' to 15/09/'+year1)
            $('#stcgCoveredL3').text('From 16/09/'+year1+' to 15/12/'+year1)
            $('#stcgCoveredL4').text('From 16/12/'+year1+' to 15/03/'+year2)
            $('#stcgCoveredL5').text('From 16/03/'+year2+' to 31/03/'+year2)

            $('#ltcgCharged20L1').text('From 01/04/'+year1+' to 15/06/'+year1)
            $('#ltcgCharged20L2').text('From 16/06/'+year1+' to 15/09/'+year1)
            $('#ltcgCharged20L3').text('From 16/09/'+year1+' to 15/12/'+year1)
            $('#ltcgCharged20L4').text('From 16/12/'+year1+' to 15/03/'+year2)
            $('#ltcgCharged20L5').text('From 16/03/'+year2+' to 31/03/'+year2)

            $('#ltcgCharged10L1').text('From 01/04/'+year1+' to 15/06/'+year1)
            $('#ltcgCharged10L2').text('From 16/06/'+year1+' to 15/09/'+year1)
            $('#ltcgCharged10L3').text('From 16/09/'+year1+' to 15/12/'+year1)
            $('#ltcgCharged10L4').text('From 16/12/'+year1+' to 15/03/'+year2)
            $('#ltcgCharged10L5').text('From 16/03/'+year2+' to 31/03/'+year2)

            $('#ltcgCoveredL1').text('From 01/04/'+year1+' to 15/06/'+year1)
            $('#ltcgCoveredL2').text('From 16/06/'+year1+' to 15/09/'+year1)
            $('#ltcgCoveredL3').text('From 16/09/'+year1+' to 15/12/'+year1)
            $('#ltcgCoveredL4').text('From 16/12/'+year1+' to 15/03/'+year2)
            $('#ltcgCoveredL5').text('From 16/03/'+year2+' to 31/03/'+year2)
        }
    }

    setConditionalDeductionFields(e.target.value)
    const yesNo = document.getElementById("taxation-opting-dropDown-div");
    const Label = document.getElementById("income-from-salary-label");
    if (
        e.target.value === "5"
    ) {
        yesNo.style.display = "none";
        Label.innerText =
            "Income from Salary (Income from salary after standard deduction of Rs.40000.)";
    } else if (
        e.target.value === '' ||
        !futureAndCurrentYearStrArr.includes(e.target.value)
    ) {
        yesNo.style.display = "none";
        Label.innerText = "Income from Salary";
    } else {
        e.target.value === "4" ? yesNo.style.display = "none" : yesNo.style.display = "block";
        Label.innerText =
            "Income from Salary (Income from salary after standard deduction of Rs.50000.)";
    }
    switch (e.target.value) {
        case "8":
            hideCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(false)
            // setCapitalGainsInputLables(16)
            showGenderSelectConditional(true)
            break;
        case "9":
            hideCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(false)
            // setCapitalGainsInputLables(15)
            showGenderSelectConditional(true)

            break;
        case "10":
            hideCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(false)
            // setCapitalGainsInputLables(14)
            showGenderSelectConditional(true)

            break;
        case "11":
            hideCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(false)
            // setCapitalGainsInputLables(13)
            showGenderSelectConditional(true)
            break;
        case "12":
            hideCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(false)
            // setCapitalGainsInputLables(12)
            showGenderSelectConditional(true)
            break;
        case "13":
            hideCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(false)
            // setCapitalGainsInputLables(11)
            showGenderSelectConditional(false)
            break;
        case "14":
            hideCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(false)
            // setCapitalGainsInputLables(10)
            showGenderSelectConditional(false)
            break;
        case "5":
            hideCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(true)
            // setCapitalGainsInputLables(19)
            showGenderSelectConditional(true)
            break;
        case "6":
            hideCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(true)
            // setCapitalGainsInputLables(18)
            showGenderSelectConditional(true)
            break;
        case "7":
            hideCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(true)
            // setCapitalGainsInputLables(17)
            showGenderSelectConditional(true)
            break;
        case "1":
            showCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(true)
            // setCapitalGainsInputLables(23)
            showGenderSelectConditional(true)
            break;
        case "2":
            showCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(true)
            // setCapitalGainsInputLables(22)
            showGenderSelectConditional(true)
            break;
        case "3":
            showCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(true)
            // setCapitalGainsInputLables(21)
            showGenderSelectConditional(true)
            break;
        case "4":
            showCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(true)
            // setCapitalGainsInputLables(20)
            showGenderSelectConditional(true)
            break;
        case '':
            hideCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(false)
            // setCapitalGainsInputLables(1)
            showGenderSelectConditional(true)
            break;
        default:
            hideCapitlGains5Row()
            toggleCapitlGainsRow5columnInput(false)
            // setCapitalGainsInputLables(1)
            showGenderSelectConditional(true)
            break;
    }
    calculateDeductionForMaintenanceCheckbox()
    calculateDeductionIncaseDisableCheckbox()
    fieldsChangeOnAssessmentYear(e.target.value)
    labelChangeOnAssessmentYear(e.target.value)
    deductionLabelChangeOnAssessmentYear(e.target.value)
};
[
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
];
["1", "2", "3"];

const showGenderSelectConditional = (flag) => {
    console.log(flag)
    if (flag) {
        $('#with_super_senior').show();
        $('#without_super_senior').hide();
    } else {
        $('#with_super_senior').hide();
        $('#without_super_senior').show();
    }
}

const fieldsChangeOnAssessmentYear = (dateStr) => {
    if (dateStr === '' || dateStr === "11" || dateStr === "12" || dateStr === "13" || dateStr === "14") {
        $('#incom-tax-field-label').html('Income Tax')
        $('#education-cess-container').show()
        $('#secondary-hsc-cess-container').show()
        $('#health-education-cess-container').hide()
        $('#relief-field-label').html('Relief')
        return
    }
    if (dateStr === "1" || dateStr === "2" || dateStr === "3" || dateStr === "4" || dateStr === "5") {
        $('#incom-tax-field-label').html(`Income Tax after relief u/s <span class="linkText">87A<span class="desc87_1">Section 87A of the Income Tax Act, 1961 provides relief to individual taxpayers by reducing the amount of tax payable by them. The relief is in the form of a tax rebate, which is available to individuals whose total income does not exceed a certain limit.</span></span>`)
        $('#education-cess-container').hide()
        $('#secondary-hsc-cess-container').hide()
        $('#health-education-cess-container').show()
        $('#relief-field-label').html(`Relief other than relief u/s <span class="linkText">87A<span class="desc87_2">Arrears of salary under section 89 and others.</span></span>`)
        return
    }
    if (dateStr === "6" || dateStr === "7" || dateStr === "8" || dateStr === "9" || dateStr === "10") {
        $('#incom-tax-field-label').html(`Income Tax after relief u/s <span class="linkText">87A<span class="desc87_1">Section 87A of the Income Tax Act, 1961 provides relief to individual taxpayers by reducing the amount of tax payable by them. The relief is in the form of a tax rebate, which is available to individuals whose total income does not exceed a certain limit.</span></span>`)
        $('#education-cess-container').show()
        $('#secondary-hsc-cess-container').show()
        $('#health-education-cess-container').hide()
        $('#relief-field-label').html(`Relief other than relief u/s <span class="linkText">87A<span class="desc87_2">Arrears of salary under section 89 and others.</span></span>`)
        return
    }

}

const labelChangeOnAssessmentYear = (dateStr) => {
    if (dateStr === "1" || dateStr === "2" || dateStr === "3" || dateStr === "4") {
        $('#long-term-capital-gains-112A-container').show()
    } else {
        $('#long-term-capital-gains-112A-container').hide()
    }
    return
}

const deductionLabelChangeOnAssessmentYear = (dateStr) => {
    if (dateStr === "1" || dateStr === "2" || dateStr === "3" || dateStr === "4" || dateStr === "5") {
        $('#interest-on-deposits-field-label').html(`Interest on deposits(u/s <span class="linkText">80TTB<span class="link80TTB">Under section 80TTB, senior citizens who are 60 years or older can claim a deduction of up to Rs. 50,000 from their taxable income on the interest income earned from deposits with banks, post offices, or co-operative societies & Savings bank Interest</span></span>)`)
    } else {
        $('#interest-on-deposits-field-label').html(`Interest on deposits in saving
        account (u/s <span class="linkText">80TTA<span class="link80TTA">Section 80TTA is a provision in the Indian Income Tax Act that allows a deduction to an individual or a Hindu Undivided Family (HUF) for the interest earned on savings account deposits.</span></span>)`)
    }
    return
}
const BACCheck = (e) => {
    const childArr = Array.from(
        document.getElementById("data-deductionInput").children
    );
    const IncomeFromSelfOccupiedPropertyElement = document.getElementById(
        "IncomeFromSelfOccupiedPropertyElement"
    );

    if (e.target.value === '1') {
        childArr.forEach((elem) => {
            if (elem.id !== "EmployersContriTowardsNPS80CCDElement") {
                elem.style.display = "none";
            }
        });
        document.getElementById("income-from-salary-label").innerText =
            "Income from salary (Income from Salary before Exemptions/Deductions)";
        IncomeFromSelfOccupiedPropertyElement.style.display = "none";
    } else {
        childArr.forEach((elem) => (elem.style.display = ""));
        document.getElementById("income-from-salary-label").innerText =
            "Income from Salary (Income from salary after standard deduction of Rs.50000.)";
        IncomeFromSelfOccupiedPropertyElement.style.display = "";
    }
    clearDeductions();
};



const setConditionalDeductionFields = (dateStr) => {

    $("#is_opting").val('').change();

    if (dateStr === '5' || dateStr === '6' || dateStr === '7' || dateStr === '8' || dateStr === '9' || dateStr === '10' || dateStr === '11') {
        $('#DeductionsConditionalInput15').show()

        $('#DeductionsConditionalInput14').hide()
        $('#DeductionsConditionalInput21').hide()
        $('#DeductionsConditionalInput22').hide()

        $('#DeductionsInput14').val('')
        $('#DeductionsInput21').val('')
        $('#DeductionsInput22').val('')
        return
    }
    if (dateStr === '12' || dateStr === '13' || dateStr === '14') {
        $('#DeductionsConditionalInput14').show()
        $('#DeductionsConditionalInput15').show()

        $('#DeductionsConditionalInput21').hide()
        $('#DeductionsConditionalInput22').hide()

        $('#DeductionsInput21').val('')
        $('#DeductionsInput22').val('')
        return
    }

    if (dateStr === '1' || dateStr === '2' || dateStr === '3' || dateStr === '4') {
        $('#DeductionsConditionalInput21').show()
        $('#DeductionsConditionalInput22').show()

        $('#DeductionsConditionalInput14').hide()
        $('#DeductionsConditionalInput15').hide()

        $('#DeductionsInput14').val('')
        $('#DeductionsInput15').val('')
        return
    }
    if (dateStr === '') {

        $('#DeductionsConditionalInput14').show()
        $('#DeductionsConditionalInput15').show()

        $('#DeductionsConditionalInput21').hide()
        $('#DeductionsConditionalInput22').hide()

        $('#DeductionsInput21').val('')
        $('#DeductionsInput22').val('')
        return
    }
    $('#DeductionsInput14').val('')
    $('#DeductionsInput15').val('')
    $('#DeductionsInput21').val('')
    $('#DeductionsInput22').val('')

    $('#DeductionsConditionalInput14').hide()
    $('#DeductionsConditionalInput15').hide()
    $('#DeductionsConditionalInput21').hide()
    $('#DeductionsConditionalInput22').hide()

    calculateDeductionValue();
}

const clearDeductions = () => {
    document.getElementById("DeductionsInput1").value = "";
    document.getElementById("DeductionsInput2").value = "";
    document.getElementById("DeductionsInput3").value = "";
    document.getElementById("DeductionsInput4").value = "";
    document.getElementById("DeductionsInput5").value = "";
    document.getElementById("DeductionsInput6").value = "";
    document.getElementById("DeductionsInput7").value = "";
    document.getElementById("DeductionsInput8").value = "";
    document.getElementById("DeductionsInput9").value = "";
    document.getElementById("DeductionsInput10").value = "";
    document.getElementById("DeductionsInput11").value = "";
    document.getElementById("DeductionsInput12").value = "";
    document.getElementById("DeductionsInput13").value = "";
    document.getElementById("DeductionsInput14").value = "";
    document.getElementById("DeductionsInput15").value = "";
    document.getElementById("DeductionsInput16").value = "";
    document.getElementById("DeductionsInput17").value = "";
    document.getElementById("DeductionsInput18").value = "";
    document.getElementById("DeductionsInput19").value = "";
    document.getElementById("DeductionsInput20").value = "";
    document.getElementById("DeductionsInput21").value = "";
    document.getElementById("DeductionsInput22").value = "";
    document.getElementById("DeductionsInput23").value = "";
    document.getElementById("DeductionsInput24").value = "";
    document.getElementById("DeductionsInput25").value = "";
    document.getElementById("DeductionsInput26").value = "";
    document.getElementById("DeductionsInput27").value = "";
    // document.getElementById("DeductionsInput26").value = "";
    document.getElementById("deduction80DDCheckboxnumber").value = "";
    document.getElementById("deduction80UCheckboxnumber").value = "";
    document.getElementById("EmployersContriTowardsNPS80CCDElement").value = "";

    document.getElementById("deduction80DDCheckboxIfClaimed").checked = false;
    document.getElementById("deduction80DDCheckboxIfDisable").checked = false;
    document.getElementById("deduction80UCheckboxIfClaimed").checked = false;
    document.getElementById("deduction80UCheckboxIfDisable").checked = false;
};

const onTaxPayerTypeSelectChange = (e) => {
    if (e.target.value !== "Individual") {
        document
            .querySelectorAll(".conditional-on-individual-tax-payer")
            .forEach((elem) => (elem.style.display = "none"));
    } else {
        document
            .querySelectorAll(".conditional-on-individual-tax-payer")
            .forEach((elem) => (elem.style.display = "block"));
    }
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
        document.getElementById("IncomeFromSelfOccupiedHousePropertyInput").value.replace(/,/g, '')
    );
    const secondVal = parseInt(
        document.getElementById("IncomeFromLetOutHousePropertyInput").value.replace(/,/g, '')
    );
    document.getElementById("IncomeFromHousePropertyMainInputView").value =
        FormatNumberControl(parseValues(secondVal) + parseValues(firstVal))
};

const onHousingLoanInterestFieldChange = (e) => {
    document.getElementById("IncomeFromSelfOccupiedHousePropertyInput").value =
    FormatNumberControl(-Math.abs(e.target.value.replace(/,/g, '')));
    calculateIncomeFromHouseProperty();
};

const calculateIncomeFromLetOutHouseProperty = () => {
    const firstVal = parseInt(document.getElementById("LetOutInput1").value.replace(/,/g, ''));
    const secondVal = parseInt(document.getElementById("LetOutInput2").value.replace(/,/g, ''));
    const thirdVal = parseInt(document.getElementById("LetOutInput3").value.replace(/,/g, ''));
    const calculatedValue = calculateTotal([
        firstVal,
        -Math.abs(calculateTotal([secondVal, thirdVal])),
    ]);
    document.getElementById("NetAnualValueInput").value = FormatNumberControl(calculatedValue);
    document.getElementById("30PDeductionOfNetAnnualValueInput").value =
        FormatNumberControl(calculatedValue * 0.3);
    calculateLetOutHouseProperty();
    calculateIncomeFromHouseProperty();
};

const calculateLetOutHouseProperty = () => {
    const firstVal = parseInt(
        document.getElementById("NetAnualValueInput").value.replace(/,/g, '')
    );
    const secondVal = parseInt(
        document.getElementById("30PDeductionOfNetAnnualValueInput").value.replace(/,/g, '')
    );
    const thirdVal = parseInt(
        document.getElementById("HousingLoanInterestInput").value.replace(/,/g, '')
    );

    const calculatedVal =
        parseValues(firstVal) - parseValues(secondVal) - parseValues(thirdVal);
    document.getElementById("IncomeFromLetOutHousePropertyInput").value =
        FormatNumberControl(calculatedVal);
    calculateIncomeFromHouseProperty();
};

const ClearIncomeFromSelfOccupiedProperty = () => {

}

// ------------------------------------------------------------------------------------------------------------------------------------------------
const calculateIncomeFromOtherSources = () => {
    const firstVal = parseInt(
        document.getElementById("IncomeFromOtherSourcesInterest").value.replace(/,/g, '')
    );
    const secondVal = parseInt(
        document.getElementById("IncomeFromOtherSourcesCommissionOther").value.replace(/,/g, '')
    );
    const thirdVal = parseInt(
        document.getElementById("IncomeFromOtherSourcesLottertyEtc").value.replace(/,/g, '')
    );

    document.getElementById("IncomeFromOtherSourcesMainInputView").value =
        FormatNumberControl(calculateTotal([firstVal, secondVal, thirdVal]));
};

// ------------------------------------------------capital gains--------------------------------------------------------------------------
const hideCapitlGains5Row = () => {
    $('#LtermCGains112A').hide()

    $('#LtermCGains112A1Input').val('')
    $('#LtermCGains112A2Input').val('')
    $('#LtermCGains112A3Input').val('')
    $('#LtermCGains112A4Input').val('')
    $('#LtermCGains112A5Input').val('')

    calculateICapitalGainsById()

}
const showCapitlGains5Row = () => {
    $('#LtermCGains112A').show()

    $('#LtermCGains112A1Input').val('')
    $('#LtermCGains112A2Input').val('')
    $('#LtermCGains112A3Input').val('')
    $('#LtermCGains112A4Input').val('')
    $('#LtermCGains112A5Input').val('')

    calculateICapitalGainsById()

}
const toggleCapitlGainsRow5columnInput = (isVisible) => {

    if (isVisible) {
        $('#StermCGainsOtherThan111A5').css('display', 'flex');
        $('#StermCGainsCovered111A5').css('display', 'flex');
        $('#LtermCGains205').css('display', 'flex');
        $('#LtermCGains105').css('display', 'flex');
        $('#LtermCGains112A5').css('display', 'flex');

    } else {
        $('#StermCGainsOtherThan111A5').hide();
        $('#StermCGainsCovered111A5').hide()
        $('#LtermCGains205').hide()
        $('#LtermCGains105').hide()
        $('#LtermCGains112A5').hide()

    }
    document.getElementById('StermCGainsOtherThan111A5Input').value = '';
    document.getElementById('StermCGainsCovered111A5Input').value = '';
    document.getElementById('LtermCGains205Input').value = '';
    document.getElementById('LtermCGains105Input').value = '';
    document.getElementById('LtermCGains112A5Input').value = '';

    calculateICapitalGainsById()
}

const calculateICapitalGainsPart = (e) => {
    calculateICapitalGainsById();
};

const setCapitalGainsInputLables = (yearSuff) => {

    const lable1 = yearSuff === 1 ? 'From 16/06/2014 to 15/09/2014' : `From 01/04/20${yearSuff === 10 ? '09' : yearSuff - 1} to 15/06/20${yearSuff === 10 ? '09' : yearSuff - 1}`
    const lable2 = yearSuff === 1 ? 'From 16/06/2014 to 15/09/2014' : `From 16/06/20${yearSuff === 10 ? '09' : yearSuff - 1} to 15/09/20${yearSuff === 10 ? '09' : yearSuff - 1}`
    const lable3 = yearSuff === 1 ? 'From 16/09/2014 to 15/12/2014' : `From 16/09/20${yearSuff === 10 ? '09' : yearSuff - 1} to 15/12/20${yearSuff === 10 ? '09' : yearSuff - 1}`
    const lable4 = yearSuff === 1 ? 'From 16/12/2014 to 15/03/2015' : `From 16/12/20${yearSuff === 10 ? '09' : yearSuff - 1} to 15/03/20${yearSuff}`
    const lable5 = yearSuff === 1 ? 'From 16/03/2015 to 31/03/2015' : `From 16/03/20${yearSuff} to 31/03/20${yearSuff}`

    if (yearSuff > 16) {
        $('#StermCGainsOtherThan111A1').find('label')[0].innerText = lable1
        $('#StermCGainsOtherThan111A2').find('label')[0].innerText = lable2
        $('#StermCGainsOtherThan111A3').find('label')[0].innerText = lable3
        $('#StermCGainsOtherThan111A4').find('label')[0].innerText = lable4
        $('#StermCGainsOtherThan111A5').find('label')[0].innerText = lable5
        $('#StermCGainsCovered111A1').find('label')[0].innerText = lable1
        $('#StermCGainsCovered111A2').find('label')[0].innerText = lable2
        $('#StermCGainsCovered111A3').find('label')[0].innerText = lable3
        $('#StermCGainsCovered111A4').find('label')[0].innerText = lable4
        $('#StermCGainsCovered111A5').find('label')[0].innerText = lable5
        $('#LtermCGains201').find('label')[0].innerText = lable1
        $('#LtermCGains202').find('label')[0].innerText = lable2
        $('#LtermCGains203').find('label')[0].innerText = lable3
        $('#LtermCGains204').find('label')[0].innerText = lable4
        $('#LtermCGains205').find('label')[0].innerText = lable5
        $('#LtermCGains101').find('label')[0].innerText = lable1
        $('#LtermCGains102').find('label')[0].innerText = lable2
        $('#LtermCGains103').find('label')[0].innerText = lable3
        $('#LtermCGains104').find('label')[0].innerText = lable4
        $('#LtermCGains105').find('label')[0].innerText = lable5
        $('#LtermCGains112A1').find('label')[0].innerText = lable1
        $('#LtermCGains112A2').find('label')[0].innerText = lable2
        $('#LtermCGains112A3').find('label')[0].innerText = lable3
        $('#LtermCGains112A4').find('label')[0].innerText = lable4
        $('#LtermCGains112A5').find('label')[0].innerText = lable5
    } else {

        $('#StermCGainsOtherThan111A1').find('label')[0].innerText = lable1
        $('#StermCGainsOtherThan111A2').find('label')[0].innerText = lable3
        $('#StermCGainsOtherThan111A3').find('label')[0].innerText = lable4
        $('#StermCGainsOtherThan111A4').find('label')[0].innerText = lable5
        $('#StermCGainsOtherThan111A5').find('label')[0].innerText = lable5
        $('#StermCGainsCovered111A1').find('label')[0].innerText = lable1
        $('#StermCGainsCovered111A2').find('label')[0].innerText = lable3
        $('#StermCGainsCovered111A3').find('label')[0].innerText = lable4
        $('#StermCGainsCovered111A4').find('label')[0].innerText = lable5
        $('#StermCGainsCovered111A5').find('label')[0].innerText = lable5
        $('#LtermCGains201').find('label')[0].innerText = lable1
        $('#LtermCGains202').find('label')[0].innerText = lable3
        $('#LtermCGains203').find('label')[0].innerText = lable4
        $('#LtermCGains204').find('label')[0].innerText = lable5
        $('#LtermCGains205').find('label')[0].innerText = lable5
        $('#LtermCGains101').find('label')[0].innerText = lable1
        $('#LtermCGains102').find('label')[0].innerText = lable3
        $('#LtermCGains103').find('label')[0].innerText = lable4
        $('#LtermCGains104').find('label')[0].innerText = lable5
        $('#LtermCGains105').find('label')[0].innerText = lable5
        $('#LtermCGains112A1').find('label')[0].innerText = lable1
        $('#LtermCGains112A2').find('label')[0].innerText = lable3
        $('#LtermCGains112A3').find('label')[0].innerText = lable4
        $('#LtermCGains112A4').find('label')[0].innerText = lable5
        $('#LtermCGains112A5').find('label')[0].innerText = lable5
    }


};

const calculateICapitalGainsById = () => {
    const total1 = calculateTotal([parseInt($('#StermCGainsOtherThan111A1Input').val().replace(/,/g, '')),
    parseInt($('#StermCGainsOtherThan111A2Input').val().replace(/,/g, '')),
    parseInt($('#StermCGainsOtherThan111A3Input').val().replace(/,/g, '')),
    parseInt($('#StermCGainsOtherThan111A4Input').val().replace(/,/g, '')),
    parseInt($('#StermCGainsOtherThan111A5Input').val().replace(/,/g, ''))])

    const total2 = calculateTotal([parseInt($('#StermCGainsCovered111A1Input').val().replace(/,/g, '')),
    parseInt($('#StermCGainsCovered111A2Input').val().replace(/,/g, '')),
    parseInt($('#StermCGainsCovered111A3Input').val().replace(/,/g, '')),
    parseInt($('#StermCGainsCovered111A4Input').val().replace(/,/g, '')),
    parseInt($('#StermCGainsCovered111A5Input').val().replace(/,/g, ''))])

    const total3 = calculateTotal([parseInt($('#LtermCGains201Input').val().replace(/,/g, '')),
    parseInt($('#LtermCGains202Input').val().replace(/,/g, '')),
    parseInt($('#LtermCGains203Input').val().replace(/,/g, '')),
    parseInt($('#LtermCGains204Input').val().replace(/,/g, '')),
    parseInt($('#LtermCGains205Input').val().replace(/,/g, ''))])

    const total4 = calculateTotal([parseInt($('#LtermCGains101Input').val().replace(/,/g, '')),
    parseInt($('#LtermCGains102Input').val().replace(/,/g, '')),
    parseInt($('#LtermCGains103Input').val().replace(/,/g, '')),
    parseInt($('#LtermCGains104Input').val().replace(/,/g, '')),
    parseInt($('#LtermCGains105Input').val().replace(/,/g, ''))])

    const total5 = calculateTotal([parseInt($('#LtermCGains112A1Input').val().replace(/,/g, '')),
    parseInt($('#LtermCGains112A2Input').val().replace(/,/g, '')),
    parseInt($('#LtermCGains112A3Input').val().replace(/,/g, '')),
    parseInt($('#LtermCGains112A4Input').val().replace(/,/g, '')),
    parseInt($('#LtermCGains112A5Input').val().replace(/,/g, ''))])

    console.log(total1,
        total2,
        total3,
        total4,
        total5,)


    // $("#StermCGainsOtherThan111ATotal").val(FormatNumberControl(total1 === 0 ? $("#StermCGainsOtherThan111ATotal").val() : total1))

    // $('#StermCGainsCovered111ATotal').val(FormatNumberControl(total2 === 0 ? $("#StermCGainsCovered111ATotal").val() : total2))

    // $('#LtermCGains20Total').val(FormatNumberControl(total3 === 0 ? $("#LtermCGains20Total").val() : total3))

    // $('#LtermCGains10Total').val(FormatNumberControl(total4 === 0 ? $("#LtermCGains10Total").val() : total4))

    // $('#LtermCGains112ATotal').val(FormatNumberControl(total5 === 0 ? $("#LtermCGains112ATotal").val() : total5))

    $("#StermCGainsOtherThan111ATotal").val(FormatNumberControl(total1))

    $('#StermCGainsCovered111ATotal').val(FormatNumberControl(total2))

    $('#LtermCGains20Total').val(FormatNumberControl(total3))

    $('#LtermCGains10Total').val(FormatNumberControl(total4))

    $('#LtermCGains112ATotal').val(FormatNumberControl(total5))


    calculateICapitalGains()

};

const calculateICapitalGains = () => {
    const firstVal = parseInt(
        document.getElementById("StermCGainsOtherThan111ATotal").value.replace(/,/g, '')
    );
    const secondVal = parseInt(
        document.getElementById("StermCGainsCovered111ATotal").value.replace(/,/g, '')
    );
    const thirdVal = parseInt(
        document.getElementById("LtermCGains20Total").value.replace(/,/g, '')
    );
    const fourthVal = parseInt(
        document.getElementById("LtermCGains10Total").value.replace(/,/g, '')
    );
    const fifthVal = parseInt(
        document.getElementById("LtermCGains112ATotal").value.replace(/,/g, '')
    );

    document.getElementById("CapitalGainsMainInputView").value = FormatNumberControl(calculateTotal([
        firstVal,
        secondVal,
        thirdVal,
        fourthVal,
        fifthVal
    ]));
};

// ---------------------------------------------------------------------------------------------------------------------------------------------

const refArray = ["1", "2", "3", "4",
    "5",
    "6",
    "7",
    "8",]

const calculateDeductionForMaintenanceCheckbox = () => {
    const firstVal = document.getElementById(
        "deduction80DDCheckboxIfClaimed"
    ).checked;
    const secondVal = document.getElementById(
        "deduction80DDCheckboxIfDisable"
    ).checked;
    const deduction80DDCheckboxnumber = document.getElementById(
        "deduction80DDCheckboxnumber"
    );

    if (firstVal && secondVal) {
        deduction80DDCheckboxnumber.value = refArray.includes($('#AssessmentYearSelect').val()) ? FormatNumberControl(125000) : FormatNumberControl(100000);
    } else if (firstVal) {
        deduction80DDCheckboxnumber.value = refArray.includes($('#AssessmentYearSelect').val()) ? FormatNumberControl(75000) : FormatNumberControl(50000);
    } else {
        deduction80DDCheckboxnumber.value = 0;
    }

    calculateDeductionValue();
};

const calculateDeductionIncaseDisableCheckbox = () => {
    const firstVal = document.getElementById(
        "deduction80UCheckboxIfClaimed"
    ).checked;
    const secondVal = document.getElementById(
        "deduction80UCheckboxIfDisable"
    ).checked;
    const deduction80UCheckboxnumber = document.getElementById(
        "deduction80UCheckboxnumber"
    );

    if (firstVal && secondVal) {
        deduction80UCheckboxnumber.value = refArray.includes($('#AssessmentYearSelect').val()) ? FormatNumberControl(125000) : FormatNumberControl(100000);
    } else if (firstVal) {
        deduction80UCheckboxnumber.value = refArray.includes($('#AssessmentYearSelect').val()) ? FormatNumberControl(75000) : FormatNumberControl(50000);
    } else {
        deduction80UCheckboxnumber.value = 0;
    }

    calculateDeductionValue();
};

const calculateDeductionValue = () => {
    const allTypeInputs = Array.from(
        document
            .getElementById("data-deductionInput")
            .querySelectorAll("input[data-deductionInput]")
    );
    const totalField = document.getElementById("DeductionsInput18");
    const DeductionsMainInputView = document.getElementById(
        "DeductionsMainInputView"
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

// ------------------------------------Hover events-----------------------------------------------
// ----------------todo blasts on small screen size--------------
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

const OOption = document.getElementById("AssessmentYearSelect");

Array.from(OOption.children).forEach((elem) => {
    // elem.style.background = "red";
    elem.style.padding = "5px";
});

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