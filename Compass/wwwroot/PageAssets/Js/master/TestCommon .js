var isValid = true, Id=0;
//common
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-center-center",
    timeOut: "3000"
};

function resetModal() {
    // Clear input values
    $(".cleartxt").val("");

    // Clear error spans & remove red borders
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    // Clear global alert
    $(".modelalert").text("");

    // Hide loader
    $("#ModalProgress").hide();
}
//ready
    $(document).ready(function () {
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
function recordlist() {
    $.ajax({
        url: '/Master/GetRecord',
        type: 'GET',
        success: function (data) {
            if ($.fn.DataTable.isDataTable('#myTable')) {
                $('#myTable').DataTable().clear().destroy();
            }

            var tbody = $("#myTable tbody");
            tbody.empty();

            $.each(data, function (i, value) {
                let SrNo = i + 1;
                tbody.append(`
                    <tr 
                        data-id="${value.Id}" 
                        data-name="${value.field1}" 
                        data-code="${value.field2}">
                        <td>${SrNo}</td>
                        <td>${value.field1}</td>
                        <td>${value.field2}</td>
                        <td class="text-center align-middle">
                            <div class="form-check form-switch d-flex justify-content-center">
                                <input class="form-check-input isActiveToggle" type="checkbox" data-id="${value.Id}" ${value.Id === '1' ? 'checked' : ''}>
                            </div>
                        </td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-primary editCountry" data-id="${value.Id}">
                            <i class="fa fa-pencil"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });

            $('#myTable').DataTable({
                paging: true,
                searching: true,
                ordering: true,
                info: true,
                responsive: true
            });
            function fixDataTableSpacing() {
                if (window.innerWidth <= 766) {
                    $('.dataTables_length').addClass('mb-2');
                    $('.dataTables_filter').addClass('mt-2');
                } else {
                    $('.dataTables_length').removeClass('mb-2');
                    $('.dataTables_filter').removeClass('mt-2');
                }
            }
            fixDataTableSpacing();
            $(window).on('resize', fixDataTableSpacing);

        },
        error: function (xhr, status, error) {
            console.error("Error fetching records: " + error);
        }
    });
}
function OpenAddModel() {
    resetModal();
    $('.modal-title').html("Add Record");
    //$("#CountryId").val("0");
    const myModal = new bootstrap.Modal("#myModal");
    myModal.show();
}
$(".btnModalSubmit").on("click", function () {
    SubmitRecord();
});

function SubmitRecord() {
    
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

    $.ajax({
        url: '/Master/AddOrEditRecord',
        type: 'POST',
        data: {
            Id: Id,
            Field1: field1,
            Field2: field2,
        },
        success: function (res) {
            $("#ModalProgress").hide();
            if (res.success) {
                if (res.message.toLowerCase().includes("error:")) {
                    toastr.error(res.message); // Show error
                }
                else {
                    toastr.success(res.message); // Show success
                    $("#myModal").modal("hide");
                    resetModal();
                    recordlist();
                    Id = 0;
                    
                }
            } else {
                toastr.warning(res.message || "Failed to save Data ❌");
            }
        },
        error: function (xhr, status, error) {
            $("#ModalProgress").hide();
            toastr.error("Error: " + error);
        }
    });
}

$(document).on('click', '.editCountry', function () {
   // resetModal();  // <-- Add this here to clear previous validation states

    // Find the parent row
    var row = $(this).closest('tr');

    // Extract data using .data()
    var countryId = row.data('id');
    var countryName = row.data('name');
    var countryCode = row.data('code');

    // Fill modal fields
    //$("#CountryId").val(countryId);
    //$("#CountryName").val(countryName);
    //$("#CountryCode").val(countryCode);

    // Set modal title
    $("#myModalLabel").text("Edit Country");

    // Show modal
    $("#myModal").modal('show');
});
