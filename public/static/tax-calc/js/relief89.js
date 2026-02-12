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

function SelectYear(n) {
    n == "2016-17" ? ($("#txtPYar4").val("2016-17"),
        $("#txtPYar3").val("2016-17"),
        $("#txtPYar2A").val("2016-17"),
        $("#txtPYar2").val("2016-17"),
        $("#txtY1ar2").val("2015-16"),
        $("#txtY2ar2").val("2014-15"),
        $("#txtY1ar2A").val("2015-16"),
        $("#txtY2ar2A").val("2014-15"),
        $("#txtY3ar2A").val("2013-14"),
        $("#txtY1ar3").val("2015-16"),
        $("#txtY2ar3").val("2014-15"),
        $("#txtY3ar3").val("2013-14"),
        $("#txtY1ar4").val("2015-16"),
        $("#txtY2ar4").val("2014-15"),
        $("#txtY3ar4").val("2013-14")) : n == "2017-18" ? ($("#txtPYar4").val("2017-18"),
            $("#txtPYar3").val("2017-18"),
            $("#txtPYar2A").val("2017-18"),
            $("#txtPYar2").val("2017-18"),
            $("#txtY1ar2").val("2016-17"),
            $("#txtY2ar2").val("2015-16"),
            $("#txtY1ar2A").val("2016-17"),
            $("#txtY2ar2A").val("2015-16"),
            $("#txtY3ar2A").val("2014-15"),
            $("#txtY1ar3").val("2016-17"),
            $("#txtY2ar3").val("2015-16"),
            $("#txtY3ar3").val("2014-15"),
            $("#txtY1ar4").val("2016-17"),
            $("#txtY2ar4").val("2015-16"),
            $("#txtY3ar4").val("2014-15")) : n == "2018-19" ? ($("#txtPYar4").val("2018-19"),
                $("#txtPYar3").val("2018-19"),
                $("#txtPYar2A").val("2018-19"),
                $("#txtPYar2").val("2018-19"),
                $("#txtY1ar2").val("2017-18"),
                $("#txtY2ar2").val("2016-17"),
                $("#txtY1ar2A").val("2017-18"),
                $("#txtY2ar2A").val("2016-17"),
                $("#txtY3ar2A").val("2015-16"),
                $("#txtY1ar3").val("2017-18"),
                $("#txtY2ar3").val("2016-17"),
                $("#txtY3ar3").val("2015-16"),
                $("#txtY1ar4").val("2017-18"),
                $("#txtY2ar4").val("2016-17"),
                $("#txtY3ar4").val("2015-16")) : n == "2019-20" ? ($("#txtPYar4").val("2019-20"),
                    $("#txtPYar3").val("2019-20"),
                    $("#txtPYar2A").val("2019-20"),
                    $("#txtPYar2").val("2019-20"),
                    $("#txtY1ar2").val("2018-19"),
                    $("#txtY2ar2").val("2017-18"),
                    $("#txtY1ar2A").val("2018-19"),
                    $("#txtY2ar2A").val("2017-18"),
                    $("#txtY3ar2A").val("2016-17"),
                    $("#txtY1ar3").val("2018-19"),
                    $("#txtY2ar3").val("2017-18"),
                    $("#txtY3ar3").val("2016-17"),
                    $("#txtY1ar4").val("2018-19"),
                    $("#txtY2ar4").val("2017-18"),
                    $("#txtY3ar4").val("2016-17")) : n == "2020-21" ? ($("#txtPYar4").val("2020-21"),
                        $("#txtPYar3").val("2020-21"),
                        $("#txtPYar2A").val("2020-21"),
                        $("#txtPYar2").val("2020-21"),
                        $("#txtY1ar2").val("2019-20"),
                        $("#txtY2ar2").val("2018-19"),
                        $("#txtY1ar2A").val("2019-20"),
                        $("#txtY2ar2A").val("2018-19"),
                        $("#txtY3ar2A").val("2017-18"),
                        $("#txtY1ar3").val("2019-20"),
                        $("#txtY2ar3").val("2018-19"),
                        $("#txtY3ar3").val("2017-18"),
                        $("#txtY1ar4").val("2019-20"),
                        $("#txtY2ar4").val("2018-19"),
                        $("#txtY3ar4").val("2017-18")) : n == "2021-22" ? ($("#txtPYar4").val("2021-22"),
                            $("#txtPYar3").val("2021-22"),
                            $("#txtPYar2A").val("2021-22"),
                            $("#txtPYar2").val("2021-22"),
                            $("#txtY1ar2").val("2020-21"),
                            $("#txtY2ar2").val("2019-20"),
                            $("#txtY1ar2A").val("2020-21"),
                            $("#txtY2ar2A").val("2019-20"),
                            $("#txtY3ar2A").val("2018-19"),
                            $("#txtY1ar3").val("2020-21"),
                            $("#txtY2ar3").val("2019-20"),
                            $("#txtY3ar3").val("2018-19"),
                            $("#txtY1ar4").val("2020-21"),
                            $("#txtY2ar4").val("2019-20"),
                            $("#txtY3ar4").val("2018-19")) : n == "2022-23" && ($("#txtPYar4").val("2022-23"),
                                $("#txtPYar3").val("2022-23"),
                                $("#txtPYar2A").val("2022-23"),
                                $("#txtPYar2").val("2022-23"),
                                $("#txtY1ar2").val("2021-22"),
                                $("#txtY2ar2").val("2020-21"),
                                $("#txtY1ar2A").val("2021-22"),
                                $("#txtY2ar2A").val("2020-21"),
                                $("#txtY3ar2A").val("2019-20"),
                                $("#txtY1ar3").val("2021-22"),
                                $("#txtY2ar3").val("2020-21"),
                                $("#txtY3ar3").val("2019-20"),
                                $("#txtY1ar4").val("2021-22"),
                                $("#txtY2ar4").val("2020-21"),
                                $("#txtY3ar4").val("2019-20"))
}

