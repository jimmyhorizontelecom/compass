var Id = 0;


$(document).ready(function () {
    resetModal();
    recordlist();
    alert('New Invoice Loaded');

    initCustomPicker('#fromMonthYear');
    initCustomPicker('#toMonthYear');
    //Parent Dropdwon ddl
    bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptName", " Department Name");
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", " Agency Name");
});

//Get Record for A table 
async function recordlist() {
    var agencyId = parseInt($("#ddlAgencyName").val()) || 0;
    var deptId = parseInt($("#ddlDeptName").val()) || 0;
    var monthId = '42026';
   
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

    var toMonthYear = $("#fromMonthYear").val();
    var toMonthId = "0"; // Default value
    if (toMonthYear) {
        // 2. Format Change: "04/2026" -> "42026" (Month + Year)
        // Use parseInt to Split leading zero 
        var parts = toMonthYear.split('/');
        var m = parseInt(parts[0], 10); // "04" becomes 4
        var y = parts[1];               // "2026"
        toMonthId = m.toString() + y.toString(); // "42026"
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
        MonthId: '42026',//monthId,
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
                <td>${value.AgencyName}</td>
                <td>${value.AgencyName}</td>
                <td>${value.BillDate} <br> ${value.BillMonth}</td>
                <td>${value.BillDate} <br> ${value.BillMonth}</td>
                <td>${value.BillDate} <br> ${value.BillMonth}</td>
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