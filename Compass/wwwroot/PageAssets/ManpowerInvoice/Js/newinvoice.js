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

// get Record to fill Dept. Payment Modal
async function loadDeptPayment(recordId) {
   
    var filterData = {
        AgencyBillId: recordId,
        
    };

    try {

        let records = await getRecords('ManpowerInvoice', 'GetAgencyInvoiceDeptPaymentRecord', filterData, '', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            console.log(data)
            AgencyBillId = data.AgencyBillId;
            $("#txtPurchaseBillNo").val(data.PurchaseBillNo);
            $("#txtPurchaseBillDate").val(data.PurchaseBillDate);
            $("#txtSaleBillNo").val(data.SaleBillNo);
            $("#txtSaleBillDate").val(data.SaleBillDate);
            $("#txtSaleBillAmt").val(parseFloat(data.SaleBillAmt).toFixed(2));
            $("#txtDeptName").val(data.DeptName);
            $("#txtAgencyName").val(data.AgencyName);
            $("#txtDeptAdd").val(data.DeptAdd);

            $("#hdnDeptId").val(data.AgencyId);
            $("#hdnAgencyId").val(data.AgencyId);
           
            console.log("AgencyId:", data.DeptId);
            console.log("DeptId:", data.DeptId);
            //Parent Dropdwon ddl
            bindDataToDdl("Dropdown", "MBank_ddl", "", "ddlBankName", " Bank Name");
            bindDataToDdl("Dropdown", "MPaymentMode_ddl", "", "ddlPaymentMode", " Payment Mode");

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
        await loadPartialPayment(recordId);
        openModal('PartialPaymentModal');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {
        console.log('Edit cancelled');
    }
});

// get Record to fill Partial Dept. Payment
async function loadPartialPayment(recordId) {

    var filterData = {
        AgencyBillId: recordId,

    };

    try {

        let records = await getRecords('ManpowerInvoice', 'GetAgencyInvoiceDeptPaymentRecord', filterData, '', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            console.log(data)
            AgencyBillId = data.AgencyBillId;
           
            //Parent Dropdwon ddl
            bindDataToDdl("Dropdown", "MBank_ddl", "", "ddlBankName2", " Bank Name");
            bindDataToDdl("Dropdown", "MPaymentMode_ddl", "", "ddlPaymentMode2", " Payment Mode");

        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}

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
        await loadEditDeptPayment(recordId);
        openModal('EditDeptPaymentModal');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');
    } else {
        console.log('Edit cancelled');
    }
});
// get Record to fill Edit Dept. Payment
async function loadEditDeptPayment(recordId) {
    
    var filterData = {
        AgencyBillId: recordId,

    };

    try {

        let records = await getRecords('ManpowerInvoice', 'GetAgencyInvoiceDeptPaymentRecord', filterData, '', 'N');
        console.log("Full Response:", records);
        if (records && records.length > 0) {
            let data = records[0];
            console.log(data)
            AgencyBillId = data.AgencyBillId;
            $("#txtPurchaseBillNo1").val(data.PurchaseBillNo);
            $("#txtPurchaseBillDate1").val(data.PurchaseBillDate);
            $("#txtSaleBillNo1").val(data.SaleBillNo);
            $("#txtSaleBillDate1").val(data.SaleBillDate);
            $("#txtSaleBillAmt1").val(parseFloat(data.SaleBillAmt).toFixed(2));
            $("#txtDeptName1").val(data.DeptName);
            $("#txtAgencyName1").val(data.AgencyName);
            $("#txtDeptAdd1").val(data.DeptAdd);

            $("#hdnDeptId1").val(data.AgencyId);
            $("#hdnAgencyId1").val(data.AgencyId);

            console.log("AgencyId1:", data.DeptId);
            console.log("DeptId1:", data.DeptId);

            //Parent Dropdwon ddl
            bindDataToDdl("Dropdown", "MBank_ddl", "", "ddlBankName1", " Bank Name");
            bindDataToDdl("Dropdown", "MPaymentMode_ddl", "", "ddlPaymentMode1", " Payment Mode");

        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}

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