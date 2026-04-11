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



                    //MonthYear = Convert.ToInt32(row["MonthYear"]?.ToString()),


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
        //[HttpGet]
        //public async Task<IActionResult> GetAgencyInvoiceVerifyRecord1([FromQuery] PInvoiceFilter filter)

        //{
        //    try
        //    {
        //        // Access as object
        //        SortedList parameters = new SortedList();
        //        parameters.Add("@AgencyBillId", filter.Id);

        //        var dt = await _cn.FillDataTableAsync("TallyDeptBill_ListGet1", "", parameters);

        //        if (dt == null || dt.Rows.Count == 0)
        //            return Ok(new List<PInvoiceVerifyViewModel>());

        //        var list = dt.AsEnumerable().Select(row => new PInvoiceVerifyViewModel

        //        {
        //            Id = Convert.ToInt32(row["AgencyBillId"]?.ToString()),
        //            BillDate = (row["BillDate"]?.ToString()),
        //            WorkOrderId = (row["WorkOrderNo"]?.ToString()),
        //            //PurchaseBillNo = (row["DeptBillNO"]?.ToString()),
        //            AgencyBillNo = (row["Billno"]?.ToString()),
        //            AgencyId = Convert.ToInt32(row["AgencyId"]?.ToString()),
        //            AgencyName = (row["AgencyName"]?.ToString()),
        //            DeptId = Convert.ToInt32(row["DeptId"]?.ToString()),
        //            DepartmentName = (row["departmentName"]?.ToString()),
        //            NoofResources = Convert.ToInt32(row["DeptId"]?.ToString()),
        //            BillingId = Convert.ToInt32(row["BillingId"]?.ToString()),
        //            DeptBillingAdd = (row["DepartmentAddress"]?.ToString()),
        //            BillMonth = (row["BillforMonth"]?.ToString()),
        //            Description = (row["Description"]?.ToString()),
        //            Narration = (row["Narration"]?.ToString()),
        //            BasicBillAmt = Convert.ToDecimal(row["AgencyBillAmt"]?.ToString()),
        //            AdminCharge = Convert.ToDecimal(row["AdminAmt"]?.ToString()),
        //            LiveryCharge = Convert.ToDecimal(row["LibaryAmt"]?.ToString()),
        //            InputCgst = Convert.ToDecimal(row["cgstAmt"]?.ToString()),
        //            InputSgst = Convert.ToDecimal(row["SGSTAtm"]?.ToString()),
        //            TotalAmt = Convert.ToDecimal(row["TotalAmt"]?.ToString()),
                    

        //        }).ToList();

        //        return Ok(list);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new
        //        {
        //            success = false,
        //            message = "Server error.",
        //            error = ex.Message
        //        });
        //    }
        //}

        [HttpGet]
        public async Task<IActionResult> GetAgencyInvoiceVerifyRecord([FromQuery] PInvoiceFilter filter)

        {
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
                parameters.Add("@EmpId", filter.CreatedBy);
                parameters.Add("@UserRole", filter.UserRole);

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
                var agencyBillId = model.Id;
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
                    { "@AgencyBillId", agencyBillId },
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




        #endregion


        #region NewInvoice
        public IActionResult NewInvoice()
        {
            return View();
        }

        // Get record for the Table List
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


        // Get record for Payment list for Partial Payment & View Payment
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


    }

}
