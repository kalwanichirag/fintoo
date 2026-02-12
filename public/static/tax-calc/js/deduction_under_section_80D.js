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

function InputConditionalcalculativeData() {
    maxtxtnIndividualrow1 = 25e3;
    $("#firstrowtxtID1").val() != "" && (txtnIndividual1 = parseInt($("#firstrowtxtID1").val()),
        txtnIndividual1data = txtnIndividual1 >= maxtxtnIndividualrow1 ? maxtxtnIndividualrow1 : txtnIndividual1,
        $("#firstrowtxtID1").val(txtnIndividual1data.toFixed(2)));
    $("#firstrowtxtID2").val() != "" && (txtnIndividual2 = parseInt($("#firstrowtxtID2").val()),
        txtnIndividual2data = txtnIndividual2 >= maxtxtnIndividualrow1 ? maxtxtnIndividualrow1 : txtnIndividual2,
        $("#firstrowtxtID2").val(txtnIndividual2data.toFixed(2)));
    maxtxtnIndividualrow2 = $("#optassessmentyear option:selected").val() < 6 ? 5e4 : 3e4;
    $("#secondrowtxtID1").val() != "" && (txtsecondIndividual1 = parseInt($("#secondrowtxtID1").val()),
        txtsecondIndividual1data = txtsecondIndividual1 >= maxtxtnIndividualrow2 ? maxtxtnIndividualrow2 : txtsecondIndividual1,
        $("#secondrowtxtID1").val(txtsecondIndividual1data.toFixed(2)));
    $("#secondrowtxtID2").val() != "" && (txtsecondIndividual2 = parseInt($("#secondrowtxtID2").val()),
        txtsecondIndividual2data = txtsecondIndividual2 >= maxtxtnIndividualrow2 ? maxtxtnIndividualrow2 : txtsecondIndividual2,
        $("#secondrowtxtID2").val(txtsecondIndividual2data.toFixed(2)));
    maxtxtnIndividualrow3 = 5e3;
    txtthirdIndividual1data = 0;
    $("#thirdrowtxtID1").val() != "" && (txtthirdIndividual1 = parseInt($("#thirdrowtxtID1").val()),
        txtthirdIndividual1data = txtthirdIndividual1 >= maxtxtnIndividualrow3 ? maxtxtnIndividualrow3 : txtthirdIndividual1,
        $("#thirdrowtxtID1").val(txtthirdIndividual1data.toFixed(2)));
    txtthirdIndividual2data = 0;
    $("#thirdrowtxtID2").val() != "" && (txtthirdIndividual2 = parseInt($("#thirdrowtxtID2").val()),
        txtthirdIndividual2data = txtthirdIndividual2 >= maxtxtnIndividualrow3 ? maxtxtnIndividualrow3 : txtthirdIndividual2,
        $("#thirdrowtxtID2").val(txtthirdIndividual2data.toFixed(2)));
    maxtxtnIndividualrow4 = $("#optassessmentyear option:selected").val() < 6 ? 5e4 : 3e4;
    $("#fourthrowtxtID1").val() != "" && (txtfourthIndividual1 = parseInt($("#fourthrowtxtID1").val()),
        txtfourthIndividual1data = txtfourthIndividual1 >= maxtxtnIndividualrow4 ? maxtxtnIndividualrow4 : txtfourthIndividual1,
        $("#fourthrowtxtID1").val(txtfourthIndividual1data.toFixed(2)));
    $("#fourthrowtxtID2").val() != "" && (txtfourthIndividual2 = parseInt($("#fourthrowtxtID2").val()),
        txtfourthIndividual2data = txtfourthIndividual2 >= maxtxtnIndividualrow4 ? maxtxtnIndividualrow4 : txtfourthIndividual2,
        $("#fourthrowtxtID2").val(txtfourthIndividual2data.toFixed(2)));
}
function InputConditionalcalculativeHufData() {
    var n = 0, t = 0, i = 0, f = 0, r = $("#optassessmentyear option:selected").val(), u;
    r == "5" ? ($("#firstrowtxthufID1").val() != 0 && (n = parseInt($("#firstrowtxthufID1").val()) >= 25e3 ? 25e3 : parseInt($("#firstrowtxthufID1").val())),
        $("#secondrowtxthufID1").val() != 0 && (t = parseInt($("#secondrowtxthufID1").val()) >= 5e4 ? 5e4 : parseInt($("#secondrowtxthufID1").val())),
        $("#thirdrowtxthufID1").val() != 0 && (i = parseInt($("#thirdrowtxthufID1").val()) >= 5e4 ? 5e4 : parseInt($("#thirdrowtxthufID1").val()))) : ($("#firstrowtxthufID1").val() != 0 && (n = parseInt($("#firstrowtxthufID1").val()) >= 25e3 ? 25e3 : parseInt($("#firstrowtxthufID1").val())),
            $("#secondrowtxthufID1").val() != 0 && (t = parseInt($("#secondrowtxthufID1").val())),
            $("#thirdrowtxthufID1").val() != 0 && (i = parseInt($("#thirdrowtxthufID1").val())));
}
function ResetCalculation() {
    $("input[type=text]").each(function () {
        $(this).val("")
    })
}
$(document).ready(function () {
    $("#hufDiv").hide();
    $("input").prop("maxLength", 05);
    $(document).on("keypress", ".inputclass", function () {
        (event.keyCode < 48 || event.keyCode > 57) && event.keyCode != 46 && (event.returnValue = !1)
    });
    $(document).on("change", ".inputclass", function (n) {
        console.log(isNaN(this.value))
        if (isNaN(this.value)) {

            return this.value = ''
        }
    });
    $(document).on("paste", ".inputclass", function () {
        return false;
    });

    $(document).on("change", "#optassessmentyear", function () {
        Aseesyear = $("#optassessmentyear option:selected").val();
        if (Aseesyear !== "") { hideAlert() }
        Aseesyear !== "" && Aseesyear < 6 ? ($("#divLiteral13").hide(),
            $("#divLiteral18").show()) : ($("#divLiteral13").show(),
                $("#divLiteral18").hide());
        ResetCalculation()
    });
    $(document).on("change", "#firstrowtxtID1,#firstrowtxtID2,#secondrowtxtID1,#secondrowtxtID2,#thirdrowtxtID1,#thirdrowtxtID2,#fourthrowtxtID1,#fourthrowtxtID2", function () {
        Aseesyear = $("#optassessmentyear option:selected").val();
        Aseesyear < 6 ? ($("#divLiteral13").hide(),
            $("#divLiteral18").show()) : ($("#divLiteral13").show(),
                $("#divLiteral18").hide());
        Aseesyear != "" ? InputConditionalcalculativeData() : (
            showAlert(),
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> please select assessment year",
            ResetCalculation())
    });
    $(document).on("change", "#firstrowtxthufID1,#firstrowtxthufID2,#secondrowtxthufID1,#secondrowtxthufID2,#thirdrowtxthufID1,#thirdrowtxthufID2", function () {
        Aseesyear = $("#optassessmentyear option:selected").val();
        Aseesyear < 6 ? ($("#divhufoldMedical").hide(),
            $("#divhufnewMedical").show()) : ($("#divhufoldMedical").show(),
                $("#divhufnewMedical").hide());
        Aseesyear != "" ? nputConditionalcalculativeHufData() : (
            showAlert(),
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> please select assessment year",
            ResetCalculation())
    });
    $("#btnreset").on("click", function () {
        ResetCalculation()
    });
    $("#optstatus").change(function () {
        var n = $("#optstatus option:selected").val();
        switch (n) {
            case "1":
                $("#individualDiv").show();
                $("#hufDiv").hide();
                Aseesyear = $("#optassessmentyear option:selected").val();
                Aseesyear < 6 ? ($("#divLiteral13").hide(),
                    $("#divLiteral18").show()) : ($("#divLiteral13").show(),
                        $("#divLiteral18").hide());
                break;
            case "2":
                $("#hufDiv").show();
                $("#individualDiv").hide();
                Aseesyear = $("#optassessmentyear option:selected").val();
                Aseesyear < 6 ? ($("#divhufoldMedical").hide(),
                    $("#divhufnewMedical").show()) : ($("#divhufoldMedical").show(),
                        $("#divhufnewMedical").hide());
                break;
            default:
                $("#hufDiv").hide();
                $("#individualDiv").hide()
        }
    })
});

// -------------------------------------------------------------------------------hoverfunctions---------------------------------------------------------------------------
const tooltipOn = (t, id) => {
    const tooltipInfo = document.getElementsByClassName(id)[0];
    const tooltipInfoCord = tooltipInfo.getBoundingClientRect();
    const rect = t.getBoundingClientRect();
    tooltipInfo.style.visibility = 'visible'
    tooltipInfo.style.top = `${rect.top + $(window).scrollTop() + 30 - tooltipInfoCord.height - 30}px`
    tooltipInfo.style.left = `${rect.left + 150}px`
}
const tooltipOff = (e, id) => {
    const tooltipInfo = document.getElementsByClassName(id)[0];
    const tooltipArrowInfo = document.getElementsByClassName('link80DArrow')[0];

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
    var l = bounds.left;
    var t = bounds.top;
    var h = bounds.height;
    var w = bounds.width;

    var maxx = l + w;
    var maxy = t + h;

    return (y <= maxy && y >= t) && (x <= maxx && x >= l);
}
