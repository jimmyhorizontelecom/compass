var trid = 0;

$(document).ready(function () {
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "", "ddlPiSaleDeptName", " Department ", 0, 0);
    //bindDataToDdl("HardwareDropdown", "PIRefNo_ddl", "", "ddlPiSaleRefNo", " Pi Ref No. ", 0, 0);
    //bindDataToDdl("HardwareDropdown", "BillingAddress_ddl", "", "ddlPiSaleBillingAddr", " Billing Address ", 0, 0);
    bindDependentDataToDdl("HardwareDropdown", "PIRefNo_ddl", "",// ❗ no modal
        "ddlPiSaleDeptName", "ddlPiSaleRefNo", "Select Pi No.",);
    bindDependentDataToDdl("HardwareDropdown", "BillingAddress_ddl", "",// ❗ no modal
        "ddlPiSaleDeptName", "ddlPiSaleBillingAddr", "Select Billing Address",);
    resetModal();
    //recordPiSaleOrderList();
    $('#myTablePISaleOrder').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });

});
// to get Record list into table list as per ddl value
$('#ddlPiSaleRefNo').on('change', function () {
    var selectedValue = $(this).val();
    console.log(selectedValue);
    recordPiSaleOrderList(selectedValue);
});
//Get Record for A table Add to Cart
async function recordPiSaleOrderList(pino) {
    ;
    var filterata = {
        FilterId1: pino,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('PI', 'getCartItemList', filterata, '', 'N');
        bindDatatablePiSaleOrderList(records, '#myTablePISaleOrder');
        updateGrandTotal();
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table item description
function bindDatatablePiSaleOrderList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`<tr
                        data-productid="${value.ProductId}" data-baseprice="${value.BasePrice}" data-adminamt="${value.AdminCharge}"
                         data-gstamt="${value.Gst}" data-grandtotal="${value.GTotal}"
                         data-piid="${value.PiId}"
                         >
                         <td>${SrNo}</td>
                         <td><input type="checkbox" class="rowCheckbox"></td>
                        <td>${value.ProductName}</td>                        
                        <td class="baseprice">${value.BasePrice}</td>
                        <td class="adminamt">${value.AdminCharge}</td>
                        <td class="gstamt">${value.Gst}</td>
                        <td class="totalAmount">${value.GTotal}</td>
                        <td> <button class="btn btn-sm btn-success qtyPlus">+</button>
    <span class="qty">${value.Qty}</span>
    <button class="btn btn-sm btn-warning qtyMinus">-</button></td>
                        <td class="grandTotalAmount">${value.TotalAmount}</td>
                      
                        
                       
                       
        `);
    });


    $(tableId).DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        responsive: true,

        columnDefs: [
            { width: "5%", targets: 0 },   // Sr.No
            { width: "35%", targets: 1 },  // Product Name (increase this)
            { width: "10%", targets: 2 },
            { width: "10%", targets: 3 },
            { width: "5%", targets: 4 },
            { width: "5%", targets: 5 },
            { width: "10%", targets: 6 },
            { width: "10%", targets: 7 },
            { width: "10%", targets: 8 }
        ]
    });


}
// + click event
$(document).on('click', '.qtyPlus', function () {

    let row = $(this).closest('tr');


    let qty = parseInt(row.find('.qty').text()) || 0;
    qty++;


    row.find('.qty').text(qty);

    updateRowTotal(row);
});
// - click event
$(document).on('click', '.qtyMinus', function () {

    let row = $(this).closest('tr');

    let qty = parseInt(row.find('.qty').text()) || 0;

    if (qty > 1) {
        qty--;
        row.find('.qty').text(qty);
        updateRowTotal(row);
    }
});
function updateRowTotal(row) {
    console.log(row.find('.totalAmount').text());
    // let price = parseFloat(row.data('baseprice')) || 0;
    let price = parseFloat(row.find('.totalAmount').text()) || 0;
    let qty = parseInt(row.find('.qty').text()) || 0;



    let total = (price * qty).toFixed(2);


    row.find('.grandTotalAmount').text(total);
    //updateGrandTotal();
}
// Update GrandTotal
// click on checkbox to update GrandTotal
$(document).on('click', '.rowCheckbox', function () {

    let row = $(this).closest('tr');
    console.log('sdj');
    updateGrandTotal();


});

