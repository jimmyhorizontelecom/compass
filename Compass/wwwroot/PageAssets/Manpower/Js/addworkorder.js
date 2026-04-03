
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
    //recordlist();

    //bind ddl to filter
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyFilter", " Agency Name");
    bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptFilter", " Department Name");
    // load data when changes on ddl
    $("#ddlAgencyFilter, #ddlDeptFilter").change(function () {
        recordlist();
    });
    // initial load
    setTimeout(() => recordlist(), 500);
    //bind ddl to modal
    bindDataToDdl("Dropdown", "MAgency_ddl", "myModal", "ddlAgencyName", " Agency Name");
    bindDataToDdl("Dropdown", "MDepartment_ddl", "myModal", "ddlDeptName", " Department Name");
    bindDependentDataToDdl("Dropdown", "MBillingAddress_ddl", null,//❗ With/Without modal
        "ddlDeptName", "ddlBillingAddress", "Select Billing Address");

    
});


//Get Record for A table 
async function recordlist() {

    var agencyId = parseInt($("#ddlAgencyFilter").val()) || 0;
    var deptId = parseInt($("#ddlDeptFilter").val()) || 0;

    var filterData = {
        Id:0,
        AgencyId: agencyId,
        DeptId: deptId,
        WorkOrderId: 0,
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
                data-id="${value.WorkOrderId}">
                
                <td>${SrNo}</td>
                <td>${value.AgencyName}</td>
                <td>${value.DepartmentName}</td>
                <td>${value.WorkOrderId}</td> 
                <td>${value.BillingAddress}</td>
                <td>${value.NoDeployedRes}</td>
                <td>${value.IsResourceUploaded}</td>
                <td>${value.NoOfUploadedResource}</td>
                 <td class="text-center">
                    <span data-id="${value.Id}" >
                       <i class="bi bi-pencil-square edit-workOrder edit-icon" data-id="${value.WorkOrderId}"></i>
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

// Submit record when Click on btn
$(".btnModalSubmit").on("click", function () {
    SubmitRecord();
});

async function SubmitRecord() {
    let isValid = true;
    let agencyId = $("#ddlAgencyName").val();
    let deptId = $("#ddlDeptName").val();
    let workOrderNo = $("#txtworkOrderNo").val().trim();
    let noOfResources = $("#txtnoOfResources").val().trim();
    let deptEmailId = $("#txtdeptEmailId").val().trim();
    //let billingAddress = $("#ddlBillingAddress").val();
    let billingAddress = $("#ddlBillingAddress option:selected").text();
    let billingId = $("#ddlBillingAddress").val();

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (agencyId === "0" || agencyId === null){
        $("#ddlAgencyName").addClass("is-invalid");
        $("#ddlAgencyName").siblings(".error").text("Agency Name is required.");
        isValid = false;
    }
    if (deptId === "0" || deptId === null) {
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
    if (billingId === "0" || billingId === null) {
        $("#ddlBillingAddress").addClass("is-invalid");
        $("#ddlBillingAddress").siblings(".error").text("Billing Address required.");
        isValid = false;
    }
    
    if (!isValid) return;
    // Prepare data
    var formData = new FormData();
    formData.append("WorkOrderAgencyId", Id);
    formData.append("AgencyId", agencyId);
    formData.append("DeptId", deptId);
    formData.append("WorkOrderNo", workOrderNo);
    formData.append("BillingId", billingId);
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


// MsgBox on Edit Work Order Details
$(document).on('click', '.edit-workOrder', async function () {

    var recordId = $(this).data("id");
    //alert(recordId);
    console.log("Edit Record Id:", recordId);

    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }
   
    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question');

    if (isConfirmed) {
        // alert('Testing');
        resetModal();
        await loadWorkOrder(recordId);
        openModal('myModal');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {
        console.log('Edit cancelled');
    }
});

// get Record to work order details
async function loadWorkOrder(recordId) {
    alert(recordId);
    var filterData = {
        //Id: recordId,
        AgencyId: 0,
        DeptId: 0,
        WorkOrderId: recordId,
        CreatedBy: 0,
        UserRole: 39,
    };


    try {

        let records = await getRecords('Manpower', 'GetDeptMasterRecord', filterData, 'myModal', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            console.log(data)
            //var Id = data.Id;
           // WorkOrderId = data.WorkOrderId;
            alert(data);
            $("#txtworkOrderNo").val(data.WorkOrderId);
            $("#txtnoOfResources").val(data.NoDeployedRes);
            $("#txtdeptEmailId").val(data.BillingAddEmail);
            $("#hdnAgencyId").val(data.AgencyId);
            $("#hdnDeptId").val(data.DeptId);

            bindDataToDdl("Dropdown", "MAgency_ddl", "myModal", "ddlAgencyName", " Agency Name", data.AgencyId, 0);
            var option = new Option(data.AgencyName, data.AgencyId, true, true);
            $('#ddlAgencyName').append(option).trigger('change');

            bindDataToDdl("Dropdown", "MDepartment_ddl", "myModal", "ddlDeptName", " Department Name", data.DeptId, 0);
            var option = new Option(data.DepartmentName, data.DeptId, true, true);
            $('#ddlDeptName').append(option).trigger('change');

            bindDependentDataToDdl("Dropdown", "MBillingAddress_ddl", null,//❗ With/Without modal
                "ddlDeptName", "ddlBillingAddress", "Select Billing Address", data.DeptId, 0);
            var option = new Option(data.BillingAddress, true);
            $('#ddlBillingAddress').append(option).trigger('change');

            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}
