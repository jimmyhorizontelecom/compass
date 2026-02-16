var isValid = true, Id=0;
//common
function showModalLoader() {
    $("#modalLoader").css("display", "flex");
}

function hideModalLoader() {
    $("#modalLoader").hide();
}

function getRecords(controllerName, methodName, formdata, tableId, ispagination) {

    return $.ajax({
        url: `/${controllerName}/${methodName}`,
        type: 'GET',
        data: formdata,
        beforeSend: function () {
            showModalLoader();
        },
        complete: function () {
            if (typeof hideModalLoader === "function")
                hideModalLoader();
        }
    });
}
function acceptUpdate(controllerName, methodName, formdata) {
    return $.ajax({
        url: `/${controllerName}/${methodName}`,
        type: 'POST',
        data: formdata,
        processData: false,   // 🔥 required for FormData
        contentType: false    // 🔥 required for FormData
    });
}
function acceptUpdateMultiJData(controllerName, methodName, Jsondata) {
    return $.ajax({
        url: `/${controllerName}/${methodName}`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(Jsondata)
    });
}
function acceptUpdateMultiTableFData(controllerName, methodName, fromData) {
    return $.ajax({
        url: `/${controllerName}/${methodName}`,
        type: 'POST',
        data: fromData,
        processData: false,   // 🔥 required for FormData
        contentType: false    // 🔥 required for FormData
    });
}
$('.search_ddl').select2({
    dropdownParent: $('.modal'),
    placeholder: "Select an option",
    allowClear: false,
    width: '100%' // make it fit the container
});
//read claim value
var roleId = '@User.FindFirst("RoleId")?.Value';
var userId = '@User.FindFirst("UserId")?.Value';

// common
// submit multiple recrod in form of json without file
async function submitRecordMultipleJData() {
    let model = {
        Id: Id, // global or form value
        Field1: 'Mukesh',
        Field2: 'sita',
        Meta: {
            CreatedBy: "User123",
            Notes: "Some optional notes"
        }
    };
    var formData = new FormData();
    formData.append("model", model);
   
    try {
        let res = await acceptUpdateMultiJData('Master', 'AddOrEditRecord1', model);
        //let res = acceptUpdateMultiTable('Master', 'AddOrEditRecord1', formData);
        if (res.success) {
            $('.modelalert').text(res.message);
            console.error(err);
            //recordlist(); // refresh table
            $('.modelalert').text("Server error");
           
        } else {
            $('.modelalert').text(res.message || "Failed to save");
        }
    } catch (err) {
        console.error(err);
        $('.modelalert').text("Server error");
    }
    
}
// submit Single  recrod in form  with fromdata with file
async function submitRecordMultipleFData() {

    let model = {
        Id: Id,
        Field1: 'Mukesh',
        Field2: 'sita',
        CreatedBy: "User123",
        Notes: "Some optional notes"
        
    };

    var formData = new FormData();

    // ✅ append JSON as modal
    formData.append("Id", model.Id);
    formData.append("Field1", model.Field1);
    formData.append("Field2", model.Field2);
    // Nested object
    formData.append("CreatedBy", model.CreatedBy);
    formData.append("Notes", model.Notes);

    // ✅ append file
    let Attachment = $("#Attachement").get(0);
    let files = Attachment.files;

    let allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
    //extension validation
    $.each(files, function (key, file) {

        let extension = file.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            toastr.error("Only JPG, PNG, JPEG or PDF files are allowed");
            return false; // stop loop
        }

    });
    $.each(files, function (key, value) {
        let extension = file.name.split('.').pop();
        let newFileName = "Product_" + Date.now() + "." + extension;

        // Append with custom filename
        formData.append("file", file, newFileName);

    });

    try {
        let res = await acceptUpdateMultiTableFData('Master', 'AddOrEditRecordWithFile', formData);
        if (res.success) {
            $('.modelalert').text(res.message);
        } else {
            $('.modelalert').text(res.message || "Failed to save");
        }

    } catch (err) {
        console.error(err);
        $('.modelalert').text("Server error");
    }
}
// submit Single  recrod in form  with fromdata without file
async function submitRecordMultipleFData1() {
    let model = {
        Id: Id, // global or form value
        Field1: 'Mukesh',
        Field2: 'sita',
        Meta: {
            CreatedBy: "User123",
            Notes: "Some optional notes"
        }
    };
    var formData = new FormData();
    formData.append("model", model);

    try {
        let res = await acceptUpdateMultiJData('Master', 'AddOrEditRecord1', model);
        //let res = acceptUpdateMultiTable('Master', 'AddOrEditRecord1', formData);
        if (res.success) {
            $('.modelalert').text(res.message);
            console.error(err);
            //recordlist(); // refresh table
            $('.modelalert').text("Server error");

        } else {
            $('.modelalert').text(res.message || "Failed to save");
        }
    } catch (err) {
        console.error(err);
        $('.modelalert').text("Server error");
    }

}
// submit Multiple  recrod in two/More table form  with fromdata without file
async function saveDataInMultiTable() {

    try {

        let order = {
            CustomerName: "Mukesh",
            OrderDate: new Date(),
            Items: [
                { ProductName: "Pen", Quantity: 2, Price: 10 },
                { ProductName: "Book", Quantity: 1, Price: 50 }
            ]
        };

        let res = await acceptUpdateMultiJData('Master', 'SaveOrder', order);

        if (res.success) {
            $('.modelalert').text(res.message);
        } else {
            $('.modelalert').text(res.message || "Failed to save");
        }

    } catch (err) {
        console.error(err);
        $('.modelalert').text("Server error");
    }
}
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-center-center",
    timeOut: "3000"
};

