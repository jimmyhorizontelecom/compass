var Id = 0;
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

    initializeMonthYearPickerByClass("monthYearPicker");

    //Parent Dropdown
    bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptName", "Select Department Name");
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", "Select Agency Name"); 
   
    // Dependent Dropdown Billing Address on Department
    bindDependentDataToDdl("Dropdown","MBillingAddress_ddl",null,// ❗ no modal
        "ddlDeptName", "ddlBillingAddress", "Select Billing Address");
    // Dependent Dropdown Work Order on Agency 
    bindDependentDataToDdlToParent("Dropdown", "MWorkOrder_ddl", null,// ❗ no modal
        "ddlDeptName", "ddlAgencyName", null , "ddlWorkOrder","Select Work Order ");
     

    $(document).on('changeDate change', '.monthYearPicker', function () {

        // Agar specific element ka value lena ho
        let selectedValue = $(this).val();

        console.log("Selected MonthYear:", selectedValue);

        // Call your record function
        recordlist(selectedValue);
    });
   
});
var monthYear = $('.monthYearPicker').val();
//alert(monthYear);

//Get Record for A table 
async function recordlist(monthYearValue) {
   
    //let monthYear = $(".monthYearPicker").val();
    var filterData = {
        Id:0,
        AgencyId: 0,
        DeptId: 0,
        MonthYear: monthYearValue,
        CreatedBy: 0,
        UserRole: 39,

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
                    <a href="javascript:void(0);" class="view-file" data-file="${value.AttendanceCertificate}" data-folder="Attendance" title="View Attendance">
                         <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size:25px;"></i>
                    </a>
                </td>
                 <!-- Annexure File -->
                <td class="text-center">
                    <a href="javascript:void(0);" class="view-file" data-file="${value.AnnexureFile}" data-folder="Annexure" title="View Annexure">
                        <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size:25px;"></i>
                    </a>
                </td>
                 <!-- Agency Bill File -->
                <td class="text-center">
                    <a href="javascript:void(0);" class="view-file" data-file="${value.AgencyBillFile}" data-folder="AgencyBill" title="View Agency Bill">
                        <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size:25px;"></i>
                    </a>
                </td>
                 <td class="text-center">
                    <span data-id="${value.Id}" >
                       <i class="bi bi-pencil-square edit-test edit-icon" style="cursor:pointer;font-size:25px;"></i>
                    </span>
                </td>
                 
                 <td class="text-center" >
                    <span data-id="${value.Id}">
                    <i class="bi bi-trash text-danger delete-Records" style="cursor:pointer;font-size:25px;"></i>
                    </span>
                   </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon" style="cursor:pointer;font-size:25px;"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon" style="cursor:pointer;font-size:25px;"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-AgencyInvoiceEntry edit-icon" style="cursor:pointer;font-size:25px;"></i>
                    </span>
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
    let deptName = $("#ddlDeptName").val();
    let agencyName = $("#ddlAgencyName").val();
    let workOrderNo = $("#ddlWorkOrder").val();
    let billingAddress = $("#ddlBillingAddress").val();
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
    if (agencyName === "0" || agencyName === null) {
        $("#ddlAgencyName").addClass("is-invalid");
        $("#ddlAgencyName").siblings(".error").text("Agency Name is required.");
        isValid = false;
    }
    if (deptName === "0" || deptName === null) {
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

    if (billingAddress === "0" || billingAddress === null) {
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


    // Annexure File Required
    //if (files_Annexure.length === 0) {
    //    $("#inputAnnexureFileAttached").addClass("is-invalid");
    //    $("#inputAnnexureFileAttached").siblings(".error").text("Annexure file required");
    //    isValid = false;
    //}
    //else {

    //    if (!fileSizeValidation('inputAnnexureFileAttached', fileSize)) {
    //        isValid = false;
    //    }

    //    if (!fileExtensionValidation('inputAnnexureFileAttached', allowedExtensions)) {
    //        isValid = false;
    //    }
    //}


    // Group Bill File Required
    //if (files_GroupBill.length === 0) {
    //    $("#inputGroupBillFileAttached").addClass("is-invalid");
    //    $("#inputGroupBillFileAttached").siblings(".error").text("Group Bill file required");
    //    isValid = false;
    //}
    //else {

    //    if (!fileSizeValidation('inputGroupBillFileAttached', fileSize)) {
    //        isValid = false;
    //    }

    //    if (!fileExtensionValidation('inputGroupBillFileAttached', allowedExtensions)) {
    //        isValid = false;
    //    }
    //}

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

// View Uploaded pdf file conditions 
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




//Delete Records Message Box

//$(document).on('click', '.delete-Records', async function () {

//    //var row = $(this).closest('tr');
//    var row = $(this).closest('span');
//    Id = row.data('id');

//    var isConfirmed = await DeleteEditBox('Delete Record', 'Do you want to Delete Record?', 'question', Id);

//    if (isConfirmed) {
//        console.log('Edit');
//        // User clicked Yes
//        alert('Click on Yes');
//        await deleteAttendanceRecord(Id);

//    } else {
//        // User clicked Cancel
//        console.log('Edit cancelled');
//        alert('Click on No');
//    }
//});

// Delete Records Functions

// Delete Records Message Box
$(document).on('click', '.delete-Records', async function () {
    var row = $(this).closest('tr'); // get the table row
    var recordId = row.data('id');

    // Confirm deletion
    var isConfirmed = await DeleteEditBox('Delete Record', 'Do you want to delete this record?', 'question', recordId);

    if (isConfirmed) {
        await deleteAttendanceRecord(recordId, row);
    } else {
        toastr.info("Delete cancelled");
    }
});
// Delete Records Function
async function deleteAttendanceRecord(Id, row) {
    try {
        let data = {
            AttendaceId: Id,
            CancelRemarks: "Deleted by user"
        };

        let res = await acceptUpdate("Manpower", "Delete_DeptAttendanceRecord", data);

        if (res.success) {
            toastr.success(res.message);

            // Remove row from table
            if (row) {
                $(row).fadeOut(300, function () {
                    $(this).remove();
                });
            }

            // Optional: refresh table data
             recordlist();
        } else {
            toastr.error(res.message || "Delete failed");
        }
    } catch (err) {
        console.error("Delete error:", err);
        toastr.error("Delete failed due to server error");
    }
}


//async function deleteAttendanceRecord(Id, CancelRemarks = "Deleted by user") {
//    try {
//        // Call your backend API to delete the record
//        let data = {
//            AttendaceId: Id,
//            CancelRemarks: CancelRemarks
//        };

//        let res = await acceptUpdate("Manpower", "Delete_DeptAttendanceRecord", data);

//        if (res.success) {
//            toastr.success(res.message);
//            recordlist(); // Refresh the table
//        } else {
//            toastr.error(res.message || "Delete failed");
//        }
//    } catch (err) {
//        console.error("Delete error:", err);
//        toastr.error("Delete failed due to server error");
//    }
//}



// Edit Records
$(document).on('click', '.edit-AgencyInvoiceEntry', async function () {

    var row = $(this).closest('tr');
    Id = row.data('id');

    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question', Id);

    if (isConfirmed) {
        console.log('Edit');
        // User clicked Yes
        await loadRecordById(row);
        openModal('myModal_AgencyInvoiceEntry');
        // $('#myModal').modal('show');
    } else {
        // User clicked Cancel
        console.log('Edit cancelled');
    }
});
// get Record to fill
async function loadRecordById(row) {

    var filterData = {
        Id: row.data('id'),
        AgencyId: 0,
        DeptId: 123,
        MonthYear: '102025',
        CreatedBy: 0,
        UserRole: 39,
    };

    try {

        let records = await getRecords('Manpower', 'GetDeptAttendanceRecord', filterData, '#myTable', 'N');

        if (records && records.length > 0) {

            let data = records[0];
            Id = data.Id;

            $("#ddlPurchaseBillDate").val(data.MonthYear);
            bindDataToDdl("Dropdown", "MAgency_ddl", "myModal_AgencyInvoiceEntry", "ddlPurchaseBillDate", " Month Year", /*data.AgencyId,*/ 0);
            var option = new Option(data.MonthYear, data.MonthYear, true, true);
            $('#ddlPurchaseBillDate').append(option).trigger('change');

            bindDataToDdl("Dropdown", "MAgency_ddl", "myModal_AgencyInvoiceEntry", "ddlWorkOrderNo1", " Work Order No", data.AgencyId, 0);
             option = new Option(data.WorkOrderId,/* data.WorkOrderId,*/ true, true);
            $('#ddlWorkOrderNo1').append(option).trigger('change');

            bindDataToDdl("Dropdown", "MAgency_ddl", "myModal_AgencyInvoiceEntry", "ddlAgencyName1", " Agency Name", data.AgencyId, 0);
             option = new Option(data.AgencyName, data.AgencyId, true, true);
            $('#ddlAgencyName1').append(option).trigger('change');
            alert(data.AgencyName);

            bindDataToDdl("Dropdown", "MDepartment_ddl", "myModal_AgencyInvoiceEntry", "ddlDeptName1", " Department Name", data.DeptId, 0);
            option = new Option(data.departmentName, data.DeptId, true, true);
            $('#ddlDeptName1').append(option).trigger('change');
            alert(data.departmentName);

            

            //$("#txtWorkOrderNo").val(data.WorkOrderId);
            //$("#txtAgencyBillNo").val(data.PurhaseInvNO);
            //$("#txtAgencyName").val(data.AgencyName);
            //$("#txtDeptName").val(data.departmentName);
            alert('test');

           
            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}


