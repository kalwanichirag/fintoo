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

$(document).on('change', '#asset_type', function () {
    // var n = this.value;
    // n == 2 ? ($("#listed_securities_element").show(),
    //     $("#listed_shares_element").hide(), $('#listed_securities_input').attr('required'), $('#listed_shares_input').removeAttr('required'), $('input[name="listed_shares"]').prop('checked', false)) : n == 3 ? ($("#listed_shares_element").show(),
    //         $("#listed_securities_element").hide(), $('#listed_shares_input').attr('required'), $('#listed_securities_input').removeAttr('required'), $('input[name="listed_securities"]').prop('checked', false)) : ($("#listed_securities_element").hide(),
    //             $("#listed_shares_element").hide(), $('#listed_securities_input').removeAttr('required'), $('#listed_shares_input').removeAttr('required'), $('input[name="listed_shares"]').prop('checked', false), $('input[name="listed_securities"]').prop('checked', false))

    var n = this.value;
    n == 2 ? ($("#listed_securities_element").show(),
        $("#listed_shares_element").hide()) : n == 3 ? ($("#listed_shares_element").show(),
            $("#listed_securities_element").hide()) : ($("#listed_securities_element").hide(),
                $("#listed_shares_element").hide())
})

$(document).on('change', '#transfer_date', function () {
    if (this.value !== "") {
        const transferDate = $('#transfer_date').val();
        const purchaseDate = $('#purchase_date').val();
        if (purchaseDate === "") return
        if (new Date(transferDate) > new Date(purchaseDate)) {
            hideAlert()
        } else {
            showAlert();
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> Date of transfer must be greater than date of purchase"
        }
    }
})

$(document).on('change', '#purchase_date', function () {
    if (this.value !== "") {
        const transferDate = $('#transfer_date').val();
        const purchaseDate = $('#purchase_date').val();
        if (transferDate === "") return
        if (new Date(transferDate) > new Date(purchaseDate)) {
            hideAlert()
        } else {
            showAlert();
            document.getElementById("income_and_tax_calculator_alert_text").innerHTML = "<strong>Error ! !</strong> Date of transfer must be greater than date of purchase"
        }
    }
})