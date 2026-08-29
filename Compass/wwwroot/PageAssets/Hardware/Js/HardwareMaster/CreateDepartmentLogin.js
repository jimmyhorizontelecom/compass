
$(document).ready(function () {
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "", "ddlDeptName", " Department Name", 0, 0);
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "", "ddlLoginDeptName", " Department Name", 0, 0);
    bindDependentDataToDdl("HardwareDropdown", "BillingAddress_ddl", "",// ❗ no modal
        "ddlDeptName", "ddlDeptBillingAddr", "Select Billing Address",);
    //resetModal();

    CreateDepartmentLoginList();
    $('#myTableCreateDepartmentLogin').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });

});
$(document).on('change', '#ddlLoginDeptName', async function () {
    console.log($(this).val());
    CreateDepartmentLoginList($(this).val());

});



//Get Record for A table 
async function CreateDepartmentLoginList() {

    //var departmentId = $("#ddlLoginDeptName").val();



    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getCreateDepartmentLoginList', filterata, '#myTableCreateDepartmentLogin', 'N');
        bindDatatableDepartmentLoginList(records, '#myTableCreateDepartmentLogin');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table 
function bindDatatableDepartmentLoginList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`
        <tr>
            <td>${SrNo}</td>
            <td>${value.ID}</td>
            <td>${value.departmentName}</td>            
            <td>${value.BillingAddress}</td>
            <td>${value.Email}</td>
            <td>${value.Password}</td>
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

    //hideModalLoader();
}

//Create Department Login 
$(".createButton").click(function () {
    SubmitDepartmentLogin();
});
// Submit Agency Login Record
async function SubmitDepartmentLogin() {

    $(".error").text("");

    var formData = new FormData();

    var DepartmentLogin = {
        BillingId: $("#ddlDeptBillingAddr").val(),
        Email: $("#txtDeptUserName").val(),
        Mobile: '',
        FirstName: $("#txtDeptFirstName").val(),
        LastName: $("#txtDeptLastName").val(),
        Password: $("#txtDeptPassword").val()
    };

    formData.append("DepartmentLogin", JSON.stringify(DepartmentLogin));

    try {
        let res = await acceptUpdateMultiTableFData1(
            "HardwarePurchase",
            "SubmitDepartmentLogin",
            formData
        );

        if (res.success) {
            MsgBox("Message", res.message, "");
            //resetModal();
            $("#myTableCreateAgencyLogin tbody").empty();
        }
    }
    catch (err) {
        console.error(err);
    }
}
$(document).on('change', '#ddlDeptBillingAddr', async function () {
    console.log($(this).val());
    GetdataRecordById($(this).val());

});

// get record to fill data in Agency login
async function GetdataRecordById(BillingAddressId) {

    var filterata = {
        FilterId1: BillingAddressId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'GetDepartmentLogin', filterata, '#myTableCreateDepartmentLogin', 'N');

        if (records && records.length > 0) {

            let data = records[0];

            // Id = data.Id;



            $("#ddlPOAgency").val(data.AgencyId);
            var option1 = new Option(data.agencyname, data.AgencyId, true, true);
            $("#ddlPOAgency").append(option1).trigger('change');

            $("#txtPOAgencyEmail").val(data.Email);
            $("#txtPOAgencyPhoneNo").val(data.Mobile);
            $("#txtPOFirstName").val(data.FirstName);
            $("#txtPOLastName").val(data.LastName);
            $("#txtPOPassword").val(data.Password);


            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}



