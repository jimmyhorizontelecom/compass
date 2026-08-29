var TrCatgId = 0;

$(document).ready(function () {
    bindDataToDdl("HardwareDropdown", "HAgency_ddl", "", "ddlSaleAgencyName", "Agency", 0, 0);
    bindDataToDdl("HardwareDropdown", "HDepartment_ddl", "", "ddlSaleDeptName", " Department Name", 0, 0);
    //bindDataToDdl("HardwareDropdown", "AddTermTypeCondition_ddl", "", "ddlTermTypeCondition", " Terms And Condition Type ", 0, 0);
    resetModal();
    SaleOrderDetailList();
    $('#myTableSaleOrderDetail').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });
    $(document).ready(function () {

        $("#ddlPOStatus").select2({
            width: "100%"
        });

    });
    $(document).ready(function () {

        $("#ddlDeptAmtStatus").select2({
            width: "100%"
        });

    });
    $(document).ready(function () {

        $("#ddlSaleInvStatus").select2({
            width: "100%"
        });

    });

});

//Get Record for A table 
async function SaleOrderDetailList() {


    var filterata = {
        FilterId1: $('#ddlSaleDeptName').val(),
        FilterId2: $('#ddlSaleAgencyName').val(),
        FilterId3: 0,
        FilterDate1: $('#txtFromDate').val(),
        FilterDate2: $('#txtToDate').val(),
        FilterName1: $('#ddlPOStatus').val(),
        FilterName2: $('#ddlDeptAmtStatus').val(),
        FilterName3: $('#ddlSaleInvStatus').val(),

    };


    try {

        let records = await getRecords('HardwareOrder', 'getSaleOrderDetailsList', filterata, '#myTableSaleOrderDetail', 'N');
        console.log(records);
        bindDatatableSaleOrderDetailList(records, '#myTableSaleOrderDetail');
        console.log('test');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table 
function bindDatatableSaleOrderDetailList(records, tableId) {


    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();
    console.log('sdfsdf');
    $.each(records, function (i, value) {
        let SrNo = i + 1;
        let InvStatus = '<i class="fa-solid fa-xmark fa-2x text-danger"></i>';
        if (value.sinvStatus == 'N') {
            InvStatus = '<i class="fa-solid fa-xmark fa-2x text-success" ></i>Not Executed';
        }
        else if (value.sinvStatus == 'P') {
            InvStatus = '<i class="fa-solid 9 fa-2x text-warning"></i>Not Executed';
        }
        else {
            InvStatus = '<i class="fa-solid 9 fa-2x  text-danger "></i>Not Executed';
        }

        tbody.append(`
        <tr>
            <td>${SrNo}</td>
            <td>${value.SaleOrderRef}</td>
            <td>${value.departmentName}</td>            
            <td>${value.BillingAddress}</td>
            <td>${value.OrderAmount}</td>
            <td>${value.DeptOrderDate}</td>
            <td>${value.OrderEntryDate}</td>
            <td>${value.DeptAmt}</td>
            <td>${value.item}</td>
            <td>${value.Agency}</td>
            <td>${value.IssueDate}</td>
            <td>${InvStatus}</td>
            <td>${value.sinvitem}</td>
            <td>${value.remarks}</td>
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



