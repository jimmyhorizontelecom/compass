using Compass.Services;
using DocumentFormat.OpenXml.Office2010.Excel;
using Microsoft.AspNetCore.Mvc;

namespace Compass.Controllers
{
    public class HardwareDropdownController : Controller
    {
        private readonly IHardwareDropdownService _service;

        public HardwareDropdownController(IHardwareDropdownService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<IActionResult> HMainCategory_ddl(
                int id = 0,
                string searchTerm = "")
        {
            var result = await _service.GetMainCategoryDdlAsync(id, searchTerm);
            return Ok(result);
        }
        // get Term and Condition ddl
        [HttpGet]
        public async Task<IActionResult> TermCondition_ddl(
               int id = 0,
               string searchTerm = "")
        {
            var result = await _service.GetTermConditionDdlAsync(id, searchTerm);
            return Ok(result);
        }
        // get Add Term Type ddl
        [HttpGet]
        public async Task<IActionResult> AddTermTypeCondition_ddl(
               int id = 0,
               string searchTerm = "")
        {
            var result = await _service.GetTermTypeConditionDdlAsync(id, searchTerm);
            return Ok(result);
        }
        // get company ddl
        [HttpGet]
        public async Task<IActionResult> HCompany_ddl(
               int id = 0,
               string searchTerm = "")
        {
            var result = await _service.GetCompanyDdlAsync(id, searchTerm);
            return Ok(result);
        }
        // get Agency ddl
        [HttpGet]
        public async Task<IActionResult> HAgency_ddl(
             int id = 0, int id2 = 0,
             string searchTerm = "")
        {
            var result = await _service.GetAgencyDdlAsync(id, searchTerm);
            return Ok(result);
        }
        // get Product Name ddl
        [HttpGet]
        public async Task<IActionResult> HProduct_ddl(
                 int id = 0, int MainCatgId = 0,
                 string searchTerm = "")
        {
            var result = await _service.GetProductDdlAsync(id, MainCatgId, searchTerm);
            return Ok(result);
        }

        // get Department Name ddl
        [HttpGet]
        public async Task<IActionResult> HDepartment_ddl(
                 int id = 0, int MainCatgId = 0,
                 string searchTerm = "")
        {
            var result = await _service.GetDepartmentDdlAsync(id, MainCatgId, searchTerm);
            return Ok(result);
        }
        // get Pi Ref. No.  ddl
        [HttpGet]
        public async Task<IActionResult> PIRefNo_ddl(
                 int id = 0, int MainCatgId = 0,
                 string searchTerm = "")
        {
            var result = await _service.GetPiRefNoDdlAsync(id, MainCatgId, searchTerm);
            return Ok(result);
        }
        // get Billing Address  ddl
        [HttpGet]
        public async Task<IActionResult> BillingAddress_ddl(
                 int id = 0, int MainCatgId = 0,
                 string searchTerm = "")
        {
            var result = await _service.GetBillingAddressPISaleDdlAsync(id, MainCatgId, searchTerm);
            return Ok(result);
        }
        // get District Name ddl
        [HttpGet]
        public async Task<IActionResult> HDistrict_ddl(
                 int id = 0, int MainCatgId = 0,
                 string searchTerm = "")
        {
            var result = await _service.GetDistrictDdlAsync(id, MainCatgId, searchTerm);
            return Ok(result);
        }
        // get Bank Name ddl
        [HttpGet]
        public async Task<IActionResult> HBankName_ddl(
                 int id = 0, int MainCatgId = 0,
                 string searchTerm = "")
        {
            var result = await _service.GetBankDdlAsync(id, MainCatgId, searchTerm);
            return Ok(result);
        }
        // get Query Type ddl
        [HttpGet]
        public async Task<IActionResult> HQuery_ddl(
                int id = 0, int MainCatgId = 0,
                string searchTerm = "")
        {
            var result = await _service.GetQueryTypeDdlAsync(id, MainCatgId, searchTerm);
            return Ok(result);
        }
        // get Payment mode ddl
        [HttpGet]
        public async Task<IActionResult> HPaymentMode_ddl(
                 int id = 0, int MainCatgId = 0,
                 string searchTerm = "")
        {
            var result = await _service.GetPaymentModeDdlAsync(id, MainCatgId, searchTerm);
            return Ok(result);
        }

        // get PI Address ddl
        [HttpGet]
        public async Task<IActionResult> PIAddressCart_ddl(
                int id = 0, int mainCatgId = 0,
                string searchTerm = "")
        {
            var result = await _service.GetBillingAddressDdlAsync(id, mainCatgId, searchTerm);
            return Ok(result);
        }
        // get Product Name With Model No. ddl
        [HttpGet]
        public async Task<IActionResult> HProductNameWithModel_ddl(
                int id = 0, int ParentId1 = 0, int ParentId2 = 0, int ParentId3 = 0,
                string searchTerm = "")
        {
            var result = await _service.HProductNameWithModel_ddl(id, ParentId1, ParentId2, ParentId3, searchTerm);
            return Ok(result);
        }
        // get Consignee Name With Model No. ddl
        [HttpGet]
        public async Task<IActionResult> HConsignee_ddl(
            int id = 0, int id2 = 0,
            string searchTerm = "")
        {
            var result = await _service.GetConsigneeDdlAsync(id, searchTerm);
            return Ok(result);
        }
        // get Bill For Pbg With Model No. ddl
        [HttpGet]
        public async Task<IActionResult> HBillFor_ddl(
            int id = 0, int id2 = 0,
            string searchTerm = "")
        {
            var result = await _service.GetBillForPbgDdlAsync(id, searchTerm);
            return Ok(result);
        }
        // get Pbg Purchase Order No. With Model No. ddl
        [HttpGet]
        public async Task<IActionResult> HPbgPurchaseOrder_ddl(
            int id = 0, int id2 = 0,
            string searchTerm = "")
        {
            var result = await _service.GetPbgPOrderNoDdlAsync(id, searchTerm);
            return Ok(result);
        }

    }


}
