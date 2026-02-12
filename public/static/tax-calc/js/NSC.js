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
function isNumberKey(n) {
    var t = n.which ? n.which : n.keyCode;
    return t != 46 && t > 31 && (t < 48 || t > 57) ? !1 : !0
}
function NumericOnly(n) {
    return isNaN(n.value + String.fromCharCode(event.keyCode)) ? false : true
}

$(document).on("blur", ".nsc-type,.nsc-period,.investment-amount", function () {
    if (this.tagName === 'SELECT') {
        if ($(this).find('option').length > 1) {
            if (this.value !== '0') return this.style.borderColor = "#dee2e6";
        }
    } else {

        // if (isNaN(this.value)) return this.value = ''
        if (this.value !== '') this.style.borderColor = "#dee2e6";

        if (this.value != "") {

            const unformat = (this.value.replace(/,/gi, ""))
            if (unformat === '' || isNaN(unformat)) return this.value = ''
            r = parseFloat(unformat).toFixed(2);
            this.value = addthousandseprator(r)
        }
        calculateTotalAmountOfInvestment()
    }
});

$(document).on("paste", ".investment-amount", function (n) {
    const t = n.originalEvent.clipboardData.getData("Text");
    if (isNaN(parseFloat(t))) return false
    if (t.includes('-')) return false
});
let rowCount = 1;
$('#nsc-add-more-fields').click(function () {
    rowCount++;
    $(".total-row:last").before('<div id="myDiv" class="div-row"><div class="div-cell s-no">' + rowCount + '</div><div class="div-cell"><select class="form-select rounded-0 nsc-type"><option value="0">Select </option><option value="1">VIII Issue </option><option value="2">IX Issue </option></select></div><div class="div-cell"><select class="form-select rounded-0 nsc-period"><option value="0">Select </option></select></div><div class="div-cell"><input class="form-control rounded-0 investment-amount" onkeypress="return NumericOnly(this);" type="text" maxlength="15"></div><div class="div-cell"><input class="form-control rounded-0 interest-amount" disabled="disabled" type="text"></div><div class="div-cell"><input class="form-control rounded-0 deduction-amount" onkeypress="return NumericOnly(this);" type="text" disabled=""></div></div>');
})

$('#nsc-remove-last-field').click(function () {
    rowCount > 1 && (
        $(".div-row:nth-last-child(2)").remove(),
        rowCount--)
});

$(document).on('change', '#assessment-year', function () {
    // $('.nsc-type').val('0')
    $('.nsc-period').val('0')
    $('.investment-amount').val('')
    $('.interest-amount').val('')
    $('.deduction-amount').val('')
    $('.investment-amount-total').val('')
    $('.interest-amount-total').val('')
    $('.deduction-amount-total').val('')

    $(".nsc-period").each(function () {
        const nsctype = $(this).parent().parent().find(".nsc-type");
        selectChanges(nsctype.val(), this)
    })
})

$(document).on("change", ".nsc-type, #assessment-year", function () {
    const periodSelect = $(this).parent().parent().find(".nsc-period")

    selectChanges(this.value, periodSelect)
});


