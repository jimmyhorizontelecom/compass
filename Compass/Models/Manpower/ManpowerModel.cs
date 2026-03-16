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
        public string MonthYear { get; set; }    
        public int WorkOrderNo { get; set; }
        public int UpladNoOfResource { get; set; }
        public int PresentResource { get; set; }
        public IFormFile AttendanceFile { get; set; }   // For File upload
        public IFormFile AnnexureFile { get; set; }
        public IFormFile AgencyBillFile { get; set; }
        public int CreatedBy { get; set; }
}

    public class DeleteAttendanceModel
    {
        public int Id { get; set; }
        public string CancelRemarks { get; set; }
    }
    public class DeptPurchaseInvoiceModel
    {
        public int Id { get; set; }
        public int AgencyBillId { get; set; }
        public string PurchaseBillDate { get; set; }
        public string WorkOrderNo { get; set; }
        public string AgencyBillNo { get; set; }
        public int AgencyId { get; set; }
        public string AgencyName { get; set; }
        public int DeptId { get; set; }
        public string DeptName { get; set; }
        public int NoOfResources { get; set; }
        public int BillingId { get; set; }
        public string BillingAdd { get; set; }
        public int MonthYear { get; set; }
        public string Description { get; set; }
        public string Narration { get; set; }
        public decimal BasicBillAmt { get; set; }
        public decimal AdminCharge { get; set; }
        public decimal LiveryCharge { get; set; }
        public decimal InputCgst { get; set; }
        public decimal InputSgst { get; set; }
        public decimal InputIgst { get; set; }
        public decimal TotalAmt { get; set; }
        
    }


}
