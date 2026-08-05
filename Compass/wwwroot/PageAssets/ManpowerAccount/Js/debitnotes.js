var AgencyBillId = 0;
var selectedMonth = 0;
//common
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-center-center",
    timeOut: "3000"
};
//ready
$(document).ready(function () {
    alert('Employee Details List');
    resetModal();
    // Intiliase Month&Year Calender
    initCustomPicker('#monthYear');
    //setCurrentMonth("#monthYear");
    setCurrentMonth("#monthYear");
    recordlist();
    //bind ddl to filter
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", " Select Agency");
    //Reload table list when change ddl filters
    $(document).on('change', '#monthYear,#ddlAgencyName,#ddlStatus', function () {
        recordlist();
     });
});

//Get Record for A table 
async function recordlist() { 
    var agencyId = parseInt($("#ddlAgencyName").val()) || 0;
    //Convert month from text to int
    selectedMonth = $("#monthYear").val();
    var monthId = "0";
    if (selectedMonth && selectedMonth.includes('/')) {
        var parts = selectedMonth.split('/');
        var m = parseInt(parts[0], 10);
        var y = parts[1];
        monthId = m.toString() + y.toString(); // Result: "42026"
    }
    selectedMonth = monthId;
    console.log("Month Text :", $("#monthYear").val());
    console.log("Month Id :", selectedMonth);
    var status = $("#ddlStatus").val();
    if (!status || status === "0") {
        status = 'A';
    }
    status = status.trim().toUpperCase();
     var filterData = {
        AgencyId: agencyId,
         MonthYear: selectedMonth,
         AgencyBillId: 0,
         Status:status
        
      };
    console.log(filterData);
    try {
        let records = await getRecords('ManpowerAccount', 'GetDebitNotesRecord', filterData, '#myTable', 'N');
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
        //alert(JSON.stringify(records));
        tbody.append(`
            <tr style="vertical-align: middle;"
            data-agencybillid="${value.AgencyBillId}">            
                <td>${SrNo}</td>
                <td>${value.InvoiceNo}</td>
                <td>${value.AgencyName}</td>
                <td>${value.InvoiceDate}</td>
                <td>${value.BillAmount}</td>
                <td>D. No:- ${value.DebitNotesNo ?? ""} <br> D. Amt.:- ${value.DebitNotesAmtDr ??""}</td>
                <td class="text-center">
                 <button type="button" class="btn btn-coral txt-white edit-DebitNote"  data-agencybillid="${value.AgencyBillId}" title="Generate Debit Note">
                <i class="bi bi-file-earmark-plus-fill me-1"></i> Debit Note </button>
                </td>
                <td class="text-center">
               <button type="button" class="btn btn-coral txt-white print-DebitNote" data-agencybillid="${value.AgencyBillId}" title="Print Debit Note">
                 <i class="bi bi-printer-fill me-1"></i> Print Debit Note</button>
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


// MsgBox on Debit Notes Button
$(document).on('click', '.edit-DebitNote', async function () {
    AgencyBillId = $(this).data("agencybillid");
    alert(AgencyBillId);
    console.log("Edit Record Id:", AgencyBillId);
    if (!AgencyBillId) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question');
    if (isConfirmed) {
        // alert('Testing');
        resetModal();
        await loadDebitNoteRecord(AgencyBillId);
        openModal('myModal_DebitNote');
        
    } else {
        console.log('Edit cancelled');
    }
});

// get Record to fill Debit Notes Modal
async function loadDebitNoteRecord(AgencyBillId) {
    var status = $("#ddlStatus").val();
    if (!status || status === "0") {
        status = 'A';
    }
    status = status.trim().toUpperCase();
    var filterData = {
        AgencyId: 0,
        MonthYear: selectedMonth,
        AgencyBillId: AgencyBillId,
        Status: status
       
      };
    try {
        let records = await getRecords('ManpowerAccount', 'GetDebitNoteBillRecord', filterData, 'myModal_DebitNote', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            console.log(data)
            $("#txtDebitNoteNo").val(data.DebitNoteNo);
            $("#txtPurchaseBillNo").val(data.PurchaseBillNo);
            $("#txtPurchaseBillDate").val(data.PurchaseBillDate);
            $("#txtAgencyName").val(data.AgencyName);
            $("#txtDeptName").val(data.DeptName);
            $("#txtDeptAddress").val(data.DeptAddress);
            $("#txtSaleBillNo").val(data.SaleBillNo);
            $("#txtPurchaseBillAmt").val(data.PurchaseBillAmt);
            $("#txtAdminCharge").val(data.AdminChg);
            $("#txtLibraryChg").val(data.LibraryChg);
            $("#txtOCgst").val(data.OutCgst);
            $("#txtOSgst").val(data.OutSgst);
            $("#txtGTotal").val(data.GTotal);         
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}
// function showError(id, message) {
//     let control = $("#" + id);
//     control.addClass("is-invalid");
//     // Agar error pehle se nahi hai to banaye
//     if (control.next(".error").length === 0) {
//         control.after('<span class="error text-danger">' + message + '</span>');
//     } else {
//         control.next(".error").text(message);
//     }
// }
// function hideError(id) {
//     let control = $("#" + id);
//     control.removeClass("is-invalid");
//     control.next(".error").remove();   // DOM se hata dega
// }

//Hide Error while Input in Elements
$(document).on("input change", ".form-control", function () {
    hideError($(this).attr("id"));
});
// Submit Debit Note Button
$(".btnModalSubmit").on("click", function () {
    SubmitDebitNote();
});

//Submit Debit Note Records function
async function SubmitDebitNote() {
    let isValid = true;
    $(".error").remove();
    $(".is-invalid").removeClass("is-invalid");
    let debitNoteNo = $("#txtDebitNoteNo").val().trim();
    let dateDebitNote = $("#dateDebitNote").val().trim();
    let agencyCreditNote = $("#txtAgencyCNoteNo").val().trim();
    let remarks = $("#txtRemarks").val().trim();
    let purchaseBillAmt = $("#txtPurchaseBillAmt").val().trim();
    let adminCharge = $("#txtAdminCharge").val().trim();
    let libraryCharge = $("#txtLibraryChg").val().trim();
    let outCgst = $("#txtOCgst").val().trim();
    let outSgst = $("#txtOSgst").val().trim();
    let gTotal = $("#txtGTotal").val().trim();
    //Validation with common Errro function in Loader
    if (debitNoteNo === "") {
        showError("txtDebitNoteNo", "Debit Note No Required");
        isValid = false;
    } else {
        hideError("txtDebitNoteNo");
    }
  if (dateDebitNote === "") {
        showError("dateDebitNote", "Debit Note Date Required");
        isValid = false;
    } else {
        hideError("dateDebitNote");
    }
 if (agencyCreditNote === "") {
        showError("txtAgencyCNoteNo", "Agency Credit Note No Required");
        isValid = false;
    } else {
        hideError("txtAgencyCNoteNo");
    }
    if ($("#txtRemarks").val().trim() === "") {
        showError("txtRemarks", "Remarks Required");
        isValid = false;
    } else {
        hideError("txtRemarks");
    }
    // File Validation
    let attachDocument = $("#inputCreditNoteFile01")[0].files;
    let fileSize = 5; // MB
    let allowedExtensions = ["pdf"];
    if (attachDocument.length === 0) {
        showError("inputCreditNoteFile01", "Credit Note Document Required");
        isValid = false;
    } else {
        hideError("inputCreditNoteFile01");
        if (!fileSizeValidation("inputCreditNoteFile01", fileSize)) {
            isValid = false;
        }
        if (!fileExtensionValidation("inputCreditNoteFile01", allowedExtensions)) {
            isValid = false;
        }
    }
    if (!isValid)
        return;
    let formData = new FormData();
    formData.append("DebitNotesId", 0);
    formData.append("AgencyBillId", AgencyBillId);
    formData.append("DebitNoteNo", debitNoteNo);
    formData.append("PurchaseBillAmt", purchaseBillAmt);
    formData.append("AdminChg", adminCharge);
    formData.append("OutCgst", outCgst);
    formData.append("OutSgst", outSgst);
    formData.append("OutIgst", 0);
    formData.append("LibraryChg", libraryCharge);
    formData.append("GTotal", gTotal);
    formData.append("Remarks", remarks);
    //formData.append("attachmentFile1", attachDocument);
    if (attachDocument.length > 0) {
        formData.append("Attachment", attachDocument[0]);
    }
    formData.append("DebitNoteDate", dateDebitNote);
    try {
        let res = await acceptUpdate( "ManpowerAccount", "AddOrEditDebitNote", formData );
        if (res.success) {
            MsgBox("Success", res.message, "success");
            closeModal("myModal_DebitNote");
            recordlist();
        } else {
            MsgBox("Error", res.message, "error");
        }
    } catch (e) {
        MsgBox("Error", e, "error");
    }
}