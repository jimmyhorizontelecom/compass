var Id = 0, tabIdNo = 1;


$(document).ready(function () {
    resetModal();
    recordlist();
    //Filter Dropdown
    bindDataToDdl("HardwareDropdown", "HMainCategory_ddl", "", "ddlMainCategoryFilter", " Main Categroy");
    bindDependentDataToDdl("HardwareDropdown", "HProduct_ddl", "",//❗ With/Without modal
        "ddlMainCategoryFilter", "ddlProductCategoryFilter", "Select Product Category");
    bindDataToDdl("HardwareDropdown", "HCompany_ddl", "", "ddlBrandFilter", " Brand Name",);
//Reload data in the table when changes in ddl filter
    $(document).on('change', '#ddlMainCategoryFilter, #ddlProductCategoryFilter, #ddlBrandFilter', function () {
        recordlist();
    });

    //DDL in Add Product Model
    bindDataToDdl("HardwareDropdown", "HMainCategory_ddl", "myModal", "ddlmaincategory", " Main Categroy");
    bindDependentDataToDdl("HardwareDropdown", "HProduct_ddl", "myModal",//❗ With/Without modal
        "ddlmaincategory", "ddlProduct", "Select Product Category");
    //bindDataToDdl("HardwareDropdown", "HProduct_ddl", "myModal", "ddlProduct", " Product Name");
     bindDataToDdl("HardwareDropdown", "HCompany_ddl", "myModal", "ddlBrand", " Brand Name");

    //bindDataToDdl("HardwareDropdown", "HMainCategory_ddl", "myModalTab", "ddlmaincategory1", "Main Category");
    // bindDataToDdl("HardwareDropdown", "HMainCategory_ddl", "myModalTab", "ddlProduct1", "Main Category");
    //bindDataToDdl("HardwareDropdown", "HCompany_ddl", "myModalTab", "ddlBrand1", "Brand");
    //bindDataToDdl("HardwareDropdown", "HAgency_ddl", "myModalTab", "ddlBrand1", "Agency");
    //bindDataToDdl("HardwareDropdown", "HAgency_ddl", "myModalTab", "ddlBrand1", "Agency");
    //bindDataToDdl("HardwareDropdown", "HMainCategory_ddl", "myModalTab", "ddlmaincategory1", " Main Categroy", 0, 0);
});
//Get Record for A table 
async function recordlist() {
    var filterata = {
        // FilterId1: $("#ddlMainCategoryFilter").val() || 0,
        // FilterId2: $("#ddlProductCategoryFilter").val() || 0,
        // FilterId3: $("#ddlBrandFilter").val() || 0,
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
        FilterName1: '',
    };
    try {
        let records = await getRecords('HardwareMaster', 'getProductList', filterata, '#myTable', 'N');
        bindDatatable(records, '#myTable');
    }
    catch (error) {
        console.error("Error loading records:", error);
        //hideModalLoader();
    }
}
//Bind get record  in a table 
function bindDatatable(records, tableId) {
    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().clear().destroy();
    }
    var tbody = $(tableId + " tbody");
    tbody.empty();
    $.each(records, function (i, value) {
        let SrNo = i + 1;
        tbody.append(`
                   <tr
                        data-id="${value.Id}" 
                        data-name="${value.MainCategoryName}" >
            
                        <td>${SrNo}</td>
                        <td>${value.MainCategoryName}</td>
                        <td>${value.CompanyName}</td>
                        <td>${value.Title}</td>
                        <td>${value.ModalNo}</td>
                        <td>${value.ProductNewPrice}</td>
                        <td>${value.GrandTotal}</td>
                        <td>${value.GrandTotalNew}</td>
                        <td>${value.Specification}</td>
                        <td>${value.TenderNo}</td>                                                     
                        <td class="text-center align-middle">
                            <div class="form-check form-switch d-flex justify-content-center">
                                <input class="form-check-input isActiveToggle" type="checkbox" ${value.IsActive === 'Y' ? 'checked' : ''}>
                            </div>
                        </td>
                <td class="text-center align-middle">
                <button type="button" class="btn p-0 border-0 bg-transparent editProduct" data-id="${value.Id}" title="Edit">
                <i class="bi bi-pencil-square" style="font-size: 30px; color:#800000;"></i> </button>
                </td>
         </tr>
        `);
    });

    $(tableId).DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        responsive: true,
        autoWidth: false,
        columnDefs: [
            {
                targets: 8,       // Specification column
                width: "400px"
            }
        ]
    });
    //hideModalLoader();
}

