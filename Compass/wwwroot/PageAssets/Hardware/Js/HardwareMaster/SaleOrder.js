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
    
        var today = new Date().toISOString().split('T')[0];
        $("#deptOrderDate").attr("max", today);   // prevent future date
        $("#orderEntryDate").val(today);          // set today date

    $('#myTableAddLocation').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });

    showDiv('listDiv');
    recordlist();
    //Filter DDL
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "", "ddlDepartment", " Department Name Filter", 0, 0);
    bindDataToDdl("HardwareDropdown", "HAgency_ddl", "", "ddlAgency", "Agency Name Filter", 0, 0);
    //Dept DDL
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "", "ddlDept", " Department ", 0, 0);
    //BillingAdd DDL depend on Dept
    bindDependentDataToDdl("HardwareDropdown", "BillingAddress_ddl", null,// ❗ no modal
        "ddlDept", "ddlBilling", "Select Billing Address");
    //MainCatg DDL
    bindDataToDdl("HardwareDropdown", "HMainCategory_ddl", "", "ddlMainCatg", " Main Categroy", 0, 0);
    //Brand DDL
    bindDataToDdl("HardwareDropdown", "HCompany_ddl", "", "ddlBrand", " Brand ", 0, 0);
    //Product Category DDL
    bindDataToDdl("HardwareDropdown", "HProduct_ddl", "", "ddlProductCatg", " Product Category");
    // ItemName DDL with dependent on Three Parent
    bindDependentDataToDdlToParent("HardwareDropdown", "HProductNameWithModel_ddl", null,// ❗ no modal
        "ddlMainCatg", "ddlProductCatg", "ddlBrand", "ddlItemName", "Model");

    bindDataToDdl("HardwareDropdown", "HDistrict_ddl", "myModalAddLocation", "ddlDistrict", " District Name", 0, 0);


    $(document).on('change', '#ddlAgency,#ddlDepartment', function () {
        recordlist();
    });
});
    //Fill data while change on Item name ddl
    $('#ddlItemName').on('change', async function () {

        var selectedValue = $(this).val();
        //var selectedText = $('#ddlItemName option:selected').text();
        var qty = parseInt($("#Qty").val()) || 1;
        console.log("Selected ID:", selectedValue);
        console.log("Selected Qty:", qty);

        if (!selectedValue) {
            console.log("No item selected");
            return;
        }

        await loadRecordById(selectedValue, qty);
    });

    async function loadRecordById(selectedValue, qty) {

        console.log("loadRecordById called");
        console.log("ProductId:", selectedValue);
        console.log("Qty:", qty);

        var filterData = {
            FilterId1: parseInt(selectedValue),
            FilterId2: parseInt(qty),
            FilterId3: 0,
            FilterName1: ''
        };
        console.log("Filter Data:", filterData);
        try {
            let records = await getRecords('HardwareOrder', 'GetPriceRecord', filterData, '', 'N');
            console.log("API Response:", records);
            if (records && records.length > 0) {
                let data = records[0];
                console.log("First Record:", data);
                $("#Rate").val(Number(data.ProductPrice).toFixed(2));
                $("#TotalRate").val(Number(data.TotalPrice).toFixed(2));
                $("#AdminCharge").val(Number(data.HPSEDCCharges).toFixed(2));
                $("#GST").val(Number(data.Gst).toFixed(2));
                $("#Total").val(Number(data.Total).toFixed(2));
                $("#Specification").val(data.Sepcification);
            } else {
                console.log("No record found");
                $("#Rate").val('');
                $("#TotalRate").val('');
                $("#AdminCharge").val('');
                $("#GST").val('');
                $("#Total").val('');
                $("#Specification").val('');
            }
        }
        catch (error) {
            console.error("Error loading record:", error);
        }
    }

    //Calculation when change on Qty
    $('#Quantity').on('keyup change', function () {
        var selectedValue = $('#ddlItemName').val();
        // var selectedText = $('#ddlItemName option:selected').text();
        loadRecordById(selectedValue, $(this).val());
        console.log("Selected ID: " + selectedValue);
        // console.log("Selected Item: " + selectedText);
    });

    let srNo = 1;
