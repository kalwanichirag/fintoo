const handleTabSelection = (evt, cityName) => {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

const onBlurChange = (e) => {
    if (!e.value || e.value === "") {
        e.style.borderColor = "red";
    } else {
        e.style.borderColor = "#dee2e6";
    }
};
const resetTab1 = () => {
    document.getElementById("AssessmentYearSelect1").value = "",
        document.getElementById("employer_medical_expenditure").value = "",
        document.getElementById("is_specified_emp1").checked = false,
        document.getElementById("taxable_value1").value = ''
}
const resetTab2 = () => {
    document.getElementById("AssessmentYearSelect2").value = "",
        document.getElementById("is_specified_emp2").checked = false,
        document.getElementById("gross_total_income").value = "",
        document.getElementById("abrod_cost").value = "",
        document.getElementById("permissible_limit").value = "",
        document.getElementById("travelling_expenses_incurred").value = ""
    document.getElementById("taxable_value1").value = ''
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

// const floatValidation = (t, e) => {

//     const regexx = /^[.-\d]*$/g

//     if (!regexx.test(t.value + e.key)) {
//         return false
//     }
//     if (t.value.includes('-') && t.value.charAt(0) !== '-') {
//         return false
//     }

//     if (e.key === "." && !t.value.includes('.')) return;
//     if (e.key === "." && t.value.includes('.')) return false;

//     let selection = document.getSelection();
//     let strSelection = selection.toString();

//     if (strSelection) {
//         if (strSelection === t.value) return

//         if (e.key === "-") {
//             if (t.value.startsWith(strSelection)) {
//                 return
//             } else {
//                 return false
//             }
//         }
//         return
//     }

//     if ((t.value + e.key).length > 1 && e.key === "-") {
//         if (!t.value.includes('-')) {
//             t.value = e.key + t.value
//             return false
//         } else {
//             return false
//         }
//     }

//     if (t.value.length > 0)
//         if (e.key === "." && t.value.includes('.')) {
//             return false
//         }
//     if (e.key === "-" && t.value.includes('-')) {
//         return false
//     }
//     if (t.value.includes('.') && t.value.includes('-')) {
//         if (t.value.length == 17) return false;
//     } else if (t.value.includes('.') || t.value.includes('-')) { if (t.value.length == 16) return false; }

//     else if (t.value.length == 15) return false;

// }

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
// ====================================================================================================================================
function lockcontrol() {
    return !1
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
function ValidateNumberKeyUp(n) {
    var t, i, r;
    if (document.selection.type != "Text") {
        if (t = getCaretPosition(n),
            i = n.value.length,
            UnFormatNumber(n),
            r = /^-?\d+\.{0,1}\d*$/.test(n.value),
            !r)
            return setSelectionRange(n, t, t),
                !1;
        n.value = FormatNumber(n.value);
        i = n.value.length - i;
        setSelectionRange(n, t + i, t + i)
    }
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
function FormatNumber(n) {
    var o = n, f = !1, t;
    n.charAt(0) == "-" && (f = !0,
        n = n.substr(1, n.length - 1));
    psplit = n.split(".");
    var i = psplit[0]
        , r = []
        , e = i.length
        , s = Math.floor(e / 3)
        , u = i.length % 3 || 3;
    for (t = 0; t < e; t += u)
        t != 0 && (u = 3),
            r[r.length] = i.substr(t, u),
            s -= 1;
    return n = r.join(","),
        o.indexOf(".") != -1 && (n += "." + psplit[1]),
        f == !0 && (n = "-" + n),
        n
}
function UnFormatNumber(n) {
    n.value != "" && (n.value = n.value.replace(/,/gi, ""))
}
function getCaretPosition(n) {
    var n = window.event.srcElement
        , t = n.value.length;
    if (n.createTextRange)
        for (objCaret = document.selection.createRange().duplicate(); objCaret.parentElement() == n && objCaret.move("character", 1) == 1;)
            --t;
    return t
}
function setSelectionRange(n, t, i) {
    if (n.setSelectionRange)
        n.focus(),
            n.setSelectionRange(t, i);
    else if (n.createTextRange) {
        var r = n.createTextRange();
        r.collapse(!0);
        r.moveEnd("character", i);
        r.moveStart("character", t);
        r.select()
    }
}
function chkIntInput(n, t) {
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

function CalculateIndexedCostAcquisition() {
    var t = $("#txtTransferredAssets").getFloat(), n = $("#txtPreviousOwnerAssets").getFloat(), f;
    console.log(t, n)
    if (n > 0)
        if (t > n) {
            n = n === 0 ? 1 : n;
            var i = $("#txtFairMarketValue").getFloat()
                , r = $("#txtCostOfAcquisition").getFloat()
                , u = i > r ? i : r;
            $("#txtNotionalCostOfAcquisition").val(u.toFixed(2));
            f = u * t / n;
            console.log(f)
            $("#txtIndexedCostOfAcquisition").val(f.toFixed(2))
            hideAlert(); LogoShiftUp();
        } else {
            showAlert(); LogoShiftDown();
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong>  Base Year must be less than Asset Transferred.";
            $("#txtPreviousOwnerAssets").val("")
        }
}

$.fn.getFloat = function () {
    var t = this.val() === "" ? "0" : this.val()
        , n = parseFloat(t);
    return isNaN(n) ? 0 : n
}
    ;

$(document).ready(function () {
    // $(document).on("click", "#btnResetPage", function () {
    //     $(document).resetPage()
    // });
    $(document).on("change", "#radioAssetRequiredYes,#radioAssetRequiredNo,#radioPreviousOwnerYes,#radioPreviousOwnerNo", function () {
        var n, t, i, r, u, f;
        this.checked && this.id === "radioAssetRequiredYes" ? ($("#areaFairMarketValue").show(),
            n = 'Base Year',
            $("#lbtAssetHeldBy").text(n)) : this.checked && this.id === "radioAssetRequiredNo" ? ($("#areaFairMarketValue").hide(),
                $("#txtFairMarketValue").val(""),
                t = 'Asset is first held by Previous Owner',
                $("#lbtAssetHeldBy").text(t)) : this.checked && this.id === "radioPreviousOwnerYes" ? (i = 'Cost of Acquisition/ Improvement to Previous Owner',
                    $("#lblCostOfAquiPrevYear").text(i)) : this.checked && this.id === "radioPreviousOwnerNo" && (r = $("#radioAssetRequiredYes").is(":checked"),
                        u = 'Cost of Acquisition/ Improvement’ to Assesse',
                        $("#lblCostOfAquiPrevYear").text(u),
                        r || (f = 'Asset is first held by Assesse'),
                        $("#lbtAssetHeldBy").text(f));
        CalculateIndexedCostAcquisition()
    });
    $(document).on("blur", "input[type=text]", function () {
        CalculateIndexedCostAcquisition()
    })
});

