using Microsoft.AspNetCore.Http;

namespace Compass.Models.Manpower
{
    public class WorkOrder
    {
        public int WorkOrderAgencyId { get; set; }
        public int AgencyId { get; set; }
        public string AgencyName { get; set; }
        public int DeptId { get; set; }
        public string DepartmentName { get; set; }
        public string WorkOrderNo { get; set; }
        public string BillingId { get; set; }
        public string BillingAddress { get; set; }
        public int NoDeployedRes { get; set; }
        public string BillAddressEmail { get; set; }
        public int CreatedBy { get; set; }
        public char IsActive { get; set; }
        public char IsResourceUploaded { get; set; }
        public int NoOfUploadedResource { get; set; }


    }

    public class WO_Filter
    {
        public int WorkOrderAgencyId { get; set; }
        public int AgencyId { get; set; }
        public int DeptId { get; set; }
        public int CreatedBy { get; set; }
        public int UserRole { get; set; }


    }

}
