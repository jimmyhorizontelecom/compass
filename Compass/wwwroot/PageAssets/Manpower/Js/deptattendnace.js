var Id = 0;
var billingData = [];
//common
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-center-center",
    timeOut: "3000"
};

//ready
$(document).ready(function () {
    resetModal();
    recordlist();

    //initializeMonthYearPickerByClass("monthYearPicker");
    initCustomPicker('#monthYear');
    initCustomPicker('#monthYear1');
    //Parent Dropdown
    bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptName", "Select Department Name");
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", "Select Agency Name"); 
   
    // Dependent Dropdown Billing Address on Department
    bindDependentDataToDdl("Dropdown","MBillingAddress_ddl",null,// ❗ no modal
        "ddlDeptName", "ddlBillingAddress", "Select Billing Address");

 // Dependent Dropdown Work Order on Agency
    bindDependentDataToDdlToParent("Dropdown", "MWorkOrder_ddl", null,// ❗ no modal
        "ddlDeptName", "ddlAgencyName", null , "ddlWorkOrder","Select Work Order ");
     


// month year change event on table list
    //$(document).on('changeDate change', '.monthYearPicker', function () {

    //    // Agar specific element ka value lena ho
    //    let selectedValue = $(this).val();

    //    console.log("Selected MonthYear:", selectedValue);

    //    // Call your record function
    //    recordlist(selectedValue);
    //});

    // ❗ Month change hone par table refresh karne ke liye
    $(document).on('change', '#monthYear1', function () {
        console.log("Month changed, reloading records...");
        recordlist(); // Isse aapka niche wala function call hoga
    });
   
});
//var monthYear = $('.monthYearPicker').val();
//alert(monthYear);