function selectChanges(NSCtypeVal, periodSelect) {
    $(periodSelect).find('option').each(function () {
        $(this).remove();
    });

    if (NSCtypeVal === '0') {
        return $(periodSelect).append(`<option value="0"> Select </option>`)
    }
    if (NSCtypeVal === '1') {
        switch ($('#assessment-year').val()) {
            case '1':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="1"> 01-Apr-2017 to 30-Jun-2017  </option>`)
                $(periodSelect).append(`<option value="2"> 01-Jul-2017 to 31-Dec-2017  </option>`)
                $(periodSelect).append(`<option value="3"> 01-Jan-2018 to 31-Mar-2018  </option>`)
                $(periodSelect).append(`<option value="4"> 01-Apr-2018 to 30-Sep-2018  </option>`)
                $(periodSelect).append(`<option value="5"> 01-Oct-2018 to 31-Mar-2019  </option>`)
                $(periodSelect).append(`<option value="6"> 01-Apr-2019 to 30-Jun-2019  </option>`)
                $(periodSelect).append(`<option value="7"> 01-Jul-2019 to 31-Mar-2020  </option>`)
                $(periodSelect).append(`<option value="8">  01-Apr-2020 to 31-Mar-2021  </option>`)
                $(periodSelect).append(`<option value="9">  01-Apr-2021 to 31-Mar-2022  </option>`)
                $(periodSelect).append(`<option value="10"> 01-Apr-2022 to 31-Dec-2022 </option>`)
                $(periodSelect).append(`<option value="11"> 01-Jan-2023 to 31-Mar-2023 </option>`)

                break;
            case '2':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="1"> 01-Apr-2015 to 31-Mar-2016  </option>`)
                $(periodSelect).append(`<option value="2"> 01-Apr-2016 to 30-Sep-2016   </option>`)
                $(periodSelect).append(`<option value="3">01-Oct-2016 to  31-Mar-2017   </option>`)
                $(periodSelect).append(`<option value="4">01-Apr-2017 to 30-Jun-2017  </option>`)
                $(periodSelect).append(`<option value="5"> 01-Jul-2017 to 31-Dec-2017   </option>`)
                $(periodSelect).append(`<option value="6"> 01-Jan-2018 to 31-Mar-2018   </option>`)
                $(periodSelect).append(`<option value="7"> 01-Apr-2018 to 30-Sep-2018   </option>`)
                $(periodSelect).append(`<option value="8">01-Oct-2018 to 31-Mar-2019   </option>`)
                $(periodSelect).append(`<option value="9"> 01-Apr-2019 to 30-Jun-2019   </option>`)
                $(periodSelect).append(`<option value="10">   01-Jul-2019 to 31-Mar-2020     </option>`)
                $(periodSelect).append(`<option value="11">   01-Apr-2020 to 31-Mar-2021    </option>`)
                break;
            case '3':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="1"> 01-Apr-2014 to 31-Mar-2015  </option>`)
                $(periodSelect).append(`<option value="2">01-Apr-2015 to 31-Mar-2016   </option>`)
                $(periodSelect).append(`<option value="3"> 01-Apr-2016 to 30-Sep-2016   </option>`)
                $(periodSelect).append(`<option value="4"> 01-Oct-2016 to 31-Mar-2017  </option>`)
                $(periodSelect).append(`<option value="5"> 01-Apr-2017 to 30-Jun-2017   </option>`)
                $(periodSelect).append(`<option value="6"> 01-Jul-2017 to 31-Dec-2017   </option>`)
                $(periodSelect).append(`<option value="7"> 01-Jan-2018 to 31-Mar-2018  </option>`)
                $(periodSelect).append(`<option value="8"> 01-Apr-2018 to 30-Sep-2018   </option>`)
                $(periodSelect).append(`<option value="9"> 01-Oct-2018 to 31-Mar-2019  </option>`)
                $(periodSelect).append(`<option value="10">  01-Apr-2019 to 31-Mar-2020   </option>`)
                break;
            case '4':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="1"> 01-Apr-2013 to 31-Mar-2014 </option>`)
                $(periodSelect).append(`<option value="2"> 01-Apr-2014 to 31-Mar-2015   </option>`)
                $(periodSelect).append(`<option value="3"> 01-Apr-2015 to 31-Mar-2016   </option>`)
                $(periodSelect).append(`<option value="4">01-Apr-2016 to 30-Sep-2016   </option>`)
                $(periodSelect).append(`<option value="5"> 01-Oct-2016 to  31-Mar-2017   </option>`)
                $(periodSelect).append(`<option value="6"> 01-Apr-2017 to 30-Jun-2017 </option>`)
                $(periodSelect).append(`<option value="7"> 01-Jul-2017 to 31-Dec-2017  </option>`)
                $(periodSelect).append(`<option value="8"> 01-Jan-2018 to 31-Mar-2018  </option>`)
                $(periodSelect).append(`<option value="9"> 01-Apr-2018 to 31-Mar-2019   </option>`)
                break;
            case '5':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="1"> 01-Apr-2011 to 30-Nov-2011  </option>`)
                $(periodSelect).append(`<option value="2">01-Apr-2012 to 31-Mar-2013  </option>`)
                $(periodSelect).append(`<option value="3"> 01-Apr-2013 to 31-Mar-2014  </option>`)
                $(periodSelect).append(`<option value="4"> 01-Apr-2014 to 31-Mar-2015  </option>`)
                $(periodSelect).append(`<option value="5"> 01-Apr-2015 to 31-Mar-2016   </option>`)
                $(periodSelect).append(`<option value="6"> 01-Apr-2016 to 30-Sep-2016  </option>`)
                $(periodSelect).append(`<option value="7"> 01-Oct-2016 to 31-Mar-2017   </option>`)
                $(periodSelect).append(`<option value="8"> 01-Apr-2017 to 31-Mar-2018   </option>`)
                break;
            case '6':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="1"> 01-Apr-2010 to 31-Mar-2011  </option>`)
                $(periodSelect).append(`<option value="2"> 01-Apr-2011 to 30-Nov-2011  </option>`)
                $(periodSelect).append(`<option value="3"> 01-Dec-2011 to 31-Mar-2012   </option>`)
                $(periodSelect).append(`<option value="4"> 01-Apr-2012 to 31-Mar-2013   </option>`)
                $(periodSelect).append(`<option value="5"> 01-Apr-2013 to 31-Mar-2014   </option>`)
                $(periodSelect).append(`<option value="6"> 01-Apr-2014 to 31-Mar-2015   </option>`)
                $(periodSelect).append(`<option value="7"> 01-Apr-2015 to 31-Mar-2016   </option>`)
                $(periodSelect).append(`<option value="8"> 01-Apr-2016 to 31-Mar-2017  </option>`)
                break;
            case '7':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="1"> 01-Apr-2010 to 31-Mar-2011  </option>`)
                $(periodSelect).append(`<option value="2"> 01-Apr-2011 to 30-Nov-2011  </option>`)
                $(periodSelect).append(`<option value="3"> 01-Dec-2011 to 31-Mar-2012   </option>`)
                $(periodSelect).append(`<option value="4"> 01-Apr-2012 to 31-Mar-2013   </option>`)
                $(periodSelect).append(`<option value="5"> 01-Apr-2013 to 31-Mar-2014   </option>`)
                $(periodSelect).append(`<option value="6"> 01-Apr-2014 to 31-Mar-2015   </option>`)
                $(periodSelect).append(`<option value="7"> 01-Apr-2015 to 31-Mar-2016   </option>`)
                $(periodSelect).append(`<option value="8"> 01-Apr-2016 to 31-Mar-2017  </option>`)
                break;
            default:
                break;
        }
        return
    }
    if (NSCtypeVal === '2') {
        switch ($('#assessment-year').val()) {
            case '1':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="2"> 01-Apr-2012 to 31-Mar-2013  </option>`)
                $(periodSelect).append(`<option value="3"> 01-Apr-2013 to 31-Mar-2014  </option>`)
                $(periodSelect).append(`<option value="4"> 01-Apr-2014 to 31-Mar-2015  </option>`)
                $(periodSelect).append(`<option value="5"> 01-Apr-2015 to 20-Dec-2015  </option>`)
                break;
            case '2':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="1"> 01-Dec-2011 to 31-Mar-2012  </option>`)
                $(periodSelect).append(`<option value="2"> 01-Apr-2012 to 31-Mar-2013  </option>`)
                $(periodSelect).append(`<option value="3"> 01-Apr-2013 to 31-Mar-2014  </option>`)
                $(periodSelect).append(`<option value="4"> 01-Apr-2014 to 31-Mar-2015  </option>`)
                $(periodSelect).append(`<option value="5"> 01-Apr-2015 to 20-Dec-2015  </option>`)
                break;
            case '3':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="1"> 01-Dec-2011 to 31-Mar-2012  </option>`)
                $(periodSelect).append(`<option value="2"> 01-Apr-2012 to 31-Mar-2013  </option>`)
                $(periodSelect).append(`<option value="3"> 01-Apr-2013 to 31-Mar-2014  </option>`)
                $(periodSelect).append(`<option value="4"> 01-Apr-2014 to 31-Mar-2015  </option>`)
                $(periodSelect).append(`<option value="5"> 01-Apr-2015 to 31-Mar-2016  </option>`)
                break;
            case '4':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="1"> 01-Dec-2011 to 31-Mar-2012  </option>`)
                $(periodSelect).append(`<option value="2"> 01-Apr-2012 to 31-Mar-2013  </option>`)
                $(periodSelect).append(`<option value="3"> 01-Apr-2013 to 31-Mar-2014  </option>`)
                $(periodSelect).append(`<option value="4"> 01-Apr-2014 to 31-Mar-2015  </option>`)
                $(periodSelect).append(`<option value="5"> 01-Apr-2015 to 31-Mar-2016  </option>`)
                break;
            case '5':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="1"> 01-Dec-2011 to 31-Mar-2012  </option>`)
                $(periodSelect).append(`<option value="2"> 01-Apr-2012 to 31-Mar-2013  </option>`)
                $(periodSelect).append(`<option value="3"> 01-Apr-2013 to 31-Mar-2014  </option>`)
                $(periodSelect).append(`<option value="4"> 01-Apr-2014 to 31-Mar-2015  </option>`)
                $(periodSelect).append(`<option value="5"> 01-Apr-2015 to 31-Mar-2016  </option>`)
                break;
            case '6':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="1"> 01-Dec-2011 to 31-Mar-2012  </option>`)
                $(periodSelect).append(`<option value="2"> 01-Apr-2012 to 31-Mar-2013  </option>`)
                $(periodSelect).append(`<option value="3"> 01-Apr-2013 to 31-Mar-2014  </option>`)
                $(periodSelect).append(`<option value="4"> 01-Apr-2014 to 31-Mar-2015  </option>`)
                $(periodSelect).append(`<option value="5"> 01-Apr-2015 to 31-Mar-2016  </option>`)
                break;
            case '7':
                $(periodSelect).append(`<option value="0"> Select </option>`)
                $(periodSelect).append(`<option value="1"> 01-Dec-2011 to 31-Mar-2012  </option>`)
                $(periodSelect).append(`<option value="2"> 01-Apr-2012 to 31-Mar-2013  </option>`)
                $(periodSelect).append(`<option value="3"> 01-Apr-2013 to 31-Mar-2014  </option>`)
                $(periodSelect).append(`<option value="4"> 01-Apr-2014 to 31-Mar-2015  </option>`)
                $(periodSelect).append(`<option value="5"> 01-Apr-2015 to 31-Mar-2016  </option>`)
                break;
            default:
                break;
        }
        return
    }
}

// -------------------------------------------------------------------------------foverfunctions---------------------------------------------------------------------------
const tooltipOn = (t, id) => {
    const tooltipInfo = document.getElementsByClassName(id)[0];
    const rect = t.getBoundingClientRect();
    tooltipInfo.style.visibility = 'visible'
    tooltipInfo.style.top = `${rect.top + $(window).scrollTop() + 30}px`
    tooltipInfo.style.left = `${rect.left}px`
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

    // return tooltipInfo.style.visibility = 'hidden'
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

function calculateTotalAmountOfInvestment() {
    let initialAmount = 0
    $('.investment-amount').each(function () {
        const unformat = this.value === "" ? 0 : this.value.replace(/,/gi, "")
        // if (unformat === '' || isNaN(unformat)) return this.value = ''
        // r = parseFloat(unformat).toFixed(2);
        // this.value = addthousandseprator(r)
        console.log(initialAmount, unformat, parseFloat(unformat))
        initialAmount = initialAmount + parseFloat(unformat);
    })
    console.log(initialAmount)
    $('.investment-amount-total').val(addthousandseprator(initialAmount.toFixed(2)))
}