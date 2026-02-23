
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
    bindDataToDdl("Dropdown", "MAgency_ddl", "myModal", "ddlAgencyName", " Agency Name");
    bindDataToDdl("Dropdown", "MDepartment_ddl", "myModal", "ddlDeptName", " Department Name");
    //bindDataToDdl("Dropdown", "MBillingAddress_ddl", "myModal", "ddlBillingAddress", " Billing Address");
    bindDependentDataToDdl("Dropdown", "MBillingAddress_ddl", null,//❗ With/Without modal
        "ddlDeptName", "ddlBillingAddress", "Select Billing Address");
});


//Get Record for A table 
async function recordlist() {

    var filterData = {
        AgencyId: 0,
        DeptId: 56,
        WorkOrderAgencyId: 0,
        CreatedBy: 0,
        UserRole: 39,

    };

    try {

        let records = await getRecords('Manpower', 'GetDeptMasterRecord', filterData, '#myTable', 'N');
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
                <td>${value.AgencyName}</td>
                <td>${value.DepartmentName}</td>
                <td>${value.WorkOrderId}</td>
                <td>${value.BillingAddress}</td>
                <td>${value.NoDeployedRes}</td>
                <td>${value.IsResourceUploaded}</td>
                <td>${value.NoOfUploadedResource}</td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
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

// Submi record when Click on btn
$(".btnModalSubmit").on("click", function () {
    SubmitRecord();
});

async function SubmitRecord() {
    let isValid = true;
    let agencyName = $("#ddlAgencyName").val();
    let deptName = $("#ddlDeptName").val();
    let workOrderNo = $("#txtworkOrderNo").val().trim();
    let noOfResources = $("#txtnoOfResources").val().trim();
    let deptEmailId = $("#txtdeptEmailId").val().trim();
    let billingAddress = $("#ddlBillingAddress").val();
    let billingId = 0;

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

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

    if (workOrderNo === "") {
        $("#txtworkOrderNo").addClass("is-invalid");
        $("#txtworkOrderNo").siblings(".error").text("Work Order No required.");
        isValid = false;
    }
    if (noOfResources === "") {
        $("#txtnoOfResources").addClass("is-invalid");
        $("#txtnoOfResources").siblings(".error").text("No Of Resources required.");
        isValid = false;
    }
    if (deptEmailId === "") {
        $("#txtdeptEmailId").addClass("is-invalid");
        $("#txtdeptEmailId").siblings(".error").text("Dept. Email Id required.");
        isValid = false;
    }
    if (billingAddress === "0" || billingAddress === null) {
        $("#ddlBillingAddress").addClass("is-invalid");
        $("#ddlBillingAddress").siblings(".error").text("Billing Address required.");
        isValid = false;
    }
    
    if (!isValid) return;
    // Prepare data
    var formData = new FormData();
    formData.append("WorkOrderAgencyId", Id);
    formData.append("AgencyId", agencyName);
    formData.append("DeptId", deptName);
    formData.append("WorkOrderNo", workOrderNo);
    formData.append("BillingId", 0);
    formData.append("BillingAddress", billingAddress);
    formData.append("NoDeployedRes", noOfResources);
    formData.append("BillAddressEmail", deptEmailId);

    try {
        //$("#ModalProgress").show();
        let res = await acceptUpdate("Manpower", "AddOrEditRecord", formData);
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

