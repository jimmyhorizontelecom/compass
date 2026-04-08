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
        AgencyId: agencyId,//1,
        DeptId:deptId,
        MonthId: fromMonthId,//'42026',//monthId,
        MonthIdTo: toMonthId,//'42026',//monthId,
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
                <td>${SrNo}</td>
                <td>${value.DeptName}</td>
                <td>${value.DeptAdd}</td>
                <td>${value.AgencyName}</td>
                <td>${value.SaleBillNo} <br> ${value.PurchaseBillNo}</td>
                <td>${value.SaleBillAmt} </td>
                <td>${value.SaleBillDate}</td>
                 <td class="text-center align-middle">  
                     <button type="button" class="btn  btn-coral txt-white edit-DeptPayment" data-id="${value.AgencyBillId}">
                         Dept. Payment
                     </button>          
                </td>
                <td class="text-center align-middle">
                     <button type="button" class="btn  btn-coral txt-white edit-PartialPayment" data-id="${value.AgencyBillId}">
                         Partial Payment
                     </button>    
                       
                </td>
                 <td class="text-center align-middle">
                    <i class="bi bi-pencil-square edit-DeptPaymentUpdate edit-icon" data-id="${value.AgencyBillId}" style="cursor:pointer;font-size:25px;"></i>
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
$(document).on('click', '.edit-DeptPayment', async function () {
    var recordId = $(this).data("id");
    alert(recordId);
    console.log("Edit Record Id:", recordId);
    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('Dept. Payment', 'Do you want to Pay Dept. Payment?', 'question');
    if (isConfirmed) {
        await loadDeptPayment(recordId);
        openModal('DeptPaymentModal');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {
        console.log('Edit cancelled');
    }
});

// get Record to fill Agency Bill verification
async function loadDeptPayment(recordId) {
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

            bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlBankName", " Agency Name", data.AgencyId, 0);
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

// MsgBox on Partial Payment Button
$(document).on('click', '.edit-PartialPayment', async function () {
    var recordId = $(this).data("id");
    alert(recordId);
    console.log("Edit Record Id:", recordId);
    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('Partial Payment', 'Do you want to Pay Partial Payment?', 'question');
    if (isConfirmed) {
        //await loadPartialPayment(recordId);
        openModal('PartialPaymentModal');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {
        console.log('Edit cancelled');
    }
});



// MsgBox on Edit Dept. Payment Button
$(document).on('click', '.edit-DeptPaymentUpdate', async function () {
    var recordId = $(this).data("id");
    alert(recordId);
    console.log("Edit Record Id:", recordId);
    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('Edit Record', 'Do you want to Edit Record?', 'question');
    if (isConfirmed) {
        //await loadPartialPayment(recordId);
        openModal('EditDeptPaymentModal');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');
    } else {
        console.log('Edit cancelled');
    }
});


// MsgBox on View Dept. Payment Button
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
        //await loadPartialPayment(recordId);
        openModal('ViewDeptPaymentModal');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');
    } else {
        console.log('Edit cancelled');
    }
});