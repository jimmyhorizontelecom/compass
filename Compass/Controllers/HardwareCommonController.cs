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
    public class HardwareCommonController : Controller
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        public HardwareCommonController(ISqlDataAccess db, IMemoryCache cache)
        { 
            _cn = db;
            _cache = cache;
        }
        public async Task<IActionResult> PMainCategory_ddl(int Id,int MainCatgId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@Id", Id);
                parameters.Add("@MainCatgId", MainCatgId);
                // Cache miss → fetch from database
                var dt = await _cn.FillDataTableAsync(procName: "HardwareProductategory_List", "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }



        public IActionResult Index()
        {
            return View();
        }

        //get main category list
        public async Task<IActionResult> PMainCategory_ddl(int Id)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@Id", Id);

                // Cache miss → fetch from database
                var dt = await _cn.FillDataTableAsync(procName: "PiMainCategory_list", "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        //get  company list
        public async Task<IActionResult> Company_ddl(int Id)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@Id", Id);

                // Cache miss → fetch from database
                var dt = await _cn.FillDataTableAsync(procName: "PiMainCategory_list", "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        //get  Product list
        public async Task<IActionResult> Product_ddl(int Id, int MainCategoryId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@Id", Id);
                parameters.Add("@MainCategoryId", MainCategoryId);

                // Cache miss → fetch from database
                var dt = await _cn.FillDataTableAsync(procName: "HardwareMasterProduct_List", "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        //get  Department ddl 
        public async Task<IActionResult> Department_ddl(int DeptId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@DeptId", DeptId);

                // Cache miss → fetch from database
                var dt = await _cn.FillDataTableAsync(procName: "TallyAgencyDepartment1_list", "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        // get Destrict ddl
        public async Task<IActionResult> Destrict_ddl(int StateId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@StateId", StateId);

                // Cache miss → fetch from database
                var dt = await _cn.FillDataTableAsync(procName: "stpDistrictddl", "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
    }
}
