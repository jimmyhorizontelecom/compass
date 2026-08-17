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
        public IActionResult AddOrEditCompany(Company model)
        {
            try
            {
               
                SortedList parameters = new SortedList();
                parameters.Add("@Id", model.Id);
                parameters.Add("@CompanyName", model.CompanyName);
                parameters.Add("@Description", "");
                parameters.Add("@IsActive", model.IsActive);
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
        //Submit 
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
     
        
        #region Add Product
        public IActionResult AddProduct()
        {
            return View();
        }

        //Table Data
        [HttpGet]
        public async Task<IActionResult> getProductList([FromQuery] TestFilterData filter)
        {
            try
            {
                // Access as object
                int id = filter.FilterId1;

                SortedList parameters = new SortedList();
                parameters.Add("@Id", filter.FilterId1);
                parameters.Add("@MainCategoryId", filter.FilterId2);

                var dt = await _cn.FillDataTableAsync("HardwareMasterProduct_List", "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<ProductDetailView>());

                var list = dt.AsEnumerable().Select(row => new ProductDetailView
                {
                    Id = Convert.ToInt32(row["Id"]),
                    //PublicProductId = CommonNew.GenerateKeyField(Convert.ToInt32(row["Id"])),
                    MainCategoryName = row["MainCatgName"]?.ToString(),
                    CompanyName = row["CompanyName"]?.ToString(),
                    Title = row["Title"]?.ToString(),
                    ModalNo = row["ModelNo"]?.ToString(),
                    ProductNewPrice = row["ProductPriceNew"]?.ToString(),
                    Gst = Convert.ToInt32(row["Gst"]),
                    GrandTotal = row["GrandTotal"] == DBNull.Value ? 0.0 : Convert.ToDouble(row["GrandTotal"]),
                    GrandTotalNew = row["GrandTotalNew"] == DBNull.Value ? 0.0 : Convert.ToDouble(row["GrandTotalNew"]),


                    Specification = row["Sepcification"]?.ToString(),
                    TenderNo = row["TenderNo"]?.ToString(),
                    IsActive = row["IsActive"] == DBNull.Value ? '0' : Convert.ToChar(row["IsActive"]),



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

        //Fill Data in Modal
        [HttpGet]
        public async Task<IActionResult> getProductListEdit([FromQuery] TestFilterData filter)
        {
            try
            {
                SortedList parameters = new SortedList();
               parameters.Add("@Id", filter.FilterName1);
              var dt = await _cn.FillDataTableAsync("HardwareMasterProduct_Edit", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<ProductDetailEditView>());
                var list = dt.AsEnumerable().Select(row => new ProductDetailEditView
                {
                    Id = Convert.ToInt32(row["Id"]),
                    //PublicProductId = CommonNew.GenerateKeyField(Convert.ToInt32(row["Id"])),
                    MainCatgNameId = Convert.ToInt32(row["MainCatgName"]),
                    PCatgId = Convert.ToInt32(row["PCatgId"]),
                    CompanyId = Convert.ToInt32(row["CompanyId"]),
                    MainCatgName = row["CatgName"]?.ToString(),
                    ModelNo = row["ModelNo"]?.ToString(),
                    Sepcification = row["Sepcification"]?.ToString(),
                    HPSEDCCharges = Convert.ToDecimal(row["HPSEDCCharges"]),
                    ProductPrice =Convert.ToDecimal(row["ProductPrice"]),
                    GrandTotal = Convert.ToDecimal(row["GrandTotal"]),
                    GrandTotal2 = Convert.ToDecimal(row["GrandTotal2"]),
                    Gst = Convert.ToDecimal(row["Gst"]),
                    Gst2 = Convert.ToDecimal(row["Gst2"]),
                    IsActive = row["IsActive"] == DBNull.Value ? '0' : Convert.ToChar(row["IsActive"]),
                    CompanyName = row["CompanyName"]?.ToString(),
                    Title = row["Title"]?.ToString(),
                    TenderNo = row["TenderNo"]?.ToString(),
                    ValidTo = row["ValidTo"]?.ToString(),
                    ValidFrom = row["ValidFrom"]?.ToString(),
                    RulerPenaltyDays = Convert.ToInt32(row["RulerPenaltyDays"]),
                    UrbenPenaltyDays = Convert.ToInt32(row["UrbenPenaltyDays"]),
                    //OrderEnterStatus = row["OrderEnterStatus"] == DBNull.Value ? '0' : Convert.ToChar(row["OrderEnterStatus"]),
                    //Gst2 = Convert.ToDecimal(row["Gst2"]),
                    //GrandTotal2 = Convert.ToDecimal(row["GrandTotal2"]),
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

        //Submit Record add Product
        [HttpPost]
        public async Task<IActionResult> AddOrEditProduct([FromForm]  ProductDetail model)
        {
            try
            {
                SortedList parameters = new SortedList();

                parameters.Add("@ProductId", model.ProductId);
                parameters.Add("@MainCategoryId", model.MainCategoryId);
                parameters.Add("@PCategoryId", model.PCategoryId);
                parameters.Add("@CompanyId", model.CompanyId);
                parameters.Add("@ModelNo", model.ModelNo);
                parameters.Add("@ProductPrice", model.ProductPrice);
                parameters.Add("@Sepcification", model.Sepcification);
                parameters.Add("@ImageFile", "");
                parameters.Add("@CurrentStorck", 0);
                parameters.Add("@HSNCode", model.HSNCode);
                parameters.Add("@Gst", model.Gst);
                parameters.Add("@HPSEDCCharges", model.HPSEDCCharges);
                parameters.Add("@GrandTotal", model.GrandTotal);
                parameters.Add("@IsActive", "Y");
                parameters.Add("@TenderNo", model.TenderNo);
                parameters.Add("@ValidFrom", model.ValidTo);
                parameters.Add("@ValidTo", model.ValidFrom);
                parameters.Add("@RularPenaltyDays", model.RularPenaltyDays);
                parameters.Add("@UrbanPenaltyDays", model.UrbanPenaltyDays);

                var userId = User.FindFirst("UserId")?.Value;
                parameters.Add("@CreatedBy", userId);

                var result = _cn.ExecuteNonQueryWMessage("HardwareProduct_AcceptUpdate", "", parameters);

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

        //Update GST
        [HttpPost]
        public async Task<IActionResult> UpdateProductGst([FromForm]  ProductDetail model)
        {
            try
            {
                SortedList parameters = new SortedList();

                parameters.Add("@ProductId", model.ProductId);
                parameters.Add("@ProductPrice", model.ProductPrice);
                parameters.Add("@Gst", model.Gst);
                parameters.Add("@HPSEDCCharges", model.HPSEDCCharges);
                parameters.Add("@GrandTotal", model.GrandTotal);
                parameters.Add("@PenaltyDays", model.PenaltyDays);
                parameters.Add("@PenaltyRate", model.PenaltyRate);
                parameters.Add("@IsActive", "Y");

                var userId = User.FindFirst("UserId")?.Value;
                parameters.Add("@CreatedBy", userId);

                var result = _cn.ExecuteNonQueryWMessage("HardwareProductGST2_AcceptUpdate", "", parameters);

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

        //Update Target Days
        [HttpPost]
        public async Task<IActionResult> UpdateProductTargetDays([FromForm] ProductDetail model)
        {
            try
            {
                SortedList parameters = new SortedList();

                parameters.Add("@ProductId", model.ProductId);
                parameters.Add("@RulerPenaltyDays", model.RularPenaltyDays);
                parameters.Add("@UrbenPenaltyDays", model.UrbanPenaltyDays);
              
                var userId = User.FindFirst("UserId")?.Value;
                parameters.Add("@CreatedBy", userId);

                var result = _cn.ExecuteNonQueryWMessage("HardwareProductTargetDays_AcceptUpdate", "", parameters);

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

        //Update Tender
        [HttpPost]
        public async Task<IActionResult> UpdateProductTender([FromForm] ProductDetail model)
        {
            try
            {
                SortedList parameters = new SortedList();

                parameters.Add("@ProductId", model.ProductId);
                parameters.Add("@TenderNo", model.TenderNo);
                parameters.Add("@ValidFrom", model.ValidFrom);
                parameters.Add("@ValidTo", model.ValidTo);
            

                var userId = User.FindFirst("UserId")?.Value;
                parameters.Add("@CreatedBy", userId);

                var result = _cn.ExecuteNonQueryWMessage("HardwareProductTender_AcceptUpdate", "", parameters);

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


        //Submit Record for Update Product
        [HttpPost]
        public IActionResult UpdateProduct(ProductDetailEditView model)
        {


            try
            {

                //if (string.IsNullOrWhiteSpace(model.CompanyName) || string.IsNullOrWhiteSpace(model.CompanyName))
                //{
                //    return BadRequest(new { success = false, message = "Company Name are required." });
                //}

                SortedList parameters = new SortedList();
                parameters.Add("@ProductId", model.Id);
                if (model.TabIdNo == 1)
                {
                    parameters.Add("@ProductId", model.Id);

                    var result1 = _cn.ExecuteNonQueryWMessage("HardwareProduct_AcceptUpdate", "", parameters);

                    return Ok(new { success = true, message = result1.ToString() });
                }
                else if (model.TabIdNo == 2)
                {
                    parameters.Add("@ProductId", model.Id);
                    var result1 = _cn.ExecuteNonQueryWMessage("HardwareProduct_AcceptUpdate", "", parameters);

                    return Ok(new { success = true, message = result1.ToString() });

                }
                else if (model.TabIdNo == 3)
                {
                    parameters.Add("@ProductId", model.Id);
                    var result1 = _cn.ExecuteNonQueryWMessage("HardwareProduct_AcceptUpdate", "", parameters);

                    return Ok(new { success = true, message = result1.ToString() });

                }
                else if (model.TabIdNo == 4)
                {
                    parameters.Add("@ProductId", model.Id);
                    var result1 = _cn.ExecuteNonQueryWMessage("HardwareProduct_AcceptUpdate", "", parameters);

                    return Ok(new { success = true, message = result1.ToString() });

                }
                else if (model.TabIdNo == 5)
                {
                    parameters.Add("@ProductId", model.Id);
                    var result1 = _cn.ExecuteNonQueryWMessage("HardwareProduct_AcceptUpdate", "", parameters);

                    return Ok(new { success = true, message = result1.ToString() });

                }

                //parameters.Add("@ProductId", model.ProductId);
                //parameters.Add("@MainCategoryId", model.MainCategoryId);
                //parameters.Add("@PCategoryId", model.PCategoryId);
                //parameters.Add("@CompanyId", model.CompanyId);
                //parameters.Add("@ModelNo", model.ModelNo);
                //parameters.Add("@ProductPrice", model.ProductPrice);
                //parameters.Add("@Sepcification", model.Sepcification);
                //parameters.Add("@ImageFile", "");
                //parameters.Add("@CurrentStorck", 0);
                //parameters.Add("@HSNCode", model.HSNCode);
                //parameters.Add("@Gst", model.Gst);
                //parameters.Add("@HPSEDCCharges", model.HPSEDCCharges);
                //parameters.Add("@GrandTotal", model.GrandTotal);
                //parameters.Add("@IsActive", "Y");
                //parameters.Add("@TenderNo", model.TenderNo);
                //parameters.Add("@ValidFrom", model.ValidTo);
                //parameters.Add("@ValidTo", model.ValidFrom);
                //parameters.Add("@RularPenaltyDays", model.RularPenaltyDays);
                //parameters.Add("@UrbanPenaltyDays", model.UrbanPenaltyDays);

                var userId = User.FindFirst("UserId")?.Value;
                parameters.Add("@CreatedBy", userId);

                var result = _cn.ExecuteNonQueryWMessage("HardwareProduct_AcceptUpdate", "", parameters);

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
        #region Department Billing Address
        public IActionResult DepartmentBillingAddress()
        {
            return View();
        }
        // get Record Billing Address
        [HttpGet]
        public async Task<IActionResult> getDepartmentAddressList([FromQuery] TestFilterData filter)
        {
            try
            {
                SortedList parameters = new SortedList();
                parameters.Add("@BillingAddressId", filter.FilterId1);
                parameters.Add("@DeptId", filter.FilterId2);
                parameters.Add("@DistrictId", filter.FilterId3);

                var dt = await _cn.FillDataTableAsync("HardwareBillingAddress_List", "", parameters);
                if (dt == null || dt.Rows.Count == 0)
                    return Ok(new List<object>());
                // var countries = CommonMethod.ToList(dt);
                var list = dt.AsEnumerable().Select(row => new BillingAddressDetailViewModal
                {
                    BillingId = Convert.ToInt32(row["BillingAddressId"]),
                    DeptId = Convert.ToInt32(row["DeptId"]),
                    DepartmentName = row["departmentName"]?.ToString(),
                    District = row["DistrictName"]?.ToString(),
                    DistrictId = row["DistrictId"] == DBNull.Value ? 0 : Convert.ToInt32(row["DistrictId"]),
                    BillingAddress = row["BillingAddress"]?.ToString(),
                    NodalOfficerName = row["NodalOfficerName"]?.ToString(),
                    Email = row["EmailId"]?.ToString(),
                    ContactNo = row["ContactNo"] == DBNull.Value ? "N/A" : row["ContactNo"].ToString(),
                    IsActive = row["IsActive"] == DBNull.Value ? "N/A" : row["IsActive"].ToString(),




                }).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Server error.", error = ex.Message });
            }
        }
        // Submit record Billing Address
        [HttpPost]
        public IActionResult AddOrEditBillingAddress(BillingDetailModel model)
        {
            try
            {
                SortedList parameters = new SortedList();
                parameters.Add("@BillingAddressId", model.BillingId);
                parameters.Add("@DeptId", model.DeptId);
                parameters.Add("@DistrictId", model.DistrictId);
                parameters.Add("@BillingAddress", model.BillingAddress);
                parameters.Add("@NodalOfficerName", model.NodalOfficerName);
                parameters.Add("@EmailId", model.Email);
                parameters.Add("@ContactNo", model.ContactNo);

                var result = _cn.ExecuteNonQueryWMessage("HardwareBillingAddress_AcceptUpdate", "", parameters);
                var returnMsg = result.ToString();

                return Ok(new { success = true, message = returnMsg });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Server error.", error = ex.Message });
            }
        }
        #endregion
    }
}
