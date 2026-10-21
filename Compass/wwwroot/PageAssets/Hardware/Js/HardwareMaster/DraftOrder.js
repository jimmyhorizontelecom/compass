var Id = 0, tabIdNo = 1;
var OrderId = 0;
$(document).ready(function () {
    alert('Draft Order');
        $('#page-header').text('My Orders');
        var today = new Date().toISOString().split('T')[0];
        $("#deptOrderDate").attr("max", today);   // prevent future date
        $("#orderEntryDate").val(today);          // set today date
    
    $('#myTableOrderIssue').DataTable({
        scrollX: true
    });
    $("#listDiv").show();
    recordlist();
    let srNo = 1;
    // parent child ddl 
    console.log('test');
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "", "ddlDepartment", " Department Name Filter", 0, 0);
    bindDataToDdl("HardwareDropdown", "HAgency_ddl", "", "ddlAgency", "Agency Name Filter", 0, 0);
    // bindDataToDdl1("HardwareDropdown", "HDraftNo_ddl", "myModalPurchaseIssue", "ddlDraftAgency" ,"ddlAgencyModal" ," Agency", 14);

    // Agency dropdown in PurchaseIssue
   // bindDataToDdl(   "HardwareDropdown",  "HAgencyDraft_ddl", "myModalPurchaseIssue", "ddlAgencyModal", "Agency", 14, 0 );
    bindDataToDdl("HardwareDropdown", "HAgency_ddl", "myModalPurchaseIssue", "ddlAgencyModal", "Agency", 0, 0);
    // Agency dropdown in DraftIssue
    bindDataToDdl("HardwareDropdown", "HAgency_ddl", "myModalDraftIssue", "ddlDraftAgency", " Agency", 0, 0);
    // Draft dropdown depends on Agency
    // bindDataToDdl1(
    //     "HardwareDropdown",
    //     "HDraftNo_ddl",
    //     "myModalPurchaseIssue",
    //     "ddlDraftNo",
    //     "ddlAgencyModal",
    //     "Draft No.",
    //     14
    // );
    console.log('test1');
    // bindDataToDdl("HardwareDropdown", "HAgencyDraft_ddl", "myModalPurchaseIssue", "ddlAgencyModal", " Agency", 14, 0);
    console.log('test2'); 
   

});
// $('#myTableOrderIssue').DataTable({
//     "paging": true,
//     "pageLength": 10
// });
$('#myTablePurchaseIssue').DataTable({
    "paging": true,
    "pageLength": 10
});
$('#myTablePurchaseOrder').DataTable({
    "paging": true,
    "pageLength": 10
});
$('#myTablePurchaseOrderRemarks').DataTable({
    "paging": true,
    "pageLength": 10
});
//Get Record for A table 
async function recordlist() {
    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: 'N',
    };
    try {
        let records = await getRecords('HardwareOrder', 'getIssueOrderList', filterata, '#myTableOrderIssue', 'N');
        bindDatatableIssueOrderList(records, '#myTableOrderIssue');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table Issue Order
function bindDatatableIssueOrderList(records, tableId) {
    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
    }
    var tbody = $(tableId + " tbody");
    tbody.empty();
    $.each(records, function (i, value) {
        let SrNo = i + 1;
        tbody.append(`<tr
                        data-saleorderid="${value.SaleOrderId}"  >
                        <td>${SrNo}</td>
                        <td> <input type="checkbox" class="chkIssueDraft" /></td>
                         <td>${value.SaleOrderNo}+<br>${value.RefferenceNo}</td>
                        <td> </td>
                        <td>${value.PONO}</td>
                        <td>${value.DeptReffNo}+<br>${value.VerifyDate || ''}</td>
                        <td>${value.OrderStatus}</td>
                        <td>${value.DepartmentName} <br> ${value.BillingAddress} </td>
                        <td> <i class="bi bi-eye text-danger fs-1 align-item-center itemDescription" style="cursor:pointer;"></i> </td>
                        <td><i class="bi bi-download text-danger fs-1" style="cursor:pointer;"></i></td>
                        <td>${value.BillAmt.toFixed(2)}</td>
                         <td>${value.Balance.toFixed(2)}</td>
                         <td>${value.DeptAmtReceived.toFixed(2)}</td>          
                         <--PO Document -->
                        <td> <i class="fa fa-file-text-o text-danger fa-2x"></i></td>
                        <!-- Create Draft-->
                         <!-- <td><button class="btnDraftIssue btn btn-danger btn-sm" >Create Draft</button></td>-->
                       <td> <i class="bi bi-file-earmark-plus text-warning fs-1 btnDraftIssue" title="Create Draft" style="cursor:pointer;"></i></td>
                        <--Draft Print--> 
                        <td></td>
                         <--Verification Status--> 
                          <td><button class="btnIssuePurchase btn btn-danger">Status</button></td>
                           <--PO Status--> 
                          <td><i class="bi bi-check-square-fill text-success fs-4 me-3 action-verify"></i></td> 
                          <--Remarks-->
                          <td><button class="btnRemarks btn btn-warning">Remarks</button></td>                                             
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

    // hideModalLoader();
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
// // Open Verification Status modal
// $(document).on("click", ".verify-cell", function () {
//     var row = $(this).closest('tr');
//     var saleOrderId = row.data('saleorderid');

//     alert(saleOrderId);
//     recordVerificationStatuslist(saleOrderId);
//     var myModal = new bootstrap.Modal(document.getElementById('myModalVerificationStatus'));
//     myModal.show();

// });
// get Record for a Table
async function recordVerificationStatuslist(saleOrderId) {
    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };
    try {
        let records = await getRecords('HardwareOrder', 'getVerificationStatusList', filterata, '#myModalVerificationStatus', 'N');
        bindDatatableVerificationStatus1(records, '#a1');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get Fill record in list Verification Status
function bindDatatableVerificationStatus1(records, tableId) {
    if (records.length > 0) {
        let value = records[0];
        let varificationStatus = '';
        if (value.VerificationStatus == 'V') {
            varificationStatus = 'Varified';
        }
        else if (value.VerificationStatus == 'R') {
            varificationStatus = 'Rejected';
        }
        else {
            varificationStatus = 'Not Varified';
        }
        $('#verityStatus').text(varificationStatus);
        $('#verityDate').text(value.VerifiedDate);
        $('#txtareaVRemark').val(value.Remarks);
    }
    $('#verityStatus, #verityDate, #txtareaVRemark').prop('readonly', true);
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
// Open Purchase Issue Modal
$(document).on('click', '.btnIssuePurchase', function () {
    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');
    alert(saleOrderId);
    OrderId = saleOrderId;
    recordPurchaseIssueList(saleOrderId);
    var myModal = new bootstrap.Modal(document.getElementById('myModalPurchaseIssue'));
    myModal.show();
});
//Get Record for A table Purchase Issue
async function recordPurchaseIssueList(saleOrderId) {
    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };
    try {
        let records = await getRecords('HardwareOrder', 'getPurchaseIssueList', filterata, '#myModalPurchaseIssue', 'N');
        bindDatatablePurchaseIssues(records, '#myTablePurchaseIssue');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table Purchase Issue
function bindDatatablePurchaseIssues(records, tableId) {
    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }
    var tbody = $(tableId + " tbody");
    tbody.empty();
    $.each(records, function (i, value) {
        let SrNo = i + 1;
        tbody.append(`<tr
                        data-orderdetailsid="${value.OrderDetailId}" 
                         >
                        <td>${SrNo}</td>
                         <td><input type="checkbox" class="rowCheckbox"></td>
                        <td>${value.OrderDetailId}</td>
                        <td>${value.SaleOrder}<br>${value.RefferenceNo}</td>
                        <td>${value.ProductName}</td>
                        <td>${value.Quantity}</td>
                        <td>${value.PurchaseOrderNo}<br>${value.PurchaseOrderDate}</td>
                        <td>${value.Amount.toFixed(2)}</td>
                        <td>${value.AgencyName}</td>
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
// get Record to fill Issue PO
async function loadRecordById(row) {
    var filterata = {
        FilterId1: row.data('saleorderid'),
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };
    try {
        let records = await getRecords('HardwareOrder', 'GetPbgAdvanceList', filterata, '#myTablePurchaseIssue', 'N');
        if (records && records.length > 0) {
            let data = records[0];
            // Id = data.Id;
            var option1 = new Option(data.AgencyName, data.AgencyId, true, true);
            $("#ddlAgencyModal").append(option1).trigger('change');
            $("#ddlPbgBillFor").val(data.BillForId);
            $("#ddlPbgPOrderNo").val(data.Pinvid);
            var option1 = new Option(data.Pinvid, data.Pinvid, true, true);
            $("#ddlPbgPOrderNo").append(option1).trigger('change');
            $("#txtPbgBGNo").val(data.BGNumber);
            $("#txtPbgAmt").val(data.PBGAmt);
            if (data.BillForId == 'S') {
                $('#ddlPbgPOrderNo').next('.select2').show();
                $('#lblPbgPOrderNo').show();
            }
            else {
                $('#ddlPbgPOrderNo').next('.select2').hide();
                $('#lblPbgPOrderNo').hide();
            }
            console.log(data.ClaimDate);
            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}
// Change event of Bill For ddl
$(document).on('change', '#ddlPbgBillFor', async function () {
    console.log($(this).val());
    if ($(this).val() == 'S') {

        $('#ddlPbgPOrderNo').next('.select2-container').show();
        $('#lblPbgPOrderNo').show();
    }
    else {
        $('#ddlPbgPOrderNo').next('.select2-container').hide();
        $('#lblPbgPOrderNo').hide();
    }
});

// Submit Purchase Issue Order when Click on btn
$(".btnModalSubmit").on("click", function () {
    SubmitPurchaseIssueRecord();
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
async function SubmitPurchaseIssueRecord() {
    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    let Agency = $("#ddlAgencyModal").val();
    var IsUniquePruchaseOrder = $('#IsActive').is(':checkbox') ? 'Y' : 'N';
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");
    if (Agency === "") {
        $("#ddlAgencyModal").addClass("is-invalid");
        $("#ddlAgencyModal").siblings(".error").text("Please Select Agency ddl.");
        isValid = false;
    }
    var areaType = $('input[name="areaType"]:checked').val();
    var PurchaseOrderIssue = {
        OrderDetailsId: '0',
        AgencyId: Agency,
        IsUniquePruchaseOrder: IsUniquePruchaseOrder,
        Items: getSelectedData()
    };
    // Prepare data
    var formData = new FormData();
    formData.append("PurchaseOrderIssue", JSON.stringify(PurchaseOrderIssue));
    try {
        let res = await acceptUpdateMultiTableFData1(
            'HardwareOrder',
            'SubmitPurchaseIssuesOrder',
            formData
        );
        if (res.success) {
            MsgBox('Message', res.message, '');
            recordPurchaseIssueList(saleOrderId);
            resetModal();
            // $("#myTable1 tbody").empty();
        }
    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }
}
// Open Purchase  madal
$(document).on('click', '.action-verify', function () {
    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');
    alert(saleOrderId);
    OrderId = saleOrderId;
    recordPurchaseOrderList(saleOrderId);
    var myModal = new bootstrap.Modal(document.getElementById('myModalPurchaseOrder'));
    myModal.show();
});

//Get Record for A table Verification Status
async function recordVerificatioStatusList(saleOrderId) {
    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };
    try {
        let records = await getRecords('HardwareOrder', 'getVerificationStatusList', filterata, '#myModalVerificationStatus', 'N');
        bindDatatableVerificatioStatus(records, '');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}

//Get Record for A table Purchase Order
async function recordPurchaseOrderList(saleOrderId) {
    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };
    try {
        let records = await getRecords('HardwareOrder', 'getStatusPurchaseOrderList', filterata, '#myModalPurchaseOrder', 'N');
        bindDatatablePurchaseOrder(records, '#myTablePurchaseOrder');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table Purchase Order
function bindDatatablePurchaseOrder(records, tableId) {
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
                        <td>${value.PO}<br>${value.PODate}</td>
                        <td>${value.Agency}</td>
                        <td>${value.ActionByAgency}</td>
                        <td>${value.ActionDate}</td>
                        <td>${value.ActionRemarks}</td>                                                                                  
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
// Open Purchase Order Remarks modal
$(document).on('click', '.btnRemarks', function () {
    var row = $(this).closest('tr');
    var saleOrderId = row.data('saleorderid');
    alert(saleOrderId);
    OrderId = saleOrderId;
    recordPurchaseOrderRemarklist(saleOrderId);
    var myModal = new bootstrap.Modal(document.getElementById('myModalPurchaseOrderRemarks'));
    myModal.show();
});
// get Record for a Table
async function recordPurchaseOrderRemarklist(saleOrderId) {
    var filterata = {
        FilterId1: saleOrderId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {
        let records = await getRecords('HardwareOrder', 'getPurchaseIssueRemarksList', filterata, '#myModalPurchaseOrderRemarks', 'N');
        bindDatatableOrderRemarks(records, '#myTablePurchaseOrderRemarks');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}

//Bind get record  in a table Item description
function bindDatatableOrderRemarks(records, tableId) {
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
                        <td>${value.Remarks}</td>
                        <td>${value.RemarksDoc}</td>
                        <td>${value.RemarksDate}</td>
                        <td>${value.RemarksBy}</td>                                                                 
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

// This function is used to submit remarks data

$(document).on('click', '.btnModalRemarkSubmit', function () {
    SubmitPurchaseRemarksRecord();
});
async function SubmitPurchaseRemarksRecord() {
    let isValid = true;
    let RemarkAttachment = $("#RemarkAttachment").get(0);
    let files = RemarkAttachment.files;
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

    var PORemark = {
        SaleOrderId: OrderId,
        RemarkId: '0',
        RemarksBy: 'UserId',
        Remarks: $("#txtareaRemark").val()
    };
    // Prepare data
    var fileSize = 10

    var isValid1 = fileSizeValidation('RemarkAttachment', fileSize);

    if (!isValid1) {
        MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        return;
    }
    let allowedExtensions = ["jpg", "jpeg", "pdf", "xlsx"];

    var newFileName = getNewFileName('RemarkAttachment')

    var formData = new FormData();

    formData.append("PORemark", JSON.stringify(PORemark));

    if ($("#RemarkAttachment")[0].files.length > 0) {
        formData.append("RemarkAttachment", $("#RemarkAttachment")[0].files[0], newFileName);
    }

    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwareOrder',
            'SubmitPurchaseOrderRemarks',
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

// Draft Order Issue Pop Model open
$(document).on('click', '.btnDraftIssue', function () {
    var row = $(this).closest('tr');
    // Checkbox check 
    var checkbox = row.find('.chkIssueDraft');
    if (!checkbox.is(':checked')) {
        alert("Please select the checkbox.");
        return;
    }
    var saleOrderId = row.attr('data-saleorderid');
     alert(saleOrderId);
        //recordItemDesclist(saleOrderId);
        DraftOrderIssueList(saleOrderId);
        var myModal = new bootstrap.Modal(document.getElementById('myModalDraftIssue'));
        myModal.show();
    });
// Draft Issue get data from Model Created Draft
async function DraftOrderIssueList(saleOrderId) {
    var filterata = {
        FilterId1: saleOrderId,//$('#ddlDraftAgency').val(),
        FilterId2: 0,
        FilterId3: 0,
        //FilterName1: '',
    };
    try {
        let records = await getRecords('HardwareOrder', 'getDraftItemDescriptionList', filterata, '#myTableDraftIssue', 'N');
        bindDatatableDraftIssue(records, '#myTableDraftIssue');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table item description
function bindDatatableDraftIssue(records, tableId) {
    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }
    var tbody = $(tableId + ' tbody');
    tbody.empty();
    $.each(records, function (i, value) {
        let SrNo = i + 1;
        var isDraftOrder = (value.IsDraftOrder || '').toUpperCase() === 'Y';
        let draftDate = value.DraftOrderDate
            ? new Date(value.DraftOrderDate).toLocaleDateString('en-GB')
            : 'Draft Not Issued';
        let poDate = value.PODate
            ? new Date(value.PODate).toLocaleDateString('en-GB')
            : 'Not Issued';
        tbody.append(`
            <tr
                data-saleorderid="${value.SaleOrderId}"
                data-orderdetailsid="${value.OrderDetailsId}"
                data-draftorderid="${value.DraftOrderId}"
            >
                <td>${SrNo}</td>
                
                <td><input type="checkbox"  class="rowCheckbox"  ${isDraftOrder ? 'checked disabled' : ''} /> </td>
                <td>${value.OrderDetailsId ?? ''}</td>
                <td>${value.SaleOrderId ?? ''}</td>
                <td>${value.ProductName ?? ''}</td>
                <td>${value.Qty ?? 0}</td>
                <td>
                    ${value.DraftOrderNo ?? ''}
                    <br>${draftDate}
                </td>
                <td>
                    ${value.PONo ?? ''}
                    <br>${poDate}
                </td>
                <td>${Number(value.BillAmt ?? 0).toFixed(2)}</td>
                <td>${value.AgencyName ?? ''}</td>
                <td> ${value.AmcValidty ? new Date(value.AmcValidty).toLocaleDateString('en-GB') : ''} </td>
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
}

//Reload table when close Create Draft Modal
$(document).on('click', '#btnCloseDraftIssue', function () {
    // Uncheck  checkboxes in Create draft Modal
    $('#myTableDraftIssue tbody .rowCheckbox').prop('checked', false);
    $('#selectAllPI').prop('checked', false);
    //Reload Table
    recordlist();
});

//Create Draft Order
// Select All checkbox
$(document).on('change', '#selectAllPI', function () {
    $('#myTableDraftIssue tbody .rowCheckbox:not(:disabled)')
        .prop('checked', $(this).is(':checked'));
});

// Individual checkbox change
$(document).on('change', '#myTableDraftIssue tbody .rowCheckbox', function () {

    var enabledCheckboxes =
        $('#myTableDraftIssue tbody .rowCheckbox:not(:disabled)');

    var checkedEnabledCheckboxes =
        $('#myTableDraftIssue tbody .rowCheckbox:not(:disabled):checked');

    $('#selectAllPI').prop(
        'checked',
        enabledCheckboxes.length > 0 &&
        enabledCheckboxes.length === checkedEnabledCheckboxes.length
    );
});

// Submit Draft Issue button click
$(document).on('click', '.btnDraftSubmit', function (e) {
    e.preventDefault();

    SubmitDraftOrder();
});


// Submit Draft Order
// async function SubmitDraftOrder() {

//     var selectedOrderDetailsIds = [];

//     var agencyId = $('#ddlDraftAgency').val();
//     // 2. Agency Validation 
//     if (!agencyId || agencyId === "0") {
//         MsgBox('Message', 'Please select Agency.', '');
//         $('#ddlDraftAgency').focus();
//         return;
//     }

//     // Collect selected OrderDetailsId values
//     $('#myTableDraftIssue tbody .rowCheckbox:checked').each(function () {

//         var row = $(this).closest('tr');

//         var orderDetailsId = parseInt(
//             row.attr('data-orderdetailsid'),
//             10
//         );

//         if (!isNaN(orderDetailsId) && orderDetailsId > 0) {
//             selectedOrderDetailsIds.push(orderDetailsId);
//         }
//     });

//     // Remove duplicate IDs
//     selectedOrderDetailsIds = [...new Set(selectedOrderDetailsIds)];

//     // Validation
//     if (selectedOrderDetailsIds.length === 0) {
//         MsgBox('Message', 'Please select at least one item.',  '' );
//          return;
//     }

//     // Prevent duplicate submission
//     var submitButton = $('.btnDraftSubmit');

//     if (submitButton.prop('disabled')) {
//         return;
//     }
//       submitButton.prop('disabled', true);
//       try {
//         var formData = new FormData();
//         var DraftOrder = {
//             OrderDetailsIds: selectedOrderDetailsIds,
//             AgencyId: parseInt($(agencyId)),
//             IsUniqueDraftOrder: 'N'
//         };
//         formData.append( 'DraftOrder', JSON.stringify(DraftOrder));
//         console.log('DraftOrder Request:', DraftOrder);
//         var res = await acceptUpdateMultiTableFData1( 'HardwareOrder', 'AddorEdit_SubmitDraftOrder',formData);
//         console.log('DraftOrder Response:', res);
//         // Handle JSON response
//         if (typeof res === 'string') {
//             try {
//                 res = JSON.parse(res);
//             } catch (e) {
//                 console.error('Invalid server response:', res);

//                 MsgBox('Message', 'Server se valid response nahi mila.', '' );
//                 return;
//             }
//         }
//         if (res && res.success === true) {
//             MsgBox(
//                 'Message',
//                 res.message || 'Draft order submitted successfully.',
//                 ''
//             );
//             // Reset checkboxes
//             $('#myTableDraftIssue tbody .rowCheckbox')
//                 .prop('checked', false);
//             $('#selectAllPI').prop('checked', false);
//             // Close modal
//             var modalElement =  document.getElementById('myModalDraftIssue');
//             if (modalElement) {
//                 var modal =
//                     bootstrap.Modal.getOrCreateInstance(modalElement);
//                 modal.hide();
//             }
//             // Refresh list
//             if (typeof recordlist === 'function') {
//                 recordlist();
//             }
//         } else {
//             var errorMessage =
//                 (res && (res.message || res.error))
//             MsgBox('Message', errorMessage, '');
//         }
//     } catch (err) {
//         console.error('SubmitDraftOrder Error:', err);
//        MsgBox( 'Message', err, '' );
//    } finally {
//         // Enable button after request completes
//         submitButton.prop('disabled', false);
//     }
// }

// Submit Draft Order
async function SubmitDraftOrder() {

    // 1. Get Agency ID
    var agencyId = $('#ddlDraftAgency').val();

    // 2. Agency Validation
    if (!agencyId || agencyId === "0") {
        MsgBox('Message', 'Please select Agency.', '');
        $('#ddlDraftAgency').focus();
        return;
    }

    // 3. Collect selected OrderDetailsId values
    var selectedOrderDetailsIds = [];

    $('#myTableDraftIssue tbody .rowCheckbox:checked').each(function () {

        var row = $(this).closest('tr');

        var orderDetailsId = parseInt(
            row.attr('data-orderdetailsid'),
            10
        );

        if (!isNaN(orderDetailsId) && orderDetailsId > 0) {
            selectedOrderDetailsIds.push(orderDetailsId);
        }
    });

    // 4. Remove duplicate IDs
    selectedOrderDetailsIds = [...new Set(selectedOrderDetailsIds)];

    console.log('Selected OrderDetailsIds:', selectedOrderDetailsIds);
    console.log('Selected AgencyId:', agencyId);

    // 5. Item Validation
    if (selectedOrderDetailsIds.length === 0) {
        MsgBox('Message', 'Please select at least one item.', '');
        return;
    }

    // 6. Prevent duplicate submission
    var submitButton = $('.btnDraftSubmit');

    if (submitButton.prop('disabled')) {
        return;
    }

    submitButton.prop('disabled', true);

    try {

        // 7. Prepare DraftOrder object
        var DraftOrder = {
            OrderDetailsIds: selectedOrderDetailsIds,
            AgencyId: parseInt(agencyId, 10),
            IsUniqueDraftOrder: 'N'
        };

        console.log('DraftOrder Request:', DraftOrder);

        // 8. Send FormData
        var formData = new FormData();

        formData.append(
            'DraftOrder',
            JSON.stringify(DraftOrder)
        );

        var res = await acceptUpdateMultiTableFData1(
            'HardwareOrder',
            'AddorEdit_SubmitDraftOrder',
            formData
        );

        console.log('DraftOrder Response:', res);

        // 9. Handle JSON response
        if (typeof res === 'string') {
            try {
                res = JSON.parse(res);
            } catch (e) {
                console.error('Invalid server response:', res);
                MsgBox('Message', 'Server se valid response nahi mila.', '');
                return;
            }
        }

        // 10. Success
        if (res && res.success === true) {

            MsgBox(
                'Message',
                res.message || 'Draft order submitted successfully.',
                ''
            );

            // Reset checkboxes
            $('#myTableDraftIssue tbody .rowCheckbox')
                .prop('checked', false);

            $('#selectAllPI').prop('checked', false);

            // Close modal
            var modalElement = document.getElementById('myModalDraftIssue');

            if (modalElement) {
                var modalInstance =
                    bootstrap.Modal.getOrCreateInstance(modalElement);

                modalInstance.hide();
            }

            // Refresh list
            if (typeof recordlist === 'function') {
                recordlist();
            }

        } else {

            var errorMessage =
                res && (res.message || res.error)
                    ? (res.message || res.error)
                    : 'Draft order submit nahi ho saka.';

            MsgBox('Message', errorMessage, '');
        }

    } catch (err) {

        console.error('SubmitDraftOrder Error:', err);

        MsgBox(
            'Message',
            err.message || 'Submit karte samay error aaya.',
            ''
        );

    } finally {

        // Enable button after request completes
        submitButton.prop('disabled', false);
    }
}



$(document).on('change', '.newQty', function () {

    let row = $(this).closest('tr');
    loadRecordById(row);


});

// Select All checkbox
$(document).on('change', '#selectAll', function () {

    $('.rowCheckbox').prop('checked', this.checked);

});

$(document).on('change', '.rowCheckbox', function () {

    let total = $('.rowCheckbox').length;
    let checked = $('.rowCheckbox:checked').length;

    // If all rows are checked
    $('#selectAll').prop('checked', total > 0 && total === checked);

});
// Select checkbox onchange event

$(document).on("change", ".rowCheckbox", function () {

    let $row = $(this).closest("tr");
    let $newQty = $row.find("input.newQty");

    if (this.checked) {
        $newQty.removeAttr("readonly");
        $newQty.prop("readonly", false);
        $newQty.focus();
    }
    else {
        $newQty.prop("readonly", true);
    }

});


// get selected data
function getSelectedDataDraftIssue() {

    var selectedItems = [];

    $('.rowCheckbox:checked').each(function () {

        var row = $(this).closest('tr');

        // var qty = parseInt(row.find('.newQty').val()) || 0;

        //// Validation
        //if (qty < 1) {

        //    row.find('.newQty').addClass('is-invalid').focus();

        //    selectedItems = null;

        //    return false;
        //}
        //else {

        //    row.find('.newQty')
        //        .removeClass('is-invalid');
        //}

        var item = {
            OrderDetailsId: row.data('orderdetailsid'),
            validDateFrom: '2026-04-02',
            validDateTo: '2026-04-02'
        };
        selectedItems.push(item);
    });
    // Return validation result
    //if (selectedItems === null) {
    //    return {
    //        Status: false,
    //        Message: "Quantity must be greater than or equal to 1.",
    //        Data: []
    //    };
    //}
    // Check quantity
    if (selectedItems.length === 0) {
        return {
            Status: false,
            Message: "Please select at least one valid item.",
            Data: []
        };
    }

    // Check file
    //var fileInput = $("#AttachDocument").get(0);

    //if (!fileInput || fileInput.files.length === 0) {
    //    return {
    //        Status: false,
    //        Message: "Please select a document.",
    //        Data: []
    //    };
    //}




    return {
        Status: true,
        Message: "Validation successful.",
        Data: selectedItems
    };
}
// Submit Sale Modify Order
async function SubmitDraftIssueorder() {

    var Obj = getSelectedDataDraftIssue();
    console.log(JSON.stringify(Obj.Data));
    if (!Obj.Status) {
        MsgBox('Invalid Message', Obj.Message, '');
        return;
    }
    if (!$('#ddlDraftAgency').val()) {
        MsgBox('Invalid Message', 'Please Select Agency.', '');
        return;
    }


    var DraftIssue = {
        OrderDetailsId: 0,//$('#ddlModifySale').val(),
        AgencyId: $('#ddlDraftAgency').val(),
        IsUniqueDraftOrder: $('#IsUniqueDraft').is(':checked') ? 'Y' : 'N',

        Items: Obj.Data,
    };

    var formData = new FormData();


    formData.append("DraftIssue", JSON.stringify(DraftIssue));


    try {

        let res = await acceptUpdateMultiTableFData1(
            'HardwareOrder',
            'SubmitDraftIssueOrder',
            formData
        );

        if (res && res.success) {

            var message = res.message;

            if (!message || message.trim() === "" || message.trim() === ":") {
                message = "Draft order submitted successfully.";
            }

            MsgBox("Message", message, "");
            DraftOrderIssueList();
            //resetModal();
            //closeModal('myTableDraftIssue');

        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }

}
