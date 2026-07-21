var EmpId = 0;
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
    bindDependentDataToDdlToParent("Dropdown", "MWorkOrder_ddl", null,// ❗ no modal
        "ddlDeptFilter", "ddlAgencyFilter", null, "ddlWorkOrderFilter", "Select Work Order ");

    //bind ddl in the Model
    bindDataToDdl("Dropdown", "MAgency_ddl", "myModal_AddEmployee", "ddlAgencyName", " Agency Name");
    bindDataToDdl("Dropdown", "MDepartment_ddl", "myModal_AddEmployee", "ddlDeptName", " Department Name");
    // bind ddl on two parentId
    bindDependentDataToDdlToParent("Dropdown", "MWorkOrder_ddl", "myModal_AddEmployee",// ❗ no modal
        "ddlDeptName", "ddlAgencyName", null, "ddlWorkOrder", "Select Work Order ");
    bindDataToDdl("Dropdown", "MDesignation_ddl", "", "ddlDesignation", " Select Designation");
    bindDataToDdl("Dropdown", "MDesignation_ddl", "", "ddlEducation", " Select Education");

    // load data when changes on ddl
    // $("#ddlAgencyFilter, #ddlDeptFilter").change(function () {
    //     recordlist();
    // });

});

//Get No. of Resources when click on Work Order DDL
$('#ddlWorkOrderFilter')
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

function CalculateTotal() {
    const basicSalary = parseInt($("#numBasicSalary").val()) || 0;
    const allowance = parseInt($("#numAllowance").val()) || 0;
    const isEPF = $("#chkEPF").is(":checked");
    const isESIC = $("#chkESIC").is(":checked");
    // EPF = 13%
    const epf = isEPF ? (basicSalary * 13 / 100) : 0;
    // ESIC = 3.25%
    const esic = isESIC ? (basicSalary * 3.25 / 100) : 0;
    const totalAmount = basicSalary + allowance + epf + esic;
    // Show calculated values
    $("#numEpf").val(epf.toFixed(2));
    $("#numEsic").val(esic.toFixed(2));
    $("#numTotalAmt").val(totalAmount.toFixed(2));
}
$("#numBasicSalary, #numEpf, #numEsic, #numAllowance").on("input", function () {
    CalculateTotal();
});
// Submit Add Employee Details
$(".btnModalAddEmpSubmit").on("click", function () {
    alert('Add Employee Button Work Succeed');
    SubmitRecord();
});

