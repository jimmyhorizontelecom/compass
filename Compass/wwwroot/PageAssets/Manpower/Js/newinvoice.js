var Id = 0;


$(document).ready(function () {
    resetModal();
    recordlist();
    // Get Agency Function Call
    //getAgencyddl()
    //Get Departmet Function Call
   // getDepartmentddl();
    //Get Billing Address Function Call
    //getBillingAddressddl();
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

        let records = await getRecords('ManpowerMaster', 'GetRecord', filterData, '#myTable', 'N');
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
                data-workorderid="${value.WorkOrderAgencyId}" 
                data-deptid="${value.DeptId}" 
                data-agencyid="${value.AgencyId}">
                <td>${SrNo}</td>
                <td>${value.DepartmentName}</td>
                <td>${value.WorkOrderNo}</td>
                <td>${value.BillingAddress}</td>
                <td>${value.NoDeployedRes}</td>
                <td>${value.IsResourceUploaded}</td>
                <td>${value.NoOfUploadedResource}</td>
                 <td class="text-center">
                    <span data-id="${value.WorkOrderAgencyId}" >
                        <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.WorkOrderAgencyId}" >
                        <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.WorkOrderAgencyId}" >
                        <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.WorkOrderAgencyId}" >
                        <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.WorkOrderAgencyId}" >
                        <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.WorkOrderAgencyId}" >
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
// Get Agency List
function getAgencyddl() {
    $.ajax({
        url: '/ManpowerCommon/getAgencyddl',
        type: 'POST',
        data: {
            DeptId: 0,
            //MainCatgId: 0
        },
        dataType: 'json',
        success: function (data) {

            console.log(data);

            if (!data || data.length === 0) {
                toastr.warning("No data found");
                return;
            }

            // If dropdown
            $('#ddlagencyName').empty();
            $('#ddlagencyName').append('<option value="0">-- Select --</option>');
            $.each(data, function (i, item) {
                $('#ddlagencyName').append(
                    `<option value="${item.DeptId}">${item.departmentName}</option>`
                );
            });
        },
        error: function () {
            toastr.error("Failed to load Main Category. Please try again.");
        }
    });
}

// Get Department List
function getDepartmentddl() {
    $.ajax({
        url: '/ManpowerCommon/getDepartmentddl',
        type: 'POST',
        data: {
            DeptId: 0,
            //MainCatgId: 0
        },
        dataType: 'json',
        success: function (data) {

            console.log(data);

            if (!data || data.length === 0) {
                toastr.warning("No data found");
                return;
            }

            // If dropdown
            $('#ddldeptName').empty();
            $.each(data, function (i, item) {
                $('#ddldeptName').append(
                    `<option value="${item.DeptId}">${item.departmentName}</option>`
                );
            });
        },
        error: function () {
            toastr.error("Failed to load Main Category. Please try again.");
        }
    });
}

// Get Department List
function getBillingAddressddl() {
    $.ajax({
        url: '/ManpowerCommon/getBillingAddressddl',
        type: 'POST',
        data: {
            DeptId: 0,
            //MainCatgId: 0
        },
        dataType: 'json',
        success: function (data) {

            console.log(data);

            if (!data || data.length === 0) {
                toastr.warning("No data found");
                return;
            }

            // If dropdown
            $('#ddlbillingAddress').empty();
            $.each(data, function (i, item) {
                $('#ddlbillingAddress').append(
                    `<option value="${item.DeptId}">${item.departmentName}</option>`
                );
            });
        },
        error: function () {
            toastr.error("Failed to load Main Category. Please try again.");
        }
    });
}

// Submi record when Click on btn
$(".btnModalSubmit").on("click", function () {
    SubmitRecord();
});

async function SubmitRecord() {
    let isValid = true; 
    let agencyName = $("#ddlagencyName").val();
    let deptName = $("#ddldeptName").val();
    let workOrderNo = $("#txtworkOrderNo").val().trim();
    let noOfResources = $("#txtnoOfResources").val().trim();
    let deptEmailId = $("#txtdeptEmailId").val().trim();
    let billingAddress = $("#ddlbillingAddress").val();
    let billingId = 0;

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (agencyName === "0") {
        $("#ddlagencyName").addClass("is-invalid");
        $("#ddlagencyName").siblings(".error").text("Agency Name is required.");
        isValid = false;
    }
    if (deptName === "0") {
        $("#ddldeptName").addClass("is-invalid");
        $("#ddldeptName").siblings(".error").text("Department Name is required.");
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
    if (billingAddress === "0") {
        $("#ddlbillingAddress").addClass("is-invalid");
        $("#ddlbillingAddress").siblings(".error").text("Billing Address required.");
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

        let res = await acceptUpdate("ManpowerMaster", "AddOrEditRecord", formData);

        

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
// get Record to fill
async function loadRecordById(row) {
    
    var filterData = {
        FilterId1: row.data('id'),
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('Master', 'GetRecord', filterData, '#myTable', 'N');

        if (records && records.length > 0) {

            let data = records[0];
            Id = data.Id;
            $("#field1").val(data.Field1);
            $("#field2").val(data.Field2);
            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}


