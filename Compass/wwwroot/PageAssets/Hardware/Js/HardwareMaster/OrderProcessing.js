var Id = 0, tabIdNo = 1;
var OrderId = 0, purchaseorderid = 0;



$(document).ready(function () {


    $("#listDiv").show();
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "", "ddlDept", " Department Name Filter", 0, 0);
    bindDataToDdl("HardwareDropdown", "HDistrict_ddl", "myModalAddLocation", "ddlDistrict", " District Name", 0, 0);
    bindDataToDdl("HardwareDropdown", "HConsignee_ddl", "myModalProductDelivery", "ddlConsigneeAddr", " Consignee Name And Address", 54, 0);
    bindDataToDdl("HardwareDropdown", "HConsignee_ddl", "myModalProductDelivery", "ddlIRConsigneeAddr", " Consignee Name And Address", 54, 0);

    recordlist();
    let srNo = 1;

});
$('#myTableOrderProcess').DataTable({
    "paging": true,
    "pageLength": 10
});
$('#myTableProductDeliver').DataTable({
    "paging": true,
    "pageLength": 10
});
$('#myTableProduct').DataTable({
    "paging": true,
    "pageLength": 10
});
$('#myTableProductDeliverIR').DataTable({
    "paging": true,
    "pageLength": 10
});
$('#myTableVerifyPOD').DataTable({
    "paging": true,
    "pageLength": 10
});
$('#myTableAgencyInvoice').DataTable({
    "paging": true,
    "pageLength": 10
});
$('#myTableHSNInvoice').DataTable({
    "paging": true,
    "pageLength": 10
});




