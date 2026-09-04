var Id = 0, tabIdNo = 1;
var OrderId = 0;
var OrderId = 0;
var DeptOrderId = 0;
function showDiv(divId) {
    document.getElementById("newSaleDiv").style.display = "none";
    document.getElementById("listDiv").style.display = "none";
    document.getElementById(divId).style.display = "block";
}
function showDiv(divId) {

    $("#newSaleDiv, #listDiv").hide();
    $("#" + divId).show();

    $("button").removeClass("active");

    if (divId === "newSaleDiv") {
        $(".btn-primary").addClass("active");
    } else {
        $(".btn-success").addClass("active");
        recordPIList();
    }
}
$(document).ready(function () {
    $('#myTablePIGenerate').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });
   showDiv('listDiv');
    recordlist();

    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "", "ddlDeptName", " Department Name", 0, 0);
    bindDataToDdl("HardwareDropdown", "HAgency_ddl", "", "ddlAgency", "Agency Name Filter", 0, 0);
    bindDataToDdl("HardwareDropdown", "HMainCategory_ddl", "", "ddlMainCatg", "Main Category", 0, 0);
    // Dependent Dropdown on change event
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "", "ddlPIAddr", " PI Address", 0, 0);
    // bindDependentDataToDdlTo Three Parent
    bindDependentDataToDdlToParent("HardwareDropdown", "HProductNameWithModel_ddl", null,// ❗ no modal
        "ddlMainCatg", "ddlPrdCatg", "ddlBrand", "ddlItemName", "Model");
    bindDataToDdl("HardwareDropdown", "HCompany_ddl", "", "ddlBrand", " Brand ", 0, 0);
    bindDataToDdl("HardwareDropdown", "HProduct_ddl", "", "ddlPrdCatg", " Product Category");
    bindDataToDdl("HardwareDropdown", "HDistrict_ddl", "myModalAddLocation", "ddlDistrict", " District Name", 0, 0);
    // bindData parent into child 
    bindDependentDataToDdl("HardwareDropdown", "PIAddressCart_ddl", "",// ❗ no modal
        "ddlDeptNamePI", "ddlBillAddr", "Select Billing Address");
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "", "ddlDeptNamePI", " Department Name ", 0, 0);
    bindDependentDataToDdl("HardwareDropdown", "PIAddressCart_ddl", "",// ❗ no modal
        "ddlDeptName", "ddlPIAddr", "Select Billing Address",);






});
// to get Record list into table list as per ddl value
$('#ddlMainCatg').on('change', function () {
    let search = $('#customSearch').val();
    recordlist(1, search);

});
// to get Record list into table list as per ddl value
$('#ddlPrdCatg').on('change', function () {
    let search = $('#customSearch').val();
    recordlist(1, search);

});
// to get Record list into table list as per ddl value
$('#ddlBrand').on('change', function () {
    let search = $('#customSearch').val();
    recordlist(1, search);

});
// to get Record list into table list as per ddl value
$('#ddlDeptNamePI').on('change', function () {
    let search = $('#customSearch').val();
    recordPIList(1, search);

});
// to get Record list into table list as per ddl value
$('#ddlBillAddr').on('change', function () {
    let search = $('#customSearch').val();
    recordPIList(1, search);

});
// to get Record list into table list as per ddl value
;// to get Record list into table list as per ddl value
$('#ddlPIAddr').on('change', function () {
    let search = $('#customSearch').val();
    getAddressDetail($(this).val());

});
// get Record to fill
async function getAddressDetail(AddressId) {
    console.log(AddressId);
    var filterata = {
        FilterId1: AddressId,
        FilterId2: $('#ddlDeptNamePI').val(),
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getPIAddressDetails', filterata, '', 'N');

        if (records && records.length > 0) {

            let data = records[0];
            //Id = data.Id;
            $("#txtDesignation").val(data.Designation);
            $("#txtAreaPIAddrText").val(data.PIAddress);
            $("#txtEmailAddr").val(data.EmailId);
            $("#txtContact").val(data.ContactNo);

        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}



// PI codeing
//Pagination 
// $('#myTablePIGenerate').DataTable({
//     paging: false,
//     searching: false,
//     info: false,
//     responsive: true
// });
// $('#myTableAddCart').DataTable({
//     paging: false,
//     searching: false,
//     info: false,
//     responsive: true
// });
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
//end pagination
//Get Record for A table GeneratePI
async function recordlist(page = 1, search = '') {

    var filterata = {
        FilterId1: page,
        FilterId2: 10,
        FilterId3: $('#ddlMainCatg').val() || 0,
        FilterId4: $('#ddlPrdCatg').val() || 0,
        FilterId5: $('#ddlBrand').val() || 0,
        FilterName1: search
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getGeneratePIList', filterata, '#myTablePIGenerate', 'N');
        bindDatatableGeneratePIList(records, '#myTablePIGenerate');
        applyPagination();
        getItemCount();
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table GeneratePI
function bindDatatableGeneratePIList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();


    $.each(records, function (i, value) {
        let SrNo = i + 1;
        var btnadd = '<button class="btn btn-lg btn-danger addtoCart">Add</button>';
        if (value.IsAddedToCart == 'Y') {
            btnadd = `
        <div class="added-box">
            <i class="bi bi-check"></i> Added
        </div>
    `;
        }






        let AdminAmt = (value.BasePrice * value.HPSEDCCharges / 100).toFixed(2);
        let GstAmt = (value.BasePrice * value.Gst / 100).toFixed(2);
        let ProductPrice = (parseFloat(value.BasePrice) + parseFloat(AdminAmt) + parseFloat(GstAmt)).toFixed(2);
        tbody.append(`<tr
                        data-productid="${value.ProductId}" data-baseprice="${value.BasePrice}" data-gstp="${value.Gst}" data-adminp="${value.HPSEDCCharges}" 
                        data-adminamt="${AdminAmt}" 
                        data-gstamt="${GstAmt}" 
                        data-productprice="${ProductPrice}" 
                        data-grandtotal="${value.GrandTotal}" 
                         >
                         
                        <td>${SrNo}</td>
                        <td>${value.MainCatgName}</td>
                        <td>${value.BrandName}</td>
                        <td>${value.ProductName}</td>
                        <td>${value.ModelNo}</td>
                         <td>₹${value.BasePrice}</td>
                         <td>₹${value.HPSEDCCharges}%<br>(${AdminAmt})</td>
                         <td>₹${value.Gst}%<br>(${GstAmt})</td>
                         <td>₹${(value.GrandTotal).toFixed(2)}</td>
                         <td>${value.Sepcification}</td>
                         <td>${btnadd}</td>
                      
                    </tr>
        `);
    });

    columnDefs: [
        { width: "5%", targets: 0 },   // Sr.No
        { width: "5%", targets: 1 },  // Product Name (increase this)
        { width: "10%", targets: 2 },
        { width: "10%", targets: 3 },
        { width: "5%", targets: 4 },
        { width: "5%", targets: 5 },
        { width: "10%", targets: 6 },
        { width: "40%", targets: 7 },
        { width: "10%", targets: 8 }
    ]

}
$(document).on('click', '.addtoCart', async function () {
    var row = $(this).closest('tr');
    SubmitAddtoCartRecord(row);

});
// Submit Add to Cart when Click on Add btn
$(".addtoCart").on("click", function () {
    SubmitAddtoCartRecord();
});
// to read  each selected row data
// MUST be separate and clean
async function SubmitAddtoCartRecord(row) {
    var productid = row.data('productid');
    var baseprice = row.data('baseprice');

    var gst = row.data('gstp');
    var adminp = row.data('adminp');
    var adminamt = row.data('adminamt');
    var gstamt = row.data('gstamt');
    var productprice = row.data('productprice');
    var grandtotal = row.data('grandtotal');


    var ProductDetail = {
        ProductId: productid,
        UnitBasePrice: baseprice,
        GstP: gst,
        AdminP: adminp,
        AdminAmt: adminamt,
        GstAmt: gstamt,
        ProductUnitPrice: productprice,
        GrandTotal: grandtotal,

    };


    var formData = new FormData();
    formData.append("ProductDetail", JSON.stringify(ProductDetail));


    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwarePurchase',
            'SubmitAddtoCart1',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            getItemCount();
            recordlist(page = 1, search = '');
            //recordAddtoCartList(ProductId);

            resetModal();
            // $("#myTable1 tbody").empty();
        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}
// Count Item for Cart

async function getItemCount() {

    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'GetCartItemCount', filterata, '', 'N');

        if (records && records.length > 0) {

            let data = records[0];
            //Id = data.Id;
            $("#cartCount").text(data.count);

        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}


//Open cart Pupup dialog
$(".cartbtn").on("click", function () {

});
$('#myTableAddCart').DataTable({
    "paging": true,
    "searching": true,
    "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
    "language": {
        "search": "Search"
    }
});
$('#myTablePBGenerate').DataTable({
    "paging": true,
    "searching": true,
    "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
    "language": {
        "search": "Search"
    }
});

// Open Cart Model
$(document).on('click', '.cartbtn', function () {

    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');
    OrderId = saleOrderId;

    //alert(saleOrderId);

    recordAddtoCartList(saleOrderId);
    /*recordAddDeliveryAddressList(saleOrderId);*/

    var myModal = new bootstrap.Modal(document.getElementById('myModalAddtoCart'));
    myModal.show();
});
//Get Record for A table Add to Cart
async function recordAddtoCartList(saleOrderId) {
    OrderId = saleOrderId;
    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getCartItemList', filterata, '#myModalAddtoCart', 'N');
        bindDatatableAddtoCart(records, '#myTableAddCart');
        updateGrandTotal();
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table item description
function bindDatatableAddtoCart(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`<tr
                        data-productid="${value.ProductId}" data-price="${value.GTotal}" data-baseprice="${value.BasePrice}"
                         data-admincharge="${value.HPSEDCCharges}" data-gst="${value.Gst}" data-grandtotal="${value.GrandTotal}"
                         data-piid="${value.PiId}"
                         >
                         <td>${SrNo}</td>
                        <td>${value.ProductName}</td>
                        <td class="basePrice">${value.BasePrice}</td>
                        <td class="adminCharge">${value.AdminCharge}</td>
                        <td class="gstAmount">${value.Gst}</td>
                        <td class="totalAmount">${value.GTotal}</td>
                        <td> <button class="btn btn-sm btn-success qtyPlus">+</button>
    <span class="qty">${value.Qty}</span>
    <button class="btn btn-sm btn-warning qtyMinus">-</button></td>
                        <td class="grandTotalAmount">${value.TotalAmount}</td>
                       <td>
    <button class="btn btn-lg btn-danger removetoCartitem">Remove</button>
</td>
                        
                       
                       
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
    console.log(row.find('.qty').text());

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
// Update GrandTotal
function updateRowTotal(row) {

    let price = parseFloat(row.data('price')) || 0;
    let qty = parseInt(row.find('.qty').text()) || 0;


    let total = (price * qty).toFixed(2);


    row.find('.grandTotalAmount').text(total);
    updateGrandTotal();
}

function updateGrandTotal() {
    let baseTotal = 0;
    let adminTotal = 0;
    let gstTotal = 0;
    let grandTotal = 0;

    $('#myTableAddCart tbody tr').each(function () {

        let base = parseFloat($(this).find('.basePrice').text()) || 0;
        let admin = parseFloat($(this).find('.adminCharge').text()) || 0;
        let gst = parseFloat($(this).find('.gstAmount').text()) || 0;
        let gtotal = parseFloat($(this).find('.grandTotalAmount').text()) || 0;
        let qty = parseFloat($(this).find('.qty').text()) || 0;

        baseTotal += (base * qty);
        adminTotal += (admin * qty);
        gstTotal += (gst * qty);
        grandTotal += gtotal;


    });

    // Set values in UI
    $('#txtBasePrice').val(baseTotal.toFixed(2));
    $('#txtAdminCharge').val(adminTotal.toFixed(2));
    $('#txtGst').val(gstTotal.toFixed(2));
    $('#txtGTotal').val(grandTotal.toFixed(2));
}
// MsgBox on Click event on Remove btn 
$(document).on('click', '.removetoCartitem', async function () {
    var row = $(this).closest('tr');

    var piid = row.data('piid');



    var isConfirmed = await DeleteEditBox("Remove Record", "Do you want to delete this record?", "question");

    if (isConfirmed) {
        await RemoveCartItemRecord(piid);
    }

});


// Remove Records Function
async function RemoveCartItemRecord(piid) {

    try {

        let formData = new FormData();

        formData.append("FilterId1", piid);





        let res = await acceptUpdate("HardwarePurchase", "RemoveCartItem", formData);

        if (res.success) {
            MsgBox('Generate PI', res.message, '');
            recordAddtoCartList(OrderId);

            getItemCount();
            recordlist(page = 1, search = '');

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
// Submit Generate PI
$(document).on("click", ".btnModelGenerate", function () {

    SubmitGeneratePI();
});
// get Date Selected
function getSelectedDataGeneratePI() {

    var selectedItems = [];

    $('#myTableAddCart tbody tr').each(function () {

        var row = $(this).closest('tr');
        var piid = row.data('piid');
        var productid = row.data('productid');
        var qty = row.find('.qty').text();

        var item = {
            PiId: piid,
            ProductId: productid,
            Qty: qty,
            DeptId: $('#ddlDeptName').val(),
            PIAddress: $('#ddlPIAddr').val(),
            Designation: $('#txtDesignation').val(),
            AddressText: $('#txtAreaPIAddrText').val(),
            EmailId: $('#txtEmailAddr').val(),
            ContactNo: $('#txtContact').val(),
            RefferenceNo: $('#txtReffNo').val(),
            AdditionalInformation: $('#txtAreaInformation').val(),
            Itemsheading: $('#txtAreaItemHeading').val(),

        };

        selectedItems.push(item);
    });

    return selectedItems;
}

// Submit Generate PI Record
async function SubmitGeneratePI() {

    /*alert(JSON.stringify(getSelectedDataGeneratePI()));*/

    let isValid = true;

    $(".error").text("");

    var formData = new FormData();

    var PIGenerate = {
        Designation: $('#txtDesignation').val(),
        Items: getSelectedDataGeneratePI()
    };

    formData.append("PIGenerate", JSON.stringify(PIGenerate));

    try {
        let res = await acceptUpdateMultiTableFData1(
            'HardwarePurchase',
            'SubmitRecordGeneratePI',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            resetModal();
            closeModal('myModalAddtoCart');
        }

    } catch (err) {
        console.error(err); // 👈 real error
    }
}
//Get Record for A table GeneratePI List
async function recordPIList(page = 1, search = '') {

    var filterata = {
        FilterId1: page,
        FilterId2: 10,
        FilterId3: $('#ddlDeptNamePI').val() || 0,
        FilterId4: $('#ddlBillAddr').val() || 0,
        FilterName1: search
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getGeneratePITable', filterata, '#myTablePIList', 'N');
        bindDatatableGeneratePIListTable(records, '#myTablePIList');

    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table GeneratePI List table
function bindDatatableGeneratePIListTable(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {

        let SrNo = i + 1;

        var PIConfirm = `
        <button class="btn btn-danger btnPIConfirm">
            PI Confirm
        </button>`;
        var GeneratePB = `
        <button class="btn btn-danger btnPBGenerate">
            Generate PB
        </button>`;
        var PrintPB = `
    <span class="text-muted">PB Not Generated</span>`;


        if (value.IsDeptConfirmed === "Y") {
            PIConfirm = `
            <button class="btn btn-success " disabled>
                <i class="bi bi-check-lg"></i> Confirmed
            </button>`;
        }



        if (value.IsBillGenerated === "Y") {
            GeneratePB = `
            <button class="btn btn-success " disabled>
                <i class="bi bi-check-lg"></i> Confirmed
            </button>`;
        }
        else if (value.IsBillGenerated == "N") {
            GeneratePB = `
        <button class="btn btn-danger btnPBGenerate">
            Generate PB
        </button>`;
        }

        if (value.IsBillGenerated == "Y") {
            PrintPB = `
        <i class="fa fa-print fa-lg btnPrintPB"
           style="color:#8B4513;"
           title="Print PB"></i>`;
        }

        tbody.append(`
        <tr data-productid="${value.ProductId}" data-piidno="${value.PiIdNO}"
        data-deptorderid="${value.DeptOrderId}">
            <td>${SrNo}</td>
            <td>${value.PiIdNO}</td>
            <td>${value.PiDate}</td>
            <td>${value.PBNoText}<br>${value.BillGeneratedDate}</td>
            <td>${value.ReferenceNo}</td>
            <td>${value.DepartmentName}</td>
            <td>${value.AddressText}</td>
            <td><i class="fa fa-print fa-lg" style="color:#8B4513;"></i></td>
            <td>${PIConfirm}</td>
            <td>${GeneratePB}</td>           
            <td>${PrintPB}</td>           
           
           
        </tr>
    `);
    });

    $(tableId).DataTable({
        paging: true,
        searching: true,
        info: true,
        responsive: true,
        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]]
    });


}
// Open PI Confirm Model
$(document).on('click', '.btnPIConfirm', function () {

    var row = $(this).closest('tr');
    var piid = row.data('piidno');
    recordPIConfirmList(piid);
    /*recordAddDeliveryAddressList(saleOrderId);*/

    var myModal = new bootstrap.Modal(document.getElementById('myModalPIConfirmation'));
    myModal.show();
});
//Get Record for A table PI Confirm
async function recordPIConfirmList(piid) {

    var filterata = {
        FilterId1: piid,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getPIConfirmList', filterata, '#myModalPIConfirmation', 'N');
        bindDatatablePIConfirmList(records, '#myTablePIConfirm');
        updateGrandTotal();
    }
    catch (error) {

        //hideModalLoader();
    }
}
//Bind get record  in a table item description
function bindDatatablePIConfirmList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();


    $.each(records, function (i, value) {
        let SrNo = i + 1;
        $("#txtDepartName").val(value.DepartmentName);

        $("#txtDesignationPI").val(value.Designation);
        $("#txtPIAddr1").val(value.PIAddress);

        $("#txtReferencePI").val(value.ReferenceNo);
        $("#txtAdditionInformationPI").val(value.AdditionalInformation);

        tbody.append(`<tr
                        data-productid="${value.ProductId}"
                        data-baseprice="${value.BasePrice}"
                         data-admincharge="${value.HPSEDCCharges}" data-gst="${value.Gst}" data-grandtotal="${value.GrandTotal}"
                        data-piid="${value.PIId}" 
                        data-price="${value.GrandTotal}" 
                         >
                         <td>${SrNo}</td>                       
                         <td><input type="checkbox" class="rowCheckbox"></td>
                         <td>${value.ProductName}</td>
                         <td class="baseprice">${value.UnitBasePrice}</td>
                         <td class="admincharge">${value.AdminAmt}</td>
                         <td class="gst">${value.GstAmt}</td>
                         <td class="grandtotal">${value.GrandTotal}</td>
                         <td> <button class="btn btn-sm btn-success qtyPlus">+</button>
    <span class="qty1">${value.Qty}</span>
    <button class="btn btn-sm btn-warning qtyMinus">-</button></td>
   </td>
                       <td class="grandTotalAmount1">${value.TotalAmount}</td>
                        
                        </tr>
                       
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
            { width: "10%", targets: 1 },  // Product Name (increase this)
            { width: "20%", targets: 2 },
            { width: "5%", targets: 3 },
            { width: "5%", targets: 4 },
            { width: "5%", targets: 5 },
            { width: "20%", targets: 6 },
            { width: "20%", targets: 7 },
            { width: "10%", targets: 8 }
        ]
    });



}
// + click event
$(document).on('click', '.qtyPlus', function () {

    let row = $(this).closest('tr');

    let qty = parseInt(row.find('.qty1').text()) || 0;
    qty++;

    row.find('.qty1').text(qty);

    updateRowTotal2(row);
});
// - click event
$(document).on('click', '.qtyMinus', function () {

    let row = $(this).closest('tr');

    let qty = parseInt(row.find('.qty1').text()) || 0;

    if (qty > 1) {
        qty--;
        row.find('.qty1').text(qty);
        updateRowTotal2(row);
    }
});
//Update GrandTotal
function updateRowTotal2(row) {

    let price = parseFloat(row.data('price')) || 0;
    let qty = parseInt(row.find('.qty1').text()) || 0;

    let total = (price * qty).toFixed(2);

    row.find('.grandTotalAmount1').text(total);

    updateGrandTotal2();
}

function updateGrandTotal2() {
    let baseTotal = 0;
    let adminTotal = 0;
    let gstTotal = 0;
    let grandTotal = 0;

    $('#myTablePIConfirm tbody input.rowCheckbox:checked').each(function () {

        var row = $(this).closest('tr');

        let base = parseFloat(row.find('.baseprice').text()) || 0;
        let admin = parseFloat(row.find('.admincharge').text()) || 0;
        let gst = parseFloat(row.find('.gst').text()) || 0;
        let gtotal = parseFloat(row.find('.grandTotalAmount1').text()) || 0;
        let qty = parseFloat(row.find('.qty1').text()) || 0;

        //console.log(base);
        //console.log(admin);
        //console.log(gst);
        //console.log(gtotal);
        //console.log(qty);

        baseTotal += (base * qty);
        adminTotal += (admin * qty);
        gstTotal += (gst * qty);
        grandTotal += gtotal;
    });

    // Set values in UI
    $('#txtBasePrice1').val(baseTotal.toFixed(2));
    $('#txtAdminCharge1').val(adminTotal.toFixed(2));
    $('#txtGst1').val(gstTotal.toFixed(2));
    $('#txtGTotal1').val(grandTotal.toFixed(2));
}
// Select All checkbox
$(document).on('change', '#selectAllPI', function () {
    $('.rowCheckbox').prop('checked', $(this).prop('checked'));

});
$(document).on('change', '.rowCheckbox', function () {
    console.log($(this).prop('checked'));
    if (!$(this).prop('checked')) {
        $('#selectAllPI').prop('checked', false);
    } else {
        // Check if all checkboxes are checked
        if ($('.rowCheckbox:checked').length === $('.rowCheckbox').length) {
            $('#selectAllPI').prop('checked', true);

        }
    }
    updateGrandTotal2();

});
// This function is used to submit Record PI Confirm


$(document).on('click', '.btnModelConfirm', function () {


    SubmitConfirmOrder();
});


//Submit Delivery Item Report PI Confirm
function getSelectedDataPI() {
    var selectedItems = [];

    $('.rowCheckbox:checked').each(function () {

        var row = $(this).closest('tr');
        var piid = row.data('piid');
        var productid = row.data('productid');
        var qty = row.find('.qty1').text();

        var item = {
            PiId: piid,
            ProductId: productid,
            Qty: qty,
            DeptId: 1,
            PIAddress: 1,
            Designation: 1,
            RefferenceNo: 1,
            AdditionalInformation: 1,

        };

        selectedItems.push(item);
    });

    return selectedItems;
}
async function SubmitConfirmOrder() {


    let isValid = true;

    let PI = $("#PIAttachment").get(0);

    let files1 = PI.files;

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    let BasePrice = $("#txtBasePrice1").val();
    let AdminCharge = $("#txtAdminCharge1").val();
    let Gst = $("#txtGst1").val();
    let GrandTotal = $("#txtGTotal1").val();


    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (BasePrice === "") {
        $("#txtBasePrice1").addClass("is-invalid");
        $("#txtBasePrice1").siblings(".error").text("Enter Please Base Price");
        isValid = false;
    }
    if (AdminCharge === "") {
        $("#txtAdminCharge1").addClass("is-invalid");
        $("#txtAdminCharge1").siblings(".error").text("Enter Please Admin Charge");
        isValid = false;
    }
    if (Gst === "") {
        $("#txtGst1").addClass("is-invalid");
        $("#txtGst1").siblings(".error").text("Enter Gst Amt");
        isValid = false;
    }
    if (GrandTotal === "") {
        $("#txtGTotal1").addClass("is-invalid");
        $("#txtGTotal1").siblings(".error").text("Enter Please Grand Total Amt");
        isValid = false;
    }
    var fileSize = 10

    var isValid1 = fileSizeValidation('PIAttachment', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        return;
    }
    let allowedExtensions = ["jpg", "jpeg", "pdf", "xlsx"];

    var newFileName1 = getNewFileName('PIAttachment', "PI")

    isValid1 = fileSizeValidation('PIAttachment', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        //return;
    }

    var ConfirmPIOrder = {
        DeptOrderId: 0,
        TotalBasePrice: BasePrice,
        AdminP: 0,
        AdminAmt: AdminCharge,
        GstAmt: Gst,
        RoundOff: 0,
        GrandTotal: GrandTotal,
        Items: getSelectedDataPI()
    };

    var formData = new FormData();


    formData.append("ConfirmPIOrder", JSON.stringify(ConfirmPIOrder));



    if ($("#PIAttachment")[0].files.length > 0) {
        formData.append("PI", $("#PIAttachment")[0].files[0], newFileName1);
    }


    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwarePurchase',
            'SubmitPIConfirm',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');

            resetModal();
            closeModal('myModalPIConfirmation');

        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}
// Open Model Generate PB
$(document).on('click', '.btnPBGenerate', function () {

    var row = $(this).closest('tr');
    var deptorderid = row.data('deptorderid');
    DeptOrderId = row.data('deptorderid');

    recordPBGenerateList(deptorderid);

    var myModal = new bootstrap.Modal(document.getElementById('myModalPBGenerate'));
    myModal.show();
});
//Get Record for A table PB Generate
async function recordPBGenerateList(deptorderid) {

    var filterata = {
        FilterId1: deptorderid,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getGeneratePBList', filterata, '#myModalPBGenerate', 'N');
        bindDatatablePBGenerateList(records, '#myTablePBGenerate');

    }
    catch (error) {
        /* console.error("Error loading records:", error);*/
        //hideModalLoader();
    }
}
//Bind get record  in a tablePB Generate
function bindDatatablePBGenerateList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();


    $.each(records, function (i, value) {
        let SrNo = i + 1;



        $("#txtDepartNamePB").val(value.DepartmentName);
        $("#txtDesignationPB").val(value.Designation);
        $("#txtPIAddrPB").val(value.PIAddress);
        $("#txtReferencePB").val(value.ReferenceNo);
        $("#txtAdditionInformationPB").val(value.AdditionalInformation);

        tbody.append(`<tr
                        data-productid="${value.ProductId}" 
                        data-baseprice="${value.BasePrice}"
                         data-admincharge="${value.HPSEDCCharges}" 
                         data-gst="${value.Gst}" data-grandtotal="${value.GrandTotal}"
                        
                        data-price="${value.GrandTotal}" 
                        data-deptorderid="${value.DeptOrderId}" 
                         >
                         <td>${SrNo}</td>                       
                         <td>${value.ProductName}</td>
                         <td class="baseprice">${value.UnitBasePrice}</td>
                         <td class="admincharge">${value.AdminAmt}</td>
                         <td class="gst">${value.GstAmt}</td>
                         <td class="">${value.GrandTotal}</td>
                         <td class="qty1">${value.Qty}</td>                         
                      <td class="grandTotalAmountPB">${value.TotalAmount}</td>
                        
                        </tr>
                       
        `);

    });
    updateGrandTotalPB();


    $(tableId).DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        responsive: true,

        columnDefs: [
            { width: "5%", targets: 0 },   // Sr.No
            { width: "10%", targets: 1 },  // Product Name (increase this)
            { width: "20%", targets: 2 },
            { width: "5%", targets: 3 },
            { width: "5%", targets: 4 },
            { width: "5%", targets: 5 },
            { width: "20%", targets: 6 },
            { width: "20%", targets: 7 },
            { width: "10%", targets: 8 }
        ]
    });



}

