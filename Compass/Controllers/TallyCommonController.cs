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
    public class TallyCommonController : Controller
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        public TallyCommonController(ISqlDataAccess db, IMemoryCache cache)
        {
            _cn = db;
            _cache = cache;
        }
        // Main Category ddl
        [HttpGet]
        public async Task<IActionResult> PMainCategory_ddl()
        { 
            var Id= Request.Form["Id"].ToString();
            try
            {
                SortedList parameters = new SortedList();
                parameters.Add("@id", Id);

                var dt = await _cn.FillDataTableAsync("PiMainCategory_list", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<object>());

                var countries = CommonMethod.ToList(dt);

                return Ok(countries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Server error.", error = ex.Message });
            }
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
