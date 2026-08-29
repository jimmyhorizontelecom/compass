using ClosedXML.Excel;
using Compass.Classes;
using Compass.Models.Filter;
using Compass.Models.Hardware;
using Compass.Models.Test;
using DocumentFormat.OpenXml.Bibliography;
//using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.EMMA;
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
using System.Net.Mail;
using System.Runtime.Intrinsics.Arm;
using System.Security.AccessControl;
using System.Text;
using System.Text.Json;
using wfms_ddl;

namespace Compass.Controllers
{
    public class HardwarePurchaseController : Controller
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        private readonly string _connectionString;
        public HardwarePurchaseController(ISqlDataAccess db, IMemoryCache cache, IConfiguration configuration)
        {
            _cn = db;
            _cache = cache;
            _connectionString = configuration.GetConnectionString("TestConnection");
        }
        public IActionResult Index()
        {
            return View();
        }
        #region POAcceptReject
        public IActionResult POAcceptReject()
        {
            return View();
        }
        // get PO Verification List
        [HttpGet]
        public async Task<IActionResult> getPOVerificationList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@PurchaseOrderNoId", filter.FilterId1);
                parameters.Add("@AgencyId", filter.FilterId2);
                parameters.Add("@DeptId", filter.FilterId3);
                parameters.Add("@CreatedBy", userId);
                parameters.Add("@RoleId", roleId);


