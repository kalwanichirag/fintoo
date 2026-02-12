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

// ---------------------------------------------------------------alert--------------------------------------------------------------
const showAlert = () => { $('.alert').show(); LogoShiftDown() }
const hideAlert = () => { $('.alert').hide(); LogoShiftUp() }
const LogoShiftDown = () => $('.container-fluid').css('padding-top', '3rem');
const LogoShiftUp = () => $('.container-fluid').css('padding-top', '1rem');
// ==================================================================================================================================
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

function checkVisibleIncaseDomesticOptios() {
    $("#check_3_container").hide();
    $("#check_4_container").hide()

    if ($("#assessment_year option:selected").text() != "2020-21") {
        document.getElementById("check_3").checked = false;
        document.getElementById("check_4").checked = false;
        $("#check_container").removeClass("full-header-field-box");
    }

    if (($("#assessment_year option:selected").text() == "2021-22" || $("#assessment_year option:selected").text() == "2022-23") && document.getElementById("tax_status").value == "co_operative_society") {
        $("#check_5_container").show();
    }
    else {
        $("#check_5_container").hide();
        document.getElementById("check_5").checked = false;
    }

    if (document.getElementById("tax_status").value == "domestic_company" && $("#assessment_year option:selected").text() == "2017-18") {
        var txtEnglish = "  Tick if, total turnover or gross receipts of the company in the previous year 2014-15 does not exeeds 5 crore rupees";
        $("label[for$='check_1']").text(txtEnglish);

        document.getElementById("check_container").style.display = "block";
    }
    else if (document.getElementById("tax_status").value == "domestic_company" && $("#assessment_year option:selected").text() == "2018-19") {
        var txtEnglish = "  Tick if, total turnover or gross receipts of the company in the previous year 2015-16 does not exeeds 5 crore rupees";
        $("label[for$='check_1']").text(txtEnglish);

        document.getElementById("check_container").style.display = "block";
    }

    else if (document.getElementById("tax_status").value == "domestic_company" && ($("#assessment_year option:selected").text() == "2019-20")) {
        var txtEnglish = "  Tick if, total turnover or gross receipts of the company in the previous year 2016-17 does not exeeds 250 crore rupees";
        $("label[for$='check_1']").text(txtEnglish);

        document.getElementById("check_container").style.display = "block";
    }
    else if (document.getElementById("tax_status").value == "domestic_company" && $("#assessment_year option:selected").text() == "2020-21") {

        var txtEnglish = "  Tick if, total turnover or gross receipt of the company in the previous year 2017-18 does not exceed 400 crore rupees";
        $("label[for$='check_1']").text(txtEnglish);

        document.getElementById("check_container").style.display = "block";
        $("#check_container").addClass("full-header-field-box");
        $("#check_3_container").show();
        $("#check_4_container").show()
    }
    else if (document.getElementById("tax_status").value == "domestic_company" && $("#assessment_year option:selected").text() == "2021-22") {

        var txtEnglish = "  Tick if, total turnover or gross receipt of the company in the previous year 2018-19 does not exceed 400 crore rupees";
        $("label[for$='check_1']").text(txtEnglish);

        document.getElementById("check_container").style.display = "block";
        $("#check_container").addClass("full-header-field-box");
        $("#check_3_container").show();
        $("#check_4_container").show()
    }
    else if (document.getElementById("tax_status").value == "domestic_company" && $("#assessment_year option:selected").text() == "2022-23") {

        var txtEnglish = "  Tick if, total turnover or gross receipt of the company in the previous year 2019-20 does not exceed 400 crore rupees";
        $("label[for$='check_1']").text(txtEnglish);

        document.getElementById("check_container").style.display = "block";
        $("#check_container").addClass("full-header-field-box");
        $("#check_3_container").show();
        $("#check_4_container").show()
    }
    else { document.getElementById("check_container").style.display = "none"; }
}

const getCheckedNumber = () => {
    const ckeckElms = $('.checkbox_elem:visible')

    for (let i = 0; i < ckeckElms.length; i++) {
        if ($(ckeckElms[i]).find('input')[0].checked) {
            console.log(i + 1);
            return
        }
    }
}


function TickOnlyOne() {
    document.getElementById("check_2").checked = false;
    document.getElementById("check_3").checked = false;
    document.getElementById("check_4").checked = false;
}

