function Test()
{
    alert('dfdf');
}
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