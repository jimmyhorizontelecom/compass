var TrCatgId = 0;

$(document).ready(function () {

    bindDataToDdl("HardwareDropdown", "SaleOrder_ddl", "", "ddlModifySale", " Sale Order ", 0, 0);
    //bindDataToDdl("HardwareDropdown", "AddTermTypeCondition_ddl", "", "ddlTermTypeCondition", " Terms And Condition Type ", 0, 0);
    resetModal();
    ModifySaleOrderList();
    $('#myTableSaleOrderModify').DataTable({
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "language": {
            "search": "Search"
        }
    });

});
$('#ddlModifySale').on("change", function () {
    ModifySaleOrderList();
});

//Get Record for A table 
async function ModifySaleOrderList() {

    var filterata = {
        FilterId1: $('#ddlModifySale').val(),
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwarePurchase', 'getModifySaleOrderList', filterata, '#myTableSaleOrderModify', 'N');
        bindDatatableSaleModify(records, '#myTableSaleOrderModify');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table item description
function bindDatatableSaleModify(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`
    <tr  data-productid="${value.ProductId}" data-orderdetailsid="${value.OrderDetailsId}" data-isdraftorder="${value.IsDraftOrder}">
        <td>${SrNo}</td>

        <td>
            <input type="checkbox" class="rowCheckbox">
        </td>

        <td>${value.ProductName}</td>
        <td>${value.ModelNo}</td>
        <td class="sepcification">${value.Sepcification}</td>
        <td>${value.OrderQty}</td>

        <td>
            <input type="number"
                   class="form-control newQty text-center"
                   readonly>
        </td>

        <td class="price">${(value.Price).toFixed(2)}</td>
        <td class="totalprice">${(value.Price * value.OrderQty).toFixed(2)}</td>
        <td class="admincharge">${(value.AdminCharge).toFixed(2)}</td>
        <td class="gst">${(value.Gst).toFixed(2)}</td>
        <td class="grandtotal">${(value.Gtotal).toFixed(2)}</td>
       
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
    $(document).on('change', '.newQty', function () {

        let row = $(this).closest('tr');
        loadRecordById(row);


    });
    // get data Fill record
    async function loadRecordById(row) {
        //let row = $(this).closest('tr');
        let qty = row.find('.newQty').val();
        console.log(row.find('.newQty').val());
        var Obj = getSelectedDataSaleModify();
        if (!Obj.Status) {
            MsgBox('Invalid Message', Obj.Message, '');
            return;
        }


        var productid = row.data('productid');
        console.log(productid);
        var filterata = {
            FilterId1: productid,
            FilterId2: qty,
            FilterId3: 0,
            FilterName1: '',
        };

        try {

            let records = await getRecords('HardwarePurchase', 'getRecordFilldata', filterata, '', 'N');

            if (records && records.length > 0) {

                let data = records[0];
                //Id = data.Id;
                // let base = parseFloat($(row).find('.admincharge').text()) || 0;
                $(row).find('.admincharge').text(data.AdminCharge);
                $(row).find('.totalprice').text(data.TotalPrice);
                $(row).find('.gst').text(data.Gst);
                $(row).find('.grandtotal').text(data.Gtotal);

            }
        }
        catch (error) {
            console.error("Error loading record:", error);
        }
    }

    // Select All checkbox
    $(document).on('change', '#selectAll', function () {

        $('.rowCheckbox').prop('checked', this.checked);

    });

    $(document).on('change', '.rowCheckbox', function () {

        let total = $('.rowCheckbox').length;
        let checked = $('.rowCheckbox:checked').length;

        // If all rows are checked
        $('#selectAll').prop('checked', total > 0 && total === checked);

    });
    // Select checkbox onchange event

    $(document).on("change", ".rowCheckbox", function () {

        let $row = $(this).closest("tr");
        let $newQty = $row.find("input.newQty");

        if (this.checked) {
            $newQty.removeAttr("readonly");
            $newQty.prop("readonly", false);
            $newQty.focus();
        }
        else {
            $newQty.prop("readonly", true);
        }

    });
    // Open The button when click Submit Record
    $(document).on('click', '.btnModifySubmit', function () {

        SubmitModifySaleOrder();
    });


    //Selected data Moidify Sale Order
    //function getSelectedDataSaleModify() {

    //    var selectedItems = [];

    //    $('.rowCheckbox:checked').each(function () {
    //        var row = $(this).closest('tr');


    //        var item = {
    //            OrderDetailsId: row.data('orderdetailsid'),
    //            IsDraftOrder: row.data('isdraftorder'),
    //            ProductId : row.data('productid'),
    //            OrderQty: row.find('.newQty').val(),
    //            Price: row.find('.price').text(),
    //            Gst: row.find('.gst').text(),
    //            AdminCharge : row.find('.admincharge').text(),
    //            Gtotal : row.find('.grandtotal').text(),
    //            Narration: row.find('.sepcification').text(),



    //        };

    //        selectedItems.push(item);
    //    });
    //    console.log(selectedItems);

    //    return selectedItems;
    //}
    function getSelectedDataSaleModify() {

        var selectedItems = [];

        $('.rowCheckbox:checked').each(function () {

            var row = $(this).closest('tr');

            var qty = parseInt(row.find('.newQty').val()) || 0;

            // Validation
            if (qty < 1) {

                row.find('.newQty').addClass('is-invalid').focus();

                selectedItems = null;

                return false;
            }
            else {

                row.find('.newQty')
                    .removeClass('is-invalid');
            }

            var item = {
                OrderDetailsId: row.data('orderdetailsid'),
                IsDraftOrder: row.data('isdraftorder'),
                ProductId: row.data('productid'),
                OrderQty: qty,
                Price: row.find('.price').text().trim(),
                Gst: row.find('.gst').text().trim(),
                AdminCharge: row.find('.admincharge').text().trim(),
                Gtotal: row.find('.grandtotal').text().trim(),
                Narration: row.find('.sepcification').text().trim()
            };

            selectedItems.push(item);
        });
        // Return validation result
        if (selectedItems === null) {
            return {
                Status: false,
                Message: "Quantity must be greater than or equal to 1.",
                Data: []
            };
        }
        // Check quantity
        if (selectedItems.length === 0) {
            return {
                Status: false,
                Message: "Please select at least one valid item.",
                Data: []
            };
        }

        // Check file
        var fileInput = $("#AttachDocument").get(0);

        if (!fileInput || fileInput.files.length === 0) {
            return {
                Status: false,
                Message: "Please select a document.",
                Data: []
            };
        }




        return {
            Status: true,
            Message: "Validation successful.",
            Data: selectedItems
        };
    }
    // Submit Sale Modify Order
    async function SubmitModifySaleOrder() {

        var Obj = getSelectedDataSaleModify();
        if (!Obj.Status) {
            MsgBox('Invalid Message', Obj.Message, '');
            return;
        }




        // let isValid = true;

        //let AttachDocument = $("#AttachDocument").get(0);

        //let files1 = AttachDocument.files;
        //var fileSize = 10

        //var isValid1 = fileSizeValidation('AttachDocument', fileSize);

        //if (!isValid1) {
        //    MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        //    return;
        //}
        //let allowedExtensions = ["jpg", "jpeg", "pdf", "xlsx"];

        var newFileName1 = getNewFileName('AttachDocument', "ModifySale")

        //isValid1 = fileSizeValidation('AttachDocument', fileSize);

        //if (!isValid1) {
        //    MsgBox('Message', "File Size should be <=" + fileSize + "MB", '');
        //    //return;
        //}

        var ModifySale = {
            SaleOrderId: $('#ddlModifySale').val(),
            AttachDocument: $('#AttachDocument').val(),
            Items: Obj.Data,
        };

        var formData = new FormData();


        formData.append("ModifySaleOrder", JSON.stringify(ModifySale));

        if ($("#AttachDocument")[0].files.length > 0) {
            formData.append("ModifySale", $("#AttachDocument")[0].files[0], newFileName1);
        }
        try {

            let res = await acceptUpdateMultiTableFData1(
                'HardwarePurchase',
                'SubmitModifySaleOrder',
                formData
            );

            if (res.success) {
                MsgBox('Message', res.message, '');
                // bindDataToDdl("HardwareDropdown", "SaleOrder_ddl", "", "ddlModifySale", " Sale Order ", 0, 0);
                //bindDataToDdl("HardwareDropdown", "AddTermTypeCondition_ddl", "", "ddlTermTypeCondition", " Terms And Condition Type ", 0, 0);
                //9 resetModal();
                ModifySaleOrderList();
                $("#AttachDocument").val('');


                //resetModal();
                closeModal('myTableSaleOrderModify');

            }

        }
        catch (err) {
            MsgBox('Message', err, 'Error');
        }

    }


}


