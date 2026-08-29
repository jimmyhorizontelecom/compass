var Id = 0, tabIdNo = 1;
var OrderId = 0, PurchaseOrderId = 0;



$(document).ready(function () {


    $("#listDiv").show();
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "", "ddlDept", " Department ", 0, 0);
    bindDataToDdl("HardwareDropdown", "HAgency_ddl", "", "ddlAgency", "Agency ", 0, 0);

    recordlist();
    let srNo = 1;

});

$('#myTablePOCancel').DataTable({
    "paging": true,
    "pageLength": 10
});
$('#myTableOrderDetail').DataTable({
    "paging": true,
    "pageLength": 10
});


//Get Record for a Table PO Cancel List
async function recordlist() {

    var filterata = {
        FilterId1: '0',
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: 'P',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getPOCancellationList', filterata, '#myTablePOCancel', 'N');
        bindDatatablePOCancelList(records, '#myTablePOCancel');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table PO Cancel List
function bindDatatablePOCancelList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;
        //₹
        tbody.append(`<tr
                       data-purchaseordernoid="${value.PurchaseOrderNoId}" 
                         >
                        <td>${SrNo}</td>
                         
                         <td>${value.PurchaseOrderNoId}</td>
                        <td>${value.PurchaseOrderDate}</td>
                        <td>${value.HWSaleOrderReferenceNo}</td>                        
                        <td>${value.DepartmentName}</td>
                        <td>${value.AgencyName}</td>
                         <td><button class="btn btn-danger btnAccept">Accept/Reject</button></td>
                         
                          
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

    hideModalLoader();
}
// Open Order Detail modal
$(document).on('click', '.btnAccept', function () {

    var row = $(this).closest('tr');
    var purchaseOrderId = row.data('purchaseordernoid');

    alert(purchaseOrderId);
    PurchaseOrderId = purchaseOrderId;


    recordOrderDetailList();

    var myModal = new bootstrap.Modal(document.getElementById('myModalOrderDetail'));
    myModal.show();
});
// get Record for a Table Order Detais
async function recordOrderDetailList() {

    var filterata = {
        FilterId1: PurchaseOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getOrderDetailList', filterata, '#myModalOrderDetail', 'N');
        PurchaseOrderId = 0;
        bindDatatableOrderDetails(records, '#myTableOrderDetail');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}

//Bind get record  in a table Order Details
function bindDatatableOrderDetails(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;
        $('#txtPONo').val(value.PurchaseOrderNoId);
        $('#txtPODate').val(value.CancelDateAndTime);
        $('#txtAgency').val(value.Agency);
        console.log(value.PurchaseOrderNoId);
        tbody.append(`<tr
                       data-orderdetailsid="${value.OrderDetailsId}" 
                         >
                         <td>${SrNo}</td>
                         <td><input type="checkbox" class="rowCheckbox"></td>
                        <td>${value.OrderDetailsId}</td>
                        <td>${value.ProductName}</td>
                        <td>${value.Quantity}</td>
                        
                        <td>₹${value.BaseAmt}<br>₹${value.SGSTAmt}<br>₹${value.CGSTAmt}<br>₹${value.Total}</td>
                        <td>${value.CancelDateAndTime}</td>
                       
                        <td>${value.CancelRemarks}</td>
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
// Select All checkbox
$(document).on('change', '#selectAll', function () {
    $('.rowCheckbox').prop('checked', $(this).prop('checked'));
});
$(document).on('change', '.rowCheckbox', function () {
    if (!$(this).prop('checked')) {
        $('#selectAll').prop('checked', false);
    } else {
        // Check if all checkboxes are checked
        if ($('.rowCheckbox:checked').length === $('.rowCheckbox').length) {
            $('#selectAll').prop('checked', true);
        }
    }
});
// This function is used to submit remarks data

$(".btnModalRemarkSubmit").on("click", function () {
    SubmitOrderDetailRemarksRecord();
});


async function SubmitOrderDetailRemarksRecord() {

    let isValid = true;
    let RemarkAttachment = $("#RemarkAttachment").get(0);



    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    let Remarks = $("#txtareaRemark").val().trim();


    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    if (Remarks === "") {
        $("#txtareaRemark").addClass("is-invalid");
        $("#txtareaRemark").siblings(".error").text("Enter Please Remarks Here.");
        isValid = false;
    }
    var items = [];


    // $("#myTableOrderDetail tbody tr").each(function ()
    $('.rowCheckbox:checked').each(function () {
        var row = $(this).closest('tr');
        var orderdetailsid = row.data('orderdetailsid');

        var item = {
            OrderDetailsId: orderdetailsid,

        };

        items.push(item);

    });

    var OrderDetail = {
        OrderDetailsId: '0',
        PurchaseOrderId: $('#txtPONo').val(),
        AgencyId: '0',
        IsCancelPruchaseOrder: 'Y',
        PoCancelRemarks: $("#txtareaRemark").val(),

        Items: items
    };
    // Prepare data
    var fileSize = 10

    var isValid1 = fileSizeValidation('DeptDocument', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        return;
    }


    let allowedExtensions = ["jpg", "jpeg", "pdf", "xlsx"];

    var formData = new FormData();

    formData.append("OrderDetail", JSON.stringify(OrderDetail));



    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwarePurchase',
            'SubmitOrderDetailRemarks',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            resetModal();
            $("#myTable1 tbody").empty();

        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}



























