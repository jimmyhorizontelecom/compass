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

        //Get employee name for data map
        
        [HttpGet]
        public async Task<IActionResult> GetMapEmpRsourceRecord([FromQuery] MapEmployeeFilter filter)

        {

            
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
               
                parameters.Add("@WorkorderId", filter.WorkOrderId);
                parameters.Add("@AgencyId", filter.AgencyId);
                

                var dt = await _cn.FillDataTableAsync("TallyFetchEmployee_Get", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<MapEmployeeViewModel>());

                var list = dt.AsEnumerable().Select(row => new MapEmployeeViewModel

                {
                    EmpId = Convert.ToInt32(row["EmpId"]?.ToString()),
                    EmpName = (row["Empname"]?.ToString()),
                    EmpFatherName = (row["FatherName"]?.ToString()),
                    EmpAadharNo = (row["AADHARNO"]?.ToString()),
                    EmpDesignation = (row["fvDesignationName"]?.ToString()),
                    
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
                parameters.Add("@CreateBy", userId);
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


        // Submit data


        //[HttpPost]

        //public async Task<IActionResult> AddOrEdit_DeptAttendanceRecord([FromForm] DeptAttendanceModel model)
        //{
        //    try
        //    {

        //        var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
        //        var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");

        //        var Id = model.Id;
        //        var MonthYear = model.MonthYear;
        //        var WorkOrderNo = model.WorkOrderNo;
        //        var UpladNoOfResource = model.UpladNoOfResource;
        //        var PresentResource = model.PresentResource;
        //        //var UploadFolder = Request.Form["UploadFolder"].ToString();

        //        // ✅ Get uploaded file

        //        IFormFile attachmentFile1 = model.AttendanceFile;
        //        IFormFile attachmentFile2 = model.AnnexureFile;
        //        IFormFile attachmentFile3 = model.AgencyBillFile;







        //        string AttendanceCertificate = "";
        //        if (attachmentFile1 != null && attachmentFile1.Length > 0)
        //        {
        //            string folderPath = Path.Combine(
        //                Directory.GetCurrentDirectory(),
        //                "wwwroot/Attachment/DeptAttendance/Attendance"
        //            );

        //            if (!Directory.Exists(folderPath))
        //                Directory.CreateDirectory(folderPath);

        //            string extension = Path.GetExtension(attachmentFile1.FileName);

        //            AttendanceCertificate = $"Attendance_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

        //            string filePath = Path.Combine(folderPath, AttendanceCertificate);

        //            using (var stream = new FileStream(filePath, FileMode.Create))
        //            {
        //                await attachmentFile1.CopyToAsync(stream);
        //            }
        //        }

        //        string AnnexureFile = "";
        //        if (attachmentFile2 != null && attachmentFile2.Length > 0)
        //        {
        //            string folderPath = Path.Combine(
        //                Directory.GetCurrentDirectory(),
        //                "wwwroot/Attachment/DeptAttendance/Annexure"
        //            );

        //            if (!Directory.Exists(folderPath))
        //                Directory.CreateDirectory(folderPath);

        //            string extension = Path.GetExtension(attachmentFile2.FileName);

        //            AnnexureFile = $"Annexure_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

        //            string filePath = Path.Combine(folderPath, AnnexureFile);

        //            using (var stream = new FileStream(filePath, FileMode.Create))
        //            {
        //                await attachmentFile2.CopyToAsync(stream);
        //            }
        //        }

        //        string AgencyBillFile = "";
        //        if (attachmentFile3 != null && attachmentFile3.Length > 0)
        //        {
        //            string folderPath = Path.Combine(
        //                Directory.GetCurrentDirectory(),
        //                "wwwroot/Attachment/DeptAttendance/AgencyBill"
        //            );

        //            if (!Directory.Exists(folderPath))
        //                Directory.CreateDirectory(folderPath);

        //            string extension = Path.GetExtension(attachmentFile3.FileName);

        //            AgencyBillFile = $"AgencyBill_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

        //            string filePath = Path.Combine(folderPath, AgencyBillFile);

        //            using (var stream = new FileStream(filePath, FileMode.Create))
        //            {
        //                await attachmentFile3.CopyToAsync(stream);
        //            }
        //        }


        //        SortedList parameters = new SortedList
        //            {
        //            { "@Id", Id },
        //            { "@MonthYear", MonthYear },
        //            { "@WorkOrderId", WorkOrderNo },
        //            { "@UpladNoOfResource", UpladNoOfResource },
        //            { "@AttendanceCertificate", AttendanceCertificate }, // save filename
        //            { "@AnnexureFile", AnnexureFile }, // save filename
        //            { "@AgencyBillFile", AgencyBillFile}, // save filename
        //            { "@createdby", userId }
        //        };

        //        var result = _cn.ExecuteNonQueryWMessage(
        //            "tblTallyAttendance_AcceptUpdate",
        //            "",
        //            parameters
        //        );

        //        return Ok(new { success = true, message = result.ToString() });
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
        [HttpPost]
        public async Task<IActionResult> AddOrEdit_DeptAttendanceRecord([FromForm] DeptAttendanceModel model)
        {
            try
            {
                // =========================
                // LOGIN USER DETAILS
                // =========================

                var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
                var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");


                // =========================
                // MODEL VALUES
                // =========================

                var Id = model.Id;
                var MonthYear = model.MonthYear;
                var WorkOrderNo = model.WorkOrderNo;
                var UpladNoOfResource = model.UpladNoOfResource;
                var PresentResource = model.PresentResource;

                // =========================
                // FILES
                // =========================

                IFormFile attachmentFile1 = model.AttendanceFile;
                IFormFile attachmentFile2 = model.AnnexureFile;
                IFormFile attachmentFile3 = model.AgencyBillFile;

                // =========================
                // ROLE BASED VALIDATION
                // =========================

                // Attendance file required for all users
                if (attachmentFile1 == null || attachmentFile1.Length == 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Attendance file is required."
                    });
                }

                // Agency Login
                // RoleId = 48
                if (roleId == 48)
                {
                    if (attachmentFile2 == null || attachmentFile2.Length == 0)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = "Annexure file is required."
                        });
                    }

                    if (attachmentFile3 == null || attachmentFile3.Length == 0)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = "Agency Bill file is required."
                        });
                    }
                }
                else
                {
                    // Department Login
                    // Ignore extra files
                    attachmentFile2 = null;
                    attachmentFile3 = null;
                }

                // =========================
                // SAVE ATTENDANCE FILE
                // =========================

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

                    AttendanceCertificate =
                        $"Attendance_{DateTime.Now:yyyyMMddHHmmss}_{Guid.NewGuid()}{extension}";

                    string filePath = Path.Combine(folderPath, AttendanceCertificate);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile1.CopyToAsync(stream);
                    }
                }

                // =========================
                // SAVE ANNEXURE FILE
                // =========================

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

                    AnnexureFile =
                        $"Annexure_{DateTime.Now:yyyyMMddHHmmss}_{Guid.NewGuid()}{extension}";

                    string filePath = Path.Combine(folderPath, AnnexureFile);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile2.CopyToAsync(stream);
                    }
                }

                // =========================
                // SAVE AGENCY BILL FILE
                // =========================

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

                    AgencyBillFile =
                        $"AgencyBill_{DateTime.Now:yyyyMMddHHmmss}_{Guid.NewGuid()}{extension}";

                    string filePath = Path.Combine(folderPath, AgencyBillFile);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile3.CopyToAsync(stream);
                    }
                }

                // =========================
                // DATABASE PARAMETERS
                // =========================
                if (roleId != 48)
                {
                    AnnexureFile = "";
                    AgencyBillFile = "";
                }

                // =========================
                // TVP DATATABLE
                // =========================

                DataTable dt = new DataTable();

                dt.Columns.Add("AgencyWorkOrderId", typeof(int));
                dt.Columns.Add("EmpId", typeof(int));

                // Selected employee list se data add karo

                if (model.EmployeeList != null && model.EmployeeList.Count > 0)
                {
                    foreach (var item in model.EmployeeList)
                    {
                        dt.Rows.Add(
                            Convert.ToInt32(WorkOrderNo),
                            Convert.ToInt32(item.EmpId)
                        );
                    }
                }

                SortedList parameters = new SortedList
        {
            { "@Id", Id },
            { "@MonthYear", MonthYear },
            { "@WorkOrderId", WorkOrderNo },
            { "@UpladNoOfResource", UpladNoOfResource },
            //{ "@AttendanceCertificate", AttendanceCertificate },
            //{ "@AnnexureFile", AnnexureFile },
            //{ "@AgencyBillFile", AgencyBillFile },
            { "@AttendanceCertificate", AttendanceCertificate ?? "" },
            { "@AnnexureFile", AnnexureFile ?? "" },
            { "@AgencyBillFile", AgencyBillFile ?? "" },
            { "@createdby", userId },
            { "@tempTallyEmployeeAttendance", dt }


        };

                // =========================
                // SAVE TO DATABASE
                // =========================

                var result = _cn.ExecuteNonQueryWMessage(
                    "tblTallyAttendance_AcceptUpdate",
                    "",
                    parameters
                );

                // =========================
                // SUCCESS RESPONSE
                // =========================

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

        #endregion




    }
}
