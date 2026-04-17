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

    // Dept. Attendance Filter
    public class WO_Filter
    {
        public int WorkOrderAgencyId { get; set; }
        public int AgencyId { get; set; }
        public int DeptId { get; set; }
        public int CreatedBy { get; set; }
        public int UserRole { get; set; }

    }
    //Dept Attendance Submit Record
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
    // Dept Attendance delete uploaded files
    public class DeleteAttendanceModel
    {
        public int Id { get; set; }
        public string CancelRemarks { get; set; }
    }

    //Dept Attendance Purchase Invoice Model Submit
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


    //Purchase Bill Verification AgencyBillVerification
    public class UpdatePInvoiceModel
    {
        public int Id { get; set; }
        public int AgencyBillId { get; set; }
        public char IsPurchaseBillVerified { get; set; }
        public string VerificationRemarks { get; set; }
        public string PurchaseBillDate { get; set; }
        public string WorkOrderNo { get; set; }
        public string AgencyBillNo { get; set; }
        
        public string Description { get; set; }
        public string Narration { get; set; }   

    }

    //HPSEDEC Sale Invoice Model Submit
    public class SInvoiceModel
    {
        public int Id { get; set; }
        public int DeptBillId { get; set; }
        public string WorkOrderNo { get; set; }
        public string SaleBillNo { get; set; }
        public string SaleBillDate { get; set; }
        public string PBillNo { get; set; }
        public int MonthYear { get; set; }
        public int AgencyId { get; set; }
        public string AgencyName { get; set; }
        public int DeptId { get; set; }
        public string DeptName { get; set; }
        public int NoOfResources { get; set; }
        public string GSTNo { get; set; }
        public int PinNo { get; set; }
        public string HsnCode { get; set; }
        public int BillingId { get; set; }
        public string BillingAdd { get; set; }
        
        public string Description { get; set; }
        public string Narration { get; set; }
        public decimal AgencyBillAmt { get; set; }
        public decimal AdminAmt { get; set; }
        public decimal LibraryAmt { get; set; }
        public decimal CgstAmt { get; set; }
        public decimal SgstAmt { get; set; }
        public decimal TotalAmt { get; set; }
        public decimal PaymentAmt { get; set; }
        public decimal BalanceAmt { get; set; }
        public char IsActive { get; set; }

    }

    //New Invoice Dept. Payment Model Submit
    public class DeptPaymentModel
    {
        public int AgencyBillId { get; set; }
        public int ReceiptiId { get; set; }
        public int DepatrtmentBillId { get; set; }
        public String TransactionId { get; set; }
        public int ModeofPayment { get; set; }
        public int BankNameId { get; set; }
        public string Narration { get; set; }
        public DateOnly ReceivedDate { get; set; }
        public decimal ReceivedAmt { get; set; }
        public decimal Gsttds { get; set; }
        public decimal Tds { get; set; }
        

    }


    //New Invoice Agency Payment Model Submit
    public class AgencyPaymentModel
    {
        public int PaymentId { get; set; }
        public int AgencyBillId { get; set; }
        public String TransactionId { get; set; }
        public int ModeofPayment { get; set; }
        public int BankNameId { get; set; }
        public string Narration { get; set; }
        public DateOnly ReceivedDate { get; set; }
        public decimal ReceivedAmt { get; set; }
        public decimal Gsttds { get; set; }
        public decimal Tds1 { get; set; }
        public decimal Tds2 { get; set; }


    }
}
