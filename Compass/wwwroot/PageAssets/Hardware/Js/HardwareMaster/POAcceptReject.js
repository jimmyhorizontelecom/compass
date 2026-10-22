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
                        <!--Dept Order Doc.-->
                        <td style="text-align: center; vertical-align: middle;"> 
                        <i class="bi bi-file-earmark-text text-danger fs-2" title="View Document" style="display: inline-block; cursor: pointer; transition: transform 0.2s ease;"
                            onmouseover="this.style.transform='scale(1.3)';"  onmouseout="this.style.transform='scale(1)';"></i></td>
                        <!--View Item Description-->    
                       <td style="text-align: center; vertical-align: middle;">
                       <i class="bi bi-eye-fill text-danger fs-2 itemDescription" title="View Item Description"  style="display: inline-block; cursor: pointer; transition: transform 0.2s ease;"
                            onmouseover="this.style.transform='scale(1.3)';"  onmouseout="this.style.transform='scale(1)';"></i></td> 
                        <!--Delivery Location-->
                       <td style="text-align: center; vertical-align: middle;">
                       <i class="bi bi-geo-alt-fill text-danger fs-2 deliveryAdd" title="View Location" style="display: inline-block; cursor: pointer; transition: transform 0.2s ease;"
                            onmouseover="this.style.transform='scale(1.3)';"  onmouseout="this.style.transform='scale(1)';"> </i></td>
                        <!--HPSEDC PO Doc Print-->
                         <td style="text-align: center; vertical-align: middle;">
                         <i class="bi bi-printer-fill text-danger fs-2 printInvoice" title="Print" style="display: inline-block; cursor: pointer; transition: transform 0.2s ease;"
                            onmouseover="this.style.transform='scale(1.3)';"  onmouseout="this.style.transform='scale(1)';"></i></td>
                        <!--Accept/Reject button-->
                         <td style="text-align: center; vertical-align: middle;">
                        <button class="btn btn-danger btn-sm my-btn"  style="display: inline-block; cursor: pointer; transition: transform 0.2s ease;"
                            onmouseover="this.style.transform='scale(1.3)';"  onmouseout="this.style.transform='scale(1)';">Accept/Reject</button></td>
                         
                          
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
    let IsOrderAccept = $('input[name="AcceptReject"]:checked').val();
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    if (!IsOrderAccept) {
        $('input[name="AcceptReject"]').addClass("is-invalid");
        $('input[name="AcceptReject"]').closest('.form-check').parent().find(".error")
            .text("Please select Accept or Reject.");
        isValid = false;
     }
    if (Remarks == "") {
        $("#txtareaVRemark").addClass("is-invalid");
        $("#txtareaVRemark").siblings(".error").text("Enter Please Remarks Here.");
        isValid = false;
    }
    alert(purchaseorderid);
     var formData = new FormData();
    formData.append("SaleOrderId", OrderId);
    formData.append("OrderDetailsId", 0);
    formData.append("PurchaseOrderId", purchaseorderid);
    formData.append("IsOrderAccept", IsOrderAccept);
    formData.append("Remarks", Remarks);
    try {
        let res = await acceptUpdate("HardwarePurchase", "SubmitPOAcceptReject", formData);
        if (res.success) {
            MsgBox('Message', res.message, '');
            $("#myModalVerificationStatus").modal("hide");
            recordlist();
            resetModal();
        }
    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }
}
