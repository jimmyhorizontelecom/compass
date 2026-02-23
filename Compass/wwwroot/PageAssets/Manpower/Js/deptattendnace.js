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
    //Parent Dropdown
    bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptName", " Department Name");
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", " Agency Name"); 
    //Sample ddl
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlMonthYear", " Agency Name");   
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlWorkOrder", " Agency Name");   


    // Dependent Dropdown
    bindDependentDataToDdl("Dropdown","MBillingAddress_ddl",null,// ❗ no modal
            "ddlDeptName","ddlBillingAddress","Select Billing Address");
   
});

//Get Record for A table 
async function recordlist() {

    var filterData = {
        Id:0,
        AgencyId: 0,
        DeptId: 123,
        MonthYear: '102025',
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

        tbody.append(`
            <tr 
                data-id="${value.Id}"
                <td>${value.Id}</td>
                <td>${SrNo}</td>
                <td>${value.departmentName}</td>
                <td>${value.AgencyName}</td>
                <td>${value.WorkOrderId} <br> ${value.PurhaseInvNO}</td>
                <td>${value.DeployedResource}</td>
                <td>${value.UpladNoOfResource}</td>
                <td>${value.MonthYear}</td>
                
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon"></i>
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
    let monthYear = $("#ddlMonthYear").val();
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

    if (monthYear === "0") {
        $("#ddlMonthYear").addClass("is-invalid");
        $("#ddlMonthYear").siblings(".error").text("Month & Year required");
        isValid = false;
    }
    if (agencyName === "0") {
        $("#ddlAgencyName").addClass("is-invalid");
        $("#ddlAgencyName").siblings(".error").text("Agency Name is required.");
        isValid = false;
    }
    if (deptName === "0") {
        $("#ddlDeptName").addClass("is-invalid");
        $("#ddlDeptName").siblings(".error").text("Department Name is required.");
        isValid = false;
    }

    if (workOrderNo === "0") {
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
    if (!isValid) return;
    //File validation
    // Prepare data
    var fileSize = 1
    var isValid1 = fileSizeValidation('inputAttendanceFileAttached', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        return;
    }
    let allowedExtensions = ["pdf"];

    isValid1 = fileExtensionValidation('inputAttendanceFileAttached', allowedExtensions)
    if (!isValid1) {
        MsgBox('Message', "File should be only " + allowedExtensions + '.');
        return;
    }
    /*var newFileName = getNewFileName('inputAttendanceFileAttached', "Attendance")*/
    //var formData = new FormData();
    //alert(newFileName);
    
    //if (files_Attendance.length > 0) {
    //    formData.append("attachmentFile1", files_Attendance[0], newFileName);  // EXACT match
    //}

    // Prepare data
    //var formData = new FormData();
    //formData.append("MonthYear", monthYear);
    //formData.append("WorkOrderNo", workOrderNo);
    //formData.append("UpladNoOfResource", noOfResources);
    //if (files_Attendance.length > 0) {
    //    formData.append("AttendanceFile", files_Attendance[0]);
    //}

    //if (files_Annexure.length > 0) {
    //    formData.append("AnnexureFile", files_Annexure[0]);
    //}

    //if (files_GroupBill.length > 0) {
    //    formData.append("AgencyBillFile", files_GroupBill[0]);
    //}

    var formData = new FormData();
    formData.append("MonthYear", monthYear);
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
            //resetModal();
            resetFilterPanel();
            Id = 0;
            $('.modelalert').text(res.message);
            closeModal('myModal');
            MsgBox('Message', res.message, '');
        }

    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }

}

//Edit Record From Table
$(document).on('click', '.edit-test', async function () {

    var row = $(this).closest('tr');
    Id = row.data('id');

    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question', Id);

    if (isConfirmed) {
        console.log('Edit');
        // User clicked Yes
        await loadRecordById(row);
        openModal('myModal');
        // $('#myModal').modal('show');
    } else {
        // User clicked Cancel
        console.log('Edit cancelled');
    }
});



