
function showModalLoader() {
    $(".modalLoader").css("display", "flex");
}

function hideModalLoader() {
    $(".modalLoader").hide();
}
// close modal
function closeModal(id) {
    const el = document.getElementById(id);
    if (el) bootstrap.Modal.getOrCreateInstance(el).hide();
}
// open modal
function openModal(id) {
    const el = document.getElementById(id);
    if (el) bootstrap.Modal.getOrCreateInstance(el).show();
}
// it return Isconfirm Boolean value
function DeleteEditBox(title, msg, icon, id) {
    return Swal.fire({
        title: title,
        text: msg,
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
        //if (result.isConfirmed) {
        //    // open modal / load data
        //    // $('#myModal').modal('show');
        //    // loadRecordById(id); // your function
        //    return true;
        //}
        //else {
        //    return false;
        //}
        return result.isConfirmed;
       
    });
}
// Show Message in Message Box
function MsgBox(title,msg,icon,id) {
    Swal.fire({
        title: title,
        html: `<b>${msg}:</b> `,
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#FF6F61',
        backdrop: true,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        }
    });
}
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
    hideModalLoader();
}

// reset filter pannel
function resetFilterPanel() {

    // 🔹 Reset all dropdowns (including Select2)
    $(".filter-panel select").each(function () {
        $(this).val("0").trigger("change");   // reset value
    });

    // 🔹 Clear textboxes (using existing class)
    $(".cleartxt").val("");

    // 🔹 Clear file inputs
    $(".filter-panel input[type='file']").val("");

    // 🔹 Clear error messages & remove validation class
    $(".filter-panel .error").text("");
    $(".filter-panel .is-invalid").removeClass("is-invalid");

    // 🔹 Optional: Clear any alert message
    $(".modelalert").text("");

    // 🔹 Optional: Focus first dropdown
    $("#ddlMonthYear").focus();
}


//enabled  input
function enabledInput()
{
    document.querySelectorAll('.disable-me').forEach(function (el) {
        el.disabled = false;
    });
}
//disabled input
function enabledInput() {
    document.querySelectorAll('.disable-me').forEach(function (el) {
        el.disabled = true;
    });
}
//Bind data to ddl
function modalSelect2(ModalId, message) {
    var ModalById = document.getElementById(ModalId);
    alert(ModalId);
    $(ModalById).on('shown.bs.modal', function () {
        $('.search_ddl').select2({
            dropdownParent: $(ModalById),
            placeholder: message,
            allowClear: true,
            width: '100%'
        });
    });
}
//function bindDataToDdl(controllerName, methodName, modalId,dropDownId, message) {//mainCategoryDropdown
//    var ModalById = document.getElementById(modalId);
//    var dropDownById = document.getElementById(dropDownId);
//    alert('enter1');
//    $(ModalById).on('shown.bs.modal', function () {
//        alert('enter2');
//        //if (!$('#ddlMcategory').hasClass("select2-hidden-accessible")) {

//        $(dropDownById).select2({
//                dropdownParent: $(ModalById),
//                placeholder: message,
//                allowClear: true,
//                ajax: {
//                    url: `/${controllerName}/${methodName}`,
//                    dataType: 'json',
//                    delay: 250,
//                    data: function (params) {
//                        return {
//                            id: 0,
//                            mainCatgId: 0,
//                            searchTerm: params.term
//                        };
//                    },
//                    processResults: function (data) {
//                        return {
//                            results: $.map(data, function (item) {
//                                return {
//                                    id: item.Id,
//                                    text: item.Text
//                                };
//                            })
//                        };
//                    }
//                }
//            });
//            //$('#ddlMcategory').select2({
//            //    dropdownParent: $('#myModal'),
//            //    placeholder: "Select Main Category",
//            //    allowClear: true,
//            //    width: '100%'
//            //});

//        //}

//    });
   
//}

//// without model ddl calling
//function withoutModelBindDataToDdl(controller, action, modalId, ddlId, placeholder) {

//    let selector = "";

//    if (modalId && modalId !== "") {
//        selector = '#' + modalId + ' #' + ddlId;
//    } else {
//        selector = '#' + ddlId;
//    }

