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

function mydate(t) {
    const dateView = t.parentElement;
    const actualDateElem = dateView.querySelector('.actualDate');
    const placeHolderDateDateElem = dateView.querySelector('.placeHolderDate');
    actualDateElem.hidden = false;
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

    placeHolderDateDateElem.hidden = false;
    $(placeHolderDateDateElem).trigger("change");
    actualDateElem.hidden = true;
}

// ---------------------------------------------------------------alert--------------------------------------------------------------
const showAlert = () => { $('.alert').show(); LogoShiftDown() }
const hideAlert = () => { $('.alert').hide(); LogoShiftUp() }
const LogoShiftDown = () => $('.container-fluid').css('padding-top', '3rem');
const LogoShiftUp = () => $('.container-fluid').css('padding-top', '1rem');

// ====================================================================================================================================
function ValidateAndFormatNumber(n, t) {
    var i, r;
    if (n.value != "") {
        if (UnFormatNumber(n),
            i = /^-?\d+\.{0,1}\d*$/.test(n.value),
            !i) {
            // alert("Not a number");
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
        n.value = r.toFixed(2);
        n.value = addthousandseprator(n.value)
    }
}
function UnFormatNumber(n) {
    (n.value != "") && (n.value = n.value.replace(/,/gi, ""))
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
        t != "" && (n += parseFloat(t.replace(/,/gi, "")))
    });
    $(".total10Sal").val(addthousandseprator(parseFloat(n).toFixed(2)));
    t = Math.round(parseFloat(n) / 10);
    $("#avg10Sal").val(addthousandseprator(parseFloat(t).toFixed(2)))
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
function windowHeight() {
    windowMaxHeight = $(window).innerHeight();
    $(".WindowMaxHeightdiv").css({
        "max-height": windowMaxHeight - 150 + "px"
    })
}

function ConvertToDate(n) {
    var t, i;
    return n != null && (t = n.split("-")),
        i = "",
        (i = new Date(t[0], t[1] * 1 - 1, t[2])),
        i

}
const closeClick = () => {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut()
}
var max_fields = 10
    , fieldsLength = 1
    , fixed3lacs = 3e5
$(document).ready(function () {
    $("#ls_second_window").hide();
    $('.add_field_button_ls').on("click", function (n) {
        n.preventDefault();
        fieldsLength < max_fields && (fieldsLength++,
            $(".total-row:last").before('<div id="myDiv" class="div-row"><div class="div-cell s-no">' + fieldsLength + '</div><div class="div-cell"><input maxlength="15" class="noYears form-control rounded-0" type="text" onkeypress="return isNumberKey(event)" /></div><div class="div-cell"><input maxlength="15" class="noLeave form-control rounded-0" type="text" onkeypress="return isNumberKey(event)" /></div><div class="div-cell"><input maxlength="15" class="noEleLeave form-control rounded-0" type="text" onkeypress="return isNumberKey(event)" /></div><div class="div-cell"><input maxlength="15" class="totalNoLeave form-control rounded-0" onkeypress="return isNumberKey(event)" type="text" /></div></div>'))
    });
    $('.remove_field_ls').on("click", function (n) {
        fieldsLength > 1 && (n.preventDefault(),
            $(".div-row:nth-last-child(2)").remove(),
            calculateTotalLeave(),
            fieldsLength--)
    });
});

$(document).on("click", "#computeYear", function () {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut();
    ditmodalpopup("ls_sw_dialogYear", "ditover")
});
$(document).on("change", "#joiningDt,#retireDt", function () {
    var n = "", t = "", i, r, u, f;
    $("#joiningDt").val() != "" && (n = $("#joiningDt").val());
    $("#retireDt").val() != "" && (t = $("#retireDt").val());

    n != "" && t != "" && t > n && (i = "",
        i = ConvertToDate(t),
        r = "",
        r = ConvertToDate(n),
        u = i - r,
        f = Math.floor(u / 31536e6),

        $("#comYear").val(f),
        $("#durationYear").val($("#comYear").val()),
        u < 0 && ($("#comYear").val(0),
            $("#durationYear").val(0))),
        (t.split("-")[2] < n.split("-")[2]) && ($("#comYear").val(""),
            $("#durationYear").val(''))
});

