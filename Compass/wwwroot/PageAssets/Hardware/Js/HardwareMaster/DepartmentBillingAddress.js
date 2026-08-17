var BillingId = 0;
$(document).ready(function () {
    resetModal();
    recordlist();
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "myModal", "ddlDepartment", " Department", 0, 0);
    bindDataToDdl("HardwareDropdown", "HDistrict_ddl", "myModal", "ddlDistrict", " District ", 0, 0);

});

//Get Record for A table 
async function recordlist() {
    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };
    try {
        let records = await getRecords('HardwareMaster', 'getDepartmentAddressList', filterata, '#myTable', 'N');
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
                        data-billingid="${value.BillingId}" >
                        <td>${SrNo}</td>
                        <td>${value.DepartmentName}</td>
                        <td>${value.District}</td>
                        <td>${value.BillingAddress}</td>
                        <td>${value.NodalOfficerName}</td>
                        <td>${value.Email}</td>
                        <td>${value.ContactNo}</td>             
                        <td class="text-center align-middle">
                <button type="button" class="btn p-0 border-0 bg-transparent editBillinAddress" data-billingid="${value.BillingId}" title="Edit">
                <i class="bi bi-pencil-square" style="font-size: 30px; color:#800000;"></i> </button>
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
$(document).on('hidden.bs.modal', '#myModal', function () {
    recordlist();
});
// Submit record when Click on btn
$(".btnModalSubmit").on("click", function () {
    SubmitRecord();
});
async function SubmitRecord() {
    alert(BillingId);
    let isValid = true;
    $(".error").remove();
    $(".is-invalid").removeClass("is-invalid");
    let ddlDepartment = $("#ddlDepartment").val();
    let ddlDistrict = $("#ddlDistrict").val();
    let txtNodal = $("#txtNodal").val().trim();
    let txtEmail = $("#txtEmail").val().trim();
    let txtContactNo = $("#txtContactNo").val().trim();
    let txtArea = $("#txtArea").val().trim();
    let IsActive = $("#IsActive").is(":checked") ? "Y" : "N";  
    if (!ddlDepartment || ddlDepartment === "0") {
        showError("ddlDepartment", "Select Department");
        isValid = false;
    }
    if (!ddlDistrict || ddlDistrict === "0") {
        showError("ddlDistrict", "Select Desitrict");
        isValid = false;
    }
    if (txtNodal === "") {
        showError("txtNodal", "Please enter Nodal Officer Name");
        isValid = false;
    }
    if (txtEmail === "") {
        showError("txtEmail", "Please enter Email");
        isValid = false;
    }
    if (txtContactNo === "") {
        showError("txtContactNo", "Please enter Contact No.l");
        isValid = false;
    }
    if (txtArea === "") {
        showError("txtArea", "Please enter Billing Addressl");
        isValid = false;
    } 
    if (!$("#IsActive").is(":checked")) {
        showError("IsActive", "Please select Active.");
        isValid = false;
    }
    if (!isValid) return;

    // Prepare data

    var formData = new FormData();
    formData.append("BillingId", BillingId);
    formData.append("DeptId", ddlDepartment);
    formData.append("DistrictId", ddlDistrict);
    formData.append("BillingAddress", txtArea);
    formData.append("NodalOfficerName", txtNodal);
    formData.append("Email", txtEmail);
    formData.append("ContactNo", txtContactNo);
    try {
        //$("#ModalProgress").show();
        let res = await acceptUpdate("HardwareMaster", "AddOrEditBillingAddress", formData);
        if (res.success) {
            recordlist();
            resetModal();
            BillingId = 0;
            $('.modelalert').text(res.message);
            closeModal('myModal');
            MsgBox('Message', res.message, '');
        }
    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }
}

//Edit Record From Table
$(document).on('click', '.editBillinAddress', async function () {
    BillingId = $(this).data("billingid");
    alert(BillingId);
    if (!BillingId) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question');
    if (isConfirmed) {
        resetModal();
        await loadRecordById(BillingId);
        $("#myModal .modal-title").text("Edit Billing Address");
        openModal('myModal');
    } else {
        console.log('Edit cancelled');
    }
});
// get Record to fill
async function loadRecordById(BillingId) {
      var filterata = {
        FilterId1: BillingId, /* row.data('billingid'), */
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };
    try {
        let records = await getRecords('HardwareMaster', 'getDepartmentAddressList', filterata, '#myTable', 'N');
        if (records && records.length > 0) {
            let data = records[0];
            // Id = data.BillingId;
            bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "myModal", "ddlDepartment", "Department", data.DeptId, 0);
            var department = new Option(data.DepartmentName, data.DeptId, true, true);
            $("#ddlDepartment").append(department).trigger("change");


            bindDataToDdl("HardwareDropdown", "HDistrict_ddl", "myModal", "ddlDistrict", " District ", data.DistrictId, 0);
            option = new Option(data.District, data.DistrictId, true, true);
            $('#ddlDistrict').append(option).trigger('change');

            $("#txtNodal").val(data.NodalOfficerName);
            $("#txtEmail").val(data.Email);
            $("#txtContactNo").val(data.ContactNo);
            $("#txtArea").val(data.BillingAddress);
            if (data.IsActive) {
                $('#IsActive').prop('checked', true);
            }
            else {
                $('#IsActive').prop('checked', false);
            }

        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}


