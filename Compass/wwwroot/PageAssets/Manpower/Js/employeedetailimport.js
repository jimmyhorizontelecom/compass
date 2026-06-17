
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
    alert('Loading Employee Details Import');
    recordlist();

    //bind ddl to filter
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyFilter", " Agency Name");
    bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptFilter", " Department Name");
    // bind ddl on two parentId
    bindDependentDataToDdlToParent("Dropdown", "MEmpImportWorkOrder_ddl", null,// ❗ no modal
        "ddlAgencyFilter", "ddlDeptFilter", null, "ddlWorkOrder", "Select Work Order ");

    // load data when changes on ddl
    // $("#ddlAgencyFilter, #ddlDeptFilter").change(function () {
    //     recordlist();
    // });

});

//Get No. of Resources when click on Work Order DDL
$('#ddlWorkOrder')
    .on('select2:select', function (e) {
        $('#txtNoofResources').val(e.params.data.noDeployedRes || 0);
    })
    .on('select2:clear', function () {
        $('#txtNoofResources').val('');
    });


// Open Add Employee Details Model
$(".btnAddEmployeeDetails").on("click", function () {
    openModal('myModal_AddEmployee');
});

// Submit Add Employee Details
$(".btnModalAddEmpSubmit").on("click", function () {
    alert('Add Employee Button Work Succeed');
});

//Get Record for A table
async function recordlist() {
    var agencyId = parseInt($("#ddlAgencyFilter").val()) || 0;
    var deptId = parseInt($("#ddlDeptFilter").val()) || 0;
    var filterData = {
         Id: 0,
        AgencyId: deptId,//3,
        DeptId: deptId,//56,
        WorkOrderId: 0,
        //CreatedBy: 123,
       // UserRole: 39,
    };

    try {

        let records = await getRecords('Manpower', 'GetEmpDetailRecord1', filterData, '#myTable', 'N');
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
                data-id="${value.Id}">
                <td>${SrNo}</td>
                <td>${value.EmpName}</td>
                <td>${value.FathersName}</td>
                <td>${value.IsFullTimer}</td>
                <td>${value.DesignationId}</td>
                <td>${value.AdhaarNo}</td>
                <td>${value.BasicSalary}</td>
                <td>${value.OtherAllowance}</td>
                <td>${value.IsEPF}</td>
                <td>${value.IsESIC}</td>
                <td class="text-center">
                     <button type="button"  class="btn btn-link text-danger btnRemoveRow" title="Remove"> ✖  </button>
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

//Download Designation Code Excel Sheet
$(document).on('click', '.btnDownloadDesignationSheet', function () {
    window.location.href = '/Manpower/DownloadDesignationCode';
});

//Download Temnplates for Upload Excel files
$(document).on('click', '.btnDownloadTemplate', function () {
    window.location.href = '/Manpower/DownloadTemplate';
});

//Remove Employee Details from Table
$(document).on('click', '.btnRemoveRow', function () {
    $(this).closest('tr').remove();
});


// Submit record when Click on btn
$(".btnEmpImportSubmit").on("click", function () {
    alert('Submitting data');
    SubmitRecord();
});


async function SubmitRecord() {
    let isValid = true;
    // Form Values
    let agencyId = $("#ddlAgencyFilter").val();
    let deptId = $("#ddlDeptFilter").val();
    let workOrderNo = $("#ddlWorkOrder").val();
    let noOfResources = $("#txtNoofResources").val().trim();
    // File Control
    let Attendance = $("#inputAttendanceFileAttached").get(0);
    let files_Attendance = Attendance ? Attendance.files : [];
    // Reset Validation
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    // Validation
    if (agencyId === "0" || agencyId === null) {
        $("#ddlAgencyFilter").addClass("is-invalid");
        $("#ddlAgencyFilter").siblings(".error").text("Agency Name required");
        isValid = false;
    }
    if (deptId === "0" || deptId === null) {
        $("#ddlDeptFilter").addClass("is-invalid");
        $("#ddlDeptFilter").siblings(".error").text("Department Name required");
        isValid = false;
    }
    if (workOrderNo === "0" || workOrderNo === null) {
        $("#ddlWorkOrder").addClass("is-invalid");
        $("#ddlWorkOrder").siblings(".error").text("Work Order required");
        isValid = false;
    }
    if (noOfResources === "") {
        $("#txtNoofResources").addClass("is-invalid");
        $("#txtNoofResources").siblings(".error").text("No Of Resources required");
        isValid = false;
    }
    // File Validation
    let fileSize = 5;
    let allowedExtensions = ["pdf"];
    //Upload Excel File Validation
    if (files_Attendance.length === 0) {
        $("#inputUploadEmpImportFileAttached").addClass("is-invalid");
        $("#inputUploadEmpImportFileAttached")
            .closest(".col-md-3")
            .find(".error")
            .text("Employee Import Details Excel Scheet required");
        isValid = false;
    }
    else {
        if (!fileSizeValidation('inputUploadEmpImportFileAttached', fileSize)) {
            isValid = false;
        }
        if (!fileExtensionValidation('inputUploadEmpImportFileAttached', allowedExtensions)) {
            isValid = false;
        }
    }
    // Stop If vaklidation failed
    if (!isValid) {
        return;
    }
    // Form Data
    var formData = new FormData();
    formData.append("MonthYear", finalMonthId);
    formData.append("WorkOrderNo", workOrderNo);
    formData.append("UpladNoOfResource", noOfResources);
    formData.append("PresentResource", presentResources);
     // Employee List
    // let employees = [];
    // let checkedEmployees = $(".rowCheckbox:checked");

    // if (checkedEmployees.length == 0) {

    //     MsgBox('Error', 'Please select at least one employee', '');
    //     return;
    // }

    // checkedEmployees.each(function () {
    //     employees.push({
    //         EmpId: parseInt($(this).val())
    //     });
    // });
    // formData.append("EmployeeListJson", JSON.stringify(employees));

    // Uplaod Emp Import Excel File
    if (files_Attendance.length > 0) {
        formData.append("AttendanceFile", files_Attendance[0]);
    }
    // Submit Data
    try {
        let res = await acceptUpdate("Manpower", "AddOrEdit_DeptAttendanceRecord1", formData);
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