// const onBlurChange = (e) => {
//     if (!e.value || e.value === "" || e.value === "Select") {
//         e.style.borderColor = "red";
//         // handleInvalidInput(e)
//     } else {
//         e.style.borderColor = "#dee2e6";
//         $(e).next(".required-msg").hide()
//     }
// };

const onBlurChange = (e) => {

    if (!e.checkValidity()) {
        // e.style.borderColor = "red";
        // handleInvalidInput(e)
    } else {
        e.style.borderColor = "#dee2e6";
        $(e).next(".required-msg").hide()
    }
};
const handleInvalidInput = (t) => {
    t.style.borderColor = "red";
    $(t).next(".required-msg").show()
}
// ---------------------------------------------------------input validations-------------------------------------------------
function isNumberKey(n) {
    var t = n.which ? n.which : n.keyCode;
    return t != 46 && t > 31 && (t < 48 || t > 57) ? !1 : !0
}

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
            n.value = 0;
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
        // r = n.value;
        n.value = r.toFixed(2);
        // n.value = addthousandseprator(n.value)
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
const parseValues = (value) => {
    if (isNaN(value)) {
        return 0;
    } else {
        return value;
    }
};
// ---------------------------------------------------------------alert--------------------------------------------------------------
const showAlert = () => { $('.alert').show(); LogoShiftDown() }
// const showAlertWithAutoHide = () => {
//     $('.alert').show();
//     setTimeout(() => hideAlert(), 7000)
// }
const hideAlert = () => { $('.alert').hide(); LogoShiftUp() }
const LogoShiftDown = () => $('.container-fluid').css('padding-top', '3rem');
const LogoShiftUp = () => $('.container-fluid').css('padding-top', '1rem');

// ====================================================================================================================================

function handleConditions() {
    var n = parseFloat($("#disability_percentage").val()), i = $("#residential_status").val(), r = $("select#assessment_year").val(), t;
    if (r === "") {

        if (i === "nonResident") {
            showAlert()
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> This deduction is available only to a Resident Individual";
            $("#percentDiv").hide();
            $("#disability_percentage").attr("disabled", true);
        } else {
            $("#percentDiv").show();
            $("#disability_percentage").attr("disabled", false);
            $("#residential_status").removeAttr("disabled");
        }
        showAlert()
        document.getElementById("income_and_tax_calculator_alert_text").innerHTML = '<strong>Error ! !</strong> Please select assessment year.';
        return
    }

    if (i === "nonResident") {
        showAlert()
        document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> This deduction is available only to a Resident Individual";
        $("#percentDiv").hide();
        $("#disability_percentage").attr("disabled", true);
        return
    } else {
        hideAlert()
        $("#percentDiv").show();
        $("#disability_percentage").attr("disabled", false);
        $("#residential_status").removeAttr("disabled");
    }

}

$(document).on("change", "#residential_status,#disability_percentage", function () {
    handleConditions()
});

$(document).on("change", "#assessment_year", function () {
    if ($("select#assessment_year").val() !== '') {
        hideAlert()
        if ($("#residential_status").val() === 'nonResident') {
            showAlert()
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> This deduction is available only to a Resident Individual";
        }
    }
});

// $(document).on("change", "#residential_status", function () {
//     if ($("#residential_status").val() !== 'nonResident') {
//         hideAlert()
//     }
// });

$(document).on("change", "#isIndividual,#isNotIndividual", function () {
    if ($(this).attr("id") === "isNotIndividual") {
        var n = '<strong>Error ! !</strong> This deduction will be available for Resident Individual only.';
        showAlert()
        document.getElementById("income_and_tax_calculator_alert_text").innerHTML = n;
        $("#percentDiv").hide();
        $("#disability_percentage").attr("disabled", true);
        $("#residential_status").val('').attr("disabled", "disabled");
        $("#assessment_year").removeAttr("required"),
            onBlurChange(document.getElementById('assessment_year'))
    } else {
        hideAlert();
        $("#percentDiv").show();
        $("#disability_percentage").attr("disabled", false);
        $("#residential_status").removeAttr("disabled");
        $("#assessment_year").attr("required");
        resetForm80U()
    }
});
function resetForm80U() {
    $("#disability_percentage").val("");
    $("#deduction_amount").val("");
    $("#residential_status").val("");
    $("#assessment_year").val("")
}
$(document).on("change", "#disability_percentage", function () {
    $(this).val() < 0 && $(this).val(0);
    $(this).val() > 100 && $(this).val(100)
});


