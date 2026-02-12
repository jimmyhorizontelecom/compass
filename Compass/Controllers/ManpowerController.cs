using Microsoft.AspNetCore.Mvc;

namespace Compass.Controllers
{
    public class ManpowerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
