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
    public class HardwareOrderController : Controller
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        private readonly string _connectionString;
        public HardwareOrderController(ISqlDataAccess db, IMemoryCache cache, IConfiguration configuration)
        {
            _cn = db;
            _cache = cache;
            _connectionString = configuration.GetConnectionString("TestConnection");
        }
        public IActionResult Index()
        {
            return View();
        }
        #region Sale Order
        public IActionResult SaleOrder()
        {
            return View();
        }
        [HttpGet]
        // get Price Record Filter Data
        public async Task<IActionResult> GetPriceRecord([FromQuery] TestFilterData filter)
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
                    //HSNCode = row["HSNCode"]?.ToString(),
                    Sepcification = row["Sepcification"]?.ToString(),
                    ProductPrice = Convert.ToDecimal(row["ProductPrice"]),
                    TotalPrice = Convert.ToDecimal(row["TotalPrice"]),
                    //Cgst = Convert.ToDecimal(row["Cgst"]),
                    //Sgst = row["Sgst"] != DBNull.Value ? Convert.ToDouble(row["Sgst"]) : 0.0,
                    Gst = Convert.ToDecimal(row["Gst"]),
                    HPSEDCCharges = Convert.ToDecimal(row["HPSEDCCharges"]),
                    GrandTotal = Convert.ToDecimal(row["GrandTotal"]),
                    Total = Convert.ToDecimal(row["Total"]),

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
        // Submit SaleOrder
        // Store data in one to many relation form
        public async Task<IActionResult> SaveOrder([FromForm] string placeOrder,
    IFormFile DeptDocument,
    IFormFile LocationAttachment)
        {
            var model = JsonConvert.DeserializeObject<PlaceOrderModel>(placeOrder);

            IFormFile attachmentFile1 = LocationAttachment;
            IFormFile attachmentFile2 = DeptDocument;
            string DeliveryAttachement = "";
            if (attachmentFile1 != null && attachmentFile1.Length > 0)
            {
                string folderPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/Attachment/SaleOrder/DeliveryLocation"
                );

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string extension = Path.GetExtension(attachmentFile1.FileName);

                DeliveryAttachement = $"Location_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                string filePath = Path.Combine(folderPath, DeliveryAttachement);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await attachmentFile1.CopyToAsync(stream);
                }
            }

            string DeptOrderAttachment = "";
            if (attachmentFile2 != null && attachmentFile2.Length > 0)
            {
                string folderPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/Attachment/SaleOrder/OrderAttachment"
                );

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string extension = Path.GetExtension(attachmentFile2.FileName);

                DeptOrderAttachment = $"DeptOrder_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                string filePath = Path.Combine(folderPath, DeptOrderAttachment);

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
            using SqlCommand cmd = new SqlCommand("HardwareSaleOrder_AcceptUpdate", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@SaleOrderId", model.SaleOrderId);
            cmd.Parameters.AddWithValue("@SaleOrderNo", model.SaleOrderNo);
            cmd.Parameters.AddWithValue("@SaleOrderNoText", model.SaleOrderNoText);
            cmd.Parameters.AddWithValue("@OrderDate", model.OrderDate);
            cmd.Parameters.AddWithValue("@DeptId", model.DeptId);
            cmd.Parameters.AddWithValue("@BillingAddressId", model.BillingAddressId);
            cmd.Parameters.AddWithValue("@BillingAddressText", model.BillingAddressText);
            cmd.Parameters.AddWithValue("@LetterReferenceNo", model.LetterReferenceNo);
            cmd.Parameters.AddWithValue("@DeliveryDate", model.DeliveryDate);
            cmd.Parameters.AddWithValue("@Total", model.Total);
            cmd.Parameters.AddWithValue("@Cgst", model.Cgst);
            cmd.Parameters.AddWithValue("@Sgst", model.Sgst);
            cmd.Parameters.AddWithValue("@Gst", model.Gst);
            cmd.Parameters.AddWithValue("@AdminCharge", model.AdminCharge);
            cmd.Parameters.AddWithValue("@Gtotal", model.Gtotal);
            cmd.Parameters.AddWithValue("@PaymentAmt", model.PaymentAmt);
            cmd.Parameters.AddWithValue("@Balance", model.Balance);
            cmd.Parameters.AddWithValue("@IsPaymentRequired", model.IsPaymentRequired);
            cmd.Parameters.AddWithValue("@DeliveryAttachement", DeliveryAttachement);
            cmd.Parameters.AddWithValue("@Attachement", DeptOrderAttachment);
            cmd.Parameters.AddWithValue("@CreatedBy", userId);
            // Convert child list to DataTable
            System.Data.DataTable dt = new System.Data.DataTable();
            dt.Columns.Add("ProductId", typeof(int));
            dt.Columns.Add("OrderQty", typeof(double));
            dt.Columns.Add("Price", typeof(double));
            dt.Columns.Add("Gst", typeof(double));
            dt.Columns.Add("AdminCharge", typeof(double));
            dt.Columns.Add("Gtotal", typeof(double));
            dt.Columns.Add("Narration", typeof(string));

            foreach (var item in model.Items)
            {
                dt.Rows.Add(item.ProductId, item.OrderQty, item.Price, item.Gst, item.AdminCharge, item.Gtotal, item.Narration);
            }

            SqlParameter tvpParam = cmd.Parameters.AddWithValue("@tblTempHardwarSaleOrder2", dt);
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.TypeName = "tblTempHardwarSaleOrder123";
            // ✅ Correct Output Parameter
            SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
            mesParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(mesParam);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
            string message = mesParam.Value?.ToString();
            return Ok(new { success = true, message = message });

        }

        // get Sale Order List
        [HttpGet]
        public async Task<IActionResult> getSaleOrderList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", filter.FilterId1);
                parameters.Add("@RoleId", roleId);
                parameters.Add("@PurchaseIssue", filter.FilterName1 ?? "");
                parameters.Add("@AgencyId", filter.FilterId2);
                parameters.Add("@DeptId", filter.FilterId3);
                parameters.Add("@CreatedBy", userId);

                var dt = await _cn.FillDataTableAsync("HardwareSaleOrder_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<SaleOrderListViewModal>());

                var list = dt.AsEnumerable().Select(row => new SaleOrderListViewModal


                {


                    SaleOrderId = row["SaleOrderId"]?.ToString(),
                    SaleOrder = row["HWSaleOrderNo"]?.ToString(),
                    ReferenceNo = row["LetterReferenceNo"]?.ToString(),
                    PoNo = row["PurchaseOrderNo"]?.ToString(),
                    DeptReferenceNo = row["LetterReferenceNo"]?.ToString(),
                    OrderDate = row["OrderDate"] != DBNull.Value ? Convert.ToDateTime(row["OrderDate"]) : DateTime.MinValue,
                    DepartmentName = row["departmentName"]?.ToString(),
                    BillingAddress = row["BillingAddress"]?.ToString(),
                    //ItemDescription = row["ItemDescription"]?.ToString(),

                    DeliveryLocationDoc = row["DeliveryAttachement"]?.ToString(),
                    // AddLocation = row["AddLocation"]?.ToString(),
                    GrandTotalAmt = row["Gtotal"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Gtotal"]),
                    Balance = row["Balance"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Balance"]),
                    DeptReceivedAmt = row["PaymentAmt"] == DBNull.Value ? 0 : Convert.ToDecimal(row["PaymentAmt"]),
                    PurchaseIssued = row["IsPurchaseOrderIssue"] == DBNull.Value ? 'N' : Convert.ToChar(row["IsPurchaseOrderIssue"]),
                    CancelSaleOrder = row["IsCancel"] == DBNull.Value ? 'N' : Convert.ToChar(row["IsCancel"]),







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
        // get Item Description List
        [HttpGet]
        public async Task<IActionResult> getItemDescriptionList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", filter.FilterId1);
                parameters.Add("@PurchaseOrderId", filter.FilterId2);
                parameters.Add("@UserRole", roleId);
                parameters.Add("@SaleOrderType", filter.FilterName1 ?? "");


                var dt = await _cn.FillDataTableAsync("HardwareProductSaleOrderExportPIssue_list", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<ItemDescriptionViewModal>());

                var list = dt.AsEnumerable().Select(row => new ItemDescriptionViewModal


                {

                    ItemDescription = row["ProductName"]?.ToString(),
                    Quantity = row["OrderQty"] == DBNull.Value ? 0m : Convert.ToDecimal(row["OrderQty"]),
                    BasePrice = row["Price"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Price"]),
                    GST = row["Gst"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Gst"]),
                    UnitRate = row["ProductGrandTotal"] == DBNull.Value ? 0m : Convert.ToDecimal(row["ProductGrandTotal"]),
                    TotalAmount = row["Gtotal"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Gtotal"]),







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

        // get Add Location List
        [HttpGet]
        public async Task<IActionResult> getAddLocationList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@PurchaseOrderNo", filter.FilterId2);
                parameters.Add("@SaleOrderId", filter.FilterId1);



                var dt = await _cn.FillDataTableAsync("HardwareDeliveryAddressItemWise_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<AddLocationViewModal>());

                var list = dt.AsEnumerable().Select(row => new AddLocationViewModal


                {

                    ItemDetailsId = row["OrderDetailsId"] == DBNull.Value ? 0 : Convert.ToInt32(row["OrderDetailsId"]),
                    ProductId = row["ProductId"] == DBNull.Value ? 0 : Convert.ToInt32(row["ProductId"]),
                    ProductName = row["ProductName"]?.ToString(),
                    OrderQty = row["OrderQty"] == DBNull.Value ? 0m : Convert.ToDecimal(row["OrderQty"]),
                    AvailableQuantity = row["Restqty"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Restqty"]),
                    DeliveryQuantity = row["DeliveryQty"] == DBNull.Value ? 0m : Convert.ToDecimal(row["DeliveryQty"]),








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

        // get Add Delivery Address List
        [HttpGet]
        public async Task<IActionResult> getAddDeliveryAddressList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", filter.FilterId1);
                parameters.Add("@PurchaseOrderId", filter.FilterId2);



                var dt = await _cn.FillDataTableAsync("HardwareEnterDeliveryAddress_List1", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<AddDeliveryAddressViewModal>());

                var list = dt.AsEnumerable().Select(row => new AddDeliveryAddressViewModal


                {

                    OrderDetailsId = row["OrderDetailsId"] == DBNull.Value ? 0 : Convert.ToInt32(row["OrderDetailsId"]),
                    ProductName = row["ProductName"]?.ToString(),
                    DeliveryQuantity = row["DeliveryQty"] == DBNull.Value ? 0m : Convert.ToDecimal(row["DeliveryQty"]),
                    ConsigneeName = row["ConsigneeName"]?.ToString(),
                    ContactNo = row["ConsigneeContactNo"]?.ToString(),
                    ConsigneeAddress = row["consigneeAddress"]?.ToString(),
                    AddressType = row["AreaType"]?.ToString(),









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

        // Store data in one to many relation form consignee Address
        public async Task<IActionResult> SaveConsigneeAddress([FromForm] string consigneeAddress)
        {
            var model = JsonConvert.DeserializeObject<DeliveryLocationModal>(consigneeAddress);

            if (model == null)
            {
                return BadRequest("Model is null");
            }

            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwareEnterDeliveryAddress_AcceptUpdate1", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@OrderDeliveryId", model.OrderDeliveryId);
            cmd.Parameters.AddWithValue("@AreaType", model.AreaType);



            // Convert child list to DataTable
            System.Data.DataTable dt = new System.Data.DataTable();
            dt.Columns.Add("ItemDetailsId", typeof(int));
            dt.Columns.Add("SaleOrderId", typeof(int));
            dt.Columns.Add("ProductId", typeof(int));
            dt.Columns.Add("DeliveryQty", typeof(double));
            dt.Columns.Add("ConsigneeName", typeof(string));
            dt.Columns.Add("ConsigneeContactNo", typeof(string));
            dt.Columns.Add("consigneeAddress", typeof(string));
            dt.Columns.Add("DistrictId", typeof(int));
            dt.Columns.Add("DeliveredQty", typeof(int));



            foreach (var item in model.Items)
            {
                dt.Rows.Add(item.ItemDetailsId, item.SaleOrderId, item.ProductId, item.DeliveryQty, item.ConsigneeName, item.ConsigneeContactNo, item.consigneeAddress, item.DistrictId, 0);
            }

            SqlParameter tvpParam = cmd.Parameters.AddWithValue("@TemptblHardwarSaleOrder3", dt);
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.TypeName = "TemptblHardwarSaleOrder3";
            // ✅ Correct Output Parameter
            SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
            mesParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(mesParam);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
            string message = mesParam.Value?.ToString();
            return Ok(new { success = true, message = message });

        }
        // Delete Records from Table
        [HttpPost]
        public IActionResult DeleteConsigneeAddress([FromForm] TestFilterData filter)
        {
            try
            {
                //Console.WriteLine("Delete Id Received: " + model.Id);

                var userId = User.FindFirst("UserId")?.Value;

                SortedList parameters = new SortedList
                {
                   { "@OrderDeliveryId", filter.FilterId1 },

                };

                var result = _cn.ExecuteNonQueryWMessage(
                    "HardwareEnterDeliveryAddress_Removed",
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

        #endregion

        #region View Department detail
        public IActionResult ViewDepartmentDetail()
        {
            return View();
        }
        // Store data in one to many relation from Payment Details List
        [HttpGet]
        public async Task<IActionResult> SavePaymentDetailsList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@ReceiptId", filter.FilterId2);
                parameters.Add("@SaleOrderId", filter.FilterId1);



                var dt = await _cn.FillDataTableAsync("HardwareDeptPaymentTransaction_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<ViewPaymentDetailsModal>());

                var list = dt.AsEnumerable().Select(row => new ViewPaymentDetailsModal


                {

                    SaleOrderId = row["SaleOrderId"]?.ToString(),
                    TransactionId = row["TransactionId"]?.ToString(),
                    ModeOfPayment = row["ModeOfPayment"]?.ToString(),
                    ReleasedAmount = row["BillAmount"] == DBNull.Value ? 0m : Convert.ToDecimal(row["BillAmount"]),
                    Tds = row["Tds"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Tds"]),
                    GstTds = row["GSTTds"] == DBNull.Value ? 0m : Convert.ToDecimal(row["GSTTds"]),
                    PaymentDate = row["CreateDate"] != DBNull.Value ? Convert.ToDateTime(row["CreateDate"]) : DateTime.MinValue,
                    DueBalance = row["DuesAmt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["DuesAmt"]),



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
        // get Sale Order Record Filter Data
        public async Task<IActionResult> GetSaleOrder([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int SaleOrderId = filter.FilterId1;
                int PurchaseOrderId = filter.FilterId2;

                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", SaleOrderId);
                parameters.Add("@PurchaseOrderId", PurchaseOrderId);

                var dt = await _cn.FillDataTableAsync("HardwareDeptBalance_Get", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DepartmentBalViewModal>());

                var list = dt.AsEnumerable().Select(row => new DepartmentBalViewModal
                {
                    OrderReferenceNo = row["LetterReferenceNo"]?.ToString(),
                    SaleOrderNo = row["SaleOrderNoText"]?.ToString(),
                    DepartmentName = row["departmentName"]?.ToString(),
                    OrderAmount = row["gtotal"] == DBNull.Value ? 0m : Convert.ToDecimal(row["gtotal"]),
                    AdvanceAmount = row["Advanceamt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Advanceamt"]),
                    OutstandingAmount = row["Balance"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Balance"]),
                    // BankNameId = row["BankNameId"] == DBNull.Value ? 0 : Convert.ToInt32(row["BankNameId"]),
                    // BalanceAmt = row["BalanceAmt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["BalanceAmt"]),
                    // ReceivedDate = row["ReceivedDate"] != DBNull.Value ? Convert.ToDateTime(row["ReceivedDate"]) : DateTime.MinValue,

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
        // Submit record Department Balance
        [HttpPost]
        public async Task<IActionResult> AddOrEditDepartmentBal([FromForm] string Payment,

            IFormFile Attachment)

        {
            try
            {
                var model = JsonConvert.DeserializeObject<DepartmentPaymentModel>(Payment);

                IFormFile attachmentFile1 = Attachment;

                string PaymentAttachement = "";
                if (attachmentFile1 != null && attachmentFile1.Length > 0)
                {
                    string folderPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/Attachment/Payment/DeptPayment"
                    );

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    string extension = Path.GetExtension(attachmentFile1.FileName);

                    PaymentAttachement = $"DeptPayment_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                    string filePath = Path.Combine(folderPath, PaymentAttachement);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await attachmentFile1.CopyToAsync(stream);
                    }
                }


                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@ReceiptId", model.ReceiptId);
                parameters.Add("@SaleOrderId", model.SaleOrderId);
                parameters.Add("@PurchaseOrderId", model.PurchaseOrderId);
                parameters.Add("@TransactionId", model.TransactionId);
                parameters.Add("@ModeOfPayment", model.ModeOfPayment);
                parameters.Add("@BankNameId", model.BankNameId);
                parameters.Add("@Narration", model.Narration);
                parameters.Add("@ReceivedDate", model.ReceivedDate);
                parameters.Add("@ReceivedAmt", model.ReceivedAmt);
                parameters.Add("@BalanceAmt", model.BalanceAmt);
                parameters.Add("@GSTTds2", model.GSTTds2);
                parameters.Add("@Tds2", model.Tds2);
                parameters.Add("@Document1", PaymentAttachement);
                parameters.Add("@CreatedBy", userId);



                var result = _cn.ExecuteNonQueryWMessage("HardwareDeptPaymentDept_AcceptUpdate", "", parameters);
                var returnMsg = result.ToString();

                return Ok(new { success = true, message = returnMsg });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Server error.", error = ex.Message });
            }
        }
        // get Tracking Status List
        [HttpGet]
        public async Task<IActionResult> getTrackingStatusList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", filter.FilterId1);


                var dt = await _cn.FillDataTableAsync("HardwareTrackingStatus_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<TrackingStatusViewModal>());

                var list = dt.AsEnumerable().Select(row => new TrackingStatusViewModal


                {


                    SaleOrderId = row["SaleOrderId"] == DBNull.Value ? 0 : Convert.ToInt32(row["SaleOrderId"]),
                    Milestone = row["StatusName"]?.ToString(),
                    Status = row["Status"]?.ToString(),
                    CurrentStatus = row["Narration"]?.ToString(),

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
        // get Expected Delivery List
        [HttpGet]
        public async Task<IActionResult> getDeliveryDateList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", filter.FilterId1);


                var dt = await _cn.FillDataTableAsync("HardwareSaleOrderDetails_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DeliveryDateViewModal>());

                var list = dt.AsEnumerable().Select(row => new DeliveryDateViewModal


                {


                    ItemName = row["ProductName"]?.ToString(),
                    SupplierName = row["AgencyName"]?.ToString(),
                    ContactNo = row["PhoneNumber"]?.ToString(),
                    EmailId = row["EmailID"]?.ToString(),
                    EstimatedDeliveryDate = row["EstimatedDate"]?.ToString(),

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
        // get Delivery Detail List
        [HttpGet]
        public async Task<IActionResult> getDeliveryDetailList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", filter.FilterId1);


                var dt = await _cn.FillDataTableAsync("HardwareDeliveryAddress_List2_optimize", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<DeliveryDetailViewModal>());

                var list = dt.AsEnumerable().Select(row => new DeliveryDetailViewModal


                {


                    ProductName = row["ProductName"]?.ToString(),
                    ConsigneeName = row["ConsigneeName"]?.ToString(),
                    Address = row["consigneeAddress"]?.ToString(),
                    ContactNo = row["ConsigneeContactNo"]?.ToString(),
                    DeliveredQty = row["DeliveredQty"] == DBNull.Value ? 0m : Convert.ToDecimal(row["DeliveredQty"]),
                    DeliveredDate = row["DeliveredDate"]?.ToString(),
                    POD = row["Document"]?.ToString(),
                    IR = row["Document2"]?.ToString(),

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
        // Store data in one to many relation from Order Query List
        [HttpGet]
        public async Task<IActionResult> getDataOrderQueryList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@QueryId", filter.FilterId2);
                parameters.Add("@SaleOrderId", filter.FilterId1);



                var dt = await _cn.FillDataTableAsync("hardwareOrderQuery_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<OrderQueryViewModal>());

                var list = dt.AsEnumerable().Select(row => new OrderQueryViewModal


                {

                    QueryType = row["QueryName"]?.ToString(),
                    QueryRemark = row["QueryRemarks"]?.ToString(),




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


        // Submit Order Query
        [HttpPost]
        public IActionResult AddOrEditOrderQuery([FromForm] string OrderQuery,

          IFormFile Attachment)

        {
            try
            {
                var model = JsonConvert.DeserializeObject<OrderQueryModal>(OrderQuery);

                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@QId", model.QId);
                parameters.Add("@SaleOrderId", model.SaleOrderId);
                parameters.Add("@QueryRemarks", model.QueryRemarks);

                var result = _cn.ExecuteNonQueryWMessage("hardwareQuery_AcceptUpdate", "", parameters);
                var returnMsg = result.ToString();

                return Ok(new { success = true, message = returnMsg });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Server error.", error = ex.Message });
            }
        }
        // Submit Feedback
        [HttpPost]
        public IActionResult AddOrEditFeedback([FromForm] string Feedback,

          IFormFile Attachment)

        {
            try
            {
                var model = JsonConvert.DeserializeObject<FeedbackModal>(Feedback);

                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@FeedBackId", model.FeedBackId);
                parameters.Add("@SaleOrderId", model.SaleOrderId);
                parameters.Add("@FeedBackPoint", model.FeedBackPoint);
                parameters.Add("@Remarks", model.Remarks);
                parameters.Add("@CreatedBy", userId);

                var result = _cn.ExecuteNonQueryWMessage("HardwareFeedback_AcceptUpdate", "", parameters);
                var returnMsg = result.ToString();

                return Ok(new { success = true, message = returnMsg });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Server error.", error = ex.Message });
            }
        }
        #endregion
        #region Sale Order Verify
        public IActionResult SaleOrderVerify()
        {
            return View();
        }
        // get Data in Multiple Table for Sale Order Verify List
        [HttpGet]
        public async Task<IActionResult> getDataSaleOrderVerifyList(TestFilterData filter)
        {
            try
            {
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", filter.FilterId1);

                var ds = await _cn.FillDataSetAsync("HardwareSaleOrder_Get", "", parameters);
                if (ds == null || ds.Tables.Count == 0)
                    return Ok();

                var dt1 = ds.Tables[0]; // First table
                var dt2 = ds.Tables[1]; // Second table (if exists)
                var dt3 = ds.Tables[2]; // Second table (if exists)
                var list1 = dt1.AsEnumerable().Select(row => new SaleOrderIdViewModal
                {
                    SaleOrderNo = Convert.ToInt32(row["SaleOrderNo"]),
                    HWSaleOrderNo = row["HWSaleOrderNo"]?.ToString(),
                    BillingAddressId = Convert.ToInt32(row["BillingAddressId"]),
                    LetterReferenceNo = row["LetterReferenceNo"]?.ToString(),
                    OrderDate = row["OrderDate"] != DBNull.Value ? Convert.ToDateTime(row["OrderDate"]) : DateTime.MinValue,
                    DeptId = Convert.ToInt32(row["DeptId"]),
                    CreatedDate = row["CreatedDate"] != DBNull.Value ? Convert.ToDateTime(row["CreatedDate"]) : DateTime.MinValue,
                    Total = row["Total"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Total"]),
                    AdminCharge = row["AdminCharge"] == DBNull.Value ? 0m : Convert.ToDecimal(row["AdminCharge"]),
                    Gst = row["Gst"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Gst"]),
                    Gtotal = row["Gtotal"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Gtotal"]),

                }).ToList();

                var list2 = dt2.AsEnumerable().Select(row => new ConsigneeAddressViewModal
                {
                    SaleOrderId = Convert.ToInt32(row["SaleOrderId"]),
                    //DeliveryQty = CommonNew.GenerateKeyField(Convert.ToInt32(row["Id"])),
                    DeliveryQty = row["DeliveryQty"] == DBNull.Value ? 0m : Convert.ToDecimal(row["DeliveryQty"]),
                    consigneeAddress = row["consigneeAddress"]?.ToString(),

                }).ToList();
                var list3 = dt3.AsEnumerable().Select(row => new ProductDetailsViewModal
                {
                    MainCatgName = row["MainCatgName"]?.ToString(),
                    CompanyName = row["CompanyName"]?.ToString(),
                    ProductName = row["ProductName"]?.ToString(),
                    //ProductName = Convert.ToInt32(row["ProductName"]),
                    ModelNo = row["ModelNo"]?.ToString(),
                    Sepcification = row["Sepcification"]?.ToString(),
                    OrderQty = Convert.ToInt32(row["OrderQty"]),
                    Price = row["Price"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Price"]),
                    Gtotal = row["Gtotal"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Gtotal"]),
                    AdminCharge = row["AdminCharge"] == DBNull.Value ? 0m : Convert.ToDecimal(row["AdminCharge"]),
                    Gst = row["Gst"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Gst"]),
                    Narration = row["Narration"]?.ToString(),

                }).ToList();

                // return Ok(list); // ✅ return added
                return Ok(new
                {
                    SaleOrderDetails = list1,
                    ConsigneeAddress = list2,
                    ProductDetails = list3,
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error",
                    error = ex.Message
                }); // ✅ return added
            }
        }
        // Submit Sale Order Verify
        [HttpPost]
        public IActionResult AddOrEditSaleVerified([FromForm] string Verified)
        {
            try
            {
                var model = JsonConvert.DeserializeObject<SaleOrderVerifyModal>(Verified);

                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", model.SaleOrderId);
                parameters.Add("@Verify", model.Verify);
                parameters.Add("@Remarks", model.Remarks);
                parameters.Add("@CreateBy", userId);

                var result = _cn.ExecuteNonQueryWMessage("TallySaleOrderVerify_AcceptUpdate", "", parameters);
                var returnMsg = result.ToString();

                return Ok(new { success = true, message = returnMsg });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Server error.", error = ex.Message });
            }
        }
        // get Sale Verify List
        [HttpGet]
        public async Task<IActionResult> getSaleVerifyList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", filter.FilterId1);


                var dt = await _cn.FillDataTableAsync("HardwareTrackingStatus_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<TrackingStatusViewModal>());

                var list = dt.AsEnumerable().Select(row => new TrackingStatusViewModal


                {


                    SaleOrderId = row["SaleOrderId"] == DBNull.Value ? 0 : Convert.ToInt32(row["SaleOrderId"]),
                    Milestone = row["StatusName"]?.ToString(),
                    Status = row["Status"]?.ToString(),
                    CurrentStatus = row["Narration"]?.ToString(),

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
        #region New Dept Order
        public IActionResult NewDeptOrder()
        {
            return View();
        }
        #endregion
        #region Issue Order
        public IActionResult IssueOrder()
        {
            return View();
        }
        // get Issue Order List
        [HttpGet]
        public async Task<IActionResult> getIssueOrderList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", filter.FilterId1);
                parameters.Add("@RoleId", roleId);
                parameters.Add("@PurchaseIssue", filter.FilterName1 ?? "");
                parameters.Add("@CreatedBy", userId);
                parameters.Add("@AgencyId", filter.FilterId2);
                parameters.Add("@DeptId", filter.FilterId3);

                var dt = await _cn.FillDataTableAsync("HardwareSaleOrder_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<IssueOrderViewModal>());

                var list = dt.AsEnumerable().Select(row => new IssueOrderViewModal


                {

                    SaleOrderId = Convert.ToInt32(row["SaleOrderId"]),
                    SaleOrderNo = row["SaleOrderNo"]?.ToString(),
                    RefferenceNo = row["LetterReferenceNo"]?.ToString(),
                    PONO = row["IsPurchaseOrderIssue"]?.ToString(),
                    DeptReffNo = row["LetterReferenceNo"]?.ToString(),
                    OrderDate = row["OrderDate"] != DBNull.Value ? Convert.ToDateTime(row["OrderDate"]) : DateTime.MinValue,
                    OrderStatus = row["SaleOrderId"] == DBNull.Value ? 0 : Convert.ToInt32(row["SaleOrderId"]),
                    DepartmentName = row["departmentName"]?.ToString(),
                    BillingAddress = row["BillingAddress"]?.ToString(),
                    BillAmt = row["PaymentAmt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["PaymentAmt"]),
                    Balance = row["Balance"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Balance"]),
                    DeptAmtReceived = row["Balance"] == DBNull.Value ? 0 : Convert.ToDecimal(row["Balance"]),

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
        // get Issue Purchase List
        [HttpGet]
        public async Task<IActionResult> getPurchaseIssueList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();

                parameters.Add("@SaleOrderId", filter.FilterId1);



                var dt = await _cn.FillDataTableAsync("HardwareSaleOrderDetails_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<PurchaseIssueViewModal>());

                var list = dt.AsEnumerable().Select(row => new PurchaseIssueViewModal


                {

                    SaleOrderId = row["SaleOrderId"] == DBNull.Value ? 0 : Convert.ToInt32(row["SaleOrderId"]),
                    OrderDetailId = row["OrderDetailsId"] == DBNull.Value ? 0 : Convert.ToInt32(row["OrderDetailsId"]),
                    SaleOrder = row["SaleOrderId"] == DBNull.Value ? 'N' : Convert.ToChar(row["SaleOrderId"]),
                    RefferenceNo = row["SaleOrderId"]?.ToString(),
                    ProductName = row["ProductName"]?.ToString(),
                    Quantity = row["Qty"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Qty"]),
                    PurchaseOrderNo = row["PurchaseOrderNo"]?.ToString(),
                    PurchaseOrderDate = row["PurchaseOrderDate"]?.ToString(),
                    Amount = row["ProductPrice"] == DBNull.Value ? 0m : Convert.ToDecimal(row["ProductPrice"]),
                    AgencyName = row["AgencyName"]?.ToString(),







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
        // Store data in one to many relation form Purchase Issue Order 
        public async Task<IActionResult> SubmitPurchaseIssuesOrder([FromForm] string PurchaseOrderIssue)
        {
            var model = JsonConvert.DeserializeObject<IssuesOrderModal>(PurchaseOrderIssue);

            if (model == null)
            {
                return BadRequest("Model is null");
            }

            var userId = User.FindFirst("UserId")?.Value;
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("HardwarePurchaseOrder_Issue2", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@OrderDetailsId ", model.OrderDetailsId);
            cmd.Parameters.AddWithValue("@AgencyId ", model.AgencyId);
            cmd.Parameters.AddWithValue("@IsUniquePruchaseOrder ", model.IsUniquePruchaseOrder);
            cmd.Parameters.AddWithValue("@CreatedBy ", userId);
            // Convert child list to DataTable
            System.Data.DataTable dt = new System.Data.DataTable();
            dt.Columns.Add("OrderDetailsId", typeof(int));
            dt.Columns.Add("validDateFrom", typeof(string));
            dt.Columns.Add("validDateTo", typeof(string));




            foreach (var item in model.Items)
            {
                dt.Rows.Add(item.OrderDetailsId, item.validDateFrom, item.validDateTo);
            }

            SqlParameter tvpParam = cmd.Parameters.AddWithValue("@OrderDetailsIdTable", dt);
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.TypeName = "OrderDetailsIdTable3";
            // ✅ Correct Output Parameter
            SqlParameter mesParam = new SqlParameter("@mes", SqlDbType.VarChar, -1);
            mesParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(mesParam);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
            string message = mesParam.Value?.ToString();
            return Ok(new { success = true, message = message });

        }
        // get Purchase Order List
        [HttpGet]
        public async Task<IActionResult> getStatusPurchaseOrderList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", 32);




                var dt = await _cn.FillDataTableAsync("HardwarePOAcceptRejectList", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<PurchaseOrderViewModal>());

                var list = dt.AsEnumerable().Select(row => new PurchaseOrderViewModal


                {

                    PO = row["PurchaseOrderNoId"]?.ToString(),
                    PODate = row["PurchaseOrderDate"] != DBNull.Value ? Convert.ToDateTime(row["PurchaseOrderDate"]) : DateTime.MinValue,
                    Agency = row["AgencyName"]?.ToString(),
                    ActionByAgency = row["IsOrderAccept"]?.ToString(),
                    ActionDate = row["OrderAcceptDate"] != DBNull.Value ? Convert.ToDateTime(row["OrderAcceptDate"]) : DateTime.MinValue,
                    ActionRemarks = row["OrderAcceptRemarks"]?.ToString(),










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
        // get Purchase Issue Remarks List
        [HttpGet]
        public async Task<IActionResult> getPurchaseIssueRemarksList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@RemarkId", 0);
                parameters.Add("@SaleOrderId", 54);
                var dt = await _cn.FillDataTableAsync("HardwareRemarks_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<PurchaseIssueRemarksViewModal>());

                var list = dt.AsEnumerable().Select(row => new PurchaseIssueRemarksViewModal


                {

                    Remarks = row["Remarks"]?.ToString(),
                    RemarksDoc = row["Attachment"]?.ToString(),
                    RemarksDate = row["RemarksDate"] != DBNull.Value ? Convert.ToDateTime(row["RemarksDate"]) : DateTime.MinValue,
                    RemarksBy = row["RemarksBy"]?.ToString(),











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
        // get fill data in List
        [HttpGet]
        public async Task<IActionResult> getVerificationStatusList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", 32);




                var dt = await _cn.FillDataTableAsync("HardwareVerfication_detail", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<VerificationStatusViewModal>());

                var list = dt.AsEnumerable().Select(row => new VerificationStatusViewModal


                {

                    SaleOrderId = row["SaleOrderId"]?.ToString(),
                    VerificationStatus = row["IsSaleOrderVarified"]?.ToString(),
                    VerifiedDate = row["VerifiedDate"]?.ToString(),
                    Remarks = row["VRemarks"]?.ToString(),


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

        // Submit Remarks
        [HttpPost]
        public async Task<IActionResult> SubmitPurchaseOrderRemarks([FromForm] string PORemark,
    IFormFile RemarkAttachment)
        {
            var model = JsonConvert.DeserializeObject<PurchaseOrderRemarkModel>(PORemark);

            IFormFile attachmentFile1 = RemarkAttachment;

            string DeliveryAttachement = "";
            if (attachmentFile1 != null && attachmentFile1.Length > 0)
            {
                string folderPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/Attachment/SaleOrder/PurchaseOrderRemark"
                );

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string extension = Path.GetExtension(attachmentFile1.FileName);

                DeliveryAttachement = $"PurchaseOrderRemark_{DateTime.Now:yyyyMMdd}_{Guid.NewGuid()}{extension}";

                string filePath = Path.Combine(folderPath, DeliveryAttachement);

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
            using SqlCommand cmd = new SqlCommand("HardwareRemarks_AcceptUpdate", con);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@RemarkId", model.RemarkId);
            cmd.Parameters.AddWithValue("@SaleOrderId", model.SaleOrderId);
            cmd.Parameters.AddWithValue("@Remarks", model.Remarks);
            cmd.Parameters.AddWithValue("@RemarksBy", userId);
            cmd.Parameters.AddWithValue("@Attachment", DeliveryAttachement);





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
        #region Sale Order Cancel
        public IActionResult SaleOrderCancel()
        {
            return View();
        }
        // get Sale Order Cancel list 
        public async Task<IActionResult> getSaleOrderCancelList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;
                var userId = User.FindFirst("UserId")?.Value;
                var roleId = User.FindFirst("RoleId")?.Value;
                SortedList parameters = new SortedList();
                parameters.Add("@SaleOrderId", filter.FilterId1);

                var dt = await _cn.FillDataTableAsync("HardwareSaleOrderCancel_List1", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<SaleOrderCancelViewModal>());

                var list = dt.AsEnumerable().Select(row => new SaleOrderCancelViewModal


                {

                    SaleOrderId = Convert.ToInt32(row["SaleOrderId"]),
                    HWSaleOrderNo = row["HWSaleOrderNo"]?.ToString(),
                    LetterReferenceNo = row["LetterReferenceNo"]?.ToString(),
                    OrderDate = row["OrderDate"] != DBNull.Value ? Convert.ToDateTime(row["OrderDate"]) : DateTime.MinValue,
                    departmentName = row["departmentName"]?.ToString(),
                    BillingAddress = row["BillingAddress"]?.ToString(),
                    Gtotal = row["Gtotal"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Gtotal"]),
                    Balance = row["Balance"] == DBNull.Value ? 0m : Convert.ToDecimal(row["Balance"]),
                    AdvanceAmt = row["AdvanceAmt"] == DBNull.Value ? 0m : Convert.ToDecimal(row["AdvanceAmt"]),
                    CancelRemarks = row["CancelRemarks"]?.ToString(),

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
        #region Sale Order Details
        public IActionResult SaleOrderDetails()
        {
            return View();
        }
        #endregion

    }

}
