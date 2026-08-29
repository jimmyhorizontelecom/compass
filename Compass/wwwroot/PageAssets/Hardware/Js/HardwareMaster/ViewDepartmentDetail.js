var Id = 0, tabIdNo = 1;
var OrderId = 0;


function showDiv(divId) {

    $("#newSaleDiv, #listDiv").hide();
    $("#" + divId).show();

    $("button").removeClass("active");

    if (divId === "newSaleDiv") {
        $(".btn-primary").addClass("active");
    } else {
        $(".btn-success").addClass("active");
    }
}
$(document).ready(function () {

    $(document).ready(function () {

        $('#page-header').text('My Orders');
        var today = new Date().toISOString().split('T')[0];

        $("#deptOrderDate").attr("max", today);   // prevent future date
        $("#orderEntryDate").val(today);          // set today date

    });
    $('#myTableAddLocation').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });
    $('#myTableTrackViewStatus').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });
    $('#myTableExpectedDeliveryDate').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });


    $("#listDiv").show();

    recordlist();
    let srNo = 1;

    // bindData to ddlModeOfPayment
    // bindData to ddlBankName

    bindDataToDdl("HardwareDropdown", "HBankName_ddl", "myModalpayNow", "ddlBankName", " Bank Name ", 0, 0);
    bindDataToDdl("HardwareDropdown", "HPaymentMode_ddl", "myModalpayNow", "ddlModePayment", " Mode Of Payment");
    bindDataToDdl("HardwareDropdown", "HQuery_ddl", "myModalOrderQuery", "ddlQuery", " Query Type", 0, 0);






});
// get Record to fill data Sale Order
async function loadRecordById(selectedValue, qty) {

    var filterata = {
        FilterId1: selectedValue,
        FilterId2: qty,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'GetSaleOrder', filterata, '', 'N');

        if (records && records.length > 0) {

            let data = records[0];
            //Id = data.Id;
            $("#Rate").val(data.ProductPrice);
            $("#TotalRate").val(data.TotalPrice);
            $("#AdminCharge").val(data.HPSEDCCharges);
            $("#GST").val(data.Gst);
            $("#Total").val(data.Total);
            $("#Specification").val(data.Sepcification);
            //if (data.IsActive) {
            //    $('#IsActive').prop('checked', true);
            //}
            //else {
            //    $('#IsActive').prop('checked', false);
            //}

            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}


//Get Record for A table 
async function recordlist() {

    var filterata = {
        FilterId1: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'getSaleOrderList', filterata, '#myTable', 'N');
        bindDatatable(records, '#myTable');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})
//Bind get record  in a table 
function bindDatatable(records, tableId) {

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
                         <td>${value.DepartmentName}</td>
                        <td>${value.DepartmentName}</td>
                        <td>${value.DepartmentName}</td>
                          <td>
                           <i class="fa fa-map-marker-alt text-danger fa-2x deliveryAdd"
       data-bs-toggle="tooltip"
       data-bs-placement="top"
       title="View Delivery Address">
    </i>
                         </td>
                       <td><i class="fa fa-eye text-danger fa-2x itemDescription"></i></td>   
                        
                         <td>${value.GrandTotalAmt}</td>
                         <td><i class="fa fa-inr fa-2x text-success payNow"></i></td> 
                          <td><i class="fas fa-truck fa-2x text-danger trackingStatus "></i></td> 
                          <td><i class="fas fa-calendar-day fa-2x text-danger deliveryDate "></i></td> 
                          <td><i class="fas fa-list fa-2x text-danger deliveryDetails"></i></td> 
                          <td><i class="fa fa-clipboard-list fa-2x text-danger orderQuery"></i></i></td> 
                          <td><i class="fa fa-print text-success fa-2x printInvoice"></i></td> 
                          <td><i class="fa fa-comment text-info fa-2x feedback"></i></td> 
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
// Open Item description Modal
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
// Open Payment details Modal
$(document).on('click', '.payNow', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');

    alert(saleOrderId);
    OrderId = saleOrderId;
    loadRecordById(OrderId);
    recordPaymentDetailList(saleOrderId);

    var myModal = new bootstrap.Modal(document.getElementById('myModalpayNow'));
    myModal.show();
});
// get Record for a Table Payment
async function recordPaymentDetailList(saleOrderId) {

    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'SavePaymentDetailsList', filterata, '#myModalpayNow', 'N');
        bindDatatablePaymentDetail(records, '#myTablePaymemt');
    }
    catch (error) {
        console.error("Error loading records:", error);
        hideModalLoader();
    }
}

