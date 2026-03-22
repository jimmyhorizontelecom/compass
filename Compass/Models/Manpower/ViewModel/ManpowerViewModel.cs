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
    //Dept Attendace Filter for get records
    public class DeptAttendanceFilter
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        public string DeptId { get; set; }
        public string MonthYear { get; set; }
        public int CreatedBy { get; set; }
        public int UserRole { get; set; }

    }

    //Dept Attendance Table List 
    public class DeptAttendanceViewModel
    {
        public string Id { get; set; }
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
        public int AgencyBillId { get; set; }
        public int MonthId { get; set; }
        public int DeptId { get; set; }
        public char PaymentStatus { get; set; }
        //public int CreatedBy { get; set; }
        //public int UserRole { get; set; }

    }


    // Purchase Invoice Get record table list

    public class PInvoiceViewModel
    {
        public string Id { get; set; }
        public int DeptId { get; set; }
        public string DepartmentName { get; set; }
        public int AgencyId { get; set; }
        public string AgencyName { get; set; }
        public string AgencyBillID { get; set; }
        public string AgencyBillNo { get; set; }
        public string AttendanceCertificate { get; set; }
        public string AnnexureFile { get; set; }
        public string AgencyBillFile { get; set; }
        public string BillDate { get; set; }
        public string BillMonth { get; set; }
        public string AgencyBillEntryDate { get; set; }

        
        

    }



}
