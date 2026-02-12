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

function dayDiffer(n, t) {
    const diffDays = Math.round((t - n) / (1000 * 60 * 60 * 24));
    return diffDays;
}

function AddDynamicRows(n) {
    n = n < 1 ? 1 : n;
    var t = $("div#main-calculation div.div-row").not(".total-row,.thead").length + 1;
    if (n < t) {
        for (i = n; i < t - 1; i++)
            $("div#main-calculation div.total-row:last").prev().remove();
        RecalculateEachResidentialRow()
    } else
        for (i = t; i <= n; i++)
            $("div#template-data .div-row .s-no").text(i),
                $("div#main-calculation div.total-row:last").before($("div#main-template").html())
}

function NumberOfJourney(n) {
    console.log(n.value)
    const regexx = /^[1-9][0-9]*$/g

    if (!regexx.test(n.value)) {
        n.value = ""
        return
    }
    return isNaN(n.value + String.fromCharCode(event.keyCode)) ? (n.style.borderColor = "#FF0000",
        !1) : (n.value > 99 && (n.value = 99),
            n.style.borderColor = "",
            !0)
}

$(document).on("blur", "#number-of-trips", function (n) {
    const regexx = /^[1-9][0-9]*$/g

    if (!regexx.test(this.value)) {
        return n.preventDefault()
    }
});
$(document).on("paste", "#number-of-trips", function (n) {
    const regexx = /^[1-9][0-9]*$/g

    if (!regexx.test(window.event.clipboardData.getData('text'))) {
        return n.preventDefault()
    }
});

function RecalculateEachResidentialRowPopup() {
    $("div#popup-calculation .div-row").not(".thead,.total-row").each(function () {
        var n = 0, t = $(this).find("input.date-start").val(), i = $(this).find("input.date-end").val(), r, u;
        t !== "" && i !== "" && (r = new Date(t),
            u = new Date(i),
            n = dayDiffer(r, u) + 1,
            n = n < 1 ? 0 : n);
        n > 0 && $(this).find("input.date-diff").val(n)
    });
    var n = $("div#popup-calculation .div-row").not(".thead,.total-row").find(".div-cell:nth-child(4)").ColumnsTotal();
    $("div#popup-calculation .total-row").find("input.total-days-difference").val(n)
}

