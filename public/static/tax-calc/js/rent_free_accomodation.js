const basic_salary_element = $('#basic_salary_element');
const DA_element = $('#DA_element');
const commission_element = $('#commission_element');
const other_commission_element = $('#other_commission_element');
const fees_element = $('#fees_element');
const bonus_element = $('#bonus_element');
const monetary_payment_element = $('#monetary_payment_element');
const tax_allowance_element = $('#tax_allowance_element');
const acccommodation_type_element = $('#acccommodation_type_element');
const rent_paid_element = $('#rent_paid_element');
const taxable_value_of_prequisits_element = $('#taxable_value_of_prequisits_element');
const licensee_fees_element = $('#licensee_fees_element');
const higer_charges_element = $('#higer_charges_element');
const rent_amount_employer_element = $('#rent_amount_employer_element');
const amount_recover_element = $('#amount_recover_element');

window.addEventListener("load", () => {
    setView1();
});

const onBlurChange = (e) => {
    if (!e.value || e.value === "") {
        e.style.borderColor = "red";
    } else {
        e.style.borderColor = "#dee2e6";
    }
};
const onConditionalRadioChange = () => {
    const condRadio_1 = document.getElementById('flexRadioDefault1').checked;
    const condRadio_2 = document.getElementById('flexRadioDefault2').checked;
    const condRadio_3 = document.getElementById('flexRadioDefault3').checked;
    const condRadio_4 = document.getElementById('flexRadioDefault4').checked;

    if (condRadio_1 && !condRadio_2 && condRadio_3 && !condRadio_4) {
        return setView1()
    }
    if (condRadio_1 && !condRadio_2 && !condRadio_3 && condRadio_4) {
        return setView2()
    }
    if (!condRadio_1 && condRadio_2 && condRadio_3 && !condRadio_4) {
        return setView3()
    }
    if (!condRadio_1 && condRadio_2 && !condRadio_3 && condRadio_4) {
        return setView4()
    }
}
const setView1 = () => {
    basic_salary_element.show();
    DA_element.show();
    commission_element.show();
    other_commission_element.show();
    fees_element.show();
    bonus_element.show();
    monetary_payment_element.show();
    tax_allowance_element.show();
    acccommodation_type_element.hide();
    rent_paid_element.show();
    taxable_value_of_prequisits_element.hide();
    licensee_fees_element.hide();
    higer_charges_element.hide();
    amount_recover_element.show();

    $('#rent_paid_element_label').text('Rent paid/payable to hotel')
}
const setView2 = () => {
    basic_salary_element.hide();
    DA_element.hide();
    commission_element.hide();
    other_commission_element.hide();
    fees_element.hide();
    bonus_element.hide();
    monetary_payment_element.hide();
    tax_allowance_element.hide();
    acccommodation_type_element.hide();
    rent_paid_element.hide();
    taxable_value_of_prequisits_element.hide();
    licensee_fees_element.show();
    higer_charges_element.show();
    amount_recover_element.show();

    $('#rent_paid_element_label').text('Rent paid/payable to hotel')
}
const setView3 = () => {
    basic_salary_element.show();
    DA_element.show();
    commission_element.show();
    other_commission_element.show();
    fees_element.show();
    bonus_element.show();
    monetary_payment_element.show();
    tax_allowance_element.show();
    acccommodation_type_element.hide();
    rent_paid_element.show();
    taxable_value_of_prequisits_element.hide();
    licensee_fees_element.hide();
    higer_charges_element.show();
    amount_recover_element.show();

    $('#rent_paid_element_label').text('Rent paid/payable to hotel')
}
const setView4 = () => {
    basic_salary_element.show();
    DA_element.show();
    commission_element.show();
    other_commission_element.show();
    fees_element.show();
    bonus_element.show();
    monetary_payment_element.show();
    tax_allowance_element.show();
    acccommodation_type_element.show();
    rent_paid_element.show();
    taxable_value_of_prequisits_element.hide();
    licensee_fees_element.hide();
    higer_charges_element.show();
    amount_recover_element.show();

    $('#rent_paid_element_label').text('If house is not owned by the employer than enter the amount of rent paid by the employer?')
}
// ---------------------------------------------------------input validations-------------------------------------------------
function ValidateNumberKeyPress(n, t, i) {
    var r = t.which ? t.which : event.keyCode, u = String.fromCharCode(r), f;
    if (i == !0) {
        if (r > 31 && (r < 48 || r > 57) && u != "." && u != "-")
            return !1
    } else if (r > 31 && (r < 48 || r > 57) && u != ".")
        return !1;
    return u == "." && n.value.indexOf(".") != -1 ? !1 : u == "-" && (n.value.indexOf("-") != -1 || (f = getCaretPosition(n),
        f != 0)) ? !1 : !0
}

