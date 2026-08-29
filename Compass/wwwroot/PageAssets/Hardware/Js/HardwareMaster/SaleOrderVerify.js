var Id = 0, tabIdNo = 1;
var OrderId = 0;


$(document).ready(function () {





    recordSaleOrderDetails(55);



});
$('#myTableSaleViewDetail').DataTable({
    "paging": true,
    "pageLength": 10
});
//Get Record for  Multiple tables 
async function recordSaleOrderDetails(saleOrderId) {

    var filterata = {
        FilterId1: 55,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'getDataSaleOrderVerifyList', filterata, '#myModalAddLocation', 'N');
        if (records.SaleOrderDetails && records.SaleOrderDetails.length > 0) {

            bindDatatableSaleOrderDetails(records.SaleOrderDetails, '#myTableAddLocation2');
        }
        else {
            MsgBox('Sale Order Verify', 'Record Not Found1.', '');
        }
        if (records.ProductDetails && records.ProductDetails.length > 0) {

            bindDatatableProductDetails(records.ProductDetails, '#myTableProductDetail');

        }
        else {
            MsgBox('Sale Order Verify', 'Record Not Found2.', '');
        }
        if (records.ConsigneeAddress && records.ConsigneeAddress.length > 0) {

            bindDatatableConsigneeAddress(records.ConsigneeAddress, '#myTableConsigneeAddress');

        }
        else {
            MsgBox('Sale Order Verify', 'Record Not Found3.', '');
        }



    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table Sale Order Details
function bindDatatableSaleOrderDetails(records, tableId) {

    //if ($.fn.DataTable.isDataTable(tableId)) {
    //    $(tableId).DataTable().clear().destroy();
    //}

    //var tbody = $(tableId + " tbody");
    //tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;
        $('#txtHPSEDCReffNo').val(value.HWSaleOrderNo);
        $('#txtDeptName').val(value.DeptId);
        $('#txtBillingAddr').val(value.BillingAddressId);
        $('#txtReffrNo').val(value.LetterReferenceNo);
        $('#txtOrderDate').val(value.OrderDate);
        $('#txtEntryDate').val(value.CreatedDate);
        $('#txtTPrice').val(value.Total);
        $('#txtAdminCharge').val(value.AdminCharge);
        $('#txtGST').val(value.Gst);
        $('#txtGTotal').val(value.Gtotal);




    });

    //if (records.length > 0) {
    //    let value = records[0];

    //    $('#txtHPSEDCReffNo').val(value.HWSaleOrderNo);
    //    $('#txtDeptName').val(value.DeptId);
    //    $('#txtBillingAddr').val(value.BillingAddressId);
    //    $('#txtReffrNo').val(value.LetterReferenceNo);
    //    $('#txtOrderDate').val(value.OrderDate);
    //    $('#txtEntryDate').val(value.CreatedDate);
    //    $('#txtTPrice').val(value.Total);
    //    $('#txtAdminCharge').val(value.AdminCharge);
    //    $('#txtGST').val(value.Gst);
    //    $('#txtGTotal').val(value.Gtotal);
    //}
    //$('#txtHPSEDCReffNo, #txtDeptName, #txtBillingAddr, #txtReffrNo, #txtOrderDate, #txtEntryDate, #txtTPrice, #txtAdminCharge, #txtGST, #txtGTotal')
    //    .prop('readonly', true);
    //$(tableId).DataTable({
    //    paging: true,
    //    searching: true,
    //    ordering: true,
    //    info: true,
    //    responsive: true
    //});
}


//Get Record for  Multiple tables 
async function recordProductDetails(saleOrderId) {

    var filterata = {
        FilterId1: 55,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'getAddDeliveryAddressList', filterata, '#myModalAddLocation', 'N');
        if (records.SaleOrderDetails && records.SaleOrderDetails.length > 0) {
            //  bindDatatableSaleOrderDetails(records.SaleOrderDetails, '#myTableAddLocation2');
        }
        else {
            MsgBox('Sale Order Verify', 'Record Not Found.', '');
        }



    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table Product Details
function bindDatatableProductDetails(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;
        let Tprice = value.Price * value.OrderQty;

        tbody.append(`<tr
                                data-orderdeliveryid="${value.OrderDetailsId}" 
                                 >
                                <td>${SrNo}</td>

                                <td>${value.MainCatgName}</td>
                                <td>${value.CompanyName}</td>
                                <td>${value.ProductName}+<br>${value.ModelNo}</td>
                                <td>${value.Sepcification}</td>
                                <td>${value.OrderQty}</td>
                                <td>${value.Price}</td>
                                <td>${Tprice}</td>
                                <td>${value.AdminCharge}</td>
                                <td>${value.Gst}</td>
                                <td>${value.Gtotal}</td>
                                <td>${value.Narration}</td>
                                </tr>


                `);
    });
}
//Bind get record  in a table Consignee Address
function bindDatatableConsigneeAddress(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;
        let Tprice = value.Price * value.OrderQty;

        tbody.append(`<tr data-orderdeliveryid="">
                                <td>${SrNo}</td>
                                <td>${value.SaleOrderId}</td>
                                <td>${value.DeliveryQty}</td>
                                <td>${value.consigneeAddress}</td>
                                </tr>


                `);
    });
}
// Open View  Modal
$(document).on('click', '.btn-danger', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');

    alert(saleOrderId);
    OrderId = saleOrderId;

    recordSaleViewDetailList(saleOrderId);

    var myModal = new bootstrap.Modal(document.getElementById('myModalViewDetails'));
    myModal.show();
});
// get Record Table for Sale Order Verify
async function recordSaleViewDetailList(saleOrderId) {


    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };



    try {

        let records = await getRecords('HardwareOrder', 'getSaleVerifyList', filterata, '#myModalViewDetails', 'N');
        bindTrackDatatable(records, '#myTableSaleViewDetail');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}

// Bind get record  in a table  for View Details
function bindViewDetailDatatable(records, tableId) {



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

// Submit Sale Verified when Click on btn
$(".btnModalSubmit").on("click", function () {
    getSubmitSaleOrderVerify();
});


async function getSubmitSaleOrderVerify() {
    const params = new URLSearchParams(window.location.search);

    //var status = params.get("Name");
    //var id = params.get("Name1");
    //alert(status + ' ' + id);
    //return;

    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");


    let Remarks = $("#txtareaRemark").val().trim();



    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    if (Remarks == '') {
        $("#txtareaRemark").addClass("is-invalid");
        $("#txtareaRemark").siblings(".error").text("Please Enter Remarks Here");
        isValid = false;
    }
    if (!isValid) return;
    var selectedValue = $('input[name="verifyOption"]:checked').val();
    alert(selectedValue);


    var Verified = {

        SaleOrderId: OrderId,
        Verify: selectedValue,
        Remarks: $("#txtareaRemark").val() || ""




    };


    var formData = new FormData();
    formData.append("Verified", JSON.stringify(Verified));



    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwareOrder',
            'AddOrEditSaleVerified',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            resetModal();
            //closeModal('feedbackModal');

        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }



}