//ready
$(document).ready(function () {
//    saveDataInMultiTable();
    //Submit Multiple record with Json without file
   // submitRecordMultipleJData()
    //Submit Multiple record with from data with file
   // submitRecordMultipleFData();

        $('#myTable').DataTable({
            pageLength: 10,
            lengthChange: false
        });
        // Clear error message when typing
        $("#myModal").on("input", function () {
           // $(this).removeClass("is-invalid");          // remove red border
            //$(this).siblings(".error").text("");        // clear error text
            $(".modelalert").text("");                  // clear global error
        });
        //Get data in main table
        recordlist();
});
    //Get Record for A table 
async function recordlist() {

    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1:'',
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
                    <span onclick="FillFrom(${value.Id})">
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

    hideModalLoader();
}
function OpenAddModel() {
    resetModal();
    $('.modal-title').html("Add Record");
    //$("#CountryId").val("0");
    const myModal = new bootstrap.Modal("#myModal");
    myModal.show();
}
function FillFrom(id)
{
    //MsgBox('Invormation', 'Success ful', '', '');
//    var result = DeleteEditBox('Edit Field', 'Do you want to edit Reocrd?', 'question', id);
    
//    if (result) {
//        // open modal / load data
//        $('#myModal').modal('show');
//        // loadRecordById(id); // your function
//    }
}
function FillFrom2(id) {
    Swal.fire({
        title: 'Edit Mode',
        html: `<b>Record ID:</b> ${id}`,
        icon: 'info',
        confirmButtonText: 'Edit Now',
        confirmButtonColor: '#FF6F61',
        backdrop: true,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        }
    });
}
function FillFrom1(id) {
    Swal.fire({
        title: 'Edit Record',
        text: 'Do you want to edit this record?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#FF6F61',   // coral
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, Edit',
        cancelButtonText: 'Cancel',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // open modal / load data
            $('#myModal').modal('show');
            // loadRecordById(id); // your function
        }
    });
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

        $('.modelalert').text(res.message || res);

        if (res.success) {
            recordlist();
            Id = 0;
        }

    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }
    
}

function SubmitRecord1() {
    
    let isValid = true;
    let field1 = $("#field1").val().trim();
    let field2 = $("#field2").val().trim();
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (field1 === "") {
        $("#field1").addClass("is-invalid");
        $("#field1").siblings(".error").text("field1 is required.");
        isValid = false;
    }

    if (field2 === "") {
        $("#field2").addClass("is-invalid");
        $("#field2").siblings(".error").text("field2 is required.");
        isValid = false;
    }

    if (!isValid) return; // stop if validation fails

    // === Submit via AJAX ===
    $("#ModalProgress").show();
     async function saveData() {
        try {
            let res = await acceptUpdate("Master", "AddOrEditRecord", formData);
            recordlist();
            Id = 0;
            $('.modelalert').text(res.res)

            //console.log(res);
        } catch (err) {
            // console.log(err);
            $('.modelalert').text(res.err)

        }
    }
    
    
    //$.ajax({
    //    url: '/Master/AddOrEditRecord',
    //    type: 'POST',
    //    data: {
    //        Id: Id,
    //        Field1: field1,
    //        Field2: field2,
    //    },
    //    beforeSend: function () {
    //        showModalLoader();
    //    },
    //    success: function (res) {
    //        hideModalLoader();
    //        if (res.success) {
    //            if (res.message.toLowerCase().includes("error:")) {
    //                //toastr.error(res.message); // Show error
    //                $('.modelalert').text(res.message)
    //            }
    //            else {
    //               // toastr.success(res.message); // Show success
    //                //  $("#myModal").modal("hide");
    //                $('.modelalert').text(res.message)
    //                //resetModal();
    //                recordlist();
    //                Id = 0;
                    
    //            }
    //        } else {
    //            //toastr.warning(res.message || "Failed to save Data ❌");
    //            $('.modelalert').text(res.message || "Failed to save Data ❌")

    //        }
    //    },
    //    error: function (xhr, status, error) {
    //        hideModalLoader();
    //        toastr.error("Error: " + error);
    //    }
    //});
}
//Edit Record From Table
$(document).on('click', '.edit-test', function () {
  var result = DeleteEditBox('Edit Field', 'Do you want to edit Reocrd?', 'question', id);

    if (result) {
        resetModal();  // <-- Add this here to clear previous validation states

            // open modal / load data
            $('#myModal').modal('show');
             loadRecordById(id); // your function
        }
   
    // Find the parent row
    var row = $(this).closest('tr');

    // Extract data using .data()
    var Id = row.data('id');
    //var Name = row.data('name');
    //var Code = row.data('code');

    // Fill modal fields
    //$("#CountryId").val(countryId);
    //$("#CountryName").val(countryName);
    //$("#CountryCode").val(countryCode);

    // Set modal title
    $("#myModalLabel").text("Edit Country");

    // Show modal
    $("#myModal").modal('show');
});

// get Record to fill
async function loadRecordById(Row) {

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

    