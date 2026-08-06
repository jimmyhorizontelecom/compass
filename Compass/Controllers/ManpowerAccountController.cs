//using ClosedXML.Excel;
//using ExcelDataReader;
using Compass.Classes;
using Compass.Models.ManpowerModel;
using Compass.Models.ManpowerViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
//using Newtonsoft.Json;
using System.Collections;
using System.Data;
//using static Azure.Core.HttpHeader;
//using DocumentFormat.OpenXml.Spreadsheet;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using wfms_ddl;


namespace Compass.Controllers
{

    public class ManpowerAccountController : Controller
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        private readonly string _connectionString;
        public ManpowerAccountController(ISqlDataAccess db, IMemoryCache cache, IConfiguration configuration)
        {
            _cn = db;
            _cache = cache;
            _connectionString = configuration.GetConnectionString("TestConnection");
        }


        #region Debit Notes
        public IActionResult DebitNotes()
        {
            return View();
        }

        // Get record for the Table List
        [HttpGet]
        public async Task<IActionResult> GetDebitNotesRecord([FromQuery] DebitNotesFilter filter)

        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                // parameters.Add("@Id", filter.Id);
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@MonthYear", filter.MonthYear);
                parameters.Add("@AgencyBillId", filter.AgencyBillId);
               parameters.Add("@Filter",  filter.Status);
               
                var dt = await _cn.FillDataTableAsync("tallyAgencyBillDebitList_List", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DebitNotesViewModel>());

                var list = dt.AsEnumerable().Select(row => new DebitNotesViewModel

                {
                    AgencyBillId = (row["AgencyBillId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyBillId"].ToString()))
                    ? 0 : Convert.ToInt32(row["AgencyBillId"]),
                    AgencyId = (row["AgencyId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyId"].ToString()))
                    ? 0 : Convert.ToInt32(row["AgencyId"]),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    InvoiceNo = (row["SaleBillNo"]?.ToString()),
                    InvoiceDate =Convert.ToDateTime (row["SBillDAte"]?.ToString()),
                    BillAmount = (row["SaleBillAmt"]?.ToString()),
                    DebitNotesNo = (row["DebitNotesNo"]?.ToString()),
                    DebitAmount = (row["DebitNotesAmtDr"]?.ToString()),
                    IsDebitNotes = Convert.ToChar(row["IsDebitNotes"]?.ToString()),

                    
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


        // Get record for the Debit Note Modal
        [HttpGet]
        public async Task<IActionResult> GetDebitNoteBillRecord([FromQuery] DebitNotesFilter filter)

