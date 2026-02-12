const onBlurChange = (e) => {
    if (!e.value || e.value === "" || e.value === "Select") {
        // e.style.borderColor = "red";
        handleInvalidInput(e)
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
            console.log(n)
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
        // r = parseFloat(n.value);
        // n.value = r.toFixed(2);
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

$(document).on("change", ".number-class", function (n) {
    if (this.value === '.') {
        return this.value = 0.00
    } else {
        const unformat = this.value != "" && (this.value.replace(/,/gi, ""))
        r = parseFloat(unformat);
        this.value = addthousandseprator(r)
    }

});
$(document).on("keypress", ".number-class", function (n) {

    var t = $(this), i;
    (n.which != 46 || t.val().indexOf(".") != -1) && (n.which < 48 || n.which > 57) && n.which != 0 && n.which != 8 && n.preventDefault();
    i = $(this).val();
    n.which == 46 && i.indexOf(".") == -1 && setTimeout(function () {
        t.val().substring(t.val().indexOf(".")).length > 3 && t.val(t.val().substring(0, t.val().indexOf(".") + 3))
    }, 1);
    i.indexOf(".") != -1 && i.substring(i.indexOf(".")).length > 2 && n.which != 0 && n.which != 8 && $(this)[0].selectionStart >= i.length - 2 && n.preventDefault()
});
$(document).on("paste", ".number-class", function (n) {
    var t = n.originalEvent.clipboardData.getData("Text");
    if (isNaN(parseFloat(t))) return false
    $.isNumeric(t) ? t.substring(t.indexOf(".")).length > 3 && t.indexOf(".") > -1 && (n.preventDefault(),
        $(this).val(t.substring(0, t.indexOf(".") + 3))) : n.preventDefault()
});
// ---------------------------------------------------------------alert--------------------------------------------------------------
const showAlert = () => { $('.alert').show(); LogoShiftDown() }
const hideAlert = () => { $('.alert').hide(); LogoShiftUp() }
const LogoShiftDown = () => {

    if ($(window).width() < 450) {
        $('.container-fluid').css('padding-top', '9rem')

    } else {
        $('.container-fluid').css('padding-top', '3rem')
    }
}
const LogoShiftUp = () => $('.container-fluid').css('padding-top', '1rem');

// ====================================================================================================================================
function addComma(t) {
    return t.value = addthousandseprator(t.value)
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

function resetForm80TTA() {
    $("#amtIntrest80TTA").val("0");
    $("#deductionAmt80TTA").val("0").prop("readonly", !0);
    $("#ayear80TTA").val('');
    $("#resStatus80TTA").val('')
}

$(document).ready(function () {
    hideAlert()
    $("#deductionAmt80TTA").val("0").prop("readonly", !0);
});


$(document).on("change", "input[type=radio][name=radioOption]", function () {
    var t = $("input[name='radioOption']:checked").val(), n;
    t == "No" ? (n = $("#ayear80TTA").find(":selected").val(),
        $("#amtIntrest80TTA").val("").prop("readonly", !0),
        $("#amtIntrest80TTA").attr("disabled", "disabled"),
        $("#ayear80TTA").val(n).attr("disabled", "disabled"),
        $("#resStatus80TTA").val('').attr("disabled", "disabled"),
        $("#deductionAmt80TTA").val(0).prop("readonly", !0),
        console.log(n),
        (n == "3" || n == "4" || n == "5") ?
            (showAlert(),
                document.getElementById("income_and_tax_calculator_alert_text").innerHTML = 'Senior citizen are allowed deduction u/s 80TTB instead of 80TTA from AY 2019-20') :
            (showAlert(),
                document.getElementById("income_and_tax_calculator_alert_text").innerHTML = 'This deduction is applicable for individual/HUF only (other than Senior Citizen). Senior citizens are allowed deduction u/s 80TTB instead of 80TTA from AY 2019-20 onwards')
    ) : t == "Yes" && ($("#amtIntrest80TTA").prop("readonly", !1),
        $("#amtIntrest80TTA").removeAttr("disabled"),
        $("#ayear80TTA").removeAttr("disabled"),
        $("#resStatus80TTA").removeAttr("disabled"),
        hideAlert(),
        resetForm80TTA())
});
$(document).on("change", "#amtIntrest80TTA,#resStatus80TTA,#ayear80TTA", function () {
    var n = $("#ayear80TTA").find(":selected").val(), t;
    (parseInt(n) > 2 && parseInt(n) < 6) ? ($("#divLiteral12").show(),
        $("#divLiteral1").hide()) : ($("#divLiteral12").hide(),
            $("#divLiteral1").show());
    t = $("#resStatus80TTA").find(":selected").val();
    n === "" ? (
        showAlert(),
        document.getElementById("income_and_tax_calculator_alert_text").innerHTML = '<strong>Error ! !</strong> Please select assessment year.',
        $("#deductionAmt80TTA").val("0").prop("readonly", !0)) : t === "" ? (
            showAlert(),
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = '<strong>Error ! !</strong> Please select Interest income from.',

            $("#deductionAmt80TTA").val("0").prop("readonly", !0)) : (hideAlert())
});
$(document).on("click", "#reset80TTA", function () {
    resetForm80TTA()
});