async function SubmitRecord() {
    alert(EmpId);
    console.log("Global EmpId:", EmpId);
    let isValid = true;
    let agencyId = $("#ddlAgencyName").val();
    let agencyName = $("#ddlAgencyName option:selected").text();
    let deptId = $("#ddlDeptName").val();
    let deptName = $("#ddlDeptName option:selected").text();
    let workOrderId = $("#ddlWorkOrder").val();
    let workOrder = $("#ddlDeptName option:selected").text();
    let empName = $("#txtEmpName").val().trim();
    let fatherName = $("#txtFathersName").val().trim();
    let email = $("#txtEmailId").val().trim();
    let contactNo = $("#numMobileNo").val().trim();
    let isFullTime = $("#chkFullTimeEmp").is(":checked") ? "Y" : "N";
    let desigationId = $("#ddlDesignation").val();
    let desigation = $("#ddlDesignation option:selected").text();
    let educationId = $("#ddlEducation").val();
    let education = $("#ddlEducation option:selected").text();
    let aadharNo = $("#numAdhaarNo").val();
    let basicSalary = $("#numBasicSalary").val();
    let othersAllowance = $("#numAllowance").val();
    let isPf = $("#chkEPF").is(":checked") ? "Y" : "N";
    let isEsi = $("#chkESIC").is(":checked") ? "Y" : "N";
    let acNo = $("#numBankACNo").val().trim();
    let ifsc = $("#txtIfscCode").val().trim();
    let uanNo = $("#numUanNo").val().trim();
    let esicNo = $("#numEsiNo").val().trim();
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    if (agencyId === "0" || agencyId === null) {
        $("#ddlAgencyName").addClass("is-invalid");
        $("#ddlAgencyName").siblings(".error").text("Select Agency.");
        isValid = false;
    }
    if (deptId === "0" || deptId === null) {
        $("#ddlDeptName").addClass("is-invalid");
        $("#ddlDeptName").siblings(".error").text("Select Department.");
        isValid = false;
    }
    if (workOrderId === "0" || workOrderId === null) {
        $("#ddlWorkOrder").addClass("is-invalid");
        $("#ddlWorkOrder").siblings(".error").text("Select Work Order.");
        isValid = false;
    }
    if (empName === "") {
        $("#txtEmpName").addClass("is-invalid");
        $("#txtEmpName").siblings(".error").text("Employee name required.");
        isValid = false;
    }
    if (fatherName === "") {
        $("#txtFathersName").addClass("is-invalid");
        $("#txtFathersName").siblings(".error").text("Father's/Husband name required.");
        isValid = false;
    }
    if (email === "") {
        $("#txtEmailId").addClass("is-invalid");
        $("#txtEmailId").siblings(".error").text("EmailId required");
        isValid = false;
    }
    if (contactNo === "") {
        $("#numMobileNo").addClass("is-invalid");
        $("#numMobileNo").siblings(".error").text("Mobile No. required");
        isValid = false;
    }
    if (!$("#chkFullTimeEmp").is(":checked")) {
        //alert("Please select Full Time Employee.");
        $("#chkFullTimeEmp").siblings(".error").text("Please Select Full Time Empoyee");
        isValid = false;
    }
    if (contactNo === "") {
        $("#numMobileNo").addClass("is-invalid");
        $("#numMobileNo").siblings(".error").text("Mobile No. required");
        isValid = false;
    }
    if (desigationId === "0" || desigationId === null) {
        $("#ddlDesignation").addClass("is-invalid");
        $("#ddlDesignation").siblings(".error").text("Select Designation.");
        isValid = false;
    }
    if (educationId === "0" || educationId === null) {
        $("#ddlEducation").addClass("is-invalid");
        $("#ddlEducation").siblings(".error").text("Select Education.");
        isValid = false;
    }
    if (aadharNo === "") {
        $("#numAdhaarNo").addClass("is-invalid");
        $("#numAdhaarNo").siblings(".error").text("Aadhar No. required.");
        isValid = false;
    }
    if (basicSalary === "") {
        $("#numBasicSalary").addClass("is-invalid");
        $("#numBasicSalary").siblings(".error").text("Basic Salary required.");
        isValid = false;
    }
    if (othersAllowance === "") {
        $("#numAllowance").addClass("is-invalid");
        $("#numAllowance").siblings(".error").text("Allowance required.");
        isValid = false;
    }
    if (!$("#chkEPF").is(":checked")) {
        //alert("Please select Full Time Employee.");
        $("#chkEPF").siblings(".error").text("Please checked IsEpf?");
        isValid = false;
    }
    if (!$("#chkESIC").is(":checked")) {
        //alert("Please select Full Time Employee.");
        $("#chkESIC").siblings(".error").text("Please checked IsESIC?");
        isValid = false;
    }
    if (acNo === "") {
        $("#numBankACNo").addClass("is-invalid");
        $("#numBankACNo").siblings(".error").text("Bank A/C No. required.");
        isValid = false;
    }
    if (ifsc === "") {
        $("#txtIfscCode").addClass("is-invalid");
        $("#txtIfscCode").siblings(".error").text("Bank IFSC required.");
        isValid = false;
    }
    if (uanNo === "") {
        $("#numUanNo").addClass("is-invalid");
        $("#numUanNo").siblings(".error").text("UAN No. required.");
        isValid = false;
    }
    if (esicNo === "") {
        $("#numEsiNo").addClass("is-invalid");
        $("#numEsiNo").siblings(".error").text("ESIC No. required.");
        isValid = false;
    }
    if (!isValid) return;
    //Prepare data
    var formData = new FormData();
    formData.append("EmpId", EmpId);
    formData.append("Empname", empName);
    formData.append("FatherName", fatherName);
    formData.append("Email", email);
    formData.append("ContactNo", contactNo);
    formData.append("IsFullTime", isFullTime);
    formData.append("DesigationId", desigationId);
    formData.append("EducationId", educationId);
    formData.append("AADHARNO", aadharNo);
    formData.append("BasicSalary", basicSalary);
    formData.append("OthersAllowance", othersAllowance);
    formData.append("IsPf", isPf);
    formData.append("IsEsi", isEsi);
    formData.append("AcNO", acNo);
    formData.append("Ifsc", ifsc);
    formData.append("UANNo", uanNo);
    formData.append("ESICNo", esicNo);

    try {
        //$("#ModalProgress").show();
        let res = await acceptUpdate("Manpower", "AddOrEditEmpDetailsRecord", formData);
        if (res.success) {
            //recordlist();
            resetModal();
            EmpId = 0;
            $('.modelalert').text(res.message);
            closeModal('myModal_EditEmployee');
            MsgBox('Message', res.message, '');
        }
    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }
}





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