var ChallanId = 0;
var AttacheChallan = "";
var AttacheChallanDetails = "";

$(document).ready(function () {

    alert('verifyepfesi loadig');
    resetModal();
    recordlist();
    alert('Map Challan Loading');
    initCustomPicker('#monthYear');
    // Parent Dropdown
    bindDataToDdl("Dropdown", "MAgency_ddl", "", "ddlAgencyName", " Agency Name");
    bindDataToDdl("Dropdown", "MChallanType_ddl", "", "ddlChallanType", " Challan Type");
      // load data when changes on ddl
    $("#monthYear, #ddlAgencyName, #ddlChallanType,#ddlStatus").change(function () {
        recordlist();
    });
 
});

//Get Record for A table 
async function recordlist() {
    var monthYear = $("#monthYear").val(); 
    var monthYearId = "0"; // Default value
    if (monthYear) {
        // 2. Format Change: "04/2026" -> "42026" (Month + Year)
        // Use parseInt to Split leading zero 
        var parts = monthYear.split('/');
        var m = parseInt(parts[0], 10); // "04" becomes 4
        var y = parts[1];               // "2026"
        monthYearId = m.toString() + y.toString(); // "42026"
    }
    var verificationStatus = $("#ddlStatus").val();
    if (!verificationStatus || verificationStatus === "P") {
        verificationStatus = 'P';
    }
    verificationStatus = verificationStatus.trim().toUpperCase();
    var agencyId = parseInt($("#ddlAgencyName").val()) || 0;
    var challanType = parseInt($("#ddlChallanType").val()) || 0;
        var filterData = {
         AgencyId: agencyId,
         ChallanId:0,
         MonthYear: monthYearId,
         ChallanType: challanType,
            Status: verificationStatus,
    };
    console.log("Filter", filterData);
    try {

        let records = await getRecords('Manpower', 'GetChallanListforVerification', filterData, '#myTable', 'N');
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
        let verifyIcon = "";

        if (value.IsEsiVerified === "Y") {
            verifyIcon = `<i class="bi bi-patch-check-fill text-success vertifyChallan" data-challanid="${value.ChallanId}" title="Verified" style="cursor:pointer; font-size:30px"></i>`;
        }
        else if (value.IsEsiVerified === "P") {
            verifyIcon = `<i class="bi bi-patch-check-fill text-warning vertifyChallan" data-challanid="${value.ChallanId}" title="Pending" style="cursor:pointer; font-size:30px"></i>`;
        }
        else {
            verifyIcon = `<i class="bi bi-patch-check-fill text-danger vertifyChallan" data-challanid="${value.ChallanId}" title="Rejected / Not Verified" style="cursor:pointer; font-size:30px"></i>`;
        }
        tbody.append(`
            <tr data-challanid="${value.ChallanId}"
            data-agencyid="${value.AgencyId}"
            data-challantype="${value.ChallanTypeId}"
            data-monthyear="${value.BillForMonthId}" >
                <td>${SrNo}</td>
                <td>${value.AgencyName}</td>
                <td>${value.BillForMonth} </td>
                <td>${value.ChallanNumber} </td>
                <td>${value.ChallanType} </td>
                <td>${value.ChallanAmount} </td>
                 <td>${value.NoOfHPSEDCResource} </td>
               <td class="text-center">${verifyIcon}</td>
             
        `);
    });
    console.log(JSON.records);
    //alert(JSON.stringify(records));
    $(tableId).DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        responsive: true
    });
    //hideModalLoader();
}
// MsgBox on Edit Verify Challan
$(document).on('click', '.vertifyChallan', async function () {

    let row = $(this).closest("tr");
     ChallanId = row.data("challanid");
    console.log("Selected ChallanId:", ChallanId);
    let filterData = {
        ChallanId: row.data("challanid"),
        AgencyId: row.data("agencyid"),
        ChallanType: row.data("challantype"),
        MonthYear: row.data("monthyear")
    };

    console.log("Selected Challan:", filterData);


    if (!filterData.ChallanId) {
        toastr.error("Record Id not found.");
        return;
    }
    let isConfirmed = await DeleteEditBox('Verify Challan', 'Do you want to verify this challan?', 'question' );
    if (!isConfirmed) {
        return;
    }
    resetModal();
     await loadVerifyESIEPFModel(filterData);
     openModal('myModal');
});

