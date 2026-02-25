using ClosedXML.Excel;
using Compass.Classes;
using Compass.Models.Filter;
using Compass.Models.Hardware;
using Compass.Models.ManpowerModel;
using Compass.Models.ManpowerViewModel;
using Compass.Models.Test;
using DocumentFormat.OpenXml.ExtendedProperties;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Wordprocessing;
using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
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
    public class ManpowerInvoiceController : Controller
    {
        
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        private readonly string _connectionString;
        public ManpowerInvoiceController(ISqlDataAccess db, IMemoryCache cache, IConfiguration configuration)
        {
            _cn = db;
            _cache = cache;
            _connectionString = configuration.GetConnectionString("TestConnection");
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult PurchaseBillVerification()
        {
            return View();
        }



    }
}
