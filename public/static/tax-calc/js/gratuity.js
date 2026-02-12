// $('input[type="date"]').change(function () {
//     this.value = this.value.split("-").join("/");
// });

const closeClick = () => {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut()
}


function mydate(t) {
    const dateView = t.parentElement;
    const actualDateElem = dateView.querySelector('.actualDate');
    const placeHolderDateDateElem = dateView.querySelector('.placeHolderDate');
    actualDateElem.hidden = false;
    console.log(actualDateElem.value, placeHolderDateDateElem.value)
    placeHolderDateDateElem.hidden = true;
    actualDateElem.showPicker();
}
function mydate1(t) {
    const dateView = t.parentElement;
    const actualDateElem = dateView.querySelector('.actualDate');
    const placeHolderDateDateElem = dateView.querySelector('.placeHolderDate');
    const newDate = new Date(actualDateElem.value);
    d = newDate.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
    if (newDate.toString().replace(/ /g, '') === 'InvalidDate') {
        placeHolderDateDateElem.value = ""
    } else {
        placeHolderDateDateElem.value = d
    }
    // dt = d.getDate();
    // mn = d.getMonth();
    // mn++;
    // yy = d.getFullYear();
    // document.getElementById("txtGratuitybecomespayableon").value = dt + "/" + mn + "/" + yy

    placeHolderDateDateElem.hidden = false;
    $(placeHolderDateDateElem).trigger("change");
    // actualDateElem.value = '';
    actualDateElem.hidden = true;
}

// 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000

const onBlurChange = (e) => {

    if (!e.checkValidity()) {
        // e.style.borderColor = "red";
        // handleInvalidInput(e)
    } else {
        e.style.borderColor = "#dee2e6";
        $(e).next(".required-msg").hide()
    }
};

const onIntOnlyChange = (e) => {
    e.value = Math.ceil(e.value)
};