function Recalculate89() {
    var n = $("#ddlAssessmentYearRelief").find(":selected").text();
    n == "2017-18" ? (ReSetTextValue201819(),
        ReSetTextValue201920(),
        ReSetTextValue202021(),
        ReSetTextValue202122()) : n == "2018-19" ? (ReSetTextValue201920(),
            ReSetTextValue202021(),
            ReSetTextValue202122()) : n == "2019-20" ? (ReSetTextValue202021(),
                ReSetTextValue202122()) : n == "2020-21" ? ReSetTextValue202122() : n == "2021-22" ? ReSetTextValue202223() : n == "2023-24" && ReSetTextValue202324();
    $("#divInputRow20212223").hide();
    $("#divOutPut202223").hide();
    $("#divcurrentAssesmentYear202324").hide();
    $("#divoutput2023-24").hide();
    n == "2023-24" ? ($("#divInputRow20212223").show(),
        $("#divOutPut202223").show(),
        $("#divInputRow20202122").show(),
        $("#divOutPut202122").show(),
        $("#divInputRow20192021").show(),
        $("#divOutPut202021").show(),
        $("#divInputRow20181920").show(),
        $("#divOutPut201920").show(),
        $("#divInputRow20171819").show(),
        $("#divOutPut201819").show(),
        $("#divInputRow20161718").show(),
        $("#divOutPut201718").show(),
        $("#divdefualt").hide(),
        $("#divcurrentAssesmentYear").hide(),
        $("#divcurrentAssesmentYear201920").hide(),
        $("#divcurrentAssesmentYear202021").hide(),
        $("#divcurrentAssesmentYear202122").hide(),
        $("#divcurrentAssesmentYear202223").hide(),
        $("#divcurrentAssesmentYear202324").show(),
        $("#divoutput2023-24").show(),
        $("#divoutput2022-23").hide(),
        $("#divoutput2021-22").hide(),
        $("#divoutput2020-21").hide(),
        $("#divoutput2019-20").hide(),
        $("#divoutput2018-19").hide(),
        $("#divoutput2017-18").hide()
    ) : n == "2022-23" ? ($("#divInputRow20212223").hide(),
        $("#divOutPut202223").hide(),
        $("#divInputRow20202122").show(),
        $("#divOutPut202122").show(),
        $("#divInputRow20192021").show(),
        $("#divOutPut202021").show(),
        $("#divInputRow20181920").show(),
        $("#divOutPut201920").show(),
        $("#divInputRow20171819").show(),
        $("#divOutPut201819").show(),
        $("#divInputRow20161718").show(),
        $("#divOutPut201718").show(),
        $("#divdefualt").hide(),
        $("#divcurrentAssesmentYear").hide(),
        $("#divcurrentAssesmentYear201920").hide(),
        $("#divcurrentAssesmentYear202021").hide(),
        $("#divcurrentAssesmentYear202122").hide(),
        $("#divcurrentAssesmentYear202223").show(),
        $("#divcurrentAssesmentYear202324").hide(),
        $("#divoutput2023-24").hide(),
        $("#divoutput2022-23").show(),
        $("#divoutput2021-22").hide(),
        $("#divoutput2020-21").hide(),
        $("#divoutput2019-20").hide(),
        $("#divoutput2018-19").hide(),
        $("#divoutput2017-18").hide()
    ) : n == "2021-22" ? ($("#divInputRow20202122").hide(),
        $("#divOutPut202122").hide(),
        $("#divInputRow20192021").show(),
        $("#divOutPut202021").show(),
        $("#divInputRow20181920").show(),
        $("#divOutPut201920").show(),
        $("#divInputRow20171819").show(),
        $("#divOutPut201819").show(),
        $("#divInputRow20161718").show(),
        $("#divOutPut201718").show(),
        $("#divdefualt").hide(),
        $("#divcurrentAssesmentYear").hide(),
        $("#divcurrentAssesmentYear201920").hide(),
        $("#divcurrentAssesmentYear202021").hide(),
        $("#divcurrentAssesmentYear202122").show(),
        $("#divcurrentAssesmentYear202223").hide(),
        $("#divoutput2022-23").hide(),
        $("#divoutput2021-22").show(),
        $("#divoutput2020-21").hide(),
        $("#divoutput2019-20").hide(),
        $("#divoutput2018-19").hide(),
        $("#divoutput2017-18").hide()
    ) : n == "2020-21" ? ($("#divInputRow20202122").hide(),
        $("#divOutPut202122").hide(),
        $("#divInputRow20192021").hide(),
        $("#divOutPut202021").hide(),
        $("#divInputRow20181920").show(),
        $("#divOutPut201920").show(),
        $("#divInputRow20171819").show(),
        $("#divOutPut201819").show(),
        $("#divInputRow20161718").show(),
        $("#divOutPut201718").show(),
        $("#divdefualt").hide(),
        $("#divcurrentAssesmentYear").hide(),
        $("#divcurrentAssesmentYear201920").hide(),
        $("#divcurrentAssesmentYear202021").show(),
        $("#divcurrentAssesmentYear202122").hide(),
        $("#divcurrentAssesmentYear202223").hide(),
        $("#divoutput2022-23").hide(),
        $("#divoutput2021-22").hide(),
        $("#divoutput2020-21").show(),
        $("#divoutput2019-20").hide(),
        $("#divoutput2018-19").hide(),
        $("#divoutput2017-18").hide()
    ) : n == "2019-20" ? ($("#divInputRow20202122").hide(),
        $("#divOutPut202122").hide(),
        $("#divInputRow20192021").hide(),
        $("#divOutPut202021").hide(),
        $("#divInputRow20181920").hide(),
        $("#divOutPut201920").hide(),
        $("#divInputRow20171819").show(),
        $("#divOutPut201819").show(),
        $("#divInputRow20161718").show(),
        $("#divOutPut201718").show(),
        $("#divdefualt").hide(),
        $("#divcurrentAssesmentYear").hide(),
        $("#divcurrentAssesmentYear201920").show(),
        $("#divcurrentAssesmentYear202021").hide(),
        $("#divcurrentAssesmentYear202122").hide(),
        $("#divcurrentAssesmentYear202223").hide(),
        $("#divoutput2022-23").hide(),
        $("#divoutput2021-22").hide(),
        $("#divoutput2020-21").hide(),
        $("#divoutput2019-20").show(),
        $("#divoutput2018-19").hide(),
        $("#divoutput2017-18").hide()
    ) : n == "2018-19" ? ($("#divInputRow20202122").hide(),
        $("#divOutPut202122").hide(),
        $("#divInputRow20192021").hide(),
        $("#divOutPut202021").hide(),
        $("#divInputRow20181920").hide(),
        $("#divOutPut201920").hide(),
        $("#divInputRow20171819").hide(),
        $("#divOutPut201819").hide(),
        $("#divInputRow20161718").show(),
        $("#divOutPut201718").show(),
        $("#divdefualt").hide(),
        $("#divcurrentAssesmentYear").show(),
        $("#divcurrentAssesmentYear201920").hide(),
        $("#divcurrentAssesmentYear202021").hide(),
        $("#divcurrentAssesmentYear202122").hide(),
        $("#divcurrentAssesmentYear202223").hide(),
        $("#divoutput2022-23").hide(),
        $("#divoutput2021-22").hide(),
        $("#divoutput2020-21").hide(),
        $("#divoutput2019-20").hide(),
        $("#divoutput2018-19").show(),
        $("#divoutput2017-18").hide()
    ) : ($("#divInputRow20202122").hide(),
        $("#divOutPut202122").hide(),
        $("#divInputRow20192021").hide(),
        $("#divOutPut202021").hide(),
        $("#divInputRow20181920").hide(),
        $("#divOutPut201920").hide(),
        $("#divInputRow20171819").hide(),
        $("#divOutPut201819").hide(),
        $("#divInputRow20161718").hide(),
        $("#divOutPut201718").hide(),
        $("#divdefualt").show(),
        $("#divcurrentAssesmentYear").hide(),
        $("#divcurrentAssesmentYear201920").hide(),
        $("#divcurrentAssesmentYear202021").hide(),
        $("#divcurrentAssesmentYear202122").hide(),
        $("#divcurrentAssesmentYear202223").hide(),
        $("#divoutput2022-23").hide(),
        $("#divoutput2021-22").hide(),
        $("#divoutput2020-21").hide(),
        $("#divoutput2019-20").hide(),
        $("#divoutput2018-19").hide(),
        $("#divoutput2017-18").show()
    );
}
function ditmodalpopup(n, t) {
    $("#" + n).fadeIn();
    $("#" + t).fadeIn();
}
const closeClick = () => {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut()
}
function AgeCalculationAsPerAY(n) {
    var t = "", f;
    n == "2011-2012" ? t = "01/04/2011" : n === "2012-2013" ? t = "01/04/2012" : n === "2013-2014" ? t = "01/04/2013" : n === "2014-2015" ? t = "01/04/2014" : n === "2015-2016" ? t = "01/04/2015" : n === "2016-2017" ? t = "01/04/2016" : n === "2017-2018" ? t = "01/04/2017" : n === "2018-2019" ? t = "01/04/2018" : n === "2019-2020" ? t = "01/04/2019" : n === "2020-2021" ? t = "01/04/2020" : n === "2021-2022" ? t = "01/04/2021" : n === "2022-2023" ? t = "01/04/2022" : n === "2023-2024" && (t = "01/04/2023");
    var i = ""
        , r = ""
        , u = t.split("/");
    return u.length == 3 && (i = new Date(u[2], u[1] * 1 - 1, u[0])),
        f = $("#txtDOB").val(),
        f != null && (dob = f.split("/")),
        dob.length === 3 && (born = new Date(dob[2], dob[1] * 1 - 1, dob[0]),
            r = i.getMonth() == born.getMonth() && i.getDate() == born.getDate() ? i.getFullYear() - born.getFullYear() : Math.floor((i.getTime() - born.getTime()) / (365.25 * 864e5)),
            isNaN(r) || r < 0),
        r
}

