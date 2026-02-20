using Compass.Services;
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
        public async Task<IActionResult> MDepartment_ddl(
                int id = 0,
                int mainCatgId = 0,
                string searchTerm = "")
        {
            var result = await _service.GetDepartmentDropdownAsync(id, searchTerm);
            return Ok(result);
        }

        //Get Billing Address ddl
        [HttpGet]
        public async Task<IActionResult> MBillingAddress_ddl(
                int Id = 0,
                int mainCatgId = 0,
                string searchTerm = "")
        {
            var result = await _service.GetBillingAddressDropdownAsync(Id, searchTerm);
            return Ok(result);
        }

        //Get Agency ddl
        [HttpGet]
        public async Task<IActionResult> MAgency_ddl(
                int deptId = 0,
                int mainCatgId = 0,

                string searchTerm = "")
        {
            var result = await _service.GetAgencyDropdownAsync(deptId, searchTerm);
            return Ok(result);
        }


        public IActionResult Index()
        {
            return View();
        }
    }
}
