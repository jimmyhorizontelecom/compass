using ClosedXML.Excel;
using Compass.Classes;
using Compass.Models.Filter;
using Compass.Models.Hardware;
using Compass.Models.Test;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Wordprocessing;
using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
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
        #region Company
        public IActionResult Company()
        {
            return View();
        }
        [HttpGet]
        // get Record Company List
        public async Task<IActionResult> GetCompanyRecord([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;

                SortedList parameters = new SortedList();
                parameters.Add("@Id", id);

                var dt = await _cn.FillDataTableAsync("PiCompany_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<Company>());

                var list = dt.AsEnumerable().Select(row => new Company
                {
                    Id = Convert.ToInt32(row["Id"]),
                    CompanyName = row["CompanyName"]?.ToString(),
                    IsActive = row["IsActive"] != DBNull.Value ? row["IsActive"].ToString()[0] : 'N'
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
        [HttpPost]
        public IActionResult AddOrEditCompany(Company model)
        { 
            try
            {
                if (string.IsNullOrWhiteSpace(model.CompanyName) || string.IsNullOrWhiteSpace(model.CompanyName))
                {
                    return BadRequest(new { success = false, message = "Company Name are required." });
                }

                SortedList parameters = new SortedList();

                parameters.Add("@Id", model.Id);
                parameters.Add("@CompanyName", model.CompanyName);
                parameters.Add("@Description", "");
                parameters.Add("@IsActive", model.IsActive);

                //var userId = User.FindFirst("UserId")?.Value;
                //parameters.Add("@CreatedBy", userId);

                var result = _cn.ExecuteNonQueryWMessage("PiCompany_AcceptUpdate", "", parameters);

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

        #region ProductCategory
        public IActionResult HardwareProductCategory()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> AddOrEditProductSubCatg()
        {
            try
            {
                var Id = Request.Form["Id"].ToString();
                var MainCatgId = Request.Form["MainCatgId"].ToString();
                var Title = Request.Form["Title"].ToString();
                var IsActive = Request.Form["IsActive"].ToString();

                // ✅ Get uploaded file
                IFormFile attachmentFile = Request.Form.Files["Attachment"];

                if (string.IsNullOrWhiteSpace(Title))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Product Name is required."
                    });
                }

                string fileName = "";
                if (attachmentFile != null && attachmentFile.Length > 0)
                {
                    fileName = Guid.NewGuid() + Path.GetExtension(attachmentFile.FileName);
                    var filePath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/Attachment/ProductCatg",
                        fileName
                    );

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile.CopyToAsync(stream);
                    }
                }

                SortedList parameters = new SortedList
        {
            { "@Id", Id },
            { "@MainCatgId", MainCatgId },
            { "@Title", Title },
            { "@Attachement", fileName }, // save filename
            { "@IsActive", IsActive }
        };

                var result = _cn.ExecuteNonQueryWMessage(
                    "HardwareCategory_AcceptUpdate",
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

        [HttpGet]
        public async Task<IActionResult> GetProductCatg(int Id, int MainCatgId)
        {
            try
            {
                SortedList parameters = new SortedList
        {
            { "@Id", Id },
            { "@MainCatgId", MainCatgId }
        };

                var dt = await _cn.FillDataTableAsync(
                    "HardwareProductategory_List",
                    "",
                    parameters
                );

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<object>());

                var result = CommonMethod.ToList(dt);
                return Ok(result);
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
