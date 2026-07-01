var AgencyBillId = 0;


$(document).ready(function () {

   
    resetModal();
    recordlist();
   // alert('New Invoice Loaded');

    initCustomPicker('#fromMonthYear');
    initCustomPicker('#toMonthYear');
    //Parent Dropdwon ddl
    bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptName", " Department Name");
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", " Agency Name");

    // load data when changes on ddl
    $("#fromMonthYear, #toMonthYear, #ddlAgencyName, #ddlDeptName,#ddlPaymentStatus").change(function () {
        recordlist();
    });
});

//Get Record for A table 
async function recordlist() {
    var agencyId = parseInt($("#ddlAgencyName").val()) || 0;
    var deptId = parseInt($("#ddlDeptName").val()) || 0;
    var fromMonthYear = $("#fromMonthYear").val();
    var fromMonthId = "0"; // Default value
    if (fromMonthYear) {
        // 2. Format Change: "04/2026" -> "42026" (Month + Year)
        // Use parseInt to Split leading zero 
        var parts = fromMonthYear.split('/');
        var m = parseInt(parts[0], 10); // "04" becomes 4
        var y = parts[1];               // "2026"
        fromMonthId = m.toString() + y.toString(); // "42026"
    }
    var toMonthYear = $("#toMonthYear").val();
    var toMonthId = "0"; // Default value
    if (toMonthYear) {
        // 2. Format Change: "04/2026" -> "42026" (Month + Year)
        // Use parseInt to Split leading zero 
        var parts = toMonthYear.split('/');
        var m = parseInt(parts[0], 10); // "04" becomes 4
        var y = parts[1];               // "2026"
        toMonthId = m.toString() + y.toString(); // "42026"
    }
    var paymentStatus = $("#ddlPaymentStatus").val();
    if (!paymentStatus || paymentStatus === "0") {
        paymentStatus = 'A';
    }
    paymentStatus = paymentStatus.trim().toUpperCase();

    var filterData = {
        
        AgencyBillId: 0,
        AgencyId: agencyId,
        DeptId:deptId,
        MonthId: fromMonthId,
        MonthIdTo: toMonthId,
        PaymentStatus: paymentStatus,
        PageNo: 1,
        PageSize: 10,
        
        

    };
    console.log("Filter", filterData);
    try {

        let records = await getRecords('ManpowerInvoice', 'GetAgencyBillRecord', filterData, '#myTable', 'N');
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
                data-id="${value.AgencyBillId}">
                <td class="text-center align-middle">${SrNo}</td>
                <td class="text-center align-middle">${value.DeptName}</td>
                <td class="text-center align-middle">${value.DeptAdd}</td>
                <td class="text-center align-middle">${value.AgencyName}</td>
                <td class="text-center align-middle">${value.SaleBillNo} </td>
                <td class="text-center align-middle">${value.SaleBillAmt} </td>
                <td class="text-center align-middle">${value.SaleBillDate}</td>
                <!--Agency Payment Button-->
                 <td class="text-center align-middle">    
                      <button type="button"  class="btn btn-coral txt-white edit-AgencyPayment"  data-id="${value.AgencyBillId}"  ${value.IsDeptPaymentReceived === 'N' || value.IsDeptPaymentReceived == null ? 'disabled' : ''}> Agency Payment  </button>
                </td>
                <td class="text-center align-middle">
                     <button type="button" class="btn  btn-coral txt-white edit-PartialPayment" data-id="${value.AgencyBillId}">
                         Partial Payment
                     </button>    
                       
                </td>
                <td class="text-center align-middle">
                   <i class="bi bi-eye edit-ViewDeptPayment edit-icon" data-id="${value.AgencyBillId}" style="cursor:pointer;font-size:25px;"></i>
                   
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

    //hideModalLoader();
}

// MsgBox on Dept. Payment Button
$(document).on('click', '.edit-AgencyPayment', async function () {
    var recordId = $(this).data("id");
    alert(recordId);
    console.log("Edit Record Id:", recordId);
    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('Agency Payment', 'Do you want to Pay Agency Payment?', 'question');
    if (isConfirmed) {
        await loadAgencyPayment(recordId);
        openModal('AgencyPaymentModal');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {
        console.log('Edit cancelled');
    }
});

// get Record to fill Dept. Payment Modal
async function loadAgencyPayment(recordId) {
   
    var filterData = {
        AgencyBillId: recordId,
        
    };

    try {

        let records = await getRecords('ManpowerInvoice', 'GetAgencyInvoicePartialPaymentRecord', filterData, '', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            console.log(data)
            AgencyBillId = data.AgencyBillId;
            $("#txtPurchaseBillNo").val(data.PurchaseBillNo);
            $("#txtPurchaseBillDate").val(data.PurchaseBillDate);
            $("#txtSaleBillNo").val(data.SaleBillNo);
            $("#txtSaleBillDate").val(data.SaleBillDate);
            //$("#txtSaleBillAmt").val(parseFloat(data.SaleBillAmt).toFixed(2));
            $("#txtDeptName").val(data.DeptName);
            $("#txtAgencyName").val(data.AgencyName);
            $("#txtDeptAdd").val(data.DeptAdd);

            $("#hdnDeptId").val(data.AgencyId);
            $("#hdnAgencyId").val(data.AgencyId);
           
            console.log("AgencyId:", data.DeptId);
            console.log("DeptId:", data.DeptId);
            //Parent Dropdwon ddl for Bank Nam and Payment Mode
           // bindDataToDdl("Dropdown", "MBank_ddl", "", "ddlBankName", " Bank Name");
            bindDataToDdl("Dropdown", "MPaymentMode_ddl", "", "ddlPaymentMode", " Payment Mode");

            // Calculation of Sale Bill Amount in GSTTDS, TDS and Payment Amount
            let modal = $('#AgencyPaymentModal');
            modal.find('.saleAmt').val(parseFloat(data.SaleBillAmt).toFixed(2));
            CalculateAmounts(modal);
  
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}
// Calculation on change of GSTTDS, TDS and Payment Received
$(document).on('input', '.payment, .gst, .tds1 , .tds2', function () {

    let modal = $(this).closest('.modal'); // detect current modal
    CalculateBalance(modal);
});
// Calculation on Sale Bill Amount for Payment Received, GSTTDS, TDS
function CalculateAmounts(modal) {

    let saleAmt = parseFloat(modal.find('.saleAmt').val()) || 0;

    let gst = (saleAmt * 2) / 100;
    let tds1 = (saleAmt) / 100;
    let tds2 = (saleAmt * 2) / 100;

    let payment = saleAmt - (gst + tds1+tds2);

    modal.find('.gst').val(gst.toFixed(2));
    modal.find('.tds1').val(tds1.toFixed(2));
    modal.find('.tds2').val(tds2.toFixed(2));
    modal.find('.payment').val(payment.toFixed(2));
    modal.find('.balance').val("0.00");
}
//Calculate Balance Amount
function CalculateBalance(modal) {

    let saleAmt = parseFloat(modal.find('.saleAmt').val()) || 0;
    let payment = parseFloat(modal.find('.payment').val()) || 0;
    let gst = parseFloat(modal.find('.gst').val()) || 0;
    let tds1 = parseFloat(modal.find('.tds1').val()) || 0;
    let tds2 = parseFloat(modal.find('.tds2').val()) || 0;

    let balance = saleAmt - (payment + gst + tds1+tds2);

    if (balance < 0) balance = 0;

    modal.find('.balance').val(balance.toFixed(2));
}


// Submit Dept. Payment Modal
$(".btnModalSubmit").on("click", function () {
    SubmitAgencyPaymentModal();
});

// Submit records
async function SubmitAgencyPaymentModal() {
    
    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    //let bankName = $("#ddlBankName").val();
    let modeofPayment = $("#ddlPaymentMode").val();
    let transactionId = $("#txtTransactionId").val();
    let paymentReceived = $("#txtPaymentReceived").val();
    let receivedDate = $("#datePaymentDate").val();
    let gstTds = $("#txtGstTds").val();
    let tds1 = $("#txtTds1").val();
    let tds2 = $("#txtTds2").val();
    let narration = $("#txtNarration").val().trim();

    
    if (modeofPayment === "0" || modeofPayment === null) {
        $("#ddlPaymentMode").addClass("is-invalid");
        $("#ddlPaymentMode").siblings(".error").text("Payment Mode is required.");
        isValid = false;
    }
    if (transactionId === "") {
        $("#txtTransactionId").addClass("is-invalid");
        $("#txtTransactionId").siblings(".error").text("Transaction ID is required");
        isValid = false;
    }
    if (paymentReceived === "") {
        $("#txtPaymentReceived").addClass("is-invalid");
        $("#txtPaymentReceived").siblings(".error").text("Payment Amount required");
        isValid = false;
    }
    if (gstTds === "") {
        $("#txtGstTds").addClass("is-invalid");
        $("#txtGstTds").siblings(".error").text("GST TDS required");
        isValid = false;
    }
    if (tds1 === "") {
        $("#txtTds1").addClass("is-invalid");
        $("#txtTds1").siblings(".error").text("TDS required");
        isValid = false;
    }
    if (tds2 === "") {
        $("#txtTds2").addClass("is-invalid");
        $("#txtTds2").siblings(".error").text("TDS required");
        isValid = false;
    }
    if (narration === "") {
        $("#txtNarration").addClass("is-invalid");
        $("#txtNarration").siblings(".error").text("Remarks/Narration required");
        isValid = false;
    }

    if (!isValid) return;

    var formData = new FormData();


    formData.append("PaymentId", 0);
    formData.append("AgencyBillId", AgencyBillId);
    formData.append("TransactionId", transactionId);
    formData.append("ModeOfPayment", modeofPayment);
    formData.append("Narration", narration);
    formData.append("ReceivedDate", receivedDate);
    formData.append("ReceivedAmt", paymentReceived);
    formData.append("Gsttds", gstTds);
    formData.append("Tds1", tds1);
    formData.append("Tds2", tds2);
   
    try {
        //$("#ModalProgress").show();
        let res = await acceptUpdate("ManpowerInvoice", "AddOrEdit_AgencyPaymentRecord", formData);
        if (res.success) {
            recordlist();
            resetModal();
            AgencyBillId = 0;
            $('.modelalert').text(res.message);
            closeModal('AgencyPaymentModal');
            MsgBox('Message', res.message, '');
        }

    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }


}

// MsgBox on Partial Payment Button
$(document).on('click', '.edit-PartialPayment', async function () {
    var recordId = $(this).data("id");
  //alert(recordId);
    console.log("Edit Record Id:", recordId);
    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('Partial Payment', 'Do you want to Pay Partial Payment?', 'question');
    if (isConfirmed) {

        await loadPartialPayment(recordId);
        // load payment table list 
        await loadPartialPaymentList(recordId);

        openModal('PartialPaymentModal');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {
        console.log('Edit cancelled');
    }
});

// get Record to fill Partial Dept. Payment Modal
async function loadPartialPayment(recordId) {

    var filterData = {
        AgencyBillId: recordId,

    };

    try {

        let records = await getRecords('ManpowerInvoice', 'GetAgencyInvoicePartialPaymentRecord', filterData, '', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            console.log(data)
            AgencyBillId = data.AgencyBillId;

            //Parent Dropdwon ddl for Bank Nam and Payment Mode
            //bindDataToDdl("Dropdown", "MBank_ddl", "", "ddlBankName2", " Bank Name");
            bindDataToDdl("Dropdown", "MPaymentMode_ddl", "", "ddlPaymentMode2", " Payment Mode");

           // $("#txtSaleBillAmt2").val(parseFloat(data.SaleBillAmt).toFixed(2));

            // Calculation of Sale Bill Amount in GSTTDS, TDS and Payment Amount
            let modal = $('#PartialPaymentModal');
            modal.find('.saleAmt').val(parseFloat(data.SaleBillAmt).toFixed(2));
            CalculateAmounts(modal);

        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}
// get record in the Partial Payment Modal Table List
async function loadPartialPaymentList(recordId) {

    let filterData = {
        AgencyBillId: recordId,
      
    };

    try {
        let records = await getRecords('ManpowerInvoice', 'GetAgencyPaymentReceivedRecord', filterData, '', 'N');
        console.log("Payment List:", records);

        let tbody = $("#myTable2 tbody");
        tbody.empty();

        if (records && records.length > 0) {

            $.each(records, function (index, value) {

                let row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${value.TransactionId || ''}</td>
                        <td>${value.PaymentMode || ''}</td>
                        <td>${value.PaymentAmt || 0}</td>
                        <td>${value.GstTds || 0}</td>
                        <td>${value.Tds1 || 0} <br> ${value.Tds2 || 0}</td>
                        <td>${value.DueBalance || 0}</td>
                                             
                    </tr>
                `;

                tbody.append(row);
            });

        } else {
            tbody.append(`<tr><td colspan="7" class="text-center">No Data Found</td></tr>`);
        }

    } catch (error) {
        console.error("Error loading payment list:", error);
    }
}


// Submit Dept. Partial Payment Modal
$(".btnModalSubmit2").on("click", function () {
    SubmitPartialPaymentModal();
});

// Submit records
async function SubmitPartialPaymentModal() {

    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    //let bankName = $("#ddlBankName").val();
    let modeofPayment = $("#ddlPaymentMode2").val();
    let transactionId = $("#txtTransactionId2").val();
    let paymentReceived = $("#txtPaymentReceived2").val();
    let receivedDate = $("#datePaymentDate2").val();
    let gstTds = $("#txtGstTds2").val();
    let tds1 = $("#txtTds3").val();
    let tds2 = $("#txtTds4").val();
    let narration = $("#txtNarration2").val().trim();


    if (modeofPayment === "0" || modeofPayment === null) {
        $("#ddlPaymentMode2").addClass("is-invalid");
        $("#ddlPaymentMode2").siblings(".error").text("Payment Mode is required.");
        isValid = false;
    }
    if (transactionId === "") {
        $("#txtTransactionId2").addClass("is-invalid");
        $("#txtTransactionId2").siblings(".error").text("Transaction ID is required");
        isValid = false;
    }
    if (paymentReceived === "") {
        $("#txtPaymentReceived2").addClass("is-invalid");
        $("#txtPaymentReceived2").siblings(".error").text("Payment Amount required");
        isValid = false;
    }
    if (gstTds === "") {
        $("#txtGstTds2").addClass("is-invalid");
        $("#txtGstTds2").siblings(".error").text("GST TDS required");
        isValid = false;
    }
    if (tds1 === "") {
        $("#txtTds3").addClass("is-invalid");
        $("#txtTds3").siblings(".error").text("TDS required");
        isValid = false;
    }
    if (tds2 === "") {
        $("#txtTds4").addClass("is-invalid");
        $("#txtTds4").siblings(".error").text("TDS required");
        isValid = false;
    }
    if (narration === "") {
        $("#txtNarration2").addClass("is-invalid");
        $("#txtNarration2").siblings(".error").text("Remarks/Narration required");
        isValid = false;
    }

    if (!isValid) return;

    var formData = new FormData();


    formData.append("PaymentId", 0);
    formData.append("AgencyBillId", AgencyBillId);
    formData.append("TransactionId", transactionId);
    formData.append("ModeOfPayment", modeofPayment);
    formData.append("Narration", narration);
    formData.append("ReceivedDate", receivedDate);
    formData.append("ReceivedAmt", paymentReceived);
    formData.append("Gsttds", gstTds);
    formData.append("Tds1", tds1);
    formData.append("Tds2", tds2);

    try {
        //$("#ModalProgress").show();
        let res = await acceptUpdate("ManpowerInvoice", "AddOrEdit_AgencyPartialPaymentRecord", formData);
        if (res.success) {
            recordlist();
            resetModal();
            AgencyBillId = 0;
            $('.modelalert').text(res.message);
            closeModal('PartialPaymentModal');
            MsgBox('Message', res.message, '');
        }

    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }


}

//// MsgBox on Edit Dept. Payment Button
//$(document).on('click', '.edit-DeptPaymentUpdate', async function () {
//    var recordId = $(this).data("id");
//    alert(recordId);
//    console.log("Edit Record Id:", recordId);
//    if (!recordId) {
//        toastr.error("Record Id not found");
//        return;
//    }
//    var isConfirmed = await DeleteEditBox('Edit Record', 'Do you want to Edit Record?', 'question');
//    if (isConfirmed) {
//        await loadEditDeptPayment(recordId);
//        // load payment table list 
//        await loadEditPaymentList(recordId);
//        openModal('EditDeptPaymentModal');
//        // Alternative if openModal not working
//        //$('#myModal_UploadFile').modal('show');
//    } else {
//        console.log('Edit cancelled');
//    }
//});
//// get Record to fill Edit Dept. Payment
//async function loadEditDeptPayment(recordId) {
    
//    var filterData = {
//        AgencyBillId: recordId,

//    };

//    try {

//        let records = await getRecords('ManpowerInvoice', 'GetAgencyInvoiceDeptPaymentRecord', filterData, '', 'N');
//        console.log("Full Response:", records);
//        if (records && records.length > 0) {
//            let data = records[0];
//            console.log(data)
//            AgencyBillId = data.AgencyBillId;
//            $("#txtPurchaseBillNo1").val(data.PurchaseBillNo);
//            $("#txtPurchaseBillDate1").val(data.PurchaseBillDate);
//            $("#txtSaleBillNo1").val(data.SaleBillNo);
//            $("#txtSaleBillDate1").val(data.SaleBillDate);
//            $("#txtSaleBillAmt1").val(parseFloat(data.SaleBillAmt).toFixed(2));
//            $("#txtDeptName1").val(data.DeptName);
//            $("#txtAgencyName1").val(data.AgencyName);
//            $("#txtDeptAdd1").val(data.DeptAdd);

//            $("#hdnDeptId1").val(data.AgencyId);
//            $("#hdnAgencyId1").val(data.AgencyId);

//            console.log("AgencyId1:", data.DeptId);
//            console.log("DeptId1:", data.DeptId);

//            //Parent Dropdwon ddl
//            bindDataToDdl("Dropdown", "MBank_ddl", "", "ddlBankName1", " Bank Name");
//            bindDataToDdl("Dropdown", "MPaymentMode_ddl", "", "ddlPaymentMode1", " Payment Mode");

//            // Calculation of Sale Bill Amount in GSTTDS, TDS and Payment Amount
//            let modal = $('#EditDeptPaymentModal');
//            modal.find('.saleAmt').val(parseFloat(data.SaleBillAmt).toFixed(2));
//            CalculateAmounts(modal);

//        }
//    }
//    catch (error) {
//        console.error("Error loading record:", error);
//    }
//}

//// get record in the Edit Payment Modal Table List
//async function loadEditPaymentList(recordId) {

//    let filterData = {
//        AgencyBillId: recordId,

//    };

//    try {
//        let records = await getRecords('ManpowerInvoice', 'GetPaymentReceivedRecord', filterData, '', 'N');
//        console.log("Payment List:", records);

//        let tbody = $("#myTable1 tbody");
//        tbody.empty();

//        if (records && records.length > 0) {

//            $.each(records, function (index, value) {

//                let row = `
//                    <tr>
//                        <td>${index + 1}</td>
//                        <td>${value.TransactionId || ''}</td>
//                        <td>${value.PaymentMode || ''}</td>
//                        <td>${value.BankName || ''}</td>
//                        <td>${value.ReceivedAmt || 0}</td>
//                        <td>${value.GstTds || 0} <br> ${value.Tds || 0}</td>
//                        <td>${value.DueBalance || 0}</td>
//                        <td class="text-center align-middle">
//                            <i class="bi bi-patch-check-fill verify-ReceivedPayment edit-icon" data-id="${value.AgencyBillId}" style="cursor:pointer;font-size:25px;color:blue;"> </i>
//                        </td>
//                        <td class="text-center align-middle">
//                            <i class="bi bi-pencil-square edit-EditReceivedPayment edit-icon"  data-id="${value.AgencyBillId}" style="cursor:pointer;font-size:25px;"></i>
//                        </td>
                       
//                    </tr>
//                `;

//                tbody.append(row);
//            });

//        } else {
//            tbody.append(`<tr><td colspan="9" class="text-center">No Data Found</td></tr>`);
//        }

//    } catch (error) {
//        console.error("Error loading payment list:", error);
//    }
//}

//// MsgBox on Edit Received/Accept Payment in Dept Payment
//$(document).on('click', '.edit-EditReceivedPayment', async function () {
//    var recordId = $(this).data("id");
//    alert(recordId);
//    console.log("Edit Record Id:", recordId);
//    if (!recordId) {
//        toastr.error("Record Id not found");
//        return;
//    }
//    var isConfirmed = await DeleteEditBox('Edit Record', 'Do you want to Edit Payment Record?', 'question');
//    if (isConfirmed) {
//        alert('Loading Edit Payment');
//        ////await deptPaymentRecordlist();
//        //await loadViewDeptPaymentList(recordId);
//        //openModal('ViewDeptPaymentModal');
//        ////eptPaymentRecordlist(recordId);
//    } else {
//        console.log('Edit cancelled');
//    }
//});

// MsgBox on View Agency Payment Button
$(document).on('click', '.edit-ViewDeptPayment', async function () {
    var recordId = $(this).data("id");
    alert(recordId);
    console.log("Edit Record Id:", recordId);
    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('View Record', 'Do you want to View Record?', 'question');
    if (isConfirmed) {
        //await deptPaymentRecordlist();
        await loadViewAgencyPaymentList(recordId);
        openModal('ViewAgencyPaymentModal');
       //eptPaymentRecordlist(recordId);
    } else {
        console.log('Edit cancelled');
    }
});

async function loadViewAgencyPaymentList(recordId) {

    let filterData = {
        AgencyBillId: recordId,

    };

    try {
        let records = await getRecords('ManpowerInvoice', 'GetAgencyPaymentRecord', filterData, '', 'N');
        console.log("Payment List:", records);

        let tbody = $("#myTable3 tbody");
        tbody.empty();

        if (records && records.length > 0) {

            $.each(records, function (index, value) {

                let row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${value.TransactionId || 0}</td>
                        <td>${value.PaymentMode || 0}</td>
                        <td>${value.Narration || ''}</td>
                        <td>${value.PaymentAmt || 0} </td>
                        <td>${value.Tds2 || 0 } </td>
                        <td>${value.GstTds || 0 } </td>
                        <td>${value.DueBalance || 0 } </td>
                        <td>${value.ReceivedDate || '' } </td>
                    </tr>
                `;

                tbody.append(row);
            });

        } else {
            tbody.append(`<tr><td colspan="9" class="text-center">No Data Found</td></tr>`);
        }

    } catch (error) {
        console.error("Error loading payment list:", error);
    }
}



