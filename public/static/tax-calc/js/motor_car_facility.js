
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

// ---------------------------------------------------------------alert--------------------------------------------------------------
const showAlert = () => { $('.alert').show(); LogoShiftDown() }
const hideAlert = () => { $('.alert').hide(); LogoShiftUp() }
const LogoShiftDown = () => {

    if ($(window).width() < 450) {
        $('.container-fluid').css('padding-top', '20rem')

    } else {
        $('.container-fluid').css('padding-top', '10rem')
    }
}

const LogoShiftUp = () => $('.container-fluid').css('padding-top', '1rem');

// ==================================================================================================================================


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

// ==================================================================================================================================
function ResetMotorCar() {
    $("#divMonth .div-table input[type=radio]").each(function () { this.checked = false });
    $("input[type=checkbox]").each(function () { this.checked = false; $(this).attr("disabled", "disabled"); });
    $("#divMonth .div-table input[type=text]").each(function () { $(this).val("") });
}
function Selection5Calculate() {
    $("#divMonth div.div-table .div-row").not(".thead,.total-row").each(function () {
        var t = 0, i = 0, r = 0, u = $("#hdn-switch-option").val(), n, f, e;
        if (u === "5" ? (t = 900,
            i = 1800,
            r = 2400) : u == "6" ? (t = 900,
                i = 600,
                r = 900) : u == "7" && (t = 900,
                    i = 1800,
                    r = 2400),
            n = 0,
            f = $(this).find("input[type=radio]:checked").val(),
            typeof f != "undefined")
            if (f === "0" ? n = i : f === "1" && (n = r),
                e = $(this).find("input[type=checkbox]").prop("checked"),
                e && (n = n + t),
                u === "7") {
                $(this).find(".div-cell:nth-child(11) input[type=text]").val(n);
                var s = $(this).find(".div-cell:nth-child(10) input[type=text]").val()
                    , h = $(this).find(".div-cell:nth-child(11) input[type=text]").val()
                    , c = $(this).find(".div-cell:nth-child(12) input[type=text]").val()
                    , o = s - h - c;
                // $(this).find(".div-cell:nth-child(13) input[type=text]").val(o > 0 ? o : 0)
            }
            else
                $(this).find(".div-cell:nth-child(13) input[type=text]").val(n)
    });
    var n = $("div.div-table .div-row").not(".thead,.total-row").find(".div-cell:last").ColumnsTotal()
        , t = $("div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(10)").ColumnsTotal()
        , i = $("div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(11)").ColumnsTotal()
        , r = $("div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(12)").ColumnsTotal();
    $("div.div-table .total-row").find(".div-cell:nth-child(10) input.form-control").val(t.toFixed(2));
    $("div.div-table .total-row").find(".div-cell:nth-child(11) input.form-control").val(i.toFixed(2));
    $("div.div-table .total-row").find(".div-cell:nth-child(12) input.form-control").val(r.toFixed(2));
    $("div.div-table .total-row").find("input.form-control:last").val(n.toFixed(2))
}
$(document).ready(function () {
    $(".form-control").attr('maxlength', '15');
    $("#hdn-switch-OtherOption").val("");
    $("#anchorMotor").click(function () {
        $(this).addClass("calculator-tabs");
        $(this).parent().addClass("active");
        $("#anchorOther").removeClass("calculator-tabs");
        $("#anchorOther").parent().removeClass("active");
        $("#divMotorcar").show();
        $("#divOther").hide();
        $("#hdn-switch-OtherOption").val("car");
        hideAlert();
        $("#divMonthOther").hide();
        $("input:radio").each(function () {
            this.checked = !1
        })
    });

    $("#anchorOther").click(function () {
        $(this).addClass("calculator-tabs");
        $(this).parent().addClass("active");
        $("#anchorMotor").removeClass("calculator-tabs");
        $("#anchorMotor").parent().removeClass("active");
        $("#divMotorcar").hide();
        $("#divOther").show();
        $("#hdn-switch-OtherOption").val("other");
        hideAlert();
        $("#divOwner").hide();
        $("#divMaintenance").hide();
        $("#divMonth").hide();
        $("input:radio").each(function () {
            this.checked = !1
        })
    });
    $("#divMonth div.div-table .div-row").not(".thead,.total-row").find("input[type=radio],input[type=checkbox],input[type=text]").change(function () {
        this.type === "radio" && $(this).closest("div.div-row").find("input[type=checkbox]").removeAttr("disabled");
        Selection5Calculate()
    });
    $("#divMonth div.div-table .div-row .div-cell:nth-child(2) .form-control:first").change(function () {
        var t, i, r;
        $("#divMonth div.div-table .div-row .div-cell:nth-child(4) .form-control").val() == "" ? $("#divMonth div.div-table .div-row .div-cell:nth-child(2) .form-control").val($(this).getFloat()) : ($("#divMonth div.div-table .div-row .div-cell:nth-child(2) .form-control:first").val(""),
            showAlert(),
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = 'Car can be either owned by employer or can be hired by employer.'
        );
        t = $("#divMonth div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(2)").ColumnsTotal();
        $("#divMonth div.div-table .div-row.total-row .div-cell:nth-child(2) .form-control").val(t.toFixed());
        i = $("#divMonth div.div-table .div-row.total-row .div-cell:nth-child(2) .form-control").getFloat();
        r = i * .1 / 12;
        // $("#divMonth div.div-table .div-row .div-cell:nth-child(3) .form-control").val(r.toFixed());
        // u = $("#divMonth div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(3)").ColumnsTotal();
        // $("#divMonth div.div-table .div-row.total-row .div-cell:nth-child(3) .form-control").val(u.toFixed())
    });
    $("#divMonth div.div-table .div-row .div-cell:nth-child(4) .form-control:first").change(function () {
        var n, t;
        $("#divMonth div.div-table .div-row .div-cell:nth-child(2) .form-control").val() == "" ? $("#divMonth div.div-table .div-row .div-cell:nth-child(4) .form-control").val($(this).getFloat()) : ($("#divMonth div.div-table .div-row .div-cell:nth-child(4) .form-control:first").val(""),
            showAlert(),
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = 'Car can be either owned by employer or can be hired by employer.');
        t = $("#divMonth div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(4)").ColumnsTotal();
        $("#divMonth div.div-table .div-row.total-row .div-cell:nth-child(4) .form-control").val(t.toFixed())
    });
    $("#divMonth div.div-table .div-row .div-cell:nth-child(5) .form-control:first").change(function () {
        hideAlert();
        $("#divMonth div.div-table .div-row .div-cell:nth-child(5) .form-control").val($(this).getFloat());
        var n = $("#divMonth div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(5)").ColumnsTotal();
        $("#divMonth div.div-table .div-row.total-row .div-cell:nth-child(5) .form-control").val(n.toFixed())
    });
    $("#divMonth div.div-table .div-row .div-cell:nth-child(6) .form-control:first").change(function () {
        hideAlert();
        $("#divMonth div.div-table .div-row .div-cell:nth-child(6) .form-control").val($(this).getFloat());
        var n = $("#divMonth div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(6)").ColumnsTotal();
        $("#divMonth div.div-table .div-row.total-row .div-cell:nth-child(6) .form-control").val(n.toFixed())
    });
    $("#divMonth div.div-table .div-row .div-cell:nth-child(12) .form-control:first").change(function () {
        hideAlert();
        $("#divMonth div.div-table .div-row .div-cell:nth-child(12) .form-control").val($("div.div-table .div-row .div-cell:nth-child(12) .form-control:first").getFloat())
    });

    $("#divMonthOther div.div-table .div-row .div-cell:nth-child(2) .form-control:first").change(function () {
        hideAlert();
        $("#divMonthOther div.div-table .div-row .div-cell:nth-child(2) .form-control").val($(this).getFloat());
        var n = $("#divMonth div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(2)").ColumnsTotal();
        $("#divMonthOther div.div-table .div-row.total-row .div-cell:nth-child(2) .form-control").val(n.toFixed())
    });
    $("#divMonthOther div.div-table .div-row .div-cell:nth-child(4) .form-control:first").change(function () {
        hideAlert();
        $("#divMonthOther div.div-table .div-row .div-cell:nth-child(4) .form-control").val($(this).getFloat());
        var n = $("#divMonth div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(4)").ColumnsTotal();
        $("#divMonthOther div.div-table .div-row.total-row .div-cell:nth-child(4) .form-control").val(n.toFixed())
    });

    $("div.div-table .div-row").not(".thead,.total-row").find("input.form-control").change(function () {
        var t = $("#hdn-switch-option").val(), i = $("#hdn-switch-OtherOption").val(), n;
        $("div.div-table .div-row").not(".thead,.total-row").each(function () {
            var n = 0
                , s = 0
                , h = 0;
            if (i == "" && (i = "car"),
                i == "car") {
                s = $(this).find(".div-cell:nth-child(2) .form-control").getFloat();
                h = s * .1 / 12;
                // $(this).find(".div-cell:nth-child(3) .form-control").val(h.toFixed());
                var e = $(this).find(".div-cell:nth-child(3) .form-control").getFloat()
                    , o = $(this).find(".div-cell:nth-child(4) .form-control").getFloat()
                    , r = $(this).find(".div-cell:nth-child(5) .form-control").getFloat()
                    , f = $(this).find(".div-cell:nth-child(6) .form-control").getFloat()
                    , u = $(this).find(".div-cell:nth-child(12) .form-control").getFloat();

                // $("#divMonth div.div-table .div-row .div-cell:nth-child(2) .form-control").val() != "" ? (t == "1" ? n = e + r + f - u : t == "2" && (n = e + r - u),
                //     n = n > 0 ? n : 0,
                //     $(this).find("input.form-control:last").val(n.toFixed())) : $("#divMonth div.div-table .div-row .div-cell:nth-child(4) .form-control").val() != "" && (t == "1" ? n = o + r + f - u : t == "2" && (n = o + r - u),
                //         n = n > 0 ? n : 0,
                //         $(this).find("input.form-control:last").val(n.toFixed()));
                // t == "3" && (n = f + r - u,
                //     n = n > 0 ? n : 0,
                //     $(this).find("input.form-control:last").val(n.toFixed()));
                // t == "4" && (n = f + r - u,
                //     n = n > 0 ? n : 0,
                //     $(this).find("input.form-control:last").val(n.toFixed())
                // )
            } else {
                var e = $(this).find(".div-cell:nth-child(2) .form-control").getFloat()
                    , o = $(this).find(".div-cell:nth-child(3) .form-control").getFloat()
                    , r = $(this).find(".div-cell:nth-child(4) .form-control").getFloat();
                n = e - o - r;
                n = n > 0 ? n : 0;
                n = n.toFixed();
                // $(this).find("input.form-control:last").val(n)
            }
        });

        n = $("#divMonth div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(2)").ColumnsTotal();
        $("#divMonth div.div-table .div-row.total-row .div-cell:nth-child(2) .form-control").val(n);
        n = $("#divMonth div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(4)").ColumnsTotal();
        $("#divMonth div.div-table .div-row.total-row .div-cell:nth-child(4) .form-control").val(n);
        n = $("#divMonth div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(5)").ColumnsTotal();
        $("#divMonth div.div-table .div-row.total-row .div-cell:nth-child(5) .form-control").val(n);
        n = $("#divMonth div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(6)").ColumnsTotal();
        $("#divMonth div.div-table .div-row.total-row .div-cell:nth-child(6) .form-control").val(n);
        n = $("#divMonth div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(3)").ColumnsTotal();
        $("#divMonth div.div-table .div-row.total-row .div-cell:nth-child(3) .form-control").val(n);
        n = $("div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(12)").ColumnsTotal();
        $("#divMonth div.div-table .div-row.total-row .div-cell:nth-child(12) .form-control").val(n);
        n = $("div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(13)").ColumnsTotal();
        $("#divMonth div.div-table .div-row.total-row .div-cell:nth-child(13) .form-control").val(n);
        n = $("#divMonthOther div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(2)").ColumnsTotal();
        $("#divMonthOther div.div-table .div-row.total-row .div-cell:nth-child(2) .form-control").val(n);
        n = $("#divMonthOther div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(4)").ColumnsTotal();
        $("#divMonthOther div.div-table .div-row.total-row .div-cell:nth-child(4) .form-control").val(n);
        n = $("#divMonthOther div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(5)").ColumnsTotal();
        $("#divMonthOther div.div-table .div-row.total-row .div-cell:nth-child(5) .form-control").val(n);
        n = $("#divMonthOther div.div-table .div-row").not(".thead,.total-row").find(".div-cell:nth-child(3)").ColumnsTotal();
        $("#divMonthOther div.div-table .div-row.total-row .div-cell:nth-child(3) .form-control").val(n)
    });
    $("#radioCarNature").change(function () {

        var n = $(this).val();
        if (n == "Official") {
            showAlert(),
                document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "Value of perquisite will be Nil, following conditions should be satisfied" + " <ul><li>" + "The employer has maintained complete details of journey undertaken for official purpose which may include date of journey, destination, mileage, and the amount of expenditure incurred thereon." + "<\/li><li> " + "The employer gives a certificate to the effect that the expenditure was incurred wholly and exclusively for the performance of official duties." + "<\/li><\/ul>";
            $("#divOwner").hide();
            $("#divMaintenance").hide();
            $("#divMonth").hide()
        } else {
            hideAlert()
            $("#divOwner").show()
            $("#divMaintenance").show()
        }
    });
    $(document).on("change", "#radioCarMaintenance,#radioCarOwner,#radioCarNature", function () {
        var n = $("#radioCarNature").val(),
            t = $("#radioCarOwner").val(),
            i = $("#radioCarMaintenance").val(),
            r;
        $("#hdn-switch-option").val("");
        ResetMotorCar();
        n == "Private" && t == "Employer" && i == "Employer" ? ($(".error").hide(),
            $(".error").text(""),
            $("#divMonth").show(),
            $("#divMonth div.div-table .div-row .div-cell").show(),
            $("#divMonth div.div-table .div-row .div-cell:nth-child(6)").nextAll().hide(),
            $("#divMonth div.div-table .div-row .div-cell:nth-last-child(2)").show(),
            $("#divMonth div.div-table .div-row .div-cell:nth-last-child(1)").show(),
            $("#divMonth div.div-table .div-row .div-cell").find(".form-control").val(""),
            $("#hdn-switch-option").val(1)) : n == "Private" && t == "Employer" && i == "Employee" ? ($(".error").hide(),
                $(".error").text(""),
                $("#divMonth").show(),
                $("#divMonth div.div-table .div-row .div-cell").show(),
                $("#divMonth div.div-table .div-row .div-cell").find(".form-control").val(""),
                $("#divMonth div.div-table .div-row .div-cell:nth-child(6)").nextAll().hide(),
                $("#divMonth div.div-table .div-row .div-cell:nth-child(6)").hide(),
                $("#divMonth div.div-table .div-row .div-cell:nth-last-child(2)").show(),
                $("#divMonth div.div-table .div-row .div-cell:nth-last-child(1)").show(),
                $("#hdn-switch-option").val(2)) : n == "Private" && t == "Employee" && i == "Employer" ? ($(".error").hide(),
                    $(".error").text(""),
                    $("#divMonth").show(),
                    $("#divMonth div.div-table .div-row .div-cell").show(),
                    $("#divMonth div.div-table .div-row .div-cell").find(".form-control").val(""),
                    $("#divMonth div.div-table .div-row .div-cell:nth-child(11)").hide(),
                    $("#divMonth div.div-table .div-row .div-cell:nth-child(2)").hide(),
                    $("#divMonth div.div-table .div-row .div-cell:nth-child(3)").hide(),
                    $("#divMonth div.div-table .div-row .div-cell:nth-child(4)").hide(),
                    $("#divMonth div.div-table .div-row .div-cell:nth-child(7)").hide(),
                    $("#divMonth div.div-table .div-row .div-cell:nth-child(8)").hide(),
                    $("#divMonth div.div-table .div-row .div-cell:nth-child(9)").hide(),
                    $("#divMonth div.div-table .div-row .div-cell:nth-child(10)").hide(),
                    $("#hdn-switch-option").val(3)) : n == "Private" && t == "Employee" && i == "Employee" ? (showAlert(),
                        document.getElementById("income_and_tax_calculator_alert_text").innerHTML = 'Value of perquisite will be Nil', $("#divMonth").hide(), ResetMotorCar(),
                        $("#hdn-switch-option").val(4)) : n == "Both" && t == "Employer" && i == "Employer" ? ($(".error").hide(),
                            $(".error").text(""),
                            $("#divMonth").show(),
                            $("#divMonth div.div-table .div-row .div-cell").show(),
                            $("#divMonth div.div-table .div-row .div-cell").find(".form-control").val(""),
                            $("#divMonth div.div-table .div-row .div-cell:nth-child(2)").hide(),
                            $("#divMonth div.div-table .div-row .div-cell:nth-child(3)").hide(),
                            $("#divMonth div.div-table .div-row .div-cell:nth-child(4)").hide(),
                            $("#divMonth div.div-table .div-row .div-cell:nth-child(5)").hide(),
                            $("#divMonth div.div-table .div-row .div-cell:nth-child(6)").hide(),
                            $("#divMonth div.div-table .div-row .div-cell:nth-child(10)").hide(),
                            $("#divMonth div.div-table .div-row .div-cell:nth-child(11)").hide(),
                            $("#divMonth div.div-table .div-row .div-cell:nth-child(12)").hide(),
                            $("#hdn-switch-option").val(5)) : n == "Both" && t == "Employer" && i == "Employee" ? ($(".error").hide(),
                                $(".error").text(""),
                                $("#divMonth").show(),
                                $("#divMonth div.div-table .div-row .div-cell").show(),
                                $("#divMonth div.div-table .div-row .div-cell").find(".form-control").val(""),
                                $("#divMonth div.div-table .div-row .div-cell:nth-child(2)").hide(),
                                $("#divMonth div.div-table .div-row .div-cell:nth-child(3)").hide(),
                                $("#divMonth div.div-table .div-row .div-cell:nth-child(4)").hide(),
                                $("#divMonth div.div-table .div-row .div-cell:nth-child(5)").hide(),
                                $("#divMonth div.div-table .div-row .div-cell:nth-child(6)").hide(),
                                $("#divMonth div.div-table .div-row .div-cell:nth-child(10)").hide(),
                                $("#divMonth div.div-table .div-row .div-cell:nth-child(11)").hide(),
                                $("#divMonth div.div-table .div-row .div-cell:nth-child(12)").hide(),
                                $("#hdn-switch-option").val(6)) : n == "Both" && t == "Employee" && i == "Employer" ? ($(".error").hide(),
                                    $(".error").text(""),
                                    $("#divMonth").show(),
                                    $("#divMonth div.div-table .div-row .div-cell").show(),
                                    $("#divMonth div.div-table .div-row .div-cell").find(".form-control").val(""),
                                    $("#divMonth div.div-table .div-row .div-cell:nth-child(2)").hide(),
                                    $("#divMonth div.div-table .div-row .div-cell:nth-child(3)").hide(),
                                    $("#divMonth div.div-table .div-row .div-cell:nth-child(4)").hide(),
                                    $("#divMonth div.div-table .div-row .div-cell:nth-child(5)").hide(),
                                    $("#divMonth div.div-table .div-row .div-cell:nth-child(6)").hide(),
                                    $("#divMonth div.div-table .div-row .div-cell:nth-child(10) input[type=text]").not(".total-row input[type=text]").removeAttr("disabled"),
                                    $("#hdn-switch-option").val(7)) : n == "Both" && t == "Employee" && i == "Employee" && (
                                        showAlert(),
                                        document.getElementById("income_and_tax_calculator_alert_text").innerHTML = 'Value of perquisite will be Nil', $("#divMonth").hide(), ResetMotorCar()
                                    )
    });
    $("#radioNature").change(function () {
        var n = $("#radioNature").val();
        n == "Official" ? ($(".error").show(),
            showAlert(),
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = 'Value of perquisite will be Nil, following conditions should be satisfied <ul><li> The employer has maintained complete details of journey undertaken for official purpose which may include date of journey, destination, mileage, and the amount of expenditure incurred thereon.<\/li><li> The employer gives a certificate to the effect that the expenditure was incurred wholly and exclusively for the performance of official duties.<\/li><\/ul>',
            $("#divMonthOther").hide()) : (hideAlert(),
                $(".error").html(""),
                $("#divMonthOther").show(),
                $("#divMonthOther div.div-table .div-row .div-cell").show(),
                $("#divMonthOther div.div-table .div-row .div-cell").find(".form-control").val(""),
                $("#divMonthOther div.div-table .div-row .div-cell:nth-child(3)").find(".form-control").val("900"),
                $("#hdn-switch-option").val(9))
    })
});

$.fn.ColumnsTotal = function () {
    var n = 0;
    return $(this).find(".form-control").each(function () {
        var t = $(this).val();
        isNaN(t) || t.length === 0 || (n += parseFloat(t))
    }),
        n
};

$.fn.getFloat = function () {
    var t = this.val() === "" ? "" : this.val()
        , n = parseFloat(t);
    return isNaN(n) ? '' : n
};

$(document).on("change", ".form-control", function (n) {

    const regexx = /^-?\d+(?:\.\d+)?$/g

    if (isNaN(parseFloat(this.value))) return this.value = ''

    if (!regexx.test(this.value)) return this.value = ''

    // return $(this).trigger("change");
});
$(document).on("paste", ".form-control", function (n) {
    const regexx = /^-?\d+(?:\.\d+)?$/g

    var t = n.originalEvent.clipboardData.getData("Text");
    if (isNaN(parseFloat(t))) return false

    if (!regexx.test(n.originalEvent.clipboardData.getData("Text"))) return false
});