//get Record to Add EPF ESI Model
async function loadVerifyESIEPFModel(filterData) {
    try {
        let records = await getRecords( 'Manpower',  'GetChallanListRecord', filterData, 'myModal', 'N' );
        console.log("Response:", records);
        if (!records || records.length === 0) {
            toastr.error("Record not found");
            return;
        }
        alert(JSON.stringify(records));
        let data = records[0];
        $("#txtAgencyName").val(data.AgencyName || "");
        $("#txtMonthYear").val(data.BillForMonth || "");
        $("#txtChallaType").val(data.ChallanType || "");
        $("#txtChallanNo").val(data.ChallanNumber || "");
        $("#txtChallanAmt").val(data.ChallanAmount || 0);
        $("#txtHpsedcResources").val(data.NoOfHPSEDCResource || 0);
        $("#txtMappedResource").val(data.MappedResource || 0);
       // Challan Copy file save
        AttacheChallan = data.AttacheChallan || "";
        AttacheChallanDetails = data.AttacheChallanDetails || "";
    }
    catch (error) {
        console.error( "Load Challan Error:", error );
    }
}

$(document).on("click", "#btnViewChallan", function () {
    console.log("View Challan button clicked");
    console.log("File Path:", AttacheChallan);
    if (!AttacheChallan) {
        toastr.error("Challan Copy not uploaded");
        return;
    }
    let url = "/Attachment/ESIEPF/AttacheChallan/" + AttacheChallan;
    window.open(url, "_blank");
});
$(document).on("click", "#btnChallanDetails", function () {
    console.log("View Challan Details button clicked");
    console.log("File Path:", AttacheChallanDetails);
    if (!AttacheChallanDetails) {
        toastr.error("Challan Details not uploaded");
        return;
    }
    let url = "/Attachment/ESIEPF/ChallanDetails/" + AttacheChallanDetails;
    window.open(url, "_blank");
});
$(document).on('click', '.view-file', function () {
    let fileName = $(this).data('file');
    let folder = $(this).data('folder');
    if (!fileName) {
        toastr.error("File not uploaded");
        return;
    }
    window.open( `/Attachment/${folder}/${fileName}`, "_blank" );
});


// Show/Hide Reject Remarks
$("input[name='VerificationStatus']").change(function () {

    if ($("#rdoReject").is(":checked")) {
        $("#rejectRemarksSection").slideDown(200);
    }
    else {
        $("#rejectRemarksSection").slideUp(200);
        $("#txtRejectRemarks").val("");
    }

});

// $("#btnSubmitVerification").click(function () {
//     let status = $("input[name='VerificationStatus']:checked").val();
//     if (!status) {
//         toastr.error("Please select Verify or Reject.");
//         return;
//     }
//     if (status === "R") {
//         let remarks = $("#txtRejectRemarks").val().trim();
//         if (remarks === "") {
//             toastr.error("Please enter reject remarks.");
//             $("#txtRejectRemarks").focus();
//             return;
//         }
//     }
//     // API Call
//     // SubmitRecord(status, $("#txtRejectRemarks").val());

// });

$("#btnSubmitVerification").click(async function () {

    let status = $("input[name='VerificationStatus']:checked").val();

    if (!status) {
        toastr.error("Please select Verify or Reject.");
        return;
    }

    let remarks = "";

    if (status === "R") {

        remarks = $("#txtRejectRemarks").val().trim();

        if (remarks === "") {
            toastr.error("Please enter reject remarks.");
            return;
        }
    }

    let formData = new FormData();

    formData.append("ChallanId", ChallanId);
    formData.append("IsVarified", status);
    formData.append("VerificationRemarks", remarks);

    try {

        let res = await acceptUpdate(
            "Manpower",
            "Verify_ESIEPFChallan",
            formData
        );

        if (res.success) {
            toastr.success(res.message);
            closeModal("myModal");
            recordlist();
        }
        else {
            toastr.error(res.message);
        }
    }
    catch (e) {
        console.log(e);
        toastr.error("Something went wrong.");
    }

});