        {
           try
            {
                // Access as object
                SortedList parameters = new SortedList();
                //parameters.Add("@AgencyBillId", filter.AgencyBillId);
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@MonthYear", filter.MonthYear);
                parameters.Add("@AgencyBillId", filter.AgencyBillId);
                parameters.Add("@Filter", filter.Status);
                var dt = await _cn.FillDataTableAsync("tallyAgencyBillDebitList_List", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DebitNotesBillViewModel>());
                var list = dt.AsEnumerable().Select(row => new DebitNotesBillViewModel
                {
                    AgencyBillId = (row["AgencyBillId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyBillId"].ToString()))
                    ? 0 : Convert.ToInt32(row["AgencyBillId"]),
                    AgencyId = (row["AgencyId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyId"].ToString()))
                    ? 0 : Convert.ToInt32(row["AgencyId"]),
                    //AgencyId = Convert.ToInt32(row["AgencyId"]?.ToString()),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    DeptId = (row["DeptId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DeptId"].ToString()))
                    ? 0 : Convert.ToInt32(row["DeptId"]),
                    //AgencyId = Convert.ToInt32(row["AgencyId"]?.ToString()),
                    DeptName = (row["departmentName"]?.ToString()),
                    DeptAddress = (row["BillingAddress"]?.ToString()),
                    DebitNoteNo = (row["AutoDebitNoteNo"]?.ToString()),
                    PurchaseBillNo = (row["Billno"]?.ToString()),
                    PurchaseBillDate = (row["BillDate"]?.ToString()),
                    SaleBillNo = (row["SaleBillNo"]?.ToString()),
                    PurchaseBillAmt = (row["AgencyBillAmt"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyBillAmt"].ToString()))
                    ? 0 : Convert.ToInt32(row["AgencyBillAmt"]),
                    AdminChg = (row["AdminAmt"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AdminAmt"].ToString()))
                    ? 0 : Convert.ToInt32(row["AdminAmt"]),
                    LibraryChg = (row["LibaryAmt"] == DBNull.Value || string.IsNullOrWhiteSpace(row["LibaryAmt"].ToString()))
                    ? 0 : Convert.ToInt32(row["LibaryAmt"]),
                    OutCgst = (row["cgstAmt"] == DBNull.Value || string.IsNullOrWhiteSpace(row["cgstAmt"].ToString()))
                    ? 0 : Convert.ToInt32(row["cgstAmt"]),
                    OutSgst = (row["SGSTAtm"] == DBNull.Value || string.IsNullOrWhiteSpace(row["SGSTAtm"].ToString()))
                    ? 0 : Convert.ToInt32(row["SGSTAtm"]),
                    GTotal = (row["STotal"] == DBNull.Value || string.IsNullOrWhiteSpace(row["STotal"].ToString()))
                    ? 0 : Convert.ToInt32(row["STotal"]),

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

        // Submit data 
        [HttpPost]
        public async Task<IActionResult> AddOrEditDebitNote([FromForm] DebitNotesModel model)
        {
            var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
           // var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
            try
            {
                IFormFile attachmentFile1 = model.Attachment;
                // File Required Validation
                if (attachmentFile1 == null || attachmentFile1.Length == 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Agency Credit Note file is required."
                    });
                }
                string agencyCreditNoteFile = "";
                if (attachmentFile1.Length > 0)
                {
                    string folderPath = Path.Combine( Directory.GetCurrentDirectory(),
                        "wwwroot", "Attachment", "DebitNote", "AgencyCreditNote"
                    );
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    string extension = Path.GetExtension(attachmentFile1.FileName);
                    // File Name
                    agencyCreditNoteFile =
                        $"{DateTime.Now:yyyyMMddHHmmss}{extension}";
                    string filePath = Path.Combine(folderPath, agencyCreditNoteFile);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile1.CopyToAsync(stream);
                    }
                }

                SortedList parameters = new SortedList();
                parameters.Add("@DebitNotesId", model.DebitNotesId);
                parameters.Add("@AgencyBillId", model.AgencyBillId);
                parameters.Add("@DebitNotesNo", model.DebitNoteNo);
                parameters.Add("@PurchaseBillAmt", model.PurchaseBillAmt);
                parameters.Add("@AdminCharge", model.AdminChg);
                parameters.Add("@CgstAmt", model.OutCgst);
                parameters.Add("@SgstAmt", model.OutSgst);
                parameters.Add("@IgstAmt", model.OutIgst);
                parameters.Add("@LibraryAmt", model.LibraryChg);
                parameters.Add("@DrAmount", model.GTotal);
                parameters.Add("@DebitNoteRemarks", model.Remarks);
                parameters.Add("@Attachment", agencyCreditNoteFile);
                parameters.Add("@DebitNoteDate", model.DebitNoteDate);
               
                parameters.Add("@CreatedBy", userId);

                var result = _cn.ExecuteNonQueryWMessage(
                    "TallDebitNotes_AcceptUpdate",
                    "",
                    parameters
                );

                return Ok(new
                {
                    success = true,
                    message = result.ToString()
                });
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


        #region Credit Notes
        public IActionResult CreditNotes()
        {
            return View();
        }

        // Get record for the Table List
        [HttpGet]
        public async Task<IActionResult> GetCreditNotesRecord([FromQuery] CreditNotesFilter filter)

        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                // parameters.Add("@Id", filter.Id);
                parameters.Add("@DeptId", filter.DeptId);
                parameters.Add("@MonthYear", filter.MonthYear);
                parameters.Add("@AgencyBillId", filter.AgencyBillId);
                parameters.Add("@Filter", filter.Status);

                var dt = await _cn.FillDataTableAsync("tallyDeptBillDebitList_List", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<CreditNotesViewModel>());

                var list = dt.AsEnumerable().Select(row => new CreditNotesViewModel

                {
                    AgencyBillId = (row["AgencyBillId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyBillId"].ToString()))
                    ? 0 : Convert.ToInt32(row["AgencyBillId"]),
                    DeptBillId = (row["DeptBillId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DeptBillId"].ToString()))
                    ? 0 : Convert.ToInt32(row["DeptBillId"]),
                    DeptId = (row["departmentID"] == DBNull.Value || string.IsNullOrWhiteSpace(row["departmentID"].ToString()))
                    ? 0 : Convert.ToInt32(row["departmentID"]),
                    DeptName = (row["departmentName"]?.ToString()),
                    DebitNotesNo = (row["DebitNotesNo"]?.ToString()),
                    Remarks = (row["DebitNoteRemarks"]?.ToString()),
                    AgenycBillNo = (row["Billno"]?.ToString()),
                    HPSEDCBillNo = (row["SaleBillNo"]?.ToString()),
                    BillAmt = (row["SaleBillAmt"]?.ToString()),
                    CreditNoteNo =(row["CreditNotesNo"]?.ToString()),
                    CreditAmt = (row["CreditNotesAmtDr"]?.ToString()),
                    IsCreditNotes = Convert.ToChar(row["IsCreditNotes"]?.ToString()),

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


        // Get record for the Debit Note Modal
        [HttpGet]
        public async Task<IActionResult> GetCreditNoteBillRecord([FromQuery] CreditNotesFilter filter)

        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                //parameters.Add("@AgencyBillId", filter.AgencyBillId);
                parameters.Add("@DeptId", filter.DeptId);
                parameters.Add("@MonthYear", filter.MonthYear);
                parameters.Add("@AgencyBillId", filter.AgencyBillId);
                parameters.Add("@Filter", filter.Status);
                var dt = await _cn.FillDataTableAsync("tallyDeptBillDebitList_List", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<CreditNotesBillViewModel>());
                var list = dt.AsEnumerable().Select(row => new CreditNotesBillViewModel
                {
                    AgencyBillId = (row["AgencyBillId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyBillId"].ToString()))
                    ? 0 : Convert.ToInt32(row["AgencyBillId"]),
                    DeptBillId = (row["DeptBillId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DeptBillId"].ToString()))
                    ? 0 : Convert.ToInt32(row["DeptBillId"]),
                    DeptId = (row["DeptId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DeptId"].ToString()))
                    ? 0 : Convert.ToInt32(row["DeptId"]),
                    //AgencyId = Convert.ToInt32(row["AgencyId"]?.ToString()),
                    DeptName = (row["departmentName"]?.ToString()),
                    DeptAddress = (row["BillingAddress"]?.ToString()),
                    CreditNoteNo = (row["AutoDebitNoteNo"]?.ToString()),
                    SaleBillNo = (row["Billno"]?.ToString()),
                    CreditNoteDate = (row["BillDate"]?.ToString()),
                   PurchaseBillAmt = (row["AgencyBillAmt"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyBillAmt"].ToString()))
                    ? 0 : Convert.ToInt32(row["AgencyBillAmt"]),
                    AdminChg = (row["AdminAmt"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AdminAmt"].ToString()))
                    ? 0 : Convert.ToInt32(row["AdminAmt"]),
                    LibraryChg = (row["LibaryAmt"] == DBNull.Value || string.IsNullOrWhiteSpace(row["LibaryAmt"].ToString()))
                    ? 0 : Convert.ToInt32(row["LibaryAmt"]),
                    OutCgst = (row["cgstAmt"] == DBNull.Value || string.IsNullOrWhiteSpace(row["cgstAmt"].ToString()))
                    ? 0 : Convert.ToInt32(row["cgstAmt"]),
                    OutSgst = (row["SGSTAtm"] == DBNull.Value || string.IsNullOrWhiteSpace(row["SGSTAtm"].ToString()))
                    ? 0 : Convert.ToInt32(row["SGSTAtm"]),
                    GTotal = (row["STotal"] == DBNull.Value || string.IsNullOrWhiteSpace(row["STotal"].ToString()))
                    ? 0 : Convert.ToInt32(row["STotal"]),

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

        // Submit data 
        [HttpPost]
        public async Task<IActionResult> AddOrEditCreditNote([FromForm] CreditNotesModel model)
        {
            var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
            // var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
            try
            {
                //IFormFile attachmentFile1 = model.Attachment;
                //// File Required Validation
                //if (attachmentFile1 == null || attachmentFile1.Length == 0)
                //{
                //    return BadRequest(new
                //    {
                //        success = false,
                //        message = "Agency Credit Note file is required."
                //    });
                //}
                //string agencyCreditNoteFile = "";
                //if (attachmentFile1.Length > 0)
                //{
                //    string folderPath = Path.Combine(Directory.GetCurrentDirectory(),
                //        "wwwroot", "Attachment", "DebitNote", "AgencyCreditNote"
                //    );
                //    if (!Directory.Exists(folderPath))
                //    {
                //        Directory.CreateDirectory(folderPath);
                //    }
                //    string extension = Path.GetExtension(attachmentFile1.FileName);
                //    // File Name
                //    agencyCreditNoteFile =
                //        $"{DateTime.Now:yyyyMMddHHmmss}{extension}";
                //    string filePath = Path.Combine(folderPath, agencyCreditNoteFile);
                //    using (var stream = new FileStream(filePath, FileMode.Create))
                //    {
                //        await attachmentFile1.CopyToAsync(stream);
                //    }
                //}

                SortedList parameters = new SortedList();
                parameters.Add("@CreditNotesId", model.CreditNotesId);
                parameters.Add("@DeptBillId", model.DeptBillId);
                parameters.Add("@CreditNotesNo", model.CreditNotesNo);
                parameters.Add("@CreditNoteDate", model.CreditNoteDate);
                parameters.Add("@SaleBillAmt", model.SaleBillAmt);
                parameters.Add("@AdminCharge", model.AdminChg);
                parameters.Add("@CgstAmt", model.OutCgst);
                parameters.Add("@SgstAmt", model.OutSgst);
                parameters.Add("@IgstAmt", model.OutIgst);
                parameters.Add("@LibraryAmt", model.LibraryChg);
                parameters.Add("@CrAmount", model.GTotal);
                parameters.Add("@CreditNoteRemarks", model.Remarks);

                parameters.Add("@CreatedBy", userId);

                var result = _cn.ExecuteNonQueryWMessage(
                    "TallCreditNotes_AcceptUpdate",
                    "",
                    parameters
                );

                return Ok(new
                {
                    success = true,
                    message = result.ToString()
                });
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