//Get Record for A table 
async function recordlist() {
    var monthYearVal = $("#monthYear1").val();
    var finalMonthId = "0";

    if (monthYearVal && monthYearVal.includes('/')) {
        var parts = monthYearVal.split('/');
        var m = parseInt(parts[0], 10);
        var y = parts[1];
        finalMonthId = m.toString() + y.toString(); // Result: "42026"
    }
    //let monthYear = $(".monthYearPicker").val();
    var filterData = {
        Id:0,
        AgencyId: 0,
        DeptId: 0,
        MonthYear: finalMonthId,
        //CreatedBy: 0,
        //UserRole: 39,

    };

    try {

        let records = await getRecords('Manpower', 'GetDeptAttendanceRecord', filterData, '#myTable', 'N');
        bindDatatable(records, '#myTable');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}

//Get No. of Resources on change Billing Address ddl
$(document).on("change", "#ddlBillingAddress", async function () {

    let billingId = $("#ddlBillingAddress").val();
    let deptId = $("#ddlDeptName").val();
    let agencyId = $("#ddlAgencyName").val();
    let workOrderId = $("#ddlWorkOrder").val();

    if (!billingId || billingId == "0") {
        $("#txtNoOfResources").val("");
        return;
    }

    let filterData = {
        AgencyId: parseInt(agencyId),
        DeptId: parseInt(deptId),
        WorkOrderAgencyId: parseInt(workOrderId),
        CreatedBy: 0,
        UserRole: 48
    };

    console.log("Sending Filter:", filterData);

    try {

        let res = await getRecords( "Manpower", "GetNoOfResourcesByBilling", filterData, "", "N");

        console.log("API Response:", res);

          if (res && res.length > 0) {

            let data = res[0];   // ⭐ MOST IMPORTANT FIX

            console.log("Selected Row:", data);

            // OPTIONAL billing match (safe)
            if (data.BillingId == billingId) {
                $("#txtNoOfResources").val(data.NoOfResources);
            } else {
                $("#txtNoOfResources").val(data.NoOfResources); // fallback
            }

        } else {
            $("#txtNoOfResources").val("");
        }

    } catch (err) {
        console.error("Error:", err);
    }

});

//Bind get record  in a table 
function bindDatatable(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;
        console.log(value); 
        tbody.append(`
            <tr 
                data-id="${value.Id}">
                <td>${SrNo}</td>
                <td>${value.departmentName}</td>
                <td>${value.AgencyName}</td>
                <td>${value.WorkOrderId} <br> ${value.PurhaseInvNO}</td>
                <td>${value.DeployedResource}</td>
                <td>${value.UpladNoOfResource}</td>
                <td>${value.MonthYear}</td>
                
                <!-- Attendance File -->
                <td class="text-center">
                <span data-id="${value.Id}" >
                    <a href="javascript:void(0);" class="view-file" data-file="${value.AttendanceCertificate}" data-folder="Attendance" title="View Attendance">
                         <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size:25px;"></i>
                    </a>
                    </span>
                </td>
                 <!-- Annexure File -->
                <td class="text-center">
                <span data-id="${value.Id}" >
                    <a href="javascript:void(0);" class="view-file" data-file="${value.AnnexureFile}" data-folder="Annexure" title="View Annexure">
                        <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size:25px;"></i>
                    </a>
                </td>
                 <!-- Agency Bill File -->
                <td class="text-center">
                <span data-id="${value.Id}" >
                    <a href="javascript:void(0);" class="view-file" data-file="${value.AgencyBillFile}" data-folder="AgencyBill" title="View Agency Bill">
                        <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size:25px;"></i>
                    </a>
                </td>
                 <td class="text-center">
                    <i class="bi bi-pencil-square upload-Bill edit-icon"
                        data-id="${value.Id}"
                    style="cursor:pointer;font-size:25px;"></i>
                </td>
                 
                 <td class="text-center" >
                    <i class="bi bi-trash text-danger delete-Records"
                    data-id="${value.Id}"
                    style="cursor:pointer;font-size:25px;"></i> 
                 </td>
                 <td class="text-center">
                    
                </td>
                 <td class="text-center">
                   

                </td>
                 <td class="text-center">
                   
                       <i class="bi bi-pencil-square edit-AgencyInvoice edit-icon"
                       data-id="${value.Id}"
                       style="cursor:pointer;font-size:25px;"></i>
                  
                </td>
                 
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

// Submit record when Click on btn
$(".btnModalSubmit").on("click", function () {
    SubmitRecord();
});
// Submit records
async function SubmitRecord() {
    let isValid = true;

    let monthYear = $(".monthYearPicker").val();
    let deptId = $("#ddlDeptName").val();
    //let deptName = $("#ddlDeptName").val();
    let agencyId = $("#ddlAgencyName").val();
    //let agencyName = $("#ddlAgencyName").val();
    let workOrderNo = $("#ddlWorkOrder").val();
    let billingId = $("#ddlBillingAddress").val();
    //let billingAddress = $("#ddlBillingAddress").val();
    let noOfResources = $("#txtNoOfResources").val().trim();
    let presentResources = $("#txtPresentResource").val().trim();

    let Attendance = $("#inputAttendanceFileAttached").get(0);
    let files_Attendance = Attendance.files;

    let Annexure = $("#inputAnnexureFileAttached").get(0);
    let files_Annexure = Annexure.files;

    let GroupBill = $("#inputGroupBillFileAttached").get(0);
    let files_GroupBill = GroupBill.files;

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
  

 
    if (!monthYear) {
        $(".monthYearPicker").addClass("is-invalid");
        $(".monthYearPicker").siblings(".error").text("Month & Year required");
        isValid = false;
    }
    if (agencyId === "0" || agencyId === null) {
        $("#ddlAgencyName").addClass("is-invalid");
        $("#ddlAgencyName").siblings(".error").text("Agency Name is required.");
        isValid = false;
    }
    if (deptId === "0" || deptId === null) {
        $("#ddlDeptName").addClass("is-invalid");
        $("#ddlDeptName").siblings(".error").text("Department Name is required.");
        isValid = false;
    }

    if (workOrderNo === "0" || workOrderNo === null) {
        $("#ddlWorkOrder").addClass("is-invalid");
        $("#ddlWorkOrder").siblings(".error").text("Work Order No required.");
        isValid = false;
    }
    if (noOfResources === "") {
        $("#txtNoOfResources").addClass("is-invalid");
        $("#txtNoOfResources").siblings(".error").text("No Of Resources required.");
        isValid = false;
    }
    if (presentResources === "") {
        $("#txtPresentResource").addClass("is-invalid");
        $("#txtPresentResource").siblings(".error").text("No Of Resources required.");
        isValid = false;
    }

    if (billingId === "0" || billingId === null) {
        $("#ddlBillingAddress").addClass("is-invalid");
        $("#ddlBillingAddress").siblings(".error").text("Billing Address required.");
        isValid = false;
    }

    // file validation
    let fileSize = 5;
    let allowedExtensions = ["pdf"];

    // Attendance File Required
    if (files_Attendance.length === 0) {
        $("#inputAttendanceFileAttached").addClass("is-invalid");
        $("#inputAttendanceFileAttached").siblings(".error").text("Attendance file required");
        isValid = false;
    }
    else {

        if (!fileSizeValidation('inputAttendanceFileAttached', fileSize)) {
            isValid = false;
        }

        if (!fileExtensionValidation('inputAttendanceFileAttached', allowedExtensions)) {
            isValid = false;
        }
    }


     //Annexure File Required
    if (files_Annexure.length === 0) {
        $("#inputAnnexureFileAttached").addClass("is-invalid");
        $("#inputAnnexureFileAttached").siblings(".error").text("Annexure file required");
        isValid = false;
    }
    else {

        if (!fileSizeValidation('inputAnnexureFileAttached', fileSize)) {
            isValid = false;
        }

        if (!fileExtensionValidation('inputAnnexureFileAttached', allowedExtensions)) {
            isValid = false;
        }
    }


     //Group Bill File Required
    if (files_GroupBill.length === 0) {
        $("#inputGroupBillFileAttached").addClass("is-invalid");
        $("#inputGroupBillFileAttached").siblings(".error").text("Group Bill file required");
        isValid = false;
    }
    else {

        if (!fileSizeValidation('inputGroupBillFileAttached', fileSize)) {
            isValid = false;
        }

        if (!fileExtensionValidation('inputGroupBillFileAttached', allowedExtensions)) {
            isValid = false;
        }
    }

    if (!isValid) return;

    //File validation
   // var fileSize = 1
   // let allowedExtensions = ["pdf"];
   // // Validation for Attendance File
   // var isValid1 = fileSizeValidation('inputAttendanceFileAttached', fileSize);

   // if (!isValid1) {
   //     MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
   //     return;
   // }
   //// let allowedExtensions = ["pdf"];

   // isValid1 = fileExtensionValidation('inputAttendanceFileAttached', allowedExtensions)
   // if (!isValid1) {
   //     MsgBox('Message', "File should be only " + allowedExtensions + '.');
   //     return;
   // }

    var formData = new FormData();
    monthYear = $(".monthYearPicker").val(); // 03-2026
    let finalMonthYear = monthYear.replace("-", ""); // 032026
    formData.append("MonthYear", finalMonthYear);
    formData.append("WorkOrderNo", workOrderNo);
    formData.append("UpladNoOfResource", noOfResources);
    formData.append("PresentResource", presentResources);

    if (files_Attendance.length > 0) {
        formData.append("AttendanceFile", files_Attendance[0]);
    }

    if (files_Annexure.length > 0) {
        formData.append("AnnexureFile", files_Annexure[0]);
    }

    if (files_GroupBill.length > 0) {
        formData.append("AgencyBillFile", files_GroupBill[0]);
    }

    try {
        //$("#ModalProgress").show();
        let res = await acceptUpdate("Manpower", "AddOrEdit_DeptAttendanceRecord", formData);
        if (res.success) {

            recordlist();
            resetModal();
            
            Id = 0;
            $('.modelalert').text(res.message);
            closeModal('myModal');
            MsgBox('Message', res.message, '');
        }

    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }

}

// View Uploaded pdf on New tab  file conditions 
$(document).on('click', '.view-file', function (e) {
    e.preventDefault(); // Prevent default <a> behavior

    var fileName = $(this).data('file');
    var folder = $(this).data('folder');

    if (!fileName || fileName === 'undefined' || fileName === '') {
        toastr.error('File not uploaded');
        return;
    }

    // Construct URL
    var url = `/Attachment/DeptAttendance/${folder}/${fileName}`;

    // Open in new tab
    window.open(url, '_blank');
});

// MsgBox on Click event on Upload Annexure & Bill 
$(document).on('click', '.upload-Bill', async function () {

    var recordId = $(this).data("id");
   alert(recordId);
    console.log("Upload Bill Id:", recordId);

    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }

    var isConfirmed = await DeleteEditBox('Upload File','Do you want to upload Annexure/Bill?','question');

    if (isConfirmed) {
        await loadRecordUploadFile(recordId);
        openModal('myModal_UploadFile');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {

        console.log('Upload cancelled');

    }

});
// get Record to fill upload Annexure & Bill File
async function loadRecordUploadFile(recordId) {
   // alert('Load Record function')
    var filterData = {
        Id: recordId,
        AgencyId: 0,
        DeptId: 0,
        MonthYear: 0,
        CreatedBy: 0,
        UserRole: 39,
    };

    try {

        let records = await getRecords('Manpower', 'GetUploadAnnexureBillRecord', filterData, '', 'N');

        if (records && records.length > 0) {

            let data = records[0];
            alert(data);
            Id = data.Id;
            $("#textMonthYearFill").val(data.MonthYear);
            $("#txtDeptFill").val(data.departmentName);
            $("#txtAgencyFill").val(data.AgencyName);
            $("#textWorkOrderFill").val(data.WorkOrderId);
            $("#txtNoResourcesFill").val(data.DeployedResource);
            $("#txtPrsentResouceFill").val(data.UpladNoOfResource);
            $("#textBillingAddFill").val(data.BillingAddress);
            
            //alert('test');


            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}
// Submit Upload files record when Click on btn
$(".btnModalSubmit1").on("click", function () {
    SubmitUploadFile();
});

// Submit records
async function SubmitUploadFile() {
    let isValid = true;
    
    let files_Annexure = $("#inputAnnexureFileAttached1")[0]?.files || [];
    let files_GroupBill = $("#inputGroupBillFileAttached1")[0]?.files || [];

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    // file validation
    let fileSize = 5;
    let allowedExtensions = ["pdf"];

    // Annexure File Required
    if (files_Annexure.length === 0) {

        $("#inputAnnexureFileAttached1").addClass("is-invalid");
        $("#inputAnnexureFileAttached1").siblings(".error").text("Annexure file required");

        isValid = false;

    } else {

        if (!fileSizeValidation('inputAnnexureFileAttached1', fileSize)) {
            isValid = false;
        }

        if (!fileExtensionValidation('inputAnnexureFileAttached1', allowedExtensions)) {
            isValid = false;
        }

    }

    // Group Bill File Required
    if (files_GroupBill.length === 0) {

        $("#inputGroupBillFileAttached1").addClass("is-invalid");
        $("#inputGroupBillFileAttached1").siblings(".error").text("Group Bill file required");

        isValid = false;

    } else {

        if (!fileSizeValidation('inputGroupBillFileAttached1', fileSize)) {
            isValid = false;
        }

        if (!fileExtensionValidation('inputGroupBillFileAttached1', allowedExtensions)) {
            isValid = false;
        }

    }
    if (!isValid) return;

    var formData = new FormData();
    //monthYear = $(".monthYearPicker").val(); // 03-2026
    //let finalMonthYear = monthYear.replace("-", ""); // 032026
    formData.append("Id", Id);
    //formData.append("WorkOrderNo", workOrderNo);
    //formData.append("UpladNoOfResource", noOfResources);
    //formData.append("PresentResource", presentResources);

    if (files_Annexure.length > 0) {
        formData.append("AnnexureFile", files_Annexure[0]);
    }

    if (files_GroupBill.length > 0) {
        formData.append("AgencyBillFile", files_GroupBill[0]);
    }

    try {
        //$("#ModalProgress").show();
        let res = await acceptUpdate("Manpower", "AddOrEdit_AnnexureBillRecord", formData);
        if (res.success) {

            recordlist();
            resetModal();

            Id = 0;
            $('.modelalert').text(res.message);
            closeModal('myModal');
            MsgBox('Message', res.message, '');
        }

    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }

}


// MsgBox on Click event on Delete Icon 
$(document).on('click', '.delete-Records', async function () {

    var recordId = $(this).data("id");

    console.log("Delete Id:", recordId);

    if (!recordId) {
        toastr.error("Attendance Id not found");
        return;
    }

    var isConfirmed = await DeleteEditBox("Delete Record", "Do you want to delete this record?", "question");

    if (isConfirmed) {
        await deleteAttendanceRecord(recordId);
    }

});
// Delete Records Function
async function deleteAttendanceRecord(Id) {

    try {

        let formData = new FormData();

        formData.append("Id", Id);
        formData.append("CancelRemarks", "Deleted by user");

        console.log("Sending Delete Data:", Id);

        let res = await acceptUpdate("Manpower","Delete_DeptAttendanceRecord",formData);

        if (res.success) {

            toastr.success(res.message);

            recordlist(); // reload table

        } else {

            toastr.error(res.message || "Delete failed");

        }

    } catch (err) {

        console.error("Delete error:", err);
        toastr.error("Server error while deleting");

    }

}

$(document).on('click', '.edit-AgencyInvoice', async function () {

    var recordId = $(this).data("id");
    // alert(recordId);
    console.log("Edit Record Id:", recordId);

    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }

    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question');

    if (isConfirmed) {
        await loadRecordUpdate(recordId);
        openModal('myModal_AgencyInvoice');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {

        console.log('Edit cancelled');

    }

});
// get Record to fill
async function loadRecordUpdate(recordId) {
    //alert('Load Record function')
    var filterData = {
        Id: recordId,
        AgencyId: 0,
        DeptId: 0,
        MonthYear: 0,
        CreatedBy: 0,
        UserRole: 39,
    };

    try {

        let records = await getRecords('Manpower', 'GetAgencyInvoiceRecord', filterData, '', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            Id = data.Id;
            $("#ddlPurchaseBillDate1").val(data.MonthYear);
            $("#txtWorkOrderNo1").val(data.WorkOrderId);
            //$("#txtAgencyBillNo1").val(data.AgencyName);
            $("#txtAgencyName1").val(data.AgencyName);
            $("#txtDeptName1").val(data.departmentName);
            $("#txtNoResource1").val(data.UpladNoOfResource);
            $("#txtDepBillingAdd1").val(data.BillingAddress);
            $("#monthYear1").val(data.MonthYear);
            $("#hdnAgencyId1").val(data.AgencyId);
            $("#hdnDeptId1").val(data.DeptId);
            $("#hdnBillingId1").val(data.BillingId);

            console.log("AgencyId:", data.AgencyId);
            console.log("DeptId:", data.DeptId);
            console.log("BillingId:", data.BillingId);
            
            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}

// Submit Upload files record when Click on btn
$(".btnModalSubmit2").on("click", function () {
    SubmitPurchaseBill();
});

// Submit records
async function SubmitPurchaseBill() {
    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    let purcahseBillDate = $("#ddlPurchaseBillDate1").val();
    let workOrderNo = $("#txtWorkOrderNo1").val().trim();
    let billNo = $("#txtAgencyBillNo1").val().trim();
    let agencyId = $("#hdnAgencyId1").val();
    let deptId = $("#hdnDeptId1").val();
    let billingId = $("#hdnBillingId1").val();
    let noOfResource = $("#txtNoResource1").val().trim();
    let billingAdd = $("#txtDepBillingAdd1").val();
    let monthYear = $("#monthYear1").val();
    let discription = $("#txtDiscription1").val();
    let narration = $("#txtNarration1").val().trim();
    let billAmount = $("#numBasicAmount").val().trim();
    let adminCharge = $("#numAdminCharge").val().trim();
    let liveryCharge = $("#numLiveryCharge").val().trim();
    let inputCGST = $("#numCgst").val().trim();
    let inputSGST = $("#numSgst").val().trim();
    let totalAmount = $("#numTotalAmount").val().trim(); 

    if (purcahseBillDate === "") {
        $("#ddlPurchaseBillDate1").addClass("is-invalid");
        $("#ddlPurchaseBillDate1").siblings(".error").text("Bill Date Required");
        isValid = false;
    }
    if (billNo === "") {
        $("#txtAgencyBillNo1").addClass("is-invalid");
        $("#txtAgencyBillNo1").siblings(".error").text("Bill No Required");
        isValid = false;
    }
    if (!monthYear) {
        $("#monthYear1").addClass("is-invalid");
        $("#monthYear1").siblings(".error").text("Month & Year required");
        isValid = false;
    }
    if (discription === "") {
        $("#txtDiscription1").addClass("is-invalid");
        $("#txtDiscription1").siblings(".error").text("Discription Required");
        isValid = false;
    }
    if (narration === "") {
        $("#txtNarration1").addClass("is-invalid");
        $("#txtNarration1").siblings(".error").text("Narration Required");
        isValid = false;
    }
    if (billAmount === "") {
        $("#numBasicAmount").addClass("is-invalid");
        $("#numBasicAmount").siblings(".error").text("Bill Amount Required");
        isValid = false;
    }
    if (adminCharge === "") {
        $("#numAdminCharge").addClass("is-invalid");
        $("#numAdminCharge").siblings(".error").text("Admin Charge Required");
        isValid = false;
    }
    if (liveryCharge === "") {
        $("#numLiveryCharge").addClass("is-invalid");
        $("#numLiveryCharge").siblings(".error").text("Livery Charge Required");
        isValid = false;
    }
    if (inputCGST === "") {
        $("#numCgst").addClass("is-invalid");
        $("#numCgst").siblings(".error").text("CGST Required");
        isValid = false;
    }
    if (inputSGST === "") {
        $("#numSgst").addClass("is-invalid");
        $("#numSgst").siblings(".error").text("CGST Required");
        isValid = false;
    }
    if (totalAmount === "") {
        $("#numTotalAmount").addClass("is-invalid");
        $("#numTotalAmount").siblings(".error").text("Total Amnount Required");
        isValid = false;
    }
            
    if (!isValid) return;

    var formData = new FormData();

    //let monthYear = $("#monthYear1").val();
    let finalMonthYear = monthYear.replace("-", "");
    formData.append("MonthYear", finalMonthYear);
    formData.append("AgencyBillId", 0);
    formData.append("PurchaseBillDate", purcahseBillDate);
    formData.append("WorkOrderNo", workOrderNo);
    formData.append("NoOfResources", noOfResource);
    formData.append("Id", Id);
    formData.append("AgencyBillNo", billNo);
    formData.append("AgencyId", parseInt(agencyId));
    formData.append("DeptId", parseInt(deptId));
    formData.append("BillingId", parseInt(billingId));
    formData.append("BillingAdd", billingAdd);
    formData.append("Description", discription);
    formData.append("Narration", narration);
    formData.append("BasicBillAmt", Number(billAmount));
    formData.append("AdminCharge", Number(adminCharge));
    formData.append("LiveryCharge", Number(liveryCharge));
    formData.append("InputCgst", Number(inputCGST));
    formData.append("InputSgst", Number(inputSGST));
    formData.append("InputIgst", 0);
    formData.append("TotalAmt", Number(totalAmount));
    //formData.append("UpladNoOfResource", noOfResources);
    //formData.append("PresentResource", presentResources);

   
    try {
        //$("#ModalProgress").show();
        let res = await acceptUpdate("Manpower", "AddOrEdit_PurchaseInvoiceRecord", formData);
        if (res.success) {
            alert('Hit');
            recordlist();
            resetModal();

            Id = 0;
            $('.modelalert').text(res.message);
            closeModal('myModal_AgencyInvoice');
            MsgBox('Message', res.message, '');
        }

    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }

}
// Call the function when user changes amount fields.
$(document).on("keyup change", "#numBasicAmount, #numLiveryCharge", function () {
    calculateBillAmounts();
});
// Calculation Function for Bill Amount
function calculateBillAmounts() {

    let basicAmount = parseFloat($("#numBasicAmount").val()) || 0;
    let liveryCharge = parseFloat($("#numLiveryCharge").val()) || 0;

    // Admin Charge 2.5%
    let adminCharge = basicAmount * 0.025;

    // Subtotal
    let subTotal = basicAmount + adminCharge /*+ liveryCharge*/;

    // GST
    let cgst = subTotal * 0.09;
    let sgst = subTotal * 0.09;

    // Total
    let total = subTotal + liveryCharge + cgst + sgst;

   
    $("#numAdminCharge").val(adminCharge.toFixed(2));
    $("#numCgst").val(cgst.toFixed(2));
    $("#numSgst").val(sgst.toFixed(2));
    $("#numTotalAmount").val(total.toFixed(2));
}