// Submit record when Click on btn in Add Product Model
$(".btnModalSubmit").on("click", function () {
    // SubmitRecord();
    SubmitAddProduct();
});

async function SubmitAddProduct() {
    let isValid = true;
     $(".error").remove();
     $(".is-invalid").removeClass("is-invalid");
    let ddlmaincategory = $("#ddlmaincategory").val();
    let ddlProduct = $("#ddlProduct").val();
    let ddlBrand = $("#ddlBrand").val();
    let ModelNo = $("#ModelNo").val().trim();
    let Price = $("#Price").val().trim();
    let HPSEDCCharge = $("#HPSEDCCharge").val().trim();
    let GST = $("#GST").val().trim();
    let GrandTotal = $("#GrandTotal").val().trim();
    let TargetNonTribal = $("#TargetNonTribal").val().trim();
    let TribalArea = $("#TribalArea").val().trim();
    let TenderName = $("#TenderName").val().trim();
    let TargetDays = $("#TargetDays").val();
    let ValidFrom = $("#ValidFrom").val();
    let ValidTo = $("#ValidTo").val();
    let Specification = $("#Specification").val().trim();
    //let RularPenaltyDays = $("#TargetNonTribal").val().trim();
        let HSNCode = "0";
     if (!ddlmaincategory || ddlmaincategory === "0") {
        showError( "ddlmaincategory", "Select Main Category.");
        isValid = false;
    }
    if (!ddlProduct || ddlProduct === "0") {
        showError( "ddlProduct", "Select Product");
        isValid = false;
    }
    if (!ddlBrand || ddlBrand === "0") {
        showError( "ddlBrand", "Select Brand");
        isValid = false;
    }
    if (ModelNo === "") {
        showError("ModelNo", "Please enter Model No");
        isValid = false;
    } 
    if (Price === "") {
        showError("Price", "Please enter Price");
        isValid = false;
    } 
    if (HPSEDCCharge === "") {
        showError("HPSEDCCharge", "Please enter HPSEDC Charge");
        isValid = false;
    } 
    if (GST === "") {
        showError("GST", "Please enter GST %");
        isValid = false;
    } 
    if (TargetNonTribal === "") {
        showError("TargetNonTribal", "Please enter Target Days");
        isValid = false;
    } 
    if (TribalArea === "") {
        showError("TribalArea", "Please enter Target Days");
        isValid = false;
    } 
    if (TenderName === "") {
        showError("TenderName", "Please enter Tender Name");
        isValid = false;
    } 
    if (ValidFrom === "") {
        showError("ValidFrom", "Please enter Valid From");
        isValid = false;
    } 
    if (ValidTo === "") {
        showError("ValidTo", "Please enter Valid To");
        isValid = false;
    } 
    if (Specification === "") {
        showError("Specification", "Please enter Specification");
        isValid = false;
    } 
    if (!isValid) return; // stop if validation fails
    // Prepare data
    var formData = new FormData();
    formData.append("ProductId", Id);
    formData.append("MainCategoryId", ddlmaincategory);
    formData.append("PCategoryId", ddlProduct);
    formData.append("CompanyId", ddlBrand);
    formData.append("ModelNo", ModelNo);
    formData.append("ProductPrice", Price);
    formData.append("Sepcification", Specification);
    formData.append("HSNCode", HSNCode);
    formData.append("Gst", GST);
    formData.append("HPSEDCCharges", HPSEDCCharge);
    formData.append("GrandTotal", GrandTotal);
    formData.append("TenderNo", TenderName);
    formData.append("ValidTo", ValidTo);
    formData.append("ValidFrom", ValidFrom);
    formData.append("RularPenaltyDays", 0);
    formData.append("UrbanPenaltyDays", 0);
    try {
        //$("#ModalProgress").show();
        let res = await acceptUpdate("HardwareMaster", "AddOrEditProduct", formData);
        if (res.success) {
            recordlist();
            resetModal();
            Id = 0;
            $('.modelalert').text(res.message);
            closeModal('myModal');
            MsgBox('Product', res.message, '');
        }
    } catch (err) {
        $('.modelalert').text("Error: " + err);
    }
}

