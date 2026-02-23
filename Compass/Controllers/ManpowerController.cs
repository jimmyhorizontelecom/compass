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
                    AgencyName = (row["AgencyName"]?.ToString()),
                    DepartmentName = (row["DepartmentName"]?.ToString()),
                    WorkOrderId = (row["WorkOrderId"]?.ToString()),
                    BillingAddress = (row["BillingAddress"]?.ToString()),
                    NoDeployedRes = Convert.ToInt32(row["NoDeployedRes"]?.ToString()),
                    IsResourceUploaded = (row["IsResourceUploaded"]?.ToString()),
                    NoOfUploadedResource = Convert.ToInt32(row["NoOfUploadedResource"]?.ToString()),

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
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@Id", filter.Id);
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@DeptId", filter.DeptId);
                parameters.Add("@MonthYear", filter.MonthYear);
                parameters.Add("@CreateBy", filter.CreatedBy);
                parameters.Add("@RoleId", filter.UserRole);

                
                var dt = await _cn.FillDataTableAsync("tblTallyAttendance_list", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DeptAttendanceViewModel>());

                var list = dt.AsEnumerable().Select(row => new DeptAttendanceViewModel

                {
                    departmentName = (row["departmentName"]?.ToString()),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    WorkOrderId = (row["WorkOrderId"]?.ToString()),
                    PurhaseInvNO = (row["PurhaseInvNO"]?.ToString()),
                    DeployedResource = Convert.ToInt32(row["DeployedResource"]?.ToString()),
                    UpladNoOfResource = Convert.ToInt32(row["UpladNoOfResource"]?.ToString()),
                    MonthYear = Convert.ToInt32(row["MonthYear"]?.ToString()),                  
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
        public IActionResult AddOrEdit_DeptAttendanceRecord1(DeptAttendanceModel model)
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
                parameters.Add("@Id", model.Id);
                parameters.Add("@MonthYear", model.MonthYear);
                parameters.Add("@WorkOrderId", model.WorkOrderNo);
                parameters.Add("@UpladNoOfResource", model.UpladNoOfResource);
                parameters.Add("@AttendanceCertificate", model.AttendanceFile);
                parameters.Add("@AnnexureFile", model.AnnexureFile);
                parameters.Add("@AgencyBillFile", model.AgencyBillFile);
                

                var userId = User.FindFirst("UserId")?.Value;
                parameters.Add("@CreatedBy", userId);

                var result = _cn.ExecuteNonQueryWMessage(
                    "tblTallyAttendance_AcceptUpdate",
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


                //if (string.IsNullOrWhiteSpace(Title))
                //{
                //    return BadRequest(new
                //    {
                //        success = false,
                //        message = "Product Name is required."
                //    });
                //}

                //Attendance File 
                //string fileName1= "";
                //if (attachmentFile1 != null && attachmentFile1.Length > 0)
                //{
                //    fileName1 = Guid.NewGuid() + Path.GetExtension(attachmentFile1.FileName);
                //    var filePath = Path.Combine(
                //        Directory.GetCurrentDirectory(),
                //        "wwwroot/Attachment/DeptAttendance",
                //        //attachmentFile1.FileName
                //        fileName1
                //    );

                //    using (var stream = new FileStream(filePath, FileMode.Create))
                //    {
                //        await attachmentFile1.CopyToAsync(stream);
                //    }
                //}

                string fileName1 = "";
                if (attachmentFile1 != null && attachmentFile1.Length > 0)
                {
                    string folderPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/Attachment/DeptAttendance/Attendance"
                    );

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    string extension = Path.GetExtension(attachmentFile1.FileName);

                    fileName1 = $"Attendance_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                    string filePath = Path.Combine(folderPath, fileName1);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile1.CopyToAsync(stream);
                    }
                }

                //Annexxure File 
                //string fileName2 = "";
                //if (attachmentFile2 != null && attachmentFile2.Length > 0)
                //{
                //    fileName2 = Guid.NewGuid() + Path.GetExtension(attachmentFile2.FileName);
                //    var filePath = Path.Combine(
                //        Directory.GetCurrentDirectory(),
                //        "wwwroot/Attachment/DeptAttendance",
                //        //attachmentFile2.FileName
                //        fileName2
                //    );

                //    using (var stream = new FileStream(filePath, FileMode.Create))
                //    {
                //        await attachmentFile2.CopyToAsync(stream);
                //    }
                //}
                string fileName2 = "";
                if (attachmentFile2 != null && attachmentFile2.Length > 0)
                {
                    string folderPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/Attachment/DeptAttendance/Annexure"
                    );

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    string extension = Path.GetExtension(attachmentFile2.FileName);

                    fileName2 = $"Annexure_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                    string filePath = Path.Combine(folderPath, fileName2);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile2.CopyToAsync(stream);
                    }
                }

                //Annexxure Group Bill File 
                //string fileName3 = "";
                //if (attachmentFile3 != null && attachmentFile3.Length > 0)
                //{
                //    fileName3 = Guid.NewGuid() + Path.GetExtension(attachmentFile3.FileName);
                //    var filePath = Path.Combine(
                //        Directory.GetCurrentDirectory(),
                //        "wwwroot/Attachment/DeptAttendance",
                //        //attachmentFile3.FileName
                //        fileName3
                //    );

                //    using (var stream = new FileStream(filePath, FileMode.Create))
                //    {
                //        await attachmentFile3.CopyToAsync(stream);
                //    }
                //}
                string fileName3 = "";
                if (attachmentFile3 != null && attachmentFile3.Length > 0)
                {
                    string folderPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/Attachment/DeptAttendance/AgencyBill"
                    );

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    string extension = Path.GetExtension(attachmentFile3.FileName);

                    fileName3 = $"AgencyBill_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                    string filePath = Path.Combine(folderPath, fileName3);

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
                    { "@AttendanceCertificate", fileName1 }, // save filename
                    { "@AnnexureFile", fileName2 }, // save filename
                    { "@AgencyBillFile", fileName3}, // save filename
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