function ReSetTextValue201819() {
    $("#txtA7").val("");
    $("#txtX7").val("");
    $("#txtD7").val("");
    $("#txtE7").val("");
    $("#txtF7").val("");
    $("#txtC7").val("");
    $("#txtA7Output").text("");
    $("#txtX7Output").text("");
    $("#TextB7Output").text("");
    $("#TextY7Output").text("");
    $("#txtCompY7").val("")
}
function ReSetTextValue201920() {
    $("#txtA8").val("");
    $("#txtX8").val("");
    $("#txtD8").val("");
    $("#txtE8").val("");
    $("#txtF8").val("");
    $("#txtC8").val("");
    $("#txtA8Output").text("");
    $("#txtX8Output").text("");
    $("#TextB8Output").text("");
    $("#TextY8Output").text("");
    $("#txtCompY8").val("")
}
function ReSetTextValue202021() {
    $("#txtA9").val("");
    $("#txtX9").val("");
    $("#txtD9").val("");
    $("#txtE9").val("");
    $("#txtF9").val("");
    $("#txtC9").val("");
    $("#txtA9Output").text("");
    $("#txtX9Output").text("");
    $("#TextB9Output").text("");
    $("#TextY9Output").text("");
    $("#txtCompY9").val("")
}
function ReSetTextValue202122() {
    $("#txtA10").val("");
    $("#txtX10").val("");
    $("#txtD10").val("");
    $("#txtE10").val("");
    $("#txtF10").val("");
    $("#txtC10").val("");
    $("#txtA10Output").text("");
    $("#txtX10Output").text("");
    $("#TextB10Output").text("");
    $("#TextY10Output").text("");
    $("#txtCompY10").val("")
}
function ReSetTextValue202223() {
    $("#txtA11").val("");
    $("#txtX11").val("");
    $("#txtD11").val("");
    $("#txtE11").val("");
    $("#txtF11").val("");
    $("#txtC11").val("");
    $("#txtA11Output").text("");
    $("#txtX11Output").text("");
    $("#TextB11Output").text("");
    $("#TextY11Output").text("");
    $("#txtCompY11").val("")
}
function ReSetTextValue202324() {
    $("#txtA12").val("");
    $("#txtX12").val("");
    $("#txtD12").val("");
    $("#txtE12").val("");
    $("#txtF12").val("");
    $("#txtC12").val("");
    $("#txtA12Output").text("");
    $("#txtX12Output").text("");
    $("#TextB12Output").text("");
    $("#TextY12Output").text("");
    $("#txtCompY12").val("")
}


