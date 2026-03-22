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
        public IActionResult PurchaseBillVerification()
        {
            return View();
        }
        // Get record for the List
        [HttpGet]
        public async Task<IActionResult> GetPurchaseBillRecord([FromQuery] PInvoiceFilter filter)

        {
            try
            {
                // Access as object
                SortedList parameters = new SortedList();
               // parameters.Add("@Id", filter.Id);
                parameters.Add("@AgencyBillId", filter.AgencyBillId);
                parameters.Add("@MonthId", filter.MonthId);
                parameters.Add("@AgencyId", filter.AgencyId);
                parameters.Add("@DeptId", filter.DeptId);
                parameters.Add("@PaymentStatus", filter.PaymentStatus);
                


                var dt = await _cn.FillDataTableAsync("TallyPurchaseVerification_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<PInvoiceViewModel>());

                var list = dt.AsEnumerable().Select(row => new PInvoiceViewModel

                {
                    Id = (row["AgencyBillId"]?.ToString()),
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


    }
}