function TickOnlyOne115BA() {
    document.getElementById("check_1").checked = false;
    document.getElementById("check_3").checked = false;
    document.getElementById("check_4").checked = false;
}

function TickOnlyOne115BAA() {
    document.getElementById("check_1").checked = false;
    document.getElementById("check_2").checked = false;
    document.getElementById("check_4").checked = false;
}

function TickOnlyOne115BAB() {
    document.getElementById("check_1").checked = false;
    document.getElementById("check_2").checked = false;
    document.getElementById("check_3").checked = false;
}

$(".slided").hide();
$(".submaintree_content").hide();
function showchild(t, lid, cid) {
    $('#' + lid).slideToggle("slow");
    if ($('#' + cid).hasClass("minus")) {
        $('#' + cid).removeClass("minus")
        $(t).find('.plus').find('.show').show()
        $(t).find('.plus').find('.hide').hide()
    }
    else {
        $('#' + cid).addClass("minus")
        $(t).find('.plus').find('.show').hide()
        $(t).find('.plus').find('.hide').show()
    }
}

$(document).on("keypress", "input", function (n) {
    if ($(this).hasClass("allchar") || $(this).hasClass("negative-input")) {
        return
    }
    var t = $(this), i;
    (n.which != 46 || t.val().indexOf(".") != -1) && (n.which < 48 || n.which > 57) && n.which != 0 && n.which != 8 && n.preventDefault();
    i = $(this).val();
    n.which == 46 && i.indexOf(".") == -1 && setTimeout(function () {
        t.val().substring(t.val().indexOf(".")).length > 3 && t.val(t.val().substring(0, t.val().indexOf(".") + 3))
    }, 1);
    i.indexOf(".") != -1 && i.substring(i.indexOf(".")).length > 2 && n.which != 0 && n.which != 8 && $(this)[0].selectionStart >= i.length - 2 && n.preventDefault()
});
$(document).on("paste", "input", function (n) {
    if (!$(this).hasClass("allchar") || !$(this).hasClass("negative-input")) {
        var t = n.originalEvent.clipboardData.getData("Text");
        $.isNumeric(t) ? t.substring(t.indexOf(".")).length > 3 && t.indexOf(".") > -1 && (n.preventDefault(),
            $(this).val(t.substring(0, t.indexOf(".") + 3))) : n.preventDefault()
    } else {

    }
});

$(document).on("change", "input", function () {
    if ($(this).hasClass("allchar") || $(this).hasClass("negative-input")) {
        return
    }
    const regexx = /^(?:\d+|\d*\.\d+)$/

    if (isNaN(parseFloat(this.value))) return this.value = ''

    if (!regexx.test(this.value)) return this.value = ''

    ValidateAndFormatNumber(this, '')
});

$(document).on("change", ".negative-input", function (n) {

    const regexx = /^-?\d+(?:\.\d+)?$/g

    if (isNaN(parseFloat(this.value))) return this.value = ''

    if (!regexx.test(this.value)) return this.value = ''

    ValidateAndFormatNumber(this, '')
});
$(document).on("paste", ".negative-input", function (n) {
    const regexx = /^-?\d+(?:\.\d+)?$/g

    var t = n.originalEvent.clipboardData.getData("Text");
    if (isNaN(parseFloat(t))) return false

    if (!regexx.test(n.originalEvent.clipboardData.getData("Text"))) return false

    ValidateAndFormatNumber(this, '')
});

// -------------------------------------------------------------------------------foverfunctions---------------------------------------------------------------------------
const tooltipOn = (t, id, arrowClass, dist) => {
    const tooltipInfo = document.getElementById(id);
    const tooltipInfoCord = tooltipInfo.getBoundingClientRect();
    const rect = t.getBoundingClientRect();
    tooltipInfo.style.top = `${rect.top + $(window).scrollTop() - tooltipInfoCord.height - 5}px`
    tooltipInfo.style.left = `${rect.left + dist}px`
    tooltipInfo.style.visibility = 'visible'
    const tooltipArrowInfo = document.getElementById(arrowClass);

    const tooltipInfoCordUpdated = tooltipInfo.getBoundingClientRect();
    tooltipArrowInfo.style.right = `${tooltipInfoCordUpdated.right - rect.right + 5}px`
}

const tooltipOff = (e, id, arrowClass) => {
    const tooltipInfo = document.getElementById(id);
    const tooltipArrowInfo = document.getElementById(arrowClass);

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

