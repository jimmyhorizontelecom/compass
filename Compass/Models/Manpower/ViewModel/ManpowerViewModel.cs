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
    }
    //Dept Attendace Filter for get records
    public class DeptAttendanceFilter
    {
        public int Id { get; set; }
        public int AttendaceId { get; set; }
        public int AgencyId { get; set; }
        public int WorkOrderAgencyId { get; set; }
        public int DeptId { get; set; }
        public string MonthYear { get; set; }
        public int CreatedBy { get; set; }
        public int UserRole { get; set; }

    }

    //Dept Attendance Table List 
    public class DeptAttendanceViewModel
    {
        public string Id { get; set; }
        public string AttendaceId { get; set; }
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


    // ManpowerInvoice/NewInvoice
    // filter for Table of New Invoice 
    public class AgencyInvFilter
    {
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
        

    }


}