//    $(selector).select2({
//        placeholder: "Select " + placeholder,
//        allowClear: true,
//        ajax: {
//            url: '/' + controller + '/' + action,
//            dataType: 'json',
//            delay: 250,
//            data: function (params) {
//                return {
//                    id: 0,
//                    mainCatgId: 0,
//                    searchTerm: params.term
//                };
//            },
//            processResults: function (data) {
//                return {
//                    results: $.map(data, function (item) {
//                        return {
//                            id: item.Id,
//                            text: item.Text
//                        };
//                    })
//                };
//            }
//        }
//    });
//}

//both parent drop down with or without model
function bindDataToDdl(controllerName, methodName, modalId, dropDownId, message) {

    var dropDownById = document.getElementById(dropDownId);

    // ✅ Agar modalId null ya empty hai
    if (!modalId) {

        $(dropDownById).select2({
            placeholder: message,
            allowClear: true,
            width: '100%',
            ajax: {
                url: `/${controllerName}/${methodName}`,
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        id: 0,
                        mainCatgId: 0,
                        searchTerm: params.term
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {
                            return {
                                id: item.Id,
                                text: item.Text
                            };
                        })
                    };
                }
            }
        });

    }
    else {
        // ✅ Agar modal exist karta hai
        var ModalById = document.getElementById(modalId);

        $(ModalById).on('shown.bs.modal', function () {

            $(dropDownById).select2({
                dropdownParent: $(ModalById),
                placeholder: message,
                allowClear: true,
                width: '100%',
                ajax: {
                    url: `/${controllerName}/${methodName}`,
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            id: 0,
                            mainCatgId: 0,
                            searchTerm: params.term
                        };
                    },
                    processResults: function (data) {
                        return {
                            results: $.map(data, function (item) {
                                return {
                                    id: item.Id,
                                    text: item.Text
                                };
                            })
                        };
                    }
                }
            });

        });
    }
}

// both child drop down with or without model
function bindDependentDataToDdl(controller, action, modalId,
    parentId, childId, placeholder) {

    var parent = $('#' + parentId);
    var child = $('#' + childId);

    // Page load par child disable
    child.prop('disabled', true);

    parent.on('change', function () {

        var parentValue = $(this).val();

        // Clear previous value
        child.val(null).trigger('change');

        if (!parentValue || parentValue == "0") {
            child.prop('disabled', true);
            return;
        }

        child.prop('disabled', false);

        // Destroy previous Select2 if exists
        if (child.hasClass("select2-hidden-accessible")) {
            child.select2('destroy');
        }

        var options = {
            placeholder: placeholder,
            allowClear: true,
            width: '100%',
            ajax: {
                url: '/' + controller + '/' + action,
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        id: 0,
                        mainCatgId: parentValue,
                        searchTerm: params.term
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {
                            return {
                                id: item.Id,
                                text: item.Text
                            };
                        })
                    };
                }
            }
        };

        // If inside modal
        if (modalId) {
            options.dropdownParent = $('#' + modalId);
        }

        child.select2(options);

    });
}

function encryptPassword(password) {
    var key = CryptoJS.enc.Utf8.parse('1234567890123456'); // 16-byte key
    var iv = CryptoJS.enc.Utf8.parse('1234567890123456');  // 16-byte IV

    var encrypted = CryptoJS.AES.encrypt(password, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
}
var roleId = '@User.FindFirst("RoleId")?.Value';
var userId = '@User.FindFirst("UserId")?.Value';
$('.search_ddl').select2({
    dropdownParent: $('.modal'),
    placeholder: "Select an option",
    allowClear: false,
    width: '100%' // make it fit the container
});
// For  allow only Numeric value
$('.numericOnly').on('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
});

// Allow only Decimal value: digits and one dot, max 2 decimals
$('.decimalOnly').on('input', function () {
    let val = this.value;

    // Remove invalid chars (anything except digits and dot)
    val = val.replace(/[^0-9.]/g, '');

    // Allow only one dot
    const parts = val.split('.');
    if (parts.length > 2) {
        val = parts[0] + '.' + parts[1];
    }

    // Limit to 2 decimal places if decimal exists
    if (parts.length === 2) {
        parts[1] = parts[1].substring(0, 2);
        val = parts[0] + '.' + parts[1];
    }

    this.value = val;
});