const handleInvalidInput = (t) => {
    t.style.borderColor = "red";
    $(t).next(".required-msg").show()
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

// ==================================================================================================================================
function isNumberKey(n) {
    var t = n.which ? n.which : n.keyCode;
    return t != 46 && t > 31 && (t < 48 || t > 57) ? !1 : !0
}
function dstrToUTC(n) {
    var t = n.split("/"), i = 0, r, u;
    return i <= 12 && (i = parseInt(t[0], 10)),
        r = parseInt(t[1], 10),
        u = parseInt(t[2], 10),
        Date.UTC(u, i - 1, r, 0, 0, 0)
}
function datediff(n, t) {
    var i = dstrToUTC(n)
        , r = dstrToUTC(t);
    return (r - i) / 864e5
}

function calculateTotal10Gra() {
    var n = parseFloat(0)
        , t = 0;
    $(".sumSalaryGra").each(function () {
        var t = $(this).parent().parent().find(".sumSalaryGra").val();
        t != "" && (n += parseFloat(t))
    });
    $(".total10SalGra").val(n.toFixed(2));
    t = n / 10;
    $("#avg10SalGra").val(t.toFixed(2))
}
function stringToDate(n, t, i) {
    var e = t.toLowerCase()
        , r = e.split(i)
        , u = n.split(i)
        , o = r.indexOf("mm")
        , s = r.indexOf("dd")
        , h = r.indexOf("yyyy")
        , f = parseInt(u[o]);
    return f -= 1,
        new Date(u[h], f, u[s])
}
function calculateTotal10Ls() {
    var n = parseFloat(0)
        , t = 0;
    $(".sumSalary").each(function () {
        var t = $(this).parent().parent().find(".sumSalary").val();
        t != "" && (n += parseFloat(t))
    });
    $(".total10Sal").val(Math.round(n));
    t = n / 10;
    $("#avg10Sal").val(Math.round(t))
}
function calculateTotalLeave() {
    var n = parseFloat(0)
        , t = parseFloat(0);
    $(".totalNoLeave").each(function () {
        var i = $(this).parent().parent().find(".totalNoLeave").val(), r;
        i = parseFloat(i === "" ? 0 : i);
        r = $(this).parent().parent().find(".noYears").val();
        r = parseFloat(r === "" ? 0 : r);
        i != "" && (n += parseFloat(i));
        t += parseFloat(r)
    });
    $(".sumTLeave").val(n.toFixed(2));
    $(".sumYears").val(t.toFixed(2))
}
function calculateProfits() {
    var t = 0, i, n;
    $(".Actual_profit44AD").each(function () {
        i = $(this).parent().parent().find(".profits44AD").val();
        n = $(this).parent().parent().find(".Actual_profit44AD").val();
        $.isNumeric(n) && parseFloat(n) > 0 ? t += parseFloat(n) : $.isNumeric(i) && (t += parseFloat(i))
    });
    $(".sums44AD").val(Math.ceil(t))
}
function calculateGrossturnover() {
    var n = 0;
    return $(".grossturnovers44AD").each(function () {
        $.isNumeric(this.value) && (n += parseFloat(this.value))
    }),
        $(".sum44AD").val(Math.ceil(n)),
        n
}
function checkAlphaNumeric(n) {
    if (n.ctrlKey || n.altKey)
        n.preventDefault();
    else {
        var t = n.keyCode;
        t == 8 || t == 32 || t == 46 || t >= 35 && t <= 40 || t >= 65 && t <= 90 || t >= 48 && t <= 57 || t >= 96 && t <= 105 || n.preventDefault()
    }
}
function ditmodalpopup(n, t) {
    $("#" + n).fadeIn();
    $("#" + t).fadeIn();
}
function validDate(n) {
    if (n === "") return true
    var t;
    if (n != "") {
        console.log('innneerr', n)
        if ((t = n.split("/"),
            t.length != 3) || t[0].length != 2 || t[1].length != 2 || t[2].length != 4) {
            return !1;
        }
        var r = parseInt(t[0], 10)
            , u = parseInt(t[1], 10)
            , f = parseInt(t[2], 10)
            , i = new Date(f, u - 1, r);
        return i.getFullYear() == f && i.getMonth() + 1 == u && i.getDate() == r
    }
    return !0
}
function ConvertToDate(n) {
    var t, i;
    return n != null && (t = n.split("/")),
        i = "",
        t.length === 3 && (i = new Date(t[2], t[1] * 1 - 1, t[0])),
        i
}
var fixedInt = 1e4
// , max_fields = 10
// , x = 1
// , deduAbove80 = 125e3
// , deduBelow80 = 75e3
// , maxExempt = 1e6
// , fixed3lacs = 3e5
// , max_fields44AD = 20
// , max_turnover = 2e7
// , count = 1
// , minimumPercent = .06
// , minPer = 6;
$(document).ready(function () {
    $(".error").hide();
    $("#ls_second_window").hide();
    $("#exeptionClaimedGra").val(0);
    $(".gratuityClass").hide();
    $("#exeGratAmtGra").attr("readonly", !0).addClass("input-disabled");
    $("#taxGratAmtGra").attr("readonly", !0).addClass("input-disabled");
});

$("#gratuityAmtGra").on("blur", function () {
    var n = $("#gratuityAmtGra").val();
    n != "" && (n = parseFloat(n),
        n = n.toFixed(2),
        $("#gratuityAmtGra").val(n))
});
$(document).on("click", "#computeYearGra", function () {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut();
    ditmodalpopup("gra-dialogYearGra", "ditover")
});
$(document).on("change", "#joiningDtGra,#retireDtGra", function () {
    var n = "", t = "", f, r, u;
    if ($("#joiningDtGra").val() != "" && (n = $("#joiningDtGra").val()),
        $("#retireDtGra").val() != "" && (t = $("#retireDtGra").val()),
        console.log(t, 'invD'),
        (validDate(n) != 1 || validDate(t) != 1) && (n != "" || t != ""))
        f = 'Res.msg_INVALID_DATE',
            alert(f, 'kdsmkjcsd');
    else if (n != "" && t != "") {
        r = "";
        r = ConvertToDate(t);
        u = "";
        u = ConvertToDate(n);
        var i = r - u
            , e = Math.floor(i / 31536e6)
            , o = Math.floor(i % 31536e6 / 2628e6)
            , s = Math.floor(i % 31536e6 % 2628e6 / 864e5);
        $("#comYearGra").val(e);
        $("#comMonthGra").val(o);
        $("#comDayGra").val(s);
        $("#isUnderGatAct").prop("checked") == !0 ? $("#comMonthGra").val() >= 6 && $("#serviceLengthGra").val(parseFloat($("#comYearGra").val()) + 1).trigger('blur') : $("#serviceLengthGra").val($("#comYearGra").val()).trigger('blur');
        i < 0 && ($("#comYearGra").val(0),
            $("#comMonthGra").val(0),
            $("#comDayGra").val(0))
    } else
        $("#comYearGra").val(0),
            $("#comMonthGra").val(0),
            $("#comDayGra").val(0)
});
$(document).on("focus", "#joiningDtGra,#retireDtGra", function () {
    var n = "", t = "", r, u;
    if ($("#joiningDtGra").val() != "" && (n = $("#joiningDtGra").val()),
        $("#retireDtGra").val() != "" && (t = $("#retireDtGra").val()),
        validDate(n) == 1 && validDate(t) == 1 || n == "" && t == "")
        if (n != "" && t != "") {
            r = "";
            r = ConvertToDate(t);
            u = "";
            u = ConvertToDate(n);
            var i = r - u
                , f = Math.floor(i / 31536e6)
                , e = Math.floor(i % 31536e6 / 2628e6)
                , o = Math.floor(i % 31536e6 % 2628e6 / 864e5);
            $("#comYearGra").val(f);
            $("#comMonthGra").val(e);
            $("#comDayGra").val(o);
            $("#isUnderGatAct").prop("checked") == !0 && ($("#comMonthGra").val() >= 6 ? $("#serviceLengthGra").val(parseFloat($("#comYearGra").val()) + 1).trigger('blur') : $("#serviceLengthGra").val($("#comYearGra").val())).trigger('blur');
            $("#serviceLengthGra").val($("#comYearGra").val()).trigger('blur');
            i < 0 && ($("#comYearGra").val(0),
                $("#comMonthGra").val(0),
                $("#comDayGra").val(0))
        } else
            $("#comYearGra").val(0),
                $("#comMonthGra").val(0),
                $("#comDayGra").val(0)
});
$(document).on("click", "#calYearDoneGra", function () {
    $("#isUnderGatAct").prop("checked") == !0 ? $("#comMonthGra").val() >= 6 && $("#serviceLengthGra").val(parseFloat($("#comYearGra").val()) + 1).trigger('blur') : $("#serviceLengthGra").val($("#comYearGra").val());
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut()
});
$(document).on("click", "#compute3Salary", function () {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut();
    ditmodalpopup("gra-dialog3MonthGra", "ditover")
});
$(document).on("click", "#close3MonthGra", function () {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut()
});
$(document).on("blur", "#wages3monthGra", function () {
    var n = parseFloat($("#wages3monthGra").val() / 3);
    $("#3monthSalGra").val(n.toFixed(2));
    $("#lastDrownSalaryGra").val($("#3monthSalGra").val())
});
$(document).on("click", "#compute10Month", function () {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut();
    ditmodalpopup("gra-dialogAvgSalaryGra", "ditover")
});
$(document).on("blur", ".basicSalGra", function () {
    var n = $(this).parent().parent().find(".basicSalGra").val()
        , t = $(this).parent().parent().find(".allowanceGra").val()
        , i = $(this).parent().parent().find(".commissionGra").val()
        , r = parseFloat(n === "" ? 0 : n) + parseFloat(t === "" ? 0 : t) + parseFloat(i === "" ? 0 : i);
    $(this).parent().parent().find(".sumSalaryGra").val(r.toFixed(2));
    calculateTotal10Gra();
    $("#avg10SalaryGra").val($("#avg10SalGra").val()).trigger('blur')
});
$(document).on("change", "#avg10SalaryGra", function () {
    console.log('avg10SalaryGra', this.value)
});
$(document).on("blur", ".allowanceGra", function () {
    $(".basicSalGra").trigger("blur")
});
$(document).on("blur", ".commissionGra", function () {
    $(".basicSalGra").trigger("blur")
});
$(document).on("click", "#calculate10monthGra", function () {
    calculateTotal10Gra()
});
$(document).on("click", "#close10MonthGra", function () {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut()
});
$(document).on("change", "#isUnderGatAct", function () {
    var n = 'Average of last drawn three months wages (excluding OT)'
        , t = 'Last drawn salary';
    $("#isSeasonal").prop("checked", !1);
    $("#isWagesBased").prop("checked", !1);
    $("#isSeasonal").removeAttr("disabled");
    $("#isWagesBased").removeAttr("disabled");
    $("#isUnderGatAct").prop("checked") == !0 && $("#isWagesBased").prop("checked") == !1 ? ($("#LblLastDrawnSalary").text(t),
        $("#compute3Salary").hide()) : $("#isUnderGatAct").prop("checked") == !0 && $("#isSeasonal").prop("checked") == !0 && $("#isWagesBased").prop("checked") == !0 ? ($("#LblLastDrawnSalary").text(n),
            $("#compute3Salary").show()) : ($("#LblLastDrawnSalary").text(n),
                $("#compute3Salary").show())
});
$(document).on("change", "#isSeasonal", function () {
    var n = 'Average of last drawn three months wages (excluding OT)'
        , t = 'Last drawn salary';
    $("#isSeasonal").prop("checked") == !0 ? ($("#isWagesBased").prop("checked", !1),
        $("#isWagesBased").attr("disabled", "disabled")) : $("#isWagesBased").removeAttr("disabled");
    $("#isUnderGatAct").prop("checked") == !0 && $("#isWagesBased").prop("checked") == !1 ? ($("#LblLastDrawnSalary").text(t),
        $("#compute3Salary").hide()) : $("#isUnderGatAct").prop("checked") == !0 && $("#isSeasonal").prop("checked") == !0 && $("#isWagesBased").prop("checked") == !0 ? ($("#LblLastDrawnSalary").text(n),
            $("#compute3Salary").show()) : ($("#LblLastDrawnSalary").text(n),
                $("#compute3Salary").show())
});
$(document).on("change", "#isWagesBased", function () {
    var n = 'Average of last drawn three months wages (excluding OT)'
        , t = 'Last drawn salary';
    $("#isWagesBased").prop("checked") == !0 ? ($("#isSeasonal").prop("checked", !1),
        $("#isSeasonal").attr("disabled", "disabled")) : $("#isSeasonal").removeAttr("disabled");
    $("#isUnderGatAct").prop("checked") == !0 && $("#isWagesBased").prop("checked") == !1 ? ($("#LblLastDrawnSalary").text(t),
        $("#compute3Salary").hide()) : $("#isUnderGatAct").prop("checked") == !0 && $("#isSeasonal").prop("checked") == !0 && $("#isWagesBased").prop("checked") == !0 ? ($("#LblLastDrawnSalary").text(n),
            $("#compute3Salary").show()) : ($("#LblLastDrawnSalary").text(n),
                $("#compute3Salary").show())
});
$(document).on("change", "#isUnderGatAct", function () {
    $("#isUnderGatAct").prop("checked") == !0 ? ($(".gratuityClass").show(),
        $("#isWagesBased").attr("checked", !1),
        $("#isWagesBased").trigger("change"),
        $(".noGatAct").hide(), $("#avg10SalaryGra").prop('disabled', true)) : ($(".gratuityClass").hide(),
            $("#isWagesBased").attr("checked", !1),
            $("#isWagesBased").trigger("change"),
            $(".noGatAct").show(), $("#avg10SalaryGra").prop('disabled', false))
});
$(document).on("change", "#isWagesBased", function () {
    $("#isWagesBased").prop("checked") == !0 ? ($("#lastDrownSalaryGra").val(""),
        $("#lastDrownSalaryGra").attr("readonly", !0),
        $("#lastDrownSalaryGra").addClass("input-disabled")) : ($("#lastDrownSalaryGra").val(""),
            $("#lastDrownSalaryGra").attr("readonly", !1),
            $("#lastDrownSalaryGra").removeClass("input-disabled"))
});
$(document).on("change", "#resStatusGra", function () {
    $("#resStatusGra").val() === "otherEmplr" || $("#resStatusGra").val() === "statutoryEmplr" ? ($("#divUnderGatAct").show(),
        $("#exeGratAmtGra").val(""),
        $("#taxGratAmtGra").val(""),
        $("#gratuityAmtGra").val(""), $("#serviceLengthGra").prop('disabled', false),
        $("#avg10SalaryGra").prop('disabled', false)) : ($("#divUnderGatAct").hide(),
            $("#isUnderGatAct").attr("checked", !1),
            $("#isUnderGatAct").trigger("change"),
            $("#exeGratAmtGra").val(""),
            $("#taxGratAmtGra").val(""),
            $("#gratuityAmtGra").val(""),
            $("#serviceLengthGra").prop('disabled', true),
            $("#avg10SalaryGra").prop('disabled', true))
});
$(document).on("change", ".number-only", function (n) {
    if (this.value === '.') {
        return this.value = 0.00
    }
});
$(document).on("keypress", ".number-only", function (n) {
    var t = $(this), i;
    (n.which != 46 || t.val().indexOf(".") != -1) && (n.which < 48 || n.which > 57) && n.which != 0 && n.which != 8 && n.preventDefault();
    i = $(this).val();
    n.which == 46 && i.indexOf(".") == -1 && setTimeout(function () {
        t.val().substring(t.val().indexOf(".")).length > 3 && t.val(t.val().substring(0, t.val().indexOf(".") + 3))
    }, 1);
    i.indexOf(".") != -1 && i.substring(i.indexOf(".")).length > 2 && n.which != 0 && n.which != 8 && $(this)[0].selectionStart >= i.length - 2 && n.preventDefault()
});
$(document).bind("paste", ".number-only", function (n) {
    var t = n.originalEvent.clipboardData.getData("Text");
    if (isNaN(parseFloat(t))) return false
    $.isNumeric(t) ? t.substring(t.indexOf(".")).length > 3 && t.indexOf(".") > -1 && (n.preventDefault(),
        $(this).val(t.substring(0, t.indexOf(".") + 3))) : n.preventDefault()
});

$(document).on("change", "#ayearGra,#txtGratuitybecomespayableon,#exeptionClaimedGra,#isSeasonal,#gratuityAmtGra,#serviceLengthGra,#avg10SalaryGra,#resStatusGra,#isUnderGatAct,#avg10SalaryGra,#isWagesBased,#wages3monthGra,#lastDrownSalaryGra", function () {
    if ($("#exeptionClaimedGra").val() === ".") $("#exeptionClaimedGra").val(0.00)
    if ($("#lastDrownSalaryGra").val() === ".") $("#lastDrownSalaryGra").val(0.00)
    var h = "", l, a, v, y, r, t, u, e, s, f, c, i;
    if ($("#txtGratuitybecomespayableon").val() != "" && (h = $("#txtGratuitybecomespayableon").val(),
        validDate(h) != 1 && h != "" && (l = 'Invalid date format',
            alert(l),
            $("#txtGratuitybecomespayableon").val(""))),
        $("#ayearGra").val() != "" && parseInt($("#ayearGra").val()) < 7 ? $("#divGratuitybecomespayableon").show() : ($("#txtGratuitybecomespayableon").val(""),
            $("#divGratuitybecomespayableon").hide()),
        $("#wages3monthGra").val() != "" && (a = parseFloat($("#wages3monthGra").val() / 3),
            $("#3monthSalGra").val(a.toFixed(2)),
            $("#lastDrownSalaryGra").val($("#3monthSalGra").val())),
        v = stringToDate($("#txtGratuitybecomespayableon").val(), "dd/MM/yyyy", "/"),
        y = stringToDate("29/03/2018", "dd/MM/yyyy", "/"),
        maxExempt = v >= y ? 2e6 : 1e6,
        r = parseFloat($("#exeptionClaimedGra").val() === "" ? 0 : $("#exeptionClaimedGra").val()),
        r = r.toFixed(2),
        t = parseFloat($("#gratuityAmtGra").val() === "" ? 0 : $("#gratuityAmtGra").val()),
        t = t.toFixed(2),
        u = parseFloat($("#serviceLengthGra").val() === "" ? 0 : $("#serviceLengthGra").val()),
        u = u.toFixed(2),
        e = parseFloat($("#avg10SalaryGra").val() == "" ? 0 : $("#avg10SalaryGra").val()),
        e = e.toFixed(2),
        $("#gratuityAmtGra").val() === "" || $("#gratuityAmtGra").val() <= 0)
        // $("#gratuityAmtGra").focus().addClass("focused"),
        $("#infoUserGra").html("Please fill Gratuity received."),
            $("#infoUserGra").show(0).delay(5e3).hide(0);
    else if ($("#resStatusGra").val() === "0")
        // $("#gratuityAmtGra").removeClass("focused"),
        $("#resStatusGra").focus().addClass("focused"),
            $("#infoUserGra").html("Please select Employer Type."),
            $("#infoUserGra").show(0).delay(5e3).hide(0);
    else if ($("#resStatusGra").val() === "govtEmplr" || $("#resStatusGra").val() === "localAuthEmplr")
        // $("#gratuityAmtGra").removeClass("focused"),
        $("#resStatusGra").removeClass("focused"),
            // $("#exeGratAmtGra").val(t),
            $("#exeGratAmtGra").attr("readonly", !0).addClass("input-disabled")
    // $("#taxGratAmtGra").val("0.00").attr("readonly", !0).addClass("input-disabled");
    else if (
        // $("#gratuityAmtGra").removeClass("focused"),
        $("#resStatusGra").removeClass("focused"),
        $("#isUnderGatAct").prop("checked") == !1)
        if ($("#serviceLengthGra").val() === "" || $("#serviceLengthGra").val() <= 0)
            $("#serviceLengthGra").focus().addClass("focused"),
                $("#infoUserGra").html("Please fill Length of service period."),
                $("#infoUserGra").show(0).delay(5e3).hide(0);
        else if ($("#avg10SalaryGra").val() === "" || $("#avg10SalaryGra").val() <= 0)
            $("#serviceLengthGra").removeClass("focused"),
                $("#avg10SalaryGra").focus().addClass("focused"),
                $("#infoUserGra").html("Please fill Average salary of last 10 months."),
                $("#infoUserGra").show(0).delay(5e3).hide(0);
        else {
            $("#serviceLengthGra").removeClass("focused");
            $("#avg10SalaryGra").removeClass("focused");
            var p = parseFloat(e / 2 * u)
                , w = parseFloat(maxExempt - r)
                , b = [p, w, t]
                , o = Math.min.apply(Math, b);
            o = o.toFixed(2);
            s = t - o;
            s = s.toFixed(2);
            // $("#exeGratAmtGra").val(o).attr("readonly", !0).addClass("input-disabled");
            // $("#taxGratAmtGra").val(s).attr("readonly", !0).addClass("input-disabled")
        }
    else {
        f = 0;
        c = 0;
        f = $("#isUnderGatAct").prop("checked") == !0 ? parseFloat($("#lastDrownSalaryGra").val() === "" ? 0 : $("#lastDrownSalaryGra").val()) : parseFloat($("#wages3monthGra").val() === "" ? 0 : $("#wages3monthGra").val());
        c = $("#isSeasonal").prop("checked") == !1 ? parseFloat(15) : parseFloat(7);
        f = f * c / 26;
        var k = u * f
            , d = parseFloat(maxExempt - r)
            , g = [k, d, t]
            , n = Math.min.apply(Math, g);
        n = n.toFixed(2);
        i = t - n;
        n = n < 0 ? 0 : n;
        n = Math.round(n);
        i = i.toFixed(2);
        i = Math.round(i);
        // $("#exeGratAmtGra").val(n).attr("readonly", !0).addClass("input-disabled");
        // $("#taxGratAmtGra").val(i).attr("readonly", !0).addClass("input-disabled")
    }
});
// ---------------------------------------------------------------alert--------------------------------------------------------------
const showAlert = () => { $('.alert').show(); LogoShiftDown() }
const hideAlert = () => { $('.alert').hide(); LogoShiftUp() }
const LogoShiftDown = () => $('.container-fluid').css('padding-top', '3rem');
const LogoShiftUp = () => $('.container-fluid').css('padding-top', '1rem');