function RecalculateEachResidentialRow() {
    var n, t;
    $("div#main-calculation .div-row").not(".thead,.total-row").each(function () {
        var e = parseInt($("select#assessment-year").val()), u = new Date(e - 1 + "-04-01"), f = new Date(e + "-03-31"), n = 0, o = $(this).find("input.date-start").val(), s = $(this).find("input.date-end").val(), t = !0, i, r;
        o !== "" && s !== "" && (i = new Date(o),
            r = new Date(s),
            (i < u || i > f) && ($(this).find("input.date-start").css({
                "border-color": "#FF0000"
            }).attr("title", "Please enter date between " + u.toDateString() + " and " + f.toDateString() + "."),
                showAlert(),
                document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> Please enter date between " + u.toDateString() + " and " + f.toDateString() + ".",
                t = !1),
            (r < u || r > f) && ($(this).find("input.date-end").css({
                "border-color": "#FF0000"
            }).attr("title", "Please enter date between " + u.toDateString() + " and " + f.toDateString() + "."),
                showAlert(),
                document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> Please enter date between " + u.toDateString() + " and " + f.toDateString() + ".",
                t = !1),
            i > r && ($(this).find("input.date-start").css({
                "border-color": "#FF0000"
            }).attr("title", "The departure date must be greater than the arrival date"),
                showAlert(),
                document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> The departure date must be greater than the arrival date.",
                t = !1),
            t && ($(this).find("input.date-start").css({
                "border-color": ""
            }).attr("title", ""), hideAlert(),
                $(this).find("input.date-end").css({
                    "border-color": ""
                }).attr("title", ""), hideAlert(),
                n = dayDiffer(i, r) + 1,
                n = n < 1 ? 0 : n));
        (n > 0 || !t) && $(this).find("input.date-diff").val(n)
    });
    n = $("div#main-calculation .div-row").not(".thead,.total-row").find(".div-cell:nth-child(4)").ColumnsTotal();
    $("div#main-calculation .total-row").find("input.total-days-difference").val(n);
    t = $("div#residential-input-5").ColumnsTotal();
    SetOutput(n, t)
}
function SetOutput(n, t) {
    var e, o;
    $("input.total-days-difference-final").val(n);
    $("div#first-question,div#third-question,div#forth-question").hide();
    $("#residential-input-5,div.residential-input-other").hide();
    var f = $("select#assessment-year").val()
        , r = parseInt($("select#user-category").val())
        , s = parseInt($("select#citizen-category").val());
    $("#taxpayer-category").text("--");
    var h = !$("#chkPersonOfIndianOrigin").is(":checked")
        , i = "--"
        , u = 60
        , c = $("input.15-lacs-first-question-checked-yes").prop("checked");
    c && (u = 120);
    n > 0 && (n < u ? i = "Non Resident" : n >= u && n <= 181 && r === 4 ? ($("#residential-input-5").show(),
        SetFinancialYearLabel(f)) : n >= u && n <= 181 && r !== 4 ? i = "Non Resident" : n >= 182 && ($("#taxpayer-category").text("--"),
            $("#residential-input-5").show(),
            $("div.residential-input-other").show(),
            SetFinancialYearLabel(f)),
        n >= 182 && (t < 730 ? i = "Not Ordinary Resident" : t >= 730 && ($("div#first-question").show(),
            i = $("input.checked-yes").is(":checked") ? "Ordinary Resident" : "Not Ordinary Resident")),
        n >= u && n <= 181 && r === 4 && t < 365 ? i = "Non Resident" : n >= u && n <= 181 && r === 4 && t >= 365 ? $("div.residential-input-other").show() : f == "2021" && n >= u && n <= 181 && t >= 365 && (i = "Not Ordinary Resident"),
        t >= 365 && r === 4 && (t < 730 ? i = "Not Ordinary Resident" : t >= 730 && ($("div#first-question").show(),
            i = $("input.checked-yes").is(":checked") ? "Ordinary Resident" : "Not Ordinary Resident")));
    (f == "2021" || f == "2022" || f == "2023") && i == "Non Resident" && (r == 1 && h || r == 2 || r == 3 || r == 4 && s == 1) ? (e = $("div#15-lac-first-question").is(":visible"),
        o = $("input.15-lacs-first-question-checked-yes").is(":checked"),
        e ? o ? $("#forth-question").show() : $("#taxpayer-category").text(i) : $("#third-question").show()) : $("#taxpayer-category").text(i)
}
function SetFinancialYearLabel(n) {
    var t = parseFloat(n) - 2
        , i = parseFloat(n.slice(-2)) - 1;
    $("input.fa1").attr("placeholder", "FY " + t + "-" + i);
    $("input.fa2").attr("placeholder", "FY " + (t - 1) + "-" + (i - 1));
    $("input.fa3").attr("placeholder", "FY " + (t - 2) + "-" + (i - 2));
    $("input.fa4").attr("placeholder", "FY " + (t - 3) + "-" + (i - 3));
    $("input.fa5").attr("placeholder", "FY " + (t - 4) + "-" + (i - 4));
    $("input.fa6").attr("placeholder", "FY " + (t - 5) + "-" + (i - 5));
    $("input.fa7").attr("placeholder", "FY " + (t - 6) + "-" + (i - 6))
}

function SetYouAreCalculation(n, t) {
    var i = parseInt(n)
        , r = parseInt(t);
    $("div#divYouAreFirstOption,div#divYouAreForthOption").hide();
    $("#15-lac-first-question,#divYouAreForthOption").hide();
    $('input[name="radio2"]').attr("checked", !1);
    $("#chkPersonOfIndianOrigin").prop("checked", !1);
    (i == 2021 || i == 2022 || i == 2023) && (r == 1 ? $("div#divYouAreFirstOption").show() : r == 4 && $("div#divYouAreForthOption").show())
}
$.fn.getFloat = function () {
    var t = this.val() === "" ? "0" : this.val()
        , n = parseFloat(t);
    return isNaN(n) ? 0 : n
};

$.fn.ColumnsTotal = function () {
    var n = 0;
    return $(this).find(".form-control").each(function () {
        var t = $(this).val();
        isNaN(t) || t.length === 0 || (n += parseFloat(t))
    }), n
};

