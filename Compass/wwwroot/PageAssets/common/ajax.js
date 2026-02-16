//get records for Table
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
//Stroe data in sqlserver
function acceptUpdate(controllerName, methodName, formdata) {
    return $.ajax({
        url: `/${controllerName}/${methodName}`,
        type: 'POST',
        data: formdata,
        processData: false,   // 🔥 required for FormData
        contentType: false    // 🔥 required for FormData
    });
}
// Sbumit Multiple Data with Jsonformat
function acceptUpdateMultiJData(controllerName, methodName, Jsondata) {
    return $.ajax({
        url: `/${controllerName}/${methodName}`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(Jsondata)
    });
}
// Sbumit Multiple Data with formdata
function acceptUpdateMultiTableFData(controllerName, methodName, fromData) {
    return $.ajax({
        url: `/${controllerName}/${methodName}`,
        type: 'POST',
        data: fromData,
        processData: false,   // 🔥 required for FormData
        contentType: false    // 🔥 required for FormData
    });
}
