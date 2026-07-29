var ChallanId = 0;
var challanFilePath = "";

$(document).ready(function () {
    
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

    // var monthYearVal = setPreviousMonth('#monthYear');
    
    // var finalMonthId = "0";
    // if (monthYearVal && monthYearVal.includes('/')) {
    //     var parts = monthYearVal.split('/');
    //     var m = parseInt(parts[0], 10);
    //     var y = parts[1];
    //     finalMonthId = m.toString() + y.toString(); // Result: "42026"
    // }
    
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
           <!--Challan File-->
            <td class="text-center">
                 <a href="javascript:void(0)" class="view-file" data-file="${value.AttacheChallan}" data-folder="AttacheChallan" title="View Attendance File">
                 <i class="bi bi-file-earmark-arrow-down-fill text-danger" style="font-size:25px;"></i>  </a>
            </td>
           <!--Challan Details File-->
            <td class="text-center">
                 <a href="javascript:void(0)" class="view-file" data-file="${value.AttacheChallanDetails}" data-folder="ChallanDetails" title="View Attendance File">
                 <i class="bi bi-file-earmark-arrow-down-fill text-danger" style="font-size:25px;"></i>  </a>
            </td>
            
            <td class="text-center">
    <button type="button"
            class="btn btn-sm btn-outline-primary view-file"
            data-file="${value.AttacheChallan}"
            data-folder="ESIEPF/ChallanFile"
            title="View Uploaded Challan">
        <i class="bi bi-file-earmark-pdf-fill me-1"></i>
        <i class="bi bi-download me-1"></i>
        View
    </button>
</td>
            <td> <i class="bi bi-download"></i> </td>
            <td> <i class="bi bi-download"></i> </td>
            <td> <i class="bi bi-download"></i> </td>
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

//View Uploaded file
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

// Submit record when Click on btn
$(".btnModalSubmit").on("click", function () {
    SubmitRecord();
});

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

