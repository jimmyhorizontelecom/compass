var EmpId = 0;
var WorkOrderId = 0;
//common
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-center-center",
    timeOut: "3000"
};
//ready
$(document).ready(function () {
    alert('Employee Details List');
    resetModal();
    recordlist();
    //bind ddl to filter
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyFilter", " Select Agency");
    //bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptFilter", " Department Name");
    bindDependentDataToDdl("Dropdown", "MDepartment_ddl", "",//❗ With/Without modal
        "ddlAgencyFilter", "ddlDeptFilter", "Select Department");

    bindDependentDataToDdlToParent("Dropdown", "MWorkOrder_ddl", null,// ❗ no modal
        "ddlAgencyFilter", "ddlDeptFilter", null, "ddlWorkOrderFilter", "Select Work Order ");

    //bind ddl to modal
    //bindDataToDdl("Dropdown", "MAgency_ddl", "myModal_EditEmployee", "ddlAgencyName", " Agency Name");
    //bindDataToDdl("Dropdown", "MDepartment_ddl", "myModal_EditEmployee", "ddlDeptName", " Department Name");
    // bindDependentDataToDdl("Dropdown", "MAddWorkOrderBillingAddress_ddl", "myModal",//❗ With/Without modal
    //     "ddlDeptName", "ddlBillingAddress", "Select Billing Address");
    //Reload table when change
    $(document).on('change', '#ddlAgencyFilter,#ddlDeptFilter', function () {
        recordlist();
        console.log("After Changing Table Refresh");
    });
});