                var dt = await _cn.FillDataTableAsync("HardwarePurchaseOrderAcceptReject_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<POVerificationViewModal>());

                var list = dt.AsEnumerable().Select(row => new POVerificationViewModal


                {

                    SaleOrderId = Convert.ToInt32(row["SaleOrderId"]),
                    PurchaseOrderNoId = Convert.ToInt32(row["PurchaseOrderNoId"]),
                    PurchaseOrderNo = row["PurchaseOrderId"]?.ToString(),
                    PurchaseOrderDate = row["PurchaseOrderDate"] != DBNull.Value ? Convert.ToDateTime(row["PurchaseOrderDate"]) : DateTime.MinValue,
                    DepartmentName = row["departmentName"]?.ToString(),
                    AgencyName = row["AgencyName"]?.ToString(),
                    Amount = row["AdvanceAmt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["AdvanceAmt"]),

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
        // Submit PO Verify
        [HttpPost]
        public async Task<IActionResult> SubmitPOVerification([FromForm] string POVerify)
        {
            var model = JsonConvert.DeserializeObject<POVerifyModal>(POVerify);

            if (model == null)
            {
                return BadRequest("Model is null");
            }
            var roleId = User.FindFirst("RoleId")?.Value;
            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwarePurchaseOrder_AcceptReject1", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@SaleOrderId", model.SaleOrderId);
            cmd.Parameters.AddWithValue("@OrderDetailsId", model.OrderDetailsId);
            cmd.Parameters.AddWithValue("@PurchaseOrderId", model.PurchaseOrderId);
            cmd.Parameters.AddWithValue("@IsOrderAccept", model.IsOrderAccept);
            cmd.Parameters.AddWithValue("@Remarks", model.Remarks);

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
      
        #region PO Cancel
        public IActionResult POCancel()
        {
            return View();
        }
        // get PO Cancel List
        [HttpGet]
        public async Task<IActionResult> getPOCancellationList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", filter.FilterId1);
                parameters.Add("@PurchaseOrderNoId", filter.FilterId2);
                parameters.Add("@AgencyId", filter.FilterId3);
                parameters.Add("@FilterStatus", filter.FilterName1);
                parameters.Add("@Deptid", filter.FilterId3);


                var dt = await _cn.FillDataTableAsync("HardwarePurchaseOrderCancel_List1", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<POCancelViewModal>());

                var list = dt.AsEnumerable().Select(row => new POCancelViewModal


                {

                    // SaleOrderId = Convert.ToInt32(row["SaleOrderId"]),
                    PurchaseOrderNoId = Convert.ToInt32(row["PurchaseOrderNoId"]),
                    PurchaseOrderDate = row["PurchaseOrderDate"]?.ToString(),
                    HWSaleOrderReferenceNo = row["HWSaleOrderNo"]?.ToString(),
                    AgencyName = row["AgencyName"]?.ToString(),
                    FilterStatus = row["fiterstatus"]?.ToString(),
                    DepartmentName = row["departmentName"]?.ToString(),


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
        // get Order detail List
        [HttpGet]
        public async Task<IActionResult> getOrderDetailList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@PurchaseOrderNoId", filter.FilterId1);

                var dt = await _cn.FillDataTableAsync("HardwarePurchaseOrderCancelItem_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<OrderDetailsViewModal>());

                var list = dt.AsEnumerable().Select(row => new OrderDetailsViewModal


                {

                    Id = Convert.ToInt32(row["Id"]),
                    PurchaseOrderNoId = Convert.ToInt32(row["PurchaseOrderNoId"]),
                    OrderDetailsId = Convert.ToInt32(row["OrderDetailsId"]),
                    ProductName = row["ProductName"]?.ToString(),
                    Quantity = Convert.ToInt32(row["Qty"]),
                    BaseAmt = row["rate"] == DBNull.Value ? 0m : Convert.ToDecimal(row["rate"]),
                    SGSTAmt = row["Sgst"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Sgst"]),
                    CGSTAmt = row["Cgst"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Cgst"]),
                    Total = row["Total"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Total"]),
                    CancelDateAndTime = row["CanceledDate"]?.ToString(),
                    Agency = row["AgencyName"]?.ToString(),
                    CancelRemarks = row["PoCancelRemarks"]?.ToString(),







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
        // Submit  Order Details Remarks
        [HttpPost]
        public async Task<IActionResult> SubmitOrderDetailRemarks([FromForm] string OrderDetail)

        {
            var model = JsonConvert.DeserializeObject<PurchaseDetailsModal>(OrderDetail);

            if (model == null)
            {
                return BadRequest("Model is null");
            }

            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwarePurchaseOrder_Cancel", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@OrderDetailsId", model.OrderDetailsId);
            cmd.Parameters.AddWithValue("@PurchaseOrderId", model.PurchaseOrderId);
            cmd.Parameters.AddWithValue("@AgencyId", model.AgencyId);
            cmd.Parameters.AddWithValue("@CreatedBy", userId);
            cmd.Parameters.AddWithValue("@IsCancelPruchaseOrder", model.IsCancelPruchaseOrder);
            cmd.Parameters.AddWithValue("@PoCancelRemarks", model.PoCancelRemarks);

            // Convert child list to DataTable
            System.Data.DataTable dt = new System.Data.DataTable();
            dt.Columns.Add("OrderDetailsId", typeof(int));

            foreach (var item in model.Items)
            {
                dt.Rows.Add(item.OrderDetailsId);
            }



            SqlParameter tvpParam = cmd.Parameters.AddWithValue("@OrderDetailsIdTable", dt);
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.TypeName = "OrderDetailsIdTable";
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
        
        #region Order Processing
        public IActionResult OrderProcessing()
        {
            return View();
        }
        // get Order Processing List
        [HttpGet]
        public async Task<IActionResult> getOrderProcessingList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@PurchaseOrderNoId", filter.FilterId1);
                parameters.Add("@AgencyId", filter.FilterId2);
                parameters.Add("@DeptId", filter.FilterId3);
                parameters.Add("@CreatedBy", userId);
                parameters.Add("@RoleId", roleId);


                var dt = await _cn.FillDataTableAsync("HardwarePurchaseOrder_List1", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<OrderProcessingViewModal>());

                var list = dt.AsEnumerable().Select(row => new OrderProcessingViewModal


                {
                    SaleOrderId = Convert.ToInt32(row["SaleOrderId"]),
                    PurchaseOrderNoId = Convert.ToInt32(row["PurchaseOrderNoId"]),
                    PurchaseOrderDate = row["PurchaseOrderDate"]?.ToString(),
                    DepartmentName = row["departmentName"]?.ToString(),
                    AgencyName = row["AgencyName"]?.ToString(),
                    Amount = row["AdvanceAmt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["AdvanceAmt"]),
                    DepartmentAmtReceived = 0,


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
        // get Order Detail List
        [HttpGet]
        public async Task<IActionResult> getOrderViewList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@PurchaseOrderNoId", filter.FilterId1);
                parameters.Add("@CreatedBy", userId);



                var dt = await _cn.FillDataTableAsync("HardwarePurchaseOrderDetails_List1", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<OrderDetailViewModal>());

                var list = dt.AsEnumerable().Select(row => new OrderDetailViewModal


                {

                    Id = Convert.ToInt32(row["Id"]),
                    PurchaseOrderNoId = Convert.ToInt32(row["PurchaseOrderNoId"]),
                    ProductName = row["ProductName"]?.ToString(),
                    IsEstimatedDate = row["IsEstimatedDate"]?.ToString(),
                    EstimatedDate = row["EstimatedDate"]?.ToString(),
                    Quantity = row["Qty"]?.ToString(),
                    BaseAmt = row["rate"] == DBNull.Value ? 0m : Convert.ToDecimal(row["rate"]),
                    SGSTAmt = row["Sgst"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Sgst"]),
                    CGSTAmt = row["Cgst"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Cgst"]),
                    Total = row["Total"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Total"]),


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
        // Submit Expected Delivery Date
        [HttpPost]
        public async Task<IActionResult> SubmitExpectedDeliveryDate([FromForm] string ExpectedDate)
        {
            var model = JsonConvert.DeserializeObject<ExpectedDateModal>(ExpectedDate);

            if (model == null)
            {
                return BadRequest("Model is null");
            }
            var roleId = User.FindFirst("RoleId")?.Value;
            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwareProductEstimatedDate_AcceptUpdate", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@PurchaseOrderId", model.Id);
            cmd.Parameters.AddWithValue("@EstimatedDate", model.EstimatedDate);

            // ✅ Correct Output Parameter
            SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
            mesParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(mesParam);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
            string message = mesParam.Value?.ToString();
            return Ok(new { success = true, message = message });

        }
        // get Product Delivery List1
        [HttpGet]
        public async Task<IActionResult> getProductDeliveryList1([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@PurchaseOrderNo", "54");
                //parameters.Add("@ItemDetailsId", filter.FilterId2);
                //parameters.Add("@consigneeAddress", filter.FilterId3);
                //parameters.Add("@PageNumber", filter.FilterId3);
                //parameters.Add("@PageSize", filter.FilterId3);
                //parameters.Add("@GetCount", filter.FilterId3);
                //parameters.Add("@SearchTerm", filter.FilterId3);



                var dt = await _cn.FillDataTableAsync("HardwareDeliveryAddress_List1_optimize", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<ProductDeliveryViewModal>());

                var list = dt.AsEnumerable().Select(row => new ProductDeliveryViewModal


                {

                    PurchaseOrderNo = row["PurchaseOrderNo"]?.ToString(),
                    ProductName = row["ProductName"]?.ToString(),
                    ConsigneeName = row["ConsigneeName"]?.ToString(),
                    ConsigneeAddress = row["consigneeAddress"]?.ToString(),
                    OrderDeliveryId = Convert.ToInt32(row["OrderDeliveryId"]),
                    DeliveryQuantity = Convert.ToInt32(row["DeliveredQty"]),
                    DeliveredQty = Convert.ToInt32(row["DeliveredQty"]),
                    DeliveryDate = row["DeliveredDate"]?.ToString(),
                    ContactNo = row["ConsigneeContactNo"]?.ToString(),
                    //POD = row["POD"]?.ToString(),
                    //IR = row["IR"]?.ToString(),




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
        // get Product Delivery Item
        [HttpGet]
        public async Task<IActionResult> getProductDeliveryItem([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@consigneeAddress", filter.FilterName1);
                parameters.Add("@SaleOrderId", filter.FilterId2);
                parameters.Add("@PurchaseOrderNo", filter.FilterId1);
                // parameters.Add("@PageNumber", filter.FilterId3);
                //parameters.Add("@PageSize", filter.FilterId3);
                //parameters.Add("@GetCount", filter.FilterId3);
                //parameters.Add("@SearchTerm", filter.FilterId3);



                var dt = await _cn.FillDataTableAsync("HardwareDeliveryItemWise_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<ProductDeliveryItemViewModal>());

                var list = dt.AsEnumerable().Select(row => new ProductDeliveryItemViewModal


                {

                    OrderDeliveryId = Convert.ToInt32(row["OrderDeliveryId"]),
                    OrderDetailsId = Convert.ToInt32(row["OrderDetailsId"]),
                    ProductName = row["ProductName"]?.ToString(),
                    ContactNo = row["ConsigneeContactNo"]?.ToString(),
                    ProductId = Convert.ToInt32(row["ProductId"]),
                    ItemDetailsId = Convert.ToInt32(row["ItemDetailsId"]),

                    DeliveryQty = row["DeliveryQty"] == DBNull.Value ? 0m : Convert.ToDecimal(row["DeliveryQty"]),
                    DeliveredQty = row["DeliveredQty"] == DBNull.Value ? 0m : Convert.ToDecimal(row["DeliveredQty"]),






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
        // Submit Item Of Product Delivery
        // Store data in one to many relation form
        public async Task<IActionResult> SubmitItemProductDelivery([FromForm] string ItemDetail,
    IFormFile POD,
    IFormFile IR)
        {
            var model = JsonConvert.DeserializeObject<ItemDeliveryModel>(ItemDetail);

            IFormFile attachmentFile1 = IR;
            IFormFile attachmentFile2 = POD;
            string IRAttachement = "";
            if (attachmentFile1 != null && attachmentFile1.Length > 0)
            {
                string folderPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/Attachment/ProductDelivery/IR"
                );

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string extension = Path.GetExtension(attachmentFile1.FileName);

                IRAttachement = $"IR{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                string filePath = Path.Combine(folderPath, IRAttachement);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await attachmentFile1.CopyToAsync(stream);
                }
            }

            string PODAttachment = "";
            if (attachmentFile2 != null && attachmentFile2.Length > 0)
            {
                string folderPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/Attachment/ProductDelivery/POD"
                );

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string extension = Path.GetExtension(attachmentFile2.FileName);

                PODAttachment = $"POD{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                string filePath = Path.Combine(folderPath, PODAttachment);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await attachmentFile2.CopyToAsync(stream);
                }
            }


            if (model == null)
            {
                return BadRequest("Model is null");
            }

            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwareDeliveryMultiItems_AcceptUpdate", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@PurchaseOrderNo", model.PurchaseOrderNo);
            cmd.Parameters.AddWithValue("@ItemDetailsIdTxt", model.ItemDetailsIdTxt);

            cmd.Parameters.AddWithValue("@Document1", IRAttachement);
            cmd.Parameters.AddWithValue("@Document2", PODAttachment);
            cmd.Parameters.AddWithValue("@CreatedBy", userId);
            // Convert child list to DataTable
            System.Data.DataTable dt = new System.Data.DataTable();
            dt.Columns.Add("OrderDetailsId", typeof(int));
            dt.Columns.Add("OrderDeliveryId", typeof(int));
            dt.Columns.Add("ProductId", typeof(int));
            dt.Columns.Add("ConsigneeName", typeof(string));
            dt.Columns.Add("ConsigneeContactNo", typeof(string));
            dt.Columns.Add("consigneeAddress", typeof(string));
            dt.Columns.Add("DeliveredQty", typeof(double));
            dt.Columns.Add("DeliveredTo", typeof(string));
            dt.Columns.Add("DeliveredDate", typeof(string));
            dt.Columns.Add("Document", typeof(string));
            dt.Columns.Add("Document2", typeof(string));

            foreach (var item in model.Items)
            {
                dt.Rows.Add(item.OrderDetailsId, item.OrderDeliveryId, item.ProductId, item.ConsigneeName, item.ConsigneeContactNo, item.consigneeAddress, item.DeliveredQty, item.DeliveredTo, item.DeliveredDate, item.Document, item.Document2);
            }

            SqlParameter tvpParam = cmd.Parameters.AddWithValue("@TemptblHardwarSaleOrderDelivered", dt);
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.TypeName = "TemptblHardwarSaleOrderDelivered";
            // ✅ Correct Output Parameter
            SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
            mesParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(mesParam);

            await con.OpenAsync();

            await cmd.ExecuteNonQueryAsync();
            string message = mesParam.Value?.ToString();
            return Ok(new { success = true, message = message });

        }
        [HttpGet]
        // get Price Record Filter Data
        public async Task<IActionResult> GetConsigneeContactRecord([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                int qty = filter.FilterId2;

                SortedList parameters = new SortedList();
                parameters.Add("@ProductId", id);
                parameters.Add("@Qty", qty);

                var dt = await _cn.FillDataTableAsync("HardwareProductDetailsQty_list", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<ProductPriceViewModal>());

                var list = dt.AsEnumerable().Select(row => new ProductPriceViewModal
                {
                    HSNCode = row["HSNCode"]?.ToString(),
                    Sepcification = row["Sepcification"]?.ToString(),
                    ProductPrice = Convert.ToDecimal(row["ProductPrice"]) ,
                    TotalPrice = Convert.ToDecimal(row["TotalPrice"]),
                    Cgst = Convert.ToDecimal(row["Cgst"]),
                    Sgst = Convert.ToDecimal(row["Sgst"]) ,
                    Gst = Convert.ToDecimal(row["Gst"]) ,
                    HPSEDCCharges = Convert.ToDecimal(row["HPSEDCCharges"]) ,
                    GrandTotal = Convert.ToDecimal(row["GrandTotal"]) ,
                    Total = Convert.ToDecimal(row["Total"]) ,

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
        [HttpGet]
        // get Submit consignee contact 
        public async Task<IActionResult> SubmitRecordIRUpload([FromForm] string IRUpload,
    IFormFile IR)

        {
            var model = JsonConvert.DeserializeObject<IRConsigneeContactModel>(IRUpload);

            IFormFile attachmentFile1 = IR;

            string IRAttachement = "";
            if (attachmentFile1 != null && attachmentFile1.Length > 0)
            {
                string folderPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/Attachment/ProductDelivery/IR"
                );

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string extension = Path.GetExtension(attachmentFile1.FileName);

                IRAttachement = $"IR{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                string filePath = Path.Combine(folderPath, IRAttachement);

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
            using SqlCommand cmd = new SqlCommand("HardwareDeliveryMultiItemsIrUploaded_AcceptUpdate", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@PurchaseOrderNo", model.PurchaseOrderNo);

            cmd.Parameters.AddWithValue("@Document2", IRAttachement);
            cmd.Parameters.AddWithValue("@CreatedBy", userId);
            // Convert child list to DataTable
            System.Data.DataTable dt = new System.Data.DataTable();

            dt.Columns.Add("OrderDeliveryId", typeof(int));
            dt.Columns.Add("OrderDetailsId", typeof(int));
            dt.Columns.Add("Document2", typeof(string));

            foreach (var item in model.Items)
            {
                dt.Rows.Add(item.OrderDeliveryId, item.OrderDetailsId, item.Document2);
            }

            SqlParameter tvpParam = cmd.Parameters.AddWithValue("@TempTblIRUpload", dt);
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.TypeName = "TempTblIRUpload";
            // ✅ Correct Output Parameter
            SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
            mesParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(mesParam);

            await con.OpenAsync();

            await cmd.ExecuteNonQueryAsync();
            string message = mesParam.Value?.ToString();
            return Ok(new { success = true, message = message });

        }

        // get Product Delivery Item
        [HttpGet]
        public async Task<IActionResult> getProductDeliveryItemIR([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@consigneeAddress", filter.FilterName1);
                parameters.Add("@SaleOrderId", filter.FilterId2);
                parameters.Add("@PurchaseOrderNo", filter.FilterId1);
                // parameters.Add("@PageNumber", filter.FilterId3);
                //parameters.Add("@PageSize", filter.FilterId3);
                //parameters.Add("@GetCount", filter.FilterId3);
                //parameters.Add("@SearchTerm", filter.FilterId3);



                var dt = await _cn.FillDataTableAsync("HardwareDeliveryItemWise_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<ProductDeliveryItemViewModal>());

                var list = dt.AsEnumerable().Select(row => new ProductDeliveryItemViewModal


                {

                    OrderDeliveryId = Convert.ToInt32(row["OrderDeliveryId"]),
                    OrderDetailsId = Convert.ToInt32(row["OrderDetailsId"]),
                    ProductName = row["ProductName"]?.ToString(),
                    ContactNo = row["ConsigneeContactNo"]?.ToString(),
                    ProductId = Convert.ToInt32(row["ProductId"]),
                    ItemDetailsId = Convert.ToInt32(row["ItemDetailsId"]),

                    DeliveryQty = row["DeliveryQty"] == DBNull.Value ? 0m : Convert.ToDecimal(row["DeliveryQty"]),
                    DeliveredQty = row["DeliveredQty"] == DBNull.Value ? 0m : Convert.ToDecimal(row["DeliveredQty"]),






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
        // Delete Product delivery Item from Table
        [HttpPost]
        public IActionResult DeleteProductDeliveryItemRecord([FromForm] TestFilterData filter)
        {
            try
            {
                //Console.WriteLine("Delete Id Received: " + model.Id);

                var userId = User.FindFirst("UserId")?.Value;

                SortedList parameters = new SortedList
                {
                   { "@OrderDeliveryId", filter.FilterId1 },
                   { "@ItemDetailsId", filter.FilterId2 },

                };

                var result = _cn.ExecuteNonQueryWMessage(
                    "HardwareDeliveryAddress_Delete1",
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
                    message = "Server error",
                    error = ex.Message
                });
            }
        }
        // get Verify POD/IR List
        [HttpGet]
        public async Task<IActionResult> getVerifyPODList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@PurchaseOrderNo", "21");
                //parameters.Add("@ItemDetailsId", filter.FilterId2);
                //parameters.Add("@consigneeAddress", filter.FilterId3);
                //parameters.Add("@PageNumber", filter.FilterId3);
                //parameters.Add("@PageSize", filter.FilterId3);
                //parameters.Add("@GetCount", filter.FilterId3);
                //parameters.Add("@SearchTerm", filter.FilterId3);



                var dt = await _cn.FillDataTableAsync("HardwareDeliveryAddress_List1_optimize", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<PODVerifyViewModal>());

                var list = dt.AsEnumerable().Select(row => new PODVerifyViewModal


                {

                    PurchaseOrderNo = row["PurchaseOrderNo"]?.ToString(),
                    ProductName = row["ProductName"]?.ToString(),
                    ConsigneeName = row["ConsigneeName"]?.ToString(),
                    ConsigneeAddress = row["consigneeAddress"]?.ToString(),
                    OrderDeliveryId = Convert.ToInt32(row["OrderDeliveryId"]),
                    ItemDetailsId = Convert.ToInt32(row["ItemDetailID_From_Order2"]),
                    DeliveryQuantity = Convert.ToInt32(row["DeliveredQty"]),
                    DeliveredQty = Convert.ToInt32(row["DeliveredQty"]),
                    DeliveryDate = row["DeliveredDate"]?.ToString(),
                    ContactNo = row["ConsigneeContactNo"]?.ToString(),
                    POD = row["Document"]?.ToString(),
                    IR = row["Document2"]?.ToString(),
                    IsPOdVerified = Convert.ToChar(row["IsPOdVerified"]),
                    IsIRVerified = Convert.ToChar(row["IsIRVerified"]),

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
        // Submit Verify POD/IR
        [HttpPost]
        public async Task<IActionResult> SubmitVerifyPODRecord([FromForm] string VerifyPOD)
        {
            var model = JsonConvert.DeserializeObject<VerifyPODModal>(VerifyPOD);

            if (model == null)
            {
                return BadRequest("Model is null");
            }
            var roleId = User.FindFirst("RoleId")?.Value;
            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwarePODIRVerificationSingle_AcceptUpdate1", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@OrderDetailsId", model.OrderDetailsId);
            cmd.Parameters.AddWithValue("@OrderDeliveryId", model.OrderDeliveryId);
            cmd.Parameters.AddWithValue("@IsPODVerified", model.IsPODVerified);
            cmd.Parameters.AddWithValue("@IsIRVerified", model.IsIRVerified);
            cmd.Parameters.AddWithValue("@VerifedBy", userId);

            // ✅ Correct Output Parameter
            SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
            mesParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(mesParam);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
            string message = mesParam.Value?.ToString();
            return Ok(new { success = true, message = message });

        }
        // get Agency Invoice List
        [HttpGet]
        public async Task<IActionResult> getAgencyInvoiceList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@PurchaseOrderNo", "15");
                //parameters.Add("@ItemDetailsId", filter.FilterId2);
                //parameters.Add("@consigneeAddress", filter.FilterId3);
                //parameters.Add("@PageNumber", filter.FilterId3);
                //parameters.Add("@PageSize", filter.FilterId3);
                //parameters.Add("@GetCount", filter.FilterId3);
                //parameters.Add("@SearchTerm", filter.FilterId3);



                var dt = await _cn.FillDataTableAsync("HardwareInvoiceAddressList", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<AgencyInvoiceViewModal>());

                var list = dt.AsEnumerable().Select(row => new AgencyInvoiceViewModal


                {

                    PurchaseOrderNo = row["PurchaseOrderNo"]?.ToString(),
                    OrderDeliveryId = Convert.ToInt32(row["OrderDeliveryId"]),
                    ProductId = Convert.ToInt32(row["ProductId"]),
                    ProductName = row["ProductName"]?.ToString(),
                    ConsigneeName = row["ConsigneeName"]?.ToString(),
                    ConsigneeAddress = row["consigneeAddress"]?.ToString(),
                    DeliveredDate = row["DeliveredDate"]?.ToString(),
                    DeliveredQty = Convert.ToInt32(row["DeliveredQty"]),






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
        // Get generate Product list
        [HttpPost]
        public async Task<IActionResult> GenerateProductListRecord([FromForm] string ItemDetail,
           IFormFile IR)

        {
            var model = JsonConvert.DeserializeObject<GenerateProductModel>(ItemDetail);

            IFormFile attachmentFile1 = IR;

            string IRAttachement = "";
            if (attachmentFile1 != null && attachmentFile1.Length > 0)
            {
                string folderPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/Attachment/ProductDelivery/IR"
                );

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string extension = Path.GetExtension(attachmentFile1.FileName);

                IRAttachement = $"IR{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                string filePath = Path.Combine(folderPath, IRAttachement);

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
            using SqlCommand cmd = new SqlCommand("HardwarePurchaseInvProductList", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@PurchaseOrderNo", model.PurchaseOrderNo);

            // Convert child list to DataTable
            System.Data.DataTable dt = new System.Data.DataTable();
            dt.Columns.Add("OrderDeliveryId", typeof(int));


            foreach (var item in model.Items)
            {
                dt.Rows.Add(item.OrderDeliveryId);
            }

            SqlParameter tvpParam = cmd.Parameters.AddWithValue("@tempInvoiceAddress", dt);
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.TypeName = "TempInvoiceAddress";
            // ✅ Correct Output Parameter
            SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
            mesParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(mesParam);

            await con.OpenAsync();

            await cmd.ExecuteNonQueryAsync();
            string message = mesParam.Value?.ToString();
            return Ok(new { success = true, message = message });

        }
        [HttpGet]
        // get Agency Invoice Filter Data
        public async Task<IActionResult> GetAgencyInvoiceFillRecord([FromQuery] TestFilterData filter)
        {
            try
            {

                // Access as object
                int id = filter.FilterId1;
                int qty = filter.FilterId2;

                SortedList parameters = new SortedList();
                parameters.Add("@PurchaseOrderId", 15);
                parameters.Add("@CreatedBy", 0);

                var dt = await _cn.FillDataTableAsync("HardwarePurchaseOrder_Details", "", parameters);

                if (dt == null || dt.Rows.Count == 0)

                    return Ok(new List<AgencyInvoiceFillViewModal>());

                var list = dt.AsEnumerable().Select(row => new AgencyInvoiceFillViewModal
                {
                    AgencyName = row["AgencyName"]?.ToString(),
                    departmentName = row["departmentName"]?.ToString(),
                    BillingAddress = row["BillingAddressText"]?.ToString(),
                    SaleNo = row["HWSaleOrderNo"]?.ToString(),
                    SaleOrderId = Convert.ToInt32(row["SaleOrderId"]),


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

        // Duplicate 
        public async Task<IActionResult> GetAgencyInvoiceFillRecord1([FromQuery] TestFilterData filter)
        {
            try
            {

                // Access as object
                int id = filter.FilterId1;
                int qty = filter.FilterId2;

                SortedList parameters = new SortedList();
                parameters.Add("@PurchaseOrderId", 15);
                parameters.Add("@CreatedBy", 0);

                var dt = await _cn.FillDataTableAsync("HardwarePurchaseOrder_Details", "", parameters);

                if (dt == null || dt.Rows.Count == 0)

                    return Ok(new List<AgencyInvoiceFillViewModal>());

                var list = dt.AsEnumerable().Select(row => new AgencyInvoiceFillViewModal
                {
                    AgencyName = row["AgencyName"]?.ToString(),
                    departmentName = row["departmentName"]?.ToString(),
                    BillingAddress = row["BillingAddressText"]?.ToString(),
                    SaleNo = row["HWSaleOrderNo"]?.ToString(),
                    SaleOrderId = Convert.ToInt32(row["SaleOrderId"]),


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
        public async Task<IActionResult> GenerateProductListRecord1([FromForm] string ItemDetail)

        {
            var model = JsonConvert.DeserializeObject<GenerateProductModel>(ItemDetail);







            if (model == null)
            {
                return BadRequest("Model is null");
            }

            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwarePurchaseInvProductList", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@PurchaseOrderNo", model.PurchaseOrderNo);

            // Convert child list to DataTable
            System.Data.DataTable dt = new System.Data.DataTable();
            dt.Columns.Add("OrderDeliveryId", typeof(int));


            foreach (var item in model.Items)
            {
                dt.Rows.Add(item.OrderDeliveryId);
            }

            SqlParameter tvpParam = cmd.Parameters.AddWithValue("@tempInvoiceAddress", dt);
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.TypeName = "TempInvoiceAddress";
            // ✅ Correct Output Parameter
            SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
            mesParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(mesParam);

            await con.OpenAsync();

            List<ProductInvViewModal> productList = new List<ProductInvViewModal>();

            using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    productList.Add(new ProductInvViewModal
                    {
                        ProductId = reader["ProductId"] != DBNull.Value ? Convert.ToInt32(reader["ProductId"]) : 0,
                        Qty = reader["Qty"] != DBNull.Value ? Convert.ToDecimal(reader["Qty"]) : 0,
                        productprice = reader["productprice"] != DBNull.Value ? Convert.ToDecimal(reader["productprice"]) : 0,
                        GstP = reader["GstP"] != DBNull.Value ? Convert.ToDecimal(reader["GstP"]) : 0,
                        ProductName = reader["ProductName"]?.ToString()
                    });
                }
            }

            string message = mesParam.Value?.ToString();

            return Ok(new
            {
                success = productList.Count > 0,
                message = message,
                data = productList
            });


        }
        #endregion
        
        #region GeneratePI
        public IActionResult GeneratePI()
        {
            return View();
        }
        // get GeneratePI List
        [HttpGet]
        public async Task<IActionResult> getGeneratePIList([FromQuery] TestFilterData filter)
        {
            try


            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@Id", 0);
                parameters.Add("@MainCategoryId", filter.FilterId3);
              //  parameters.Add("@ProductCategoryId", filter.FilterId4);
                //parameters.Add("@CompanyId", filter.FilterId5);
                parameters.Add("@SearchTerm", filter.FilterName1);
                parameters.Add("@PageNo", filter.FilterId1);
                parameters.Add("@PageSize", filter.FilterId2);
                parameters.Add("@CreatedBy", userId);

                var dt = await _cn.FillDataTableAsync("PiProduct_List_optimized", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<GeneratePInvListViewModal>());

                var list = dt.AsEnumerable().Select(row => new GeneratePInvListViewModal


                {


                    ProductId = Convert.ToInt32(row["Id"]),
                    MainCatgName = row["MainCatgName"]?.ToString(),
                    BrandName = row["CompanyName"]?.ToString(),
                    ProductName = row["Title"]?.ToString(),

                    ModelNo = row["ModelNo"]?.ToString(),
                    BasePrice = row["ProductPrice"]?.ToString(),
                    HPSEDCCharges = row["HPSEDCCharges"] == DBNull.Value ? 0m : Convert.ToDecimal(row["HPSEDCCharges"]),
                    Gst = row["Gst"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Gst"]),
                    GrandTotal = row["GrandTotal"] == DBNull.Value ? 0m : Convert.ToDecimal(row["GrandTotal"]),
                    Sepcification = row["Sepcification"]?.ToString(),
                    IsAddedToCart = row["IsAddedToCart"] != DBNull.Value ? Convert.ToChar(row["IsAddedToCart"]) : 'N',








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
        // Submit when click on Add
        [HttpPost]

        public async Task<IActionResult> SubmitAddtoCart1([FromForm] string ProductDetail)
        {
            var model = JsonConvert.DeserializeObject<ClicktoCartModal>(ProductDetail);
            if (model == null)
            {
                return BadRequest("Model is null");
            }
            var roleId = User.FindFirst("RoleId")?.Value;
            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("tblHardwarePi_AcceptUpdate", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@PiId", 0);
            cmd.Parameters.Add("@PiDate", SqlDbType.DateTime).Value = DateTime.Now;
            cmd.Parameters.AddWithValue("@DeptId", 0);
            cmd.Parameters.AddWithValue("@AddressId", 0);
            cmd.Parameters.AddWithValue("@ReferenceNo", 0);
            cmd.Parameters.AddWithValue("@ProductId", model.ProductId);
            cmd.Parameters.AddWithValue("@UnitBasePrice", model.UnitBasePrice);
            cmd.Parameters.AddWithValue("@GstP", model.GstP);
            cmd.Parameters.AddWithValue("@AdminP", model.AdminP);
            cmd.Parameters.AddWithValue("@AdminAmt", model.AdminAmt);
            cmd.Parameters.AddWithValue("@GstAmt", model.GstAmt);
            cmd.Parameters.AddWithValue("@ProductUnitPrice", model.ProductUnitPrice);
            cmd.Parameters.AddWithValue("@RoundOff", 0);
            cmd.Parameters.AddWithValue("@OrderQty", 1);
            cmd.Parameters.AddWithValue("@GrandTotal", model.GrandTotal);
            cmd.Parameters.AddWithValue("@CreatedBy", userId);


            // ✅ Correct Output Parameter
            SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
            mesParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(mesParam);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
            string message = mesParam.Value?.ToString();
            return Ok(new { success = true, message = message });
        }
        // get Cart pupup List
        [HttpGet]
        public async Task<IActionResult> getCartItemList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@PiIdNO", 0);
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
        // To Count Total items for Cart
        public async Task<IActionResult> GetCartItemCount([FromQuery] TestFilterData filter)
        {
            try

            {


                var userId = User.FindFirst("UserId")?.Value;
                SortedList parameters = new SortedList();

                parameters.Add("@CreatedBy", userId);

                var dt = await _cn.FillDataTableAsync("PiCartCount", "", parameters);

                if (dt == null || dt.Rows.Count == 0)

                    return Ok(new List<CartItemCountViewModal>());

                var list = dt.AsEnumerable().Select(row => new CartItemCountViewModal
                {
                    count = row["count"]?.ToString(),



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
        // Remove Records from Table
        [HttpPost]
        public IActionResult RemoveCartItem([FromForm] TestFilterData filter)
        {
            try
            {
                //Console.WriteLine("Delete Id Received: " + model.Id);

                var userId = User.FindFirst("UserId")?.Value;

                SortedList parameters = new SortedList
                {
                   { "@PiId", filter.FilterId1 },
                };

                var result = _cn.ExecuteNonQueryWMessage(
                    "tblHardwarePi_Delete",
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
                    message = "Server error",
                    error = ex.Message
                });
            }
        }
        // get Submit Generate PI
        public async Task<IActionResult> SubmitRecordGeneratePI([FromForm] string PIGenerate)
        {
            var model = new GeneratePISubmitModel();
            string message = "";
            try
            {
                model = JsonConvert.DeserializeObject<GeneratePISubmitModel>(PIGenerate);



                if (model == null)
                {
                    return BadRequest("Model is null");
                }

                var userId = User.FindFirst("UserId")?.Value;
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("tblHardwarePi_PiCreate", con);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Designation", model.Designation);
                cmd.Parameters.AddWithValue("@CreatedBy", userId);
                // Convert child list to DataTable
                System.Data.DataTable dt = new System.Data.DataTable();

                dt.Columns.Add("PiId", typeof(int));
                dt.Columns.Add("PiDate", typeof(DateTime));
                dt.Columns.Add("DeptId", typeof(int));
                dt.Columns.Add("AddressId", typeof(int));
                dt.Columns.Add("AddressText", typeof(string));
                dt.Columns.Add("EmailId", typeof(string));
                dt.Columns.Add("AdditionalInfo", typeof(string));
                dt.Columns.Add("Itemsheading", typeof(string));
                dt.Columns.Add("ContactNo", typeof(string));
                dt.Columns.Add("ReferenceNo", typeof(string));
                dt.Columns.Add("ProductId", typeof(int));
                dt.Columns.Add("Qty", typeof(int));

                foreach (var item in model.Items)
                {
                    dt.Rows.Add(item.PiId, "2-Apr-2002", item.DeptId, item.AddressId, item.AddressText, item.EmailId,
                        item.AdditionalInfo, item.ContactNo, item.ReferenceNo, item.ProductId, item.Qty);
                }


                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@HardwarePi", dt);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "HardwarePi4";
                // ✅ Correct Output Parameter
                SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
                mesParam.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(mesParam);

                await con.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                message = mesParam.Value?.ToString();
            }
            catch (Exception ex)
            {
                message = ex.Message;

            }
            return Ok(new { success = true, message = message });

        }


        #endregion
        
        #region Test
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
        // get GeneratePI List
        [HttpGet]
        public async Task<IActionResult> getGeneratePITable([FromQuery] TestFilterData filter)

        {
            try

            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@PiId", 0);
                parameters.Add("@Deptid", filter.FilterId3);
                //parameters.Add("@Addressid", filter.FilterId4);


                var dt = await _cn.FillDataTableAsync("tblHardwarePi_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<GeneratePIListViewModal>());

                var list = dt.AsEnumerable().Select(row => new GeneratePIListViewModal
                {
                    PiIdNO = Convert.ToInt32(row["PiIdNO"]),
                    DeptOrderId = row["DeptOrderId"]?.ToString(),
                    PiDate = row["PiDate"]?.ToString(),
                    IsDeptConfirmed = row["IsDeptConfirmed"]?.ToString(),
                    IsBillGenerated = row["IsBillGenerated"]?.ToString(),
                    PBNoText = row["PBNoText"]?.ToString(),
                    BillGeneratedDate = row["BillGeneratedDate"]?.ToString(),
                    ReferenceNo = row["ReferenceNo"]?.ToString(),
                    DepartmentName = row["DepartmentName"]?.ToString(),
                    AddressText = row["AddressText"]?.ToString(),

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
        // get PI Confirm List
        [HttpGet]
        public async Task<IActionResult> getPIConfirmList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@PiIdNO", filter.FilterId1);
                parameters.Add("@CreatedBy", userId);



                var dt = await _cn.FillDataTableAsync("HardwareCartProduct_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<PIConfirmViewModal>());

                var list = dt.AsEnumerable().Select(row => new PIConfirmViewModal


                {

                    DepartmentName = row["departmentName"]?.ToString(),
                    PIId = Convert.ToInt32(row["PiId"]),
                    ProductId = Convert.ToInt32(row["ProductId"]),
                    Designation = row["Designation"]?.ToString(),
                    PIAddress = row["AddressText"]?.ToString(),
                    ReferenceNo = row["ReferenceNo"]?.ToString(),
                    AdditionalInformation = row["AdditionalInfo"]?.ToString(),
                    ProductName = row["ProductName"]?.ToString(),
                    UnitBasePrice = row["UnitBasePrice"] == DBNull.Value ? 0m : Convert.ToDecimal(row["UnitBasePrice"]),
                    AdminAmt = row["AdminAmt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["AdminAmt"]),
                    GstAmt = row["GstAmt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["GstAmt"]),
                    GrandTotal = row["GrandTotal"] == DBNull.Value ? 0m : Convert.ToDecimal(row["GrandTotal"]),
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

        // get Submit PI Confirm 
        public async Task<IActionResult> SubmitPIConfirm([FromForm] string ConfirmPIOrder,
     IFormFile PI)

        {
            var model = JsonConvert.DeserializeObject<ConfirmPIOrderModel>(ConfirmPIOrder);

            IFormFile attachmentFile1 = PI;

            string PIAttachement = "";
            if (attachmentFile1 != null && attachmentFile1.Length > 0)
            {
                string folderPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/Attachment/PI"
                );

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string extension = Path.GetExtension(attachmentFile1.FileName);

                PIAttachement = $"PIConfirmation_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                string filePath = Path.Combine(folderPath, PIAttachement);

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
            using SqlCommand cmd = new SqlCommand("tblHardwareDeptPlaceOrder_AcceptUpdate", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@DeptOrderId", model.DeptOrderId);
            cmd.Parameters.AddWithValue("@TotalBasePrice", model.TotalBasePrice);
            cmd.Parameters.AddWithValue("@AdminP", model.AdminP);
            cmd.Parameters.AddWithValue("@AdminAmt", model.AdminAmt);
            cmd.Parameters.AddWithValue("@GstAmt", model.GstAmt);
            cmd.Parameters.AddWithValue("@RoundOff", model.RoundOff);
            cmd.Parameters.AddWithValue("@GrandTotal", model.GrandTotal);
            cmd.Parameters.AddWithValue("@CreatedBy", userId);
            cmd.Parameters.AddWithValue("@LocationAttach", PIAttachement);

            // Convert child list to DataTable
            System.Data.DataTable dt = new System.Data.DataTable();

            dt.Columns.Add("PiId", typeof(int));
            dt.Columns.Add("PiDate", typeof(DateTime));
            dt.Columns.Add("DeptId", typeof(int));
            dt.Columns.Add("AddressId", typeof(int));
            dt.Columns.Add("ReferenceNo", typeof(string));
            dt.Columns.Add("ProductId", typeof(int));
            dt.Columns.Add("Qty", typeof(decimal));


            foreach (var item in model.Items)
            {
                dt.Rows.Add(item.PiId, item.PiDate, item.DeptId, item.AddressId, item.ReferenceNo, item.ProductId, item.Qty);
            }

            SqlParameter tvpParam = cmd.Parameters.AddWithValue("@HardwarePi", dt);
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.TypeName = "HardwarePi1";
            // ✅ Correct Output Parameter
            SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
            mesParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(mesParam);

            await con.OpenAsync();

            await cmd.ExecuteNonQueryAsync();
            string message = mesParam.Value?.ToString();
            return Ok(new { success = true, message = message });

        }
        // get Address Detail
        public async Task<IActionResult> getPIAddressDetails([FromQuery] TestFilterData filter)
        {
            try

            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@PiAddressId", filter.FilterId1);
                parameters.Add("@DeptId", filter.FilterId2);



                var dt = await _cn.FillDataTableAsync("HardwareDeparmentPiAddress_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<PIAddressListViewModal>());

                var list = dt.AsEnumerable().Select(row => new PIAddressListViewModal
                {
                    Designation = row["Designation"]?.ToString(),
                    PIAddress = row["AddressText"]?.ToString(),
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
        // get PB Generate List
        public async Task<IActionResult> getGeneratePBList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@DeptOrderId", filter.FilterId1);
                parameters.Add("@CreatedBy", userId);



                var dt = await _cn.FillDataTableAsync("HardwareDepartmentOrderDetails_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<PBGenerateViewModal>());

                var list = dt.AsEnumerable().Select(row => new PBGenerateViewModal


                {

                    DepartmentName = row["departmentName"]?.ToString(),
                    DeptOrderId = row["DeptOrderId"]?.ToString(),
                    //IsDeptConfirmed = row["IsDeptConfirmed"]?.ToString(),
                    //PiIdNo = Convert.ToInt32(row["PiIdNo"]),
                    ProductId = Convert.ToInt32(row["ProductId"]),
                    Designation = row["Designation"]?.ToString(),
                    PIAddress = row["AddressText"]?.ToString(),
                    ReferenceNo = row["ReferenceNo"]?.ToString(),
                    AdditionalInformation = row["AdditionalInfo"]?.ToString(),
                    ProductName = row["ProductName"]?.ToString(),
                    UnitBasePrice = row["UnitBasePrice"] == DBNull.Value ? 0m : Convert.ToDecimal(row["UnitBasePrice"]),
                    AdminAmt = row["AdminAmt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["AdminAmt"]),
                    GstAmt = row["GstAmt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["GstAmt"]),
                    GrandTotal = row["GrandTotal"] == DBNull.Value ? 0m : Convert.ToDecimal(row["GrandTotal"]),
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

        // get Submit PB Generate 
        public async Task<IActionResult> SubmitRecordGeneratePB([FromForm] string GeneratePorforma)
        {
            var model = new GeneratePorformaModel();
            string message = "";
            try
            {
                model = JsonConvert.DeserializeObject<GeneratePorformaModel>(GeneratePorforma);



                if (model == null)
                {
                    return BadRequest("Model is null");
                }

                var userId = User.FindFirst("UserId")?.Value;
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("tblHardwarePiBill_AcceptUpdate", con);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@DeptOrderId", model.DeptOrderId);
                cmd.Parameters.AddWithValue("@BillGeneratedRemarks", model.BillGeneratedRemarks);
                cmd.Parameters.AddWithValue("@IsBillGenerated", "Y");
                cmd.Parameters.AddWithValue("@BillGeneratedBy", userId);

                // ✅ Correct Output Parameter
                SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
                mesParam.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(mesParam);

                await con.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                message = mesParam.Value?.ToString();
            }
            catch (Exception ex)
            {
                message = ex.Message;

            }
            return Ok(new { success = true, message = message });

        }
        #endregion


        #region Create Agency Login
        public IActionResult CreateAgencyLogin()
        {
            return View();
        }
        // get the Data Of Table Create Agency Login
        public async Task<IActionResult> getCreateAgencyLoginList([FromQuery] TestFilterData filter)
        {
            try


            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();


                var dt = await _cn.FillDataTableAsync("HardwareAgencyLoginList", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<CreateAgencyLoginListViewModal>());

                var list = dt.AsEnumerable().Select(row => new CreateAgencyLoginListViewModal


                {


                    //AgencyId = Convert.ToInt32(row["AgencyId"]),
                    agencyname = row["agencyname"]?.ToString(),
                    Email = row["Email"]?.ToString(),
                    Password = row["Password"]?.ToString(),

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
        // get data fill in the Table Agency Login
        public async Task<IActionResult> GetAgencyLogin([FromQuery] TestFilterData filter)


        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;

                SortedList parameters = new SortedList();
                parameters.Add("@AgencyId", id);


                var dt = await _cn.FillDataTableAsync("HardwareAgencyDdl", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<CreateLoginIdViewModal>());

                var list = dt.AsEnumerable().Select(row => new CreateLoginIdViewModal
                {

                    Email = row["EmailID"]?.ToString(),
                    Mobile = row["PhoneNumber"]?.ToString(),
                    AddressDetails = row["AddressDetails"]?.ToString(),



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
        // Submit data rom Table Agency Login
        public async Task<IActionResult> SubmitAgencyLogin([FromForm] string AgencyLogin)
        {
            var model = new AgencyLoginModel();
            string message = "";
            try
            {
                model = JsonConvert.DeserializeObject<AgencyLoginModel>(AgencyLogin);



                if (model == null)
                {
                    return BadRequest("Model is null");
                }

                var userId = User.FindFirst("UserId")?.Value;
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("HardwareAgencyLoginCreate_Accept", con);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@AgencyId", model.AgencyId);
                cmd.Parameters.AddWithValue("@Email", model.Email);
                cmd.Parameters.AddWithValue("@Mobile", model.Mobile);
                cmd.Parameters.AddWithValue("@FirstName", model.FirstName);
                cmd.Parameters.AddWithValue("@LastName", model.LastName);
                cmd.Parameters.AddWithValue("@Password", model.Password);
                cmd.Parameters.AddWithValue("@createdBy", userId);

                // ✅ Correct Output Parameter
                SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
                mesParam.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(mesParam);

                await con.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                message = mesParam.Value?.ToString();
            }
            catch (Exception ex)
            {
                message = ex.Message;

            }
            return Ok(new { success = true, message = message });

        }
        #endregion

        #region Create Department Login
        public IActionResult CreateDepartmentLogin()
        {
            return View();
        }
        // get Create Department Login
        public async Task<IActionResult> getCreateDepartmentLoginList([FromQuery] TestFilterData filter)
        {
            try


            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@DeptId", 0);

                var dt = await _cn.FillDataTableAsync("HardwareDeptLoginList", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DepartmentLoginListViewModal>());

                var list = dt.AsEnumerable().Select(row => new DepartmentLoginListViewModal


                {


                    ID = Convert.ToInt32(row["ID"]),
                    departmentName = row["departmentName"]?.ToString(),
                    Email = row["Email"]?.ToString(),
                    BillingAddress = row["BillingAddress"]?.ToString(),
                    Password = row["Password"]?.ToString(),

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
        // ddl of Billing Address when Department choose
        public async Task<IActionResult> GetDepartmentLogin([FromQuery] TestFilterData filter)


        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;

                SortedList parameters = new SortedList();
                parameters.Add("@deptId", 0);
                parameters.Add("@billingId", 0);


                var dt = await _cn.FillDataTableAsync("HardwareBillingAddresslist", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<CreateDepartmentLoginViewModal>());

                var list = dt.AsEnumerable().Select(row => new CreateDepartmentLoginViewModal
                {


                    AddressDetails = row["AddressDetails"]?.ToString(),



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
        // Submit data rom Table Department Login
        public async Task<IActionResult> SubmitDepartmentLogin([FromForm] string DepartmentLogin)
        {
            var model = new DepartmentLoginModel();
            string message = "";
            try
            {
                model = JsonConvert.DeserializeObject<DepartmentLoginModel>(DepartmentLogin);



                if (model == null)
                {
                    return BadRequest("Model is null");
                }

                var userId = User.FindFirst("UserId")?.Value;
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("HardwareDeptLoginCreate_Accept", con);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@BillingId", model.BillingId);
                cmd.Parameters.AddWithValue("@Email", model.Email);
                cmd.Parameters.AddWithValue("@Mobile", model.Mobile);
                cmd.Parameters.AddWithValue("@FirstName", model.FirstName);
                cmd.Parameters.AddWithValue("@LastName", model.LastName);
                cmd.Parameters.AddWithValue("@Password", model.Password);
                cmd.Parameters.AddWithValue("@createdBy", userId);

                // ✅ Correct Output Parameter
                SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
                mesParam.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(mesParam);

                await con.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                message = mesParam.Value?.ToString();
            }
            catch (Exception ex)
            {
                message = ex.Message;

            }
            return Ok(new { success = true, message = message });

        }
        #endregion
        
     
        
        #region Modify Sale Order
        public IActionResult ModifySaleOrder()
        {
            return View();
        }
        // get Modify Sale Order Main Table
   //     public async Task<IActionResult> getModifySaleOrderList([FromQuery] TestFilterData filter)
   //     {
   //         try
   //         {
   //             // Access as object
   //             int id = filter.FilterId1;
   //             var userId = User.FindFirst("UserId")?.Value;
   //             var roleId = User.FindFirst("RoleId")?.Value;
   //             SortedList parameters = new SortedList();
   //             parameters.Add("@SaleOrderId", filter.FilterId1);




   //             var dt = await _cn.FillDataTableAsync("HardwareSaleOrderQty_Get", "", parameters);

   //             if (dt == null || dt.Rows.Count == 0)
   //                 return Ok(new List<SaleOrderModifyViewModal>());

   //             var list = dt.AsEnumerable().Select(row => new SaleOrderModifyViewModal


   //             {

   //                 ProductName = row["ProductName"]?.ToString(),
   //                 OrderDetailsId = Convert.ToInt32(row["OrderDetailsId"]),
   //                 ProductId = Convert.ToInt32(row["ProductId"]),
   //                 ModelNo = row["ModelNo"]?.ToString(),
   //                 IsDraftOrder = row["IsDraftOrder"]?.ToString(),
   //                 Sepcification = row["Sepcification"]?.ToString(),
   //                 OrderQty = row["OrderQty"]?.ToString(),
   //                 Price = row["Price"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Price"]),
   //                 AdminCharge = row["AdminCharge"] == DBNull.Value ? 0m : Convert.ToDecimal(row["AdminCharge"]),
   //                 Gst = row["Gst"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Gst"]),
   //                 Gtotal = row["Gtotal"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Gtotal"]),







   //             }).ToList();

   //             return Ok(list);
   //         }
   //         catch (Exception ex)
   //         {
   //             return StatusCode(500, new
   //             {
   //                 success = false,
   //                 message = "Server error.",
   //                 error = ex.Message
   //             });
   //         }
   //     }
   //     public async Task<IActionResult> getRecordFilldata([FromQuery] TestFilterData filter)
   //     {
   //         try
   //         {
   //             // Access as object
   //             int id = filter.FilterId1;
   //             var userId = User.FindFirst("UserId")?.Value;
   //             var roleId = User.FindFirst("RoleId")?.Value;
   //             SortedList parameters = new SortedList();
   //             parameters.Add("@ProductId", filter.FilterId1);
   //             parameters.Add("@Qty", filter.FilterId2);




   //             var dt = await _cn.FillDataTableAsync("HardwareProductDetailsQty_list", "", parameters);

   //             if (dt == null || dt.Rows.Count == 0)
   //                 return Ok(new List<SaleOrderModifyViewModal>());

   //             var list = dt.AsEnumerable().Select(row => new SaleOrderModifyViewModal


   //             {

   //                 //ProductName = row["ProductName"]?.ToString(),
   //                 //ProductId = Convert.ToInt32(row["ProductId"]),
   //                 //ModelNo = row["ModelNo"]?.ToString(),
   //                 Sepcification = row["Sepcification"]?.ToString(),
   //                 //OrderQty = row["OrderQty"]?.ToString(),
   //                 Price = row["ProductPrice"] == DBNull.Value ? 0m : Convert.ToDecimal(row["ProductPrice"]),
   //                 TotalPrice = row["TotalPrice"] == DBNull.Value ? 0m : Convert.ToDecimal(row["TotalPrice"]),
   //                 AdminCharge = row["HPSEDCCharges"] == DBNull.Value ? 0m : Convert.ToDecimal(row["HPSEDCCharges"]),
   //                 Gst = row["Gst"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Gst"]),
   //                 Gtotal = row["Total"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Total"]),







   //             }).ToList();

   //             return Ok(list);
   //         }
   //         catch (Exception ex)
   //         {
   //             return StatusCode(500, new
   //             {
   //                 success = false,
   //                 message = "Server error.",
   //                 error = ex.Message
   //             });
   //         }
   //     }
   //     // Submit data Modify Sale Order
   //     public async Task<IActionResult> SubmitModifySaleOrder([FromForm] string ModifySaleOrder,
   //IFormFile ModifySale)

   //     {
   //         var model = JsonConvert.DeserializeObject<ModifySaleOrderModel>(ModifySaleOrder);

   //         IFormFile attachmentFile1 = ModifySale;

   //         string AttachDocument = "";
   //         if (attachmentFile1 != null && attachmentFile1.Length > 0)
   //         {
   //             string folderPath = Path.Combine(
   //                 Directory.GetCurrentDirectory(),
   //                 "wwwroot/Attachment/ModifySale"
   //             );

   //             if (!Directory.Exists(folderPath))
   //                 Directory.CreateDirectory(folderPath);

   //             string extension = Path.GetExtension(attachmentFile1.FileName);

   //             AttachDocument = $"PIConfirmation_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

   //             string filePath = Path.Combine(folderPath, AttachDocument);

   //             using (var stream = new FileStream(filePath, FileMode.Create))
   //             {
   //                 await attachmentFile1.CopyToAsync(stream);
   //             }
   //         }

   //         if (model == null)
   //         {
   //             return BadRequest("Model is null");
   //         }

   //         var userId = User.FindFirst("UserId")?.Value;
   //         using SqlConnection con = new SqlConnection(_connectionString);
   //         using SqlCommand cmd = new SqlCommand("HardwareSaleOrderQty_Update", con);

   //         cmd.CommandType = CommandType.StoredProcedure;

   //         cmd.Parameters.AddWithValue("@SaleOrderId", model.SaleOrderId);
   //         cmd.Parameters.AddWithValue("@DeliveryAttachement", AttachDocument);
   //         cmd.Parameters.AddWithValue("@CreatedBy", userId);

   //         // Convert child list to DataTable
   //         System.Data.DataTable dt = new System.Data.DataTable();

   //         dt.Columns.Add("OrderDetailsId", typeof(int));
   //         dt.Columns.Add("IsDraftOrder", typeof(string));
   //         dt.Columns.Add("ProductId", typeof(int));
   //         dt.Columns.Add("OrderQty", typeof(decimal));
   //         dt.Columns.Add("Price", typeof(decimal));
   //         dt.Columns.Add("Gst", typeof(decimal));
   //         dt.Columns.Add("AdminCharge", typeof(decimal));
   //         dt.Columns.Add("Gtotal", typeof(decimal));
   //         dt.Columns.Add("Narration", typeof(string));


   //         foreach (var item in model.Items)
   //         {
   //             dt.Rows.Add(item.OrderDetailsId, item.IsDraftOrder, item.ProductId,
   //                 item.OrderQty, item.Price, item.Gst, item.AdminCharge, item.Gtotal, item.Narration);
   //         }

   //         SqlParameter tvpParam = cmd.Parameters.AddWithValue("@tblTempHardwarSaleOrder2", dt);
   //         tvpParam.SqlDbType = SqlDbType.Structured;
   //         tvpParam.TypeName = "tblTempHardwarSaleOrder12";
   //         // ✅ Correct Output Parameter
   //         SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
   //         mesParam.Direction = ParameterDirection.Output;
   //         cmd.Parameters.Add(mesParam);

   //         await con.OpenAsync();

   //         await cmd.ExecuteNonQueryAsync();
   //         string message = mesParam.Value?.ToString();
   //         return Ok(new { success = true, message = message });

   //     }
        #endregion


    }

}
