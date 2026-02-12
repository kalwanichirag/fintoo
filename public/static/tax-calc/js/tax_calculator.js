
// ==========================================================================================================================
function lockcontrol() {
    return !1
}
function chkIntInput(n, t) {
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
function ValidateAndFormatNumber(n, t) {
    var i, r;
    if (n.value != "") {
        if (UnFormatNumber(n),
            // i = /^-?\d+\.{0,1}\d*$/.test(n.value),
            i = /^[0-9]+$/.test(n.value),
            !i) {
            showAlert()
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = 'Only integer is accepted';
            n.value = "0";
            n.focus();
            n.select();
            return
        }
        if (t == "Percentage" && parseFloat(n.value) > 100) {
            alert("Percentage Input can not exceed 100.");
            n.value = "100";
            n.focus();
            n.select();
            return
        }
        isNaN(parseFloat(n.value)) && (alert("Number exceeding float range"),
            n = "0",
            n.focus(),
            n.select());
        // r = parseFloat(n.value);
        // n.value = r;
        n.value = addthousandseprator(n.value)
        hideAlert()
    }
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
function UnFormatNumber(n) {
    n.value != "" && (n.value = n.value.replace(/,/gi, ""))
}
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

function fillcategorycombojs(n) {
    try {
        handleSelectBasedOnYear()
        if (n === "15" || n === "14") {
            catenew.style.display = "none",
                cateold.style.display = "block"
        } else {
            catenew.style.display = "block",
                cateold.style.display = "none"
        }
    } catch (t) { }
}
function setStatuscombojs(n, t, i, r, u) {
    if (n.value == "individual") {
        (t.style.display = "",
            i == !1 && (r.style.display = "",
                u.readOnly = !0))
        handleSelectBasedOnYear()
        $("#res_status").prop('disabled', false);
    } else {
        (t.style.display = "none",
            i == !1 && (r.style.display = "none",
                u.readOnly = !1))
        $("#category_1").prop('disabled', true);
        $("#category_2").prop('disabled', true);
        $("#res_status").prop('disabled', true);
    }
}

function handleSelectBasedOnYear() {
    const selectedYear = document.getElementById("assessment_year").value;
    if (selectedYear == "14" || selectedYear == "13") {
        $("#category_1").prop('disabled', true);
        $("#category_2").prop('disabled', false);
    } else {
        $("#category_1").prop('disabled', false);
        $("#category_2").prop('disabled', true);
    }

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

// ---------------------------------------------------------------alert--------------------------------------------------------------
const showAlert = () => $('.alert').show();
const hideAlert = () => $('.alert').hide();
const LogoShiftDown = () => $('.container-fluid').css('padding-top', '3rem');
const LogoShiftUp = () => $('.container-fluid').css('padding-top', '1rem');