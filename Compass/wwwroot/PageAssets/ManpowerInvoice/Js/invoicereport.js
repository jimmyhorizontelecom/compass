var AgencyBillId = 0;


$(document).ready(function () {
    alert('Invoice Report');
    resetModal();
    recordlist();
    // // alert('New Invoice Loaded');

    initCustomPicker('#MonthYear');
    //Parent Dropdwon ddl
    bindDataToDdl("Dropdown", "MDepartment_ddl", "", "ddlDeptName", " Department Name");
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", " Agency Name");

    //  // load data when changes on ddl
    $("#ddlAgencyName, #ddlDeptName, #MonthYear, #chkPaymentReceived, #chkPaymentReleased, #chkBalancePayment").change(function (){
        recordlist();
        alert('DDL Change Fire');
    });
   //  $("#fromMonthYear, #toMonthYear, #ddlAgencyName, #ddlDeptName,#ddlPaymentStatus").change(function () {
   //      recordlist();
   //  });
});
// Get Department Bill Report
async function recordlist() {
    var monthYear = $("#MonthYear").val();
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
    var deptId = parseInt($("#ddlDeptName").val()) || 0;
      // Checkboxes
    var pReceived = $("#chkPaymentReceived").is(":checked") ? "Y" : "N";
    var pReleased = $("#chkPaymentReleased").is(":checked") ? "Y" : "N";
    var balance = $("#chkBalancePayment").is(":checked") ? "Y" : "N";

    var filterData = {
        DeptId: deptId,
        AgencyId: agencyId,
        MonthYear: monthYearId,
        SaleBillNo: 0,
        PReceived: pReceived,
        PReleased: pReleased,
        Balance: balance
    };
    console.log("Filter :", filterData);
    try {
        let records = await getRecords( "ManpowerInvoice",  "GetDepartmentBillReport",  filterData, "#myTable", "N" );
        bindDatatable(records, "#myTable");
    }
    catch (error) {
        console.error(error);
        toastr.error("Unable to load records.");
    }
}

// function bindDatatable(records, tableId) {

//     if ($.fn.DataTable.isDataTable(tableId)) {
//         $(tableId).DataTable().clear().destroy();
//     }

//     var tbody = $(tableId + " tbody");
//     tbody.empty();

//     $.each(records, function (i, value) {

//         tbody.append(`
// <tr>
//     <td class="text-center">
//         <input type="checkbox"
//                class="form-check-input rowCheckbox"
//                data-id="${value.AgencyBillId ?? 0}">
//     </td>

//     <td>${i + 1}</td>
//      <td>
//         <strong>GST :- </strong>${value.GSTAmt ?? "0.00"}
//     </td>
//      <td>
//         <strong>GST :- </strong>${value.GSTAmt ?? "0.00"}
//     </td>
//      <td>
//         <strong>GST :- </strong>${value.GSTAmt ?? "0.00"}
//     </td>
//      <td>
//         <strong>GST :- </strong>${value.GSTAmt ?? "0.00"}
//     </td>
//      <td>
//         <strong>GST :- </strong>${value.GSTAmt ?? "0.00"}
//     </td>
//      <td>
//         <strong>GST :- </strong>${value.GSTAmt ?? "0.00"}
//     </td>
//      <td>
//         <strong>GST :- </strong>${value.GSTAmt ?? "0.00"}
//     </td>
//      <td>
//         <strong>GST :- </strong>${value.GSTAmt ?? "0.00"}
//     </td>
//      <td>
//         <strong>GST :- </strong>${value.GSTAmt ?? "0.00"}
//     </td>


// </tr>
// `);

//     });

//     $(tableId).DataTable({
//         paging: true,
//         searching: true,
//         ordering: true,
//         info: true,
//         responsive: true
//     });
// }

function bindDatatable(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    if (!records || records.length === 0) {

        tbody.append(`
            <tr>
                <td class="text-center">
                    <input type="checkbox" class="form-check-input" >
                </td>
                <td>1</td>
                <td>Dept Add </td>
                <td>AgencyBillNo</td>
                <td>ESI EPF Verification</td>
                <td>Amt1:- <br>
                CG:- <br>
                SG:- <br>
                IGST:- <br>
                Liv. Chg:- <br>
                TA1:- <br>
                </td>
                <td>ESI EPF Verification</td>
                <td>Amt2:- <br>
                CG:- <br>
                SG:- <br>
                IGST:- <br>
                Liv. Chg:- <br>
                TA2:- <br>
                </td>
                <td>Amt3:- <br>
                TDS:- <br>
                GTD:- <br>
                TA3:- <br>
                </td>
                <td>Amt4:- <br>
                TDS:- <br>
                GTD:- <br>
                TA4:- <br>
                </td>
                <td>Amt5:- <br>
                TDS:- <br>
                GTD:- <br>
                TA5:- <br>
                </td>
                <td>TDS Status</td>
            </tr>
        `);

        return;
    }

    $.each(records, function (i, value) {

        tbody.append(`
            <tr>
                <td class="text-center">
                    <input type="checkbox"
                           class="form-check-input rowCheckbox"
                           data-id="${value.AgencyBillId ?? 0}">
                </td>

                <td>${i + 1}</td>
                <td>${value.DepartmentAddress ?? ""}" </td>
                <td>AgencyBillNo</td>
                <td>ESI EPF Verification</td>
                <td>Amt1:- <br>
                CG:- <br>
                SG:- <br>
                IGST:- <br>
                Liv. Chg:- <br>
                TA1:- <br>
                </td>
                <td>ESI EPF Verification</td>
                <td>Amt2:- <br>
                CG:- <br>
                SG:- <br>
                IGST:- <br>
                Liv. Chg:- <br>
                TA2:- <br>
                </td>
                <td>Amt3:- <br>
                TDS:- <br>
                GTD:- <br>
                TA3:- <br>
                </td>
                <td>Amt4:- <br>
                TDS:- <br>
                GTD:- <br>
                TA4:- <br>
                </td>
                <td>Amt5:- <br>
                TDS:- <br>
                GTD:- <br>
                TA5:- <br>
                </td>
                <td>TDS Status</td>
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
}