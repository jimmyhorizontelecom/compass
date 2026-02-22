using Compass.Models.ManpowerViewModel;
using Microsoft.AspNetCore.Http;

namespace Compass.Models.ManpowerModel
{
    // Dept. Master  
     
    public class WorkOrderModel
    {
        public int WorkOrderAgencyId { get; set; }
        public int AgencyId { get; set; }
        public int DeptId { get; set; }
        public string WorkOrderNo { get; set; }
        public int BillingId { get; set; }
        public string BillingAddress { get; set; }
        public int NoDeployedRes { get; set; }
        public string BillAddressEmail { get; set; }
        
    }

    // Dept. Attendance 
    public class WO_Filter
    {
        public int WorkOrderAgencyId { get; set; }
        public int AgencyId { get; set; }
        public int DeptId { get; set; }
        public int CreatedBy { get; set; }
        public int UserRole { get; set; }

    }

    public class DeptAttendanceModel
   {
        public int Id { get; set; }    
        public int MonthYear { get; set; }    
        public int WorkOrderId { get; set; }
        public int UpladNoOfResource { get; set; }
        public string AttendanceCertificate { get; set; }
        public string AnnexureFile { get; set; }
        public string AgencyBillFile { get; set; }
    public int CreatedBy { get; set; }



}


}
