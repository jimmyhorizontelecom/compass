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
    // Dependent Dropdown on change event

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
        var TotalPrice = parseFloat($('#txtPrice').val() || 0) + parseFloat(totalRate || 0);
        $('#txtPrice').val((TotalPrice).toFixed(2));
        var TotalAdminCharge = parseFloat($('#txtAdminCharge').val() || 0) + parseFloat(adminCharge || 0);
        $('#txtAdminCharge').val((TotalAdminCharge).toFixed(2));
        var TotalGST = parseFloat($('#txtGST').val() || 0) + parseFloat(gst || 0);
        $('#txtGST').val((TotalGST).toFixed(2));

        var grandTotal = parseFloat(totalRate || 0) + parseFloat(adminCharge || 0) + parseFloat(gst || 0);
        var TotalGrand = parseFloat($('#txtGTotal').val() || 0) + parseFloat(grandTotal || 0);
        $('#txtGTotal').val((TotalPrice + TotalAdminCharge + TotalGST).toFixed(2));
        //alert(brand)
        var row = `<tr>

        <td>${srNo}</td>
        <td>
            ${mainCat}
            <input type="hidden" class="productId" value="${productId}">
        </td>
        <td class="brand">${brand}</td>
        <td class="product">${product}</td>
        <td class="model">${model}</td>
        <td class="Narration">${specification}</td>
        <td class="OrderQty">${qty}</td>
        <td class="UnitPrice">${rate}</td> 
        td class="Price">${totalRate}</td> 
        <td class="AdminCharge">${adminCharge}</td>
        <td class="Gst">${gst}</td>
        <td class="Gtotal">${total}</td>
        <td>${narration}</td>
        <td>
            <button class="btn btn-danger btn-sm btnRemove">Remove</button>
        </td>
        </tr>`;
        //alert(row);
        $("#myTable1 tbody").append(row);
        srNo++;
        // Clear Inputs
        $(".cleartxt").val('');
        ReadTable();
        readAllItems();
        SubmitRecord();

    });


    // Remove Row
    $(document).on("click", ".btnRemove", function () {
        $(this).closest("tr").remove();
    });

// read all data of table 
async function readAllItems() {
    var saleItems = [];

    $("#myTable1 tbody tr").each(function () {

        var row = $(this);

        var item = {
            MainCategoryId: row.find("input[name='MainCategoryId']").val(),
            //BrandId: row.find("input[name='BrandId']").val(),
            //ProductCategoryId: row.find("input[name='ProductCategoryId']").val(),
            //ItemId: row.find("input[name='ItemId']").val(),

            MainCategory: row.find("td:eq(1)").text().trim(),
            Brand: row.find("td:eq(2)").text().trim(),
            ProductCategory: row.find("td:eq(3)").text().trim(),
            ItemName: row.find("td:eq(4)").text().trim(),

            Specification: row.find("td:eq(5)").text().trim(),
            Quantity: row.find("td:eq(6)").text().trim(),
            Rate: row.find("td:eq(7)").text().trim(),
            TotalRate: row.find("td:eq(8)").text().trim(),
            AdminCharge: row.find("td:eq(9)").text().trim(),
            GST: row.find("td:eq(10)").text().trim(),
            Total: row.find("td:eq(11)").text().trim(),
            Narration: row.find("td:eq(12)").text().trim()
        };

        saleItems.push(item);
    });

    console.log(saleItems);
    alert(saleItems[0].MainCategoryId);

}

