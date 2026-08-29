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


    public class PbgController : Controller
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        private readonly string _connectionString;
        public PbgController(ISqlDataAccess db, IMemoryCache cache, IConfiguration configuration)
        {
            _cn = db;
            _cache = cache;
            _connectionString = configuration.GetConnectionString("TestConnection");
        }


        #region Pbg Advance
        public IActionResult PbgAdvanceReport()
        {
            return View();
        }
        // get Record Pbg Advance List
        public async Task<IActionResult> GetPbgAdvanceList([FromQuery] TestFilterData filter)

        {
            try
            {
                // Access as object
                int id = filter.FilterId1;

                SortedList parameters = new SortedList();
                parameters.Add("@Id", id);

                var dt = await _cn.FillDataTableAsync("HardwareAgncyPbgAdvance_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<PbgAdvanceViewModal>());

                var list = dt.AsEnumerable().Select(row => new PbgAdvanceViewModal
                {
                    Id = Convert.ToInt32(row["Id"]),
                    BillFor = row["BillFor"]?.ToString(),
                    BillForId = row["BillForId"]?.ToString(),
                    Pinvid = row["Pinvid"]?.ToString(),
                    BillNO = row["BillNO"]?.ToString(),
                    BGNumber = row["BGNumber"]?.ToString(),
                    IssuanceDate = Convert.ToDateTime(row["IssuanceDate"]).ToString("yyyy-MM-dd"),
                    ExpiryDate = Convert.ToDateTime(row["ExpiryDate"]).ToString("yyyy-MM-dd"),
                    ClaimDate = Convert.ToDateTime(row["ClaimDate"]).ToString("yyyy-MM-dd"),
                    PBGAmt = row["PBGAmt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["PBGAmt"]),
                    RestBalance = row["RestBalance"] == DBNull.Value ? 0m : Convert.ToDecimal(row["RestBalance"]),
                    Remarks = row["Remarks"]?.ToString(),
                    AgencyName = row["AgencyName"].ToString(),
                    AgencyId = row["AgencyId"].ToString(),
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
        // get Submit Pbg Advance Submit
        public async Task<IActionResult> PbgAdvanceSubmit([FromForm] string PbgAdvance,
            IFormFile Pbg)
        {
            var model = JsonConvert.DeserializeObject<PbgAdvanceSubmitModel>(PbgAdvance);
            string ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault();

            if (string.IsNullOrEmpty(ipAddress))
            {
                ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            }

            IFormFile attachmentFile1 = Pbg;

            string PbgAttachment = "";
            if (attachmentFile1 != null && attachmentFile1.Length > 0)
            {
                string folderPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/Attachment/Pbg"
                );

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string extension = Path.GetExtension(attachmentFile1.FileName);

                PbgAttachment = $"PbgAdvance_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                string filePath = Path.Combine(folderPath, PbgAttachment);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await attachmentFile1.CopyToAsync(stream);
                }
            }

            if (model == null)
            {
                return BadRequest("Model is null");
            }
            var roleId = User.FindFirst("RoleId")?.Value;
            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwareAgncyPbgAdvance_AcceptUpdate", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Id", model.Id);
            cmd.Parameters.AddWithValue("@BillFor", model.BillFor);
            cmd.Parameters.AddWithValue("@AgencyId", model.AgencyId);
            cmd.Parameters.AddWithValue("@Pinvid", model.Pinvid);
            cmd.Parameters.AddWithValue("@BillNO", model.BillNO);
            cmd.Parameters.AddWithValue("@BGNumber", model.BGNumber);
            cmd.Parameters.AddWithValue("@IssuanceDate", model.IssuanceDate);
            cmd.Parameters.AddWithValue("@ExpiryDate", model.ExpiryDate);
            cmd.Parameters.AddWithValue("@ClaimDate", model.ClaimDate);
            cmd.Parameters.AddWithValue("@PBGAmt", model.PBGAmt);
            cmd.Parameters.AddWithValue("@RestBalance", model.RestBalance);
            cmd.Parameters.AddWithValue("@Remarks", model.Remarks);
            cmd.Parameters.AddWithValue("@CreatedBy", userId);
            cmd.Parameters.AddWithValue("@IpAddress", ipAddress);
            cmd.Parameters.AddWithValue("@Document",
                                            string.IsNullOrEmpty(PbgAttachment)
                                             ? (object)DBNull.Value : PbgAttachment
            );


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
