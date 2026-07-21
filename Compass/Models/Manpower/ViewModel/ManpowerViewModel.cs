using Microsoft.AspNetCore.Http;

namespace Compass.Models.ManpowerViewModel
{

    #region DeptMatser Add New Work Order
    // Dept. Master
    public class WorkOrder
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        public int DeptId { get; set; }
        public int MonthYear { get; set; }
        public string WorkOrderId { get; set; }
        public string IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int UserRole { get; set; }
        public string searchTerm { get; set; }

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


    #endregion


    #region Employee Detail Import
    //Employee List
    public class AddEmpDetailsListViewModel
    {
        public string EmpName { get; set; }
        public string FathersName { get; set; }
        public string IsFullTimer { get; set; }
        public int DesignationId { get; set; }
        public int AdhaarNo { get; set; }
        public decimal BasicSalary { get; set; }
        public decimal OtherAllowance { get; set; }
        public string IsEPF { get; set; }
        public string IsESIC { get; set; }
    }


    public class EmpImportExcelModel
    {
        public int DeptId { get; set; }
        public int AgencyId { get; set; }
        public string WorkOrderNo { get; set; }
        public int TotalManpower { get; set; }
        public string EmpName { get; set; }
        public string FathersName { get; set; }
        public string IsFullTimer { get; set; }
        public string AADHARNO { get; set; }
        public string DesigationId { get; set; }
        public decimal Basics { get; set; }
        public decimal Others { get; set; }
        public string IsPF { get; set; }
        public string IsESI { get; set; }
    }
    public class EmpImportVerificationViewModel
    {
        public string EmpName { get; set; }
        public string FathersName { get; set; }
        public string IsFullTimer { get; set; }
        public string AADHARNO { get; set; }
        public string DesigationId { get; set; }
        public string Basics { get; set; }
        public string Others { get; set; }
        public string IsPF { get; set; }
        public string IsESI { get; set; }
        public string Error_Message { get; set; }
        public string VerificationStatus { get; set; }
        public string Isuploaded { get; set; }
    }



    #endregion

    #region EmployeeDetailsList

    public class EmployeeFilter
    {
        public int EmpId { get; set; }
        public int AgencyId { get; set; }
        public int DeptId { get; set; }
        public int WorkOrderId { get; set; }
        public int CreatedBy { get; set; }
        public int UserRole { get; set; }
        public string searchTerm { get; set; }

    }

    public class EmployeeDetailsListViewModel
    {
        public int EmpId { get; set; }
        public int AgencyId { get; set; }
        public string AgencyName { get; set; }
        public int DeptId { get; set; }
        public string DepartmentName { get; set; }
        public int DesignationId { get; set; }
        public string DesignationName { get; set; }
        public int EducationId { get; set; }
        public string EducationName { get; set; }
        public string EmpName { get; set; }
        public string FathersName { get; set; }
        public string MobileNo { get; set; }
        public string Desigation { get; set; }
        public string AADHARNO { get; set; }
        public decimal Basics { get; set; }
        public string IsFullTime { get; set; }
        public string IsEPF { get; set; }
        public decimal EpfAmt { get; set; }
        public string IsESIC { get; set; }
        public decimal EsicAmt { get; set; }
        public decimal OthersAllowance { get; set; }
        public string Error_Message { get; set; }
        public string VerificationStatus { get; set; }
        public string Isuploaded { get; set; }
    }


    #endregion




    #region Dept Attendance
    //Map No. of Resource Employee record filter
    public class MapEmployeeFilter
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        public int AttendaceId { get; set; }
        public int WorkOrderId { get; set; }
        public int MonthYear { get; set; }
        public char BillType { get; set; }
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
        public Char BillType { get; set; }
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
        public char BillType { get; set; }
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



    #endregion


    #region Purchase Bill Verification
    //Purchase Invoice filter
    public class PInvoiceFilter
    {
        public int Id { get; set; }
        public int DeptBillId { get; set; }
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
        public int DeptBillId { get; set; }
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
        public string BillStatus { get; set; }
       
     
    }
    // Agency Bill Verification View
    public class PInvoiceVerifyViewModel
    {
        public int Id { get; set; }
        public string BillDate { get; set; }
        public string WorkOrderId { get; set; }
        public string AgencyBillNo { get; set; }
        public string DeptBillNo { get; set; }

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
        public Char IsDispatched { get; set; }
        public Char IsDeptPaymentReceived { get; set; }
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
        public string IsDeptPaymentReceived { get; set; }
       
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


    #endregion

 


    #region Dispatch
    //Dispatch filter
    public class DispatchFilter
    {
        public int DeptBillId { get; set; }
        public int MonthYear { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int SearchTerm { get; set; }
      
    }


    //Employee List
    public class DipsatchListViewModel
    {
        public int DeptBillId { get; set; }
        public string AgencyName { get; set; }
        public string AgencyBillNo { get; set; }
        public string SaleBillNo { get; set; }
        public int BillFormonth { get; set; }
        public string DeptName { get; set; }
        public string DeptAddress { get; set; }
        public string DispatchStatus { get; set; }
        public int DispatchNo { get; set; }
        
    }



    #endregion





}
