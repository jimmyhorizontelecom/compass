var ChallanId = 0;
var AttacheChallan = "";
var AttacheChallanDetails = "";

$(document).ready(function () {
    $(".btnModalSubmit").prop("disabled", !$("#chkConsent").is(":checked"));

    $("#chkConsent").on("change", function () {
        $(".btnModalSubmit").prop("disabled", !$(this).is(":checked"));
    });
    resetModal();
    recordlist();
    initCustomPicker('#monthYear');
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", "Select Agency Name");
    bindDataToDdl("Dropdown", "MChallanType_ddl", "", "ddlChallanType", "Select Challan Type");

    // Initialize Month Picker

    alert('Deposit Challan ESI EPF Loading');
});

//Get Record for A table 
async function recordlist() {
    var agencyId = $("#ddlAgencyName").val() || 0;
    var challanType = $("#ddlChallanType").val() || 0;
    //let d = new Date();
    //d.setMonth(d.getMonth() - 1);
    let d = new Date();

    // 13 months back
    d.setMonth(d.getMonth() - 13);

    let monthYear = parseInt((d.getMonth() + 1).toString() + d.getFullYear());

    var filterData = {
        ChallanId: 0,
        AgencyId: agencyId,
        ChallanType: challanType,
        //MonthYear: parseInt((d.getMonth() + 1).toString() + d.getFullYear())
        MonthYear: 0
    };
    //alert(filterData);
    try {

        let records = await getRecords('Manpower', 'GetChallanListRecord', filterData, '#myTable', 'N');
        bindDatatable(records, '#myTable');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table 
function bindDatatable(records, tableId) {
    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();
    $.each(records, function (i, value) {

        let SrNo = i + 1;

        tbody.append(`
            <tr data-challanid="${value.ChallanId}"  data-attachchallan="${value.AttacheChallan}">
             <td>${SrNo}</td>
            <td>${value.ChallanDate ?? ""}</td>
            <td>${value.AgencyName ?? ""}</td>
             <td> ${value.ChallanType ?? ""} </td>
            <td>${value.ChallanNumber ?? ""}</td>
            <td>${value.ChallanDate ?? ""}</td>
            <td>${value.NoOfHPSEDCResource ?? 0}</td>
            <td>${value.ChallanAmount ?? 0}</td>
           <!--Attach Challan File-->
            <td class="text-center align-middle">
                 <a href="javascript:void(0)" class="view-file" data-file="${value.AttacheChallan}" data-folder="AttacheChallan" title="View Attendance File">
                 <i class="bi bi-file-earmark-arrow-down-fill text-danger" style="font-size:25px;"></i>  </a>
            </td>
           <!--Attach Challan Details File-->
            <td class="text-center align-middle">
                 <a href="javascript:void(0)" class="view-file" data-file="${value.AttacheChallanDetails}" data-folder="ChallanDetails" title="View Attendance File">
                 <i class="bi bi-file-earmark-arrow-down-fill text-danger" style="font-size:25px;"></i>  </a>
            </td>
             <!--Edit ESIEPF Challan Details-->
             <td class="text-center align-middle">
                    <i class="bi bi-pencil-square edit-ChallanDetails edit-icon" data-ChallanId="${value.ChallanId}" style="cursor:pointer;font-size:25px;"></i>
                </td>
             <!-- Challan Status -->
                 <td class="text-center align-middle">
                   ${value.Status === "Y"
                ? '<i class="bi bi-check-circle-fill text-success" title="Verified" style="font-size:25px;"></i>'
                : '<i class="bi bi-x-circle-fill text-danger" title="Not Verified" style="font-size:25px;"></i>'}
               </td>
           <td> ${value.VerificationRemarks}</td>

            <!--Reject Challan-->
            <td class="text-center align-middle">
                 ${(!value.AnnexureFile && !value.AgencyBillFile)
                ? `<i class="bi bi-trash-fill text-danger delete-Records" data-attendaceid="${value.AttendaceId}" style="cursor:pointer;font-size:25px;"></i>`
                : `<i class="bi bi-trash-fill text-muted" title="Cannot delete after upload" style="font-size:25px;opacity:0.4;cursor:not-allowed;"></i>`}
                </td>
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
}
// Submit record when Click on btn
$(".btnModalSubmit").on("click", function () {
    SubmitRecord();
});
//Submit Records
async function SubmitRecord() {
    alert('Testing');
    let isValid = true;
    // Form Values
    let monthYear = $("#monthYear").val();
    let agencyId = $("#ddlAgencyName").val();
    let challanType = $("#ddlChallanType").val();
    let challanNo = $("#txtChallanNumber").val();
    let challanDate = $("#dateChallanDate").val();
    let noOfResources = $("#txtNoOfHPSEDECResources").val().trim();
    let challanAmt = $("#numChallanAmt").val();
    let isDeclaration = $("#chkConsent").is(":checked") ? "Y" : "N";
    // FILE CONTROLS
    let ChallanPaymentReceipt = $("#inputGroupFile01").get(0);
    let files_ChallanPaymentReceipt = ChallanPaymentReceipt ? ChallanPaymentReceipt.files : [];

    let EmpDetails = $("#inputGroupFile02").get(0);
    let files_EmpDetails = EmpDetails ? EmpDetails.files : [];

    // RESET VALIDATION
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    // BASIC VALIDATION
    if (!monthYear) {
        $("#monthYear").addClass("is-invalid");
        $("#monthYear").siblings(".error").text("Month & Year required");
        isValid = false;
    }
    if (agencyId === "0" || agencyId === null) {
        $("#ddlAgencyName").addClass("is-invalid");
        $("#ddlAgencyName").siblings(".error").text("Agency Name required");
        isValid = false;
    }
    if (challanType === "0" || challanType === null) {
        $("#ddlChallanType").addClass("is-invalid");
        $("#ddlChallanType").siblings(".error").text("Challan Type required");
        isValid = false;
    }

    if (challanNo === "") {
        $("#txtChallanNumber").addClass("is-invalid");
        $("#txtChallanNumber").siblings(".error").text("Please select Challan Date");
        isValid = false;
    }
    if (challanDate === "") {
        $("#dateChallanDate").addClass("is-invalid");
        $("#dateChallanDate").siblings(".error").text("Please select Challan Date");
        isValid = false;
    }
    if (noOfResources === "") {
        $("#txtNoOfHPSEDECResources").addClass("is-invalid");
        $("#txtNoOfHPSEDECResources").siblings(".error").text("Number of Resource required");
        isValid = false;
    }
    if (challanAmt === "") {
        $("#numChallanAmt").addClass("is-invalid");
        $("#numChallanAmt").siblings(".error").text("Challan Amount required");
        isValid = false;
    }
    if (!$("#chkConsent").is(":checked")) {
        //alert("Please select Full Time Employee.");
        $("#chkConsent").siblings(".error").text("Please Select CheckBox");
        isValid = false;
    }
    // FILE VALIDATION
    let fileSize = 5;
    let allowedExtensions = ["pdf"];
    // Challan Payment Receipt File
    if (files_ChallanPaymentReceipt.length === 0) {
        $("#inputGroupFile01").addClass("is-invalid");
        $("#inputGroupFile01")
            .closest(".col-md-3")
            .find(".error")
            .text("Challan Payment file required");
        isValid = false;
    }
    else {
        if (!fileSizeValidation('inputGroupFile01', fileSize)) {
            isValid = false;
        }
        if (!fileExtensionValidation('inputGroupFile01', allowedExtensions)) {
            isValid = false;
        }
    }

    // Employee Details File
    if (files_EmpDetails.length === 0) {
        $("#inputGroupFile02").addClass("is-invalid");
        $("#inputGroupFile02")
            .closest(".col-md-3")
            .find(".error")
            .text("Emp Details file required");
        isValid = false;
    }
    else {
        if (!fileSizeValidation('inputGroupFile02', fileSize)) {
            isValid = false;
        }
        if (!fileExtensionValidation('inputGroupFile02', allowedExtensions)) {
            isValid = false;
        }
    }

    // STOP IF VALIDATION FAILED
    if (!isValid) {
        return;
    }
    // FORM DATA
    var formData = new FormData();
    var finalMonthId = "0";
    if (monthYear && monthYear.includes('/')) {
        var parts = monthYear.split('/');
        var m = parseInt(parts[0], 10);
        var y = parts[1];
        finalMonthId = m.toString() + y.toString();
    }
    formData.append("ChallanId", ChallanId);
    formData.append("ChallanFor", challanType);
    formData.append("ChallanNumber", challanNo);
    formData.append("BankName", 0);
    formData.append("AgencyId", agencyId);
    formData.append("BillForMonth", finalMonthId);
    formData.append("ChallanDate", challanDate);
    formData.append("ChallanAmount", challanAmt);
    formData.append("NoOfResource", noOfResources);
    formData.append("IsDeclaration", isDeclaration);
    // AttacheChallan FILE
    if (files_ChallanPaymentReceipt.length > 0) {
        formData.append("AttacheChallan", files_ChallanPaymentReceipt[0]);
    }
    // AttacheChallanDetails FILES
    if (files_EmpDetails.length > 0) {
        formData.append("AttacheChallanDetails", files_EmpDetails[0]);
    }

    // SUBMIT
    try {
        let res = await acceptUpdate("Manpower", "AddOrEdit_ESIEPFChallanDepositeRecord", formData);
        if (res.success) {
            resetModal();
            recordlist();
            // setPreviousMonth('#monthYear1');

            ChallanId = 0;
            $('.modelalert').text(res.message);
            // closeModal('myModal');
            MsgBox('Message', res.message, '');
        }
        else {
            MsgBox('Error', res.message, '');
        }
    }
    catch (err) {
        console.log(err);
        $('.modelalert').text("Error : " + err);
    }
}
//View Uploaded file in a NewTab
$(document).on('click', '.view-file', function (e) {
    e.preventDefault(); // Prevent default <a> behavior
    var fileName = $(this).data('file');
    var folder = $(this).data('folder');
    if (!fileName || fileName === 'undefined' || fileName === '') {
        toastr.error('File not uploaded');
        return;
    }
    // Construct URL
    var url = `/Attachment/ESIEPF/${folder}/${fileName}`;
    // Open in new tab
    window.open(url, '_blank');
});

// MsgBox on Edit Verify Challan
$(document).on('click', '.edit-ChallanDetails', async function () {

    let row = $(this).closest("tr");
    ChallanId = row.data("challanid");
    console.log("Selected ChallanId:", ChallanId);
    let filterData = {
        ChallanId: row.data("challanid"),
        AgencyId: row.data("agencyid"),
        ChallanType: row.data("challantype"),
        MonthYear: row.data("monthyear")
    };

    console.log("Selected Challan:", filterData);


    if (!filterData.ChallanId) {
        toastr.error("Record Id not found.");
        return;
    }
    let isConfirmed = await DeleteEditBox('Edit Challan', 'Do you want to edit this challan?', 'question');
    if (!isConfirmed) {
        return;
    }
    resetModal();
    recordlist();
    await loadEditESIEPFRecord(filterData);

});

//get Record to Add EPF ESI Model
async function loadEditESIEPFRecord(filterData) {
    try {
        let records = await getRecords('Manpower', 'GetChallanListRecord', filterData, 'myModal', 'N');
        console.log("Response:", records);
        if (!records || records.length === 0) {
            toastr.error("Record not found");
            return;
        }
        let data = records[0];
        $("#monthYear").val(data.BillForMonth || "");
        $("#txtChallanNumber").val(data.ChallanNumber || "");
        if (data.ChallanDate) {

            let d = new Date(data.ChallanDate);

            let year = d.getFullYear();
            let month = String(d.getMonth() + 1).padStart(2, '0');
            let day = String(d.getDate()).padStart(2, '0');

            $("#dateChallanDate").val(`${year}-${month}-${day}`);

        }
        else {
            $("#dateChallanDate").val("");
        }
        //$("#dateChallanDate").val(data.ChallanDate || "");
        $("#txtNoOfHPSEDECResources").val(data.NoOfHPSEDCResource || "");
        $("#numChallanAmt").val(data.ChallanAmount || 0);

        bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", " Agency Name", data.AgencyId, 0);
        var option = new Option(data.AgencyName, data.AgencyId, true, true);
        $('#ddlAgencyName').append(option).trigger('change');
        // bindDataToDdl("Dropdown", "MChallanType_ddl", "", "ddlChallanType", "Select Challan Type");
        bindDataToDdl("Dropdown", "MChallanType_ddl", "", "ddlChallanType", " Challan Type", data.ChallanId, 0);
        var option = new Option(data.ChallanType, data.ChallanId, true, true);
        $('#ddlChallanType').append(option).trigger('change');

        AttacheChallan = data.AttacheChallan || "";
        AttacheChallanDetails = data.AttacheChallanDetails || "";

        // Challan File
        if (AttacheChallan) {
            $("#uploadedChallanFile").html(`<button type="button"  class="btn  btn-coral txt-white btn-sm btnViewChallan">
            <i class="bi bi-file-earmark-pdf-fill"></i>  View Uploaded Challan </button>`);
        } else {
            $("#uploadedChallanFile").html(`<span class="text-danger">No Challan File Uploaded</span> `);
        }
        // Employee Details File
        if (AttacheChallanDetails) {
            $("#uploadedEmployeeFile").html(`<button type="button" class="btn  btn-coral txt-white btn-sm btnViewEmployee">
            <i class="bi bi-file-earmark-excel-fill"></i>  View Employee Details </button> `);
        } else {
            $("#uploadedEmployeeFile").html(`<span class="text-danger">No Employee File Uploaded</span>`);
        }
    }
    catch (error) {
        console.error("Load Challan Error:", error);
    }
}
//View Challan file with Button when Edit Challan
$(document).on("click", ".btnViewChallan", function () {
    if (!AttacheChallan) {
        toastr.error("File not found");
        return;
    }
    window.open("/Attachment/ESIEPF/AttacheChallan/" + AttacheChallan, "_blank");
});
//View Challan details file with Button when Edit Challan
$(document).on("click", ".btnViewEmployee", function () {
    if (!AttacheChallanDetails) {
        toastr.error("File not found");
        return;
    }
    window.open("/Attachment/ESIEPF/ChallanDetails/" + AttacheChallanDetails, "_blank");
});
