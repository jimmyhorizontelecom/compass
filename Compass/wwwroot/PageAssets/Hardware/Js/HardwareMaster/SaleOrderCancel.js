var Id = 0;

$(document).ready(function () {

    resetModal();
    SaleOrderCancelList();
    // $('#myTableSaleOrderCancel').DataTable({
    //     "paging": true,
    //     "searching": true,
    //     "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
    //     "language": {
    //         "search": "Search"
    //     }
    // });

});

//Get Record for A table 
async function SaleOrderCancelList() {

    var filterata = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };

    try {

        let records = await getRecords('HardwareOrder', 'getSaleOrderCancelList', filterata, '#myTableSaleOrderCancel', 'N');
        bindDatatableSaleOrderCancelList(records, '#myTableSaleOrderCancel');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table 
function bindDatatableSaleOrderCancelList(records, tableId) {

    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }

    var tbody = $(tableId + " tbody");
    tbody.empty();

    $.each(records, function (i, value) {
        let SrNo = i + 1;

        tbody.append(`
            <tr 
                 data-saleorderid="${value.SaleOrderId}"   
                         >
                        <td>${SrNo}</td>
                         <td>${value.HWSaleOrderNo}</td>
                         <td>${value.LetterReferenceNo}<br/>${value.OrderDate}</td> 
                        <td>${value.departmentName}</td>
                        <td>${value.BillingAddress}</td>
                        <td><i class="bi bi-file-earmark-pdf-fill text-danger fs-3" title="Print PDF"></i></td>
                       <td>${parseFloat(value.Gtotal).toFixed(2)}</td>
                        <td>${parseFloat(value.Balance).toFixed(2)}</td>
                       <td>${parseFloat(value.AdvanceAmt).toFixed(2)}</td>
                        <td>${value.CancelRemarks}</td>
                       
    
                       
               
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

    //hideModalLoader();
}


