var trid = 0;

$(document).ready(function () {
    bindDataToDdl("HardwareDropdown", "TermCondition_ddl", "myModalAddTermCondition", "ddlTermCondition", " Select Terms And Condition ", 0, 0);
    resetModal();
    PITermConditionList();
    $('#myTablePITermCondition').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });

});

//Get Record for A table 
async function PITermConditionList() {

    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('PI', 'GetPITermConditionRecord', filterata, '#myTablePITermCondition', 'N');
        bindDatatablePITermConditionList(records, '#myTablePITermCondition');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table 
function bindDatatablePITermConditionList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`
            <tr 
                 data-trid="${value.TrId}" 
                         >
                        <td>${SrNo}</td>
                         <td>${value.TermsAndConditionName}</td>
                        <td>${value.TermsAndConditionDetails}</td>
                        <td><i class="bi bi-pencil-square edit-test edit-icon"></i></td>
               
            </tr>
        `);
    });

    $(tableId).DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        responsive: true
    });

    //hideModalLoader();
}

// Open modal Add Term & Condition
$(document).on('click', '.btnAddCategoryTerm', function () {

    var row = $(this).closest('tr');
    trid = row.data('trid');


    PITermConditionList(0);

    var myModal = new bootstrap.Modal(document.getElementById('myModalAddTermCondition'));
    myModal.show();
});
// Function to create no. before each paragraph in text area

$(function () {

    $("#txtTermConditionRemark").val("1. ");

    $("#txtTermConditionRemark").keydown(function (e) {

        if (e.key === "Enter") {

            e.preventDefault();

            var text = $(this).val();

            var lines = text.split("\n");

            var next = lines.length + 1;

            $(this).val(text + "\n" + next + ". ");
        }

    });

});
// Submit record when Click on btn
$(".btnModalSubmit").on("click", function () {

    SubmitRecordTermandCondition();
});
// get Create function when click on Submit 
async function SubmitRecordTermandCondition() {
    console.log(trid);
    let isValid = true;


    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");


    let TermsConditionName = $("#ddlTermCondition").val();
    var IsActive = $('#IsActive').is(':checked') ? 'Y' : 'N';

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (TermsConditionName === "") {
        $("#ddlTermCondition").addClass("is-invalid");
        $("#ddlTermCondition").siblings(".error").text("Please Select the ddl from Terms And Condition.");
        isValid = false;
    }
    if (!isValid) return; // stop if validation fails

    // Prepare data
    console.log(trid);
    var TermCondition = {
        TrId: trid,
        TrCatgId: $('#ddlTermCondition').val(),
        ConditionName: $('#txtTermConditionRemark').val(),

    };
    var formData = new FormData();
    formData.append("TermCondition", JSON.stringify(TermCondition));


    try {

        let res = await acceptUpdateMultiTableFData1(
            'PI',
            'SubmitTermsConditionRecord',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            trid = 0;
            PITermConditionList(trid);
            resetModal();
            $('.modelalert').text(res.message);
            closeModal('myModalAddTermCondition');

        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }


}
//Edit Record From Table Term and Condition
$(document).on('click', '.edit-test', async function () {

    var row = $(this).closest('tr');
    trid = row.data('trid');
    console.log(trid);

    var isConfirmed = await DeleteEditBox('Term and Condition', 'Do you want to edit Record?', 'question', trid);

    if (isConfirmed) {
        console.log('Edit');
        // User clicked Yes
        await loadRecordById(row);
        openModal('myModalAddTermCondition');
        // $('#myModal').modal('show');
    } else {
        // User clicked Cancel
        console.log('Edit cancelled');
    }
});
// get Record to fill
async function loadRecordById(row) {

    var filterata = {
        FilterId1: row.data('trid'),
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('Pi', 'GetRecordTermandCondition', filterata, '#myTablePITermCondition', 'N');

        if (records && records.length > 0) {

            let data = records[0];
            // Id = data.Id;
            $("#ddlTermCondition").val(data.TrCatgId);
            $("#txtTermConditionRemark").val(data.TermsAndConditionDetails);


            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}