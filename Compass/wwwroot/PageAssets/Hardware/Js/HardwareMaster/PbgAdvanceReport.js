var Id = 0;

$(document).ready(function () {
    bindDataToDdl("HardwareDropdown", "HAgency_ddl", "myModalPbgAdvance", "ddlPbgAgency", "Agency Name", 0, 0);
    // bindDataToDdl("HardwareDropdown", "HBillFor_ddl", "myModalPbgAdvance", "ddlPbgBillFor", "Bill For", 0, 0);
    bindDataToDdl("HardwareDropdown", "HPbgPurchaseOrder_ddl", "myModalPbgAdvance", "ddlPbgPOrderNo", "Purchase Order No.", 0, 0);
    resetModal();
    PbgAdvanceList();
    $('#myTablePbgAdvance').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });

});

//Get Record for A table 
async function PbgAdvanceList() {

    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('Pbg', 'GetPbgAdvanceList', filterata, '#myTablePbgAdvance', 'N');
        bindDatatablePbgAdvanceList(records, '#myTablePbgAdvance');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table 
function bindDatatablePbgAdvanceList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`
            <tr 
                 data-id="${value.Id}"   
                         >
                        <td>${SrNo}</td>
                         <td>${value.Pinvid}</td>
                         <td>${value.BillFor}</td> 
                        <td>${value.BGNumber}</td>
                        <td>${value.IssuanceDate}</td>
                        <td>${value.ExpiryDate}</td>
                        <td>${value.ClaimDate}</td>
                        <td>${value.PBGAmt}</td>
                        <td>${value.RestBalance}</td>
                        <td>${value.Remarks}</td>
                        <td>${value.AgencyName}</td>
                        <td><i class="bi bi-file-earmark-pdf-fill text-danger fs-3" title="Print PDF"></i></td>
                         <td><i class="bi bi-pencil-square Text-edit edit-icon"></i></td>

    
                       
               
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

// Open modal Add Term Type Condition
$(document).on('click', '.btnAdd', function () {


    Id = 0;
    var myModal = new bootstrap.Modal(document.getElementById('myModalPbgAdvance'));
    $('#myModalPbgAdvance').one('shown.bs.modal', function () {

        $('#ddlPbgPOrderNo').next('.select2').hide();
        $('#lblPbgPOrderNo').hide();

    });
    myModal.show();

});
// Submit record when Click on btn
$(document).on("click", ".btnModelPbgAdvance", function () {


    SubmitPbgAdvance();
});
// get Create function when click on Submit

async function SubmitPbgAdvance() {

    let isValid = true;

    // let PbgAdvance = $("#PbgAttachment").get(0);

    //  let files1 = PbgAdvance.files;

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    let BillFor = $("#ddlPbgBillFor").val();
    let AgencyId = $("#ddlPbgAgency").val();
    let Pinvid = $("#ddlPbgPOrderNo").val();
    let BillNO = 0;
    let BGNumber = $("#txtPbgBGNo").val();
    let IssuanceDate = $("#PbgIssueDate").val();
    let ExpiryDate = $("#PbgExpiryDate").val();
    let ClaimDate = $("#PbgClaimDate").val();
    let PBGAmt = $("#txtPbgAmt").val();
    let RestBalance = $("#txtPbgRestAmt").val();
    let Remarks = 0;
    let ipAddress = 0;


    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (AgencyId === "") {
        $("#ddlPbgAgency").addClass("is-invalid");
        $("#ddlPbgAgency").siblings(".error").text("Select Please Agency Name.");
        isValid = false;
    }
    if (Pinvid === "") {
        $("#ddlPbgPOrderNo").addClass("is-invalid");
        $("#ddlPbgPOrderNo").siblings(".error").text("Please Select Purchase Order No.");
        isValid = false;
    }
    if (BillFor === "") {
        $("#ddlPbgBillFor").addClass("is-invalid");
        $("#ddlPbgBillFor").siblings(".error").text("Please Select Bill For");
        isValid = false;
    }
    if (BGNumber === "") {
        $("#txtPbgBGNo").addClass("is-invalid");
        $("#txtPbgBGNo").siblings(".error").text("Enter Please BG No.");
        isValid = false;
    }
    if (PBGAmt === "") {
        $("#txtPbgAmt").addClass("is-invalid");
        $("#txtPbgAmt").siblings(".error").text("Enter Please Pbg Amt");
        isValid = false;
    } if (RestBalance === "") {
        $("#txtPbgRestAmt").addClass("is-invalid");
        $("#txtPbgRestAmt").siblings(".error").text("Enter Please Rest Amt");
        isValid = false;
    }

    var PbgAdvance = {
        Id: Id,
        BillFor: BillFor,
        AgencyId: AgencyId,
        BillNO: BillNO,
        BGNumber: BGNumber,
        Pinvid: Pinvid,
        IssuanceDate: IssuanceDate,
        ExpiryDate: ExpiryDate,
        ClaimDate: ClaimDate,
        PBGAmt: PBGAmt,
        RestBalance: RestBalance,
        Remarks: Remarks,
        IpAddress: ipAddress,

    };

    //Prepare data
    var fileSize = 10

    var isValid1 = fileSizeValidation('PbgAdvance', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        return;
    }
    let allowedExtensions = ["jpg", "jpeg", "pdf", "xlsx"];

    var newFileName = getNewFileName('PbgAdvance')

    var formData = new FormData();

    formData.append("PbgAdvance", JSON.stringify(PbgAdvance));

    if ($("#PbgAttachment")[0].files.length > 0) {
        formData.append("Pbg", $("#PbgAttachment")[0].files[0], newFileName);
    }

    try {

        let res = await acceptUpdateMultiTableFData1(
            'Pbg',
            'PbgAdvanceSubmit',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            Id = 0;
            resetModal();
            PbgAdvanceList();
            closeModal('myModalPbgAdvance');
            $("#myTablePISaleOrder tbody").empty();

        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}
//Edit Record From Table Pbg Advance
$(document).on('click', '.Text-edit', async function () {

    var row = $(this).closest('tr');
    Id = row.data('id');
    console.log(Id);

    var isConfirmed = await DeleteEditBox('Pbg Advance', 'Do you want to edit Record?', 'question', Id);

    if (isConfirmed) {
        console.log('Edit');
        // User clicked Yes
        await loadRecordById(row);
        openModal('myModalPbgAdvance');

        // $('#myModal').modal('show');
    } else {
        // User clicked Cancel
        console.log('Edit cancelled');
    }
});
// get Record to fill
async function loadRecordById(row) {

    var filterata = {
        FilterId1: row.data('id'),
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('Pbg', 'GetPbgAdvanceList', filterata, '#myTablePbgAdvance', 'N');

        if (records && records.length > 0) {

            let data = records[0];

            // Id = data.Id;

            //bindDataToDdl("HardwareDropdown", "HAgency_ddl", "myModalPbgAdvance", "ddlPbgAgency", "Agency Name", data.AgencyId, 0,);
            //$("#ddlPbgAgency").val(data.AgencyId);
            //$("#ddlPbgAgency").html(data.AgencyName);
            var option1 = new Option(data.AgencyName, data.AgencyId, true, true);
            $("#ddlPbgAgency").append(option1).trigger('change');


            $("#ddlPbgBillFor").val(data.BillForId);
            $("#ddlPbgPOrderNo").val(data.Pinvid);
            //bindDataToDdl("HardwareDropdown", "HPbgPurchaseOrder_ddl", "myModalPbgAdvance", "ddlPbgPOrderNo", "Purchase Order No.", data.Pinvid, 0);
            var option1 = new Option(data.Pinvid, data.Pinvid, true, true);
            $("#ddlPbgPOrderNo").append(option1).trigger('change');

            $("#txtPbgBGNo").val(data.BGNumber);
            $("#txtPbgAmt").val(data.PBGAmt);
            $("#txtPbgRestAmt").val(data.RestBalance);
            $("#PbgClaimDate").val(data.ClaimDate);
            $("#PbgIssueDate").val(data.IssuanceDate);
            $("#PbgExpiryDate").val(data.ExpiryDate);


            if (data.BillForId == 'S') {
                $('#ddlPbgPOrderNo').next('.select2').show();
                $('#lblPbgPOrderNo').show();


            }
            else {
                $('#ddlPbgPOrderNo').next('.select2').hide();
                $('#lblPbgPOrderNo').hide();
            }


            console.log(data.ClaimDate);




            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}
// Change event of Bill For ddl
$(document).on('change', '#ddlPbgBillFor', async function () {
    console.log($(this).val());
    if ($(this).val() == 'S') {

        $('#ddlPbgPOrderNo').next('.select2-container').show();
        $('#lblPbgPOrderNo').show();
    }
    else {
        $('#ddlPbgPOrderNo').next('.select2-container').hide();
        $('#lblPbgPOrderNo').hide();

    }

});

