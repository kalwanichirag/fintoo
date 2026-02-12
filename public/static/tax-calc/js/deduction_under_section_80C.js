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

// ---------------------------------------------------------------alert--------------------------------------------------------------
const showAlert = () => { $('.alert').show(); LogoShiftDown() }
const hideAlert = () => { $('.alert').hide(); LogoShiftUp() }
const LogoShiftDown = () => $('.container-fluid').css('padding-top', '3rem');
const LogoShiftUp = () => $('.container-fluid').css('padding-top', '1rem');

// ====================================================================================================================================
function DoTotalSum() {
    var i = !1, n, t;
    return ($("#optassessmentyear").val() == "") && (
        showAlert(),
        document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> Please select assessment year/status",
        i = 1),
        i ? !1 : (n = 0,
            $(".inputclass").each(function () {
                // n += +$(this).val()
                const unformat = this.value === "" ? 0 : this.value.replace(/,/gi, "")
                n = n + parseFloat(unformat);
                console.log(n)
            }),
            t = 15e4,
            $("#totailval").val(""),
            n >= t ? ($("#totailval").val(addthousandseprator(n.toFixed(2))),
                $("#Maxval").val(addthousandseprator(t.toFixed(2)))) : ($("#totailval").val(addthousandseprator(n.toFixed(2))),
                    $("#Maxval").val(addthousandseprator(n.toFixed(2)))),
            hideAlert(),
            !0)
}
function RemoveDynamicallyDiv() {
    $("div.s-no").length > 5 && $("#MainDivTable .div-row").not(".thead,.total-row").last().remove();
    DoTotalSum()
}
$(document).ready(function () {
    $("#select2").prop("disabled", !0);
    $("input").prop("maxLength", 14);
    $(document).on("keypress", ".inputclass", function () {
        (event.keyCode < 48 || event.keyCode > 57) && event.keyCode != 46 && (event.returnValue = !1)
    });

    $(document).on("change", ".inputclass", function () {
        const unformat = (this.value.replace(/,/gi, ""))
        if (unformat === '' || isNaN(unformat)) return this.value = ''
        r = parseFloat(unformat).toFixed(2);
        this.value = addthousandseprator(r)
    });

    $(document).on("change", ".inputclass,#optassessmentyear,#optstatus", function () {
        DoTotalSum()
    });

    $(document).on("change", "select.select-deduction", function () {
        var n = $("div#dropdown-template select#template-" + this.value).html(), t;
        n = typeof n == "undefined" || n === "" ? $("div#dropdown-template select#template-0").html() : n;
        $(this).closest(".div-row").find(".second select").html(n);
        t = $(this).closest(".div-row").find(".second select").html(n);
        t[0].options.length == 1 && t[0].localName == "select" ? $(this).closest(".div-row").find(".second select").html(n).prop("disabled", !0) : $(this).closest(".div-row").find(".second select").html(n).prop("disabled", !1)
    });
    $(document).on("click", "#add-more", function () {
        var n = $("#MainDivTable div.div-row").not("thead,.total-row").length;
        $("div#divmaster .s-no").text(n);
        $("#MainDivTable div.total-row:first").before($("div#divmaster").html())
    });
    $(".remove").on("click", function () {
        RemoveDynamicallyDiv()
    });
    $(document).on("change", "#select1", function () {
        $(this).data("options") === undefined && $(this).data("options", $("#select2 option").clone());
        var t = $(this).val()
            , n = $(this).data("options").filter("[value=" + t + "] ,[value=0]");
        n.length != 0 ? ($("#select2").prop("disabled", !1),
            $("#select2").html(n)) : ($("#select2").append('<option value="0" selected="selected">Select<\/option>'),
                $("#select2").prop("disabled", !0))
    })
});

// -------------------------------------------------------------------------------foverfunctions---------------------------------------------------------------------------
const tooltipOn = (t, id) => {
    const tooltipInfo = document.getElementsByClassName(id)[0];
    const tooltipInfoCord = tooltipInfo.getBoundingClientRect();
    const rect = t.getBoundingClientRect();
    tooltipInfo.style.top = `${rect.top + $(window).scrollTop() - tooltipInfoCord.height}px`
    tooltipInfo.style.left = `${rect.left + 65}px`
    tooltipInfo.style.visibility = 'visible'
    const tooltipArrowInfo = document.getElementsByClassName('link80CArrow')[0];

    const tooltipInfoCordUpdated = tooltipInfo.getBoundingClientRect();
    tooltipArrowInfo.style.right = `${tooltipInfoCordUpdated.right - rect.right + 5}px`
}
const tooltipOff = (e, id) => {
    const tooltipInfo = document.getElementsByClassName(id)[0];
    const tooltipArrowInfo = document.getElementsByClassName('link80CArrow')[0];

    if (!isCursorWithinBoud(tooltipInfo.getBoundingClientRect(), e.clientX, e.clientY) && !isCursorWithinBoud(tooltipArrowInfo.getBoundingClientRect(), e.clientX, e.clientY)) {

        return tooltipInfo.style.visibility = 'hidden'
    } else {
        $(tooltipInfo).mouseenter(function () {
            return
        });
        $(tooltipInfo).mouseleave(function () {
            return tooltipInfo.style.visibility = 'hidden'
        });
    }

}

const isCursorWithinBoud = (bounds, x, y) => {
    // var offset = bounds.offset();
    var l = bounds.left;
    var t = bounds.top;
    var h = bounds.height;
    var w = bounds.width;

    var maxx = l + w;
    var maxy = t + h;

    return (y <= maxy && y >= t) && (x <= maxx && x >= l);
}