$("#btnAdd").click(function () {
    let isValid = true;
    $(".error").remove();
    $(".is-invalid").removeClass("is-invalid");
        var mainCat = $("#ddlMainCatg option:selected").text();
        var mainCatId = $("#ddlMainCatg").val();
        var brand = $("#ddlBrand option:selected").text();
        var brandId = $("#ddlBrand").val();
        var product = $("#ddlProductCatg option:selected").text();
        var productId = $("#ddlProductCatg option:selected").val();
        var model = $("#ddlItemName option:selected").text();
        var modelId = $("#ddlItemName").val();
        var specification = $("#Specification").val();
        var qty = $("#Quantity").val();
        var rate = parseFloat($("#Rate").val()).toFixed(2);
        var totalRate = parseFloat($("#TotalRate").val()).toFixed(2);
        var adminCharge = parseFloat($("#AdminCharge").val()).toFixed(2);
        var gst = parseFloat($("#GST").val()).toFixed(2);
        var total = parseFloat($("#Total").val()).toFixed(2);
        var narration = $("#Naration").val();

        if (!mainCatId || mainCatId === "0") {
            showError("ddlMainCatg", "Select Main Category");
            isValid = false;
        }
        if (!brandId || brandId === "0") {
            showError("ddlBrand", "Select Brand");
            isValid = false;
        }
        if (!productId || productId === "0") {
            showError("ddlProductCatg", "Select Product Category");
            isValid = false;
        }
        if (!modelId || modelId === "0") {
            showError("ddlItemName", "Select Item Name");
            isValid = false;
        }
        if (qty === "") {
            //alert("Please fill required fields");
            //return;
            showError("Quantity", "Please Enter Qty");
            isValid = false;
        }
        if (narration === "") {
            //alert("Please fill required fields");
            //return;
            showError("Naration", "Please Enter Narration");
            isValid = false;
        }
        if (!isValid) return; // stop if validation fails
     
       var row = `<tr>
        <td>${srNo}</td>
        <td>
            ${mainCat}
            <input type="hidden" class="productId" value="${productId}">
        </td>
        <td class="brand">${brand}</td>
        <td class="product">${product}</td>
        <td class="model">${model}</td>
        <td class="specification">${specification}</td>
        <td class="OrderQty">${qty}</td>
        <td class="UnitPrice">${rate}</td> 
        <td class="Price">${totalRate}</td> 
        <td class="AdminCharge">${adminCharge}</td>
        <td class="Gst">${gst}</td>
        <td class="Gtotal">${total}</td>
        <td class="Narration">${narration}</td>
        <td>
            <button class="btn btn-danger btn-sm btnRemove">Remove</button>
        </td>
        </tr>`;
        //alert(row);
        $("#myTable1 tbody").append(row);
    srNo++;
    // Calculate totals from table
    calculateSaleOrderTotal();

         //Clear Inputs
    //$(".cleartxt").val('');
    $(".cleartxt").each(function () {
        if ($(this).is("select")) {
            // Select2 dropdown clear
            $(this).val(null).trigger("change.select2");
        } else {
            // Textbox / textarea etc.
            $(this).val("");
        }
    });
    //ReadTable();
//    resetModal();
        //readAllItems();
        //SubmitRecord();

    });
function calculateSaleOrderTotal() {

    let totalPrice = 0;
    let totalAdminCharge = 0;
    let totalGST = 0;
    let grandTotal = 0;

    $("#myTable1 tbody tr").each(function () {

        let row = $(this);

        let price = parseFloat(row.find(".Price").text()) || 0;
        let adminCharge = parseFloat(row.find(".AdminCharge").text()) || 0;
        let gst = parseFloat(row.find(".Gst").text()) || 0;
        let total = parseFloat(row.find(".Gtotal").text()) || 0;

        totalPrice += price;
        totalAdminCharge += adminCharge;
        totalGST += gst;
        grandTotal += total;
    });

    $("#txtPrice").val(totalPrice.toFixed(2));
    $("#txtAdminCharge").val(totalAdminCharge.toFixed(2));
    $("#txtGST").val(totalGST.toFixed(2));
    $("#txtGTotal").val(grandTotal.toFixed(2));
}
//Remove data from Tem Table in Add Sale Items
$(document).on("click", ".btnRemove", function () {
    $(this).closest("tr").remove();
    calculateSaleOrderTotal();
    // Sr.No update
    $("#myTable1 tbody tr").each(function (index) {
        $(this).find("td:first").text(index + 1);
    });
    srNo = $("#myTable1 tbody tr").length + 1;
});

