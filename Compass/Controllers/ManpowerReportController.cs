//using ClosedXML.Excel;
//using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
//using Newtonsoft.Json;
using System.Collections;
using System.Data;
using System.Text;
using System.Text.Json;
using wfms_ddl;
using Compass.Classes;
//using static Azure.Core.HttpHeader;
//using DocumentFormat.OpenXml.Spreadsheet;
using System.Security.Claims;


namespace Compass.Controllers
{

    public class ManpowerReportController : Controller
    {
        private readonly ISqlDataAccess _db;
        private readonly IMemoryCache _cache;
        public ManpowerReportController(ISqlDataAccess db, IMemoryCache cache)
        { 
            _db = db;
            _cache = cache;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
