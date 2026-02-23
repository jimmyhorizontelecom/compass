using Microsoft.AspNetCore.Http;

namespace Compass.Models.ManpowerViewModel
{
    // Dept. Master
    public class WorkOrder
    {
        public int AgencyId { get; set; }
        public int DeptId { get; set; }
        public string WorkOrderId { get; set; }
        public int CreatedBy { get; set; }
        public int UserRole { get; set; }

    }

    public class WorkOrderListModel
    {
        
        public string AgencyName { get; set; }
        public string DepartmentName { get; set; }
        
        public string WorkOrderId { get; set; }
        public string BillingAddress { get; set; }
        public int NoDeployedRes { get; set; }
        public string IsResourceUploaded { get; set; }
        public int NoOfUploadedResource { get; set; }
    }

    public class DeptAttendanceFilter
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        public string DeptId { get; set; }
        public string MonthYear { get; set; }
        public int CreatedBy { get; set; }
        public int UserRole { get; set; }

    }

    public class DeptAttendanceViewModel
    {
        public string AttendaceId { get; set; }
        public string departmentName { get; set; }
        public string AgencyName { get; set; }
        public string WorkOrderId { get; set; }
        public string PurhaseInvNO { get; set; }
        public int DeployedResource { get; set; }
        public int UpladNoOfResource { get; set; }
        public int MonthYear { get; set; } 

    }






}
