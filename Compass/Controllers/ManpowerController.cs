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
    public class ManpowerController : Controller
    {
            //private readonly ISqlDataAccess _cn;
            //private readonly IMemoryCache _cache;
            private readonly ISqlDataAccess _cn;
            private readonly IMemoryCache _cache;
            private readonly string _connectionString;
            public ManpowerController(ISqlDataAccess db, IMemoryCache cache, IConfiguration configuration)
            {
                _cn = db;
                _cache = cache;
                _connectionString = configuration.GetConnectionString("TestConnection");
            }
        
            public IActionResult Index()
        {
            return View();
        }

        #region DeptMaster
        public IActionResult DeptMaster()
        {
            return View();
        }

        // Get record for the List
        [HttpGet]
        public async Task<IActionResult> GetDeptMasterRecord([FromQuery] WorkOrder filter)
        
        {
            try
            {
                // Access as object

                SortedList parameters = new SortedList();
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@DeptId", filter.DeptId);
                parameters.Add("@WorkOrderId", filter.WorkOrderId);
                parameters.Add("@CreatedBy", filter.CreatedBy);
                parameters.Add("@RoleId", filter.UserRole);

                var dt = await _cn.FillDataTableAsync("TallyAgencyDeptWorkOrder_List1", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<WorkOrderListModel>());

                var list = dt.AsEnumerable().Select(row => new WorkOrderListModel

                {
                    AgencyId = (row["AgencyId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyId"].ToString()))
                    ? 0 : Convert.ToInt32(row["AgencyId"]),
                    //AgencyId = Convert.ToInt32(row["AgencyId"]?.ToString()),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    DeptId = (row["DeptId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DeptId"].ToString()))
                    ? 0 : Convert.ToInt32(row["DeptId"]),
                   // DeptId = Convert.ToInt32(row["DeptId"]?.ToString()),
                    DepartmentName = (row["DepartmentName"]?.ToString()),
                    WorkOrderId = (row["WorkOrderId"]?.ToString()),
                    BillingAddress = (row["BillingAddress"]?.ToString()),
                    NoDeployedRes = (row["NoDeployedRes"] == DBNull.Value || string.IsNullOrWhiteSpace(row["NoDeployedRes"].ToString()))
                    ? 0 : Convert.ToInt32(row["NoDeployedRes"]),
                    //NoDeployedRes = Convert.ToInt32(row["NoDeployedRes"]?.ToString()),
                    IsResourceUploaded = (row["IsResourceUploaded"]?.ToString()),
                    BillingAddEmail = (row["BillAddressEmail"]?.ToString()),
                    NoOfUploadedResource = (row["NoOfUploadedResource"] == DBNull.Value || string.IsNullOrWhiteSpace(row["NoOfUploadedResource"].ToString()))
                    ? 0 : Convert.ToInt32(row["NoOfUploadedResource"]),
                    //NoOfUploadedResource = Convert.ToInt32(row["NoOfUploadedResource"]?.ToString()),

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
        public IActionResult AddOrEditRecord(WorkOrderModel model)
        {
            try
            {
                //if (string.IsNullOrWhiteSpace(model.WorkOrderNo) ||
                //    string.IsNullOrWhiteSpace(model.BillAddressEmail)
                    
                //    )
                //{
                //    return BadRequest(new
                //    {
                //        success = false,
                //        message = "WorkOrderNo and BillAddressEmail are required."
                //    });
                //}

                SortedList parameters = new SortedList();
                parameters.Add("@WorkOrderAgencyId", model.WorkOrderAgencyId);
                parameters.Add("@AgencyId", model.AgencyId);
                parameters.Add("@DeptId", model.DeptId);
                parameters.Add("@WorkOrderId", model.WorkOrderNo);
                parameters.Add("@BillingId", model.BillingId);
                parameters.Add("@BillingAddress", model.BillingAddress);
                parameters.Add("@NoDeployedRes", model.NoDeployedRes);
                parameters.Add("@BillAddressEmail", model.BillAddressEmail);

                var userId = User.FindFirst("UserId")?.Value;
                parameters.Add("@CreatedBy", userId);

                var result = _cn.ExecuteNonQueryWMessage(
                    "TallyAgencyWorkOrder_AcceptUpdate",
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

        #region Dept Attendance
        public IActionResult DeptAttendance()
        {
            return View();
        }

        // Get record for the List
        [HttpGet]
        public async Task<IActionResult> GetDeptAttendanceRecord([FromQuery] DeptAttendanceFilter filter)
              
        {
            var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
            var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@Id", filter.Id);
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@DeptId", filter.DeptId);
                parameters.Add("@MonthYear", filter.MonthYear);
                parameters.Add("@CreateBy", 0);
                parameters.Add("@RoleId", roleId);

                
                var dt = await _cn.FillDataTableAsync("tblTallyAttendance_list", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DeptAttendanceViewModel>());

                var list = dt.AsEnumerable().Select(row => new DeptAttendanceViewModel

                {
                    Id = row["AttendaceId"]?.ToString(),
                    departmentName = (row["departmentName"]?.ToString()),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    WorkOrderId = (row["WorkOrderId"]?.ToString()),
                    PurhaseInvNO = (row["PurhaseInvNO"]?.ToString()),
                    DeployedResource = Convert.ToInt32(row["DeployedResource"]?.ToString()),
                    UpladNoOfResource = Convert.ToInt32(row["UpladNoOfResource"]?.ToString()),
                    MonthYear = Convert.ToInt32(row["MonthYear"]?.ToString()),
                    AttendanceCertificate = row["AttendanceCertificate"]?.ToString(),
                    AnnexureFile = row["AnnexureFile"]?.ToString(),
                    AgencyBillFile = row["UploadBill"]?.ToString(),
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

        // No of resources when change on Billing Address ddl
        //[HttpGet]
        //public async Task<IActionResult> GetNoOfResourcesByBilling([FromQuery] DeptAttendanceFilter filter)
        //{
        //    try
        //    {
        //        SortedList parameters = new SortedList();
        //        parameters.Add("@AgencyId", filter.AgencyId);
        //        parameters.Add("@DeptId", filter.DeptId);
        //        parameters.Add("@WorkOrderAgencyId", filter.WorkOrderAgencyId); // IMPORTANT
        //        parameters.Add("@UserId", filter.CreatedBy);
        //        parameters.Add("@RoleId", filter.UserRole);
        //        parameters.Add("@SearchTerm", DBNull.Value);

        //        var dt = await _cn.FillDataTableAsync("TallyAgencyWorkOrder_ddlC", "", parameters);

        //        if (dt == null || dt.Rows.Count == 0)
        //            return Ok(new List<object>());

        //        var list = dt.AsEnumerable().Select(row => new
        //        {
        //            Id = row["WorkOrderAgencyId"]?.ToString(),
        //            BillingId = row["BillingId"]?.ToString(),
        //            BillingAddress = row["BillingAddress"]?.ToString(),
        //            NoOfResources = Convert.ToInt32(row["NoDeployedRes"]?.ToString())
        //        }).ToList();

        //        return Ok(list);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new
        //        {
        //            success = false,
        //            message = "Server error",
        //            error = ex.Message
        //        });
        //    }
        //}

        // Submit data
        //[HttpPost]
        // public IActionResult AddOrEdit_DeptAttendanceRecord1(DeptAttendanceModel model)
        // {
        //     try
        //     {
        //         //if (string.IsNullOrWhiteSpace(model.WorkOrderNo) ||
        //         //    string.IsNullOrWhiteSpace(model.BillAddressEmail)

        //         //    )
        //         //{
        //         //    return BadRequest(new
        //         //    {
        //         //        success = false,
        //         //        message = "WorkOrderNo and BillAddressEmail are required."
        //         //    });
        //         //}




        //         SortedList parameters = new SortedList();
        //         parameters.Add("@Id", model.Id);
        //         parameters.Add("@MonthYear", model.MonthYear);
        //         parameters.Add("@WorkOrderId", model.WorkOrderNo);
        //         parameters.Add("@UpladNoOfResource", model.UpladNoOfResource);
        //         parameters.Add("@AttendanceCertificate", model.AttendanceFile);
        //         parameters.Add("@AnnexureFile", model.AnnexureFile);
        //         parameters.Add("@AgencyBillFile", model.AgencyBillFile);


        //         var userId = User.FindFirst("UserId")?.Value;
        //         parameters.Add("@CreatedBy", userId);

        //         var result = _cn.ExecuteNonQueryWMessage(
        //             "tblTallyAttendance_AcceptUpdate",
        //             "",
        //             parameters
        //         );

        //         return Ok(new
        //         {
        //             success = true,
        //             message = result.ToString()
        //         });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new
        //         {
        //             success = false,
        //             message = "Server error.",
        //             error = ex.Message
        //         });
        //     }
        // }

        [HttpPost]
        public async Task<IActionResult> AddOrEdit_DeptAttendanceRecord([FromForm] DeptAttendanceModel model)
        {
            try
            {

                var Id = model.Id;
                var MonthYear = model.MonthYear;
                var WorkOrderNo = model.WorkOrderNo;
                var UpladNoOfResource = model.UpladNoOfResource;
                var PresentResource = model.PresentResource;
                //var UploadFolder = Request.Form["UploadFolder"].ToString();

                // ✅ Get uploaded file
               
                IFormFile attachmentFile1 = model.AttendanceFile;
                IFormFile attachmentFile2 = model.AnnexureFile;
                IFormFile attachmentFile3 = model.AgencyBillFile;

                var userId = User.FindFirst("UserId")?.Value;





                string AttendanceCertificate = "";
                if (attachmentFile1 != null && attachmentFile1.Length > 0)
                {
                    string folderPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/Attachment/DeptAttendance/Attendance"
                    );

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    string extension = Path.GetExtension(attachmentFile1.FileName);

                    AttendanceCertificate = $"Attendance_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                    string filePath = Path.Combine(folderPath, AttendanceCertificate);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile1.CopyToAsync(stream);
                    }
                }

                string AnnexureFile = "";
                if (attachmentFile2 != null && attachmentFile2.Length > 0)
                {
                    string folderPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/Attachment/DeptAttendance/Annexure"
                    );

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    string extension = Path.GetExtension(attachmentFile2.FileName);

                    AnnexureFile = $"Annexure_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                    string filePath = Path.Combine(folderPath, AnnexureFile);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile2.CopyToAsync(stream);
                    }
                }

                string AgencyBillFile = "";
                if (attachmentFile3 != null && attachmentFile3.Length > 0)
                {
                    string folderPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/Attachment/DeptAttendance/AgencyBill"
                    );

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    string extension = Path.GetExtension(attachmentFile3.FileName);

                    AgencyBillFile = $"AgencyBill_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                    string filePath = Path.Combine(folderPath, AgencyBillFile);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile3.CopyToAsync(stream);
                    }
                }
                             
                
                SortedList parameters = new SortedList
                    {
                    { "@Id", Id },
                    { "@MonthYear", MonthYear },
                    { "@WorkOrderId", WorkOrderNo },
                    { "@UpladNoOfResource", UpladNoOfResource },
                    { "@AttendanceCertificate", AttendanceCertificate }, // save filename
                    { "@AnnexureFile", AnnexureFile }, // save filename
                    { "@AgencyBillFile", AgencyBillFile}, // save filename
                    { "@createdby", userId }
                };

                var result = _cn.ExecuteNonQueryWMessage(
                    "tblTallyAttendance_AcceptUpdate",
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
        // Delete Records from Table
        [HttpPost]
        public IActionResult Delete_DeptAttendanceRecord([FromForm] DeleteAttendanceModel model)
        {
            try
            {
                Console.WriteLine("Delete Id Received: " + model.Id);

                var userId = User.FindFirst("UserId")?.Value;

                SortedList parameters = new SortedList
        {
            { "@AttendaceId", model.Id },
            { "@IsCancel", "Y" },
            { "@CancelBy", userId },
            { "@CancelRemarks", model.CancelRemarks ?? "" }
        };

                var result = _cn.ExecuteNonQueryWMessage(
                    "TallyAttendanceCancel_AcceptUpdate",
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
                    message = "Server error",
                    error = ex.Message
                });
            }
        }

        // Get record Upload Annexure & agency File
        [HttpGet]
        public async Task<IActionResult> GetUploadAnnexureBillRecord([FromQuery] DeptAttendanceFilter filter)

        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@AttendaceId", filter.Id);
                
                var dt = await _cn.FillDataTableAsync("tblTallyAttendanceDetails_Get", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DeptAttendanceViewModel>());

                var list = dt.AsEnumerable().Select(row => new DeptAttendanceViewModel

                {
                    //Id = row["AttendaceId"]?.ToString(),
                    MonthYear = Convert.ToInt32(row["MonthYear"]?.ToString()),
                    departmentName = (row["departmentName"]?.ToString()),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    WorkOrderId = (row["HpsedcWrokOrderNO"]?.ToString()),
                    //PurhaseInvNO = (row["PurhaseInvNO"]?.ToString()),
                    //DeployedResource = Convert.ToInt32(row["DeployedResource"]?.ToString()),
                    UpladNoOfResource = Convert.ToInt32(row["UpladNoOfResource"]?.ToString()),
                    BillingAddress = (row["BillingAddress"]?.ToString()),
                    //AttendanceCertificate = row["AttendanceCertificate"]?.ToString(),
                    //AnnexureFile = row["AnnexureFile"]?.ToString(),
                    //AgencyBillFile = row["UploadBill"]?.ToString(),
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

        //Submit Annexure & Bill
        [HttpPost]
        public async Task<IActionResult> AddOrEdit_AnnexureBillRecord([FromForm] DeptAttendanceModel model)
        {
            try
            {

                var Id = model.Id;
                
                // ✅ Get uploaded file

                IFormFile attachmentFile2 = model.AnnexureFile;
                IFormFile attachmentFile3 = model.AgencyBillFile;

                var userId = User.FindFirst("UserId")?.Value;

               
                string AnnexureFile = "";
                if (attachmentFile2 != null && attachmentFile2.Length > 0)
                {
                    string folderPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/Attachment/DeptAttendance/Annexure"
                    );

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    string extension = Path.GetExtension(attachmentFile2.FileName);

                    AnnexureFile = $"Annexure_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                    string filePath = Path.Combine(folderPath, AnnexureFile);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile2.CopyToAsync(stream);
                    }
                }

                string AgencyBillFile = "";
                if (attachmentFile3 != null && attachmentFile3.Length > 0)
                {
                    string folderPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/Attachment/DeptAttendance/AgencyBill"
                    );

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    string extension = Path.GetExtension(attachmentFile3.FileName);

                    AgencyBillFile = $"AgencyBill_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                    string filePath = Path.Combine(folderPath, AgencyBillFile);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile3.CopyToAsync(stream);
                    }
                }


                SortedList parameters = new SortedList
                    {
                    { "@Id", Id },
                    { "@AnnexureFile", AnnexureFile }, // save filename
                    { "@AgencyBillFile", AgencyBillFile}, // save filename
                    { "@createdby", userId }
                };

                var result = _cn.ExecuteNonQueryWMessage(
                    "tblTallyAnnexture_AcceptUpdate",
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

        // Get record Upload Annexure & agency File
        [HttpGet]
        public async Task<IActionResult> GetAgencyInvoiceRecord([FromQuery] DeptAttendanceFilter filter)

        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@AttendaceId", filter.Id);

                var dt = await _cn.FillDataTableAsync("tblTallyAttendanceDetails_Get", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DeptAttendanceViewModel>());

                var list = dt.AsEnumerable().Select(row => new DeptAttendanceViewModel

                {
                    Id = row["AgencyId"]?.ToString(),
                    MonthYear = Convert.ToInt32(row["MonthYear"]?.ToString()),
                    DeptId = Convert.ToInt32(row["DeptId"]?.ToString()),
                    departmentName = (row["departmentName"]?.ToString()),
                    AgencyId = Convert.ToInt32(row["AgencyId"]?.ToString()),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    WorkOrderId = (row["HpsedcWrokOrderNO"]?.ToString()),
                    //PurhaseInvNO = (row["PurhaseInvNO"]?.ToString()),
                    //DeployedResource = Convert.ToInt32(row["DeployedResource"]?.ToString()),
                    UpladNoOfResource = Convert.ToInt32(row["UpladNoOfResource"]?.ToString()),
                    BillingId = Convert.ToInt32(row["BillingId"]?.ToString()),
                    BillingAddress = (row["BillingAddress"]?.ToString()),
                    //AttendanceCertificate = row["AttendanceCertificate"]?.ToString(),
                    //AnnexureFile = row["AnnexureFile"]?.ToString(),
                    //AgencyBillFile = row["UploadBill"]?.ToString(),
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

        //Submit Purchase Invoice 
        [HttpPost]
        public async Task<IActionResult> AddOrEdit_PurchaseInvoiceRecord([FromForm] DeptPurchaseInvoiceModel model)
        {
            try
            {

                //var Id = model.Id;
                var Id = model.Id;
                var PurchaseBillDate = model.PurchaseBillDate;
                var WorkOrderNo = model.WorkOrderNo;
                var AgencyBillNo = model.AgencyBillNo;
                var AgencyId = model.AgencyId;
                //var AgencyName = model.AgencyName;
                var DeptId = model.DeptId;
                //var DeptName = model.DeptName;
                var NoOfResources = model.NoOfResources;
                var BillingId = model.BillingId;
                var BillingAdd = model.BillingAdd;
                var MonthYear = model.MonthYear;
                var Description = model.Description;
                var Narration = model.Narration;
                var BasicBillAmt = model.BasicBillAmt;
                var AdminCharge = model.AdminCharge;
                var LiveryCharge = model.LiveryCharge;
                var InputCgst = model.InputCgst;
                var InputSgst = model.InputSgst;
                var InputIgst = model.InputIgst;
                var ToatlAmt = model.TotalAmt;

                var userId = User.FindFirst("UserId")?.Value;

                SortedList parameters = new SortedList
                    {
                    { "@AgencyBillId", 0 },
                    { "@BillDate", PurchaseBillDate },
                    { "@WorkOrderNo", WorkOrderNo },
                    { "@NoOfResource", NoOfResources },
                    { "@BillforMonth", MonthYear },
                    { "@AttendanceId", Id },
                    { "@Billno", AgencyBillNo },
                    { "@AgencyId", AgencyId },
                    { "@DeptId", DeptId },
                    { "@BillingId", BillingId },
                    { "@DepartmentAddress", BillingAdd },
                    { "@Description", Description },
                    { "@Narration", Narration },
                    { "@AgencyBillAmt", BasicBillAmt },
                    { "@AdminAmt", AdminCharge },
                    { "@LibaryAmt", LiveryCharge },
                    { "@cgstAmt", InputCgst },
                    { "@SGSTAtm", InputSgst },
                    { "@IGSTAmt", InputIgst },
                    { "@TotalAmt", ToatlAmt },
                    { "@createdby", userId }
                };

                var result = _cn.ExecuteNonQueryWMessage(
                    "TallyAgencyBill_AcceptUpdate",
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



        #region ESIEPF Report
        public IActionResult ESIEPFReport()
        {
            return View();
        }


        #endregion

        #region Deposit Challan ESIEPF 
        public IActionResult DepositChallanESIEPF()
        {
            return View();
        }


        #endregion

        #region Map Challan Invoice
        public IActionResult MapChallanInvoice()
        {
            return View();
        }


        #endregion

        #region New Invoice
        public IActionResult NewInvoice()
        {
            return View();
        }


        #endregion

        #region Purchase Bill Verification
        public IActionResult PurchaseBillVerification()
        {
            return View();
        }


        #endregion
    }
}