function calculateFY() {
    var t, o = $("#txtDOT")[0].value, s = $("#txtDOT")[0].value.split("/")[0], r = $("#txtDOT")[0].value.split("/")[1], u = $("#txtDOT")[0].value.split("/")[2], f = $("#txtDOT")[0].value.split("/")[2], e = parseFloat(r), i = parseFloat(u), n = parseFloat(f);
    return e <= 3 ? (yearyear = i - 1,
        n = n.toString().substring(2),
        t = yearyear + "-" + n) : (yearyear = i,
            n = (n + 1).toString().substring(2),
            t = yearyear + "-" + n),
        t
}
function ConvertToDate(n) {
    var t, i;
    return n != null && (t = n.split("/")),
        i = "",
        t.length === 3 && (i = new Date(t[2], t[1] * 1 - 1, t[0])),
        i
}
function GetDatediff(n, t) {
    for (var v, o, s, i = [], c = 0, r = new Date(n), u = new Date(t), h = r.getFullYear(), l = u.getFullYear(), a = 12 * (l - h) + u.getMonth(), f = 0, e = r.getMonth(); e <= a; e++)
        v = monthNames[e % 12],
            o = Math.floor(h + e / 12),
            i.indexOf(o) == -1 && i.length > 0 ? i.push(o) : i.length == 0 && i.push(o);
    for (s = 0; s <= i.length; s++) {
        if (isLeapYear(l) && (u.getMonth() + 1 == 1 || u.getMonth() + 1 == 2) || isLeapYear(h) && r.getMonth() + 1 != 1 && r.getMonth() + 1 != 2)
            return f = 1,
                isLeapYr = !0,
                f;
        if (isLeapYear(i[s]))
            return c = 1,
                0
    }
    return c == 0 && (f = 1),
        f
}


