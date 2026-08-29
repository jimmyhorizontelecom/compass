var PiAddressId = 0;

$(document).ready(function () {
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "", "ddlPIDepartment", " Department Name", 0, 0);
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "myModalPIAddress", "ddlPiAddrDeptName", " Department Name", 0, 0);

    resetModal();
    PIAddressList();


});

//Get Record for A table 
async function PIAddressList() {

    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('PI', 'GetPIAddressList', filterata, '#myTablePIAddress', 'N');
        bindDatatablePIAddressList(records, '#myTablePIAddress');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table 
function bindDatatablePIAddressList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`
            <tr 
                 data-piaddressid="${value.PiAddressId}"   
                         >
                        <td>${SrNo}</td>
                         <td>${value.departmentName}</td>
                         <td>${value.Designation}</td> 
                        <td>${value.AddressText}</td>
                        <td>${value.EmailId}</td>
                        <td>${value.ContactNo}</td>
                        <td><i class="bi bi-pencil-square Text-edit edit-icon"></i></td>
                       
                        

    
                       
               
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
$('#myTablePIAddress').DataTable({
    "paging": true,
    "searching": true,
    "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
    "language": {
        "search": "Search"
    }
});
// Pagination codding in apply table of PI Address
function applyPagination() {
    let rows = $("#myTablePIGenerate tbody tr");
    let perPage = 10;
    let totalRows = rows.length;
    let totalPages = Math.ceil(totalRows / perPage);

    $("#pagination").empty();

    function showPage(page) {
        rows.hide();
        rows.slice((page - 1) * perPage, page * perPage).show();
    }

    for (let i = 1; i <= totalPages; i++) {
        $("#pagination").append(`<button class="btn btn-sm btn-primary m-1 page-btn" data-page="${i}">${i}</button>`);
    }

    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        showPage(page);
    });

    showPage(1);
}
$('#customSearch').on('keyup', function () {
    let search = $(this).val();
    recordlist(1, search);
});

$(document).on("click", ".page-btn", function () {
    let page = $(this).data("page");
    let search = $('#customSearch').val();
    recordlist(page, search);
});
//Edit Record From Table PI Address
$(document).on('click', '.Text-edit', async function () {

    var row = $(this).closest('tr');
    PiAddressId = row.data('piaddressid');
    console.log(PiAddressId);

    var isConfirmed = await DeleteEditBox('PI Address', 'Do you want to edit Record?', 'question', PiAddressId);

    if (isConfirmed) {
        console.log('Edit');
        // User clicked Yes
        await loadRecordById(row);
        openModal('myModalPIAddress');

        // $('#myModal').modal('show');
    } else {
        // User clicked Cancel
        console.log('Edit cancelled');
    }
});
// get Record to fill
async function loadRecordById(row) {

    var filterata = {
        FilterId1: row.data('piaddressid'),
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('PI', 'GetPIAddressList', filterata, '#myTablePIAddress', 'N');

        if (records && records.length > 0) {

            let data = records[0];

            // Id = data.Id;



            $("#ddlPiAddrDeptName").val(data.departmentID);
            var option1 = new Option(data.departmentName, data.departmentID, true, true);
            $("#ddlPiAddrDeptName").append(option1).trigger('change');

            $("#txtPidesignation").val(data.Designation);
            $("#txtareaPIAddresstxt").val(data.AddressText);
            $("#txtPiEmailId").val(data.EmailId);
            $("#txtPiContactNo").val(data.ContactNo);


            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}

// Submit record when Click on btn
$(".btnModel").on("click", function () {

    UpdateRecordPIAddress();
});
// to read  each selected row data
// MUST be separate and clean
async function UpdateRecordPIAddress(row) {



    var PIAddress = {
        PiAddressId: PiAddressId,
        DeptId: $('#ddlPiAddrDeptName').val(),
        AddressText: $('#txtareaPIAddresstxt').val(),
        EmailId: $('#txtPiEmailId').val(),
        ContactNo: $('#txtPiContactNo').val(),
        IsActive: 'Y',
        Designation: $('#txtPidesignation').val(),


    };


    var formData = new FormData();
    formData.append("PIAddress", JSON.stringify(PIAddress));


    try {

        let res = await acceptUpdateMultiTableFData1(
            'PI',
            'UpdateRecordPIAddress',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');

            //recordlist(page = 1, search = '');
            PIAddressList(PiAddressId);

            resetModal();
            closeModal('myModalPIAddress');
            // $("#myTable1 tbody").empty();
        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}

// Change event of Bill For ddl
$(document).on('change', '#ddlPbgBillFor', async function () {
    console.log($(this).val());
    if ($(this).val() == 'S') {

        $('#ddlPbgPOrderNo').next('.select2-container').show();
        $('#lblPbgPOrderNo').show();
    }
    else {
        $('#ddlPbgPOrderNo').next('.select2-container').hide();
        $('#lblPbgPOrderNo').hide();

    }

});