// apply Price calulation formula
$('#Price, #HPSEDCCharge, #GST').on('input', function () {
    calculateGrandTotal('#Price', '#HPSEDCCharge', '#GST', '#GrandTotal');
});
function calculateGrandTotal(priceId, adminChargeId, gstId, grandTotalId) {
    let Price = parseFloat($(priceId).val()) || 0;
    let AdminchargePercent = parseFloat($(adminChargeId).val()) || 0;
    let GSTPercent = parseFloat($(gstId).val()) || 0;
    let Admincharge = (Price * AdminchargePercent) / 100;
    let GST = (Price + Admincharge) * GSTPercent / 100;
    let GrandTotal = Price + Admincharge + GST;
    $(grandTotalId).val(Math.round(GrandTotal));
}


// Tab content of Edit Button
$(document).on('shown.bs.tab', 'button[data-bs-toggle="tab"]', function (e) {
    var target = $(e.target).attr("data-bs-target");
    if (target === "#Edit") {
        tabIdNo = 1;
        //updateDetails();
    }
    if (target === "#UpdateGst") {
        tabIdNo = 2;
         //updateGst();
    }
    if (target === "#AddTargetDays") {
        tabIdNo = 3;
        // addTarget();
    }
    if (target === "#AddTenderDetails") {
        tabIdNo = 4;
        //addTender();
    }
    if (target === "#UpdateSpace") {
        tabIdNo = 5;
        //updateSpecs();
    }
});

// Open Edit Model
$(document).on('click', '.editProduct', async function () {
    tabIdNo = 1;
    Id = $(this).data("id");
    alert(Id);
    if (!Id) {
        toastr.error("Record Id not found");
        return;
    }
    var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question');
    if (isConfirmed) {
        resetModal();
        await getProductDetails(Id);
        // Set modal title
        $("#myModalTab .modal-title").text("Edit Product");
        // Show modal (Bootstrap 5 way)
        openModal('myModalTab');
    } else {
        console.log('Edit cancelled');
    }
});
// get Record to fill Edit Detail Tab
async function getProductDetails(productId) {
    alert(productId);
     var filterData = {
        FilterId1: 0,
        FilterId2: 0,
        FilterId3: 0,
         FilterName1: productId,
    };
    try {
        let records = await getRecords('HardwareMaster', 'getProductListEdit', filterData, '#myTable', 'N');
        console.log("Records:", records);
        if (records && records.length > 0) {
            let data = records[0];
            
            bindDataToDdl( "HardwareDropdown", "HMainCategory_ddl", "myModalTab", "ddlmaincategory1", "Main Category", data.MainCatgNameId, 0);
            var mainCategoryOption = new Option( data.MainCatgName, data.MainCatgNameId, true, true );
            $("#ddlmaincategory1").append(mainCategoryOption) .trigger("change");

            bindDependentDataToDdl("HardwareDropdown", "HProduct_ddl", "myModalTab", "ddlmaincategory1", "ddlProduct1", "Product Name", data.MainCatgNameId, 0);
            var productOption = new Option( data.Title, data.Id, true, true );
            $("#ddlProduct1").append(productOption).trigger("change");

            bindDataToDdl("HardwareDropdown", "HCompany_ddl", "myModalTab", "ddlBrand1", "Brand");
             var companyOption = new Option(data.CompanyName, data.CompanyId, true, true);
            $("#ddlBrand1").append(companyOption).trigger('change');

            // $("#ModelNo1").val(data.ModelNo);
            // $("#Price1").val(data.ProductPrice);
            // $("#HPSEDCCharge1").val(data.HPSEDCCharges);
            // $("#GST1").val(data.Gst);
            // $("#GrandTotal1").val(data.GrandTotal);
            // $("#NonTribalTargetDays1").val(data.UrbenPenaltyDays);
            // $("#TribalTargetDays1").val(data.RulerPenaltyDays);
            // $("#TenderName1").val(data.TenderNo);
            // $("#ValidFrom1").val(data.ValidFrom);
            // $("#ValidTo1").val(data.ValidTo);
            // $("#Specification1").val(data.Sepcification);
            $("#ModelNo1").val(data.ModelNo ?? "");
            $("#Price1").val(data.ProductPrice ?? "");
            $("#HPSEDCCharge1").val(data.HPSEDCCharges ?? "");
            $("#GST1").val(data.Gst ?? "");
            $("#GrandTotal1").val(data.GrandTotal ?? "");
            $("#NonTribalTargetDays1").val(data.UrbenPenaltyDays ?? "");
            $("#TribalTargetDays1").val(data.RulerPenaltyDays ?? "" );
            $("#TenderName1").val(data.TenderNo ?? "");
            $("#ValidFrom1").val(data.ValidFrom ?? "");
            $("#ValidTo1").val(data.ValidTo ?? "");
            $("#Specification1").val(data.Sepcification ?? "");
            // Update GST
            $("#txtPrice").val(data.ProductPrice ?? "");
            $("#txtHPSEDCCharge2").val(data.HPSEDCCharges ?? "");
            $("#txtOldGST").val(data.Gst ?? "");
            $("#txtOldGTotal").val(data.GrandTotal ?? "");
           // $("#txtNewGST").val(data.PenaltyRate);
            $("#txtOldGTotal").val(data.GrandTotal);
           // $("#txtNewGTotal").val(data.Gst);
            // Add Target Days
            $("#txtNonTribaltxtNonTribal").val( data.RulerPenaltyDays ?? "" );
            $("#txtTribal").val(data.UrbenPenaltyDays ?? "");
            // Add Tender Details
            $("#txtTender").val(data.TenderNo ?? "");
            $("#txtValidFrom").val(data.ValidFrom ?? "");
            $("#txtValidTo").val(data.ValidTo ?? "");

            // Update Space
            $("#txtAreaSpecs").val(data.Sepcification ?? "");
            console.log("Product details loaded successfully:", productId);
            return true;
        }
    }
    catch (error) {
        console.error("Error loading record:", error);
        toastr.error("Error loading product details.");
        return false;
    }
}

