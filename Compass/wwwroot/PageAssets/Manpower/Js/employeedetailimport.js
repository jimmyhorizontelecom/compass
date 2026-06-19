
var Id = 0;
var employeeRecords = [];
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
    //recordlist();

    //bind ddl to filter
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyFilter", " Agency Name");
    bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptFilter", " Department Name");
    // bind ddl on two parentId
    bindDependentDataToDdlToParent("Dropdown", "MEmpImportWorkOrder_ddl", null,// ❗ no modal
        "ddlAgencyFilter", "ddlDeptFilter", null, "ddlWorkOrder", "Select Work Order ");


    //bind ddl in the Model
    bindDataToDdl("Dropdown", "MAgency_ddl", "myModal_AddEmployee", "ddlAgencyName", " Agency Name");
    bindDataToDdl("Dropdown", "MDepartment_ddl", "myModal_AddEmployee", "ddlDeptName", " Department Name");
    // bind ddl on two parentId
    bindDependentDataToDdlToParent("Dropdown", "MEmpImportWorkOrder_ddl", "myModal_AddEmployee",// ❗ no modal
        "ddlAgencyName", "ddlDeptName", null, "ddlWorkOrder1", "Select Work Order ");
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



//Download Designation Code Excel Sheet
$(document).on('click', '.btnDownloadDesignationSheet', function () {
    window.location.href = '/Manpower/DownloadDesignationCode';
    //window.location.href = '/Manpower/DownloadFormat';
});

//Download Temnplates for Upload Excel files
$(document).on('click', '.btnDownloadTemplate', function () {
    window.location.href = '/Manpower/DownloadTemplate';
});
//Click event on View Uploaded excel file
$(document).on('click', '.btnViewFile', function () {
     readExcelRecord();
});

// Read Excel and Bind Record 
async function readExcelRecord() {
    //alert("Function Called");
    let file = $("#inputUploadEmpImportFileAttached")[0].files[0];
    console.log(file);
    if (!file) {
        alert("Please select excel file.");
        return;
    }
    let formData = new FormData();
    formData.append("file", file);
    try {
        let records = await uploadExcelFile('Manpower', 'ReadExcel', formData);
        employeeRecords = records;
        bindDatatable(records, '#myTable');
    }
    catch (error) {
        console.error("Error loading records:", error);
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
                <td>${value.DesigationId}</td>
                <td>${value.AADHARNO}</td>
                <td>${value.Basics}</td>
                <td>${value.Others}</td>
                <td>${value.IsPF}</td>
                <td>${value.IsESI}</td>
                 <td class="${value.VerificationStatus === 'Green' ? 'text-success fw-bold' : 'text-danger fw-bold'}">
                    ${value.VerificationStatus}
                </td>
                <td>${value.Error_Message ?? ''}</td>
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

//Remove Employee Details from Table
$(document).on('click', '.btnRemoveRow', function () {
    $(this).closest('tr').remove();
});
//Clcik event on View Uploaded excel file
// $(document).on('click', '.btnViewFile', function () {
//     readExcelRecord();
// });
//Click event on Verify Button after Uplaod Excel file
$(".btnVerifyFile").on("click", function () {
    alert('Verify');
    verifyEmployeeImport();
});
//Get records after Verify Data from Table 
async function verifyEmployeeImport() {
    if (employeeRecords.length == 0) {
        MsgBox('Error', 'Please view excel first.', '');
        return;
    }
    console.log(employeeRecords);
    employeeRecords.forEach(item => {
        item.DeptId = parseInt($("#ddlDeptFilter").val()) || 0;
        item.AgencyId = parseInt($("#ddlAgencyFilter").val()) || 0;
        item.WorkOrderNo = $("#ddlWorkOrder").val() || "";
        item.TotalManpower = parseInt($("#txtNoofResources").val()) || 0;

    });
    console.log(JSON.stringify(employeeRecords));
    alert(JSON.stringify(employeeRecords))
    try {

        let result = await acceptUpdateMultiJData( 'Manpower', 'VerifyEmployeeImport', employeeRecords );
        bindDatatable(result, '#myTable');

    }
    catch (error) {

        console.error(error);

        MsgBox('Error', 'Verification failed.', '');
    }
}
// Submit record when Click on btn
$(".btnSubmitTableData").on("click", function () {
    if (confirm("Are you sure you want to upload these records?")) {
       submitEmployeeImport();
    }
});

// Submit Employee Import
async function submitEmployeeImport() {

    if (employeeRecords.length == 0) {
        MsgBox('Error', 'No records found for upload.', '');
        return;
    }

    try {

        let result = await acceptUpdateMultiJData(
            'Manpower',
            'SubmitEmployeeImport',
            employeeRecords
        );

        MsgBox('Success', 'Records uploaded successfully.', '');

    }
    catch (error) {

        console.error(error);
        MsgBox('Error', 'Upload failed.', '');

    }
}