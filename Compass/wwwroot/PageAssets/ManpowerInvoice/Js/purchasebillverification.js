var Id = 0;


$(document).ready(function () {
    initializeMonthYearPickerByClass("monthYearPicker");
  
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
//document.addEventListener("DOMContentLoaded", function () {

//    initMonthYearPicker("monthYear");

//});

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
                 <td ${value.BillDate} <br> ${value.BillMonth}</td>
                 
                 <td class="text-center">
                    
                       <i class="bi bi-pencil-square bill-Verification edit-icon"></i>
                    
                </td>
                 <td class="text-center">
                    <span data-id="${value.Id}" >
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

//Agency bill Verification
// MsgBox on Click event on Agency Bill Verification 
$(document).on('click', '.bill-Verification', async function () {

    var recordId = $(this).data("id");
    // alert(recordId);
    console.log("Agency Bill Id:", recordId);

    if (!recordId) {
        toastr.error("Record Id not found");
        return;
    }

    var isConfirmed = await DeleteEditBox('Edit File', 'Do you want to Edit Records', 'question');

    if (isConfirmed) {
        await loadAgencyBillVerification(recordId);
        openModal('myModal_AgencyInvoice');
        // Alternative if openModal not working
        //$('#myModal_UploadFile').modal('show');

    } else {

        console.log('Upload cancelled');

    }

});
// get Record to fill upload Annexure & Bill File
async function loadAgencyBillVerification(recordId) {
    alert('Load Agency BIll Verification')
    //var filterData = {
    //    Id: recordId,
    //    AgencyId: 0,
    //    DeptId: 0,
    //    MonthYear: 0,
    //    CreatedBy: 0,
    //    UserRole: 39,
    //};

    //try {

    //    let records = await getRecords('Manpower', 'GetUploadAnnexureBillRecord', filterData, '', 'N');

    //    if (records && records.length > 0) {

    //        let data = records[0];
    //        Id = data.Id;
    //        $("#textMonthYearFill").val(data.MonthYear);
    //        $("#txtDeptFill").val(data.departmentName);
    //        $("#txtAgencyFill").val(data.AgencyName);
    //        $("#textWorkOrderFill").val(data.WorkOrderId);
    //        $("#txtNoResourcesFill").val(data.DeployedResource);
    //        $("#txtPrsentResouceFill").val(data.UpladNoOfResource);
    //        $("#textBillingAddFill").val(data.BillingAddress);

    //        alert('test');


    //        //$('#myModal').modal('show');
    //    }
    //}
    //catch (error) {
    //    console.error("Error loading record:", error);
    //}
}
