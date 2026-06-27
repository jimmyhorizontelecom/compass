//using ClosedXML.Excel;
//using ExcelDataReader;
using Compass.Classes;
using Compass.Models.Filter;
using Compass.Models.Test;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

//using Newtonsoft.Json;
using System.Collections;
using System.Data;
//using static Azure.Core.HttpHeader;
//using DocumentFormat.OpenXml.Spreadsheet;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using wfms_ddl;

namespace Compass.Controllers
{
    public class TestController : Controller
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        private readonly string _connectionString;
        public TestController(ISqlDataAccess db, IMemoryCache cache, IConfiguration configuration)
        {
            _cn = db;
            _cache = cache;
            _connectionString = configuration.GetConnectionString("TestConnection");
        }
        #region NewTest
        
        public IActionResult TestPage()
        { 
            return View();
        }
        #endregion

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Test()
        {
            return View();
        }
        public IActionResult GetInvoiceData()
        {
            var data = new
            {
                invoiceNo = "INV-1001",
                date = DateTime.Now.ToString("dd-MM-yyyy"),
                customer = "Hassana Siddiqui",
                items = new List<object>
 {
     new { name="Item A", qty=2, price=100, CGST=9, SGST=9 },
     new { name="Item B", qty=1, price=200, CGST=18, SGST=18 },
     new { name="Item A", qty=2, price=100, CGST=9, SGST=9 },
     new { name="Item B", qty=1, price=200, CGST=18, SGST=18 },
     new { name="Item A", qty=2, price=100, CGST=9, SGST=9 },
     new { name="Item B", qty=1, price=200, CGST=18, SGST=18 },
     new { name="Item A", qty=2, price=100, CGST=9, SGST=9 },
     new { name="Item B", qty=1, price=200, CGST=18, SGST=18 },
     new { name="Item A", qty=2, price=100, CGST=9, SGST=9 },
     new { name="Item B", qty=1, price=200, CGST=18, SGST=18 },
     new { name="Item A", qty=2, price=100, CGST=9, SGST=9 },
     new { name="Item B", qty=1, price=200, CGST=18, SGST=18 },
     new { name="Item A", qty=2, price=100, CGST=9, SGST=9 },
     new { name="Item B", qty=1, price=200, CGST=18, SGST=18 },
      new { name="Item A", qty=2, price=100, CGST=9, SGST=9 },
     new { name="Item B", qty=1, price=200, CGST=18, SGST=18 },
     new { name="Item A", qty=2, price=100, CGST=9, SGST=9 },
     new { name="Item B", qty=1, price=200, CGST=18, SGST=18 },
     new { name="Item A", qty=2, price=100, CGST=9, SGST=9 },
     new { name="Item B", qty=1, price=200, CGST=18, SGST=18 },
      new { name="Item A", qty=2, price=100, CGST=9, SGST=9 },
     new { name="Item B", qty=1, price=200, CGST=18, SGST=18 },
     new { name="Item A", qty=2, price=100, CGST=9, SGST=9 },
     new { name="Item B", qty=1, price=200, CGST=18, SGST=18 }
 }
            };

            return Ok(data);
        }
    }
}