// $('#Price, #HPSEDCCharge, #GST').on('input', function () {
//     calculateGrandTotal();
// });
// apply Price calulation formula
$('#Price1, #HPSEDCCharge1, #GST1').on('input', function () {
    calculateGrandTotal( '#Price1', '#HPSEDCCharge1', '#GST1', '#GrandTotal1'
    );
});
// calculate Grand Total
// function calculateGrandTotal() {
//     let Price = parseFloat($('#Price').val()) || 0;
//     let Admincharge = parseFloat($('#HPSEDCCharge').val()) || 0;
//     let GST = parseFloat($('#GST').val()) || 0;
//     Admincharge = (Price * Admincharge) / 100;
//     GST = (Price + Admincharge) * GST / 100;
//     let GrandTotal = Price + GST + Admincharge;
//     $('#GrandTotal').val(GrandTotal.toFixed(2));
// }
$('#txtPrice, #txtHPSEDCCharge2, #txtNewGST').on('input', function () {
    calculateGrandTotal('#txtPrice', '#txtHPSEDCCharge2', '#txtNewGST', '#txtNewGTotal'
    );
});



// Update Tabs contents
// $(document).on('click', '.update_tab', function () {
//     alert(tabIdNo);
// });
// $(document).on('click', '.update_tab', function () {

//     if (tabIdNo === 1) {
//         updateDetails();
//     }
//     else if (tabIdNo === 2) {
//         updateGst();
//     }
//     else if (tabIdNo === 3) {
//         addTarget();
//     }
//     else if (tabIdNo === 4) {
//         addTender();
//     }
//     else if (tabIdNo === 5) {
//         updateSpecs();
//     }

// });
$(document).on('click', '.btn-update-details', function () {
    updateDetails();
});