$(document).ready(function () {
    $("input[type=text]").not("#txtStatus,#ddlPreviousYear").css({
        textAlign: "right"
    });
    $("#txtAnnexureI,#txtAnnexureII,#txtAnnexureIII,#txtAnnexureIIA,#txtAnnexureIV").change(function () {
        AnnexureTotal()
    })
});

$(document).ready(function () {
    function areRequiredFieldsfilled() {
        var n = $("#ddlAssessmentYearRelief").find(":selected").val()
            , t = $("#ddlResedentialStatus").find(":selected").val()
            , i = $("#txtDOB").val()
            , r = $("#ddlGender").find(":selected").val()
            , u = 'Select Assessment Year'
            , f = 'Select Resedential Status'
            , e = 'Select Date of Birth'
            , o = 'Select Gender';
        return n == "" ? (
            showAlert(),
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong>  " + u,

            !1) : t == "" ? (showAlert(),
                document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong>  " + f,
                !1) : i == "" ? (showAlert(),
                    document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong>  " + e,
                    !1) : r == "" ? (showAlert(),
                        document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong>  " + o,
                        !1) : !0
    }
    $("input").prop("maxLength", 14);

    $(document).on("focus", "#txtAnnexureI,#txtAnnexureII,#txtAnnexureIII,#txtAnnexureIIA,#txtAnnexureIV", function () {
        AnnexureTotal()
    });
    $("#ddlAssessmentYearRelief,#ddlResedentialStatus,#txtDOB,#ddlGender,#ddlbac115").change(function () {
        var n = $("#ddlAssessmentYearRelief").find(":selected").text(), t;
        $("#sec_115BAC_elem").css("display", "none");
        n == "2023-24" ? ($("#ddlPreviousYear").val("2022-23"),
            $("#sec_115BAC_elem").css("display", "block")) : n == "2022-23" ? ($("#ddlPreviousYear").val("2021-22"),
                $("#sec_115BAC_elem").css("display", "block")) : n == "2021-22" ? ($("#ddlPreviousYear").val("2020-21"),
                    $("#sec_115BAC_elem").css("display", "block")) : n == "2020-21" ? $("#ddlPreviousYear").val("2019-20") : n == "2019-20" ? $("#ddlPreviousYear").val("2018-19") : n == "2018-19" ? $("#ddlPreviousYear").val("2017-18") : n == "2017-18" && $("#ddlPreviousYear").val("2016-17");
        t = $("#ddlPreviousYear").val();
        SelectYear(t);
        Recalculate89()
    });

    $("#LinkAnnexure1").click(function () {
        if (areRequiredFieldsfilled())
            $(".dit-modal-popup").fadeOut(),
                $(".dit-modal-popup-overlay").fadeOut(),
                ditmodalpopup("Annexure1Dialog", "ditover");
        else
            return !1
    });
    $("#LinkAnnexure2").click(function () {
        if (areRequiredFieldsfilled())
            $(".dit-modal-popup").fadeOut(),
                $(".dit-modal-popup-overlay").fadeOut(),
                ditmodalpopup("Annexure2Dialog", "ditover");
        else
            return !1
    });
    $("#LinkAnnexure2A").click(function () {
        if (areRequiredFieldsfilled())
            $(".dit-modal-popup").fadeOut(),
                $(".dit-modal-popup-overlay").fadeOut(),
                ditmodalpopup("Annexure2ADialog", "ditover");
        else
            return !1
    });
    $("#LinkAnnexure3").click(function () {
        if (areRequiredFieldsfilled())
            $(".dit-modal-popup").fadeOut(),
                $(".dit-modal-popup-overlay").fadeOut(),
                ditmodalpopup("Annexure3Dialog", "ditover");
        else
            return !1
    });
    $("#LinkAnnexure4").click(function () {
        if (areRequiredFieldsfilled())
            $(".dit-modal-popup").fadeOut(),
                $(".dit-modal-popup-overlay").fadeOut(),
                ditmodalpopup("Annexure4Dialog", "ditover");
        else
            return !1
    })
});

