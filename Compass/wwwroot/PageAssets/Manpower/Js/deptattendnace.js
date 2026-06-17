var Id = 0;
var AttendaceId = 0;
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
    //  roleId = $("#hdnUserRole").val();

    // if (roleId != "48") {
    //     $(".admin-col").hide();
    // }
    resetModal();
    recordlist();

    //initializeMonthYearPickerByClass("monthYearPicker");
    initCustomPicker('#monthYear');
    initCustomPicker('#monthYear1');
    //Parent Dropdown
    bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptName", "Select Department Name");
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", "Select Agency Name");

    // Dependent Dropdown Billing Address on Department
    //bindDependentDataToDdl("Dropdown","MBillingAddress_ddl",null,// ❗ no modal
    //    "ddlDeptName", "ddlBillingAddress", "Select Billing Address");

    // Dependent Dropdown Work Order on Agency
    bindDependentDataToDdlToParent("Dropdown", "MWorkOrder_ddl", null,// ❗ no modal
        "ddlDeptName", "ddlAgencyName", null, "ddlWorkOrder", "Select Work Order ");

    // Dependent Dropdown Billing Address on WorkOrderId
    bindDependentDataToDdlToParent("Dropdown", "MWorkOrder_ddl", null,// ❗ no modal
        "ddlDeptName", "ddlAgencyName", "ddlWorkOrder", "ddlBillingAddress", "Select Billing Address ");

    // Reload Table when change MonthYear
    $(document).on('change', '#monthYear1', function () {
        console.log("Month changed, reloading records...");
        recordlist();
    });
});
$('#ddlBillingAddress')
    .on('select2:select', function (e) {
        $('#txtNoOfResources').val(e.params.data.noDeployedRes || 0);
    })
    .on('select2:clear', function () {
        $('#txtNoOfResources').val('');
    });
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
    var filterData = {
        Id: 0,
        AgencyId: 0,
        //DeptId: roleId != "48" ,
        // DeptId: roleId == "48" ? 0 : deptId,
        DeptId: (roleId === "48") ? 0 : deptId,
        MonthYear: finalMonthId,
    };
    console.log(roleId);
    console.log(deptId);
    console.log(filterData);
    try {

        let records = await getRecords('Manpower', 'GetDeptAttendanceRecord', filterData, '#myTable', 'N');
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
            <tr data-id="${value.Id}" data-attendanceId="${value.AttendanceId}">
             <td>${SrNo}</td>
            <td>${value.departmentName ?? ""}</td>
            <td>${value.AgencyName ?? ""}</td>
             <td>
                ${value.WorkOrderId ?? ""}  <br>  ${value.PurhaseInvNO ?? ""}
            </td>
            <td>${value.DeployedResource ?? 0}</td>
            <td>${value.UpladNoOfResource ?? 0}</td>
            <td>${value.MonthYear ?? ""}</td>
            <!--Attendnace File-->
            <td class="text-center">
                 <a href="javascript:void(0)" class="view-file" data-file="${value.AttendanceCertificate}" data-folder="Attendance" title="View Attendance File">
                 <i class="bi bi-file-earmark-arrow-down-fill text-danger" style="font-size:25px;"></i>  </a>
            </td>
               <!--Annexure File-->
            <td class="text-center">
                <a href="javascript:void(0)" class="view-file"  data-file="${value.AnnexureFile}"  data-folder="Annexure" title="View Annexure File">
                <i class="bi bi-file-earmark-arrow-down-fill text-danger" style="font-size:25px;"></i> </a>
            </td>
               <!--Agency Bill File-->
            <td class="admin-col text-center">
                <a href="javascript:void(0)" class="view-file" data-file="${value.AgencyBillFile}" data-folder="AgencyBill" title="View AgencyBill File">
                <i class="bi bi-file-earmark-arrow-down-fill text-danger" style="font-size:25px;"></i> </a>
            </td>
               <!-- Upload Annexure & Bill File-->
          <td class="admin-col text-center">
             <i class="bi bi-file-earmark-arrow-up-fill text-primary upload-Bill"  data-id="${value.Id}"
             data-attendaceId="${value.AttendaceId} " title="Upload Annexure & Bill File" style="cursor:pointer;font-size:25px;"></i> </td>
                <!--Delete Uploaded Files-->
            <td class="text-center">
                 ${ (!value.AnnexureFile && !value.AgencyBillFile)
                        ? `<i class="bi bi-trash-fill text-danger delete-Records" data-attendaceid="${value.AttendaceId}" style="cursor:pointer;font-size:25px;"></i>`
                        : `<i class="bi bi-trash-fill text-muted" title="Cannot delete after upload" style="font-size:25px;opacity:0.4;cursor:not-allowed;"></i>`}
                </td>
           <!--Verification Status-->
             <td class="admin-col text-center">
                ${value.VerificationStatus === "V"
                ? '<i class="bi bi-check-circle-fill text-success" style="font-size:25px;"></i>'
                : '<i class="bi bi-x-circle-fill text-danger" style="font-size:25px;"></i>'}
            </td>
               <!--Remarks-->
            <td class="admin-col text-center">${value.Remarks ?? ""}
            </td>
            <!--Agency Invoice-->
            <td class="admin-col text-center">
                         ${value.IsPurhaseBIllGenerated === "N"
            ? ` <i class="bi bi-file-earmark-plus-fill text-success edit-AgencyInvoice" data-attendaceId="${value.AttendaceId}"
               title="Agency Invoice Entry" style="cursor:pointer;font-size:25px;"></i>`
            : ` <i class="bi bi-file-earmark-plus-fill text-muted "  title="Invoice already Generated" style="font-size:25px;opacity:0.4;cursor:not-allowed;"></i>`}

           </td>
</tr>
`);

    });
    // $(tableId).DataTable({
    //     paging: true,
    //     searching: true,
    //     ordering: true,
    //     info: true,
    //     responsive: true
    // });
    let table = $(tableId).DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        responsive: true,

        columnDefs: [
            {
                targets: [9, 10, 12, 13, 14], // admin columns
                visible: roleId === "48"
            }
        ]
    });
    // role id check for data table creation
    if (roleId !== "48") {
        table.columns([9, 10, 12, 13, 14]).visible(false);
    }
}


// Map data No of resource
$(".btnModalMapData").on("click", function () {
    MapRecord();
});
async function MapRecord() {
    var isConfirmed = await DeleteEditBox('Map Data', 'Do you want to Map No. of Resource?', 'question');

    if (isConfirmed) {
        //await loadMapRecord(recordId);

        openModal('myModal_MapRecord');
        await recordMaplist();


    } else {

        console.log('Maping cancelled');

    }
}
//Get Record for A Map No of Resource with Emp Name table 
async function recordMaplist() {

    var filterData = {
        WorkOrderId: $("#ddlWorkOrder").val(),
        AgencyId: 0,
    };

    try {

        let records = await getRecords('Manpower', 'GetMapEmpRsourceRecord', filterData, '#myTable_MapResource', 'N');
        bindMapDatatable(records, '#myTable_MapResource');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record in a table  of Map Employee record 
function bindMapDatatable(records, tableId) {

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
                data-id="${value.AttendanceId}">
                <td>${SrNo}</td>
                <td class="text-center"> <input type="checkbox" class="rowCheckbox" value="${value.EmpId}"></td>
                <td>${value.EmpId}</td>
                <td>${value.EmpName}</td>
                <td>${value.EmpFatherName}</td>
                <td>${value.EmpAadharNo} </td>
                <td>${value.EmpDesignation}</td>
                                 
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
// Select All checkbox
$(document).on('change', '#selectAll', function () {
    $('.rowCheckbox').prop('checked', $(this).prop('checked'));
});
$(document).on('change', '.rowCheckbox', function () {
    if (!$(this).prop('checked')) {
        $('#selectAll').prop('checked', false);
    } else {
        // Check if all checkboxes are checked
        if ($('.rowCheckbox:checked').length === $('.rowCheckbox').length) {
            $('#selectAll').prop('checked', true);
        }
    }
});
$(".btnModalSubmitMap").on("click", function () {
    var totalSelected = $(".rowCheckbox:checked").length;
    $("#txtPresentResource").val(totalSelected);
    closeModal('myModal_MapRecord');
    // SubmitRecord();
});
// Submit record when Click on btn
$(".btnModalSubmit").on("click", function () {
    SubmitRecord();
});
// Submit records
//async function SubmitRecord() {
//    let isValid = true;

//    let monthYear = $("#monthYear").val();
//    let deptId = $("#ddlDeptName").val();
//    //let deptName = $("#ddlDeptName").val();
//    let agencyId = $("#ddlAgencyName").val();
//    //let agencyName = $("#ddlAgencyName").val();
//    let workOrderNo = $("#ddlWorkOrder").val();
//    let billingId = $("#ddlBillingAddress").val();
//    //let billingAddress = $("#ddlBillingAddress").val();
//    let noOfResources = $("#txtNoOfResources").val().trim();
//    let presentResources = $("#txtPresentResource").val().trim();

//    let Attendance = $("#inputAttendanceFileAttached").get(0);
//    //let files_Attendance = Attendance.files;
//    let files_Attendance = Attendance ? Attendance.files : [];

//    let Annexure = $("#inputAnnexureFileAttached").get(0);
//    //let files_Annexure = Annexure.files;
//    let files_Annexure = Annexure ? Annexure.files : [];

//    let GroupBill = $("#inputGroupBillFileAttached").get(0);
//    //let files_GroupBill = GroupBill.files;
//    let files_GroupBill = GroupBill ? GroupBill.files : [];

//    $(".error").text("");
//    $(".is-invalid").removeClass("is-invalid");



//    if (!monthYear) {
//        $("#monthYear").addClass("is-invalid");
//        $("#monthYear").siblings(".error").text("Month & Year required");
//        isValid = false;
//    }
//    if (agencyId === "0" || agencyId === null) {
//        $("#ddlAgencyName").addClass("is-invalid");
//        $("#ddlAgencyName").siblings(".error").text("Agency Name is required.");
//        isValid = false;
//    }
//    if (deptId === "0" || deptId === null) {
//        $("#ddlDeptName").addClass("is-invalid");
//        $("#ddlDeptName").siblings(".error").text("Department Name is required.");
//        isValid = false;
//    }

//    if (workOrderNo === "0" || workOrderNo === null) {
//        $("#ddlWorkOrder").addClass("is-invalid");
//        $("#ddlWorkOrder").siblings(".error").text("Work Order No required.");
//        isValid = false;
//    }
//    if (noOfResources === "") {
//        $("#txtNoOfResources").addClass("is-invalid");
//        $("#txtNoOfResources").siblings(".error").text("No Of Resources required.");
//        isValid = false;
//    }
//    if (presentResources === "") {
//        $("#txtPresentResource").addClass("is-invalid");
//        $("#txtPresentResource").siblings(".error").text("No Of Resources required.");
//        isValid = false;
//    }

//    if (billingId === "0" || billingId === null) {
//        $("#ddlBillingAddress").addClass("is-invalid");
//        $("#ddlBillingAddress").siblings(".error").text("Billing Address required.");
//        isValid = false;
//    }

//    // file validation
//    //let fileSize = 5;
//    //let allowedExtensions = ["pdf"];

//    //// Attendance File Required
//    //if (files_Attendance.length === 0) {
//    //    $("#inputAttendanceFileAttached").addClass("is-invalid");
//    //    $("#inputAttendanceFileAttached").siblings(".error").text("Attendance file required");
//    //    isValid = false;
//    //}
//    //else {

//    //    if (!fileSizeValidation('inputAttendanceFileAttached', fileSize)) {
//    //        isValid = false;
//    //    }

//    //    if (!fileExtensionValidation('inputAttendanceFileAttached', allowedExtensions)) {
//    //        isValid = false;
//    //    }
//    //}


//    // //Annexure File Required
//    //if (files_Annexure.length === 0) {
//    //    $("#inputAnnexureFileAttached").addClass("is-invalid");
//    //    $("#inputAnnexureFileAttached").siblings(".error").text("Annexure file required");
//    //    isValid = false;
//    //}
//    //else {

//    //    if (!fileSizeValidation('inputAnnexureFileAttached', fileSize)) {
//    //        isValid = false;
//    //    }

//    //    if (!fileExtensionValidation('inputAnnexureFileAttached', allowedExtensions)) {
//    //        isValid = false;
//    //    }
//    //}


//    // //Group Bill File Required
//    //if (files_GroupBill.length === 0) {
//    //    $("#inputGroupBillFileAttached").addClass("is-invalid");
//    //    $("#inputGroupBillFileAttached").siblings(".error").text("Group Bill file required");
//    //    isValid = false;
//    //}
//    //else {

//    //    if (!fileSizeValidation('inputGroupBillFileAttached', fileSize)) {
//    //        isValid = false;
//    //    }

//    //    if (!fileExtensionValidation('inputGroupBillFileAttached', allowedExtensions)) {
//    //        isValid = false;
//    //    }
//    //}



//    // ===============================
//    // FILE VALIDATION
//    // ===============================

//    let fileSize = 5;
//    let allowedExtensions = ["pdf"];

//    // ===============================
//    // ATTENDANCE FILE (FOR ALL USERS)
//    // ===============================

//    if (files_Attendance.length === 0) {

//        $("#inputAttendanceFileAttached").addClass("is-invalid");
//        $("#inputAttendanceFileAttached")
//            .closest(".col-md-3")
//            .find(".error")
//            .text("Attendance file required");

//        isValid = false;
//    }
//    else {

//        if (!fileSizeValidation('inputAttendanceFileAttached', fileSize)) {
//            isValid = false;
//        }

//        if (!fileExtensionValidation('inputAttendanceFileAttached', allowedExtensions)) {
//            isValid = false;
//        }
//    }

//    // ===============================
//    // AGENCY ROLE VALIDATION
//    // RoleId = 48
//    // ===============================

//    if (roleId == "48") {

//        // Annexure Required

//        if (files_Annexure.length === 0) {

//            $("#inputAnnexureFileAttached").addClass("is-invalid");

//            $("#inputAnnexureFileAttached")
//                .closest(".col-md-3")
//                .find(".error")
//                .text("Annexure file required");

//            isValid = false;
//        }
//        else {

//            if (!fileSizeValidation('inputAnnexureFileAttached', fileSize)) {
//                isValid = false;
//            }

//            if (!fileExtensionValidation('inputAnnexureFileAttached', allowedExtensions)) {
//                isValid = false;
//            }
//        }

//        // Group Bill Required

//        if (files_GroupBill.length === 0) {

//            $("#inputGroupBillFileAttached").addClass("is-invalid");

//            $("#inputGroupBillFileAttached")
//                .closest(".col-md-3")
//                .find(".error")
//                .text("Agency Bill file required");

//            isValid = false;
//        }
//        else {

//            if (!fileSizeValidation('inputGroupBillFileAttached', fileSize)) {
//                isValid = false;
//            }

//            if (!fileExtensionValidation('inputGroupBillFileAttached', allowedExtensions)) {
//                isValid = false;
//            }
//        }
//    }
//    if (!isValid) return;

//    //File validation
//   // var fileSize = 1
//   // let allowedExtensions = ["pdf"];
//   // // Validation for Attendance File
//   // var isValid1 = fileSizeValidation('inputAttendanceFileAttached', fileSize);

//   // if (!isValid1) {
//   //     MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
//   //     return;
//   // }
//   //// let allowedExtensions = ["pdf"];

//   // isValid1 = fileExtensionValidation('inputAttendanceFileAttached', allowedExtensions)
//   // if (!isValid1) {
//   //     MsgBox('Message', "File should be only " + allowedExtensions + '.');
//   //     return;
//   // }

//    var formData = new FormData();
//    monthYear = $("#monthYear").val(); // 03-2026
//    var finalMonthId = "0";

//    if (monthYear && monthYear.includes('/')) {
//        var parts = monthYear.split('/');
//        var m = parseInt(parts[0], 10);
//        var y = parts[1];
//        finalMonthId = m.toString() + y.toString(); // Result: "42026"
//    }
//    formData.append("MonthYear", finalMonthId);
//    formData.append("WorkOrderNo", workOrderNo);
//    formData.append("UpladNoOfResource", noOfResources);
//    formData.append("PresentResource", presentResources);

//    if (files_Attendance.length > 0) {
//        formData.append("AttendanceFile", files_Attendance[0]);
//    }

//    //if (files_Annexure.length > 0) {
//    //    formData.append("AnnexureFile", files_Annexure[0]);
//    //}

//    //if (files_GroupBill.length > 0) {
//    //    formData.append("AgencyBillFile", files_GroupBill[0]);
//    //}

//    if (roleId == "48" && files_Annexure.length > 0) {
//        formData.append("AnnexureFile", files_Annexure[0]);
//    }

//    if (roleId == "48" && files_GroupBill.length > 0) {
//        formData.append("AgencyBillFile", files_GroupBill[0]);
//    }

//    try {
//        //$("#ModalProgress").show();
//        let res = await acceptUpdate("Manpower", "AddOrEdit_DeptAttendanceRecord", formData);
//        if (res.success) {

//            recordlist();
//            resetModal();

//            Id = 0;
//            $('.modelalert').text(res.message);
//            closeModal('myModal');
//            MsgBox('Message', res.message, '');
//        }

//    } catch (err) {
//        $('.modelalert').text("Error: " + err);
//    }

//}
async function SubmitRecord() {
    let isValid = true;
    // Form Values
    let monthYear = $("#monthYear").val();
    let deptId = $("#ddlDeptName").val();
    let agencyId = $("#ddlAgencyName").val();
    let workOrderNo = $("#ddlWorkOrder").val();
    let billingId = $("#ddlBillingAddress").val();
    let noOfResources = $("#txtNoOfResources").val().trim();
    let presentResources = $("#txtPresentResource").val().trim();
    // FILE CONTROLS
    let Attendance = $("#inputAttendanceFileAttached").get(0);
    let files_Attendance = Attendance ? Attendance.files : [];

    let Annexure = $("#inputAnnexureFileAttached").get(0);
    let files_Annexure = Annexure ? Annexure.files : [];

    let GroupBill = $("#inputGroupBillFileAttached").get(0);
    let files_GroupBill = GroupBill ? GroupBill.files : [];

    // ===============================
    // RESET VALIDATION
    // ===============================

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

    if (deptId === "0" || deptId === null) {

        $("#ddlDeptName").addClass("is-invalid");
        $("#ddlDeptName").siblings(".error").text("Department Name required");

        isValid = false;
    }

    if (workOrderNo === "0" || workOrderNo === null) {

        $("#ddlWorkOrder").addClass("is-invalid");
        $("#ddlWorkOrder").siblings(".error").text("Work Order required");

        isValid = false;
    }

    if (noOfResources === "") {

        $("#txtNoOfResources").addClass("is-invalid");
        $("#txtNoOfResources").siblings(".error").text("No Of Resources required");

        isValid = false;
    }

    if (presentResources === "") {

        $("#txtPresentResource").addClass("is-invalid");
        $("#txtPresentResource").siblings(".error").text("Present Resource required");

        isValid = false;
    }

    //if (billingId === "0" || billingId === null) {

    //    $("#ddlBillingAddress").addClass("is-invalid");
    //    $("#ddlBillingAddress").siblings(".error").text("Billing Address required");

    //    isValid = false;
    //}


    // FILE VALIDATION


    let fileSize = 5;
    let allowedExtensions = ["pdf"];


    // ATTENDANCE FILE REQUIRED
    // FOR ALL USERS


    if (files_Attendance.length === 0) {

        $("#inputAttendanceFileAttached").addClass("is-invalid");

        $("#inputAttendanceFileAttached")
            .closest(".col-md-3")
            .find(".error")
            .text("Attendance file required");

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


    // Agency Role Validation
    // RoleId = 48

    if (roleId == "48") {


        // Annexure File


        if (files_Annexure.length === 0) {

            $("#inputAnnexureFileAttached").addClass("is-invalid");

            $("#inputAnnexureFileAttached")
                .closest(".col-md-3")
                .find(".error")
                .text("Annexure file required");

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


        // Agency Bill File

        if (files_GroupBill.length === 0) {

            $("#inputGroupBillFileAttached").addClass("is-invalid");

            $("#inputGroupBillFileAttached")
                .closest(".col-md-3")
                .find(".error")
                .text("Agency Bill file required");

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

    formData.append("MonthYear", finalMonthId);
    formData.append("WorkOrderNo", workOrderNo);
    formData.append("UpladNoOfResource", noOfResources);
    formData.append("PresentResource", presentResources);

    // Employee List
    let employees = [];
    let checkedEmployees = $(".rowCheckbox:checked");

    if (checkedEmployees.length == 0) {

        MsgBox('Error', 'Please select at least one employee', '');
        return;
    }

    checkedEmployees.each(function () {
        employees.push({
            EmpId: parseInt($(this).val())
        });
    });
    formData.append("EmployeeListJson", JSON.stringify(employees));

    // ===============================
    // ATTENDANCE FILE
    // ===============================

    if (files_Attendance.length > 0) {

        formData.append("AttendanceFile", files_Attendance[0]);
    }

    // ===============================
    // AGENCY FILES
    // ===============================

    if (roleId == "48") {

        if (files_Annexure.length > 0) {

            formData.append("AnnexureFile", files_Annexure[0]);
        }

        if (files_GroupBill.length > 0) {

            formData.append("AgencyBillFile", files_GroupBill[0]);
        }
    }

    // ===============================
    // SUBMIT
    // ===============================

    try {

        let res = await acceptUpdate("Manpower", "AddOrEdit_DeptAttendanceRecord", formData);

        if (res.success) {

            recordlist();

            resetModal();

            Id = 0;

            $('.modelalert').text(res.message);

            closeModal('myModal');

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
    var url = `/Attachment/DeptAttendance/${folder}/${fileName}`;

    // Open in new tab
    window.open(url, '_blank');
});

// MsgBox on Click event on Upload Annexure & Bill 
$(document).on('click', '.upload-Bill', async function () {
    Id = $(this).data("id");
    var recordId = $(this).data("attendaceid");
    console.log("Upload Bill Id:", Id);
    console.log("Upload Bill Id:", recordId);
    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('Upload File', 'Do you want to upload Annexure/Bill?', 'question');
    if (isConfirmed) {
        await loadRecordUploadFile(Id, recordId);
        await recordMarkedEpmlist(Id, recordId);
        openModal('myModal_UploadFile');
    } else {
        console.log('Upload cancelled');
    }

});
// get Record to fill upload Annexure & Bill File
async function loadRecordUploadFile(Id, recordId) {
    // alert('Load Record function')
    var filterData = {
        Id: Id,
        AttendaceId: recordId,

    };
    alert(filterData);
    try {

        let records = await getRecords('Manpower', 'GetUploadAnnexureBillRecord', filterData, '', 'N');

        if (records && records.length > 0) {

            let data = records[0];
            alert(JSON.stringify(data));
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
//Get Record mapped No of Resource marked by department 
async function recordMarkedEpmlist(Id, recordId) {

    var filterData = {
        Id: Id,
        AttendaceId: recordId,


    };

    try {

        let records = await getRecords('Manpower', 'GetMarkedEmpRsourceRecord', filterData, '#myTable_ViewMapResource', 'N');
        bindMarkedDatatable(records, '#myTable_ViewMapResource');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record in a table  of Map Employee record 
function bindMarkedDatatable(records, tableId) {

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
                data-id="${value.AttendanceId}">
                <td>${SrNo}</td>
                <td>${value.EmpId}</td>
                <td>${value.EmpName}</td>
                <td>${value.EmpFatherName}</td>
                <td>${value.EmpAadharNo} </td>
                
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

            Id = Id;
            $('.modelalert').text(res.message);
            closeModal('myModal_UploadFile');
            MsgBox('Message', res.message, '');
        }

    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }

}


// MsgBox on Click event on Delete Icon 
$(document).on('click', '.delete-Records', async function () {

    var recordId = $(this).data("attendaceid");
    alert(recordId);

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
async function deleteAttendanceRecord(recordId) {

    try {

        let formData = new FormData();

        formData.append("AttendaceId", recordId);
        formData.append("CancelRemarks", "Deleted by user");

        console.log("Sending Delete Data:", recordId);

        let res = await acceptUpdate("Manpower", "Delete_DeptAttendanceRecord", formData);

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
//IGST Checkbox Click event
$("#flexCheckDefault").change(function () {

    if ($(this).is(":checked")) {
        $("#igstBox").show();
    } else {
        $("#igstBox").hide();
    }

    calculateBillAmounts();

});

//Msgbox on Agency Invoice Entry 
$(document).on('click', '.edit-AgencyInvoice', async function () {

    //var recordId = $(this).data("id");
    // var recordId = $(this).data("attendaceid");
    AttendaceId = $(this).data("attendaceid");
    alert(AttendaceId);
    console.log("Edit Record Id:", AttendaceId);

    if (!AttendaceId) {
        toastr.error("Record Id not found");
        return;
    }

    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question');

    if (isConfirmed) {
        await loadRecordUpdate(AttendaceId);
        openModal('myModal_AgencyInvoice');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {

        console.log('Edit cancelled');

    }

});

// get Record to fill
async function loadRecordUpdate(AttendaceId) {
    //alert('Load Record function')
    var filterData = {
        AttendaceId: AttendaceId,

    };

    try {

        let records = await getRecords('Manpower', 'GetAgencyInvoiceRecord', filterData, '', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            Id = data.Id;
            AttendaceId = data.AttendaceId;
            $("#ddlPurchaseBillDate1").val(data.MonthYear);
            $("#txtWorkOrderNo1").val(data.WorkOrderId);
            //$("#txtAgencyBillNo1").val(data.AgencyName);
            $("#txtAgencyName1").val(data.AgencyName);
            $("#txtDeptName1").val(data.departmentName);
            $("#txtNoResource1").val(data.UpladNoOfResource);
            $("#txtDepBillingAdd1").val(data.BillingAddress);
            $("#monthYear2").val(data.MonthYear);
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
    let monthYear = $("#monthYear2").val();
    let discription = $("#txtDiscription1").val();
    let narration = $("#txtNarration1").val().trim();
    let billAmount = $("#numBasicAmount").val().trim();
    let adminCharge = $("#numAdminCharge").val().trim();
    let liveryCharge = $("#numLiveryCharge").val().trim();
    let inputCGST = $("#numCgst").val().trim();
    let inputSGST = $("#numSgst").val().trim();
    let inputIGST = $("#numIgst").val().trim();
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
    // if (!monthYear) {
    //     $("#monthYear2").addClass("is-invalid");
    //     $("#monthYear2").siblings(".error").text("Month & Year required");
    //     isValid = false;
    // }
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
    if (inputIGST === "") {
        $("#numIgst").addClass("is-invalid");
        $("#numIgst").siblings(".error").text("IGST Required");
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
    formData.append("AttendaceId", AttendaceId);
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
    formData.append("InputIgst", Number(inputIGST) );
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

            AttendaceId = 0;
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
    let subTotal = basicAmount + adminCharge + liveryCharge;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    // Check IGST mode
    if ($("#flexCheckDefault").is(":checked")) {

        // IGST 18%
        igst = subTotal * 0.18;

        $("#numIgst").val(igst.toFixed(2));
        $("#numCgst").val("0.00");
        $("#numSgst").val("0.00");

    } else {

        // CGST 9% + SGST 9%
        cgst = subTotal * 0.09;
        sgst = subTotal * 0.09;

        $("#numCgst").val(cgst.toFixed(2));
        $("#numSgst").val(sgst.toFixed(2));
        $("#numIgst").val("0.00");
    }

    // Total
    let total = subTotal + cgst + sgst + igst;

    $("#numAdminCharge").val(adminCharge.toFixed(2));
    $("#numTotalAmount").val(total.toFixed(2));
}

