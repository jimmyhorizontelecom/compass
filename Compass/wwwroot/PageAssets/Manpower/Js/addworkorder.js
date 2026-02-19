
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
    bindDataToDdl("Dropdown", "MDepartment_ddl", "myModal", "ddlDeptName", " Department Name");
    bindDataToDdl("Dropdown", "MBillingAddress_ddl", "myModal", "ddlBillingAddress", " Department Name");
});


