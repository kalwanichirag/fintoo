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

// ---------------------------------------------------------------alert--------------------------------------------------------------
const showAlert = () => { $('.alert').show(); LogoShiftDown() }
const hideAlert = () => { $('.alert').hide(); LogoShiftUp() }
const LogoShiftDown = () => $('.container-fluid').css('padding-top', '3rem');
const LogoShiftUp = () => $('.container-fluid').css('padding-top', '1rem');

// ==================================================================================================================================
function isNumberKey(n) {
    if ($('#residential_status').val() === 'nResident') return false
    var t = n.which ? n.which : n.keyCode;
    return t != 46 && t > 31 && (t < 48 || t > 57) ? !1 : !0
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
    jQuery.fn.center = function () {
        return $("#" + n).css("position", "fixed"),
            $("#" + n).css("top", $(window).height() / 2 - this.outerHeight() / 2),
            $("#" + n).css("left", $(window).width() / 2 - this.outerWidth() / 2),
            this
    }
        ;
    $("#" + n).center();
    $(window).resize(function () {
        $("#" + n).center()
    })
}
function windowHeight() {
    windowMaxHeight = $(window).innerHeight();
    $(".WindowMaxHeightdiv").css({
        "max-height": windowMaxHeight - 150 + "px"
    })
}
function validDate(n) {
    var t;
    if (n != "") {
        if ((t = n.split("/"),
            t.length !== 3) || t[0].length != 2 || t[1].length != 2 || t[2].length != 4)
            return !1;
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
var defaultAmt = 7500
    , max_fields = 10
    , x = 1
    , deduAbove80 = 125e3
    , deduBelow80 = 75e3
    , fixedInt = 1e4
    , maxExempt = 1e6
    , fixed3lacs = 3e5
    , max_fields44AD = 20
    , max_turnover = 2e7
    , count = 1
    , minimumPercent = .06
    , minPer = 6;
$(document).ready(function () {
    var u, f;

    u = $(".input_fields_wrap_AD");
    f = $(".add_field_button_AD");
    $(f).on("click", function (n) {
        n.preventDefault();
        count < max_fields44AD && $("#residential_status").val() != "nResident" && (count++,
            $("#chkProfit44AD").is(":checked") ? $(".total-row:last").before('<div id="myDiv" class="div-row"><div class="div-cell s-no">' + count + ' <\/div><div class="div-cell"> <input class="txtNumeric form-control rounded-0" type="text"/><\/div><div class="div-cell"> <input class="grossturnovers44AD number-only form-control rounded-0" type="text" onkeypress="return isNumberKey(event)" maxlength="15"/>  <\/div><div class="div-cell"> <input class="profits44AD number-only form-control rounded-0" readonly="readonly" type="text" onkeypress="return isNumberKey(event)"/> <\/div><div class="div-cell"><input class="Actual44AD number-only form-control rounded-0" type="text" onkeypress="return isNumberKey(event)"/>  <\/div><div class="div-cell"> <input class="Actual_profit44AD number-only form-control rounded-0" onkeypress="return isNumberKey(event)" type="text"/> <\/div><\/div>') : $(".total-row:last").before('<div id="myDiv" class="div-row"><div class="div-cell s-no">' + count + ' <\/div><div class="div-cell"> <input class="txtNumeric form-control rounded-0" type="text"/><\/div><div class="div-cell"> <input class="grossturnovers44AD number-only form-control rounded-0" type="text" onkeypress="return isNumberKey(event)" maxlength="15"/>  <\/div><div class="div-cell"> <input class="profits44AD number-only form-control rounded-0" readonly="readonly" type="text" onkeypress="return isNumberKey(event)"/> <\/div><div class="div-cell"><input class="Actual44AD number-only form-control rounded-0" disabled="disabled" type="text" onkeypress="return isNumberKey(event)"/>  <\/div><div class="div-cell"> <input class="Actual_profit44AD number-only form-control rounded-0" disabled="disabled" onkeypress="return isNumberKey(event)" type="text"/> <\/div><\/div>'))
    });
    $(u).on("click", ".remove_field_AD", function (n) {
        count > 1 && (n.preventDefault(),
            $(".div-row:nth-last-child(2)").remove(),
            count--,
            // calculateProfits(),
            calculateGrossturnover())
    })
});

$(document).on("change", "#residential_status", function () {
    if ($(this).val() != "nResident")
        hideAlert()
    else {
        $(".grossturnovers44AD").val(0);
        $(".Actual44AD").val(0);
        $(".Actual_profit44AD").val(0);
        $("#chkProfit44AD").is(":checked") && $("#chkProfit44AD").trigger("click");
        $(".grossturnovers44AD").trigger("blur");
        $(".sums44AD").val(0);
        showAlert();
        document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> Section 44AD is not applicable for Non Resident Individual"
    }
});
$(document).on("click", "#chkProfit44AD", function () {
    $(this).is(":checked") ? ($(".Actual44AD").removeAttr("disabled"),
        $(".Actual44AD").focus(),
        hideAlert(),
        $(".Actual_profit44AD").removeAttr("disabled"),
        $(".Actual_profit44AD").focus()) : ($(".Actual44AD").val("").attr("disabled", "disabled"),
            $(".Actual_profit44AD").val("").attr("disabled", "disabled"),
            hideAlert()
        // ,calculateProfits()
    )
});
$(document).on("blur", ".Actual44AD", function () {
    var n = $(this).val(), i = $(this).parent().parent().find(".grossturnovers44AD").val(), t;
    parseFloat(n) >= minPer && parseFloat(n) <= 100 && parseFloat(i) ? (t = parseFloat(n) / 100 * parseFloat(i),
        t = t.toFixed(2),
        hideAlert()) : parseFloat(n) > 100 ? (
            showAlert(),
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> Actual profit as a % of turnover cannot be more than 100%",
            $(this).parent().parent().find(".Actual_profit44AD").val(""),
            $(this).parent().parent().find(".Actual44AD").val("")) : ((n != "" || n == !0) && (showAlert(),
                document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> Income declared cannot be less than the limit prescribed under section 44AD."),
                $(this).parent().parent().find(".Actual44AD").val(""),
                $(this).parent().parent().find(".Actual_profit44AD").val(""));
    // $.isNumeric(t) && $(this).parent().parent().find(".Actual_profit44AD").val(Math.ceil(t));
    // calculateProfits()
    if ($(this).val().length > 0) $(this).parent().parent().find(".Actual_profit44AD").val('');
});
$(document).on("blur", ".Actual_profit44AD", function () {

    var t = $(this).val()
        , i = parseFloat(t)
        , r = $(this).parent().parent().find(".grossturnovers44AD").val()
        , n = i / r * 100;
    n = n.toFixed(2);
    parseFloat(n) >= minPer && parseFloat(n) <= 100 && t != "" ? ($(this).parent().parent().find(".Actual44AD").val(Math.ceil(n)),
        hideAlert()) : parseFloat(n) > 100 ? (
            showAlert(),
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> Actual profit as a % of turnover cannot be more than 100%",
            $(this).parent().parent().find(".Actual_profit44AD").val(""),
            $(this).parent().parent().find(".Actual44AD").val(""),
            $(this).parent().parent().find(".Actual44AD").focus()) : (hideAlert(),
                t != "" || t == !0 ? (
                    showAlert(),
                    document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> Income declared cannot be less than the limit prescribed under section 44AD."
                ) : hideAlert(),
                $(this).parent().parent().find(".Actual_profit44AD").val(""),
                $(this).parent().parent().find(".Actual44AD").val(""),
                $(this).parent().parent().find(".Actual44AD").focus());
    // calculateProfits()
    if ($(this).val().length > 0) $(this).parent().parent().find(".Actual44AD").val('');
});
$(document).on("keydown", ".txtNumeric", function (n) {
    checkAlphaNumeric(n)
});
$(document).on("change", "#chkReceiptCash,.grossturnovers44AD", function () {
    var i, r, n, f, t, u, e;
    $("#chkReceiptCash").prop("checked") === true ? (minimumPercent = .08,
        minPer = 8,
        $("#tableHead").text(8),
        $("#divProfit6").hide(),
        $("#divProfit8").show()) : (minimumPercent = .06,
            minPer = 6,
            $("#tableHead").text(6),
            $("#divProfit6").show(),
            $("#divProfit8").hide());
    $("input:radio:checked").length > 0 && $("#residential_status").val() == "nResident" && (hideAlert(),
        $(".grossturnovers44AD").val(0));
    i = $(".grossturnovers44AD").val();
    r = parseFloat(i) * minimumPercent;
    $.isNumeric(r) && $(".grossturnovers44AD").parent().parent().find(".profits44AD").val(Math.ceil(r));
    n = calculateGrossturnover();

    $("#ayear44AD").val() === "" ? (
        // $(".error").text(f),
        // $(".error").show(),
        showAlert(),
        document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> Select Assessment Year",
        $(".grossturnovers44AD").parent().parent().find(".grossturnovers44AD").val(0).focus(),
        $(".grossturnovers44AD").parent().parent().find(".profits44AD").val(""),
        calculateGrossturnover()) : $("#ayear44AD").val() !== "" && parseFloat($("#ayear44AD").val()) < 3 && $("#chkReceiptCash").prop("checked") == !1 && parseFloat(n) > 5e7 ? (
            // $(".error").show(),
            // t = Res.msg_44AD_TURNOVER,
            // $(".error").text(t),
            showAlert(),
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> Turnover cannot exceed the limit prescribed under section 44AD",
            $(".grossturnovers44AD").parent().parent().find(".grossturnovers44AD").val(0).focus(),
            $(".grossturnovers44AD").parent().parent().find(".profits44AD").val(""),
            $(".grossturnovers44AD").parent().parent().find(".Actual44AD").val(""),
            $(".grossturnovers44AD").parent().parent().find(".Actual_profit44AD").val(""),
            calculateGrossturnover()) : $("#ayear44AD").val() !== "" && parseFloat(n) > max_turnover ? (
                // $(".error").show(),
                // t = Res.msg_44AD_TURNOVER,
                // $(".error").text(t),
                showAlert(),
                document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> Turnover cannot exceed the limit prescribed under section 44AD",
                $(".grossturnovers44AD").parent().parent().find(".grossturnovers44AD").val(0).focus(),
                $(".grossturnovers44AD").parent().parent().find(".profits44AD").val(""),
                $(".grossturnovers44AD").parent().parent().find(".Actual44AD").val(""),
                $(".grossturnovers44AD").parent().parent().find(".Actual_profit44AD").val(""),
                calculateGrossturnover()) : (hideAlert()
        // ,$(".sum44AD").val(Math.ceil(n))
    );
    // u = $(".grossturnovers44AD").parent().parent().find(".Actual44AD").val();
    // parseFloat(u) >= minPer && (e = parseFloat(i) * parseFloat(u) / 100,
    //     $(".grossturnovers44AD").parent().parent().find(".Actual_profit44AD").val(Math.ceil(e))
    //     );
    // calculateProfits()
});
$(document).on("click", "#reset44AD", function () {
    location.reload(!0)
});
$(document).on("blur", ".Actual44AD", function () {
    ValidateAndFormatNumber(this, '')
});
$(document).on("paste", ".Actual44AD", function () {
    return false;
});
// $(document).on("change", ".Actual44AD", function () {
//     $(this).val() < 0 && $(this).val(0);
//     $(this).val() > 100 && $(this).val(100)
// });
$(document).on("change", ".grossturnovers44AD,.profits44AD", ".Actual44AD", function () {
    const regexx = /^(?:[1-9]\d*|0)?(?:\.\d+)?$/g.test(this.value)
    if (regexx) {
        isNaN(parseFloat($(this).val()).toFixed(2)) ? $(this).val("") : $(this).val(parseFloat($(this).val()).toFixed(2));
        return;
    } else {
        $(this).val(0);
        return;
    }

});

$(document).on("change", ".Actual_profit44AD", function () {
    const regexx = /^(?:[1-9]\d*|0)?(?:\.\d+)?$/g.test(this.value)
    if (regexx) {
        isNaN(parseFloat($(this).val()).toFixed(2)) ? $(this).val("") : $(this).val(parseFloat($(this).val()).toFixed(2));
        return;
    } else {
        $(this).val(0);
        return;
    }

});

// $(document).on("paste", ".grossturnovers44AD,.profits44AD", ".Actual44AD", function () {
//     return false;
// });

// $(document).on("paste", ".Actual_profit44AD", function () {
//     return false;
// });