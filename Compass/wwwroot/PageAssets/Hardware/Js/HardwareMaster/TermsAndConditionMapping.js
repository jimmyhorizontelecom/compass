var TrCatgId = 0;
var ProductId = 0;

$(document).ready(function () {
    bindDataToDdl("HardwareDropdown", "TermCondition_ddl", "", "ddlTermCondition", " Select Terms And Condition ", 0, 0);
    bindDataToDdl("HardwareDropdown", "AddTermTypeCondition_ddl", "", "ddlTermTypeCondition", " Terms And Condition Type ", 0, 0);
    bindDataToDdl("HardwareDropdown", "HProduct_ddl", "myModalMappingTermsCondition", "ddlPrdCategoryMap", " Product Category", 0, 0);
    resetModal();
    TermsMappingConditionList();
    $('#myTableMappingTermsCondition').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });

});

//Get Record for A table 
async function TermsMappingConditionList() {

    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('PI', 'GetRecordTermsMappingCondition', filterata, '#myTableMappingTermsCondition', 'N');
        bindDatatableTermMappingConditionList(records, '#myTableMappingTermsCondition');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table 
function bindDatatableTermMappingConditionList(records, tableId) {

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
                 data-productid="${value.ProductId}"
                         >
                        <td>${SrNo}</td>
                         <td>${value.ProductCategoryName}</td>
                        <td><button type="button" class="btn btn-danger btnMapviewdetail">View Details</td>
                       
               
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

// Open modal Add Term Map Condition
$(document).on('click', '.btnMapTermsCondition', function () {

    var row = $(this).closest('tr');
    var ProductId = row.data('');


    TermsConditionMappList();

    var myModal = new bootstrap.Modal(document.getElementById('myModalMappingTermsCondition'));
    myModal.show();
});
$('#myTableTermsAndMapping').DataTable({
    "paging": true,
    "searching": true,
    "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
    "language": {
        "search": "Search"
    }
});
//Get Record for A table 
async function TermsConditionMappList() {

    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('PI', 'getRecordMappCondition', filterata, '#myModalMappingTermsCondition', 'N');
        bindDatatableMapTermsConditionList(records, '#myTableTermsAndMapping');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table 
function bindDatatableMapTermsConditionList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`
            <tr 
                 data-termconditionid="${value.TrId}"   
                         >
                        <td>${SrNo}</td>
                        <td><input type="checkbox" class="rowCheckbox"></td>
                         <td>${value.CategoryName}</td>
                        <td>${value.ConditionName}</td>
                        
               
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
// get Selected Data into The Table 
$(document).on('change', '#selectAllMapTerm', function () {
    $('.rowCheckbox').prop('checked', $(this).prop('checked'));
});
$(document).on('change', '.rowCheckbox', function () {
    if (!$(this).prop('checked')) {
        $('#selectAllMapTerm').prop('checked', false);
    } else {
        // Check if all checkboxes are checked
        if ($('.rowCheckbox:checked').length === $('.rowCheckbox').length) {
            $('#selectAllMapTerm').prop('checked', true);
        }
    }
});

// Submit record when Click on btn
$(".btnMappingSubmit").on("click", function () {

    SubmitMappingTermsCondition();
});
// get Selected Data
function getSelectedDataMapping() {

    var selectedTermAndCondition = [];

    $('.rowCheckbox:checked').each(function () {

        var row = $(this).closest('tr');
        var TermconditionId = row.data('termconditionid');



        var item = {
            TermconditionId: TermconditionId,
            ProductId: $('#ddlPrdCategoryMap').val(),


        };

        selectedTermAndCondition.push(item);
    });

    return selectedTermAndCondition;
}
// get Create function when click on Submit 
async function SubmitMappingTermsCondition() {

    let isValid = true;


    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");


    let ProductCategory = $("#ddlPrdCategoryMap").val();


    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (ProductCategory === "") {
        $("#ddlPrdCategoryMap").addClass("is-invalid");
        $("#ddlPrdCategoryMap").siblings(".error").text("Please Select ddl Product Category.");
        isValid = false;
    }

    var TermConditionMap = {
        Id: 0,
        Items: getSelectedDataMapping(),


    };
    console.log(JSON.stringify(getSelectedDataMapping()));
    console.log(JSON.stringify(TermConditionMap));
    var formData = new FormData();
    formData.append("TermConditionMap", JSON.stringify(TermConditionMap));


    try {

        let res = await acceptUpdateMultiTableFData1(
            'PI',
            'SubmitMappingTermsConditionRecord',
            formData
        );

        if (res.success) {
            MsgBox('Message', res.message, '');
            TermsConditionMappList();
            TermsMappingConditionList();
            resetModal();
            $('.modelalert').text(res.message);
            closeModal('myModalMappingTermsCondition');

        }

    }
    catch (err) {
        MsgBox('Message', err, 'Error');
    }


}
// Open modal Add View Details
$(document).on('click', '.btnMapviewdetail', function () {

    var row = $(this).closest('tr');
    var ProductId = row.data('');


    TermsConditionMappList();

    var myModal = new bootstrap.Modal(document.getElementById('myModalViewDetails'));
    myModal.show();
});