function updateGrandTotalPB() {

    let baseTotal = 0;
    let adminTotal = 0;
    let gstTotal = 0;
    let grandTotal = 0;

    $('#myTablePBGenerate tbody tr').each(function () {

        var row = $(this).closest('tr');

        let base = parseFloat(row.find('.baseprice').text()) || 0;
        let admin = parseFloat(row.find('.admincharge').text()) || 0;
        let gst = parseFloat(row.find('.gst').text()) || 0;
        let gtotal = parseFloat(row.find('.grandTotalAmountPB').text()) || 0;
        let qty = parseFloat(row.find('.qty1').text()) || 0;

        //console.log(base);
        //console.log(admin);
        //console.log(gst);
        //console.log(gtotal);
        //console.log(qty);

        baseTotal += (base * qty);
        adminTotal += (admin * qty);
        gstTotal += (gst * qty);
        grandTotal += gtotal;
    });

    // Set values in PB
    $('#txtBasePricePB').val(baseTotal.toFixed(2));
    $('#txtAdminChargePB').val(adminTotal.toFixed(2));
    $('#txtGstPB').val(gstTotal.toFixed(2));
    $('#txtGTotalPB').val(grandTotal.toFixed(2));
}
// Click on Submit Model For PB Generate
$(document).on('click', '.btnPBSubmit', function () {


    SubmitPBGenerate();
});


// Submit Generate PB Record
async function SubmitPBGenerate() {


    let isValid = true;

    $(".error").text("");

    var formData = new FormData();

    var GeneratePorforma = {
        DeptOrderId: DeptOrderId,
        BillGeneratedRemarks: $('#txtRemarkPB').val(),

    };



    formData.append("GeneratePorforma", JSON.stringify(GeneratePorforma));

    try {
        let res = await acceptUpdateMultiTableFData1(
            'HardwarePurchase',
            'SubmitRecordGeneratePB',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            resetModal();
            DeptOrderId = 0;
            closeModal('myModalPBGenerate');
        }

    } catch (err) {
        console.error(err); // 👈 real error
    }
}















