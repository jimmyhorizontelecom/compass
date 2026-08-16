var Id = 0;


$(document).ready(function () {
    resetModal();
    recordlist();
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "myModal", "ddlDepartment", " Department", 0, 0);
    bindDataToDdl("HardwareDropdown", "HDistrict_ddl", "myModal", "ddlDistrict", " District ", 0, 0);

});
$(document).on('shown.bs.tab', 'button[data-bs-toggle="tab"]', function (e) {

    var target = $(e.target).attr("data-bs-target");

    if (target === "#Edit") {
        getProductBasic();
    }

});

function getProductBasic() {
    alert('Test');
}

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
                        data-id="${value.BillingId}" >
                        <td>${SrNo}</td>
                        <td>${value.DepartmentName}</td>
                        <td>${value.District}</td>
                        <td>${value.BillingAddress}</td>
                        <td>${value.NodalOfficerName}</td>
                        <td>${value.Email}</td>
                        <td>${value.ContactNo}</td>
                       
                        
                       
                        
                        
                        <td class="text-center">
                            <button class="btn btn-sm btn-primary editProduct"  data-id="${value.BillingId}">
                            <i class="fa fa-pencil"></i>
                            </button>
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
// Open Edit Model
$(document).on('click', '.editProduct1', function () {


    var row = $(this).closest('tr');
    var productId = row.data('id');

    // Set modal title
    $("#myModal .modal-title").text("Edit Address");

    // Show modal (Bootstrap 5 way)
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));
    myModal.show();

});

async function SubmitRecord() {
    let isValid = true;
    let ddlDepartment = $("#ddlDepartment").val();
    let ddlDistrict = $("#ddlDistrict").val();
    let txtNodal = $("#txtNodal").val().trim();
    let txtEmail = $("#txtEmail").val().trim();
    let txtContactNo = $("#txtContactNo").val().trim();
    let txtArea = $("#txtArea").val().trim();

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");



    if (!isValid) return;

    // Prepare data

    var formData = new FormData();
    formData.append("BillingId", Id);
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
$(document).on('click', '.editProduct', async function () {

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

    var filterata = {
        FilterId1: row.data('id'),
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareMaster', 'getDepartmentAddressList', filterata, '#myTable', 'N');

        if (records && records.length > 0) {

            let data = records[0];
            Id = data.BillingId;
            bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "myModal", "ddlDepartment", " Department", data.DeptId, 0);
            var option = new Option(data.DepartmentName, data.DeptId, true, true);
            $('#ddlDepartment').append(option).trigger('change');


            bindDataToDdl("HardwareDropdown", "HDistrict_ddl", "myModal", "ddlDistrict", " District ", data.DistrictId, 0);
            option = new Option(data.District, data.DistrictId, true, true);

            $('#ddlDistrict').append(option).trigger('change');
            alert(data.DistrictId);

            $("#txtNodal").val(data.NodalOfficerName);
            $("#txtEmail").val(data.EmailId);
            $("#txtContactNo").val(data.ContactNo);
            $("#txtArea").val(data.BillingAddress);

        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}


