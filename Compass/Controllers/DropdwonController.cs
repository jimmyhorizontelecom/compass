using Compass.Models.ManpowerViewModel;
using Compass.Services;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.AspNetCore.Mvc;

namespace Compass.Controllers
{
    public class DropdownController : Controller
    {
        private readonly IMainCategoryService _service;

        public DropdownController(IMainCategoryService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<IActionResult> PMainCategory_ddl(
                int id = 0,
                int mainCatgId = 0,
                string searchTerm = "")
        {
            var result = await _service.GetMainCategoryDropdownAsync(id, mainCatgId, searchTerm);
            return Ok(result);
        }
        //Get Department ddl
        [HttpGet]
        //public async Task<IActionResult> MDepartment_ddl(
        //        int id = 0,
        //        int mainCatgId = 0,
        //        string searchTerm = "")
        //{
        //    var result = await _service.GetDepartmentDropdownAsync(id, searchTerm);
        //    return Ok(result);
        //}
        public async Task<IActionResult> MDepartment_ddl(
         int id = 0,
        int mainCatgId = 0,
         string searchTerm = "")
        {
            var userId = Convert.ToInt32(User.FindFirst("UserId")?.Value ?? "0");
            var result = await _service.GetDepartmentDropdownAsync(id, userId, mainCatgId, searchTerm);
            return Ok(result);
        }

        ////Get Billing Address ddl
        //[HttpGet]
        //public async Task<IActionResult> MBillingAddress_ddl(
        //     int ParentId1 = 0,
        //    int ParentId2 = 0,
        //    int ParentId3 = 0,
        //    string searchTerm = "")
        //    {
        //    int userId = 0;
        //    int roleId = 0;

        //    int.TryParse(User.FindFirst("UserId")?.Value, out userId);
        //    int.TryParse(User.FindFirst("RoleId")?.Value, out roleId);

        //    var result = await _service.GetBillingAddressDropdownAsync(ParentId1, ParentId2, ParentId3, userId, roleId, searchTerm);
        //    return Ok(result);

        //}

        //Get Billing Address for Add New Work Order in Dept Master
        [HttpGet]
        public async Task<IActionResult> MAddWorkOrderBillingAddress_ddl(
            int mainCatgId = 0,
            string searchTerm = "")
        {
            var result = await _service.GetAddWorkOrderBillingAddressDropdownAsync(mainCatgId, searchTerm);
            return Ok(result);

        }



        //Get Agency ddl
        //    [HttpGet]
        //    public async Task<IActionResult> MAgency_ddl(
        //int agencyId = 0,
        //string searchTerm = "")
        //    {
        //        int roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
        //        int loginAgencyId = Convert.ToInt32(User.FindFirst("AgencyId")?.Value ?? "0");

        //        // Agar Agency user hai to login agency hi use karo
        //        if (roleId == 48)   // <-- Apna Agency RoleId
        //        {
        //            agencyId = roleId;
        //        }

        //        var result = await _service.GetAgencyDropdownAsync(agencyId, roleId, searchTerm);

        //        return Ok(result);
        //    }
        [HttpGet]
        public async Task<IActionResult> MAgency_ddl(
        int agencyId = 0,
        string searchTerm = "")
        {
            int roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
            var result = await _service.GetAgencyDropdownAsync(agencyId, roleId, searchTerm);
            return Ok(result);
        }

        //Get Designation ddl
        [HttpGet]
        public async Task<IActionResult> MDesignation_ddl(
      int designationId = 0,
      string searchTerm = ""
       )
        {
           // int roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
            var result = await _service.GetDesignationDropdownAsync(designationId, searchTerm);
            return Ok(result);
        }

        //Get Educational ddl
        [HttpGet]
        public async Task<IActionResult> MEducational_ddl(
      int educationId = 0,
      string searchTerm = ""
       )
        {
            // int roleId = Convert.ToInt32(User.FindFirst("RoleId")?.Value ?? "0");
            var result = await _service.GetEducationalDropdownAsync(educationId, searchTerm);
            return Ok(result);
        }


        //Get Work Order ddl & Billing Address depends on Work Order based on Parent 1 & Parent 2
        [HttpGet]
        public async Task<IActionResult> MWorkOrder_ddl(
            int Id,
            int ParentId1 = 0,
            int ParentId2=0,
            int ParentId3=0,
            string searchTerm = ""
            )
        {
            //var userId = User.FindFirst("UserId")?.Value;
            //var roleId = User.FindFirst("RoleId")?.Value;
            int userId = 0;
            int roleId = 0;

            int.TryParse(User.FindFirst("UserId")?.Value, out userId);
            int.TryParse(User.FindFirst("RoleId")?.Value, out roleId);

            var result = await _service.GetWorkOredrDropdownAsync(Id, ParentId1, ParentId2, ParentId3,  userId, roleId, searchTerm);
            return Ok(result);
        }

        //Get Bank ddl
        [HttpGet]
        public async Task<IActionResult> MBank_ddl(
                int bankId = 0,
                string searchTerm = "")
        {
            var result = await _service.GetBankDropdownAsync(bankId, searchTerm);
            return Ok(result);
        }

        //Get Payment Mode ddl
        [HttpGet]
        public async Task<IActionResult> MPaymentMode_ddl(
                int Id = 0,
                string searchTerm = "")
        {
            var result = await _service.GetPaymentModeDropdownAsync(Id, searchTerm);
            return Ok(result);
        }


        //Get Work Order ddl based on Parent 1 & Parent 2 for Employee dETAIL iMPORT
        [HttpGet]
        public async Task<IActionResult> MEmpImportWorkOrder_ddl(
            int Id,
            int ParentId1 = 0,
            int ParentId2 = 0,
            int ParentId3 = 0,

            string searchTerm = ""
            )
        {
            //var userId = User.FindFirst("UserId")?.Value;
            //var roleId = User.FindFirst("RoleId")?.Value;
           int userId = 0;
           int roleId = 0;

            int.TryParse(User.FindFirst("UserId")?.Value, out userId);
            int.TryParse(User.FindFirst("RoleId")?.Value, out roleId);

            var result = await _service.GetEMPImportWorkOrderDropdownAsync(Id, ParentId1, ParentId2, ParentId3, userId, roleId, searchTerm);
            return Ok(result);
        }




        public IActionResult Index()
        {
            return View();
        }
    }
}
