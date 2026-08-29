using ClosedXML.Excel;
using Compass.Classes;
using Compass.Models.Filter;
using Compass.Models.Hardware;
using Compass.Models.Test;
using DocumentFormat.OpenXml.Bibliography;
//using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.Office.Word;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Office2013.Drawing.ChartStyle;

//using DocumentFormat.OpenXml.Office2013.Drawing.ChartStyle;
using DocumentFormat.OpenXml.Presentation;
using DocumentFormat.OpenXml.Wordprocessing;
using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Net;
using System.Net.Mail;
using System.Runtime.Intrinsics.Arm;
using System.Security.AccessControl;
using System.Text;
using System.Text.Json;
using wfms_ddl;



namespace Compass.Controllers
{


    public class PIController : Controller
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        private readonly string _connectionString;
        public PIController(ISqlDataAccess db, IMemoryCache cache, IConfiguration configuration)
        {
            _cn = db;
            _cache = cache;
            _connectionString = configuration.GetConnectionString("TestConnection");
        }

        #region Term & Condition
        public IActionResult PiTermCondition()
        {
            return View();
        }
        // get Record PI Term Condition Main List
        public async Task<IActionResult> GetPITermConditionRecord([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;

                SortedList parameters = new SortedList();
                parameters.Add("@TrId", 0);

                var dt = await _cn.FillDataTableAsync("HardwareTerm_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<TermConditionViewModal>());

                var list = dt.AsEnumerable().Select(row => new TermConditionViewModal
                {
                    TrId = Convert.ToInt32(row["TrId"]),
                    TermsAndConditionName = row["CategoryName"]?.ToString(),
                    TermsAndConditionDetails = row["ConditionName"]?.ToString(),
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
        // get Submit Record From Terms And Condition
        [HttpPost]
        public async Task<IActionResult> SubmitTermsConditionRecord([FromForm] string TermCondition)
        {
            var model = JsonConvert.DeserializeObject<TermsConditionModal>(TermCondition);

            if (model == null)
            {
                return BadRequest("Model is null");
            }
            var roleId = User.FindFirst("RoleId")?.Value;
            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwareTerm_SaveUpdate", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@TrId", model.TrId);
            cmd.Parameters.AddWithValue("@TrCatgId", model.TrCatgId);
            cmd.Parameters.AddWithValue("@ConditionName", model.ConditionName);
            cmd.Parameters.AddWithValue("@IsActive", 'Y');
            cmd.Parameters.AddWithValue("@CreatedBy ", userId);





            // ✅ Correct Output Parameter
            SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
            mesParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(mesParam);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
            string message = mesParam.Value?.ToString();
            return Ok(new { success = true, message = message });

        }
        public async Task<IActionResult> GetRecordTermandCondition([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int trid = filter.FilterId1;

                SortedList parameters = new SortedList();
                parameters.Add("@TrId", trid);

                var dt = await _cn.FillDataTableAsync("HardwareTerm_ListEdit", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<TermConditionViewModal>());

                var list = dt.AsEnumerable().Select(row => new TermConditionViewModal
                {
                    TrCatgId = Convert.ToInt32(row["TrCatgId"]),
                    TermsAndConditionName = row["CategoryName"]?.ToString(),
                    TermsAndConditionDetails = row["ConditionName"]?.ToString()
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
        #endregion


        #region Add Term Condition
        public IActionResult AddTermCondition()
        {
            return View();
        }
        // get Record Add Term Condition Main List
        public async Task<IActionResult> GetRecordTermTypeCondition([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;

                SortedList parameters = new SortedList();
                parameters.Add("@TrCatgId", 0);

                var dt = await _cn.FillDataTableAsync("HardwareTermType_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<TermTypeConditionViewModal>());

                var list = dt.AsEnumerable().Select(row => new TermTypeConditionViewModal
                {
                    TrCatgId = Convert.ToInt32(row["TrCatgId"]),
                    TermsAndConditionName = row["CategoryName"]?.ToString(),
                    TermsAndConditionType = row["TermType"]?.ToString(),
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
        // get Submit Record Add Term Type Condition
        public async Task<IActionResult> SubmitTermsTypeConditionRecord([FromForm] string TermCondition)
        {
            var model = JsonConvert.DeserializeObject<AddTypeTermsConditionModal>(TermCondition);

            if (model == null)
            {
                return BadRequest("Model is null");
            }
            var roleId = User.FindFirst("RoleId")?.Value;
            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwareTermType_Save", con);

            cmd.CommandType = CommandType.StoredProcedure;


            cmd.Parameters.AddWithValue("@TrCatgId", model.TrCatgId);
            cmd.Parameters.AddWithValue("@CategoryName", model.CategoryName);
            cmd.Parameters.AddWithValue("@TypeId", model.TypeId);
            cmd.Parameters.AddWithValue("@CreatedBy ", userId);





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
     
        
        #region Terms & Condition Mapping
        public IActionResult TermsAndConditionMapping()
        {
            return View();
        }
        // get Record Terms And Condition Mapping List
        public async Task<IActionResult> GetRecordTermsMappingCondition([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;

                SortedList parameters = new SortedList();
                parameters.Add("@ProductId", 0);

                var dt = await _cn.FillDataTableAsync("HardwareRcProductTermConditionr_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<TermsMappConditionViewModal>());

                var list = dt.AsEnumerable().Select(row => new TermsMappConditionViewModal
                {
                    ProductId = Convert.ToInt32(row["ProductId"]),
                    ProductCategoryName = row["ProductCategory"]?.ToString(),

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
        // get Record from Map Terms and Condition List
        public async Task<IActionResult> getRecordMappCondition([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;

                SortedList parameters = new SortedList();
                parameters.Add("@TrId", 0);

                var dt = await _cn.FillDataTableAsync("HardwareTerm_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<TermsMappingPopUpViewModal>());

                var list = dt.AsEnumerable().Select(row => new TermsMappingPopUpViewModal
                {
                    TrId = Convert.ToInt32(row["TrId"]),
                    TrCatgId = Convert.ToInt32(row["TrCatgId"]),
                    CategoryName = row["CategoryName"]?.ToString(),
                    ConditionName = row["ConditionName"]?.ToString(),
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
        // get Submit Record Mapping Condition
        public async Task<IActionResult> SubmitMappingTermsConditionRecord([FromForm] string TermConditionMap)
        {
            var model = JsonConvert.DeserializeObject<MapTermAndConditionModal>(TermConditionMap);

            if (model == null)
            {
                return BadRequest("Model is null");
            }

            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwareProductTermConditionMap_AcceptUpdate", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Id ", model.Id);
            cmd.Parameters.AddWithValue("@CreatedBy ", userId);
            // Convert child list to DataTable
            System.Data.DataTable dt = new System.Data.DataTable();
            dt.Columns.Add("ProductId", typeof(int));
            dt.Columns.Add("TermconditionId", typeof(int));



            foreach (var item in model.Items)
            {
                dt.Rows.Add(item.ProductId, item.TermconditionId);
            }

            SqlParameter tvpParam = cmd.Parameters.AddWithValue("@HardwareProductTermConditionMap", dt);
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.TypeName = "HardwareProductTermConditionMap";
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
        
        
        #region Pi Sale Order
        public IActionResult PiSaleOrder()
        {
            return View();
        }
        // get Record From Table Pi Sale Order List
        public async Task<IActionResult> getCartItemList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@PiIdNO", id);
                parameters.Add("@CreatedBy", userId);



                var dt = await _cn.FillDataTableAsync("HardwareCartProduct_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<CartItemViewModal>());

                var list = dt.AsEnumerable().Select(row => new CartItemViewModal


                {

                    ProductId = row["ProductId"] == DBNull.Value ? 0 : Convert.ToInt32(row["ProductId"]),
                    PiId = row["PiId"] == DBNull.Value ? 0 : Convert.ToInt32(row["PiId"]),
                    ProductName = row["ProductName"]?.ToString(),
                    BasePrice = row["UnitBasePrice"] == DBNull.Value ? 0m : Convert.ToDecimal(row["UnitBasePrice"]),
                    AdminCharge = row["AdminAmt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["AdminAmt"]),
                    Gst = row["GstAmt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["GstAmt"]),
                    GTotal = row["GrandTotal"] == DBNull.Value ? 0m : Convert.ToDecimal(row["GrandTotal"]),
                    Qty = row["OrderQty"] == DBNull.Value ? 0m : Convert.ToDecimal(row["OrderQty"]),
                    TotalAmount = row["GrandTotal"] == DBNull.Value ? 0m : Convert.ToDecimal(row["GrandTotal"]),


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
        // get Submit Generate PI Sale Order        
        public async Task<IActionResult> SubmitPISaleGenerateOrder([FromForm] string PISaleGenerate,
     IFormFile PIDepartment)

        {
            var model = JsonConvert.DeserializeObject<PISaleGenerateModel>(PISaleGenerate);

            IFormFile attachmentFile1 = PIDepartment;

            string PIAttachment = "";
            if (attachmentFile1 != null && attachmentFile1.Length > 0)
            {
                string folderPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/Attachment/PI"
                );

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string extension = Path.GetExtension(attachmentFile1.FileName);

                PIAttachment = $"PIConfirmation_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                string filePath = Path.Combine(folderPath, PIAttachment);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await attachmentFile1.CopyToAsync(stream);
                }
            }


            if (model == null)
            {
                return BadRequest("Model is null");
            }

            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwareSaleOrderWithPi_AcceptUpdate1", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@SaleOrderId", model.SaleOrderId);
            cmd.Parameters.AddWithValue("@PiId", model.PiId);
            cmd.Parameters.AddWithValue("@OrderDate", model.OrderDate);
            cmd.Parameters.AddWithValue("@DeptId ", model.DeptId);
            cmd.Parameters.AddWithValue("@BillingAddressId", model.BillingAddressId);
            cmd.Parameters.AddWithValue("@BillingAddressText", model.BillingAddressText);
            cmd.Parameters.AddWithValue("@LetterReferenceNo", model.LetterReferenceNo);
            cmd.Parameters.AddWithValue("@OrderEntryDate", model.OrderEntryDate);
            cmd.Parameters.AddWithValue("@Total", model.Total);
            cmd.Parameters.AddWithValue("@Cgst", model.Cgst);
            cmd.Parameters.AddWithValue("@Sgst", model.Sgst);
            cmd.Parameters.AddWithValue("@Gst", model.Gst);
            cmd.Parameters.AddWithValue("@AdminCharge", model.AdminCharge);
            cmd.Parameters.AddWithValue("@Gtotal", model.Gtotal);
            cmd.Parameters.AddWithValue("@DeliveryAttachement ", PIAttachment);
            cmd.Parameters.AddWithValue("@CreatedBy", userId);


            // Convert child list to DataTable
            System.Data.DataTable dt = new System.Data.DataTable();

            dt.Columns.Add("ProductId", typeof(int));
            dt.Columns.Add("OrderQty", typeof(decimal));
            dt.Columns.Add("Narration", typeof(int));
            dt.Columns.Add("DeliveryDay", typeof(int));



            foreach (var item in model.Items)
            {
                dt.Rows.Add(item.ProductId, item.OrderQty, item.Narration, item.DeliveryDay);
            }

            SqlParameter tvpParam = cmd.Parameters.AddWithValue("@TempHardwarPiSaleOrder", dt);
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.TypeName = "TempHardwarPiSaleOrder1";
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


        #region PIAddress
        public IActionResult PIAddress()
        {
            return View();
        }
        // get PI Address Main List
        public async Task<IActionResult> GetPIAddressList([FromQuery] TestFilterData filter)


        {
            try
            {
                // Access as object
                int id = filter.FilterId1;

                SortedList parameters = new SortedList();
                parameters.Add("@PiAddressId", id);
                parameters.Add("@DeptId", 0);

                var dt = await _cn.FillDataTableAsync("HardwareDeparmentPiAddress_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<PIAddressViewModal>());

                var list = dt.AsEnumerable().Select(row => new PIAddressViewModal
                {
                    PiAddressId = Convert.ToInt32(row["PiAddressId"]),
                    departmentName = row["departmentName"]?.ToString(),
                    departmentID = Convert.ToInt32(row["departmentID"]),
                    Designation = row["Designation"]?.ToString(),
                    AddressText = row["AddressText"]?.ToString(),
                    EmailId = row["EmailId"]?.ToString(),
                    ContactNo = row["ContactNo"]?.ToString(),

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
        // Update Record of PI Address
        public async Task<IActionResult> UpdateRecordPIAddress([FromForm] string PIAddress)
        {
            var model = JsonConvert.DeserializeObject<UpdatePIAddressViewModal>(PIAddress);

            if (model == null)
            {
                return BadRequest("Model is null");
            }
            var roleId = User.FindFirst("RoleId")?.Value;
            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwareDeparmentPiAddress_AcceptUpdate", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@PiAddressId", model.PiAddressId);
            cmd.Parameters.AddWithValue("@DeptId", model.DeptId);
            cmd.Parameters.AddWithValue("@AddressText", model.AddressText);
            cmd.Parameters.AddWithValue("@EmailId", model.EmailId);
            cmd.Parameters.AddWithValue("@ContactNo", model.ContactNo);
            cmd.Parameters.AddWithValue("@IsActive", 'Y');
            cmd.Parameters.AddWithValue("@Designation", model.Designation);
            cmd.Parameters.AddWithValue("@CreatedBy ", userId);





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

        public IActionResult Index()
        {
            return View();
        }



    }

}
