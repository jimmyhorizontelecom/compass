var Id = 0, tabIdNo = 1;
var OrderId = 0, purchaseorderid = 0;



$(document).ready(function () {


    $("#listDiv").show();

    recordlist();
    let srNo = 1;

});

$('#myTablePOVerification').DataTable({
    "paging": true,
    "pageLength": 10
});


//Get Record for a Main Table List
async function recordlist() {

    var filterata = {
        FilterId1: '0',
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getPOVerificationList', filterata, '#myTablePOVerification', 'N');
        bindDatatablePOVerificationList(records, '#myTablePOVerification');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}


//Bind get record  in a table PO Verification
function bindDatatablePOVerificationList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`<tr
                        data-saleorderid="${value.SaleOrderId}"  data-purchaseordernoid="${value.PurchaseOrderNoId}" 
                         >
                        <td>${SrNo}</td>
                         
                         <td>${value.PurchaseOrderNo}+<br>${value.PurchaseOrderDate}</td>
                        <td>${value.DepartmentName}</td>
                        <td>${value.AgencyName}</td>
                        <td>${value.Amount.toFixed(2)}</td>
                        <td> <i class="bi bi-file-earmark-text text-danger fs-3"></i></td>
                            
                       <td><i class="fa fa-eye text-danger fa-2x itemDescription"></i></td> 
                       <td><i class="fa fa-map-marker-alt text-danger fa-2x deliveryAdd"</i></td>
                         <td><i class="fa fa-print text-success fa-2x printInvoice"></i></td>
                         <td><button class="btn btn-danger my-btn">Accept/Reject</button></td>
                         
                          
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
// Open Item Description modal
$(document).on('click', '.itemDescription', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');

    alert(saleOrderId);
    OrderId = saleOrderId;

    recordItemDesclist(saleOrderId);

    var myModal = new bootstrap.Modal(document.getElementById('myModalitemDescription'));
    myModal.show();
});
// get Record for a Table
async function recordItemDesclist(saleOrderId) {

    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'getItemDescriptionList', filterata, '#myModalitemDescription', 'N');
        bindDatatableItemDesc(records, '#myTableItemDesc1');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}

//Bind get record  in a table Item description
function bindDatatableItemDesc(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`<tr
                        data-saleorderid="${value.SaleOrderId}" 
                         >
                        <td>${SrNo}</td>

                        <td>${value.ItemDescription}</td>
                        <td>${value.Quantity}</td>
                        <td>${value.BasePrice.toFixed(2)}</td>
                        <td>${value.GST.toFixed(2)}</td>
                        <td>${value.UnitRate.toFixed(2)}</td>
                        <td>${value.TotalAmount.toFixed(2)}</td>
                       
                       
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
// Open delivery Address Modal
$(document).on('click', '.deliveryAdd', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');

    alert(saleOrderId);
    OrderId = saleOrderId;

    recordAddDeliveryAddressList(saleOrderId);

    var myModal = new bootstrap.Modal(document.getElementById('myModalDeliveryAdd'));
    myModal.show();
});
//Get Record for A table 
async function recordAddDeliveryAddressList(saleOrderId) {

    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'getAddDeliveryAddressList', filterata, '#myModalDeliveryAdd', 'N');
        bindDatatableDeliveryAddress(records, '#myTableAddLocation2');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table Add Delivery Address
function bindDatatableDeliveryAddress(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`<tr
                        data-orderdeliveryid="${value.OrderDetailsId}" 
                         >
                        <td>${SrNo}</td>

                        <td>${value.ProductName}</td>
                        <td>${value.DeliveryQuantity}</td>
                        <td>${value.ConsigneeName}</td>
                        <td>${value.ContactNo}</td>
                        <td>${value.ConsigneeAddress}</td>
                        <td>${value.AddressType}</td>
                        
                     
                       
        `);
    });

    $(tableId).DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        responsive: true
    });
}
// Open modal when click on btn Accept/Reject
$(document).on('click', '.my-btn', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');
    var purchaseordernoid = row.data('purchaseordernoid');

    alert(saleOrderId);
    OrderId = saleOrderId;
    purchaseorderid = purchaseordernoid;

    var myModal = new bootstrap.Modal(document.getElementById('myModalVerificationStatus'));
    myModal.show();
});

// Submit Accept/Reject when Click on btn
$(".btnModalRemarkSubmit").on("click", function () {
    SubmitAcceptRecord();
});
// to read  each selected row data
// MUST be separate and clean
function getSelectedData() {

    var selectedItems = [];

    $('.rowCheckbox:checked').each(function () {

        var row = $(this).closest('tr');
        var OrderDetailsId = row.data('orderdetailsid');
        var validDateFrom = '';
        var validDateTo = '';//row.find('.deliveryQuantity').val();

        var item = {
            OrderDetailsId: OrderDetailsId,
            validDateFrom: validDateFrom, // (you missed using it)
            validDateTo: validDateTo,

        };

        selectedItems.push(item);
    });

    return selectedItems;
}
async function SubmitAcceptRecord() {
    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    let Remarks = $("#txtareaVRemark").val();


    let IsOrderAccept = document.querySelector('input[name="AcceptReject"]:checked');

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");


    if (Remarks == "") {
        $("#txtareaVRemark").addClass("is-invalid");
        $("#txtareaVRemark").siblings(".error").text("Enter Please Remarks Here.");
        isValid = false;
    }



    alert(purchaseorderid);


    var POVerify = {
        SaleOrderId: OrderId,
        OrderDetailsId: '0',
        PurchaseOrderId: purchaseorderid,
        IsOrderAccept: 'R',
        Remarks: $("#txtareaVRemark").val() || ""



    };


    var formData = new FormData();
    formData.append("POVerify", JSON.stringify(POVerify));


    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwarePurchase',
            'SubmitPOVerification',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');

            resetModal();

        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}































