
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
    // load data when changes on ddl
    // $("#ddlAgencyFilter, #ddlDeptFilter").change(function () {
    //     recordlist();
    // });
    // // initial load
    // setTimeout(() => recordlist(), 500);
    //bind ddl to modal
    bindDataToDdl("Dropdown", "MAgency_ddl", "myModal_AddEmployee", "ddlAgencyName", " Agency Name");
    bindDataToDdl("Dropdown", "MDepartment_ddl", "myModal_AddEmployee", "ddlDeptName", " Department Name");
    // bindDependentDataToDdl("Dropdown", "MBillingAddress_ddl", null,//❗ With/Without modal
    //   "ddlDeptName", "ddlBillingAddress", "Select Billing Address");


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
    //var agencyId = parseInt($("#ddlAgencyFilter").val()) || 0;
    //var deptId = parseInt($("#ddlDeptFilter").val()) || 0;
    var filterData = {
        Id: 0,
        AgencyId: 3,
        DeptId: 56,
        WorkOrderId: 0,
        CreatedBy: 123,
        UserRole: 39,
    };

    try {

        let records = await getRecords('Manpower', 'GetEmpDetailRecord', filterData, '#myTable', 'N');
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

//Remove Employee Details from Table
$(document).on('click', '.btnRemoveRow', function () {
    $(this).closest('tr').remove();
});


// // Submit record when Click on btn
// $(".btnModalSubmit").on("click", function () {
//     SubmitRecord();
// });

// async function SubmitRecord() {
//     let isValid = true;
//     let agencyId = $("#ddlAgencyName").val();
//     let deptId = $("#ddlDeptName").val();
//     let workOrderNo = $("#txtworkOrderNo").val().trim();
//     let noOfResources = $("#txtnoOfResources").val().trim();
//     let deptEmailId = $("#txtdeptEmailId").val().trim();
//     //let billingAddress = $("#ddlBillingAddress").val();
//     let billingAddress = $("#ddlBillingAddress option:selected").text();
//     let billingId = $("#ddlBillingAddress").val();

//     $(".error").text("");
//     $(".is-invalid").removeClass("is-invalid");

//     if (agencyId === "0" || agencyId === null){
//         $("#ddlAgencyName").addClass("is-invalid");
//         $("#ddlAgencyName").siblings(".error").text("Agency Name is required.");
//         isValid = false;
//     }
//     if (deptId === "0" || deptId === null) {
//         $("#ddlDeptName").addClass("is-invalid");
//         $("#ddlDeptName").siblings(".error").text("Department Name is required.");
//         isValid = false;
//     }

//     if (workOrderNo === "") {
//         $("#txtworkOrderNo").addClass("is-invalid");
//         $("#txtworkOrderNo").siblings(".error").text("Work Order No required.");
//         isValid = false;
//     }
//     if (noOfResources === "") {
//         $("#txtnoOfResources").addClass("is-invalid");
//         $("#txtnoOfResources").siblings(".error").text("No Of Resources required.");
//         isValid = false;
//     }
//     if (deptEmailId === "") {
//         $("#txtdeptEmailId").addClass("is-invalid");
//         $("#txtdeptEmailId").siblings(".error").text("Dept. Email Id required.");
//         isValid = false;
//     }
//     if (billingId === "0" || billingId === null) {
//         $("#ddlBillingAddress").addClass("is-invalid");
//         $("#ddlBillingAddress").siblings(".error").text("Billing Address required.");
//         isValid = false;
//     }

//     if (!isValid) return;
//     // Prepare data
//     var formData = new FormData();
//     formData.append("WorkOrderAgencyId", Id);
//     formData.append("AgencyId", agencyId);
//     formData.append("DeptId", deptId);
//     formData.append("WorkOrderNo", workOrderNo);
//     formData.append("BillingId", billingId);
//     formData.append("BillingAddress", billingAddress);
//     formData.append("NoDeployedRes", noOfResources);
//     formData.append("BillAddressEmail", deptEmailId);

//     try {
//         //$("#ModalProgress").show();
//         let res = await acceptUpdate("Manpower", "AddOrEditRecord", formData);
//         if (res.success) {

//             recordlist();
//             resetModal();
//             Id = 0;
//             $('.modelalert').text(res.message);
//             closeModal('myModal');
//             MsgBox('Message', res.message, '');
//         }

//     } catch (err) {
//         $('.modelalert').text("Error: " + err);
//     }

// }