//Get Record for a Main Table List
async function recordlist() {

    var filterata = {
        FilterId1: '0',
        FilterId2: 'AgencyId',
        FilterId3: 'DeptId',
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getOrderProcessingList', filterata, '#myTableOrderProcess', 'N');
        bindDatatableOrderProcessingList(records, '#myTableOrderProcess');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}


//Bind get record  in a table PO Verification
function bindDatatableOrderProcessingList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;


        tbody.append(`<tr
                          data-saleorderid="${value.SaleOrderId}" data-purchaseordernoid="${value.PurchaseOrderNoId}" 
                         >
                        <td>${SrNo}</td>
                         
                         <td>${value.PurchaseOrderDate}</td>
                        <td>${value.DepartmentName}</td>
                        <td>${value.AgencyName}</td>
                        <td>${value.Amount.toFixed(2)}</td>
                        <td>${value.DepartmentAmtReceived.toFixed(2)}</td>
                        <td> <i class="bi bi-file-earmark-text text-danger fs-3"></i></td>
                        <td><i class="fa fa-map-marker-alt text-danger fa-2x deliveryAdd"</i></td> 
                       <td><i class="fa fa-eye text-danger fa-2x ViewDetails"></i></td> 
                         <td><i class="fa fa-print text-success fa-2x printInvoice"></i></td>
                         <td><i class="bi bi-truck addLocation fs-1 text-danger"></i></i></td>
                         <td><i class="bi bi-file-earmark-check fs-1 verifyIcon" style="cursor:pointer;"></i></td>
                         <td><button class="btn btn-danger btnInvoice">AgencyInvoice</button></td>
                         <td><i class="bi bi-clipboard-data fs-3 text-danger"></i></td>
                         <td><i class="fa fa-eye text-danger fa-2x AgencyPayment"></i></td>
                         
                          
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
// Open Add Location Model
$(document).on('click', '.deliveryAdd', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');
    OrderId = saleOrderId;

    alert(saleOrderId);

    recordAddLocationList(saleOrderId);
    recordAddDeliveryAddressList(saleOrderId);

    var myModal = new bootstrap.Modal(document.getElementById('myModalAddLocation'));
    myModal.show();
});
//Get Record for A table 
async function recordAddLocationList(saleOrderId) {

    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'getAddLocationList', filterata, '#myModalAddLocation', 'N');
        bindDatatableAddLocation(records, '#myTableAddLocation');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table item description
function bindDatatableAddLocation(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`<tr
                        data-productid="${value.ProductId}"   data-itemdetailsid="${value.ItemDetailsId}" 
                         >
                         <td>${SrNo}</td>
                         <td><input type="checkbox" class="rowCheckbox"></td>
                        
                        
                        <td>${value.ItemDetailsId}</td>
                        <td>${value.ProductName}</td>
                        <td>${value.OrderQty}</td>
                        <td>${value.AvailableQuantity}</td>
                       <td>
    <input type="text" class="form-control deliveryQuantity" value="${value.DeliveryQuantity}" />
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
    // Select All checkbox POD
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

    //hideModalLoader();
    $(document).on('click', '.btnModalReset', function () {

        // Clear all input fields inside modal
        $('#myTableAddLocation1 input').val('');
        $('#myTableAddLocation1 textarea').val('');
        $('#myTableAddLocation1 select').prop('selectedIndex', 0);

    });
}
//Get Record for A table 
async function recordAddDeliveryAddressList(saleOrderId) {

    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'getAddDeliveryAddressList', filterata, '#myModalAddLocation', 'N');
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
                        <td> <button class="btn btn-lg btn-danger deleteBtn">
    <i class="fa-solid fa-trash"></i>
</button></td>
                     
                       
        `);
    });

    $(tableId).DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        responsive: true
    });



    // MsgBox on Click event on Delete Icon 
    $(document).on('click', '.deleteBtn', async function () {
        var row = $(this).closest('tr');

        var orderdeliveryid = row.data('orderdeliveryid');

        console.log("Delete Id:", orderdeliveryid);

        if (!orderdeliveryid) {
            toastr.error("orderdeliveryid not found");
            return;
        }

        var isConfirmed = await DeleteEditBox("Delete Record", "Do you want to delete this record?", "question");

        if (isConfirmed) {
            await deletedeliveryidRecord(orderdeliveryid);
        }

    });

}
// Delete Records Function
async function deletedeliveryidRecord(orderdeliveryid) {
    alert(orderdeliveryid);
    try {

        let formData = new FormData();

        formData.append("FilterId1", orderdeliveryid);





        let res = await acceptUpdate("HardwareOrder", "DeleteConsigneeAddress", formData);

        if (res.success) {
            MsgBox('Sale Order', res.message, '');
            recordAddLocationList(saleOrderId);
            recordAddDeliveryAddressList(saleOrderId);

            //toastr.success(res.message);

            //  recordlist(); // reload table

        } else {

            toastr.error(res.message || "Delete failed");

        }

    } catch (err) {

        console.error("Delete error:", err);
        toastr.error("Server error while deleting");

    }

}
// Open Modal Order Detail
$(document).on('click', '.ViewDetails', function () {

    var row = $(this).closest('tr');
    var PurchaseOrderNoId = row.data('purchaseordernoid');


    alert(PurchaseOrderNoId);

    recordOrderDetaillist(PurchaseOrderNoId);


    var myModal = new bootstrap.Modal(document.getElementById('myModalOrderDetail'));
    myModal.show();
});
// get Record for A Table Order Detail
async function recordOrderDetaillist(PurchaseOrderNoId) {

    var filterata = {
        FilterId1: PurchaseOrderNoId,
        FilterId2: '0',
        FilterId3: '0',
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getOrderViewList', filterata, '#myModalOrderDetail', 'N');
        bindDatatableOrderDetails(records, '#myTableViewDetails');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}

//Bind get record  in a table Order Detail
function bindDatatableOrderDetails(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        var data = `<td>
        <label class="form-label fw-bold">Expected Delivery Date</label>
        <input type="date" class="form-control expectedDate">
        <button type="button" class="btn btn-danger btnSubmitExpDate w-100">
            Submit
        </button>
    </td>`;

        if (value.IsEstimatedDate == "Y") {
            data = `<td>${value.EstimatedDate}</td>`
        }


        tbody.append(`<tr
                         data-id="${value.Id}" 
                         >
                        <td>${SrNo}</td>

                        <td>${value.ProductName}</td>
                        <td>${value.Quantity}</td>
                        <td>₹${value.BaseAmt}<br>₹${value.SGSTAmt}<br>₹${value.CGSTAmt}<br>₹${value.Total}</td>
                           ${data} 
                        
                       
                       
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
// Submit expected date
$(document).on('click', '.btnSubmitExpDate', function () {

    var row = $(this).closest('tr'); // get current row

    var expectedDate = row.find('.expectedDate').val(); // get input value

    var purchaseOrderId = row.data('id'); // optional (your data)

    //alert("Date: " + expectedDate);
    //alert("Order ID: " + purchaseOrderId);
    SubmitExpectedDeliveryDate(expectedDate, purchaseOrderId);

});
// get Submit record

async function SubmitExpectedDeliveryDate(expectedDate, purchaseOrderId) {
    //alert("Date: " + expectedDate);
    //alert("Order ID: " + purchaseOrderId);


    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    var ExpectedDate = {

        Id: purchaseOrderId,
        EstimatedDate: expectedDate,



    };
    // Prepare data

    var formData = new FormData();
    formData.append("ExpectedDate", JSON.stringify(ExpectedDate));


    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwarePurchase',
            'SubmitExpectedDeliveryDate',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            //recordOrderDetaillist(PurchaseOrderNoId);

            resetModal();
            // $("#myTable1 tbody").empty();
        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}
// Open Add Location Model
$(document).on('click', '.addLocation', function () {
    showPODModal();
    var row = $(this).closest('tr');
    purchaseorderid = row.data('purchaseordernoid');


    alert(purchaseorderid);

    recordProductDeliverylist1(purchaseorderid);
    recordProductDeliveryItem(purchaseorderid);



    var myModal = new bootstrap.Modal(document.getElementById('myModalProductDelivery'));
    myModal.show();
});
// get Record for A Table Product Delivery
async function recordProductDeliverylist1(PurchaseOrderNoId) {

    var filterata = {
        FilterId1: PurchaseOrderNoId,
        FilterId2: '0',
        FilterId3: '0',
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getProductDeliveryList1', filterata, '#myModalProductDelivery', 'N');

        bindDatatableProductDelivery(records, '#myTableProduct');
        $('#txtIRContact').val('');
        /* bindDatatableProductDeliveryItemIR(records, '#myTableProductDeliverIR');*/
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
// Bind data in a Table Product Delivery
function bindDatatableProductDelivery(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;
        let data = `<tr>
    <td>1</td>
    <td>
        <button class="btn btn-primary btnAction">Action</button>
    </td>
</tr>`;

        $("#tbody").append(data);

        tbody.append(`<tr
                         data-purchaseorderno="${value.PurchaseOrderNo}" 
                         data-orderdeliveryid="${value.OrderDeliveryId}" 
                         >
                        <td>${SrNo}</td>

                        <td>${value.ProductName}</td>
                        <td>${value.ConsigneeName}<BR>${value.ConsigneeAddress}</td>
                        <td>${value.DeliveryQuantity}</td>
                        <td>${value.DeliveryDate}</td>
                        <td>${value.ContactNo}</td>
                        <td>${value.POD}</td>
                        <td>${value.IR}</td>
                        <td> <button class="btn btn-primary btnAction">Action</button></td>

                          
                        (/tr)
                       
                       
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
// click on Action button deleted data of Product delivery Item
$(document).on('click', '.btnAction', async function () {
    var row = $(this).closest('tr');

    var purchaseorderno = row.data('purchaseorderno');
    var orderdeliveryid = row.data('orderdeliveryid');

    // console.log("Delete Id:", purchaseorderno);

    if (!orderdeliveryid) {
        // toastr.error("purchaseorderno not found");
        return;
    }

    var isConfirmed = await DeleteEditBox("Delete Record", "Do you want to delete this record?", "question");

    if (isConfirmed) {
        await DeletedProductdeliveryItemPodIr(orderdeliveryid, purchaseorderno);
    }

});
// Delete Records Function
async function DeletedProductdeliveryItemPodIr(orderdeliveryid, purchaseorderno) {
    // alert(purchaseorderno);
    try {

        let formData = new FormData();

        formData.append("FilterId1", orderdeliveryid);
        formData.append("FilterId2", 0);





        let res = await acceptUpdate("HardwarePurchase", "DeleteProductDeliveryItemRecord", formData);

        if (res.success) {
            MsgBox('Purchase Order', res.message, '');
            recordProductDeliverylist1(PurchaseOrderNoId);
            recordProductDeliveryItem(PurchaseOrderNoId);

            //toastr.success(res.message);

            //  recordlist(); // reload table

        } else {

            toastr.error(res.message || "Delete failed");

        }

    } catch (err) {

        console.error("Delete error:", err);
        toastr.error("Server error while deleting");

    }

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

//hideModalLoader();
$(document).on('click', '.btnModalReset', function () {

    // Clear all input fields inside modal
    $('#myTableProductDeliver input').val('');
    $('#myTableProductDeliver textarea').val('');
    $('#myTableProductDeliver select').prop('selectedIndex', 0);

});
// get contact number for POD
$(document).on('change', '#ddlConsigneeAddr', function () {
    let id = $(this).val();
    recordProductDeliveryItem(id)
    // getContactNo(id);
});
// get contact number for IR
$(document).on('change', '#ddlIRConsigneeAddr', function () {
    let id = $(this).val();
    alert('dfdf');
    recordProductDeliveryItemIR(id);



});
// get Record for A Table Product Delivery Item  for upload ir
async function recordProductDeliveryItemIR(ConsigneeAddr) {

    var filterata = {
        FilterId1: 54,//purchaseorderid
        FilterId2: '0',
        FilterId3: '0',
        FilterName1: ConsigneeAddr,
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getProductDeliveryItemIR', filterata, '#myModalProductDelivery', 'N');
        bindDatatableProductDeliveryItemIR(records, '#myTableProductDeliverIR');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
// get Record to fill
async function getContactNo(id) {

    console.log("Selected ID:", id);

    var filterata = {
        FilterId1: id,      // ✅ use id here
        FilterId2: 0,       // or correct qty if needed
        FilterId3: 0,
        FilterName1: '',
    };

    try {
        let records = await getRecords('HardwarePurchase', 'GetConsigneeContactRecord', filterata, '', 'N');

        console.log("Records:", records);

        if (records && records.length > 0) {
            let data = records[0];

            $("#Rate").val(data.ProductPrice);
            $("#TotalRate").val(data.TotalPrice);
        } else {
            console.log("No data found");
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}
// get Record for A Table Product Delivery Item POd
async function recordProductDeliveryItem(ConsigneeAddr) {

    var filterata = {
        FilterId1: 54,//purchaseorderid
        FilterId2: '0',
        FilterId3: '0',
        FilterName1: ConsigneeAddr,
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getProductDeliveryItem', filterata, '#myModalProductDelivery', 'N');

        bindDatatableProductDeliveryItem(records, '#myTableProductDeliver');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
// Bind data in a Table Product Delivery POd
function bindDatatableProductDeliveryItem(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        var availabelqty = 0
        availabelqty = parseFloat(value.DeliveryQty) - parseFloat(value.DeliveredQty);
        let SrNo = i + 1;
        $('#txtContactPod').val(value.ContactNo);

        // $('#ddlIRConsigneeAddr').val(value.ConsigneeAddr);

        tbody.append(`
        <tr data-orderdeliveryid="${value.OrderDeliveryId}" data-orderdetailsid="${value.OrderDetailsId}" data-productid="${value.ProductId}"data-itemdetailsid="${value.ItemDetailsId}">
            <td>${SrNo}</td>
            <td><input type="checkbox" class="rowCheckbox"></td>
            <td>${value.ProductName || ''}</td>
            <td class='availabelqty'>${availabelqty.toFixed(2)}</td>
           
            <td><input type="text" class="form-control deliveredQty"></td>
                      
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

$(document).on("blur", ".deliveredQty", function () {

    let row = $(this).closest('tr');

    let value = $(this).val().trim();

    //// ❗ Handle empty input separately
    //if (value === '') {
    //    alert("Please enter Delivered Quantity");
    //    $(this).focus();
    //    return;
    //}

    //let deliveredQty = parseFloat(value);
    //let availableQty = parseFloat(row.find('.availableQty').text()) || 0;

    //// ❗ Single correct validation
    //if (isNaN(deliveredQty) || deliveredQty <= 0 || deliveredQty > availableQty) {
    //    alert("Enter valid qty (1 to " + availableQty + ")");
    //    $(this).val('').focus();
    //    return;
    //}

    //// ✅ Valid case
    //let remaining = availableQty - deliveredQty;
    //row.find('.remainingQty').text(remaining);

});// This function is used to submit Item Delivery Detail
$(document).on("click", ".btnModelDeliverySubmit", function () {
    //alert("Button clicked");
    SubmitItemDeliveryRecord();
});

//Submit Delivery Item Report IR/POD
function getSelectedData() {

    var selectedDeliveredItems = [];

    $('.rowCheckbox:checked').each(function () {

        var row = $(this).closest('tr');
        var productid = row.data('productid');
        var orderdeliveryid = row.data('orderdeliveryid');
        var ordredetailsid = row.data('orderdetailsid');
        var itemdetailsid = row.data('itemdetailsid');
        var deliveredQuantity = row.find('.deliveredQty').val();


        var item = {
            OrderDetailsId: ordredetailsid,
            OrderDeliveryId: orderdeliveryid,
            ProductId: productid,
            DeliveredQty: deliveredQuantity,
            ConsigneeName: $('#txtConsignee').val(),
            ConsigneeContactNo: $('#txtContact').val(),
            DeliveredDate: $('#podDate').val(),
            consigneeAddress: $('#txtAreaConsigneeAddr').val(),

        };

        selectedDeliveredItems.push(item);
    });

    return selectedDeliveredItems;
}
async function SubmitItemDeliveryRecord() {

    let isValid = true;
    let POD = $("#PODAttachment").get(0);
    let IR = $("#InstallationReport").get(0);
    let files = POD.files;
    let files1 = IR.files;




    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    let ConsigneeName = $("#ddlConsigneeAddr").val();
    let ContactNo = $("#txtContact").val();
    let PODDate = $("#podDate").val();


    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (ConsigneeName === "") {
        $("#ddlConsigneeAddr").addClass("is-invalid");
        $("#ddlConsigneeAddr").siblings(".error").text("Consignee Name is required.");
        isValid = false;
    }
    if (ContactNo === "") {
        $("#txtContact").addClass("is-invalid");
        $("#txtContact").siblings(".error").text("Enter Please Contact No.");
        isValid = false;
    }
    if (PODDate === "") {
        $("#podDate").addClass("is-invalid");
        $("#podDate").siblings(".error").text("Select POD Date.");
        isValid = false;
    }



    //var ItemDetail = {
    //    SaleOrderId: OrderId,
    //    SaleOrderNo: '0',
    //    SaleOrderNoText: '0',
    //    OrderDate: $("#deptOrderDate").val(),




    //    Items: items
    //};
    // Prepare data
    var fileSize = 10

    var isValid1 = fileSizeValidation('PODAttachment', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        return;
    }
    let allowedExtensions = ["jpg", "jpeg", "pdf", "xlsx"];



    var newFileName = getNewFileName('PODAttachment', "POD")
    var newFileName1 = getNewFileName('InstallationReport', "IR")



    var formData = new FormData();




    isValid1 = fileSizeValidation('InstallationReport', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        return;
    }

    var DeliveredItems = {
        PurchaseOrderNo: purchaseorderid,
        Items: getSelectedData()
    };

    alert(JSON.stringify(DeliveredItems));
    //  return;




    formData.append("ItemDetail", JSON.stringify(DeliveredItems));

    if ($("#PODAttachment")[0].files.length > 0) {
        formData.append("POD", $("#PODAttachment")[0].files[0], newFileName);
    }

    if ($("#InstallationReport")[0].files.length > 0) {
        formData.append("IR", $("#InstallationReport")[0].files[0], newFileName1);
    }


    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwarePurchase',
            'SubmitItemProductDelivery',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            resetModal();
            $("#myTableProductDeliver tbody").empty();
        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}

// Select All checkbox IR
$(document).on('change', '#selectAllIR', function () {
    $('.rowCheckboxIR').prop('checked', $(this).prop('checked'));
});
$(document).on('change', '.rowCheckboxIR', function () {
    if (!$(this).prop('checked')) {
        $('#selectAllIR').prop('checked', false);
    } else {
        // Check if all checkboxes are checked
        if ($('.rowCheckboxIR:checked').length === $('.rowCheckboxIR').length) {
            $('#selectAllIR').prop('checked', true);
        }
    }
});

// Show Modal when click button POD 
$(document).on('click', '.btnPod', function () {
    let id = $(this).val();
    showPODModal();
});
function showPODModal() {
    // IR modal hide
    $('#IRDiv').hide();

    // POD modal show
    $('#PODDiv').show();
}
// Show Modal when click button IR 
$(document).on('click', '.btnIr', function () {
    let id = $(this).val();
    showIRModal();
});
function showIRModal() {
    // IR Div show
    $('#IRDiv').show();

    // POD Div hide
    $('#PODDiv').hide();
}

// Bind data in a Table Product Delivery IR
function bindDatatableProductDeliveryItemIR(records, tableId) {


    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();


    $.each(records, function (i, value) {
        var availabelqty = 0;

        availabelqty = parseFloat(value.DeliveryQuantity) - parseFloat(value.DeliveredQty);
        $('#txtIRContact').val(value.ContactNo);

        let SrNo = i + 1;

        tbody.append(`
        <tr data-orderdeliveryid="${value.OrderDeliveryId}" data-orderdetailsid="${value.OrderDetailsId}" data-productid="${value.ProductId}"data-itemdetailsid="${value.ItemDetailsId}">
            <td>${SrNo}</td>
            <td><input type="checkbox" class="rowCheckboxIR"></td>
            <td>${value.ProductName || ''}</td>
            <td>${value.DeliveredQty}</td>
           
           
                      
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

// This function is used to submit Record IR
$(document).on("click", ".btnModelIRSubmit", function () {
    //alert("Button clicked");
    SubmitRecordIR();
});

//Submit Delivery Item Report IR/POD
function getSelectedData() {

    var selectedDeliveredItems = [];

    $('.rowCheckbox:checked').each(function () {

        var row = $(this).closest('tr');
        var productid = row.data('productid');
        var orderdeliveryid = row.data('orderdeliveryid');
        var ordredetailsid = row.data('orderdetailsid');
        var itemdetailsid = row.data('itemdetailsid');
        var deliveredQuantity = row.find('.deliveredQty').val();


        var item = {
            OrderDetailsId: ordredetailsid,
            OrderDeliveryId: orderdeliveryid,
            ProductId: productid,
            DeliveredQty: deliveredQuantity,
            ConsigneeName: $('#txtConsignee').val(),
            ConsigneeContactNo: $('#txtContact').val(),
            DeliveredDate: $('#podDate').val(),
            consigneeAddress: $('#txtAreaConsigneeAddr').val(),

        };

        selectedDeliveredItems.push(item);
    });

    return selectedDeliveredItems;
}
async function SubmitRecordIR() {

    let isValid = true;

    let IR = $("#InstallationReport").get(0);
    let files = POD.files;
    let files1 = IR.files;




    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    let ConsigneeName = $("#ddlConsigneeAddr").val();
    let ContactNo = $("#txtContact").val();
    let PODDate = $("#podDate").val();


    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (ConsigneeName === "") {
        $("#ddlConsigneeAddr").addClass("is-invalid");
        $("#ddlConsigneeAddr").siblings(".error").text("Consignee Name is required.");
        isValid = false;
    }
    if (ContactNo === "") {
        $("#txtContact").addClass("is-invalid");
        $("#txtContact").siblings(".error").text("Enter Please Contact No.");
        isValid = false;
    }
    if (PODDate === "") {
        $("#podDate").addClass("is-invalid");
        $("#podDate").siblings(".error").text("Select POD Date.");
        isValid = false;
    }
    var fileSize = 10

    var isValid1 = fileSizeValidation('PODAttachment', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        return;
    }
    let allowedExtensions = ["jpg", "jpeg", "pdf", "xlsx"];



    var newFileName = getNewFileName('PODAttachment', "POD")
    var newFileName1 = getNewFileName('InstallationReport', "IR")



    var formData = new FormData();




    isValid1 = fileSizeValidation('InstallationReport', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        return;
    }

    var DeliveredItems = {
        PurchaseOrderNo: purchaseorderid,
        Items: getSelectedData()
    };

    alert(JSON.stringify(DeliveredItems));
    //  return;




    formData.append("ItemDetail", JSON.stringify(DeliveredItems));

    if ($("#PODAttachment")[0].files.length > 0) {
        formData.append("POD", $("#PODAttachment")[0].files[0], newFileName);
    }

    if ($("#InstallationReport")[0].files.length > 0) {
        formData.append("IR", $("#InstallationReport")[0].files[0], newFileName1);
    }


    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwarePurchase',
            'SubmitRecordIRUpload',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            resetModal();
            $("#myTableProductDeliver tbody").empty();
        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}

// Open POD/IR verify Model
$(document).on("click", ".verifyIcon", function () {
    //alert("File Verified ✅");

    // Example: change color after click
    $(this).addClass("text-success");
    var row = $(this).closest('tr');
    purchaseorderid = 21; //row.data('purchaseordernoid');


    alert(purchaseorderid);

    recordVerifyPODList(purchaseorderid);
    recordProductDeliveryItem(purchaseorderid);



    var myModal = new bootstrap.Modal(document.getElementById('myModalVerifyPOD'));
    myModal.show();

});
// get Record for A Table Verify POD/IR
async function recordVerifyPODList(PurchaseOrderNoId) {

    var filterata = {
        FilterId1: PurchaseOrderNoId,
        FilterId2: '0',
        FilterId3: '0',
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getVerifyPODList', filterata, '#myModalVerifyPOD', 'N');

        bindDatatableVerifyPODList(records, '#myTableVerifyPOD');
        //$('#txtIRContact').val('');

    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
// Bind data in a Table Verify POD/IR
function bindDatatableVerifyPODList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;
        let IsPod = '<input type="checkbox" class="rowCheckbox podVerify">';
        let IsIR = '<input type="checkbox" class="rowCheckbox irVerify">';
        let btnVerify = '<button class="btn btn-primary btnVerify">Verify</button>';
        if (value.IsPOdVerified == 'Y') {
            //IsPod = '<input type="checkbox" checked disabled class="rowCheckbox podVerify">';
            IsPod = '<i class="bi bi-check text-success fs-1" ></i>';
        }
        if (value.IsIRVerified == 'Y') {
            //  IsIR = '<input type="checkbox" checked disabled class="rowCheckbox irVerify">';
            IsIR = '<i class="bi bi-check text-success fs-1"></i>';
        }
        if (value.IsPOdVerified == 'Y' && value.IsIRVerified == 'Y') {
            btnVerify = '<i class="bi bi-shield-check text-success fs-1"></i> <div class="fw-bold text-success">Verified</div>';
        }
        let data = `<tr>
    <td>1</td>
    <td>
        <button class="btn btn-primary btnAction">Action</button>
    </td>
</tr>`;

        $("#tbody").append(data);

        tbody.append(`<tr
                         data-purchaseorderno="${value.PurchaseOrderNo}" 
                         data-orderdeliveryid="${value.OrderDeliveryId}" 
                         data-itemdetailsid="${value.ItemDetailsId}" 
                         >
                        
                        <td>${SrNo}</td>

                        <td>${value.ProductName}</td>
                        <td>${value.ConsigneeName}<BR>${value.ConsigneeAddress}</td>
                        <td>${value.DeliveryQuantity}</td>
                        <td>${value.DeliveryDate}</td>
                        <td>${value.ContactNo}</td>
                        <td class="text-center">
    <a href="javascript:void(0);" class="view-filePOD" data-file="${value.POD}" data-folder="ProductDelivery/POD" title="View POD">
        <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size:25px;"></i>
    </a>
</td>
                        <td class="text-center">
    <a href="javascript:void(0);" class="view-fileIR" data-file="${value.IR}" data-folder="ProductDelivery/IR" title="View IR">
        <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size:25px;"></i>
    </a></td>
                        <td>${IsPod}</td>
                        <td>${IsIR}</td>
                        <td>${btnVerify}</td>

                          
                        (/tr)
                       
                       
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
// View Uploaded POD file conditions 
$(document).on('click', '.view-filePOD', function (e) {
    e.preventDefault(); // Prevent default <a> behavior

    var fileName = $(this).data('file');
    var folder = $(this).data('folder');

    if (!fileName || fileName === 'undefined' || fileName === '') {
        toastr.error('File not uploaded');
        return;
    }

    // Construct URL
    //var url = /Attachment/DeptAttendance/${folder}/${fileName};
    var url = `/Attachment/${folder}/${fileName}`;

    // Open in new tab
    window.open(url, '_blank');
});
// View Uploaded IR file conditions 
$(document).on('click', '.view-fileIR', function (e) {
    e.preventDefault(); // Prevent default <a> behavior

    var fileName = $(this).data('file');
    var folder = $(this).data('folder');

    if (!fileName || fileName === 'undefined' || fileName === '') {
        toastr.error('File not uploaded');
        return;
    }

    // Construct URL
    //var url = /Attachment/DeptAttendance/${folder}/${fileName};
    var url = `/Attachment/${folder}/${fileName}`;

    // Open in new tab
    window.open(url, '_blank');
});
// Submit POD/IR verify
$(document).on('click', '.btnVerify', function () {

    var row = $(this).closest('tr'); // get current row



    SubmitVerifyPOD(row);

});
// get Submit Record POD/IR verify
async function SubmitVerifyPOD(row) {

    var orderdetailsId = $(row).data('itemdetailsid');
    var orderdeliveryId = $(row).data('orderdeliveryid');
    var isirverified = '';
    var ispodverified = '';
    if (!((row.find(".podVerify").length > 0 && row.find(".rowCheckbox").prop("checked")) || (row.find(".irVerify").length > 0 && row.find(".irVerify").prop("checked")))) {
        alert('Please check  box before click on submit');
        return;
    }
    if (row.find(".podVerify").length > 0 && row.find(".rowCheckbox").prop("checked")) // get input value) && $(".podVerify").prop("checked")
    {
        ispodverified = 'Y';
    }


    if (row.find(".irVerify").length > 0 && row.find(".irVerify").prop("checked"))// get input value)  && $(".IsIRVerified").prop("checked")
    {
        isirverified = 'Y'
    }


    alert(orderdetailsId);
    var VerifyPOD = {
        OrderDetailsId: orderdetailsId,
        OrderDeliveryId: orderdeliveryId,
        IsPODVerified: ispodverified,
        IsIRVerified: isirverified
    };
    // Prepare data

    var formData = new FormData();
    formData.append("VerifyPOD", JSON.stringify(VerifyPOD));


    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwarePurchase',
            'SubmitVerifyPODRecord',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            let PurchaseOrderNoId = purchaseOrderId;
            recordVerifyPODList(purchaseOrderId); // ✅ best

            resetModal();
            $("#myTableVerifyPOD tbody").empty();
        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}
// Open Modal Agency Invoice
$(document).on('click', '.btnInvoice', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');
    OrderId = saleOrderId;

    alert(saleOrderId);
    getAgencyInvoiceRecord();

    recordAgencyInvoiceList(saleOrderId);
    // recordAddDeliveryAddressList(saleOrderId);

    var myModal = new bootstrap.Modal(document.getElementById('myModalAgencyInvoice'));
    myModal.show();
});
// get Record to fill data Agency Invoice
async function getAgencyInvoiceRecord(id) {

    console.log("Selected ID:", id);

    var filterata = {
        FilterId1: 15,      // ✅ use id here
        FilterId2: 0,       // or correct qty if needed
        FilterId3: 0,
        FilterName1: '',
    };

    try {
        let records = await getRecords('HardwarePurchase', 'GetAgencyInvoiceFillRecord', filterata, '', 'N');

        console.log("Records:", records);

        if (records && records.length > 0) {
            let data = records[0];

            $("#txtAgencyName").val(data.AgencyName);
            $("#txtDeptName").val(data.departmentName);
            $("#BillingAddr").val(data.BillingAddress);
            $("#txtSaleNo").val(data.SaleNo);
            $("#txtOrderNo").val(data.SaleOrderId);
        } else {
            console.log("No data found");
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}
// get Record for A Table Agency Invoice
async function recordAgencyInvoiceList(PurchaseOrderNoId) {

    var filterata = {
        FilterId1: '15',
        FilterId2: '0',
        FilterId3: '0',
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getAgencyInvoiceList', filterata, '#myModalAgencyInvoice', 'N');

        bindDatatableAgencyInvoiceRecord(records, '#myTableAgencyInvoice');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
// Bind data in a Table Agency Invoice
function bindDatatableAgencyInvoiceRecord(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        var CAddress = value.ConsigneeName + ',' + value.ConsigneeAddress;
        /*$('#txtAgencyName').val(value.)*/
        tbody.append(`<tr
                         data-purchaseorderno="${value.PurchaseOrderNo}" 
                         data-orderdeliveryid="${value.OrderDeliveryId}" 
                         >
                        <td>${SrNo}</td>
                        <td><input type="checkbox" class="InvoiceSelectAll"></td>                      
                        <td>${value.ProductName}</td>
                        <td>${CAddress}</td>
                        <td>${value.DeliveredDate}</td>
                        <td>${value.DeliveredQty}</td>
                      
                        (/tr)
                       
                       
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
// Submit Generate Product List
$(document).on('click', '.btnModalGenerate', function () {
    alert("Generate Product List clicked!");

    // Your logic here
    generateProductList1();
});
async function generateProductList1() {

    var DeliveredItems = {
        PurchaseOrderNo: 15,
        Items: getSelectedAgencyInvData()
    };

    var formData = new FormData();
    formData.append("ItemDetail", JSON.stringify(DeliveredItems));

    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwarePurchase',
            'GenerateProductListRecord1',
            formData
        );

        if (res.success) {

            MsgBox('Message', res.message, '');

            // ✅ Clear table
            $("#myTableHSNInvoice tbody").empty();

            // ✅ Bind data to table
            if (res.data && res.data.length > 0) {

                $.each(res.data, function (i, item) {

                    let row = `
                        <tr>
                            <td>${item.ProductId}</td>
                            <td>${item.ProductName}</td>                             
                            <td>${item.Qty}</td>
                            <td>${item.productprice}</td>
                            <td>${item.GstP}</td>
                            
                        </tr>
                    `;

                    $("#myTableHSNInvoice tbody").append(row);
                });
            }
        }
        else {
            MsgBox('Message', res.message, 'Error');
        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }
}
function getSelectedAgencyInvData() {

    var selectedInvoiceItems = [];

    $('.InvoiceSelectAll:checked').each(function () {

        var row = $(this).closest('tr');


        var OrderDeliveryId = row.data('orderdeliveryid');
        //var deliveredQuantity = row.find('.deliveredQty').val();


        var item = {
            OrderDeliveryId: OrderDeliveryId,

        };

        selectedInvoiceItems.push(item);
    });

    return selectedInvoiceItems;
}
// get Generate Product list
async function generateProductList() {
    alert(JSON.stringify(getSelectedAgencyInvData()));
    return;
    let isValid = true;
    let POD = $("#PODAttachment").get(0);

    let files = POD.files;





    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");



    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");








    var fileSize = 10

    var isValid1 = fileSizeValidation('PODAttachment', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        return;
    }
    let allowedExtensions = ["jpg", "jpeg", "pdf", "xlsx"];



    var newFileName = getNewFileName('PODAttachment', "POD")
    var formData = new FormData();







    var DeliveredItems = {
        PurchaseOrderNo: purchaseorderid,
        Items: getSelectedAgencyInvData()
    };

    alert(JSON.stringify(DeliveredItems));
    //  return;




    formData.append("ItemDetail", JSON.stringify(DeliveredItems));

    if ($("#PODAttachment")[0].files.length > 0) {
        formData.append("POD", $("#PODAttachment")[0].files[0], newFileName);
    }




    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwarePurchase',
            'GenerateProductListRecord',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            resetModal();
            $("#myTableProductDeliver tbody").empty();
        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}



