// get Record to fill data Sale Order

async function loadRecordById(SaleOrderId) {

    var filterata = {
        FilterId1: SaleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'GetSaleOrder', filterata, '', 'N');

        if (records && records.length > 0) {

            let data = records[0];
            //Id = data.Id;

            $("#txtReferenceNo").val(data.OrderReferenceNo);
            $("#txtDeptName").val(data.DepartmentName);
            $("#txtOrderAmt").val(data.OrderAmount);
            $("#txtAdvanceAmt").val(data.AdvanceAmount);
            $("#txtOutstandAmt").val(data.OutstandingAmount);


        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}

// Submit record when Click on btn
$(document).on('click', '.btnModalPaySubmit', function () {


    getSubmitDepartmentBal();
});
async function getSubmitDepartmentBal() {

    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");


    let TransactionId = $("#txtTransaction").val().trim();
    let PaymentDate = $("#transactionDate").val().trim();
    let ReleasedAmount = $("#txtPaymentAmt").val().trim();
    let Tds = $("#txtTDS").val().trim();
    let GstTds = $("#txtGSTTDS").val().trim();
    let ModeOfPayment = $("#ddlModePayment").val();
    let BankName = $("#ddlBankName").val();


    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    if (TransactionId === null) {
        $("#txtTransaction").addClass("is-invalid");
        $("#txtTransaction").siblings(".error").text("Enter Please Transaction Id");
        isValid = false;
    }
    if (PaymentDate === null) {
        $("#transactionDate").addClass("is-invalid");
        $("#transactionDate").siblings(".error").text("Select Payment Date");
        isValid = false;
    }
    if (ReleasedAmount === null) {
        $("#txtPaymentAmt").addClass("is-invalid");
        $("#txtPaymentAmt").siblings(".error").text("Enter Payment Amount");
        isValid = false;
    }
    if (Tds === '') {
        $("#txtTDS").addClass("is-invalid");
        $("#txtTDS").siblings(".error").text("Enter TDS ");
        isValid = false;
    }
    if (GstTds === '') {
        $("#txtGSTTDS").addClass("is-invalid");
        $("#txtGSTTDS").siblings(".error").text("Enter GSTTDS ");
        isValid = false;
    }
    if (ModeOfPayment === '') {
        $("#ddlModePayment").addClass("is-invalid");
        $("#ddlModePayment").siblings(".error").text("Select Mode Of Payment");
        isValid = false;

    }
    if (BankName === '') {
        $("#ddlBankName").addClass("is-invalid");
        $("#ddlBankName").siblings(".error").text("Select Bank Name");
        isValid = false;

    }

    var Payment = {

        ReceiptId: 0,
        SaleOrderId: OrderId,
        PurchaseOrderId: '0',
        TransactionId: $("#txtTransaction").val(),
        ModeOfPayment: $("#ddlModePayment").val() || "",
        BankNameId: parseInt($("#ddlBankName").val()) || 0,
        Narration: $('#txtareaRemark').val(),
        ReceivedDate: $("#transactionDate").val(),
        ReceivedAmt: $('#txtPaymentAmt').val(),
        BalanceAmt: parseFloat($('#txtOutstandAmt').val()) || 0,
        GSTTds2: parseFloat($('#txtGSTTDS').val()) || 0,
        Tds2: parseFloat($('#txtTDS').val()) || 0,

    };




    // Prepare data
    var fileSize = 10
    //let DeptDoct = $("#PaymentDoc").get(0);

    var isValid1 = fileSizeValidation('PaymentDoc', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        return;
    }
    let allowedExtensions = ["jpg", "jpeg", "pdf", "xlsx"];

    var newFileName = getNewFileName('PaymentDoc', "DeptPayment")

    var formData = new FormData();
    formData.append("Payment", JSON.stringify(Payment));

    if ($("#PaymentDoc")[0].files.length > 0) {
        formData.append("Attachment", $("#PaymentDoc")[0].files[0], newFileName);
    }


    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwareOrder',
            'AddOrEditDepartmentBal',
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


//Bind get record  in a table Payment
function bindDatatablePaymentDetail(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`<tr
                        data-orderdeliveryid="${value.ReceiptId}" 
                         >
                        <td>${SrNo}</td>

                        <td>${value.TransactionId}</td>
                        <td>${value.ModeOfPayment}</td>
                        <td>${value.ReleasedAmount}</td>
                        <td>${value.Tds}</td>
                        <td>${value.GstTds}</td>
                        <td>${value.PaymentDate}</td>
                        <td>${value.DueBalance}</td>
                        
                     
                       
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

// Open Tracking status Modal
$(document).on('click', '.trackingStatus', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');

    alert(saleOrderId);
    OrderId = saleOrderId;

    recordTrackingStatusList(saleOrderId);

    var myModal = new bootstrap.Modal(document.getElementById('myModaltrackingStatus'));
    myModal.show();
});
// get Record Table for Tracking View Status
async function recordTrackingStatusList(saleOrderId) {


    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };



    try {

        let records = await getRecords('HardwareOrder', 'getTrackingStatusList', filterata, '#myModaltrackingStatus', 'N');
        bindTrackDatatable(records, '#myTableTrackViewStatus');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}

// Bind get record  in a table  for Tracking Status
function bindTrackDatatable(records, tableId) {



    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;
        let statusClass = '';
        if (value.Status === 'G') {
            statusClass = 'statusGreen';   // Green
        } else if (value.Status === 'O') {
            statusClass = 'statusOrange';   // Orange
        }

        tbody.append(`<tr
                        data-saleorderid="${value.SaleOrderId}" 
                         >
                        <td>${SrNo}</td>
                        <td>${value.Milestone}</td>
                        <td class="text-center"><div id="divStatus" class="${statusClass}"></div></td>
                        <td>${value.CurrentStatus}</td>
                       
                       
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

// Open delivery Date Modal
$(document).on('click', '.deliveryDate', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');

    alert(saleOrderId);
    OrderId = saleOrderId;

    recordDeliveryDateList(saleOrderId);

    var myModal = new bootstrap.Modal(document.getElementById('myModaldeliveryDate'));
    myModal.show();
});
// get Record Table for Expected Delivery Date
async function recordDeliveryDateList(saleOrderId) {

    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'getDeliveryDateList', filterata, '#myModaldeliveryDate', 'N');
        bindDeliveryDateDatatable(records, '#myTableExpectedDeliveryDate');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table  for Delivery Date
function bindDeliveryDateDatatable(records, tableId) {

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
                        <td>${value.ItemName}</td>
                        <td>${value.SupplierName}<br>${value.ContactNo}<br>${value.EmailId}</td>
                        <td>${value.EstimatedDeliveryDate}</td>
                      
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

// Open delivery Details Modal
$(document).on('click', '.deliveryDetails', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');

    alert(saleOrderId);
    OrderId = saleOrderId;

    recordDeliveryDetailList(saleOrderId);

    var myModal = new bootstrap.Modal(document.getElementById('myModaldeliveryDetails'));
    myModal.show();
});
// get Record Table for Delivery Details 
async function recordDeliveryDetailList(saleOrderId) {

    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'getDeliveryDetailList', filterata, '#myModaldeliveryDetails', 'N');
        bindDeliveryDetailDatatable(records, '#myTableDeliveryDetails');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table  for Delivery Date
function bindDeliveryDetailDatatable(records, tableId) {

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
                        <td>${value.ProductName}</td>
                        <td>${value.ConsigneeName}<br>${value.Address}</td>
                        <td>${value.ContactNo}</td>
                        <td>${value.DeliveredQty}</td>
                        <td>${value.DeliveredDate}</td>
                        <td>${value.POD}</td>
                        <td>${value.IR}</td>
                      
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

// Open Order query Modal
$(document).on('click', '.orderQuery', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');

    OrderId = saleOrderId;
    // getSaleOrderNo1();
    recordOrderQueryList(saleOrderId);
    getSaleOrderNo(saleOrderId);

    var myModal = new bootstrap.Modal(document.getElementById('myModalOrderQuery'));
    myModal.show();

});
// get Record Table for Order Query
async function recordOrderQueryList(saleOrderId) {


    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {
        let records = await getRecords('HardwareOrder', 'getDataOrderQueryList', filterata, '#myModalOrderQuery', 'N');

        bindOrderQueryDatatable(records, '#myTableOrderQuery');

        // ✅ Open Modal Here
        var myModal = new bootstrap.Modal(document.getElementById('myModalOrderQuery'));
        myModal.show();

    } catch (error) {
        console.error("Error loading records:", error);
    }
}


//Bind get record  in a table  for Order Query
function bindOrderQueryDatatable(records, tableId) {


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
                        <td>${value.QueryType}</td>
                        <td>${value.QueryRemark}</td>
                        
                      
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
// get Record to fill data Order Query


async function getSaleOrderNo(SaleOrderId) {

    var filterata = {
        FilterId1: SaleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'GetSaleOrder', filterata, '', 'N');

        if (records && records.length > 0) {

            let data = records[0];
            //Id = data.Id;

            $("#txtOrderNo").val(data.SaleOrderNo);



        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}
// Submit record when Click on btn
$(document).on('click', '.btnModalQuerySubmit', function () {


    getSubmitOrderQuery();
});
async function getSubmitOrderQuery() {

    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");


    let QueryRemarks = $("#txtareaRemark").val().trim();



    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    if (QueryRemarks === null) {
        $("#txtareaRemark").addClass("is-invalid");
        $("#txtareaRemark").siblings(".error").text("Enter Please Query Remark");
        isValid = false;
    }



    var OrderQuery = {

        QId: 0,
        SaleOrderId: OrderId,
        QueryRemarks: $("#txtareaRemark").val() || ""




    };


    var formData = new FormData();
    formData.append("OrderQuery", JSON.stringify(OrderQuery));



    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwareOrder',
            'AddOrEditOrderQuery',
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



// Open Print Invoice Modal
$(document).on('click', '.printInvoice', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');

    alert(saleOrderId);
    OrderId = saleOrderId;

    // recordItemDesclist(saleOrderId);

    var myModal = new bootstrap.Modal(document.getElementById('myModalprintInvoice'));
    myModal.show();
});
// Open Feedback Modal
$(document).on('click', '.feedback', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');

    alert(saleOrderId);
    OrderId = saleOrderId;

    // recordItemDesclist(saleOrderId);

    var myModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
    myModal.show();
});
let rating = 0;

$('.star-rating i').on('click', function () {
    rating = $(this).data('value');

    $('.star-rating i').removeClass('active');

    $('.star-rating i').each(function () {
        if ($(this).data('value') <= rating) {
            $(this).addClass('active');
        }
    });
});


// Submit record feedback when Click on btn
$(document).on('click', '.btnModalFeedbackSubmit', function () {


    getSubmitFeedback();
});


async function getSubmitFeedback() {


    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");


    let Remark = $("#feedbackText").val().trim();



    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    if (Remark == '') {
        $("#feedbackText").addClass("is-invalid");
        $("#feedbackText").siblings(".error").text("Please Enter Your Feedback");
        isValid = false;
    }
    if (!isValid) return;



    var Feedback = {

        FeedBackId: 0,
        SaleOrderId: OrderId,
        FeedBackPoint: rating,
        Remarks: $("#feedbackText").val() || ""




    };


    var formData = new FormData();
    formData.append("Feedback", JSON.stringify(Feedback));



    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwareOrder',
            'AddOrEditFeedback',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            resetModal();
            closeModal('feedbackModal');

        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }



}
