using ClosedXML.Excel;
using Compass.Classes;
using Compass.Models.Filter;
using Compass.Models.Hardware;
using Compass.Models.ManpowerModel;
using Compass.Models.ManpowerViewModel;
using Compass.Models.Test;
using DocumentFormat.OpenXml.ExtendedProperties;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Wordprocessing;
using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System.Collections;
using System.Data;
using System.Net.Mail;
using System.Text;
using System.Text.Json;
using wfms_ddl;

namespace Compass.Controllers
{
    public class ManpowerInvoiceController : Controller
    {
        
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        private readonly string _connectionString;
        public ManpowerInvoiceController(ISqlDataAccess db, IMemoryCache cache, IConfiguration configuration)
        {
            _cn = db;
            _cache = cache;
            _connectionString = configuration.GetConnectionString("TestConnection");
        }
        public IActionResult Index()
        {
            return View();
        }

        #region PurchaseBillVerification
      public IActionResult PurchaseBillVerification()
        {
            return View();
        }
        // Get record for the Table List
        [HttpGet]
        public async Task<IActionResult> GetPurchaseBillRecord([FromQuery] PInvoiceFilter filter)

        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
               // parameters.Add("@Id", filter.Id);
                parameters.Add("@AgencyBillId", filter.Id);
                parameters.Add("@MonthId", filter.MonthId);
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@DeptId", filter.DeptId);
                parameters.Add("@PaymentStatus", filter.PaymentStatus);
              var dt = await _cn.FillDataTableAsync("TallyPurchaseVerification_List", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<PInvoiceViewModel>());

                var list = dt.AsEnumerable().Select(row => new PInvoiceViewModel

                {
                    Id = Convert.ToInt32(row["AgencyBillId"]?.ToString()),
                    DepartmentName = (row["departmentName"]?.ToString()),                 
                    AgencyName = (row["AgencyName"]?.ToString()),
                    AgencyBillNo = (row["Billno"]?.ToString()),
                    AttendanceCertificate = row["AttendanceCertificate"]?.ToString(),
                    AnnexureFile = row["AnnexureFile"]?.ToString(),
                    AgencyBillFile = row["UploadBill"]?.ToString(),
                    BillDate = row["CreatedDate1"]?.ToString(),
                    BillMonth = row["MonthYear"]?.ToString(),
                    VerificationStatus = row["IsPurchaseBillVerified"]?.ToString(),
                    IsSaleBIllGenerated = row["IsSaleBIllGenerated"]?.ToString(),
                    BillStatus = row["BillStatus"]?.ToString(),
                    //IsSaleBIllGenerated = row["IsSaleBIllGenerated"]?.ToString(),
                }).ToList();

                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }

        // Get record for Agency Bill Verification & HPSEDC Sale Bill
        [HttpGet]
        public async Task<IActionResult> GetAgencyInvoiceVerifyRecord([FromQuery] PInvoiceFilter filter)

