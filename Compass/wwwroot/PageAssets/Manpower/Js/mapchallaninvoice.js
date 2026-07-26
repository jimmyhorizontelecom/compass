var Id = 0;


$(document).ready(function () {
    resetModal();
    recordlist();
    alert('Map Challan Loading');
    initCustomPicker('#monthYear');
    // Parent Dropdown
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", " Agency Name");
    bindDataToDdl("Dropdown", "MChallanType_ddl", "", "ddlChallanType", " Challan Type");
    bindDataToDdl("Dropdown", "MChallanType_ddl", "", "ddlChallanNumber", " Challan Number");
});

//Get Record for A table 
async function recordlist() {
    var monthYear = $("#monthYear").val(); 
    var monthYearId = "0"; // Default value
    if (monthYear) {
        // 2. Format Change: "04/2026" -> "42026" (Month + Year)
        // Use parseInt to Split leading zero 
        var parts = monthYear.split('/');
        var m = parseInt(parts[0], 10); // "04" becomes 4
        var y = parts[1];               // "2026"
        monthYearId = m.toString() + y.toString(); // "42026"
    }
    var agencyId = parseInt($("#ddlAgencyName").val()) || 0;
    var challanType = parseInt($("#ddlChallanType").val()) || 0;
    var challanNumber = parseInt($("#ddlChallanNumber").val()) || 0;
     var filterData = {
        AgencyBillId: 1754,
        //AgencyId: agencyId,
        //MonthId: monthYearId,
        //PageNo: 1,
        //PageSize: 10,
    };
    console.log("Filter", filterData);
    try {

        let records = await getRecords('Manpower', 'GetMapChallanInvoiceRecord', filterData, '#myTable', 'N');
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
                <td class="text-center"> <input type="checkbox" class="rowCheckbox" value="${value.EmpId}"></td>
                <td>${value.DeptAdd}</td>
                <td>${value.AgencyName}</td>
                <td>${value.SaleBillNo} </td>
                <td>${value.SaleBillAmt} </td>
               <td class="text-center"> <input type="number" class="inputNoOfResource"  style="width:100px;"></td>
                
                 
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


// Select All checkbox
$(document).on('change', '#selectAll', function () {
    $('.rowCheckbox').prop('checked', $(this).prop('checked'));
});
$(document).on('change', '.rowCheckbox', function () {
    if (!$(this).prop('checked')) {
        $('#selectAll').prop('checked', false);
    } else {
        // Check if all checkboxes are checked
        if ($('.rowCheckbox:checked').length === $('.rowCheckbox').length) {
            $('#selectAll').prop('checked', true);
        }
    }
});


