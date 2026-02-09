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
    //[Authorize]
    public class MasterController : Controller
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        public MasterController(ISqlDataAccess db, IMemoryCache cache)
        {
            _cn = db;
            _cache = cache;
        }

        #region Country
        public IActionResult Dashboard()
        {
            try
            {
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                List<Dictionary<string, object>> dropdown_list;
                var parameters = new SortedList
                {
                   { "@UserId", userId },
                   { "@UserRole", roleId }
               };

                DataTable dt = _cn.FillDataTable("HpsedcDashBoardModule_List", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return NotFound("No Role found.");

                // Convert DataTable to List<Dictionary<string, object>>
                //dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                //return Ok(dropdown_list);
                return View(dt);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
           
            //DataSet ds = new DataSet();
            // = comfun.fillDataSet("stpProductdropown_list", null, null);
            //  return View();
        }
        #region Test
        public IActionResult Test()
        {
            return View();
        }
        [HttpPost]
        public IActionResult AddOrEditRecord()
        {
            try
            {
                var fid = Request.Form["Id"].ToString();
                var field1 = Request.Form["Field1"].ToString();
                var field2 = Request.Form["Field2"].ToString();

                if (string.IsNullOrWhiteSpace(field1) || string.IsNullOrWhiteSpace(field1))
                {
                    return BadRequest(new { success = false, message = "Country Name and Country Code are required." });
                }
                SortedList parameters = new SortedList();
                parameters.Add("@id", fid);
                parameters.Add("@field1", field1);
                parameters.Add("@field2", field2);

                bool isEdit = !string.IsNullOrEmpty(fid) && int.TryParse(fid, out int id) && id > 0;
                string returnMsg = string.Empty;
                var userId = User.FindFirst("UserId")?.Value;
                if (isEdit)
                {
                   // parameters.Add("@id", fid);
                    parameters.Add("@CreatedBy", userId);
                }
                else
                {
                   // parameters.Add("@id", 0);
                    parameters.Add("@CreatedBy", userId);
                }
                var result = _cn.ExecuteNonQueryWMessage("TestRecord_AcceptUpdate", "", parameters);
                returnMsg = result.ToString();

                return Ok(new { success = true, message = returnMsg });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Server error.", error = ex.Message });
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetRecord()
        {
            try
            {
                var dt = await _cn.FillDataTableAsync("TestRecord_List", "", null);

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

        #endregion
        public IActionResult Country()
        {

            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetCountries()
        {
            try
            {
                var dt = await _cn.FillDataTableAsync("stpCountryList", "", null);

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
       
        [HttpPost]
        public IActionResult AddOrEditCountry()
        {
            try
            {
                var countryId = Request.Form["CountryId"].ToString();
                var countryName = Request.Form["CountryName"].ToString();
                var countryCode = Request.Form["CountryCode"].ToString();

                if (string.IsNullOrWhiteSpace(countryName) || string.IsNullOrWhiteSpace(countryCode))
                {
                    return BadRequest(new { success = false, message = "Country Name and Country Code are required." });
                }
                SortedList parameters = new SortedList();
                parameters.Add("@CountryName", countryName);
                parameters.Add("@CountryCode", countryCode);

                bool isEdit = !string.IsNullOrEmpty(countryId) && int.TryParse(countryId, out int id) && id > 0;
                string returnMsg = string.Empty;
                if (isEdit)
                {
                    parameters.Add("@CountryId", countryId);
                    parameters.Add("@CreatedBy", HttpContext.Session.GetString("EmployeeId"));
                }
                else
                {
                    parameters.Add("@CountryId", 0);
                    parameters.Add("@CreatedBy", HttpContext.Session.GetString("EmployeeId"));
                }
                var result = _cn.ExecuteNonQueryWMessage("stpCountrySave", "", parameters);
                returnMsg = result.ToString();

                return Ok(new { success = true, message = returnMsg });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Server error.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCountryStatus(int countryId, string isActive)
        {
            try
            {
                SortedList parameters = new SortedList();
                parameters.Add("@Id", countryId);
                parameters.Add("@IsActive", isActive);
                parameters.Add("@ModifiedBy", HttpContext.Session.GetString("EmployeeId"));

                var rows = _cn.ExecuteNonQueryWMessage("stpCountryStatusUpdate", "", parameters);

                return Ok(new { success = true, message = rows });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        #endregion

        
    }
}