        {
            var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
            var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@AgencyBillId", filter.Id);
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@DeptId", filter.DeptId);
                parameters.Add("@MonthId", filter.MonthId);
                parameters.Add("@MonthIdTo", filter.MonthIdTo);
                parameters.Add("@PaymentStatus", filter.PaymentStatus);
                parameters.Add("@EmpId", userId);
                parameters.Add("@UserRole", roleId);

                var dt = await _cn.FillDataTableAsync("TallyAgencyBill1_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<PInvoiceVerifyViewModel>());

                var list = dt.AsEnumerable().Select(row => new PInvoiceVerifyViewModel

                {
                    //Id = row["AgencyBillId"] != DBNull.Value ? Convert.ToInt32(row["AgencyBillId"]) : 0,
                    Id = Convert.ToInt32(row["AgencyBillId"]?.ToString()),
                    BillDate = (row["BillDate"]?.ToString()),
                    WorkOrderId = (row["WorkOrderNo"]?.ToString()),
                    SaleBillNo = (row["SaleBillNo"]?.ToString()),
                    AgencyBillNo = (row["Billno"]?.ToString()),
                    AgencyId = Convert.ToInt32(row["AgencyId"]?.ToString()),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    DeptId = Convert.ToInt32(row["DeptId"]?.ToString()),
                    DepartmentName = (row["departmentName"]?.ToString()),
                    //NoofResource = row["NoofResources"] != DBNull.Value ? Convert.ToInt32(row["NoofResources"]) : 0,
                    NoofResource = Convert.ToInt32(row["NoOfResource"]?.ToString()),
                    //BillingId = Convert.ToInt32(row["BillingId"]?.ToString()),
                    DeptBillingAdd = (row["DepartmentAddress"]?.ToString()),
                    BillMonth = (row["BillforMonth"]?.ToString()),
                    Description = (row["Description"]?.ToString()),
                    Narration = (row["Narration"]?.ToString()),
                    BasicBillAmt = Convert.ToDecimal(row["AgencyBillAmt"]?.ToString()),
                    AdminCharge = Convert.ToDecimal(row["AdminAmt"]?.ToString()),
                    LiveryCharge = Convert.ToDecimal(row["LibaryAmt"]?.ToString()),
                    InputCgst = Convert.ToDecimal(row["cgstAmt"]?.ToString()),
                    InputSgst = Convert.ToDecimal(row["SGSTAtm"]?.ToString()),
                    InputIgst = Convert.ToDecimal(row["IGSTAmt"]?.ToString()),
                    TotalAmt = Convert.ToDecimal(row["TotalAmt"]?.ToString()),


                }).ToList();

                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }


        //Submit Agency Bill Verification Update Purchase Bill 
        [HttpPost]
        public async Task<IActionResult> AddOrEdit_UpdatePInvoiceRecord([FromForm] UpdatePInvoiceModel model)
        {
            try
            {

                //var Id = model.Id;
                var Id = model.AgencyBillId;
                var billStatus = model.IsPurchaseBillVerified;
                var remarks = model.VerificationRemarks;
                var description = model.Description;
                var narration = model.Narration;
                var billDate = model.PurchaseBillDate;
                var billNo = model.AgencyBillNo;
                var userId = User.FindFirst("UserId")?.Value;
                SortedList parameters = new SortedList
                    {
                    { "@AgencyBillId", Id },
                    { "@IsPurchaseBillVerified", billStatus },
                    { "@VerificationRemarks", remarks },
                    { "@Description", description },
                    { "@Narration", narration },
                    { "@BillDate", billDate },
                    { "@Billno", billNo },                  
                    { "@createdby", userId }
                };
                var result = _cn.ExecuteNonQueryWMessage(
                    "TallyPurchaseVarification_AcceptUpdate",
                    "",
                    parameters
                );
                return Ok(new { success = true, message = result.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }

        //Submit HPSEDC Bill Sale Bill 
        [HttpPost]
        public async Task<IActionResult> AddOrEdit_UpdateSInvoiceRecord([FromForm] SInvoiceModel model)
        {
            try
            {
                //var Id = model.Id;
                var deptBillId = model.DeptBillId;
                var Id = model.Id;
                var workOrderNo = model.WorkOrderNo;
                var saleBillNo = model.SaleBillNo;
                var saleBillDate = model.SaleBillDate;
                var pBillNo = model.PBillNo;
                var monthYear = model.MonthYear;
                var agencyId = model.AgencyId;
                var deptId = model.DeptId;
                var gstNo = model.GSTNo;
                var pinNo = model.PinNo;
                var hsnCode = model.HsnCode;
                var billingId = model.BillingId;
                var billingAdd = model.BillingAdd;
                var description = model.Description;
                var narration = model.Narration;
                var agencyBillAmt = model.AgencyBillAmt;
                var adminAmt = model.AdminAmt;
                var libraryAmt = model.LibraryAmt;
                var cgst = model.CgstAmt;
                var sgst = model.SgstAmt;
                var totalAmt = model.TotalAmt;
                var paymentAmt = model.PaymentAmt;
                var balanceAmt = model.BalanceAmt;
                var isActive = model.IsActive;

                var userId = User.FindFirst("UserId")?.Value;
                SortedList parameters = new SortedList
                    {
                    { "@DeptBillId", deptBillId },
                    { "@AgencyBillId", Id },
                    { "@WorkOderNo", workOrderNo },
                    { "@SaleBillNo", saleBillNo },
                    { "@BillDate", saleBillDate },
                    { "@Billno", pBillNo },
                    { "@BillforMonth", monthYear },
                    { "@AgencyId", agencyId },
                    { "@DeptId", deptId },
                    { "@gstNo", gstNo },
                    { "@Pin", pinNo },
                    { "@BillingId", billingId },
                    { "@DepartmentAddress", billingAdd },
                    { "@Description", description },
                    { "@Narration", narration },
                    { "@AgencyBillAmt", agencyBillAmt },
                    { "@AdminAmt", adminAmt },
                    { "@LibaryAmt", libraryAmt },
                    { "@cgstAmt", cgst },
                    { "@SGSTAtm", sgst },
                    { "@HSN", hsnCode },
                    { "@TotalAmt", totalAmt },
                    { "@PaymentAmt", paymentAmt },
                    { "@BalanceAmt", balanceAmt },
                    { "@IsActive", isActive },
                    { "@createdby", userId }
                };

                var result = _cn.ExecuteNonQueryWMessage(
                    "TallyDepartmentBill_AcceptUpdate1",
                    "",
                    parameters
                );

                return Ok(new { success = true, message = result.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }

        //Submit Cancel Bill
        [HttpPost]
        public async Task<IActionResult> AddOrEdit_CancelSaleBillRecord([FromForm] CancelSaleBill model)
        {
            try
            {

                //var Id = model.Id;
                var Id = model.Id;
                var IsCancelBill = model.IsCancelBill ? "Y" : "N";
                var VerificationRemarks = model.VerificationRemarks;
                
                var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
               
                
                SortedList parameters = new SortedList
                    {
                    { "@AgencyBillId", Id },
                    { "@IsCancel", IsCancelBill },
                    { "@CancelBy", userId },
                    { "@CancelRemarks", VerificationRemarks },
                    
                };

                var result = _cn.ExecuteNonQueryWMessage(
                    "TallySaleBillCancel_AcceptUpdate",
                    "",
                    parameters
                );

                return Ok(new { success = true, message = result.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }


        #endregion


        #region NewInvoice
        public IActionResult NewInvoice()
        {
            return View();
        }

        // Get record for the Table List for Dept. Payment & Agency Payment
        [HttpGet]
        public async Task<IActionResult> GetAgencyBillRecord([FromQuery] AgencyInvFilter filter)

        {
            try
            {
                var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
                var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");

                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@AgencyBillId", filter.AgencyBillId);
                parameters.Add("@EmpId", userId);
                parameters.Add("@UserRole",roleId);
                parameters.Add("@MonthId", filter.MonthId);
                parameters.Add("@MonthIdTo", filter.MonthIdTo);
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@DeptId", filter.DeptId);
                parameters.Add("@PaymentStatus", filter.PaymentStatus);
                parameters.Add("@PageNo", filter.PageNo);
                parameters.Add("@PageSize", filter.PageSize);
                parameters.Add("@SearchTerm", DBNull.Value);
               
                var dt = await _cn.FillDataTableAsync("TallyAgencyBill1_List_optimized", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<AgencyInvViewModel>());

                var list = dt.AsEnumerable().Select(row => new AgencyInvViewModel

                {
                    AgencyBillId = Convert.ToInt32(row["AgencyBillId"]?.ToString()),
                    DeptId = Convert.ToInt32(row["DeptId"]?.ToString()),
                    DeptName = (row["DepartmentName"]?.ToString()),
                    DeptAdd = (row["DepartmentAddress"]?.ToString()),
                    AgencyId = Convert.ToInt32(row["AgencyId"]?.ToString()),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    SaleBillNo = (row["SaleBillNo"]?.ToString()),
                    PurchaseBillNo = (row["Billno"]?.ToString()),
                    SaleBillAmt = Convert.ToDecimal(row["TotalAmt"]??0),//.ToString()),
                    SaleBillDate = row["SaleBillDate"]?.ToString(),
                    //AgencyBillAmt = Convert.ToDecimal(row["AgencyBillAmt"] ?? 0),

                }).ToList();

                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }

        // Get record for Dept. Payment Modal
        [HttpGet]
        public async Task<IActionResult> GetAgencyInvoiceDeptPaymentRecord([FromQuery] AgencyInvFilter filter)

        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@AgencyBillId", filter.AgencyBillId);
               
                var dt = await _cn.FillDataTableAsync("TallyDepartmentBill_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<AgencyInvDeptPayViewModel>());

                var list = dt.AsEnumerable().Select(row => new AgencyInvDeptPayViewModel

                {
                    AgencyBillId = Convert.ToInt32(row["AgencyBillId"]?.ToString()),
                    PurchaseBillNo = (row["Billno"]?.ToString()),
                    PurchaseBillDate = (row["PurchaseBillDate"]?.ToString()),
                    SaleBillNo = (row["SaleBillNo"]?.ToString()),
                    SaleBillDate = (row["BillDate"]?.ToString()),
                    SaleBillAmt = Convert.ToDecimal(row["TotalAmt"]?.ToString()),
                    DeptId = Convert.ToInt32(row["DeptId"]?.ToString()),
                    DeptName = (row["departmentName"]?.ToString()),
                    DeptAdd = (row["DepartmentAddress"]?.ToString()),
                    AgencyId = Convert.ToInt32(row["AgencyId"]?.ToString()),
                    AgencyName = (row["AgencyName"]?.ToString()),

                }).ToList();

                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }

        //Submit Dept. Payment 
        [HttpPost]
        public async Task<IActionResult> AddOrEdit_DeptPaymentRecord([FromForm] DeptPaymentModel model)
        {
            try
            {
                var receiptId = model.ReceiptiId;
                var departmentBillId = model.DepatrtmentBillId;
                var agencyBillId = model.AgencyBillId;
                var transactionId = model.TransactionId;
                var modeOfPayment = model.ModeofPayment;
                var bankNameId = model.BankNameId;
                var narration = model.Narration;
                var receivedDate = model.ReceivedDate;
                var receivedAmt = model.ReceivedAmt;
                var gstTds = model.Gsttds;
                var tds = model.Tds;
                
                var userId = User.FindFirst("UserId")?.Value;

                SortedList parameters = new SortedList
                    {
                    { "@ReceiptId", receiptId },
                    { "@DepartmentBillId", departmentBillId },
                    { "@AgencyBillId", agencyBillId },
                    { "@TransactionId", transactionId  },
                    { "@ModeOfPayment", modeOfPayment },
                    { "@BankNameId", bankNameId },
                    { "@Narration", narration },
                    { "@ReceivedDate", receivedDate },
                    { "@ReceivedAmt", receivedAmt },
                    { "@GSTTds2", gstTds },
                    { "@Tds2", tds },
                    
                    { "@CreatedBy", userId }
                };

                var result = _cn.ExecuteNonQueryWMessage(
                    "TallyReceivedPayment_AcceptUpdate",
                    "",
                    parameters
                );

                return Ok(new { success = true, message = result.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }


        // Get record for Payment list for Partial Payment & View Payment in Table
        [HttpGet]
        public async Task<IActionResult> GetPaymentReceivedRecord([FromQuery] AgencyInvFilter filter)

        {
            try
            {
               

                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@ReceiptId", filter.ReceiptId);
                parameters.Add("@DepartmentBillId", filter.DepartmentBillId);
                parameters.Add("@AgencyBillId", filter.AgencyBillId);
               

                var dt = await _cn.FillDataTableAsync("TallyReceivedPaymentTransaction_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<AgencyInvPaymentListViewModel>());

                var list = dt.AsEnumerable().Select(row => new AgencyInvPaymentListViewModel

                {

                    ReceiptId = Convert.ToInt32(row["ReceiptId"]?.ToString()),
                    AgencyBillId = Convert.ToInt32(row["AgencyBillId"]?.ToString()),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    TransactionId = (row["TransactionId"]?.ToString()),
                    PaymentMode = (row["ModeOfPayment"]?.ToString()),
                    BankName = (row["ModeOfPayment"]?.ToString()),
                    SaleBillNo = (row["SaleBillNo"]?.ToString()),
                    SaleBillAmt = Convert.ToDecimal(row["BillAmount"]?.ToString()),
                    ReceivedAmt = Convert.ToDecimal(row["totalReceivedAmt"]?.ToString()),
                    ReceivedDate = (row["ReceivedDate"]?.ToString()),
                    GstTds = Convert.ToDecimal(row["GSTTds2"]?.ToString()),
                    Tds = Convert.ToDecimal(row["Tds2"]?.ToString()),
                    DueBalance = Convert.ToDecimal(row["DuesAmt"]?.ToString()),
                    Narration = (row["Narration"]?.ToString()),
                    


                }).ToList();

                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }

        #endregion

        #region Dispatch
        public IActionResult Dispatch()
        {
            return View();
        }

        // Get record for the List
        [HttpGet]
        public async Task<IActionResult> GetDispatchDetailRecord([FromQuery] DispatchFilter filter)
        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@DeptBillId", filter.DeptBillId);
                parameters.Add("@MonthYear", filter.MonthYear);
                parameters.Add("@PageNumber", filter.PageNumber);
                parameters.Add("@PageSize", filter.PageSize);
                parameters.Add("@SearchTerm", filter.SearchTerm);
                               
                
                var dt = await _cn.FillDataTableAsync("TallyDispatchInv_List_Optimized", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DipsatchListViewModel>());
                var list = dt.AsEnumerable().Select(row => new DipsatchListViewModel
                {
                    DeptBillId = (row["DeptBillId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DeptBillId"].ToString()))
                    ? 0 : Convert.ToInt32(row["DeptBillId"]),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    AgencyBillNo = (row["AgencyBillNo"]?.ToString()),
                    SaleBillNo = (row["SaleBillNo"]?.ToString()),
                    BillFormonth = (row["BillforMonth"] == DBNull.Value || string.IsNullOrWhiteSpace(row["BillforMonth"].ToString()))
                    ? 0 : Convert.ToInt32(row["BillforMonth"]),
                    DispatchStatus = (row["IsDispatched"]?.ToString()),
                    DeptAddress = (row["DepartmentAddress"]?.ToString()),
                    DispatchNo = (row["DispatchNo"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DispatchNo"].ToString()))
                    ? 0 : Convert.ToInt32(row["DispatchNo"]),    
                }).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }

        // Get record for Fill Dispatch details Modal
        [HttpGet]
        public async Task<IActionResult> GetDispatchDetailModal([FromQuery] DispatchFilter filter)
        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@DeptBillId", filter.DeptBillId);
                parameters.Add("@MonthYear", filter.MonthYear);
                
                var dt = await _cn.FillDataTableAsync("TallyDispatchInv_List", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DipsatchListViewModel>());
                var list = dt.AsEnumerable().Select(row => new DipsatchListViewModel
                {
                    DeptBillId = (row["DeptBillId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DeptBillId"].ToString()))
                    ? 0 : Convert.ToInt32(row["DeptBillId"]),
                    SaleBillNo = (row["SaleBillNo"]?.ToString()),
                    DeptName = (row["departmentName"]?.ToString()),
                    DeptAddress = (row["DepartmentAddress"]?.ToString()),
                    DispatchNo = (row["DispatchNo1"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DispatchNo1"].ToString()))
                    ? 0 : Convert.ToInt32(row["DispatchNo1"]),
                }).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }

        //Submit Dept. Payment 
        [HttpPost]
        public async Task<IActionResult> AddOrEdit_DispatchRecord([FromForm] DispatchModel model)
        {
            try
            {
                var dispatchId = model.DispatchId;
                var deptBillId = model.DeptBillId;
                var dispatchNo = model.DispatchNo;
                var officeAddressId = model.OfficeAddressId;
                var officeAdddress = model.OfficeAdddress;
                
                var userId = User.FindFirst("UserId")?.Value;

                SortedList parameters = new SortedList
                    {
                    { "@DispatchId", dispatchId },
                    { "@DeptBIllId", deptBillId },
                    { "@DispatchNo", dispatchNo },
                    { "@OfficeAddressId", officeAddressId  },
                    { "@OfficeAdddress", officeAdddress },
                    { "@DisptchBy", userId },
            };

                var result = _cn.ExecuteNonQueryWMessage(
                    "TallyDispatchInv_AcceptUpdate",
                    "",
                    parameters
                );

                return Ok(new { success = true, message = result.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }



        #endregion

        #region TallyAgencyPayment

        public IActionResult TallyAgencyPayment()
        {
            return View();
        }

        // Get record for Agency Payment & Partial Payment Modal
        [HttpGet]
        public async Task<IActionResult> GetAgencyInvoicePartialPaymentRecord([FromQuery] AgencyInvFilter filter)

        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@AgencyBillId", filter.AgencyBillId);

                var dt = await _cn.FillDataTableAsync("TallyAgencyBillPaymentPartial_Get", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<AgencyInvDeptPayViewModel>());

                var list = dt.AsEnumerable().Select(row => new AgencyInvDeptPayViewModel

                {
                    AgencyBillId = Convert.ToInt32(row["AgencyBillId"]?.ToString()),
                    PurchaseBillNo = (row["Billno"]?.ToString()),
                    PurchaseBillDate = (row["BillDate"]?.ToString()),
                    SaleBillNo = (row["SaleBillNo"]?.ToString()),
                    SaleBillDate = (row["SaleBillDate"]?.ToString()),
                    SaleBillAmt = Convert.ToDecimal(row["SaleBillAmount"]?.ToString()),
                    DeptId = Convert.ToInt32(row["DeptId"]?.ToString()),
                    DeptName = (row["departmentName"]?.ToString()),
                    DeptAdd = (row["DepartmentAddress"]?.ToString()),
                    AgencyId = Convert.ToInt32(row["AgencyId"]?.ToString()),
                    AgencyName = (row["AgencyName"]?.ToString()),

                }).ToList();

                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }

        //Submit Agency Payment 
        [HttpPost]
        public async Task<IActionResult> AddOrEdit_AgencyPaymentRecord([FromForm] AgencyPaymentModel model)
        {
            try
            {
               // var receiptId = model.ReceiptiId;
                //var departmentBillId = model.DepatrtmentBillId;
                var agencyBillId = model.AgencyBillId;
                var transactionId = model.TransactionId;
                var modeOfPayment = model.ModeofPayment;
                var narration = model.Narration;
                var receivedDate = model.ReceivedDate;
                var receivedAmt = model.ReceivedAmt;
                var gstTds = model.Gsttds;
                var tds1 = model.Tds1;
                var tds2 = model.Tds2;

                var userId = User.FindFirst("UserId")?.Value;

                SortedList parameters = new SortedList
                    {
                   
                    { "@PaymentId", 0 },
                    { "@AgencyBillId", agencyBillId },
                    { "@TransactionId", transactionId  },
                    { "@ModeOfPayment", modeOfPayment },
                    { "@Narration", narration },
                    { "@PaymentDate", receivedDate },
                    { "@PaymentAmt", receivedAmt },
                    { "@GstTds2", gstTds },
                    { "@Tds1", tds1 },
                    { "@Tds2", tds2},

                    { "@CreatedBy", userId }
                };

                var result = _cn.ExecuteNonQueryWMessage(
                    "TallyAgencyPayment_AcceptUpdate",
                    "",
                    parameters
                );

                return Ok(new { success = true, message = result.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }

        //Submit Agency Partial Payment 
        [HttpPost]
        public async Task<IActionResult> AddOrEdit_AgencyPartialPaymentRecord([FromForm] AgencyPaymentModel model)
        {
            try
            {
                // var receiptId = model.ReceiptiId;
                //var departmentBillId = model.DepatrtmentBillId;
                var agencyBillId = model.AgencyBillId;
                var transactionId = model.TransactionId;
                var modeOfPayment = model.ModeofPayment;
                var narration = model.Narration;
                var receivedDate = model.ReceivedDate;
                var receivedAmt = model.ReceivedAmt;
                var gstTds = model.Gsttds;
                var tds1 = model.Tds1;
                var tds2 = model.Tds2;

                var userId = User.FindFirst("UserId")?.Value;

                SortedList parameters = new SortedList
                    {

                    { "@PaymentId", 0 },
                    { "@AgencyBillId", agencyBillId },
                    { "@TransactionId", transactionId  },
                    { "@ModeOfPayment", modeOfPayment },
                    { "@Narration", narration },
                    { "@PaymentDate", receivedDate },
                    { "@PaymentAmt", receivedAmt },
                    { "@GstTds2", gstTds },
                    { "@Tds1", tds1 },
                    { "@Tds2", tds2},

                    { "@CreatedBy", userId }
                };

                var result = _cn.ExecuteNonQueryWMessage(
                    "TallyAgencyPaymentPatrial_AcceptUpdate",
                    "",
                    parameters
                );

                return Ok(new { success = true, message = result.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }


        // Get record for Payment list for Table in Partial Payment
        [HttpGet]
        public async Task<IActionResult> GetAgencyPaymentReceivedRecord([FromQuery] AgencyInvFilter filter)

        {
            try
            {


                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@AgencyBillId", filter.AgencyBillId);


                var dt = await _cn.FillDataTableAsync("TallyAgencyParymentTransaction_get", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<AgencyPartialPayListViewModel>());

                var list = dt.AsEnumerable().Select(row => new AgencyPartialPayListViewModel

                {

                    AgencyBillId = Convert.ToInt32(row["AgencyBillId"]?.ToString()),
                    TransactionId = (row["TransactionId"]?.ToString()),
                    PaymentMode = (row["ModeOfPayment"]?.ToString()),
                    ReceivedDate = (row["PaymentDate"]?.ToString()),
                    GstTds = decimal.TryParse(row["GSTTds2"]?.ToString(), out var gst) ? gst : 0,
                    //Convert.ToDecimal(row["GSTTds2"]?.ToString()),
                    Tds1 = decimal.TryParse(row["Tds1"]?.ToString(), out var tds1) ? tds1 : 0,
                    //Convert.ToDecimal(row["Tds1"]?.ToString()),
                    Tds2 = decimal.TryParse(row["Tds2"]?.ToString(), out var tds2) ? tds2 : 0,
                    //Convert.ToDecimal(row["Tds2"]?.ToString()),
                    PaymentAmt = decimal.TryParse(row["PaymentAmt"]?.ToString(), out var pay) ? pay : 0,
                    //Convert.ToDecimal(row["PaymentAmt"]?.ToString()),
                    DueBalance = decimal.TryParse(row["BalanceAmt"]?.ToString(), out var bal) ? bal : 0,
                    //Convert.ToDecimal(row["BalanceAmt"]?.ToString()),
                    Narration = (row["Narration"]?.ToString()),



                }).ToList();

                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }


        // Get record for Payment list for View Table
        [HttpGet]
        public async Task<IActionResult> GetAgencyPaymentRecord([FromQuery] AgencyInvFilter filter)

        {
            try
            {


                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@PaymentId", 0);
                parameters.Add("@AgencyBillId", filter.AgencyBillId);


                var dt = await _cn.FillDataTableAsync("TallyAgencyPaymentTransaction_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<AgencyPartialPayListViewModel>());

                var list = dt.AsEnumerable().Select(row => new AgencyPartialPayListViewModel

                {

                    PaymentId = Convert.ToInt32(row["PaymentId"]?.ToString()),
                    AgencyBillId = Convert.ToInt32(row["AgencyBillId"]?.ToString()),
                    TransactionId = (row["TransactionId"]?.ToString()),
                    PaymentMode = (row["ModeOfPayment"]?.ToString()),
                    Narration = (row["Narration"]?.ToString()),
                    PaymentAmt = decimal.TryParse(row["totalReceivedAmt"]?.ToString(), out var pay) ? pay : 0,
                    //Convert.ToDecimal(row["PaymentAmt"]?.ToString()),
                    Tds2 = decimal.TryParse(row["ItTds"]?.ToString(), out var tds2) ? tds2 : 0,
                    //Convert.ToDecimal(row["Tds2"]?.ToString()),
                    GstTds = decimal.TryParse(row["GSTTds2"]?.ToString(), out var gst) ? gst : 0,
                    //Convert.ToDecimal(row["GSTTds2"]?.ToString()),
                    DueBalance = decimal.TryParse(row["DuesAmt"]?.ToString(), out var duebalane) ? duebalane : 0,
                    //Tds1 = decimal.TryParse(row["Tds1"]?.ToString(), out var tds1) ? tds1 : 0,
                    //Convert.ToDecimal(row["Tds1"]?.ToString()),
                    ReceivedDate = (row["PaymentDate"]?.ToString()),




                }).ToList();

                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error.",
                    error = ex.Message
                });
            }
        }
        #endregion
    }

}
