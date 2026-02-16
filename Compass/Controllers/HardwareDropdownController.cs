using Compass.Services;
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
            var result = await _service.GetMainCategoryDdlAsync(id,  searchTerm);
            return Ok(result);
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