$(document).on("click", ".dit-modal-popup-heading-close", function () {
    $(".dit-modal-popup").fadeOut();
    $(".dit-modal-popup-overlay").fadeOut()
});


$(document).on("click", "#Reset89US", function () {
    location.reload(!0)
});
$(document).on("click", "#ResetAnnexure1", function () {
    $("#Div15 .row").find("input[type=text]").val("");
    $("#divOutPutTableAnne1 .div-table .div-row").find("input[type=text]").val("");
    $("#txtAnnexure1Output").val("");
    $("#txtAnnexureI").val("")
});
$(document).on("click", "#ResetAnnexure2", function () {
    $("#Div12").find("input[type=text]:not(:disabled)").not("#txtPYar2").val("");
    // $("#Div12 .col-sm-3").find("input[type=text]").val("");
    $("#txtAnnexure2Output").val("");
    $("#txtAnnexureII").val("")
});
$(document).on("click", "#ResetAnnexure2A", function () {
    $("#Div8").find("input[type=text]:not(:disabled)").not("#txtPYar2A").val("");
    // $("#Div8 .col-sm-3").find("input[type=text]").val("");
    $("#Annexure2AOutput").val("");
    $("#txtAnnexureIIA").val("")
});
$(document).on("click", "#ResetAnnexure3", function () {
    $("#Div6").find("input[type=text]:not(:disabled)").not("#txtPYar3").val("");
    // $("#Div6 .col-sm-3").find("input[type=text]").val("");
    $("#txtAnnexure3Output").val("");
    $("#txtAnnexureIII").val("")
});
$(document).on("click", "#ResetAnnexure4", function () {
    $("#Div3").find("input[type=text]:not(:disabled)").not("#txtPYar4").val("");
    $("#txtAnnnexure4Output").val("");
    $("#txtAnnexureIV").val("")
});

