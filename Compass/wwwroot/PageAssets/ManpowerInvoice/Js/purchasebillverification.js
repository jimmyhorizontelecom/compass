var Id = 0;


$(document).ready(function () {
    initializeMonthYearPickerByClass("monthYearPicker");
  
    resetModal();
    recordlist();
    //alert('Purchase Bill Verification');
    
    //Parent Dropdown
    bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptName", " Department Name");
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", " Agency Name");
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlBillStatu", " Bill Status");
});

//Get Record for A table 
async function recordlist() {

    var filterData = {
        Id: 0,
        AgencyId: 0,
        AgencyBillId: 0,
        DeptId: 0,
        MonthId: '112025',
        PaymentStatus: 'C',
        //CreatedBy: 0,
        //UserRole: 39,

    };

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
                 
                 <td class="text-center">  
                          <i class="bi bi-pencil-square edit-PInvoiceUpdate edit-icon" data-id="${value.Id}" style="cursor:pointer;font-size:25px;"></i>             
                </td>

                 <td class="text-center">
                    
                       
                </td>
                 <td class="text-center">
                   <i class="bi bi-pencil-square edit-HPSEDC_SInvoice edit-icon" data-id="${value.Id}" style="cursor:pointer;font-size:25px;"></i>
                  
                      
                   
                </td>
                 <td class="text-center">
                   
                   
                </td>
                 <td class="text-center">
                  
                       
                  
                </td>
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
        MonthYear: 0,
        CreatedBy: 0,
        UserRole: 39,
    };

    try {

        let records = await getRecords('ManpowerInvoice', 'GetAgencyInvoiceVerifyRecord', filterData, '', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            Id = data.Id;
            $("#datePurchaseBillDate1").val(data.BillDate);
            $("#txtWorkOrderNo1").val(data.WorkOrderId);
            $("#txtAgencyBillNo1").val(data.AgencyBillNo);
            $("#txtDepBillingAdd1").val(data.DeptBillingAdd);
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
    alert('PInvoiceUpdate');
    //let isValid = true;
    //$(".error").text("");
    //$(".is-invalid").removeClass("is-invalid");

    //let purcahseBillDate = $("#ddlPurchaseBillDate1").val();
    //let workOrderNo = $("#txtWorkOrderNo1").val().trim();
    //let billNo = $("#txtAgencyBillNo1").val().trim();
    //let agencyId = $("#hdnAgencyId1").val();
    //let deptId = $("#hdnDeptId1").val();
    //let billingId = $("#hdnBillingId1").val();
    //let noOfResource = $("#txtNoResource1").val().trim();
    //let billingAdd = $("#txtDepBillingAdd1").val();
    //let monthYear = $("#monthYear1").val();
    //let discription = $("#txtDiscription1").val();
    //let narration = $("#txtNarration1").val().trim();
    //let billAmount = $("#numBasicAmount").val().trim();
    //let adminCharge = $("#numAdminCharge").val().trim();
    //let liveryCharge = $("#numLiveryCharge").val().trim();
    //let inputCGST = $("#numCgst").val().trim();
    //let inputSGST = $("#numSgst").val().trim();
    //let totalAmount = $("#numTotalAmount").val().trim();

    //if (purcahseBillDate === "") {
    //    $("#ddlPurchaseBillDate1").addClass("is-invalid");
    //    $("#ddlPurchaseBillDate1").siblings(".error").text("Bill Date Required");
    //    isValid = false;
    //}
    //if (billNo === "") {
    //    $("#txtAgencyBillNo1").addClass("is-invalid");
    //    $("#txtAgencyBillNo1").siblings(".error").text("Bill No Required");
    //    isValid = false;
    //}
    //if (!monthYear) {
    //    $("#monthYear1").addClass("is-invalid");
    //    $("#monthYear1").siblings(".error").text("Month & Year required");
    //    isValid = false;
    //}
    //if (discription === "") {
    //    $("#txtDiscription1").addClass("is-invalid");
    //    $("#txtDiscription1").siblings(".error").text("Discription Required");
    //    isValid = false;
    //}
    //if (narration === "") {
    //    $("#txtNarration1").addClass("is-invalid");
    //    $("#txtNarration1").siblings(".error").text("Narration Required");
    //    isValid = false;
    //}
    //if (billAmount === "") {
    //    $("#numBasicAmount").addClass("is-invalid");
    //    $("#numBasicAmount").siblings(".error").text("Bill Amount Required");
    //    isValid = false;
    //}
    //if (adminCharge === "") {
    //    $("#numAdminCharge").addClass("is-invalid");
    //    $("#numAdminCharge").siblings(".error").text("Admin Charge Required");
    //    isValid = false;
    //}
    //if (liveryCharge === "") {
    //    $("#numLiveryCharge").addClass("is-invalid");
    //    $("#numLiveryCharge").siblings(".error").text("Livery Charge Required");
    //    isValid = false;
    //}
    //if (inputCGST === "") {
    //    $("#numCgst").addClass("is-invalid");
    //    $("#numCgst").siblings(".error").text("CGST Required");
    //    isValid = false;
    //}
    //if (inputSGST === "") {
    //    $("#numSgst").addClass("is-invalid");
    //    $("#numSgst").siblings(".error").text("CGST Required");
    //    isValid = false;
    //}
    //if (totalAmount === "") {
    //    $("#numTotalAmount").addClass("is-invalid");
    //    $("#numTotalAmount").siblings(".error").text("Total Amnount Required");
    //    isValid = false;
    //}

    //if (!isValid) return;

    //var formData = new FormData();

    ////let monthYear = $("#monthYear1").val();
    //let finalMonthYear = monthYear.replace("-", "");
    //formData.append("MonthYear", finalMonthYear);
    //formData.append("AgencyBillId", 0);
    //formData.append("PurchaseBillDate", purcahseBillDate);
    //formData.append("WorkOrderNo", workOrderNo);
    //formData.append("NoOfResources", noOfResource);
    //formData.append("Id", Id);
    //formData.append("AgencyBillNo", billNo);
    //formData.append("AgencyId", parseInt(agencyId));
    //formData.append("DeptId", parseInt(deptId));
    //formData.append("BillingId", parseInt(billingId));
    //formData.append("BillingAdd", billingAdd);
    //formData.append("Description", discription);
    //formData.append("Narration", narration);
    //formData.append("BasicBillAmt", Number(billAmount));
    //formData.append("AdminCharge", Number(adminCharge));
    //formData.append("LiveryCharge", Number(liveryCharge));
    //formData.append("InputCgst", Number(inputCGST));
    //formData.append("InputSgst", Number(inputSGST));
    //formData.append("InputIgst", 0);
    //formData.append("TotalAmt", Number(totalAmount));
    ////formData.append("UpladNoOfResource", noOfResources);
    ////formData.append("PresentResource", presentResources);


    //try {
    //    //$("#ModalProgress").show();
    //    let res = await acceptUpdate("Manpower", "AddOrEdit_PurchaseInvoiceRecord", formData);
    //    if (res.success) {
    //        alert('Hit');
    //        recordlist();
    //        resetModal();

    //        Id = 0;
    //        $('.modelalert').text(res.message);
    //        closeModal('myModal_AgencyInvoice');
    //        MsgBox('Message', res.message, '');
    //    }

    //} catch (err) {
    //    $('.modelalert').text("Error: " + err);
    //}

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
    alert('Load Record function')
    var filterData = {
        Id: recordId,
        AgencyId: 0,
        DeptId: 0,
        MonthYear: 0,
        CreatedBy: 0,
        UserRole: 39,
    };

    try {

        let records = await getRecords('ManpowerInvoice', 'GetAgencyInvoiceVerifyRecord', filterData, '', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            Id = data.Id;
            $("#datePurchaseBillDate1").val(data.BillDate);
            $("#txtWorkOrderNo2").val(data.WorkOrderId);
            $("#txtPurchaseBillNo2").val(data.PurchaseBillNo);
            $("#txtSaleBillNo").val(data.AgencyBillNo);
            $("#txtAgencyName2").val(data.AgencyName);
            $("#txtDeptName2").val(data.DepartmentName);
            $("#txtDepBillingAdd2").val(data.DeptBillingAdd);
            //$("#monthYear2").val(data.BillMonth);
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
    //let isValid = true;
    //$(".error").text("");
    //$(".is-invalid").removeClass("is-invalid");

    //let purcahseBillDate = $("#ddlPurchaseBillDate1").val();
    //let workOrderNo = $("#txtWorkOrderNo1").val().trim();
    //let billNo = $("#txtAgencyBillNo1").val().trim();
    //let agencyId = $("#hdnAgencyId1").val();
    //let deptId = $("#hdnDeptId1").val();
    //let billingId = $("#hdnBillingId1").val();
    //let noOfResource = $("#txtNoResource1").val().trim();
    //let billingAdd = $("#txtDepBillingAdd1").val();
    //let monthYear = $("#monthYear1").val();
    //let discription = $("#txtDiscription1").val();
    //let narration = $("#txtNarration1").val().trim();
    //let billAmount = $("#numBasicAmount").val().trim();
    //let adminCharge = $("#numAdminCharge").val().trim();
    //let liveryCharge = $("#numLiveryCharge").val().trim();
    //let inputCGST = $("#numCgst").val().trim();
    //let inputSGST = $("#numSgst").val().trim();
    //let totalAmount = $("#numTotalAmount").val().trim();

    //if (purcahseBillDate === "") {
    //    $("#ddlPurchaseBillDate1").addClass("is-invalid");
    //    $("#ddlPurchaseBillDate1").siblings(".error").text("Bill Date Required");
    //    isValid = false;
    //}
    //if (billNo === "") {
    //    $("#txtAgencyBillNo1").addClass("is-invalid");
    //    $("#txtAgencyBillNo1").siblings(".error").text("Bill No Required");
    //    isValid = false;
    //}
    //if (!monthYear) {
    //    $("#monthYear1").addClass("is-invalid");
    //    $("#monthYear1").siblings(".error").text("Month & Year required");
    //    isValid = false;
    //}
    //if (discription === "") {
    //    $("#txtDiscription1").addClass("is-invalid");
    //    $("#txtDiscription1").siblings(".error").text("Discription Required");
    //    isValid = false;
    //}
    //if (narration === "") {
    //    $("#txtNarration1").addClass("is-invalid");
    //    $("#txtNarration1").siblings(".error").text("Narration Required");
    //    isValid = false;
    //}
    //if (billAmount === "") {
    //    $("#numBasicAmount").addClass("is-invalid");
    //    $("#numBasicAmount").siblings(".error").text("Bill Amount Required");
    //    isValid = false;
    //}
    //if (adminCharge === "") {
    //    $("#numAdminCharge").addClass("is-invalid");
    //    $("#numAdminCharge").siblings(".error").text("Admin Charge Required");
    //    isValid = false;
    //}
    //if (liveryCharge === "") {
    //    $("#numLiveryCharge").addClass("is-invalid");
    //    $("#numLiveryCharge").siblings(".error").text("Livery Charge Required");
    //    isValid = false;
    //}
    //if (inputCGST === "") {
    //    $("#numCgst").addClass("is-invalid");
    //    $("#numCgst").siblings(".error").text("CGST Required");
    //    isValid = false;
    //}
    //if (inputSGST === "") {
    //    $("#numSgst").addClass("is-invalid");
    //    $("#numSgst").siblings(".error").text("CGST Required");
    //    isValid = false;
    //}
    //if (totalAmount === "") {
    //    $("#numTotalAmount").addClass("is-invalid");
    //    $("#numTotalAmount").siblings(".error").text("Total Amnount Required");
    //    isValid = false;
    //}

    //if (!isValid) return;

    //var formData = new FormData();

    ////let monthYear = $("#monthYear1").val();
    //let finalMonthYear = monthYear.replace("-", "");
    //formData.append("MonthYear", finalMonthYear);
    //formData.append("AgencyBillId", 0);
    //formData.append("PurchaseBillDate", purcahseBillDate);
    //formData.append("WorkOrderNo", workOrderNo);
    //formData.append("NoOfResources", noOfResource);
    //formData.append("Id", Id);
    //formData.append("AgencyBillNo", billNo);
    //formData.append("AgencyId", parseInt(agencyId));
    //formData.append("DeptId", parseInt(deptId));
    //formData.append("BillingId", parseInt(billingId));
    //formData.append("BillingAdd", billingAdd);
    //formData.append("Description", discription);
    //formData.append("Narration", narration);
    //formData.append("BasicBillAmt", Number(billAmount));
    //formData.append("AdminCharge", Number(adminCharge));
    //formData.append("LiveryCharge", Number(liveryCharge));
    //formData.append("InputCgst", Number(inputCGST));
    //formData.append("InputSgst", Number(inputSGST));
    //formData.append("InputIgst", 0);
    //formData.append("TotalAmt", Number(totalAmount));
    ////formData.append("UpladNoOfResource", noOfResources);
    ////formData.append("PresentResource", presentResources);


    //try {
    //    //$("#ModalProgress").show();
    //    let res = await acceptUpdate("Manpower", "AddOrEdit_PurchaseInvoiceRecord", formData);
    //    if (res.success) {
    //        alert('Hit');
    //        recordlist();
    //        resetModal();

    //        Id = 0;
    //        $('.modelalert').text(res.message);
    //        closeModal('myModal_AgencyInvoice');
    //        MsgBox('Message', res.message, '');
    //    }

    //} catch (err) {
    //    $('.modelalert').text("Error: " + err);
    //}

}