//Get Record for A table 
async function recordlist() {
    var agencyId = parseInt($("#ddlAgencyFilter").val()) || 0;
    var deptId = parseInt($("#ddlDeptFilter").val()) || 0;
    var workOrderId = parseInt($("#ddlWorkOrderFilter").val()) || 0;
    var searchTerm ; 
    var filterData = {
        AgencyId: agencyId,
        DeptId: deptId,
        WorkOrderId: workOrderId,
        searchTerm:"",
        //IsActive: workOrderId,
     };
    console.log(filterData);
    try {
        let records = await getRecords('Manpower', 'GetEmployeeDetailsRecord', filterData, '#myTable', 'N');
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
        //alert(JSON.stringify(records));
        tbody.append(`
            <tr style="vertical-align: middle; "
                data-empid="${value.EmpId}">            
                <td>${SrNo}</td>
                <td>${value.AgencyName}</td>
                <td>${value.DepartmentName}</td>
                <td>${value.EmpName}</td> 
                <td>${value.FathersName}</td>
                <td>${value.Desigation}</td>
                <td>${value.AADHARNO}</td>
                <td class="text-center">${value.Basics}</td>
                <td class="text-center">${value.IsEPF}</td>
                <td class="text-center">${value.IsESIC}</td>
                 <td class="text-center">
                       <i class="bi bi-pencil-square edit-empDetails edit-icon" data-empid="${value.EmpId}" style="cursor:pointer;font-size:30px;"></i>
                </td>
                 <td class="text-center">
                      <i class="bi bi-person-x-fill remove-employee delete-empDetails text-danger" data-empid="${value.EmpId}" style="cursor:pointer;font-size:30px;"></i>
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
    //hideModalLoader();
}

// MsgBox on Edit Employee Details
$(document).on('click', '.edit-empDetails', async function () {
    EmpId = $(this).data("empid");
    alert(EmpId);
    console.log("Edit Record Id:", EmpId);
    if (!EmpId) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question');
    if (isConfirmed) {
        resetModal();
        await loadEditEmpDetails(EmpId);
        openModal('myModal_EditEmployee');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');
    } else {
        console.log('Edit cancelled');
    }
});

// get Record to fill Employee details data in Edit Modal
async function loadEditEmpDetails(EmpId) {
    // alert('Load Record function')
    var filterData = {
        EmpId: EmpId,      
    };
   try {
        let records = await getRecords('Manpower', 'GetEditEmpDetails', filterData, '', 'N');
        if (records && records.length > 0) {
            let data = records[0];
            alert(JSON.stringify(data));
            $("#txtEmpName").val(data.EmpName);
            $("#txtFathersName").val(data.FathersName);
            // $("#numMobileNo").val(data.);
            // $("#txtEmailId").val(data.);
            $("#numMobileNo").val(data.ContactNo);
            $("#txtEmailId").val(data.EmailId);
            $("#numAdhaarNo").val(data.AADHARNO);
            //$("#numBankACNo").val(data.);
            $("#numBasicSalary").val(parseFloat(data.Basics).toFixed(2));
            //EPF
            if (data.IsEPF === "Y") {
                $("#chkEPF").prop("checked", true);
                $("#numEpf").val(parseFloat(data.EpfAmt).toFixed(2));
            } else {
                $("#chkEPF").prop("checked", false);
                $("#numEpf").val("");
            }
            //IsFullTime
            if (data.IsFullTime === "Y") {
                $("#chkFullTimeEmp").prop("checked", true);
            } else {
                $("#chkFullTimeEmp").prop("checked", false);
            }
            // ESIC
            if (data.IsESIC === "Y") {
                $("#chkESIC").prop("checked", true);
                $("#numEsic").val(parseFloat(data.EsicAmt).toFixed(2));
            } else {
                $("#chkESIC").prop("checked", false);
                $("#numEsic").val("");
            }
            $("#numAllowance").val(parseFloat(data.OthersAllowance).toFixed(2));
            var basic = parseFloat($("#numBasicSalary").val()) || 0;
            var esi = parseFloat($("#numEsic").val()) || 0;
            var epf = parseFloat($("#numEpf").val()) || 0;
            var allowance = parseFloat($("#numAllowance").val()) || 0;
            var total = basic + esi + epf + allowance;
            $("#numTotalAmt").val(total.toFixed(2));
            bindDataToDdl("Dropdown", "MDesignation_ddl", "myModal_EditEmployee", "ddlDesignation", " Select Designation");
            var option = new Option(data.DesignationName, data.DesignationId, true, true);
            $('#ddlDesignation').append(option).trigger('change');
            bindDataToDdl("Dropdown", "MDesignation_ddl", "myModal_EditEmployee", "ddlEducation", " Select Designation");
            var option = new Option(data.DesignationName, data.DesignationId, true, true);
            $('#ddlEducation').append(option).trigger('change');
            // bindDataToDdl("Dropdown", "MEducational_ddl", "myModal_EditEmployee", "ddlEducation", " Select Designation");
            // var option = new Option(data.EducationName, data.EducationId, true, true);
            // $('#ddlEducation').append(option).trigger('change');       
            // bindDataToDdl("Dropdown", "MEducational_ddl", "myModal_EditEmployee", "ddlEducation", " Select Education", data.EducationID, 0);
            // var option = new Option(data.EducationID, data.EducationName, true, true);
            // $('#ddlEducation').append(option).trigger('change');
         }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}

function CalculateTotal() {
    var basic = parseFloat($("#numBasicSalary").val()) || 0;
    var epf = parseFloat($("#numEpf").val()) || 0;
    var esic = parseFloat($("#numEsic").val()) || 0;
    var allowance = parseFloat($("#numAllowance").val()) || 0;
    var total = basic + epf + esic + allowance;
    $("#numTotalAmt").val(total.toFixed(2));
}
$("#numBasicSalary, #numEpf, #numEsic, #numAllowance").on("input", function () {
    CalculateTotal();
});

// Submit Update Employee Details Data
$(".btnModalEditEmpSubmit").on("click", function () {
     SubmitRecord();
});

async function SubmitRecord() {
    console.log("Global EmpId:", EmpId);
    let isValid = true;
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
    if (empName === "") {
        $("#txtEmpName").addClass("is-invalid");
        $("#txtEmpName").siblings(".error").text("Employee name required.");
        isValid = false;
    }
    if(fatherName === "") {
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
        alert("Please select Full Time Employee.");
        $("#chkFullTimeEmp").siblings(".error").text("Please Select Full Time Empoyee");
        return;
    }
    if (contactNo === "") {
        $("#numMobileNo").addClass("is-invalid");
        $("#numMobileNo").siblings(".error").text("Mobile No. required");
        isValid = false;
    }
    if (desigationId === "0" || desigationId === null){
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
        alert("Please select Full Time Employee.");
        $("#chkEPF").siblings(".error").text("Please checked IsEpf?");
        return;
    }
    if (!$("#chkESIC").is(":checked")) {
        alert("Please select Full Time Employee.");
        $("#chkESIC").siblings(".error").text("Please checked IsESIC?");
        return;
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
             recordlist();
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


// MsgBox on Delete Employee Details
$(document).on('click', '.delete-empDetails', async function () {
    EmpId = $(this).data("empid");
    //alert(EmpId);
    console.log("Edit Record Id:", EmpId);
    if (!EmpId) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to delete Record?', 'question');
    if (isConfirmed) {
        resetModal();
        await loadDeleteEmpDetails(EmpId);
        openModal('myModal_DeleteEmployee');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');
    } else {
        console.log('Edit cancelled');
    }
});
// get Record to fill Employee details data in Delete Modal
async function loadDeleteEmpDetails(EmpId) {
    // alert('Load Record function')
    var filterData = {
        EmpId: EmpId,
    };
    try {
        let records = await getRecords('Manpower', 'GetEditEmpDetails', filterData, '', 'N');
        if (records && records.length > 0) {
            let data = records[0];
            alert(JSON.stringify(data));
            $("#txtEmpName1").val(data.EmpName);
            $("#txtFathersName1").val(data.FathersName);
            // $("#numMobileNo").val(data.);
            // $("#txtEmailId").val(data.);
            $("#numMobileNo1").val(data.ContactNo);
            $("#txtEmailId1").val(data.EmailId);
            $("#numAdhaarNo1").val(data.AADHARNO);
            //$("#numBankACNo").val(data.);
            $("#numBasicSalary1").val(parseFloat(data.Basics).toFixed(2));
            //EPF
            if (data.IsEPF === "Y") {
                $("#chkEPF1").prop("checked", true);
              //  $("#numEpf1").val(parseFloat(data.EpfAmt).toFixed(2));
            } else {
                $("#chkEPF1").prop("checked", false);
                //$("#numEpf1").val("");
            }
            //IsFullTime
            if (data.IsFullTime === "Y") {
                $("#chkFullTimeEmp1").prop("checked", true);
            } else {
                $("#chkFullTimeEmp1").prop("checked", false);
            }
            // ESIC
            if (data.IsESIC === "Y") {
                $("#chkESIC1").prop("checked", true);
                //$("#numEsic").val(parseFloat(data.EsicAmt).toFixed(2));
            } else {
                $("#chkESIC1").prop("checked", false);
                //$("#numEsic").val("");
            }
            $("#numAllowance1").val(parseFloat(data.OthersAllowance).toFixed(2));
            var basic1 = parseFloat($("#numBasicSalary1").val()) || 0;
            var esi1 = parseFloat($("#numEsic1").val()) || 0;
            var epf1 = parseFloat($("#numEpf1").val()) || 0;
            var allowance1 = parseFloat($("#numAllowance1").val()) || 0;
            var total1 = basic1 + esi1 + epf1 + allowance1;
            $("#numTotalAmt1").val(total1.toFixed(2));
            bindDataToDdl("Dropdown", "MDesignation_ddl", "myModal_EditEmployee", "ddlDesignation1", " Select Designation");
            var option = new Option(data.DesignationName, data.DesignationId, true, true);
            $('#ddlDesignation1').append(option).trigger('change');
            bindDataToDdl("Dropdown", "MDesignation_ddl", "myModal_EditEmployee", "ddlEducation1", " Select Designation");
            var option = new Option(data.DesignationName, data.DesignationId, true, true);
            $('#ddlEducation1').append(option).trigger('change');
            // bindDataToDdl("Dropdown", "MEducational_ddl", "myModal_EditEmployee", "ddlEducation", " Select Designation");
            // var option = new Option(data.EducationName, data.EducationId, true, true);
            // $('#ddlEducation').append(option).trigger('change');       
            // bindDataToDdl("Dropdown", "MEducational_ddl", "myModal_EditEmployee", "ddlEducation", " Select Education", data.EducationID, 0);
            // var option = new Option(data.EducationID, data.EducationName, true, true);
            // $('#ddlEducation').append(option).trigger('change');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}

// Submit Delete Employee Details Data
$(".btnModalDeleteEmpSubmit").on("click", function () {
    SubmitRecord();
});