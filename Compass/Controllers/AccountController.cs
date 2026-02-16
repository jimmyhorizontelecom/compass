using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.Data.SqlClient;
using wfms_ddl;
using System.Collections;
using System.Data;
using Compass.Models;
using Compass.Repositories;
using static Azure.Core.HttpHeader;


namespace Compass.Controllers
{
    

    public class AccountController : Controller
    {
        private readonly IUserRepository _repo;
       
        private readonly string _baseUrl;
        public AccountController(IUserRepository repo, IConfiguration config)
        {
            _repo = repo;
          
        }

       
        public IActionResult Login()
        {
            if (User.Identity?.IsAuthenticated == true)
                return RedirectToHome();

            DisableCache();
            ViewBag.Error = TempData["Error"];


            return View();
        }
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var user = _repo.Login(model.Username, model.Password);

            if (user.Success == false)
            {
                ViewBag.Error = user.ErrorMessage;
                return View(model);
            }

            var claims = new List<Claim>
        {
              new Claim(ClaimTypes.Name, user.Username),
               new Claim("RoleId", user.Role.ToString()),   // ✅ string
               new Claim("UserId", user.UserId.ToString()),
               new Claim("DeptId", user.DeptId.ToString())
        };

            var identity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity));
            //return Redirect("/TimeSheet/newDashboard");
            return RedirectToAction("Dashboard", "Master");
        }
        
        private IActionResult RedirectToHome()
        {
            var domain = User.FindFirst("DomainName")?.Value ?? string.Empty;

            if (string.IsNullOrWhiteSpace(domain))
                return RedirectToAction("Index"); // fallback if domain not found

            if (HttpContext.Request.Host.Host.Contains("localhost"))
            {
                return Redirect(_baseUrl + "/Home/Index");
            }
            else
            {
                return Redirect($"https://{domain}/Home/Index");
            }
        }

        private void DisableCache()
        {
            Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
            Response.Headers["Pragma"] = "no-cache";
            Response.Headers["Expires"] = "0";
        }
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Login");
        }


    }

}