async function updateDetails() {
    alert('Test update details');
        let isValid = true;
        $(".error").remove();
        $(".is-invalid").removeClass("is-invalid");
        let mainCategoryId = $("#ddlmaincategory1").val();
        let productId = $("#ddlProduct1").val();
        let companyId = $("#ddlBrand1").val();

        let modelNo = $("#ModelNo1").val().trim();
        let price = $("#Price1").val().trim();
        let hpsedcCharge = $("#HPSEDCCharge1").val().trim();
        let gst = $("#GST1").val().trim();
        let grandTotal = $("#GrandTotal1").val().trim();

        let nonTribalTargetDays = $("#NonTribalTargetDays1").val();
        let tribalTargetDays = $("#TribalTargetDays1").val();

        let tenderName = $("#TenderName1").val().trim();
        let validFrom = $("#ValidFrom1").val();
        let validTo = $("#ValidTo1").val();
        let specification = $("#Specification1").val().trim();


        // Validation
        if (!mainCategoryId || mainCategoryId === "0") {
            showError("ddlmaincategory1", "Select Main Category.");
            return;
        }

        if (!productId || productId === "0") {
            showError("ddlProduct1", "Select Product.");
            return;
        }

        if (!companyId || companyId === "0") {
            showError("ddlBrand1", "Select Brand.");
            return;
        }

        if (modelNo === "") {
            showError("ModelNo1", "Please enter Model No");
            isValid = false;
        }
        if (price === "") {
            showError("Price1", "Please enter Price");
            isValid = false;
        }
        if (hpsedcCharge === "") {
            showError("HPSEDCCharge1", "Please enter HPSEDC Charge");
            isValid = false;
        }
        if (gst === "") {
            showError("GST1", "Please enter GST");
            isValid = false;
        }
        if (nonTribalTargetDays === "") {
            showError("NonTribalTargetDays1", "Please enter Target Days");
            isValid = false;
        }
        if (tribalTargetDays === "") {
            showError("TribalTargetDays1", "Please enter Target Days");
            isValid = false;
        }
        if (tenderName === "") {
            showError("TenderName1", "Please enter Tender Name");
            isValid = false;
        }
        if (validFrom === "") {
            showError("ValidFrom1", "Please enter Valid From");
            isValid = false;
        }
        if (validTo === "") {
            showError("ValidTo1", "Please enter Valid To");
            isValid = false;
        }
        if (specification === "") {
            showError("Specification1", "Please enter Specification");
            isValid = false;
        } 
        if (!isValid) return; // stop if validation fails

        // Prepare FormData
        let formData = new FormData();
        formData.append("ProductId", Id);
        formData.append("MainCategoryId", mainCategoryId);
        formData.append("PCategoryId", productId);
        formData.append("CompanyId", companyId);
        formData.append("ModelNo", modelNo);
        formData.append("ProductPrice", price);
        formData.append("HPSEDCCharges", hpsedcCharge);
        formData.append("Gst", gst);
        formData.append("GrandTotal", grandTotal);
        formData.append("UrbanPenaltyDays", nonTribalTargetDays);
        formData.append("RularPenaltyDays", tribalTargetDays);
        formData.append("TenderNo", tenderName);
        formData.append("ValidFrom", validFrom);
        formData.append("ValidTo", validTo);
        formData.append("Sepcification", specification);
        try {
            let res = await acceptUpdate( "HardwareMaster",  "", formData);
            if (res.success) {
            toastr.success(res.message);
                await recordlist();
                Id = 0;
               closeModal("myModalTab");
            }
            else {
               toastr.error(res.message);
            }
        }
        catch (error) {
            console.error("Update error:", error);
            toastr.error("Something went wrong while updating record.");
        }
    }