//Get Record for A table 
$("#btnsubmit").on("click", function () {
    SubmitRecord();
});

async function SubmitRecord() {
    let isValid = true;
    // =========================================
    // Clear Previous Validation
    // =========================================
    $(".error").remove();
    $(".is-invalid").removeClass("is-invalid");
    // =========================================
    // Get Main Form Values
    // =========================================
    let Department = $("#ddlDept").val();
    let BillingAddress = $("#ddlBilling").val();
    let Reference = $("#txtReference").val().trim();
    let DeptOrderDate = $("#deptOrderDate").val();
    let OrderEntryDate = $("#orderEntryDate").val();
    let IsPaymentRequired = $('#IsActive').is(':checked') ? 'Y' : 'N';
    // =========================================
    // Main Form Validation
    // =========================================
    if (!Department || Department === "0") {
        showError("ddlDept", "Select Department");
        isValid = false;
    }
    if (!BillingAddress || BillingAddress === "0") {
        showError("ddlBilling", "Select Billing Address");
        isValid = false;
    }
    if (Reference === "") {
        showError("txtReference", "Please enter Reference No.");
        isValid = false;
    }
    if (DeptOrderDate === "") {
        showError("deptOrderDate", "Please enter Order Date");
        isValid = false;
    }
    if (OrderEntryDate === "") {
        showError("orderEntryDate","Please enter Order Entry Date");
        isValid = false;
    }
    // =========================================
    // Table Validation
    // =========================================
    let itemCount = $("#myTable1 tbody tr").length;
    if (itemCount === 0) {
        showError("myTable1 tbody","Please add at least one Sale Item");
        isValid = false;
    }
    // =========================================
    // File Objects
    // =========================================
    let deptFile = $("#DeptDocument")[0]?.files[0];
    let locationFile =$("#LocationAttachment")[0]?.files[0];
    // =========================================
    // Department Document Validation
    // =========================================
    let fileSize = 10; // MB
    if (!deptFile) {
        showError("DeptDocument","Please select Department Document");
        isValid = false;
    }
    else {
        let sizeInMB =deptFile.size / (1024 * 1024);
        if (sizeInMB > fileSize) {
            showError("DeptDocument","File Size should be <= " + fileSize + " MB");
            isValid = false;
        }
    }
    // =========================================
    // Location Attachment Validation
    // =========================================
    if (!locationFile) {
        showError("LocationAttachment","Please select Location Attachment");
        isValid = false;
    }
    else {
        let sizeInMB = locationFile.size / (1024 * 1024);
        if (sizeInMB > fileSize) {
            showError("LocationAttachment","File Size should be <= " + fileSize + " MB");
            isValid = false;
        }
    }
    // =========================================
    // Stop Validation
    // =========================================
    if (!isValid) {
        return;
    }

    // =========================================
    // Read Multiple Items
    // =========================================
    let items = [];
    $("#myTable1 tbody tr").each(function () {
        let row = $(this);
        let item = {
            ProductId:parseInt(row.find(".productId").val()) || 0,
            OrderQty:parseFloat(row.find(".OrderQty").text().trim()) || 0,
            Price:parseFloat(row.find(".UnitPrice").text().trim()) || 0,
            Gst:parseFloat(row.find(".Gst").text().trim() ) || 0,
            AdminCharge: parseFloat(row.find(".AdminCharge").text().trim()) || 0,
            Gtotal: parseFloat(row.find(".Gtotal").text().trim()) || 0,
            Narration: row.find(".Narration").text().trim()
       };
        items.push(item);
    });
    // =========================================
    // Final Item Validation
    // =========================================
    if (items.length === 0) {
        MsgBox("Error","Please add at least one Sale Item.","");
        return;
    }
    console.log("Items:", items);
    // =========================================
    // Prepare PlaceOrder Object
    // =========================================
    let placeOrder = {
        SaleOrderId: parseInt(OrderId) || 0,
        SaleOrderNo:0,
        SaleOrderNoText:"0",
        OrderDate:$("#deptOrderDate").val(),
        DeptId:parseInt($("#ddlDept").val()) || 0,
        BillingAddressId:parseInt($("#ddlBilling").val()) || 0,
        BillingAddressText:$("#ddlBilling option:selected").text(),
        LetterReferenceNo:$("#txtReference").val().trim(),
        DeliveryDate:"2-Apr-2024",
        Total:parseFloat($("#txtPrice").val()) || 0,
        Cgst: 0,
        Sgst: 0,
        Gst:parseFloat($("#txtGST").val()) || 0,
        AdminCharge:parseFloat($("#txtAdminCharge").val()) || 0,
        Gtotal:parseFloat($("#txtGTotal").val() ) || 0,
        PaymentAmt: 0,
        Balance:0,
        IsPaymentRequired:IsPaymentRequired,
        Items:items
    };
    console.log("PlaceOrder:",JSON.stringify(placeOrder)
    );
    // =========================================
    // Create FormData
    // =========================================
    let formData = new FormData();
    // Main JSON
    formData.append("placeOrder",JSON.stringify(placeOrder));
    // =========================================
    // Attach Department Document
    // =========================================
    if (deptFile) {
        formData.append("DeptDocument",deptFile);
    }
    // =========================================
    // Attach Location File
    // =========================================
    if (locationFile) {
        formData.append("LocationAttachment",locationFile);
    }
    // =========================================
    // Submit
    // =========================================
    try {
        let result =await acceptUpdateMultiTableFData("HardwareOrder","SaveOrder",formData);
        console.log("SaveOrder Response:",result);
        // =====================================
        // Success
        // =====================================
        if (result.success) {
            MsgBox("Message",result.message ||"Sale Order Saved Successfully.","");
            resetModal();
            $("#myTable1 tbody").empty();
            $("#txtPrice").val("0.00");
            $("#txtAdminCharge").val("0.00");
            $("#txtGST").val("0.00");
            $("#txtGTotal").val("0.00");
            if (typeof srNo !== "undefined") {
                srNo = 1;
            }
            if (
                typeof recordlist === "function"
            ) {
                recordlist();
            }
        }
        else {
            MsgBox( "Error",result.message ||"Unable to save Sale Order.","");
        }
    }
    catch (error) {
        console.error("SaveOrder Error:",error);
        let message =
            error.responseJSON?.message ||
            error.responseJSON?.error ||
            error.statusText ||"Server error while saving Sale Order.";
        MsgBox("Error",message,"");
    }
}

