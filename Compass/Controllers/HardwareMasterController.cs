using ClosedXML.Excel;
using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System.Collections;
using System.Data;
using System.Text;
using System.Text.Json;
using wfms_ddl;
using Compass.Classes;


namespace Compass.Controllers
{
    public class HardwareMasterController : Controller
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        public HardwareMasterController(ISqlDataAccess db, IMemoryCache cache)
        {
            _cn = db;
            _cache = cache;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
