var TrCatgId = 0;

$(document).ready(function () {
    bindDataToDdl("HardwareDropdown", "TermCondition_ddl", "", "ddlTermCondition", " Select Terms And Condition ", 0, 0);
    bindDataToDdl("HardwareDropdown", "AddTermTypeCondition_ddl", "", "ddlTermTypeCondition", " Terms And Condition Type ", 0, 0);
    resetModal();
    AddTermTypeConditionList();
    $('#myTablePITermCondition').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });

});

//Get Record for A table 
async function AddTermTypeConditionList() {

    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('PI', 'GetRecordTermTypeCondition', filterata, '#myTablePITermCondition', 'N');
        bindDatatableTermTypeConditionList(records, '#myTableAddTermTypeCondition');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table 
function bindDatatableTermTypeConditionList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`
            <tr 
                 data-trid="${value.TrId}"  data-trcatgid="${value.TrCatgId}" 
                         >
                        <td>${SrNo}</td>
                         <td>${value.TermsAndConditionName}</td>
                        <td>${value.TermsAndConditionType}</td>
                       
               
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

// Open modal Add Term Type Condition
$(document).on('click', '.btnAddTermType', function () {

    var row = $(this).closest('tr');
    var trcatgid = row.data('');

    
    AddTermTypeConditionList();

    var myModal = new bootstrap.Modal(document.getElementById('myModalAddTermTypeCondition'));
    myModal.show();
});
// Submit record when Click on btn
$(".btnModalTypeSubmit").on("click", function () {
    
    SubmitAddTermTypeCondition();
});
// get Create function when click on Submit 
async function SubmitAddTermTypeCondition() {
   
    let isValid = true;


    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

   
    //let TermsConditionName = $("#ddlTermCondition").val();
   

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    //if (TermsConditionName === "") {
    //    $("#ddlTermCondition").addClass("is-invalid");
    //    $("#ddlTermCondition").siblings(".error").text("Please Select the ddl from Terms And Condition.");
    //    isValid = false;
    //}
    
    var TermCondition = {
        TrCatgId: TrCatgId,
        CategoryName: $('#txtTypeName').val(),
        TypeId: $('#ddlTermTypeCondition').val(),
       
    };
    var formData = new FormData();
    formData.append("TermCondition", JSON.stringify(TermCondition));


    try {

        let res = await acceptUpdateMultiTableFData1(
            'PI',
            'SubmitTermsTypeConditionRecord',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            AddTermTypeConditionList();
            resetModal();
            $('.modelalert').text(res.message);
            closeModal('myModalAddTermTypeCondition');
           
        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }


}
