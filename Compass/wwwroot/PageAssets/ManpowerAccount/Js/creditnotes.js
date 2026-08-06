var AgencyBillId = 0;
var DeptBillId = 0;
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
    bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptName", " Select Department");
    //Reload table list when change ddl filters
    $(document).on('change', '#monthYear,#ddlDeptName,#ddlStatus', function () {
        recordlist();
    });
});

//Get Record for A table 
async function recordlist() {
    var deptId = parseInt($("#ddlDeptName").val()) || 0;
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
        DeptId: deptId,
        MonthYear: selectedMonth,
        AgencyBillId: 0,
        Status: status

    };
    console.log(filterData);
    try {
        let records = await getRecords('ManpowerAccount', 'GetCreditNotesRecord', filterData, '#myTable', 'N');
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
            data-agencybillid="${value.AgencyBillId}"
            data-deptbillid="${value.DeptBillId}">            
                <td>${SrNo}</td>
                <td>Debit Note No:- ${value.DebitNotesNo ?? ""} <br>
                Remarks:- ${value.Remarks ?? ""}
                </td>
                <td>Agency Bill No:- ${value.AgenycBillNo ?? ""} <br>
                HPSEDC Bill No:- ${value.HPSEDCBillNo ?? ""}
                </td>
                <td>${value.DeptName ?? ""}</td>
                <td>${value.BillAmt ?? 0 }</td>
                <td>Credit Note No:- ${value.CreditNoteNo ?? ""} <br> Credit Amt. Rs.:- ${value.CreditAmt ?? ""}</td>
                <td class="text-center">
                <span title="${value.IsCreditNotes === 'Y' ? 'Credit Note Already Generated' : 'Generate Credit Note'}">
                <button type="button" class="btn btn-sm ${value.IsCreditNotes === 'Y' ? 'btn-secondary' : 'btn-coral text-white'} edit-CreditNote" data-agencybillid="${value.AgencyBillId}"  
                data-deptbillid="${value.DeptBillId}"  ${value.IsCreditNotes === 'Y' ? 'disabled' : ''}>  <i class="bi bi-file-earmark-plus-fill me-1"></i> Credit Note  </button>
                </span>
                </td>
                <td class="text-center">
               ${ value.IsCreditNotes === 'Y'
            ? ` <button type="button" class="btn btn-sm btn-success print-CreditNote" data-agencybillid="${value.AgencyBillId}"   data-deptbillid="${value.DeptBillId}" 
                title="Print Credit Note"> <i class="bi bi-printer-fill me-1"></i> Print Credit Note </button> `
                : `  <span title="Generate Credit Note first"> <button type="button" class="btn btn-sm btn-secondary" disabled> <i class="bi bi-printer-fill me-1"></i> Print Credit Note </button> </span>` }
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
$(document).on('click', '.edit-CreditNote', async function () {
    AgencyBillId = $(this).data("agencybillid");
    DeptBillId = $(this).data("deptbillid");
    alert(AgencyBillId);
    alert(DeptBillId);
    console.log("Edit Record Id:", AgencyBillId);
    if (!AgencyBillId) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('Credit Note', 'Do you want to generate Credit Note?', 'question');
    if (isConfirmed) {
        // alert('Testing');
        resetModal();
        await loadDebitNoteRecord(AgencyBillId);
        openModal('myModal_CreditNote');

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
        DeptId: 0,
        MonthYear: selectedMonth,
        AgencyBillId: AgencyBillId,
        Status: status
     };
    try {
        let records = await getRecords('ManpowerAccount', 'GetCreditNoteBillRecord', filterData, '', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            console.log(data)
            $("#txtCreditNoteNo").val(data.CreditNoteNo);
            //$("#dateCreditNote").val(data.CreditNoteDate);
            $("#txtSaleBillNo").val(data.SaleBillNo);
            $("#txtDeptName").val(data.DeptName);
            $("#txtDeptAddress").val(data.DeptAddress);
            $("#txtPurchaseBillAmt").val(data.PurchaseBillAmt);
            $("#txtAdminCharge").val(data.AdminChg);
            $("#txtLibraryChg").val(data.LibraryChg);
            $("#txtOCgst").val(data.OutCgst);
            $("#txtOSgst").val(data.OutSgst);
            $("#txtGTotal").val(data.GTotal);

            recordlist();
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}
$('#myModal_CreditNote').on('hidden.bs.modal', function () {
    setCurrentMonth('#monthYear');
    recordlist();
    setTimeout(function () {
    }, 2000);
});

//Hide Error while Input in Elements
$(document).on("input change", ".form-control", function () {
    hideError($(this).attr("id"));
});
// Submit Debit Note Button
$(".btnModalSubmit").on("click", function () {
    SubmitCreditNote();
});

//Submit Debit Note Records function
async function SubmitCreditNote() {
    alert(DeptBillId);

    let isValid = true;
    $(".error").remove();
    $(".is-invalid").removeClass("is-invalid");
    let creditNoteNo = $("#txtCreditNoteNo").val().trim();
    let dateCreditNote = $("#dateCreditNote").val().trim();
    let remarks = $("#txtRemarks").val().trim();
    let saleBillAmt = $("#txtPurchaseBillAmt").val().trim();
    let adminCharge = $("#txtAdminCharge").val().trim();
    let libraryCharge = $("#txtLibraryChg").val().trim();
    let outCgst = $("#txtOCgst").val().trim();
    let outSgst = $("#txtOSgst").val().trim();
    let gTotal = $("#txtGTotal").val().trim();
    if (creditNoteNo === "") {
        showError("txtCreditNoteNo", "Credit Note No Required");
        isValid = false;
    } else {
        hideError("txtCreditNoteNo");
    }
    if (dateCreditNote === "") {
        showError("dateCreditNote", "Credit Note Date Required");
        isValid = false;
    } else {
        hideError("dateCreditNote");
    }
    // if (agencyCreditNote === "") {
    //     showError("txtAgencyCNoteNo", "Agency Credit Note No Required");
    //     isValid = false;
    // } else {
    //     hideError("txtAgencyCNoteNo");
    // }
    if ($("#txtRemarks").val().trim() === "") {
        showError("txtRemarks", "Remarks Required");
        isValid = false;
    } else {
        hideError("txtRemarks");
    }
    // // File Validation
    // let attachDocument = $("#inputCreditNoteFile01")[0].files;
    // let fileSize = 5; // MB
    // let allowedExtensions = ["pdf"];
    // if (attachDocument.length === 0) {
    //     showError("inputCreditNoteFile01", "Credit Note Document Required");
    //     isValid = false;
    // } else {
    //     hideError("inputCreditNoteFile01");
    //     if (!fileSizeValidation("inputCreditNoteFile01", fileSize)) {
    //         isValid = false;
    //     }
    //     if (!fileExtensionValidation("inputCreditNoteFile01", allowedExtensions)) {
    //         isValid = false;
    //     }
    // }
    if (!isValid)
        return;
    let formData = new FormData();
    formData.append("CreditNotesId", 0);
    formData.append("DeptBillId", DeptBillId);
    formData.append("CreditNotesNo", creditNoteNo);
    formData.append("CreditNoteDate", dateCreditNote);
    formData.append("SaleBillAmt", saleBillAmt);
    formData.append("AdminChg", adminCharge);
    formData.append("OutCgst", outCgst);
    formData.append("OutSgst", outSgst);
    formData.append("OutIgst", 0);
    formData.append("LibraryChg", libraryCharge);
    formData.append("GTotal", gTotal);
    formData.append("Remarks", remarks);
    // //formData.append("attachmentFile1", attachDocument);
    // if (attachDocument.length > 0) {
    //     formData.append("Attachment", attachDocument[0]);
    // }
    // formData.append("DebitNoteDate", dateDebitNote);
    try {
        let res = await acceptUpdate("ManpowerAccount", "AddOrEditCreditNote", formData);
        if (res.success) {
            MsgBox("Success", res.message, "success");
            closeModal("myModal_CreditNote");
            recordlist();
        } else {
            MsgBox("Error", res.message, "error");
        }
    } catch (e) {
        MsgBox("Error", e, "error");
    }
}