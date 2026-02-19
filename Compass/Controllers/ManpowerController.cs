using ClosedXML.Excel;
using Compass.Classes;
using Compass.Models.Filter;
using Compass.Models.Hardware;
using Compass.Models.Manpower;
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
    public class ManpowerController : Controller
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
        }
            public IActionResult Index()
        {
            return View();
        }

        #region DeptMaster
        public IActionResult DeptMaster()
        {
            return View();
        }

        
        #endregion





        #region ESIEPF Report
        public IActionResult ESIEPFReport()
        {
            return View();
        }


        #endregion

        #region Deposit Challan ESIEPF 
        public IActionResult DepositChallanESIEPF()
        {
            return View();
        }


        #endregion

        #region Map Challan Invoice
        public IActionResult MapChallanInvoice()
        {
            return View();
        }


        #endregion

        #region New Invoice
        public IActionResult NewInvoice()
        {
            return View();
        }


        #endregion

        #region Purchase Bill Verification
        public IActionResult PurchaseBillVerification()
        {
            return View();
        }


        #endregion
    }
}
