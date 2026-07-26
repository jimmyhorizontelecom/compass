using ClosedXML.Excel;
using Compass.Classes;
using Compass.Models.Filter;
using Compass.Models.Hardware;
using Compass.Models.ManpowerModel;
using Compass.Models.ManpowerViewModel;
using Compass.Models.Test;
using DocumentFormat.OpenXml.ExtendedProperties;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Office2019.Drawing.Model3D;
using DocumentFormat.OpenXml.Wordprocessing;
using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
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
            var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
            var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@DeptId", filter.DeptId);
                parameters.Add("@WorkOrderId",0/* filter.WorkOrderId*/);
                parameters.Add("@CreatedBy", userId);
                parameters.Add("@RoleId", roleId);
                parameters.Add("@IsActive", filter.IsActive);
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
                    DeactivateWorkOrder = Convert.ToChar(row["IsActive"]?.ToString()),
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

        #region Employee Deatils Import
        public IActionResult EmployeeDetailImport()
        {
            return View();
        }

        // Get record for the List
        [HttpGet]
        public async Task<IActionResult> GetEmpDetailRecord([FromQuery] WorkOrder filter)
        {
            var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
            var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@DeptId", filter.DeptId);
                parameters.Add("@WorkOrderId", filter.WorkOrderId);
                parameters.Add("@CreatedBy", userId);
                parameters.Add("@RoleId", roleId);

                var dt = await _cn.FillDataTableAsync("TallyAgencyDeptWorkOrder_List1", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<AddEmpDetailsListViewModel>());

                var list = dt.AsEnumerable().Select(row => new AddEmpDetailsListViewModel

                {
                    //AgencyId = (row["AgencyId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyId"].ToString()))
                    // ? 0 : Convert.ToInt32(row["AgencyId"]),
                    EmpName = (row["AgencyName"]?.ToString()),
                    FathersName = (row["AgencyName"]?.ToString()),
                    IsFullTimer = (row["AgencyName"]?.ToString()),
                    DesignationId = (row["DeptId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DeptId"].ToString()))
                    ? 0 : Convert.ToInt32(row["DeptId"]),
                    AdhaarNo = (row["DeptId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DeptId"].ToString()))
                    ? 0 : Convert.ToInt32(row["DeptId"]),
                    BasicSalary = (row["DeptId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DeptId"].ToString()))
                    ? 0 : Convert.ToInt32(row["DeptId"]),
                    OtherAllowance = (row["DeptId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DeptId"].ToString()))
                    ? 0 : Convert.ToInt32(row["DeptId"]),
                    IsEPF = (row["AgencyName"]?.ToString()),
                    IsESIC = (row["AgencyName"]?.ToString()),
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
        //Download Designation Code files
        [HttpGet]
        public IActionResult DownloadDesignationCode()
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(),
                "wwwroot", "PageAssets", "Manpower", "Templates", "Designation_List.xlsx");
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Template file not found.");
            }
            return PhysicalFile(
                filePath,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Designation_List.xlsx");
        }
        //Download Templates files
        [HttpGet]
        public IActionResult DownloadTemplate()
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(),
                "wwwroot", "PageAssets", "Manpower", "Templates", "Employee_Detail_Upload.xlsx");
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Template file not found.");
            }
            return PhysicalFile(
                filePath,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Employee Detail Upload.xlsx");
        }

        //Get Excel Templates
        [HttpGet]
        public IActionResult DownloadFormat()
        {
            using var workbook = new XLWorkbook();

            var masterSheet = workbook.Worksheets.Add("Master");

            masterSheet.Cell("A1").Value = "Designation";
            masterSheet.Cell("A2").Value = "HR";
            masterSheet.Cell("A3").Value = "Accounts";
            masterSheet.Columns().AdjustToContents();

            var dataSheet = workbook.Worksheets.Add("Template");

            dataSheet.Cell("A1").Value = "RollNo";
            dataSheet.Cell("B1").Value = "Name";
            dataSheet.Cell("C1").Value = "Mobile";
            dataSheet.Cell("D1").Value = "Department";
            dataSheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();

            workbook.SaveAs(stream);

            return File(
                stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "StudentUploadFormat.xlsx");
        }


        //Upload Excel
        [HttpPost]
        public async Task<IActionResult> UploadExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Please select Excel file.");

            var employees = new List<EmpImportExcelModel>();

            using var stream = file.OpenReadStream();
            using var workbook = new XLWorkbook(stream);

            var worksheet = workbook.Worksheet(1);

            var rows = worksheet.RowsUsed().Skip(1);

            foreach (var row in rows)
            {
                employees.Add(new EmpImportExcelModel
                {
                    EmpName = row.Cell(1).GetString(),
                    FathersName = row.Cell(2).GetString(),
                    IsFullTimer = row.Cell(3).GetString(),
                    DesigationId = row.Cell(4).GetString(),
                    AADHARNO = row.Cell(5).GetString(),
                    Basics = Convert.ToDecimal(row.Cell(6).GetValue<string>() == "" ? "0" : row.Cell(6).GetValue<string>()),
                    Others = Convert.ToDecimal(row.Cell(7).GetValue<string>() == "" ? "0" : row.Cell(7).GetValue<string>()),
                    IsPF = row.Cell(8).GetString(),
                    IsESI = row.Cell(9).GetString()
                });
            }

            return Ok(employees);
        }

        //Read data from Excel File
        //[HttpPost]
        //public IActionResult ReadExcel(IFormFile file)
        //{
        //    try
        //    {
        //        List<EmpImportExcelModel> list = new();

        //        using var stream = file.OpenReadStream();
        //        using var workbook = new XLWorkbook(stream);

        //        var ws = workbook.Worksheet(1);

        //        foreach (var row in ws.RowsUsed().Skip(1))
        //        {
        //            list.Add(new EmpImportExcelModel
        //            {
        //                EmpName = row.Cell(2).GetString(),
        //                FathersName = row.Cell(3).GetString(),
        //                IsFullTimer = row.Cell(4).GetString(),
        //                DesigationId = row.Cell(5).GetString(),
        //                AADHARNO = row.Cell(6).GetString(),
        //                Basics = Convert.ToDecimal(row.Cell(7).GetString()),
        //                Others = Convert.ToDecimal(row.Cell(8).GetString()),
        //                IsPF = row.Cell(9).GetString(),
        //                IsESI = row.Cell(10).GetString()
        //            });
        //        }

        //        return Ok(list);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}


        //Verify Employee Import
        [HttpPost]
        public IActionResult ReadExcel(IFormFile file, int totalManpower)
        {
            try
            {
                List<EmpImportExcelModel> list = new();

                using var stream = file.OpenReadStream();
                using var workbook = new XLWorkbook(stream);

                var ws = workbook.Worksheet(1);

                foreach (var row in ws.RowsUsed().Skip(1))
                {
                    list.Add(new EmpImportExcelModel
                    {
                        EmpName = row.Cell(2).GetString(),
                        FathersName = row.Cell(3).GetString(),
                        IsFullTimer = row.Cell(4).GetString(),
                        DesigationId = row.Cell(5).GetString(),
                        AADHARNO = row.Cell(6).GetString(),
                        Basics = Convert.ToDecimal(row.Cell(7).GetString()),
                        Others = Convert.ToDecimal(row.Cell(8).GetString()),
                        IsPF = row.Cell(9).GetString(),
                        IsESI = row.Cell(10).GetString()
                    });
                }
                Console.WriteLine("Total Manpower : " + totalManpower);
                if (list.Count > totalManpower)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = $"Excel contains {list.Count} records. Maximum allowed is {totalManpower}."
                    });
                }

                return Ok(list);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        public async Task<IActionResult> VerifyEmployeeImport([FromBody] List<EmpImportExcelModel> employees)
        {

            try
            {
                
                DataTable dtEmpDetails = new DataTable();
                dtEmpDetails.Columns.Add("DeptId", typeof(int));
                dtEmpDetails.Columns.Add("AgencyId", typeof(int));
                dtEmpDetails.Columns.Add("WorkOrderNo", typeof(string));
                dtEmpDetails.Columns.Add("TotalManpower", typeof(int));

                dtEmpDetails.Columns.Add("Empname", typeof(string));
                dtEmpDetails.Columns.Add("FatherName", typeof(string));
                dtEmpDetails.Columns.Add("IsFullTime", typeof(string));
                dtEmpDetails.Columns.Add("DesigationId", typeof(string));
                dtEmpDetails.Columns.Add("AADHARNO", typeof(string));

                dtEmpDetails.Columns.Add("BasicSalary", typeof(decimal));
                dtEmpDetails.Columns.Add("OthersAllowance", typeof(decimal));

                dtEmpDetails.Columns.Add("IsPf", typeof(string));
                dtEmpDetails.Columns.Add("IsEsi", typeof(string));

                foreach (var item in employees)
                {
                    dtEmpDetails.Rows.Add(
                        item.DeptId,
                        item.AgencyId,
                        item.WorkOrderNo,
                        item.TotalManpower,
                        item.EmpName,
                        item.FathersName,
                        item.IsFullTimer,
                        item.DesigationId,
                        item.AADHARNO,
                        item.Basics,
                        item.Others,
                        item.IsPF,
                        item.IsESI
                    );
                }
                if (employees == null || employees.Count == 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "No employee records found."
                    });
                }

                int maxManpower = employees.First().TotalManpower;

                if (employees.Count > maxManpower)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = $"Only {maxManpower} employees are allowed. Excel contains {employees.Count} employees."
                    });
                }

                SortedList parameters = new SortedList();
                parameters.Add("@EmpId", 0);
                parameters.Add("@NoOfEmp", employees.Count);
                parameters.Add("@EmpDetails", dtEmpDetails);

                var dt = await _cn.FillDataTableAsync(
                    "stpTallyEmployeesImportMasterVerified",
                    "",
                    parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<EmpImportVerificationViewModel>());

                var list = dt.AsEnumerable().Select(row =>
                    new EmpImportVerificationViewModel
                    {

                        EmpName = row["Empname"]?.ToString(),
                        FathersName = row["FatherName"]?.ToString(),
                        IsFullTimer = row["IsFullTime"]?.ToString(),
                        DesigationId = row["DesigationId"]?.ToString(),
                        AADHARNO = row["AADHARNO"]?.ToString(),
                        Basics = row["BasicSalary"]?.ToString(),
                        Others = row["OthersAllowance"]?.ToString(),
                        IsPF = row["IsPf"]?.ToString(),
                        IsESI = row["IsEsi"]?.ToString(),
                        Error_Message = row["Error_Message"]?.ToString(),
                        VerificationStatus = row["VerificationStatus"]?.ToString(),
                        Isuploaded = row["Isuploaded"]?.ToString()
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

        //Submit Import table data to database table
        [HttpPost]
        public async Task<IActionResult> SubmitEmployeeImport([FromBody] List<EmpImportExcelModel> employees)
        {
            var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
            try
            {
                if (employees == null || employees.Count == 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "No employee records found."
                    });
                }
                // Maximum manpower from WorkOrder
                int maxManpower = employees.First().TotalManpower;
                // Excel me jitne record hain
                int excelCount = employees.Count;
                if (excelCount > maxManpower)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = $"Only {maxManpower} employees are allowed. You are trying to upload {excelCount} employees."
                    });
                }
                DataTable dtEmpDetails = new DataTable();
                dtEmpDetails.Columns.Add("DeptId", typeof(int));
                dtEmpDetails.Columns.Add("AgencyId", typeof(int));
                dtEmpDetails.Columns.Add("WorkOrderNo", typeof(string));
                dtEmpDetails.Columns.Add("TotalManpower", typeof(int));
                dtEmpDetails.Columns.Add("Empname", typeof(string));
                dtEmpDetails.Columns.Add("FatherName", typeof(string));
                dtEmpDetails.Columns.Add("IsFullTime", typeof(string));
                dtEmpDetails.Columns.Add("DesigationId", typeof(string));
                dtEmpDetails.Columns.Add("AADHARNO", typeof(string));
                dtEmpDetails.Columns.Add("BasicSalary", typeof(decimal));
                dtEmpDetails.Columns.Add("OthersAllowance", typeof(decimal));
                dtEmpDetails.Columns.Add("IsPf", typeof(string));
                dtEmpDetails.Columns.Add("IsEsi", typeof(string));

                foreach (var item in employees)
                {
                    dtEmpDetails.Rows.Add(
                        item.DeptId,
                        item.AgencyId,
                        item.WorkOrderNo,
                        item.TotalManpower,
                        item.EmpName,
                        item.FathersName,
                        item.IsFullTimer,
                        item.DesigationId,
                        item.AADHARNO,
                        item.Basics,
                        item.Others,
                        item.IsPF,
                        item.IsESI
                    );
                }

                SortedList parameters = new SortedList();
                parameters.Add("@EmpId", userId); // Logged in UserId
                parameters.Add("@EmpDetails", dtEmpDetails);
                parameters.Add("@mes", "");

                var result = await _cn.FillDataTableAsync(
                    "stpTallyEmployeesImportMaster",
                    "",
                    parameters);

                return Ok(new
                {
                    success = true,
                    message = "Employees Uploaded Successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        #endregion


        #region   EmployeeDetailsList
        public IActionResult EmployeeDetailsList()
        {
            return View();
        }

        // Get record for the List
        [HttpGet]
        public async Task<IActionResult> GetEmployeeDetailsRecord([FromQuery] EmployeeFilter filter)

        {
            var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
            var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                
                parameters.Add("@DeptId", filter.DeptId);
                parameters.Add("@AgenyId", filter.AgencyId);
                parameters.Add("@WorkOrderId", filter.WorkOrderId);
                parameters.Add("@CreatedBy", userId);
                parameters.Add("@RoleId",roleId);
                parameters.Add("@PageNumber", 1/*filter.IsActive*/);
                parameters.Add("@PageSize", 50/*filter.IsActive*/);
                parameters.Add("@SearchTerm", filter.searchTerm);
                var dt = await _cn.FillDataTableAsync("stpTallyEmployees_list1_Paginated", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<EmployeeDetailsListViewModel>());
                var list = dt.AsEnumerable().Select(row => new EmployeeDetailsListViewModel
                {
                    EmpId = (row["EmpId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["EmpId"].ToString()))
                    ? 0 : Convert.ToInt32(row["EmpId"]),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    //DeptId = (row["DeptId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DeptId"].ToString()))
                    //? 0 : Convert.ToInt32(row["DeptId"]),
                    DepartmentName = (row["departmentName"]?.ToString()),
                    EmpName = (row["Empname"]?.ToString()),
                    FathersName = (row["FatherName"]?.ToString()),
                    Desigation = (row["fvDesignationName"]?.ToString()),
                    AADHARNO = (row["AADHARNO"]?.ToString()),
                    Basics = Convert.ToDecimal (row["BasicSalary"]?.ToString()),
                    IsEPF = (row["IsPf"]?.ToString()),
                    IsESIC = (row["IsEsi"]?.ToString()),
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


        // Get record Edit Employee Details
        [HttpGet]
        public async Task<IActionResult> GetEditEmpDetails([FromQuery] EmployeeFilter filter)
        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@EmpId", filter.EmpId);
               
                var dt = await _cn.FillDataTableAsync("stpTallyEmployees_Get", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<EmployeeDetailsListViewModel>());
                var list = dt.AsEnumerable().Select(row => new EmployeeDetailsListViewModel
                {
                    EmpId = (row["EmpId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["EmpId"].ToString()))
                    ? 0 : Convert.ToInt32(row["EmpId"]),
                    DesignationId = (row["fiDesignationID"] == DBNull.Value || string.IsNullOrWhiteSpace(row["fiDesignationID"].ToString()))
                    ? 0 : Convert.ToInt32(row["fiDesignationID"]),
                    DesignationName = (row["fvDesignationName"]?.ToString()),
                    EducationId = (row["EducationId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["EducationId"].ToString()))
                    ? 0 : Convert.ToInt32(row["EducationId"]),
                    AgencyId = (row["AgencyId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyId"].ToString()))
                    ? 0 : Convert.ToInt32(row["AgencyId"]),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    DeptId = (row["DeptId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["DeptId"].ToString()))
                    ? 0 : Convert.ToInt32(row["DeptId"]),
                    DepartmentName = (row["departmentName"]?.ToString()),
                    EmpName = (row["Empname"]?.ToString()),
                    FathersName = (row["FatherName"]?.ToString()),
                    Desigation = (row["fvDesignationName"]?.ToString()),
                    AADHARNO = (row["AADHARNO"]?.ToString()),
                    Basics = Convert.ToDecimal(row["BasicSalary"]?.ToString()),
                    IsFullTime = (row["IsFullTime"]?.ToString()),
                    IsEPF = (row["IsPf"]?.ToString()),
                    EpfAmt = Convert.ToDecimal(row["EpfAmt"]?.ToString()),
                    IsESIC = (row["IsEsi"]?.ToString()),
                    EsicAmt = Convert.ToDecimal(row["EsiAmt"]?.ToString()),
                    OthersAllowance = Convert.ToDecimal(row["OthersAllowance"]?.ToString()),
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
        public IActionResult AddOrEditEmpDetailsRecord(EmployeeDetails model)
        {
            try
            { 
                SortedList parameters = new SortedList();
                parameters.Add("@EmpId", model.EmpId);
                parameters.Add("@Empname", model.Empname);
                parameters.Add("@FatherName", model.FatherName);
                parameters.Add("@Email", model.Email);
                parameters.Add("@ContactNo", model.ContactNo);
                parameters.Add("@IsFullTime", model.IsFullTime);
                parameters.Add("@DesigationId", model.DesigationId);
                parameters.Add("@EducationId", model.EducationId);
                parameters.Add("@AADHARNO", model.AADHARNO);
                parameters.Add("@BasicSalary", model.BasicSalary);
                parameters.Add("@OthersAllowance", model.OthersAllowance);
                parameters.Add("@IsPf", model.IsPf);
                parameters.Add("@IsEsi", model.IsEsi);
                parameters.Add("@AcNO", model.AcNO);
                parameters.Add("@Ifsc", model.Ifsc);
                parameters.Add("@UANNo", model.UANNo);
                parameters.Add("@ESICNo", model.ESICNo);

                int userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
                parameters.Add("@CreatedBy", userId);
                //var userId = User.FindFirst("UserId")?.Value;
                //parameters.Add("@CreatedBy", userId);

                var result = _cn.ExecuteNonQueryWMessage(
                    "stpTallyEmployees_AcceptUPdate",
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

        // Delete Employee Records 
        [HttpPost]
        public IActionResult Delete_EmpDetailsRecord([FromForm] DeleteEmpDetails model)
        {
            try
            {
                Console.WriteLine("Emp Id Received: " + model.EmpId);
                //var userId = User.FindFirst("UserId")?.Value;
                SortedList parameters = new SortedList
        {
            { "@EmpId", model.EmpId },
            { "@DroppedDate", model.DroppedDate },
            { "@DroppedRemarks", model.DroppedRemarks},
            
        };
                var result = _cn.ExecuteNonQueryWMessage(
                    "Tallyemployee_Dropped",
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




        #endregion

      

        #region Dept Attendance
        public IActionResult DeptAttendance()
        {
            return View();
        }

        //Get employee name for data map Marked Resource
        [HttpGet]
        public async Task<IActionResult> GetMapEmpRsourceRecord([FromQuery] MapEmployeeFilter filter)
        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();            
                parameters.Add("@WorkorderId", filter.WorkOrderId);
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@MonthYear", filter.MonthYear);
                parameters.Add("@BillType", filter.BillType);
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
                    Id = Convert.ToInt32(row["Id"]?.ToString()),
                    AttendaceId = Convert.ToInt32(row["AttendaceId"]?.ToString()),
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
                    VerificationStatus = row["IsPurchaseBillVerified"]?.ToString(),
                    IsPurhaseBIllGenerated = row["IsPurhaseBIllGenerated"]?.ToString(),
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

        //Get employee Markesd Resource list marked by department
        [HttpGet]
        public async Task<IActionResult> GetMarkedEmpRsourceRecord([FromQuery] MapEmployeeFilter filter)
        {
            try
            {
                SortedList parameters = new SortedList();

                parameters.Add("@Id", filter.Id);
                parameters.Add("@AttendaceId", filter.AttendaceId);

                // DataSet use karo
                var ds = await _cn.FillDataSetAsync("tblTallyAttendance_Get", "", parameters);

                // Second table lo
                DataTable dt = ds.Tables[1];

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<MapEmployeeViewModel>());

                var list = dt.AsEnumerable().Select(row => new MapEmployeeViewModel
                {
                    EmpId = row["EmpId"] != DBNull.Value ? Convert.ToInt32(row["EmpId"]) : 0,
                    EmpName = row["Empname"]?.ToString(),
                    EmpFatherName = row["FatherName"]?.ToString(),
                    EmpAadharNo = row["AADHARNO"]?.ToString(),



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
        public async Task<IActionResult> AddOrEdit_DeptAttendanceRecord([FromForm] DeptAttendanceModel model)
        {
            try
            {
                // LOGIN USER DETAILS
                var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
                var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
                // MODEL VALUES
                var Id = model.Id;
                var MonthYear = model.MonthYear;
                var BillType = model.BillType;
                var WorkOrderNo = model.WorkOrderNo;
                var UpladNoOfResource = model.UpladNoOfResource;
                var PresentResource = model.PresentResource;
                // FILES
                IFormFile attachmentFile1 = model.AttendanceFile;
                IFormFile attachmentFile2 = model.AnnexureFile;
                IFormFile attachmentFile3 = model.AgencyBillFile;
                // ROLE BASED VALIDATION
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
                // SAVE ATTENDANCE FILE
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
                // SAVE ANNEXURE FILE
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
                // SAVE AGENCY BILL FILE      
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
                // DATABASE PARAMETERS
                if (roleId != 48)
                {
                    AnnexureFile = "";
                    AgencyBillFile = "";
                }
                // TVP DATATABLE
                List<EmployeeAttendanceModel> employeeList = new List<EmployeeAttendanceModel>();
                if (!string.IsNullOrEmpty(model.EmployeeListJson))
                {
                    employeeList = JsonConvert.DeserializeObject<List<EmployeeAttendanceModel>>(model.EmployeeListJson);
                }
                DataTable dt = new DataTable();
                dt.Columns.Add("AgencyWorkOrderId", typeof(int));
                dt.Columns.Add("EmpId", typeof(int));
                // Selected employee list se data add karo
                if (employeeList != null && employeeList.Count > 0)
                {
                    foreach (var item in employeeList)
                    {
                        int empId = 0;
                        int workOrder = 0;
                        int.TryParse(Convert.ToString(item.EmpId), out empId);
                        int.TryParse(Convert.ToString(WorkOrderNo), out workOrder);
                        if (empId > 0 && workOrder > 0)
                        {
                            dt.Rows.Add(workOrder, empId);
                        }
                    }
                }          
                SortedList parameters = new SortedList
        {
            { "@Id", Id },
            { "@MonthYear", MonthYear },
            { "@BillType", BillType },
            { "@WorkOrderId", WorkOrderNo },
            { "@UpladNoOfResource", UpladNoOfResource },
            { "@AttendanceCertificate", AttendanceCertificate ?? "" },
            { "@AnnexureFile", AnnexureFile ?? "" },
            { "@AgencyBillFile", AgencyBillFile ?? "" },
            { "@createdby", userId },
            { "@tempTallyEmployeeAttendance", dt  }
        };
                // SAVE TO DATABASE
                var result = _cn.ExecuteNonQueryWMessage(
                    "tblTallyAttendanceEmpwise_AcceptUpdate",
                    "",
                    parameters
                );
                // SUCCESS RESPONSE
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
                Console.WriteLine("Delete Id Received: " + model.AttendaceId);
                var userId = User.FindFirst("UserId")?.Value;
                SortedList parameters = new SortedList
        {
            { "@AttendaceId", model.AttendaceId },
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
                parameters.Add("@Id", filter.Id);
                parameters.Add("@AttendaceId", filter.AttendaceId);
                var dt = await _cn.FillDataTableAsync("tblTallyAttendance_Get", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DeptAttendanceViewModel>());
                var list = dt.AsEnumerable().Select(row => new DeptAttendanceViewModel
                {
                    Id = Convert.ToInt32(row["Id"]?.ToString()),
                    AttendaceId = Convert.ToInt32(row["AttendaceId"]?.ToString()),
                    MonthYear = Convert.ToInt32(row["MonthYear"]?.ToString()),
                    departmentName = (row["departmentName"]?.ToString()),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    WorkOrderId = (row["WorkOrderId"]?.ToString()),
                    //PurhaseInvNO = (row["PurhaseInvNO"]?.ToString()),
                    DeployedResource = Convert.ToInt32(row["DeployedResource"]?.ToString()),
                    UpladNoOfResource = Convert.ToInt32(row["UpladNoOfResource"]?.ToString()),
                    BillingAddress = (row["BillingAddress"]?.ToString()),
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
        // Get Map record marked by Department
        [HttpGet]
        public async Task<IActionResult> GetMapResourceRecord([FromQuery] DeptAttendanceFilter filter)
        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@Id", 0);
                parameters.Add("@AttendaceId", filter.Id);
                var dt = await _cn.FillDataTableAsync("tblTallyAttendance_Get", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<ViewMapResourceViewModel>());
                var list = dt.AsEnumerable().Select(row => new ViewMapResourceViewModel
                {
                    //Id = row["AttendaceId"]?.ToString(),
                    EmpId = Convert.ToInt32(row["EmpId"]?.ToString()),
                    EmpName = (row["Empname"]?.ToString()),
                    FatherName = (row["FatherName"]?.ToString()),
                    AadharNo = (row["AADHARNO"]?.ToString()),
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

        // Get record for Agency Invoice
        [HttpGet]
        public async Task<IActionResult> GetAgencyInvoiceRecord([FromQuery] DeptAttendanceFilter filter)

        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@AttendaceId", filter.AttendaceId);
                parameters.Add("@BillType", filter.BillType);
                var dt = await _cn.FillDataTableAsync("tblTallyAttendanceDetails_Get", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DeptAttendanceViewModel>());
                var list = dt.AsEnumerable().Select(row => new DeptAttendanceViewModel
                {
                    //Id = row["AgencyId"]?.ToString(),
                    MonthYear = Convert.ToInt32(row["MonthYear"]?.ToString()),
                    DeptId = Convert.ToInt32(row["DeptId"]?.ToString()),
                    departmentName = (row["departmentName"]?.ToString()),
                    AgencyId = Convert.ToInt32(row["AgencyId"]?.ToString()),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    WorkOrderId = (row["HpsedcWrokOrderNO"]?.ToString()),
                    BillType = Convert.ToChar(row["BillType"]?.ToString()),
                    //PurhaseInvNO = (row["PurhaseInvNO"]?.ToString()),
                    //DeployedResource = Convert.ToInt32(row["DeployedResource"]?.ToString()),
                    UpladNoOfResource = Convert.ToInt32(row["UpladNoOfResource"]?.ToString()),
                    BillingId = Convert.ToInt32(row["BillingId"]?.ToString()),
                    BillingAddress = (row["BillingAddress"]?.ToString()),
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
                var AttendaceId = model.AttendaceId;
                var PurchaseBillDate = model.PurchaseBillDate;
                var WorkOrderNo = model.WorkOrderNo;
                var AgencyBillNo = model.AgencyBillNo;
                var AgencyId = model.AgencyId;
                var DeptId = model.DeptId;
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
                var BillType = model.BillType;
                var userId = User.FindFirst("UserId")?.Value;
                SortedList parameters = new SortedList
                    {
                    { "@AgencyBillId", 0 },
                    { "@BillDate", PurchaseBillDate },
                    { "@WorkOrderNo", WorkOrderNo },
                    { "@NoOfResource", NoOfResources },
                    { "@BillforMonth", MonthYear },
                    { "@AttendanceId", AttendaceId },
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
                    { "@BillType", BillType },
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

        // Get record for the List
        [HttpGet]
        public async Task<IActionResult> GetChallanListRecord([FromQuery] DepositeChallanFilter filter)

        {
            var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
            var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@ChallanId", filter.ChallanId);
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@ChallanType", filter.ChallanType);
                parameters.Add("@MonthYear", filter.MonthYear);
                parameters.Add("@CreatedBy", userId);
                parameters.Add("@Userrole", roleId);
                var dt = await _cn.FillDataTableAsync("TallyEsiEpfChallan_List", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DepositeChallanListModel>());
                var list = dt.AsEnumerable().Select(row => new DepositeChallanListModel
                {
                    AgencyId = (row["AgencyId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyId"].ToString()))
                    ? 0 : Convert.ToInt32(row["AgencyId"]),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    ChallanId = (row["ChallanId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["ChallanId"].ToString()))
                    ? 0 : Convert.ToInt32(row["ChallanId"]),
                    ChallanType = (row["ChallanType"]?.ToString()),
                    ChallanNumber = (row["ChallanNumber"]?.ToString()),
                    ChallanDate = (row["ChallanDate"]?.ToString()),
                    NoOfHPSEDCResource = (row["NoOfResource"] == DBNull.Value || string.IsNullOrWhiteSpace(row["NoOfResource"].ToString()))
                    ? 0 : Convert.ToInt32(row["NoOfResource"]),
                    ChallanAmount= Convert.ToDecimal(row["Amount"]?.ToString()),
                    VerificationRemarks = (row["VerificationRemarks"]?.ToString()),
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
        public async Task<IActionResult> AddOrEdit_ESIEPFChallanDepositeRecord([FromForm] DepositeChallanSubmitModel model)
        {
            try
            {
                // LOGIN USER DETAILS
                var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
                var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
                // MODEL VALUES
                var ChallanId = model.ChallanId;
                var ChallanFor = model.ChallanFor;
                var ChallanNumber = model.ChallanNumber;
                var BankName = model.BankName;
                var AgencyId = model.AgencyId;
                var BillForMonth = model.BillForMonth;
                var ChallanDate = model.ChallanDate;
                var ChallanAmount = model.ChallanAmount;
                var NoOfResource = model.NoOfResource;
                var IsDeclaration = model.IsDeclaration;
                // FILES
                IFormFile attachmentFile1 = model.AttacheChallan;
                IFormFile attachmentFile2 = model.AttacheChallanDetails;

                // Attache Challan Payment file 
                if (attachmentFile1 == null || attachmentFile1.Length == 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Challan Payment file is required."
                    });
                }
                if (attachmentFile2 == null || attachmentFile2.Length == 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = " Emp Details file is required."
                    });
                }
                // SAVE AttacheChallan FILE
                string AttacheChallan = "";
                if (attachmentFile1 != null && attachmentFile1.Length > 0)
                {
                    string folderPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/Attachment/ESIEPFChallan"
                    );
                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);
                    string extension = Path.GetExtension(attachmentFile1.FileName);
                    AttacheChallan =
                        $"AttacheChallan{DateTime.Now:yyyyMMddHHmmss}_{Guid.NewGuid()}{extension}";
                    string filePath = Path.Combine(folderPath, AttacheChallan);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile1.CopyToAsync(stream);
                    }
                }
                // SAVE AttacheChallanDetails FILE
                string AttacheChallanDetails = "";
                if (attachmentFile2 != null && attachmentFile2.Length > 0)
                {
                    string folderPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/Attachment/AttacheChallanDetails"
                    );
                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);
                    string extension = Path.GetExtension(attachmentFile2.FileName);
                    AttacheChallanDetails =
                        $"AttacheChallanDetails_{DateTime.Now:yyyyMMddHHmmss}_{Guid.NewGuid()}{extension}";
                    string filePath = Path.Combine(folderPath, AttacheChallanDetails);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile2.CopyToAsync(stream);
                    }
                }
                SortedList parameters = new SortedList
        {
            { "@ChallanId", ChallanId },
            { "@ChallanFor", ChallanFor },
            { "@ChallanNumber",  ChallanNumber},
            { "@BankName",  BankName},
            { "@AgencyId", AgencyId },
            { "@BillForMonth",  BillForMonth},
            { "@ChallanDate", ChallanDate  },
            { "@Amount",  ChallanAmount},
            { "@AttacheChallan",  AttacheChallan},
            { "@AttacheChallanDetails",  AttacheChallanDetails },
            { "@NoOfResource",  NoOfResource},
            { "@UploadedBy", userId },
            { "@IsDeclaration", IsDeclaration },
        };
                // SAVE TO DATABASE
                var result = _cn.ExecuteNonQueryWMessage(
                    "TallyEsiEpfChallan_AcceptUpdate",
                    "",
                    parameters
                );
                // SUCCESS RESPONSE
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

        #region Map Challan Invoice
        public IActionResult MapChallanInvoice()
        {
            return View();
        }

        // Get record for the List
        [HttpGet]
        public async Task<IActionResult> GetMapChallanInvoiceRecord([FromQuery] MapChallanFilter filter)

        {
            var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
            var roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@MonthYear", filter.MonthYear);
                parameters.Add("@ChallanId", filter.ChallanId);
                parameters.Add("@ChallanType", filter.ChallanType);
                parameters.Add("@CreatedBy", userId);
                parameters.Add("@RoleId", roleId);
                var dt = await _cn.FillDataTableAsync("TallyEsiEpfChallanVsBill_List", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<MapChallanViewModel>());
                var list = dt.AsEnumerable().Select(row => new MapChallanViewModel
                {
                    AgencyBillId = (row["AgencyId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyId"].ToString()))
                    ? 0 : Convert.ToInt32(row["AgencyId"]),
                    AgencyBillNo = (row["Billno"]?.ToString()),
                    AgencyId = (row["AgencyId"] == DBNull.Value || string.IsNullOrWhiteSpace(row["AgencyId"].ToString()))
                    ? 0 : Convert.ToInt32(row["AgencyId"]),
                    AgencyName = (row["AgencyName"]?.ToString()),
                    BillForMonth = Convert.ToInt32(row["BillforMonth"]?.ToString()),
                    TotalResource = Convert.ToInt32(row["NoOfResource"]?.ToString()),
                   
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

        //Submit Data
        [HttpPost]
        public async Task<IActionResult> AddOrEdit_MapChallanInvoiceRecord([FromForm] DeptPurchaseInvoiceModel model)
        {
            try
            {
                //var Id = model.Id;
                var AttendaceId = model.AttendaceId;
                var PurchaseBillDate = model.PurchaseBillDate;
                var WorkOrderNo = model.WorkOrderNo;
                var AgencyBillNo = model.AgencyBillNo;
                var AgencyId = model.AgencyId;
                var DeptId = model.DeptId;
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
                var BillType = model.BillType;
                var userId = User.FindFirst("UserId")?.Value;
                SortedList parameters = new SortedList
                    {
                    { "@AgencyBillId", 0 },
                    { "@BillDate", PurchaseBillDate },
                    { "@WorkOrderNo", WorkOrderNo },
                    { "@NoOfResource", NoOfResources },
                    { "@BillforMonth", MonthYear },
                    { "@AttendanceId", AttendaceId },
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
                    { "@BillType", BillType },
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


        //tblTallyAttendanceEmpwise_AcceptUpdate Completed 
        //TallyFetchEmployee_Get  Complted  
        //tblTallyAttendanceDetails_Get Completed
        //TallyAgencyBill_AcceptUpdate completed
        //TallyAgencyBill1_List

    }
}