function RentPaidValidateNumberKeyPress(n, t, i) {
    const condRadio_1 = document.getElementById('flexRadioDefault1').checked;
    const condRadio_2 = document.getElementById('flexRadioDefault2').checked;
    const condRadio_3 = document.getElementById('flexRadioDefault3').checked;
    const condRadio_4 = document.getElementById('flexRadioDefault4').checked;

    var r = t.which ? t.which : event.keyCode, u = String.fromCharCode(r), f;
    if (!(!condRadio_1 && condRadio_2 && !condRadio_3 && condRadio_4)) {
        return floatValidation(n, t)
    } else {
        if (i == !0) {
            if (r > 31 && (r < 48 || r > 57) && u != "." && u != "-")
                return !1
        } else if (r > 31 && (r < 48 || r > 57) && u != ".")
            return !1;
        return u == "." && n.value.indexOf(".") != -1 ? !1 : u == "-" && (n.value.indexOf("-") != -1 || (f = getCaretPosition(n),
            f != 0)) ? !1 : !0
    }
}

const onPasteNumberValidation = (e) => {
    const regexx = /^[\d]*$/g

    if (!regexx.test(window.event.clipboardData.getData('text').substring(0, 18))) {
        return e.preventDefault()
    }
}

const onPastefloatValidation = (e) => {
    const pasteVal = window.event.clipboardData.getData('text');
    const str = pasteVal.substring(0, 18)
    const regexx = /^[.-\d]*$/g

    if (!regexx.test(str)) {
        return e.preventDefault()
    }

    if (str.split(",").length - 1 > 1 || str.split("-").length - 1 > 1) {
        return e.preventDefault()
    }

    if (str.includes('-') && str.charAt(0) !== '-') {
        return e.preventDefault()
    }

    if (str.includes('.') && str.includes('-')) {
        if (str.length == 17) e.target.value = str.substring(0, 17);
    } else if (str.includes('.') || str.includes('-')) { if (str.length == 16) e.target.value = str.substring(0, 16); } else if (str.length == 15) e.target.value = str.substring(0, 15);

    e.target.value = str.substring(0, 15);
    return e.preventDefault()
}

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
    if (t.value.includes('-') && t.value.charAt(0) !== '-') {
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

function ValidateAndFormatNumber(n, t) {
    var i, r;
    if (n.value != "") {
        if (UnFormatNumber(n),
            i = /^-?\d+\.{0,1}\d*$/.test(n.value),
            !i) {
            alert("Not a number");
            n.value = "0.00";
            n.focus();
            n.select();
            return
        }
        if (t == "Percentage" && parseFloat(n.value) > 100) {
            alert("Percentage Input can not exceed 100.");
            n.value = "100.00";
            n.focus();
            n.select();
            return
        }
        isNaN(parseFloat(n.value)) && (alert("Number exceeding float range"),
            n = "0.00",
            n.focus(),
            n.select());
        r = parseFloat(n.value);
        n.value = r.toFixed(2);
        n.value = addthousandseprator(n.value)
    }
}

function UnFormatNumber(n) {
    n.value != "" && (n.value = n.value.replace(/,/gi, ""))
}
function addthousandseprator(n) {
    n += "";
    x = n.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    for (var t = /(\d+)(\d{3})/, i = 0, u = String(x1).length, r = parseInt(u / 2 - 1); t.test(x1);)
        if (i > 0 ? x1 = x1.replace(t, "$1,$2") : (x1 = x1.replace(t, "$1,$2"),
            t = /(\d+)(\d{2})/),
            i++,
            r--,
            r == 0)
            break;
    return x1 + x2
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
const LogoShiftDown = () => $('.container-fluid').css('padding-top', '3rem');
const LogoShiftUp = () => $('.container-fluid').css('padding-top', '1rem');