//function validateEmail(email) {
//    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//    return re.test(email);
//}
//function isValidPassword(password) {
//    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?':{}|<>]).{8,}$/;
//    return passwordRegex.test(password);
//}

//$(".no-paste").on("copy paste cut", function (e) {
//    e.preventDefault();
//});
//$('.search_ddl').select2({
//    dropdownParent: $('.modal'),
//    placeholder: "Select an option",
//    allowClear: true,
//    width: '100%' // make it fit the container
//});

////function GenerateEncriptId(_id, redirectUrl) {
////    $.ajax({
////        url: '/Home/GenerateEncriptId', // Replace with your actual endpoint
////        type: 'GET',
////        data: { id: _id },
////        success: function (res) {
////            window.location.href = redirectUrl + "/" + res;
////        },
////        error: function (xhr) {
////            Swal.fire({
////                icon: 'error',
////                title: 'Error',
////                text: xhr.responseJSON?.message || "Unable to fetch Category."
////            });
////        }
////    });
////}

function formatDateForInput(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) {
        // manually parse 08-Oct-2025
        const parts = dateStr.split("-");
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = monthNames.indexOf(month);
        if (monthIndex === -1) return "";
        return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return date.toISOString().split("T")[0];
}

function openEncryptedReport(id, methodName) {
    $.ajax({
        url: '/Home/GenerateEncriptId',
        type: 'GET',
        data: { id: id },
        success: function (encryptedId) {

            const url = `/Reports/Print?id=${encryptedId}&method=${methodName}`;
            window.open(url, '_blank');

        },
        error: function (xhr) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: xhr.responseJSON?.message || 'Unable to generate report.'
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {

    // Store new header if page provided one
    if (window.pageTitleFromServer) {
        localStorage.setItem("currentHeader", window.pageTitleFromServer);
    }

    // Restore header everywhere
    var savedHeader = localStorage.getItem("currentHeader");
    var headerElement = document.getElementById("pageHeader");

    if (savedHeader && headerElement) {
        headerElement.innerText = savedHeader;
    }
});

//function clearLayoutState() {
//    localStorage.removeItem("currentHeader");
//}
function fileSizeValidation(fileUploadId,maxSizeFileMB)
{
    var fileId = document.getElementById(fileUploadId);

    const maxSize = maxSizeFileMB* ( 1024 * 1024); // 2MB
    const file = fileId.files[0];
    

        if (file) {
            if (file.size > maxSize) {
                alert("File size must be less than 2MB");
                this.value = ""; // Clear selected file
                return false;
            }
            else {
                return true;
            }
        }
    
}
//
function fileExtensionValidation1(fileUploadId, allowedExtensions ) {
    //let allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
    //extension validation   
    var fileId = document.getElementById(fileUploadId);    
    const file = fileId.files[0];
    let files = file.files;
    
    $.each(files, function (key, file) {

        let extension = file.name.split('.').pop().toLowerCase();
        alert(extension);
        var result = allowedExtensions.join(",");
        if (!allowedExtensions.includes(extension)) {
            toastr.error("Only " + result +" files are allowed");
            return false; // stop loop
        }

    });

}

function fileExtensionValidation(fileUploadId, allowedExtensions) {

    var fileInput = document.getElementById(fileUploadId);

    // If input not found
    if (!fileInput) {
        console.error("File input not found: " + fileUploadId);
        return false;
    }

    // If no file selected
    if (!fileInput.files || fileInput.files.length === 0) {
        return true; // nothing to validate
    }

    var file = fileInput.files[0];

    // Extra safety check
    if (!file || !file.name) {
        return false;
    }

    var extension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
        toastr.error("Only " + allowedExtensions.join(", ") + " files are allowed");
        return false;
    }

    return true;
}

//
//
//function getNewFileName(file,prefix) {
//    let extension = file.name.split('.').pop();
//    let newFileName = prefix + "_" + Date.now() + "_" + key + "." + extension;
//    return newFileName;
//}

// Open upload file on new tab
function openFile(fileName, fileType) {
    let url = `/Manpower/ViewDeptAttendanceFile?fileName=${fileName}&fileType=${fileType}`;
    window.open(url, '_blank');
}