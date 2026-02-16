var Id = 0;


$(document).ready(function () {
    resetModal();
    recordlist();
});

//Get Record for A table 
async function recordlist() {

    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('Master', 'GetRecord', filterata, '#myTable', 'N');
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
                data-name="${value.Field1}" 
                data-code="${value.Field2}">
                <td>${SrNo}</td>
                <td>${value.Field1}</td>
                <td>${value.Field2}</td>
                <td class="text-center align-middle">
                    <div class="form-check form-switch d-flex justify-content-center">
                        <input class="form-check-input isActiveToggle" 
                               type="checkbox" 
                               data-id="${value.Id}">
                    </div>
                </td>
                <td class="text-center">
                    <span data-id="${value.Id}" >
                        <i class="bi bi-pencil-square edit-test edit-icon"></i>
                    </span>
                </td>
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

// Submi record when Click on btn
$(".btnModalSubmit").on("click", function () {
    SubmitRecord();
});

async function SubmitRecord() {
    let isValid = true; 
    let field1 = $("#field1").val().trim();
    let field2 = $("#field2").val().trim();

    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (field1 === "") {
        $("#field1").addClass("is-invalid");
        $("#field1").siblings(".error").text("Field1 is required.");
        isValid = false;
    }

    if (field2 === "") {
        $("#field2").addClass("is-invalid");
        $("#field2").siblings(".error").text("Field2 is required.");
        isValid = false;
    }

    if (!isValid) return;

    // Prepare data

    var formData = new FormData();
    formData.append("Id", Id);
    formData.append("Field1", field1);
    formData.append("Field2", field2);

    try {
        //$("#ModalProgress").show();

        let res = await acceptUpdate("Master", "AddOrEditRecord", formData);

        

        if (res.success) {

            recordlist();
            resetModal();
            Id = 0; 
            $('.modelalert').text(res.message);
            closeModal('myModal');
            MsgBox('Message', res.message, '');
        }

    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }

}


//Edit Record From Table
$(document).on('click', '.edit-test', async function () {

    var row = $(this).closest('tr');
    Id = row.data('id');

    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question', Id);
    
    if (isConfirmed) {
        console.log('Edit');
        // User clicked Yes
        await loadRecordById(row);
        openModal('myModal');
       // $('#myModal').modal('show');
    } else {
        // User clicked Cancel
        console.log('Edit cancelled');
    }
});
// get Record to fill
async function loadRecordById(row) {
    
    var filterata = {
        FilterId1: row.data('id'),
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('Master', 'GetRecord', filterata, '#myTable', 'N');

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