function updateGrandTotal() {

    let Total = 0;
    let adminTotal = 0;
    let gstTotal = 0;
    let grandTotal = 0;

    $('#myTablePISaleOrder tbody tr').each(function () {
        if ($(this).find('input[type="checkbox"]').is(':checked')) {

            let total = parseFloat($(this).find('.baseprice').text()) || 0;
            let admin = parseFloat($(this).find('.adminamt').text()) || 0;
            let gst = parseFloat($(this).find('.gstamt').text()) || 0;
            let gtotal = parseFloat($(this).find('.grandTotalAmount').text()) || 0;
            let qty = parseFloat($(this).find('.qty').text()) || 0;

            Total += (total * qty);
            adminTotal += (admin * qty);
            gstTotal += (gst * qty);
            grandTotal += gtotal;
        }


    });

    // Set values in UI
    $('#txtPiSaleTotal').val(Total.toFixed(2));
    $('#txtPiSaleAdmin').val(adminTotal.toFixed(2));
    $('#txtPiSaleGst').val(gstTotal.toFixed(2));
    $('#txtPiSaleGTotal').val(grandTotal.toFixed(2));
}
// get Submit when click on Generate Order Button
$(document).on("click", ".btnModelSaleGenerate", function () {


    SubmitPiSaleGenerateOrder();
});
// get Date Selected
function getSelectedDataGeneratePISale() {

    var selectedItems = [];

    $('#myTablePISaleOrder tbody tr').each(function () {

        var row = $(this).closest('tr');
        var piid = row.data('piid');
        var productid = row.data('productid');
        var qty = row.find('.qty').text();

        var item = {
            ProductId: productid,
            OrderQty: qty,
            Narration: 0,
            DeliveryDay: 0,



        };

        selectedItems.push(item);
    });

    return selectedItems;
}

// Submit Generate PI Sale Order
async function SubmitPiSaleGenerateOrder() {

    let isValid = true;

    let PIDepartment = $("#PISaleAttchment").get(0);

    let files1 = PIDepartment.files;

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    let total = $("#txtPiSaleTotal").val();
    let AdminCharge = $("#txtPiSaleAdmin").val();
    let Gst = $("#txtPiSaleGst").val();
    let GrandTotal = $("#txtPiSaleGTotal").val();


    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (total === "") {
        $("#txtPiSaleTotal").addClass("is-invalid");
        $("#txtPiSaleTotal").siblings(".error").text("Enter Please Total Price");
        isValid = false;
    }
    if (AdminCharge === "") {
        $("#txtPiSaleAdmin").addClass("is-invalid");
        $("#txtPiSaleAdmin").siblings(".error").text("Enter Please Admin Charge");
        isValid = false;
    }
    if (Gst === "") {
        $("#txtPiSaleGst").addClass("is-invalid");
        $("#txtPiSaleGst").siblings(".error").text("Enter Gst Amt");
        isValid = false;
    }
    if (GrandTotal === "") {
        $("#txtPiSaleGTotal").addClass("is-invalid");
        $("#txtPiSaleGTotal").siblings(".error").text("Enter Please Grand Total Amt");
        isValid = false;
    }

    var PISaleGenerate = {
        SaleOrderId: 0,
        PiId: $('#ddlPiSaleRefNo').val(),
        OrderDate: $('#txtPiSaleDeptOrderDate').val(),
        DeptId: $('#ddlPiSaleDeptName').val(),
        BillingAddressId: $('#ddlPiSaleBillingAddr').val(),
        BillingAddressText: $('#ddlPiSaleRefNo').text(),
        LetterReferenceNo: $('#txtPiSaleDeptOrder').val(),
        OrderEntryDate: $('#txtPiSaleDeptOrderDate').val(),
        Total: $('#txtPiSaleTotal').val(),
        Cgst: 0,
        Sgst: 0,
        Gst: $('#txtPiSaleGst').val(),
        AdminCharge: $('#txtPiSaleAdmin').val(),
        Gtotal: $('#txtPiSaleGTotal').val(),
        Items: getSelectedDataGeneratePISale()
    };

    // Prepare data
    var fileSize = 10

    var isValid1 = fileSizeValidation('PIDepartment', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        return;
    }
    let allowedExtensions = ["jpg", "jpeg", "pdf", "xlsx"];

    var newFileName = getNewFileName('PIDepartment')

    var formData = new FormData();

    formData.append("PISaleGenerate", JSON.stringify(PISaleGenerate));

    if ($("#PISaleAttchment")[0].files.length > 0) {
        formData.append("PISaleAttchment", $("#PISaleAttchment")[0].files[0], newFileName);
    }

    try {

        let res = await acceptUpdateMultiTableFData1(
            'PI',
            'SubmitPISaleGenerateOrder',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            resetModal();
            $("#myTablePISaleOrder tbody").empty();

        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}