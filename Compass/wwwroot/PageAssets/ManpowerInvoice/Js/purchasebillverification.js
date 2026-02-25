var Id = 0;


$(document).ready(function () {
    resetModal();
    recordlist();
    //alert('Purchase Bill Verification');
    //DateInitilised("datePicker", "d/m/Y");
    //MonthYearInitilised("monthYear", "");
    //MonthYearInitilised("monthYearPicker", "");
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
        DeptId: 123,
        MonthYear: '102025',
        CreatedBy: 0,
        UserRole: 39,

    };

    try {

        let records = await getRecords('Manpower', 'GetDeptAttendanceRecord', filterData, '#myTable', 'N');
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
                data-id="${value.Id}"
                <td>${value.Id}</td>
                <td>${SrNo}</td>
                <td>${value.departmentName}</td>
                <td>${value.AgencyName}</td>
                               
              <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i  class="bi bi-download edit-test edit-icon">
                       <a href="/Attachment/DeptAttendance/Attendance/${value.AttendanceCertificate}" target="_blank">Attendance</a>
                       </i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-download edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-download edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-AddSaleBillDetails edit-icon"> Generate Bill</i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-AgencyInvoiceEntry edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-AgencyInvoiceEntry edit-icon"></i>
                    </span>
                </td>
                 <td class="text-center">
                    <span data-id="${value.DeptId}" >
                       <i class="bi bi-pencil-square edit-AgencyInvoiceEntry edit-icon"></i>
                    </span>
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


//Edit Record From Table on Sale Bill Details
$(document).on('click', '.edit-AddSaleBillDetails', async function () {

    var row = $(this).closest('tr');
    Id = row.data('id');

    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question', Id);

    if (isConfirmed) {
        console.log('Edit');
        // User clicked Yes
        await loadRecordById(row);
        openModal('myModal_AddSaleBillDetail');
        // $('#myModal').modal('show');
    } else {
        // User clicked Cancel
        console.log('Edit cancelled');
    }
});
// get Record to fill
async function loadRecordById(row) {

    var filterData = {
        Id: row.data('id'),
        AgencyId: 0,
        DeptId: 123,
        MonthYear: '102025',
        CreatedBy: 0,
        UserRole: 39,
    };

    try {

        let records = await getRecords('Manpower', 'GetDeptAttendanceRecord', filterData, '#myTable', 'N');

        if (records && records.length > 0) {

            let data = records[0];
            Id = data.Id;
            $("#field1").val(data.Field1);
            $("#field2").val(data.Field2);
            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}