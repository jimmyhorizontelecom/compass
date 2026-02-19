using Microsoft.AspNetCore.Mvc;

namespace Compass.Controllers
{
    public class ManpowerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        #region DeptMaster
        public IActionResult DeptMaster()
        {
            return View();
        }

        // Get Record list

        //[HttpGet]
        //public async Task<IActionResult> GetRecord([FromQuery] WO_Filter filter)
        //{
        //    try
        //    {
        //        // Access as object

        //        SortedList parameters = new SortedList();
        //        parameters.Add("@AgencyId", filter.AgencyId);
        //        parameters.Add("@DeptId", filter.DeptId);
        //        parameters.Add("@WorkOrderId", filter.WorkOrderAgencyId);
        //        parameters.Add("@CreatedBy", filter.CreatedBy);
        //        parameters.Add("@RoleId", filter.UserRole);




        //        var dt = await _cn.FillDataTableAsync("TallyAgencyDeptWorkOrder_List1", "", parameters);

        //        if (dt == null || dt.Rows.Count == 0)
        //            return Ok(new List<TestModel>());

        //        var list = dt.AsEnumerable().Select(row => new WorkOrder


        //        {
        //            WorkOrderAgencyId = Convert.ToInt32(row["WorkOrderAgencyId"]),
        //            AgencyId = Convert.ToInt32(row["AgencyId"]?.ToString()),
        //            DeptId = Convert.ToInt32(row["DeptId"]?.ToString()),
        //            DepartmentName = (row["DepartmentName"]?.ToString()),
        //            WorkOrderNo = (row["WorkOrderId"]?.ToString()),
        //            BillingAddress = (row["BillingAddress"]?.ToString()),
        //            NoDeployedRes = Convert.ToInt32(row["NoDeployedRes"]?.ToString()),
        //            //BillAddressEmail = (row["BillAddressEmail"]?.ToString()),
        //            //IsActive = row["IsActive"] != DBNull.Value? row["IsActive"].ToString()[0]: 'N', 
        //            IsResourceUploaded = row["IsResourceUploaded"] != DBNull.Value ? row["IsResourceUploaded"].ToString()[0] : 'N',
        //            //NoOfUploadedResource = Convert.ToInt32(row["NoOfUploadedResource"]?.ToString()),
        //        }).ToList();

        //        return Ok(list);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new
        //        {
        //            success = false,
        //            message = "Server error.",
        //            error = ex.Message
        //        });
        //    }
        //}

        //[HttpPost]
        //public IActionResult AddOrEditRecord(WorkOrder test)
        //{
        //    try
        //    {
        //        if (string.IsNullOrWhiteSpace(test.WorkOrderNo) ||
        //            string.IsNullOrWhiteSpace(test.BillAddressEmail)
        //            )
        //        {
        //            return BadRequest(new
        //            {
        //                success = false,
        //                message = "WorkOrderNo and BillAddressEmail are required."
        //            });
        //        }

        //        SortedList parameters = new SortedList();
        //        parameters.Add("@WorkOrderAgencyId", test.WorkOrderAgencyId);
        //        parameters.Add("@AgencyId", test.AgencyId);
        //        parameters.Add("@DeptId", test.DeptId);
        //        parameters.Add("@WorkOrderId", test.WorkOrderNo);
        //        parameters.Add("@BillingId", test.BillingId);
        //        parameters.Add("@BillingAddress", test.BillingAddress);
        //        parameters.Add("@NoDeployedRes", test.NoDeployedRes);
        //        parameters.Add("@BillAddressEmail", test.BillAddressEmail);

        //        var userId = User.FindFirst("UserId")?.Value;
        //        parameters.Add("@CreatedBy", userId);

        //        var result = _cn.ExecuteNonQueryWMessage(
        //            "TallyAgencyWorkOrder_AcceptUpdate",
        //            "",
        //            parameters
        //        );

        //        return Ok(new
        //        {
        //            success = true,
        //            message = result.ToString()
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new
        //        {
        //            success = false,
        //            message = "Server error.",
        //            error = ex.Message
        //        });
        //    }
        //}

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
