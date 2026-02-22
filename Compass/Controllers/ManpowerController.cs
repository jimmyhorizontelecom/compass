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
