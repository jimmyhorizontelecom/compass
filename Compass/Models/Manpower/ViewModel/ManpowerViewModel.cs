using Microsoft.AspNetCore.Http;

namespace Compass.Models.ManpowerViewModel
{
    // Dept. Master
    public class WorkOrder
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        public int DeptId { get; set; }
        public string WorkOrderId { get; set; }
        public int CreatedBy { get; set; }
        public int UserRole { get; set; }

    }

    public class WorkOrderListModel
    {
        
        public int AgencyId { get; set; }
        public string AgencyName { get; set; }
        public int DeptId{ get; set; }
        public string DepartmentName { get; set; }
        public string WorkOrderId { get; set; }
        public string BillingAddress { get; set; }
        public int NoDeployedRes { get; set; }
        public string IsResourceUploaded { get; set; }
        public int NoOfUploadedResource { get; set; }
        public string BillingAddEmail { get; set; }
        public string searchTerm { get; set; }
    }

    //Map No. of Resource Employee record filter
    public class MapEmployeeFilter
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        public int AttendaceId { get; set; }
        public int WorkOrderId { get; set; }
    }

    //Map no. of Resource Employee View Modal
    //Dept Attendance Table List 
    public class MapEmployeeViewModel
    {
        public int EmpId { get; set; }
        public string EmpName { get; set; }
        public string EmpFatherName { get; set; }
        public string EmpAadharNo { get; set; }
        public string EmpDesignation { get; set; }


    }


    //Dept Attendace Filter for get records
    public class DeptAttendanceFilter
    {
        public int Id { get; set; }
        public int AttendaceId { get; set; }
        public int AgencyId { get; set; }
        public int WorkOrderAgencyId { get; set; }
        public int DeptId { get; set; }
        public int MonthYear { get; set; }
       // public int CreatedBy { get; set; }
        //public int UserRole { get; set; }

    }

    //Dept Attendance Table List 
    public class DeptAttendanceViewModel
    {
        public int Id { get; set; }
        public int AttendaceId { get; set; }
        public int DeptId { get; set; }
        public string departmentName { get; set; }
        public int AgencyId { get; set; }
        public string AgencyName { get; set; }
        public string WorkOrderId { get; set; }
        public string PurhaseInvNO { get; set; }
        public int BillingId { get; set; }
        public string BillingAddress { get; set; }
        public int DeployedResource { get; set; }
        public int UpladNoOfResource { get; set; }
        public int MonthYear { get; set; }
        public string AttendanceCertificate { get; set; }
        public string AnnexureFile { get; set; }
        public string AgencyBillFile { get; set; }
        public string VerificationStatus { get; set; }
        public string IsPurhaseBIllGenerated { get; set; }
    }


    //View Map Resource by department
    public class ViewMapResourceViewModel
    {
        public int EmpId { get; set; }
        public string EmpName { get; set; }
        public string FatherName { get; set; }
        public string AadharNo { get; set; }
       
    }



    //Purchase Invoice filter
    public class PInvoiceFilter
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        public int MonthId { get; set; }
        public int MonthIdTo { get; set; }
        public int DeptId { get; set; }
        public char PaymentStatus { get; set; }
        public int CreatedBy { get; set; }
        public int UserRole { get; set; }

    }

    //ManpowerInvoice/PurchaseBillVerification
    // Purchase Invoice Get record table list

    public class PInvoiceViewModel
    {
        public int Id { get; set; }
        public int DeptId { get; set; }
        public string DepartmentName { get; set; }
        public int AgencyId { get; set; }
        public string AgencyName { get; set; }
        public string AgencyBillNo { get; set; }
        public string AttendanceCertificate { get; set; }
        public string AnnexureFile { get; set; }
        public string AgencyBillFile { get; set; }
        public string BillDate { get; set; }
        public string BillMonth { get; set; }
        public string AgencyBillEntryDate { get; set; }
        public string VerificationStatus { get; set; }
        public string IsSaleBIllGenerated { get; set; }
       
     
    }
    // Agency Bill Verification View
    public class PInvoiceVerifyViewModel
    {
        public int Id { get; set; }
        public string BillDate { get; set; }
        public string WorkOrderId { get; set; }
        public string AgencyBillNo { get; set; }
        public string SaleBillNo { get; set; }
        public int AgencyId { get; set; }
        public string AgencyName { get; set; }
        public int DeptId { get; set; }
        public string DepartmentName { get; set; }
        public int NoofResource { get; set; }
        public int BillingId { get; set; }
        public string DeptBillingAdd { get; set; }
        public string BillMonth { get; set; }
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


    // ManpowerInvoice/NewInvoice &  // ManpowerInvoice/TallyAgencyPayment
    // filter for Table of New Invoice 
    public class AgencyInvFilter
    {
        public int ReceiptId { get; set; }
        public int DepartmentBillId { get; set; }
        public int AgencyBillId { get; set; }
        public int MonthId { get; set; }
        public int MonthIdTo { get; set; }
        public int AgencyId { get; set; }
        public int DeptId { get; set; }
        public char PaymentStatus { get; set; }
        public int PageNo { get; set; }
        public int PageSize { get; set; }
      
    }

    // View Model for Table List of New Invoice
    public class AgencyInvViewModel
    {
        public int AgencyBillId { get; set; }
        public int DeptId { get; set; }
        public string DeptName { get; set; }
        public string DeptAdd { get; set; }
        public int AgencyId { get; set; }
        public string AgencyName { get; set; }
        public string SaleBillNo { get; set; }
        public string PurchaseBillNo { get; set; }
        public decimal SaleBillAmt { get; set; }
        public string SaleBillDate { get; set; }
        //public decimal AgencyBillAmt { get; set; }
        

    }

    //Dept Payment view Modal
    public class AgencyInvDeptPayViewModel
    {
        public int AgencyBillId { get; set; }
        public string PurchaseBillNo { get; set; }
        public string PurchaseBillDate { get; set; }
        public string SaleBillNo { get; set; }
        public string SaleBillDate { get; set; }
        public Decimal SaleBillAmt { get; set; }
        public int DeptId { get; set; }
        public string DeptName { get; set; }
        public string DeptAdd { get; set; }
        public int AgencyId { get; set; }
        public string AgencyName { get; set; }
       
    }

    //Dept Partial Payment List view Modal
    public class AgencyInvPaymentListViewModel
    {
        public int ReceiptId {  get; set; }
        public int AgencyBillId { get; set; }
        public string AgencyName { get; set; }
        public string TransactionId { get; set; }
        public string PaymentMode { get; set; }
        public string BankName { get; set; }
        public string SaleBillNo { get; set; }
        public decimal SaleBillAmt { get; set; }
        public decimal ReceivedAmt { get; set; }
        public string ReceivedDate { get; set; }
        public decimal GstTds { get; set; }
        public decimal Tds { get; set; }
        public decimal DueBalance { get; set; }
        public string Narration { get; set; }
        public string VerifyPayment { get; set; }

    }

    //Agency Partial Payment List view Modal
    public class AgencyPartialPayListViewModel
    {
        public int PaymentId { get; set; }
        public int AgencyBillId { get; set; }
        public string TransactionId { get; set; }
        public string PaymentMode { get; set; }
        public string ReceivedDate { get; set; }
        public decimal GstTds { get; set; }
        public decimal ITTds { get; set; }
        public decimal Tds1 { get; set; }
        public decimal Tds2 { get; set; }
        public decimal PaymentAmt { get; set; }
        public decimal DueBalance { get; set; }
        public string Narration { get; set; }
        
    }







}