//Table List Data 
async function recordlist() {
    var filterata = {
        FilterId1: 0,
        FilterId2: $("#ddlAgency").val() || 0,
        FilterId3: $('#ddlDepartment').val() || 0,
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
                        <td>${value.SaleOrder}</td>
                        <td>${value.PoNo}</td>
                        <td>${value.OrderDate}</td>
                        <td>${value.DepartmentName}</td>
                        <td>${value.BillingAddress}</td>
                        <td class="text-center"><button class="btn btn-sm btn-danger itemDescription" data-saleorderid="${value.SaleOrderId}"> <i class="fa fa-eye"></i></button></td>   
                        <td class="text-center">
                             <a href="javascript:void(0);" class="view-file" data-file="${value.DeliveryLocationDoc}" data-folder="DeliveryLocation" title="View DeliveryLocation">
                             <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size:25px;"></i>
                         </a>
                        </td>
                        <td class="text-center"><button class="btn btn-sm btn-danger addLocation" data-saleorderid="${value.SaleOrderId}">
                            <i class="fa fa-pencil" style="font-size:25px;"></i>
                            </button></td>
                         <td>${value.GrandTotalAmt}</td>
                         <td>${value.Balance}</td>
                         <td>${value.DeptReceivedAmt}</td>
                         <td>${value.PurchaseIssued}</td>
                         <td>${value.CancelSaleOrder}</td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-primary viewSaleOrder" data-saleorderid="${value.SaleOrderId}"> <i class="fa fa-eye"></i></button>
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

// View Uploaded pdf file conditions 
$(document).on('click', '.view-file', function (e) {
    e.preventDefault(); // Prevent default <a> behavior
    var fileName = $(this).data('file');
    var folder = $(this).data('folder');
    if (!fileName || fileName === 'undefined' || fileName === '') {
        toastr.error('File not uploaded');
        return;
    }
    // Construct URL
    var url = `/Attachment/SaleOrder/${folder}/${fileName}`;
    // Open in new tab
    window.open(url, '_blank');
});

// Open Item Description Model
$(document).on('click', '.itemDescription', function () {
    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');
    alert(saleOrderId);
    OrderId = saleOrderId;
    recordItemDesclist(saleOrderId);
    var myModal = new bootstrap.Modal(document.getElementById('myModalItemDescription'));
    myModal.show();
});
//Get Record for A table 
async function recordItemDesclist(saleOrderId) {
    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };
    try {
        let records = await getRecords('HardwareOrder', 'getItemDescriptionList', filterata, '#myModalItemDescription', 'N');
        bindDatatableItemDesc(records, '#myTableItemDesc');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}

//Bind get record  in a table Add Location
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
// Open Add Location Model
$(document).on('click', '.addLocation', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');
    OrderId = saleOrderId;

    alert(saleOrderId);

    recordAddLocationList(saleOrderId);
    recordAddDeliveryAddressList(saleOrderId);

    var myModal = new bootstrap.Modal(document.getElementById('myModalAddLocation'));
    myModal.show();
});//Get Record for A table 
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
            recordAddLocationList(OrderId);
            recordAddDeliveryAddressList(OrderId);

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


// Submit delivery Addres when Click on btn
$(".btnModalDeliverySubmit").on("click", function () {
    SubmitConsigneeRecord();
});
// to read  each selected row data
// MUST be separate and clean
function getSelectedData() {

    var selectedItems = [];

    $('.rowCheckbox:checked').each(function () {

        var row = $(this).closest('tr');
        var productid = row.data('productid');
        var itemdetailsid = row.data('itemdetailsid');
        var deliveryQuantity = row.find('.deliveryQuantity').val();

        var item = {
            ItemDetailsId: itemdetailsid,
            SaleOrderId: OrderId, // (you missed using it)
            ProductId: productid,
            DeliveryQty: deliveryQuantity,
            ConsigneeName: $('#txtConsignee').val(),
            ConsigneeContactNo: $('#txtContact').val(),
            consigneeAddress: $('#txtAreaConsigneeAddr').val(),
            DistrictId: $('#ddlDistrict').val(),
            DeliveredQty: 0,
        };

        selectedItems.push(item);
    });

    return selectedItems;
}
async function SubmitConsigneeRecord() {
    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    let ConsigneeName = $("#txtConsignee").val();

    let ContactNo = $("#txtContact").val();
    let ConsigneeAddress = $("#txtAreaConsigneeAddr").val();

    //var IsPaymentRequired = $('#IsActive').is(':checkbox') ? 'Y' : 'N';

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (ConsigneeName === "") {
        $("#txtConsignee").addClass("is-invalid");
        $("#txtConsignee").siblings(".error").text("Consignee Name is required.");
        isValid = false;
    }
    if (ContactNo === "") {
        $("#txtContact").addClass("is-invalid");
        $("#txtContact").siblings(".error").text("Please Enter Contact No.");
        isValid = false;
    }
    if (ConsigneeAddress === "") {
        $("#txtAreaConsigneeAddr").addClass("is-invalid");
        $("#txtAreaConsigneeAddr").siblings(".error").text("Please Enter Your Address");
        isValid = false;
    }
    var areaType = $('input[name="areaType"]:checked').val();


    var consigneeAddress = {
        OrderDeliveryId: '0',
        AreaType: areaType,



        Items: getSelectedData()
    };
    // Prepare data

    var formData = new FormData();
    formData.append("consigneeAddress", JSON.stringify(consigneeAddress));


    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwareOrder',
            'SaveConsigneeAddress',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            recordAddLocationList(OrderId);
            recordAddDeliveryAddressList(OrderId);
            resetModal();
            // $("#myTable1 tbody").empty();
        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}