$(document).on('click', '.btn-update-gst', function () {
    updateGst();
});
async function updateGst() {
    alert('Test update gst');
    let isValid = true;
    $(".error").remove();
    $(".is-invalid").removeClass("is-invalid");
    let newGst = $("#txtNewGST").val().trim();
     // Validation
    if (newGst === "") {
        showError("txtNewGST", "Please enter New GST");
        isValid = false;
    }
   
    if (!isValid) return; // stop if validation fails

    // Prepare FormData
    let formData = new FormData();

    formData.append("ProductId", Id);
    
    try {
        let res = await acceptUpdate("HardwareMaster", "", formData);
        if (res.success) {
            toastr.success(res.message);
            await recordlist();
            Id = 0;
            closeModal("myModalTab");
        }
        else {
            toastr.error(res.message);
        }
    }
    catch (error) {
        console.error("Update error:", error);
        toastr.error("Something went wrong while updating record.");
    }
}
$(document).on('click', '.btn-update-target', function () {
    addTarget();
});
async function addTarget() {
    alert('Test add target days');
    let isValid = true;
    $(".error").remove();
    $(".is-invalid").removeClass("is-invalid");
    let nonTribalDays = $("#txtNonTribal").val().trim();
    let tribalDays = $("#txtTribal").val().trim();
    // Validation
    if (nonTribalDays === "") {
        showError("txtNonTribal", "Please enter Days");
        isValid = false;
    }
    if (tribalDays === "") {
        showError("txtTribal", "Please enter Days");
        isValid = false;
    }

    if (!isValid) return; // stop if validation fails

    // Prepare FormData
    let formData = new FormData();

    formData.append("ProductId", Id);

    try {
        let res = await acceptUpdate("HardwareMaster", "", formData);
        if (res.success) {
            toastr.success(res.message);
            await recordlist();
            Id = 0;
            closeModal("myModalTab");
        }
        else {
            toastr.error(res.message);
        }
    }
    catch (error) {
        console.error("Update error:", error);
        toastr.error("Something went wrong while updating record.");
    }
}
$(document).on('click', '.btn-add-tender', function () {
    addTender();
});
async function addTender() {
    alert('Test Add Tender details');
    let isValid = true;
    $(".error").remove();
    $(".is-invalid").removeClass("is-invalid");
    let tenderNo = $("#txtTender").val().trim();
    let validFrom = $("#txtValidFrom").val().trim();
    let validTo = $("#txtValidTo").val().trim();
    // Validation
    if (tenderNo === "") {
        showError("txtTender", "Please enter Tender No.");
        isValid = false;
    }
    if (validFrom === "") {
        showError("txtValidFrom", "Please enter Valid From");
        isValid = false;
    }
    if (validTo === "") {
        showError("txtValidTo", "Please enter Valid To");
        isValid = false;
    }

    if (!isValid) return; // stop if validation fails

    // Prepare FormData
    let formData = new FormData();

    formData.append("ProductId", Id);

    try {
        let res = await acceptUpdate("HardwareMaster", "", formData);
        if (res.success) {
            toastr.success(res.message);
            await recordlist();
            Id = 0;
            closeModal("myModalTab");
        }
        else {
            toastr.error(res.message);
        }
    }
    catch (error) {
        console.error("Update error:", error);
        toastr.error("Something went wrong while updating record.");
    }
}
$(document).on('click', '.btn-update-specs', function () {
    updateSpecs();
});
async function updateSpecs() {
    alert('Test Update Specs');
    let isValid = true;
    $(".error").remove();
    $(".is-invalid").removeClass("is-invalid");
    let specification = $("#txtAreaSpecs").val().trim();
    // Validation
    if (specification === "") {
        showError("txtAreaSpecs", "Please enter Specification");
        isValid = false;
    }

    if (!isValid) return; // stop if validation fails

    // Prepare FormData
    let formData = new FormData();

    formData.append("ProductId", Id);

    try {
        let res = await acceptUpdate("HardwareMaster", "", formData);
        if (res.success) {
            toastr.success(res.message);
            await recordlist();
            Id = 0;
            closeModal("myModalTab");
        }
        else {
            toastr.error(res.message);
        }
    }
    catch (error) {
        console.error("Update error:", error);
        toastr.error("Something went wrong while updating record.");
    }
}






// //Edit Record From Table
// $(document).on('click', '.edit-test', async function () {

//     var row = $(this).closest('tr');
//     Id = row.data('id');

//     var isConfirmed = await DeleteEditBox('Edit Field', 'Do you want to edit Record?', 'question', Id);

//     if (isConfirmed) {
//         console.log('Edit');
//         // User clicked Yes
//         await loadRecordById(row);
//         openModal('myModal');
//         // $('#myModal').modal('show');
//     } else {
//         // User clicked Cancel
//         console.log('Edit cancelled');
//     }
// });



