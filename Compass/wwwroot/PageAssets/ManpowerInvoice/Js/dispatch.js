var DeptBillId = 0;


$(document).ready(function () {
    alert('Dispatch Loading')
     resetModal();
    // Initialize Month Picker
    initCustomPicker('#MonthYear');
    // Set Previous Month as Default
    setPreviousMonth('#MonthYear');
    // Load Records
    recordlist();
    // Reload records when Month changes
    $("#MonthYear").on("change", function () {
        recordlist();
    });
 });

// Print Button
$(".btnPrint").on("click", function () {
    alert('Print Button Works')
});

//Get Record for A table
async function recordlist() {
    var MonthYear = $("#MonthYear").val();
    var monthId = "0"; // Default value
    if (MonthYear) {
        // 2. Format Change: "04/2026" -> "42026" (Month + Year)
        // Use parseInt to Split leading zero 
        var parts = MonthYear.split('/');
        var m = parseInt(parts[0], 10); // "04" becomes 4
        var y = parts[1];               // "2026"
        monthId = m.toString() + y.toString(); // "42026"
    }
    var filterData = {
        DeptBillId: 16523,
        MonthYear: monthId,
        PageNumber: 1,
        PageSize: 50,
        SearchTerm:"",
    };
    try {
        let records = await getRecords('ManpowerInvoice', 'GetDispatchDetailRecord', filterData, '#myTable', 'N');
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
        tbody.append(`
            <tr
                data-deptBillId="${value.DeptBillId}">
                <td>${SrNo}</td>
                <td>${value.AgencyName}</td>
                <td>${value.AgencyBillNo}</td>
                <td>${value.SaleBillNo}</td>
                <td>${formatMonthYear(value.BillFormonth)}</td>
                <td>${value.DeptAddress}</td>
                <!-- Dispatch Status -->
                 <td class="text-center">
                   ${value.DispatchStatus === "Y"
                ? '<i class="bi bi-check-circle-fill text-success" title="Verified" style="font-size:25px;"></i>'
                : '<i class="bi bi-x-circle-fill text-danger" title="Not Verified" style="font-size:25px;"></i>'}
               </td>
                <!--Dispatch Action-->
                <td class="text-center">
                         ${value.DispatchStatus != "Y" 
            ? ` <i class="bi bi-truck text-success edit-DispatchAction" data-deptbillid="${value.DeptBillId}"
               title="Update Dispatch Details" style="cursor:pointer;font-size:25px;"></i>`
            : ` <i class="bi bi-truck text-muted "  title="Dispatch Details already updated" style="font-size:25px;opacity:0.8;cursor:not-allowed;"></i>`}
           </td>
                <td>${value.DispatchNo}</td>
               
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

//Msgbox on Action on Dispatch 
$(document).on('click', '.edit-DispatchAction', async function () {
    var recordId = $(this).data("deptbillid");
    DeptBillId = recordId;
    alert(DeptBillId)
    console.log("Edit Record Id:", DeptBillId);

    if (!DeptBillId) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to Dispatch?', 'question');
    if (isConfirmed) {
        await loadDispatchRecordUpdate(DeptBillId);
        openModal('myModal_UpdateDispatchDetails');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');
    } else {
        console.log('Edit cancelled');
    }
});
// get Record to fill
async function loadDispatchRecordUpdate(DeptBillId) {
    var MonthYear = $("#MonthYear").val();
    var parts = MonthYear.split('/');
    var monthId = parseInt(parts[0], 10) + parts[1];
    //alert('Load Record function')
    var filterData = {
        DeptBillId: DeptBillId,
        MonthYear: monthId,
    };
    try {
        let records = await getRecords('ManpowerInvoice', 'GetDispatchDetailModal', filterData, '', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
             DeptBillId = data.DeptBillId;
            $("#txtSaleBillNo").val(data.SaleBillNo);
            $("#txtDeptName").val(data.DeptName);
            $("#txtDeptAddress").val(data.DeptAddress);
            $("#numDispatchNo").val(data.DispatchNo);
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}

// Submit Dept. Payment Modal
$(".btnModalSubmitDispatch").on("click", function () {
    alert('Submit Dispatch')
    SubmitDispatchModal();
});

// Submit records
async function SubmitDispatchModal() {

    // let isValid = true;
    // $(".error").text("");
    // $(".is-invalid").removeClass("is-invalid");

    //let bankName = $("#ddlBankName").val();
    let dispatchNo = $("#numDispatchNo").val();
    let officeAddress = $("#txtDeptAddress").val();
   
    // if (modeofPayment === "0" || modeofPayment === null) {
    //     $("#ddlPaymentMode").addClass("is-invalid");
    //     $("#ddlPaymentMode").siblings(".error").text("Payment Mode is required.");
    //     isValid = false;
    // }
    // if (transactionId === "") {
    //     $("#txtTransactionId").addClass("is-invalid");
    //     $("#txtTransactionId").siblings(".error").text("Transaction ID is required");
    //     isValid = false;
    // }
    // if (paymentReceived === "") {
    //     $("#txtPaymentReceived").addClass("is-invalid");
    //     $("#txtPaymentReceived").siblings(".error").text("Payment Amount required");
    //     isValid = false;
    // }
    // if (gstTds === "") {
    //     $("#txtGstTds").addClass("is-invalid");
    //     $("#txtGstTds").siblings(".error").text("GST TDS required");
    //     isValid = false;
    // }
    // if (tds1 === "") {
    //     $("#txtTds1").addClass("is-invalid");
    //     $("#txtTds1").siblings(".error").text("TDS required");
    //     isValid = false;
    // }
    // if (tds2 === "") {
    //     $("#txtTds2").addClass("is-invalid");
    //     $("#txtTds2").siblings(".error").text("TDS required");
    //     isValid = false;
    // }
    // if (narration === "") {
    //     $("#txtNarration").addClass("is-invalid");
    //     $("#txtNarration").siblings(".error").text("Remarks/Narration required");
    //     isValid = false;
    // }

    // if (!isValid) return;

    var formData = new FormData();


    formData.append("DispatchId", 0);
    formData.append("DeptBillId", DeptBillId);
    formData.append("DispatchNo", dispatchNo);
    formData.append("OfficeAddressId", 0);
    formData.append("OfficeAdddress", officeAddress);

    try {
        //$("#ModalProgress").show();
        let res = await acceptUpdate("ManpowerInvoice", "AddOrEdit_DispatchRecord", formData);
        if (res.success) {
            recordlist();
            resetModal();
            DeptBillId = 0;
            $('.modelalert').text(res.message);
            closeModal('myModal_UpdateDispatchDetails');
            MsgBox('Message', res.message, '');
        }

    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }


}

    // < !--Dispatch Action-- >
    // <td class="text-center">
    //     ${value.DispathStatus === "Y"
    //         ? '<i class="bi bi-truck text-success" title="Verified" style="font-size:25px;"></i>'
    //         : '<i class="bi bi-truck text-danger btnDispatchAction" title="Not Verified" style="font-size:25px;"></i>'}
    // </td>