$(document).on("change", "input[type=text]", function (n) {

    const regexx = /^-?\d+(?:\.\d+)?$/g

    if (isNaN(parseFloat(this.value))) return this.value = ''

    if (!regexx.test(this.value)) return this.value = ''

    ValidateAndFormatNumber(this, '')
});
$(document).on("paste", "input[type=text]", function (n) {
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

const popup1DisplayTableStyleSet = () => {
    $('#divOutPutTableAnne1').find('.row:nth-child(1)').addClass('header-grid-3').removeClass('row');
    $('#divOutPutTableAnne1').find('.row:not(:nth-child(1))').each(function () {
        this.style.removeProperty('display');
    })
    $('#divOutPutTableAnne1').find('.row:not(:nth-child(1))').addClass('row-grid-5').removeClass('row');
    $('.header-grid-3').find('.col-sm-4:nth-child(1)').addClass('grid-cell grid-header-cell').removeClass('col-sm-4 text-left');
    $('.header-grid-3').find('.col-sm-4:not(:nth-child(1))').addClass('grid-cell grid-header-cell justify-content-center').removeClass('col-sm-4 text-center');
    $($('.row-grid-5')[0]).find('div').removeClass().addClass('grid-cell result-cell')
    $('.row-grid-5:not(:nth-child(1))').find('.col-sm-4').addClass('grid-cell text-left').removeClass('col-sm-4 text-left');
    $('.row-grid-5:not(:nth-child(1))').find('.col-sm-2').addClass('grid-cell result-cell').removeClass('col-sm-2').css("display", "grid !important");

}

$(document).ready(function () {
    popup1DisplayTableStyleSet()
})




