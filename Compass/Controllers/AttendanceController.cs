using Microsoft.AspNetCore.Mvc;

namespace Compass.Controllers
{
    public class AttendanceController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        #region DeptAttendance
        public IActionResult DeptAttendance()
        {
            return View();
        }

        #endregion
    }
}
