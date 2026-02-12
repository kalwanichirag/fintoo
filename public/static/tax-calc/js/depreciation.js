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
    // if (!e.value || e.value === "") {
    //     handleInvalidInput(e)
    // } else {
    //     e.style.borderColor = "#dee2e6";
    //     $(e).next(".required-msg").hide()
    // }
};

const handleInvalidInput = (t) => {
    t.style.borderColor = "red";
    $(t).next(".required-msg").show()
}

const resetValidationIndicators = () => {
    $('.form-control').css('borderColor', "#dee2e6");
    $('.required-msg').hide();
}

const resetTab1 = () => {
    resetValidationIndicators()
}
const resetTab2 = () => {
    resetValidationIndicators()
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
const showAlert = () => { $('.alert').show(); LogoShiftDown() }
const hideAlert = () => { $('.alert').hide(); LogoShiftUp() }
const LogoShiftDown = () => $('.container-fluid').css('padding-top', '3rem');
const LogoShiftUp = () => $('.container-fluid').css('padding-top', '1rem');

// ==================================================================================================================================
$(document).ready(function () {
    $("#amount_full").prop('disabled', true);
    $("#amount_half").prop('disabled', true);

    $('#RateOfAdditionalDepreciationSelect2').append(`<option selected="selected" value="1">5</option>`)
    $('#RateOfAdditionalDepreciationSelect2').append(`<option value="2">10</option>`)
    BlockOfAssetsSelect1_5()
    var year1 = new Date().getFullYear();
    for (i = 0; i < 6; i++) {
        get_year2 = year1 + 1;
        var year2 = get_year2.toString().substr(-2);
        $('#AssessmentYearSelect1').append(`<option value="${i + 1}">${year1.toString() + "-" + year2.toString()}</option>`)
        year1 -= 1
    }

    var year2 = new Date().getFullYear();
    for (i = 0; i < 6; i++) {
        get_year2_2 = year2 + 1;
        var year2_2 = get_year2_2.toString().substr(-2);
        $('#AssessmentYearSelect2').append(`<option value="${i + 1}">${year2.toString() + "-" + year2_2.toString()}</option>`)
        year2 -= 1
    }
});

const AssessmentYearSelect1Change = (t) => {
    if (t.value !== "" && t.value !== "6") {
        BlockOfAssetsSelect1_3()
    } else {
        BlockOfAssetsSelect1_5()
    }
}

const RateOfAdditionalDepreciationSelect1Change = (t) => {
    console.log(t.value)
    if (t.value === "1") {
        $("#amount_full").prop('disabled', true);
        $("#amount_half").prop('disabled', true);
    } else {
        $("#amount_full").prop('disabled', false);
        $("#amount_half").prop('disabled', false);
    }
}

const BlockOfAssetsSelect1_3 = () => {
    $('#BlockOfAssetsSelect1 option').each(function () {
        $(this).remove();
    });
    $('#BlockOfAssetsSelect1').append(`<option selected="selected" value="1">15</option>`)
    $('#BlockOfAssetsSelect1').append(`<option value="2">30</option>`)
    $('#BlockOfAssetsSelect1').append(`<option value="3">40</option>`)
}

const BlockOfAssetsSelect1_5 = () => {
    if ($('#BlockOfAssetsSelect1 option').length > 0) {
        $('#BlockOfAssetsSelect1 option').each(function () {
            $(this).remove();
        });
    }
    $('#BlockOfAssetsSelect1').append(`<option selected="selected" value="1">15</option>`)
    $('#BlockOfAssetsSelect1').append(`<option value="2">30</option>`)
    $('#BlockOfAssetsSelect1').append(`<option value="3">40</option>`)
    $('#BlockOfAssetsSelect1').append(`<option value="4">50</option>`)
    $('#BlockOfAssetsSelect1').append(`<option value="5">60</option>`)
    $('#BlockOfAssetsSelect1').append(`<option value="6">80</option>`)
    $('#BlockOfAssetsSelect1').append(`<option value="7">100</option>`)
}

const BlockOfAssetsSelect2Change = (t) => {
    if ($('#RateOfAdditionalDepreciationSelect2 option').length > 0) {
        $('#RateOfAdditionalDepreciationSelect2 option').each(function () {
            $(this).remove();
        });
    }
    switch (t.value) {
        case '1':
            if ($('#AssessmentYearSelect2').val() === '6') {
                $('#RateOfAdditionalDepreciationSelect2').append(`<option selected="selected" value="1">5</option>`)
                $('#RateOfAdditionalDepreciationSelect2').append(`<option value="2">10</option>`)
                $('#RateOfAdditionalDepreciationSelect2').append(`<option value="3">100</option>`)
            } else {
                $('#RateOfAdditionalDepreciationSelect2').append(`<option selected="selected" value="1">5</option>`)
                $('#RateOfAdditionalDepreciationSelect2').append(`<option value="2">10</option>`)
            }
            break;
        case '2':
            $('#RateOfAdditionalDepreciationSelect2').append(`<option selected="selected" value="1">10</option>`)
            break;
        case '3':
            $('#RateOfAdditionalDepreciationSelect2').append(`<option selected="selected" value="1">25</option>`)
            break;
        case '4':
            $('#RateOfAdditionalDepreciationSelect2').append(`<option selected="selected" value="1">20</option>`)
            break;

        default:
            break;
    }
}

const AssessmentYearSelect2Change = (t) => {
    // console.log($('#RateOfAdditionalDepreciationSelect2 option').length, $('#RateOfAdditionalDepreciationSelect2 option'))
    // if ($('#RateOfAdditionalDepreciationSelect2 option').length > 0) {
    //     $('#RateOfAdditionalDepreciationSelect2 option').each(function () {
    //         $(this).remove();
    //     });
    // }
    // if (t.value == "6") {
    //     $('#RateOfAdditionalDepreciationSelect2').append(`<option selected="selected" value="1">5</option>`)
    //     $('#RateOfAdditionalDepreciationSelect2').append(`<option value="2">10</option>`)
    //     $('#RateOfAdditionalDepreciationSelect2').append(`<option value="2">100</option>`)
    // } else {
    //     $('#RateOfAdditionalDepreciationSelect2').append(`<option selected="selected" value="1">5</option>`)
    //     $('#RateOfAdditionalDepreciationSelect2').append(`<option value="2">10</option>`)
    // }
    BlockOfAssetsSelect2Change($('#BlockOfAssetsSelect2')[0])
}