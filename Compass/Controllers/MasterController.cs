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
    //[Authorize]
    public class MasterController : Controller
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        private readonly string _connectionString;
        public MasterController(ISqlDataAccess db, IMemoryCache cache, IConfiguration configuration)
        {
            _cn = db;
            _cache = cache;
            _connectionString = configuration.GetConnectionString("TestConnection");
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
        
        [HttpPost("AddEdit")]
        public IActionResult AddOrEditRecord(TestModel test)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(test.Field1) ||
                    string.IsNullOrWhiteSpace(test.Field2))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Country Name and Country Code are required."
                    });
                }

                SortedList parameters = new SortedList();
                parameters.Add("@id", test.Id);
                parameters.Add("@field1", test.Field1);
                parameters.Add("@field2", test.Field2);

                var userId = User.FindFirst("UserId")?.Value;
                parameters.Add("@CreatedBy", userId);

                var result = _cn.ExecuteNonQueryWMessage(
                    "TestRecord_AcceptUpdate",
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

        [HttpGet]
        public async Task<IActionResult> GetRecord([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;

                SortedList parameters = new SortedList();
                parameters.Add("@Id", id);

                var dt = await _cn.FillDataTableAsync("TestRecord_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<TestModel>());

                var list = dt.AsEnumerable().Select(row => new TestModel
                {
                    Id = Convert.ToInt32(row["Id"]),
                    Field1 = row["Field1"]?.ToString(),
                    Field2 = row["Field2"]?.ToString()
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
        [HttpPost]
        //Multiple Record in json with out file
        public IActionResult AddOrEditRecord1([FromBody] Tt1 model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Field1) || string.IsNullOrWhiteSpace(model.Field2))
                {
                    return BadRequest(new { success = false, message = "Field1 and Field2 are required." });
                }

                SortedList parameters = new SortedList();
                parameters.Add("@Id", model.Id);
                parameters.Add("@Field1", model.Field1);
                parameters.Add("@Field2", model.Field2);

                // nested object values
                parameters.Add("@CreatedBy", model.Meta?.CreatedBy ?? "System");
                parameters.Add("@Notes", model.Meta?.Notes ?? "");

                var result = _cn.ExecuteNonQueryWMessage("TestRecord_AcceptUpdate", "", parameters);

                return Ok(new { success = true, message = result.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Server error.", error = ex.Message });
            }
        }
        [HttpPost]
        //submit  Record  with file Attachemnt
        [HttpPost]
        public async Task<IActionResult> AddOrEditRecordWithFile([FromForm] Tt1WithFile model)
        {
            try
            {
               // var data = JsonConvert.DeserializeObject<Tt1>(model);

                if (string.IsNullOrWhiteSpace(model.Field1) ||
                    string.IsNullOrWhiteSpace(model.Field2))
                {
                    return BadRequest(new { success = false, message = "Field1 and Field2 are required." });
                }

                // ✅ Save file if exists
                if (model.File != null && model.File.Length > 0)
                {
                    var filePath = Path.Combine("wwwroot/testupload", model.File.FileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.File.CopyToAsync(stream);
                    }
                }

                return Ok(new { success = true, message = "Saved successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        [HttpPost]
        // Store data in one to many relation form
public async Task<IActionResult> SaveOrder([FromBody] OrderModel model)
{
            if (model == null)
            {
                return BadRequest("Model is null");
            }

            using SqlConnection con = new SqlConnection(_connectionString);
    using SqlCommand cmd = new SqlCommand("InsertOrderWithItems", con);

    cmd.CommandType = CommandType.StoredProcedure;

    cmd.Parameters.AddWithValue("@CustomerName", model.CustomerName);
    cmd.Parameters.AddWithValue("@OrderDate", model.OrderDate);

    // Convert child list to DataTable
    DataTable dt = new DataTable();
    dt.Columns.Add("ProductName", typeof(string));
    dt.Columns.Add("Quantity", typeof(int));
    dt.Columns.Add("Price", typeof(decimal));

    foreach (var item in model.Items)
    {
        dt.Rows.Add(item.ProductName, item.Quantity, item.Price);
    }

    SqlParameter tvpParam = cmd.Parameters.AddWithValue("@Items", dt);
    tvpParam.SqlDbType = SqlDbType.Structured;
    tvpParam.TypeName = "OrderItemType";
            // ✅ Correct Output Parameter
            SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
            mesParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(mesParam);

            await con.OpenAsync();
    await cmd.ExecuteNonQueryAsync();
            string message = mesParam.Value?.ToString();
            return Ok(new { success = true, message = message });

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