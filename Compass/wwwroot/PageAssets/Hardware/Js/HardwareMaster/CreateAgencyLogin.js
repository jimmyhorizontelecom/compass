var TrCatgId = 0;

$(document).ready(function () {
    bindDataToDdl("HardwareDropdown", "HAgency_ddl", "", "ddlPOAgency", "Agency", 0, 0);
    //bindDataToDdl("HardwareDropdown", "AddTermTypeCondition_ddl", "", "ddlTermTypeCondition", " Terms And Condition Type ", 0, 0);
    resetModal();
    CreateAgencyLoginList();
    $('#myTableCreateAgencyLogin').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });

});

//Get Record for A table 
async function CreateAgencyLoginList() {


    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getCreateAgencyLoginList', filterata, '#myTableCreateAgencyLogin', 'N');
        bindDatatableCreateAgencyLoginList(records, '#myTableCreateAgencyLogin');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table 
function bindDatatableCreateAgencyLoginList(records, tableId) {

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
            <td>${value.agencyname}</td>
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
//Create Agency Login 
$(".btnCreate").click(function () {
    SubmitAgencyLogin();
});
// Submit Agency Login Record
async function SubmitAgencyLogin() {

    $(".error").text("");

    var formData = new FormData();

    var AgencyLogin = {
        AgencyId: $("#ddlPOAgency").val(),
        Email: $("#txtPOAgencyEmail").val(),
        Mobile: $("#txtPOAgencyPhoneNo").val(),
        FirstName: $("#txtPOFirstName").val(),
        LastName: $("#txtPOLastName").val(),
        Password: $("#txtPOPassword").val()
    };

    formData.append("AgencyLogin", JSON.stringify(AgencyLogin));

    try {
        let res = await acceptUpdateMultiTableFData1(
            "HardwarePurchase",
            "SubmitAgencyLogin",
            formData
        );

        if (res.success) {
            MsgBox("Message", res.message, "");
            //resetModal();
            //$("#myTableCreateAgencyLogin tbody").empty();
        }
    }
    catch (err) {
        console.error(err);
    }
}
//Create Agency Login 
$(".btnCreate").click(function () {
    alert("Create button clicked");
});
$(document).on('change', '#ddlPOAgency', async function () {
    console.log($(this).val());
    GetdataRecordById($(this).val());

});
// get record to fill data in Agency login
async function GetdataRecordById(AgencyId) {
    console.log(AgencyId);

    var filterata = {
        FilterId1: AgencyId,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'GetAgencyLogin', filterata, '#myTableCreateAgencyLogin', 'N');

        if (records && records.length > 0) {

            let data = records[0];

            // Id = data.Id;

            console.log(data.AddressDetails);

            $("#txtPOAgencyAddress").val(data.AddressDetails);
            $("#txtPOAgencyEmail").val(data.Email);
            $("#txtPOAgencyPhoneNo").val(data.Mobile);

            //var option1 = new Option(data.agencyname, data.AgencyId, true, true);
            //$("#ddlPOAgency").append(option1).trigger('change');

            //$("#txtPOAgencyEmail").val(data.Email);
            //$("#txtPOAgencyPhoneNo").val(data.Mobile);            
            //$("#txtPOFirstName").val(data.FirstName);
            //$("#txtPOLastName").val(data.LastName);            
            //$("#txtPOPassword").val(data.Password);


            //$('#myModal').modal('show');
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
    }
}



