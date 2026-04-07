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
                 <td class="text-center">  
                                    
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