$(document).ready(function () {

    $("#sel-assessment-year").text($("select#assessment-year").find("option:selected").text());
    SetYouAreCalculation($("select#assessment-year").val(), $("select#user-category").val());

    $(document).on("click", "a#residential-add-more-fields", function () { });
    $(document).on("click", "a#residential-remove-last-field", function () {
        var n = $("div.div-row").not(".total-row,.thead").length;
        n > 2 && ($("div.total-row:last").prev().remove(),
            RecalculateEachResidentialRow())
    });
    $(document).on("click", "a#residential-add-more-fields-popup", function () {
        var n = $("#popup-calculation div.div-row").not(".total-row,.thead").length + 1;
        $("div#template-data .div-row .s-no").text(n);
        $("#popup-calculation div.total-row:last").before($("div#main-template").html())
    });
    $(document).on("click", "a#residential-remove-last-field-popup", function () {
        $("div#popup-calculation div.div-row").not(".total-row,.thead,div.div-row:first").last().remove();
        RecalculateEachResidentialRowPopup()
    });
    $(document).on("change", "select#assessment-year", function () {
        $("#taxpayer-category").text("--");
        $("#sel-assessment-year").text($(this).find("option:selected").text());
        $('input[name="radio"],input[name="radio2"],input[name="radio3"],input[name="radio4"]').attr("checked", !1);
        $("input.fa1,input.fa2,input.fa3,input.fa4,input.fa5,input.fa6,input.fa7").val("");
        $("#user-category").val("1");
        $("#citizen-category").val("0");
        SetYouAreCalculation(this.value, $("select#user-category").val());
        SetFinancialYearLabel(this.value);
        $("#number-of-trips").val("");
        $(".date-start,.date-end,.date-diff").val("");
        $("#residential-input-5").hide();
        $("div.residential-input-other").hide();
        AddDynamicRows(0);
        RecalculateEachResidentialRow()
    });
    $(document).on("change", "select#user-category", function () {
        $("#citizen-category").val("0");
        SetYouAreCalculation($("select#assessment-year").val(), this.value);
        RecalculateEachResidentialRow()
    });
    $(document).on("change", "input#number-of-trips", function () {
        var n = $(this).getFloat();
        if (isNaN(n) || n > 99) return
        AddDynamicRows(n)
    });
    $(document).on("blur", "div#main-calculation input[type=date]", function () {
        this.style.borderColor = this.value === "" ? "#FF0000" : "";
        RecalculateEachResidentialRow()
    });
    $(document).on("blur", "div#popup-calculation input[type=date]", function () {
        this.style.borderColor = this.value === "" ? "#FF0000" : "";
        RecalculateEachResidentialRowPopup()
    });
    $(document).on("blur", ".fa1,.fa2,.fa3,.fa4,.fa5,.fa6,.fa7", function () {
        this.style.borderColor = this.value === "" ? "#FF0000" : "";
        RecalculateEachResidentialRow()
    });
    $(document).on("click", "a.residential-open-model-popup", function () {
        $("a.residential-close-model-popup").attr("aria-label", $(this).attr("aria-label"));
        $(".dit-modal-popup-heading-name").text($("input." + $(this).attr("aria-label")).attr("placeholder"));
        $('#Annexure1Dialog').show()
        $('.dit-modal-popup-overlay').show()
    });
    $(document).on("click", "a.residential-close-model-popup", function () {
        var n = $("div#popup-calculation").find("input.total-days-difference").val();
        $("input." + $(this).attr("aria-label")).val(n);
        RecalculateEachResidentialRow();
        setTimeout(function () {
            $("div#popup-calculation").find("input[type=text],input[type=date]").val("");
            $("div#popup-calculation div.div-row").not(".total-row,.thead,div.div-row:first").remove()
        }, 1e3)
        $('#Annexure1Dialog').hide()
        $('.dit-modal-popup-overlay').hide()
    });
    $(document).on("change", "input#chkPersonOfIndianOrigin", function () {
        RecalculateEachResidentialRow()
    });
    $(document).on("change", "input.first-question-checked-yes,input.first-question-checked-no", function () {
        $("input.first-question-checked-yes").is(":checked") ? $("#taxpayer-category").text("Ordinary Resident") : $("#taxpayer-category").text("Not Ordinary Resident")
    });
    $(document).on("change", "select#citizen-category", function () {
        var n = this.value;
        $("#15-lac-first-question").hide();
        $('input[name="radio2"]').attr("checked", !1);
        (n == 1 || n == 2) && $("#15-lac-first-question").show();
        RecalculateEachResidentialRow()
    });
    $(document).on("change", "input.15-lacs-first-question-checked-yes,input.15-lacs-first-question-checked-no,input#chkPersonOfIndianOrigin", function () {
        RecalculateEachResidentialRow()
    });
    $(document).on("change", "input.third-question-checked-yes,input.third-question-checked-no", function () {
        $("div#forth-question").hide();
        $('input[name="radio4"]').attr("checked", !1);
        $("input.third-question-checked-yes").is(":checked") ? ($("div#forth-question").show(),
            $("#taxpayer-category").text("--")) : $("#taxpayer-category").text("Non Resident")
    });
    $(document).on("change", "input.forth-question-checked-yes,input.forth-question-checked-no", function () {
        $("input.forth-question-checked-yes").is(":checked") ? $("#taxpayer-category").text("Non Resident") : $("#taxpayer-category").text("Not Ordinary Resident")
    })
});