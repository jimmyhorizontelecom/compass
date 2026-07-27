var AgencyBIllId = 0;


$(document).ready(function () {
    resetModal();
    recordlist();
    alert('Map Challan Loading');
    initCustomPicker('#monthYear');
    // Parent Dropdown
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", " Agency Name");
    bindDataToDdl("Dropdown", "MChallanType_ddl", "", "ddlChallanType", " Challan Type");
    //bindDataToDdl("Dropdown", "MChallanNumber_ddl", "", "ddlChallanNumber", " Challan Number");
    $("#monthYear").on("change", function () {
        let value = $(this).val(); // 06/2025
        if (value) {
            let arr = value.split('/');
            let monthYear = parseInt(parseInt(arr[0], 10).toString() + arr[1], 10);
            $("#hdnMonthYear").val(monthYear).trigger("change");
        }
    });
    // Dependent Dropdown on multiple parents
    bindDependentDataToDdlToParent("Dropdown", "MChallanNumber_ddl", null,// ❗ no modal
        "hdnMonthYear", "ddlAgencyName", "ddlChallanType", "ddlChallanNumber", "Challan Number ",);


    $("#btnSubmit").prop("disabled", true);
});
$(document).on("change", "#ddlChallanNumber", async function () {

    let challanId = parseInt($(this).val()) || 0;

    // Agar koi Challan select nahi hua
    if (challanId === 0) {
        $("#txtTotalResources").val("");
        $("#txtAllocatedResource").val("");
        return;
    }

    let filterData = {
        Id: challanId,
        ParentId1: parseInt($("#hdnMonthYear").val()) || 0,
        ParentId2: parseInt($("#ddlAgencyName").val()) || 0,
        ParentId3: parseInt($("#ddlChallanType").val()) || 0
    };

    try {
        let records = await getRecords(
            "Dropdown",
            "MChallanResourceNumber_ddl",
            filterData,
            "",
            "N"
        );

        if (records.length > 0) {
            $("#txtTotalResources").val(records[0].NoOfResource);
            $("#txtAllocatedResource").val(records[0].InvoicePerson);
        } else {
            $("#txtTotalResources").val("");
            $("#txtAllocatedResource").val("");
        }
        recordlist();
    }
    catch (e) {
        console.log(e);
    }
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
         AgencyId: agencyId,
         ChallanId:0,
         MonthYear: monthYearId,
         ChallanType: challanType,
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
                data-agencybillid="${value.AgencyBillId}">
                <td>${SrNo}</td>
                <td class="text-center"> <input type="checkbox" class="rowCheckbox" value="${value.EmpId}"></td>
                <td>${value.AgencyBillNo}</td>
                <td>${value.AgencyName}</td>
                <td>${value.BillForMonth} </td>
                <td class="rowTotalResource">${value.TotalResource} </td>
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
    checkSubmitButton();
});
//Select Individual row checkbox
$(document).on('change', '.rowCheckbox', function () {
    if (!$(this).prop('checked')) {
        $('#selectAll').prop('checked', false);
    }
    else {
        if ($('.rowCheckbox:checked').length === $('.rowCheckbox').length) {
            $('#selectAll').prop('checked', true);
        }
    }
   checkSubmitButton();
});

//validation on current row while input Resources
$(document).on("input change", ".inputNoOfResource, .rowCheckbox", function () {
    let currentRow = $(this).closest("tr");
    let input = currentRow.find(".inputNoOfResource");
    let checkbox = currentRow.find(".rowCheckbox");
    let rowTotalResource = parseInt(currentRow.find(".rowTotalResource").text()) || 0;
    let value = parseInt(input.val()) || 0;
    // Negative / Zero Validation
    if (input.val() !== "" && value <= 0) {
        toastr.error("Resource must be greater than 0.");
        input.val("");
        checkSubmitButton();
        return;
    }
    // Sirf Current Row Validation
    if (checkbox.is(":checked") && value > rowTotalResource) {
        toastr.error("Resource cannot exceed Row Total Resource (" + rowTotalResource + ").");
        input.val("");
        checkSubmitButton();
        return;
    }
    checkSubmitButton();
});
//Enable/Disable Submit button when Select checkbox and Input Resources
function checkSubmitButton() {
    let enable = false;
    $("#myTable tbody tr").each(function () {
        let checked = $(this).find(".rowCheckbox").is(":checked");
        let value = parseInt($(this).find(".inputNoOfResource").val()) || 0;
        console.log("Checked:", checked, "Value:", value);
        if (checked && value > 0) {
            enable = true;
            return false;
        }
    });
    console.log("Enable Button:", enable);
    $("#btnSubmit").prop("disabled", !enable);
}
//Submit Button
$("#btnSubmit").on("click", function () {
    SubmitMapChallanInvoice();
});
//Submit function
async function SubmitMapChallanInvoice() {
    mapChallanRecords = [];
    // Challan Resource Details
    let totalResource = parseInt($("#txtTotalResources").val()) || 0;
    let uploadedResource = parseInt($("#txtAllocatedResource").val()) || 0;
    let remainingResource = totalResource - uploadedResource;
    let enteredTotal = 0;
    // Prepare Records
    $("#myTable tbody tr").each(function () {
        let chk = $(this).find(".rowCheckbox");
        if (chk.is(":checked")) {
            let noOfResource = parseInt($(this).find(".inputNoOfResource").val()) || 0;
            // Input Validation
            if (noOfResource <= 0) {
                MsgBox("Error", "Please enter valid No. of Resource.", "");
                enteredTotal = -1;
                return false;
            }
            enteredTotal += noOfResource;
            mapChallanRecords.push({
                AgencyBIllId: parseInt($(this).attr("data-id")) || 0,
                ChallanFor: parseInt($("#ddlChallanType").val()) || 0,
                NoOfResource: noOfResource,
                ChallanId: parseInt($("#ddlChallanNumber").val()) || 0,
                MonthYearId: parseInt($("#hdnMonthYear").val()) || 0
            });
        }
    });
    // Invalid Input
    if (enteredTotal == -1)
        return;
    // No Record Selected
    if (mapChallanRecords.length == 0) {
        MsgBox("Error", "Please select at least one record.", "");
        return;
    }
    // Final Validation
    if (enteredTotal > remainingResource) {
        MsgBox( "Error", "Remaining Resource is only " + remainingResource + ". You have entered " + enteredTotal + " resources.", "" );
        return;
    }
    try {
         let result = await acceptUpdateMultiJData( "Manpower", "SubmitMapChallanInvoice", mapChallanRecords);
         if (result.success) {
             MsgBox("Success", result.message, "");
            resetModal();
            recordlist();
        }
        else {
            MsgBox("Error", result.message, "");
        }
    }
    catch (e) {
        console.log(e);
        MsgBox("Error", "Something went wrong.", "");
    }
}
