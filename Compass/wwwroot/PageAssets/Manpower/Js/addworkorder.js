
var Id = 0;
//common
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-center-center",
    timeOut: "3000"
};


//ready

$(document).ready(function () {
    resetModal();
    alert('dfdf');
    //recordlist();
    //modalSelect2('myModal', 'Catg');
    alert('Dropdown Binidng starts');
    bindDataToDdl("Dropdown", "MAgency_ddl", "myModal", "ddlAgencyName", " Agency Name");
    bindDataToDdl("Dropdown", "MDepartment_ddl", "myModal", "ddlDeptName", " Department Name");
    //bindDataToDdl("Dropdown", "MBillingAddress_ddl", "myModal", "ddlBillingAddress", " Billing Address");
});

// To get Department ddl on change Agency ddl
//$('#ddlAgencyName').on('change', function () {

//    var agencyId = $(this).val();

//    $('#ddlDeptName').val(null).trigger('change');


//    $('#ddlDeptName').select2({
//        dropdownParent: $('#myModal'),
//        placeholder: "Select Department",
//        allowClear: true,
//        ajax: {
//            url: '/Dropdown/MDepartment_ddl',
//            dataType: 'json',
//            delay: 250,
//            data: function (params) {
//                return {
//                    DeptId: agencyId,
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
//});

// To get Billing Address ddl on change Department ddl
$('#ddlDeptName').on('change', function () {

    var billingAddId = $(this).val();

    $('#ddlBillingAddress').val(null).trigger('change');


    $('#ddlBillingAddress').select2({
        dropdownParent: $('#myModal'),
        placeholder: "Select Billing Address",
        allowClear: true,
        ajax: {
            url: '/Dropdown/MBillingAddress_ddl',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    DeptId: billingAddId,
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


