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

const addTableRow = () => {
    var n = $("#div-table div.div-row").not("thead,.total-row").length;
    $("div#table-row-template .s-no").text(n);
    $("#div-table div.div-row:last").after($("div#table-row-template").html())
};

const removeTableRow = (t) => {
    $(t).parent().remove();
    $("#div-table div.div-row").not(".thead,.total-row").each((index, elem) => {
        $(elem).find('.s-no').text(index + 1);
    })
};

$("input").change(function () {
    if ($(this).hasClass("particular")) return false
    ValidateAndFormatNumber(this, '')
})

const changeFunction = (t) => {
    if ($(t).hasClass("particular")) return false
    ValidateAndFormatNumber(t, '')
}

// -------------------------------------------------------------------------------foverfunctions---------------------------------------------------------------------------
const tooltipOn = (t, id, arrowClass) => {
    const tooltipInfo = document.getElementsByClassName(id)[0];
    const tooltipInfoCord = tooltipInfo.getBoundingClientRect();
    const rect = t.getBoundingClientRect();
    tooltipInfo.style.top = `${rect.top + $(window).scrollTop() - tooltipInfoCord.height}px`
    tooltipInfo.style.left = `${rect.left + 350}px`
    tooltipInfo.style.visibility = 'visible'
    const tooltipArrowInfo = document.getElementsByClassName(arrowClass)[0];

    const tooltipInfoCordUpdated = tooltipInfo.getBoundingClientRect();
    tooltipArrowInfo.style.right = `${tooltipInfoCordUpdated.right - rect.right + 5}px`
}
const tooltipOff = (e, id, arrowClass) => {
    const tooltipInfo = document.getElementsByClassName(id)[0];
    const tooltipArrowInfo = document.getElementsByClassName(arrowClass)[0];

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