// Submit record when Click on btn
$("#btnsubmit").on("click", function () {
    SubmitRecord();
});
async function SubmitRecord() {
    let isValid = true;
    let DeptDoct = $("#DeptDocument").get(0);
    let DeliveryLoct = $("#LocationAttachment").get(0);
    let files = DeptDoct.files;
    let files1 = DeliveryLoct.files;



    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    let Department = $("#ddlDept").val();

    let BillingAddress = $("#ddlBilling").val();
    let Reference = $("#txtReference").val();
    let DeptOrderDate = $("#deptOrderDate").val();
    let OrderEntryDate = $("#orderEntryDate").val();
    var IsPaymentRequired = $('#IsActive').is(':checkbox') ? 'Y' : 'N';

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (Department === "") {
        $("#ddlDept").addClass("is-invalid");
        $("#ddlDept").siblings(".error").text("Department Name is required.");
        isValid = false;
    }
    if (BillingAddress === "") {
        $("#ddlBilling").addClass("is-invalid");
        $("#ddlBilling").siblings(".error").text("Billing Address is required.");
        isValid = false;
    }
    if (Reference === "") {
        $("#txtReference").addClass("is-invalid");
        $("#txtReference").siblings(".error").text("Please Enter Reference No.");
        isValid = false;
    }
    if (DeptOrderDate === "") {
        $("#deptOrderDate").addClass("is-invalid");
        $("#deptOrderDate").siblings(".error").text("Select Dept Order Date ");
        isValid = false;
    }
    //if (OrderEntryDate === "") {
    //    $("#orderEntryDate").addClass("is-invalid");
    //    $("#orderEntryDate").siblings(".error").text("Please Enter Order Entry Date");
    //    isValid = false;
    //}



    //if (!isValid) return; // stop if validation fails
    // New code
    var items = [];


    $("#myTable1 tbody tr").each(function () {

        var item = {
            ProductId: $(this).find(".productId").val(),
            OrderQty: $(this).find(".OrderQty").text(),
            Price: $(this).find(".UnitPrice").text(),
            Gst: $(this).find(".Gst").text(),
            AdminCharge: $(this).find(".AdminCharge").text(),
            Gtotal: $(this).find(".Gtotal").text(),
            Narration: $(this).find(".Narration").text()
        };

        items.push(item);

    });



    var placeOrder = {
        SaleOrderId: OrderId,
        SaleOrderNo: '0',
        SaleOrderNoText: '0',
        OrderDate: $("#deptOrderDate").val(),
        DeptId: $("#ddlDept").val(),
        BillingAddressId: $("#ddlBilling").val(),
        BillingAddressText: $("#ddlBilling option:selected").text(),
        LetterReferenceNo: $("#txtReference").val(),
        DeliveryDate: '2-Apr-2024',
        Total: $("#txtPrice").val(),
        Cgst: 0,
        Sgst: 0,
        Gst: $("#txtGST").val(),
        AdminCharge: $("#txtAdminCharge").val(),
        Gtotal: $("#txtGTotal").val(),
        PaymentAmt: 0,
        Balance: 0,
        IsPaymentRequired: IsPaymentRequired,
        //DeliveryAttachement: $("#DeptDocument").val(),
        //  Attachement: $("#LocationAttachment").val(),
        // Items: $("#txtCustomer").val(),


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


    //isValid1 = fileExtensionValidation('DeptDocument', allowedExtensions)
    //if (!isValid1) {
    //    MsgBox('Message', "File should be only " + allowedExtensions + '.');
    //    return;
    //}
    var newFileName = getNewFileName('DeptDocument', "OrderAttachment")

    var formData = new FormData();



    //if (files.length > 0) {
    //    formData.append("File", files[0], newFileName);  // EXACT match
    //}
    isValid1 = fileSizeValidation('LocationAttachment', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        return;
    }
    //let allowedExtensions = ["jpg", "jpeg", "pdf", "xlsx"];

    //isValid1 = fileExtensionValidation('LocationAttachment', allowedExtensions)
    //if (!isValid1) {
    //    MsgBox('Message', "File should be only " + allowedExtensions + '.');
    //    return;
    //}

    var newFileName1 = getNewFileName('LocationAttachment', "Location")

    //if (files1.length > 0) {
    //    formData.append("DeptDocument", files1[0], newFileName1);  // EXACT match
    //}



    formData.append("placeOrder", JSON.stringify(placeOrder));

    if ($("#DeptDocument")[0].files.length > 0) {
        formData.append("DeptDocument", $("#DeptDocument")[0].files[0], newFileName);
    }

    if ($("#LocationAttachment")[0].files.length > 0) {
        formData.append("LocationAttachment", $("#LocationAttachment")[0].files[0], newFileName1);
    }

    // formData.append("UploadFolder", "ProductCatg");


    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwareOrder',
            'SaveOrder',
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

//Get Record for A table 
async function recordlist() {

    var filterata = {
        FilterId1: 0,
        FilterId2: $('#ddlAgency').val(),
        FilterId3: $('#ddlDepartment').val(),
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
                        <td><button class="btn btn-sm btn-danger itemDescription" data-saleorderid="${value.SaleOrderId}"> <i class="fa fa-eye"></i></button></td>   
                        <td class="text-center">
    <a href="javascript:void(0);" class="view-file" data-file="${value.DeliveryLocationDoc}" data-folder="DeliveryLocation" title="View DeliveryLocation">
        <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size:25px;"></i>
    </a>
</td>
                        <td><button class="btn btn-lg btn-danger addLocation" data-saleorderid="${value.SaleOrderId}">
                            <i class="fa fa-pencil"></i>
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
    //var url = /Attachment/DeptAttendance/${folder}/${fileName};
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
});//Get Record for A table 
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














