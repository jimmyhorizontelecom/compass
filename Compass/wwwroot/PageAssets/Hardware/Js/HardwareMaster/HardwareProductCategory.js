var isValid = true, Id=0;
//common
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-center-center",
    timeOut: "3000"
};


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
        PMainCategory_ddl();
        ProductCatglist();
    });
function ProductCatglist() {
    $.ajax({
        url: '/HardwareMaster/GetProductCatg',
        type: 'GET',
        data: {
            Id: Id,
            MainCatgId:0,
           
        },
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
                        data-name="${value.MainCatgName}" 
                        data-code="${value.Title}">
                        <td>${SrNo}</td>
                        <td>${value.MainCatgName}</td>
                        <td>${value.Title}</td>
                        <td class="text-center align-middle">
                            <div class="form-check form-switch d-flex justify-content-center">
                                <input class="form-check-input isActiveToggle" type="checkbox" data-id="${value.Id}" ${value.IsActive === 'Y' ? 'checked' : ''}>
                            </div>
                        </td>
                        <td class="text-center">
                           <span onclick="FillFrom(${value.Id})"> <i class="bi bi-pencil-square edit-icon"></i></span>
                           
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
function FillFrom(id)
{
    MsgBox('Invormation', 'Success ful', '', '');
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

$(".btnModalSubmit").on("click", function () {
    SubmitRecord();
});

function SubmitRecord() {
    
    let isValid = true;
    let Attachment = $("#fileAttached").get(0);
    let files = Attachment.files;

    let ddlMcategory = $("#ddlMcategory").val();
    let txtProductname = $("#txtProductname").val().trim();
    let IsActive = $('#chkIsActive').is(':checked') ? 'Y' : 'N';
    $(".error").text("");
    $(".is-invalid").removeClass("is-invalid");

    if (ddlMcategory === "") {
        $("#ddlMcategory").addClass("is-invalid");
        $("#ddlMcategory").siblings(".error").text("Select");
        isValid = false;
    }

    if (txtProductname === "") {
        $("#txtProductname").addClass("is-invalid");
        $("#txtProductname").siblings(".error").text("Product Name is required.");
        isValid = false;
    }

    if (!isValid) return; // stop if validation fails

    // === Submit via AJAX ===
    $("#ModalProgress").show();
    var formData = new FormData();
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
        formData.append("Attachment", file, newFileName);

    });
    formData.append("Title", $("#txtProductname").val());
    formData.append("MainCatgId", $("#ddlMcategory").val());
    formData.append("IsActive", IsActive);
    formData.append("Id", Id);
    $.ajax({
        type: "POST",
        url: "/HardwareMaster/AddOrEditProductSubCatg",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            //$("#ModalProgress").hide();
            if (res.success) {
                if (res.message.toLowerCase().includes("error:")) {
                    toastr.error(res.message); // Show error
                }
                else {
                    toastr.success(res.message); // Show success
                    $("#myModal").modal("hide");
                    resetModal();
                    ProductCatglist();
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

function PMainCategory_ddl() {
    $.ajax({
        url: '/HardwareCommon/PMainCategory_ddl',
        type: 'POST',
        data: {
            Id: 0,
            MainCatgId: 0
        },
        dataType: 'json',
        success: function (data) {

            console.log(data);

            if (!data || data.length === 0) {
                toastr.warning("No data found");
                return;
            }

            // If dropdown
            $('#ddlMcategory').empty();
            $.each(data, function (i, item) {
                $('#ddlMcategory').append(
                    `<option value="${item.Id}">${item.MainCatgName}</option>`
                );
            });
        },
        error: function () {
            toastr.error("Failed to load Main Category. Please try again.");
        }
    });
}