$(document).on("click", ".comp10MonthSal", function () {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut();
    ditmodalpopup("ls_sw_dialogAvgSalary", "ditover")
});
$(document).on("change", "#salary10Month", function () {
    var n = parseFloat($("#salary10Month").val().replace(/,/gi, ""))
    if (isNaN(n)) {
        return $("#avgSal10Month").val("")
    }
    t = Math.round(n / 10);
    $("#avgSal10Month").val(addthousandseprator(t))
});
$(document).on("blur", ".basicSal", function () {
    var n = $(this).parent().parent().find(".basicSal").val()
        , t = $(this).parent().parent().find(".allowance").val()
        , i = $(this).parent().parent().find(".commission").val()
        , r = parseFloat(n === "" ? 0 : n.replace(/,/gi, "")) + parseFloat(t === "" ? 0 : t.replace(/,/gi, "")) + parseFloat(i === "" ? 0 : i.replace(/,/gi, ""));
    $(this).parent().parent().find(".sumSalary").val(addthousandseprator(r.toFixed(2)));
    calculateTotal10Ls();
    $("#avgSal10Month").val($("#avg10Sal").val());
    $("#salary10Month").val($(".total10Sal").val())
});
$(document).on("blur", ".allowance", function () {
    $(".basicSal").trigger("blur")
});
$(document).on("blur", ".commission", function () {
    $(".basicSal").trigger("blur")
});
$(document).on("click", "#close10Month", function () { });
$(document).on("click", "#computeDuringServL", function () {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut();
    ditmodalpopup("ls_sw_dialogLeaveSal", "ditover")
});
$(document).on("blur", ".noYears", function () {
    $(".noLeave").trigger("blur")
});
$(document).on("blur", ".noLeave", function () {
    var t = $(this).parent().parent().find(".noYears").val(), n, i, r;
    t = parseFloat(t === "" ? 0 : t);
    n = $(this).parent().parent().find(".noLeave").val();
    n = parseFloat(n === "" ? 0 : n);
    i = Math.min(30, n);
    r = parseFloat(t * i);
    $(this).parent().parent().find(".noEleLeave").val(i.toFixed(2));
    $(this).parent().parent().find(".totalNoLeave").val(r.toFixed(2))
});
$(document).on("blur", ".noYears,.noLeave", function () {
    calculateTotalLeave();
    $("#leaveDuringServ").val($(".sumTLeave").val())
});

$(document).on("change", "#emplrType", function () {

    if ($("#emplrType").val() === "central_state_govt") {
        $("#emplrType").focusout();
        $("#totalLeaveSal").val("");
        $("#preTaxableLeaveSal").val("");
        $("#ls_second_window").hide();
        $("#divCentralGovInfo").show()
        $('#leaveDuringServ').prop('disabled', true)
    } else if ($("#emplrType").val() === "") {
        $("#ls_second_window").hide(),
            $("#divCentralGovInfo").hide()

        $('#leaveDuringServ').prop('disabled', true)
    } else {
        $("#emplrType").focusout(),
            $("#prevYearLSal").val(""),
            $("#retirementLSal").val(""),
            $("#ls_second_window").show(),
            $("#divCentralGovInfo").hide()

        $('#leaveDuringServ').prop('disabled', false)
    }
});
$(document).on("click", "#closeLeaveSal", function () {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut()
});

$(document).on("keydown", ".txtNumeric", function (n) {
    checkAlphaNumeric(n)
});

$(document).on("click", ".dit-modal-popup-heading-close", function () {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut()
});
$(document).on("click", ".ls-sw-chiled-close", function () { });
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
    $.isNumeric(t) ? t.substring(t.indexOf(".")).length > 3 && t.indexOf(".") > -1 && (n.preventDefault(),
        $(this).val(t.substring(0, t.indexOf(".") + 3))) : n.preventDefault()
});

$(document).on("change", ".number-only", function () {
    ValidateAndFormatNumber(this, '')
});
