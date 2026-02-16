$(document).ready(function () {
    Countrylist();

    // Clear error message when typing
    $("#CountryName, #CountryCode").on("input", function () {
        $(this).removeClass("is-invalid");          // remove red border
        $(this).siblings(".error").text("");        // clear error text
        $(".modelalert").text("");                  // clear global error
    });
});

function Countrylist() {
    $.ajax({
        url: '/Master/GetCountries',
        type: 'GET',
        success: function (data) {
            if ($.fn.DataTable.isDataTable('#tblCountries')) {
                $('#tblCountries').DataTable().clear().destroy();
            }

            var tbody = $("#tblCountries tbody");
            tbody.empty();

            $.each(data, function (i, country) {
                let SrNo = i + 1;
                tbody.append(`
                    <tr 
                        data-id="${country.CountryId}" 
                        data-name="${country.CountryName}" 
                        data-code="${country.CountryCode}">
                        <td>${SrNo}</td>
                        <td>${country.CountryName}</td>
                        <td>${country.CountryCode}</td>
                        <td class="text-center align-middle">
                            <div class="form-check form-switch d-flex justify-content-center">
                                <input class="form-check-input isActiveToggle" type="checkbox" data-id="${country.CountryId}" ${country.IsActive === 'Y' ? 'checked' : ''}>
                            </div>
                        </td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-primary editCountry" data-id="${country.CountryId}">
                            <i class="fa fa-pencil"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });

            $('#tblCountries').DataTable({
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
            console.error("Error fetching countries: " + error);
        }
    });
}

function OpenAddModel() {
    resetModal();
    $('.modal-title').html("Add Country");
    $("#CountryId").val("0");
    const myModal = new bootstrap.Modal(document.getElementById('myModal'));
    myModal.show();
}
$(".btnModalSubmit").on("click", function () {
    AddCountry();
});

  function AddCountry() {
        let isValid = true;

        let countryId = $("#CountryId").val();  
        let countryName = $("#CountryName").val().trim();
        let countryCode = $("#CountryCode").val().trim();

        if (countryName === "") {
            $("#CountryName").addClass("is-invalid");
            $("#CountryName").siblings(".error").text("Country Name is required.");
            isValid = false;
        }

        if (countryCode === "") {
            $("#CountryCode").addClass("is-invalid");
            $("#CountryCode").siblings(".error").text("Country Code is required.");
            isValid = false;
        }

        if (!isValid) return; // stop if validation fails

        // === Submit via AJAX ===
        $("#ModalProgress").show();

        $.ajax({
            url: '/Master/AddOrEditCountry',
            type: 'POST',
            data: {
                CountryId: countryId,
                CountryName: countryName,
                CountryCode: countryCode
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
                        Countrylist();
                    }
                } else {
                    toastr.warning(res.message || "Failed to save country ❌");
                }
            },
            error: function (xhr, status, error) {
                $("#ModalProgress").hide();
                toastr.error("Error: " + error);
            }
        });
    }

$(document).on('click', '.editCountry', function () {
    resetModal();  // <-- Add this here to clear previous validation states

    // Find the parent row
    var row = $(this).closest('tr');

    // Extract data using .data()
    var countryId = row.data('id');
    var countryName = row.data('name');
    var countryCode = row.data('code');

    // Fill modal fields
    $("#CountryId").val(countryId);
    $("#CountryName").val(countryName);
    $("#CountryCode").val(countryCode);

    // Set modal title
    $("#myModalLabel").text("Edit Country");

    // Show modal
    $("#myModal").modal('show');
});


$(document).on('change', '.isActiveToggle', function () {
    var stateId = $(this).data('id');
    var isActive = $(this).is(':checked'); // true/false

    $.ajax({
        url: '/Master/UpdateCountryStatus', // backend action to update IsActive
        type: 'POST',
        data: {
            countryId: $(this).data('id'),
            isActive: $(this).is(':checked') ? "Y" : "N",
            modifiedBy: 64 // Replace 64 with dynamic user ID if needed
        },

        success: function (res) {
            if (res.success) {
                toastr.success(res.message);
            } else {
                toastr.warning(res.message);
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Error updating status: " + error);
        }
    });
});

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