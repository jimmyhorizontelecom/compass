var Id = 0;


$(document).ready(function () {
    //initializeMonthYearPickerByClass("monthYearPicker");

    resetModal();
    recordlist();

    initCustomPicker('#monthYear');
    //alert('Purchase Bill Verification');

    //Parent Dropdown
    bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptName", " Department Name");
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", " Agency Name");
    //bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlBillStatu", " Bill Status");


    // load data when changes on ddl
    $("#monthYear, #ddlAgencyName, #ddlDeptName,#ddlBillStatus").change(function () {
        recordlist();
    });

});

//Get Record for A table 
async function recordlist() {
    var agencyId = parseInt($("#ddlAgencyName").val()) || 0;
    var deptId = parseInt($("#ddlDeptName").val()) || 0;
    //var monthId = '42026';
    var MonthYear = $("#monthYear").val();
    var monthId = "0"; // Default value
    if (MonthYear) {
        // 2. Format Change: "04/2026" -> "42026" (Month + Year)
        // Use parseInt to Split leading zero 
        var parts = MonthYear.split('/');
        var m = parseInt(parts[0], 10); // "04" becomes 4
        var y = parts[1];               // "2026"
        monthId = m.toString() + y.toString(); // "42026"
    }
    var paymentStatus = $("#ddlBillStatus").val();

    if (!paymentStatus || paymentStatus === "0") {
        paymentStatus = 'A';
    }

    paymentStatus = paymentStatus.trim().toUpperCase();

    var filterData = {
        Id: 0,
        AgencyId: agencyId,//1,
        AgencyBillId: 0,
        DeptId: deptId,
        MonthId: monthId,//'42026',//monthId,
        PaymentStatus: paymentStatus,
        //CreatedBy: 0,
        //UserRole: 39,

    };
    console.log("Filter", filterData);
    try {

        let records = await getRecords('ManpowerInvoice', 'GetPurchaseBillRecord', filterData, '#myTable', 'N');
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
                data-id="${value.Id}">
                 <td>${SrNo}</td>
                <td>${value.DepartmentName}</td>
                <td>${value.AgencyName}<br> ${value.AgencyBillNo}</td>
                               
               <!-- Attendance File -->
                <td class="text-center">
                <span data-id="${value.Id}" >
                    <a href="javascript:void(0);" class="view-file" data-file="${value.AttendanceCertificate}" data-folder="Attendance" title="View Attendance">
                         <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size:25px;"></i>
                    </a>
                    </span>
                </td>
                 <!-- Annexure File -->
                <td class="text-center">
                    <a href="javascript:void(0);" class="view-file" data-file="${value.AnnexureFile}" data-folder="Annexure" title="View Annexure">
                        <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size:25px;"></i>
                    </a>
                </td>
                 <!-- Agency Bill File -->
                <td class="text-center">
                <span data-id="${value.Id}" >
                    <a href="javascript:void(0);" class="view-file" data-file="${value.AgencyBillFile}" data-folder="AgencyBill" title="View Agency Bill">
                        <i class="bi bi-file-earmark-pdf-fill text-danger" style="font-size:25px;"></i>
                    </a>
                </td>
                 <td> ${value.BillDate} <br> ${value.BillMonth}</td>
                   <!--Verify Purchase Invoice -->
               <td class="text-center">
                 ${value.VerificationStatus === "V"
                ? '<i class="bi bi-lock-fill text-secondary" title="Already Verified" style="font-size:25px;"></i>'
                : `<i class="bi bi-pencil-square edit-PInvoiceUpdate edit-icon"  data-id="${value.Id}"  style="cursor:pointer;font-size:25px;"></i>`}
                </td>
                  <!-- Bill Verification Status -->
                 <td class="text-center">
                   ${value.VerificationStatus === "V"
                ? '<i class="bi bi-check-circle-fill text-success" title="Verified" style="font-size:25px;"></i>'
                : '<i class="bi bi-x-circle-fill text-danger" title="Not Verified" style="font-size:25px;"></i>'}
               </td>
                  <!-- HPSEDC Bill Generate -->
                 <td class="text-center">
                    ${value.IsSaleBIllGenerated === "C"
                ? '<i class="bi bi-lock-fill text-secondary" title="Verify Bill First" style="font-size:25px;"></i>'
                : `<i class="bi bi-pencil-square edit-HPSEDC_SInvoice edit-icon"   data-id="${value.Id}"  style="cursor:pointer;font-size:25px;"></i>`}
                </td>
                  <!-- E-Invoice -->
                <td class="text-center">

                </td>
                  <!-- Invoice Print -->
                 <td class="text-center">
                       <i class="bi bi-printer-fill edit-HPSEDC_Invoice_Print" data-id="${value.Id}" title="Print Invoice"
                       style="cursor:pointer;font-size:25px;color:#0d6efd;">  </i>
                </td>
                  <!-- Cancel Bill -->
                 <td class="text-center">
                      
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


// View Uploaded pdf on New tab file conditions 
$(document).on('click', '.view-file', function (e) {
    e.preventDefault(); // Prevent default <a> behavior

    var fileName = $(this).data('file');
    var folder = $(this).data('folder');

    if (!fileName || fileName === 'undefined' || fileName === '') {
        toastr.error('File not uploaded');
        return;
    }

    // Construct URL
    var url = `/Attachment/DeptAttendance/${folder}/${fileName}`;

    // Open in new tab
    window.open(url, '_blank');
});

// MsgBox on Agency Bill verification 
$(document).on('click', '.edit-PInvoiceUpdate', async function () {

    var recordId = $(this).data("id");
    alert(recordId);
    console.log("Edit Record Id:", recordId);

    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }
    // ✅ store ID in hidden field (VERY IMPORTANT)
    $("#hdnAgencyBillId").val(recordId);
    console.log("Clicked ID:", recordId);
    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question');

    if (isConfirmed) {
        //alert('Testing');
        await loadPInvoiceUpdate(recordId);
        openModal('PInvoiceUpdateModal');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {
        console.log('Edit cancelled');
    }
});

// get Record to fill Agency Bill verification
async function loadPInvoiceUpdate(recordId) {
    //alert('Load Record function')

    var filterData = {
        Id: recordId,
        AgencyId: 0,
        DeptId: 0,
        MonthId: 0,
        MonthIdTo: 0,
        PaymentStatus: 'A',
        CreatedBy: 0,
        UserRole: 39,
    };


    try {

        let records = await getRecords('ManpowerInvoice', 'GetAgencyInvoiceVerifyRecord', filterData, '', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            console.log(data)

            Id = data.Id;
            $("#datePurchaseBillDate1").val(data.BillDate);
            $("#txtWorkOrderNo1").val(data.WorkOrderId);
            $("#txtPurchaseBillNo1").val(data.AgencyBillNo);
            $("#txtDepBillingAdd1").val(data.DeptBillingAdd);
            $("#txtNoResource1").val(data.NoofResource);
            $("#monthYear1").val(data.BillMonth);
            $("#txtDiscription1").val(data.Description);
            $("#txtNarration1").val(data.Narration);

            $("#numBasicAmount").val(parseFloat(data.BasicBillAmt).toFixed(2));
            $("#numAdminCharge").val(parseFloat(data.AdminCharge).toFixed(2));
            $("#numLiveryCharge").val(parseFloat(data.LiveryCharge).toFixed(2));
            $("#numCgst").val(parseFloat(data.InputCgst).toFixed(2));
            $("#numSgst").val(parseFloat(data.InputSgst).toFixed(2));
            $("#numTotalAmount").val(parseFloat(data.TotalAmt).toFixed(2));

            $("#hdnAgencyId1").val(data.AgencyId);
            $("#hdnDeptId1").val(data.DeptId);
            $("#hdnBillingId1").val(data.BillingId);

            console.log("AgencyId:", data.AgencyId);
            console.log("DeptId:", data.DeptId);
            console.log("BillingId:", data.BillingId);

            bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName1", " Agency Name", data.AgencyId, 0);
            var option = new Option(data.AgencyName, data.AgencyId, true, true);
            $('#ddlAgencyName1').append(option).trigger('change');

            bindDataToDdl("Dropdown", "MDepartment_ddl", "", "txtDeptName1", " Department Name", data.DeptId, 0);
            var option = new Option(data.DepartmentName, data.DeptId, true, true);
            $('#txtDeptName1').append(option).trigger('change');
            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}

// Submit Updated Purchase Bill Details
$(".btnModalSubmit").on("click", function () {
    SubmitPInvoiceUpdate();
});

// Submit records
async function SubmitPInvoiceUpdate() {
    let agencyBillId = $("#hdnAgencyBillId").val();
    console.log("Submitting ID:", agencyBillId); // 🔥 debug
    alert('PInvoiceUpdate');
    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    let purcahseBillDate = $("#datePurchaseBillDate1").val();
    let discription = $("#txtDiscription1").val();
    let narration = $("#txtNarration1").val();
    let billNo = $("#txtPurchaseBillNo1").val();
    let status = $('input[name="billStatus"]:checked').val();
    let remarks = $("#txtRemarks").val().trim();

    if (!status) {
        alert("Please select Verify or Reject");
        isValid = false;
    }
    if (remarks === "") {
        $("#txtRemarks").addClass("is-invalid");
        $("#txtRemarks").siblings(".error").text("Remarks required");
        isValid = false;
    }

    if (!isValid) return;

    var formData = new FormData();


    formData.append("AgencyBillId", Id);
    formData.append("IsPurchaseBillVerified", status);
    formData.append("VerificationRemarks", remarks);
    formData.append("Description", discription);
    formData.append("Narration", narration);
    formData.append("PurchaseBillDate", purcahseBillDate);
    formData.append("AgencyBillNo", billNo);



    try {
        //$("#ModalProgress").show();
        let res = await acceptUpdate("ManpowerInvoice", "AddOrEdit_UpdatePInvoiceRecord", formData);
        if (res.success) {
            alert('Hit');
            recordlist();
            resetModal();

            Id = 0;
            $('.modelalert').text(res.message);
            closeModal('PInvoiceUpdateModal');
            MsgBox('Message', res.message, '');
        }

    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }

}

// MsgBox on HPSCED Sale Bill 
$(document).on('click', '.edit-HPSEDC_SInvoice', async function () {

    var recordId = $(this).data("id");
    alert(recordId);
    console.log("Edit Record Id:", recordId);

    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }


    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question');

    if (isConfirmed) {
        //alert('Testing');
        await loadSInvoice(recordId);
        openModal('SInvoiceModal');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {

        console.log('Edit cancelled');

    }

});

// get Record to fill HPSEDEC Sale Bill
async function loadSInvoice(recordId) {
    //alert('Load Record function')
    var filterData = {
        Id: recordId,
        AgencyId: 0,
        DeptId: 0,
        MonthId: 0,
        MonthIdTo: 0,
        PaymentStatus: 'A',
        // CreatedBy: 0,
        //UserRole: 39,
    };

    try {

        let records = await getRecords('ManpowerInvoice', 'GetAgencyInvoiceVerifyRecord', filterData, '', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            Id = data.Id;

            $("#txtWorkOrderNo2").val(data.WorkOrderId);
            $("#txtPurchaseBillNo2").val(data.AgencyBillNo);
            // $("#dateSaleBillDate").val(data.BillDate);
            $("#txtSaleBillNo").val(data.SaleBillNo);
            $("#hdnAgencyId2").val(data.AgencyId);
            $("#txtAgencyName2").val(data.AgencyName);
            $("#hdnDeptId2").val(data.DeptId);
            $("#txtDeptName2").val(data.DepartmentName);
            $("#hdnBillingAddId2").val(data.BillingId);
            $("#txtDepBillingAdd2").val(data.DeptBillingAdd);
            $("#monthYear2").val(data.BillMonth);
            $("#txtNoResource2").val(data.NoofResource);
            $("#txtDiscription2").val(data.Description);
            $("#txtNarration2").val(data.Narration);

            $("#numBasicAmount2").val(parseFloat(data.BasicBillAmt).toFixed(2));
            $("#numAdminCharge2").val(parseFloat(data.AdminCharge).toFixed(2));
            $("#numLiveryCharge2").val(parseFloat(data.LiveryCharge).toFixed(2));
            $("#numCgst2").val(parseFloat(data.InputCgst).toFixed(2));
            $("#numSgst2").val(parseFloat(data.InputSgst).toFixed(2));
            $("#numTotalAmount2").val(parseFloat(data.TotalAmt).toFixed(2));

            //$("#hdnAgencyId2").val(data.AgencyId);
            //$("#hdnDeptId2").val(data.DeptId);
            //$("#hdnBillingId2").val(data.BillingId);

            //console.log("AgencyId:", data.AgencyId);
            //console.log("DeptId:", data.DeptId);
            //console.log("BillingId:", data.BillingId);

            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}

// Submit HPSEDC Sale Bill Details
$(".btnModalSubmit2").on("click", function () {

    SubmitSInvoice();
});

// Submit records
async function SubmitSInvoice() {

    alert('SInvoiceUpdate');
    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    let workOrderNo = $("#txtWorkOrderNo2").val();
    let pBillNo = $("#txtPurchaseBillNo2").val();
    let saleBillDate = $("#dateSaleBillDate").val();
    let saleBillNo = $("#txtSaleBillNo").val();
    let agencyId = $("#hdnAgencyId2").val();
    let deptId = $("#hdnDeptId2").val();
    let billingId = $("#hdnBillingAddId2").val();
    let billingAdd = $("#txtDepBillingAdd2").val();
    let monthYear = $("#monthYear2").val();
    let pinCode = $("#numPinCode").val();
    let gstNo = $("#txtGstNo").val();
    let hsnCode = $("#txtHsnCode").val();
    let description = $("#txtDiscription2").val();
    let narration = $("#txtNarration2").val();
    let agencyBillAmt = $("#numBasicAmount2").val();
    let adminAmt = $("#numAdminCharge2").val();
    let libraryAmt = $("#numLiveryCharge2").val();
    let cgstAmt = $("#numCgst2").val();
    let sgstAmt = $("#numSgst2").val();
    let totalAmt = $("#numTotalAmount2").val();


    if (pinCode === "") {
        $("#numPinCode").addClass("is-invalid");
        $("#numPinCode").siblings(".error").text("Bill Date Required");
        isValid = false;
    }
    if (gstNo === "") {
        $("#txtGstNo").addClass("is-invalid");
        $("#txtGstNo").siblings(".error").text("Bill No Required");
        isValid = false;
    }
    if (hsnCode === "") {
        $("#txtHsnCode").addClass("is-invalid");
        $("#txtHsnCode").siblings(".error").text("Month & Year required");
        isValid = false;
    }

    if (!isValid) return;

    var formData = new FormData();

    formData.append("DeptBillId", 0);

    formData.append("Id", Id);

    alert('Cheking');
    alert(Id);
    formData.append("WorkOrderNo", workOrderNo);
    formData.append("SaleBillNo", saleBillNo);
    formData.append("SaleBillDate", saleBillDate);
    formData.append("PBillNo", pBillNo);
    formData.append("MonthYear", monthYear);
    formData.append("AgencyId", parseInt(agencyId));
    formData.append("DeptId", parseInt(deptId));
    formData.append("GSTNo", gstNo);
    formData.append("PinNo", pinCode);
    formData.append("HsnCode", hsnCode);
    formData.append("BillingId", parseInt(billingId));
    formData.append("BillingAdd", billingAdd);
    formData.append("Description", description);
    formData.append("Narration", narration);
    formData.append("AgencyBillAmt", Number(agencyBillAmt));
    formData.append("AdminAmt", Number(adminAmt));
    formData.append("LibraryAmt", Number(libraryAmt));
    formData.append("CgstAmt", Number(cgstAmt));
    formData.append("SgstAmt", Number(sgstAmt));
    formData.append("TotalAmt", Number(totalAmt));
    formData.append("PaymentAmt", 0);
    formData.append("BalanceAmt", 0);
    formData.append("IsActive", 0);




    try {
        //$("#ModalProgress").show();
        let res = await acceptUpdate("ManpowerInvoice", "AddOrEdit_UpdateSInvoiceRecord", formData);
        if (res.success) {
            alert('Hit');
            recordlist();
            resetModal();

            Id = 0;
            $('.modelalert').text(res.message);
            closeModal('SInvoiceModal');
            MsgBox('Message', res.message, '');
        }

    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }

}

// MsgBox on HPSCED Print Bill 
$(document).on('click', '.edit-HPSEDC_Invoice_Print', async function () {

    var recordId = $(this).data("id");
    alert(recordId);
    console.log("Print Record Id:", recordId);

    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }


    var isConfirmed = await DeleteEditBox('Print', 'Do you want to Print Record?', 'question');

    if (isConfirmed) {
        //alert('Testing');
        printInvoice(recordId);
        //await loadSInvoice(recordId);
        // openModal('SInvoiceModal');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {

        console.log('Edit cancelled');

    }

});
function printInvoice(id) {
    window.open(`/HardwareReport/DepartmentInvoice?Id=${id}`, '_blank');
}



// MsgBox on Cancel Sale Bill
$(document).on('click', '.edit-CancelSaleBill', async function () {
    var recordId = $(this).data("id");
    alert(recordId);
    console.log("Edit Record Id:", recordId);
    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }

    Id = recordId;
    console.log("Global Id =", Id);
    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to Cancel Sale Bill?', 'question');
    if (isConfirmed) {
        alert('Testing');
        //await loadPInvoiceUpdate(recordId);
        openModal('CancelSaleBill');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {
        console.log('Edit cancelled');
    }
});

$(".btnModalCancel").on("click", function () {
    alert('Button Clciked');
    SubmitCancelBill();
});
// Submit records
async function SubmitCancelBill() {
    alert('Loading');
    let isValid = true;
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    let isCancel = $("#ChkboxIsCancel").is(":checked");
    //let remarks = $("#txtCancelRemarks").val();
    let remarks = $("#txtCancelRemarks").val();
    console.log("Remarks =", remarks);
    if (!isCancel) {
        $("#ChkboxIsCancel").addClass("is-invalid");
        $("#ChkboxIsCancel").siblings(".error").text("Please Tick Check box");
        isValid = false;
    }
    if (remarks === "") {
        $("#txtCancelRemarks").addClass("is-invalid");
        $("#txtCancelRemarks").siblings(".error").text("Please Enter Remarks");
        isValid = false;
    }

    if (!isValid) return;

    var formData = new FormData();
    formData.append("Id", Id);
    formData.append("IsCancelBill", isCancel);
    formData.append("VerificationRemarks", remarks);
    console.log("Id =", Id);
    console.log("isCancel =", isCancel);
    console.log("VerificationRemarks =", remarks);

    try {
        //$("#ModalProgress").show();
        let res = await acceptUpdate("ManpowerInvoice", "AddOrEdit_CancelSaleBillRecord", formData);
        if (res.success) {
            alert('Hit');
            recordlist();
            resetModal();
            Id = 0;
            $('.modelalert').text(res.message);
            closeModal('CancelSaleBill');
            MsgBox('Message', res.message, '');
        }

    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }

}


//         ${ value.VerificationStatus === "V"
// ? '<i class="bi bi-shield-check text-success" title="Verified" style="font-size:25px;"></i>'
// : `<i class="bi bi-pencil-square edit-PInvoiceUpdate" data-id="${value.Id}"  title="Verify Bill" style="cursor:pointer;font-size:25px;"></i>`}