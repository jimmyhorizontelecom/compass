namespace Compass.Report.ViewModels
{
    public class ProductReportVM
    {
        public string MainCategory { get; set; }
        public string Title { get; set; }
        public string IsActive { get; set; }
    }

    

    public class DeptInvoiceReportVM
    {
        public int DeptBillId { get; set; }
        public int AgencyBillId { get; set; }
        public DateTime BillDate { get; set; }
        public DateTime PurchaseBillDate { get; set; }
        public string MonthYear { get; set; }
        public string fvBillNo { get; set; }
        public string SaleBillNo { get; set; }
        public int AgencyId { get; set; }
        public string AgencyName { get; set; }
        public int DeptId { get; set; }
        public string departmentName { get; set; }
        public string gstNo { get; set; }
        public string Pin { get; set; }
        public string DepartmentAddress { get; set; }
        public string Description { get; set; }
        public string Narration { get; set; }
        public decimal AgencyBillAmt { get; set; }
        public decimal AgencyBillAmtCgst { get; set; }
        public decimal AgencyBillAmtSgst { get; set; }
        public decimal BaseGSTTotal { get; set; }
        public decimal BaseTotal { get; set; }
        public decimal HpsedcCharges { get; set; }
        public decimal AdminAmtCgst { get; set; }
        public decimal AdminAmtSgst { get; set; }
        public decimal AdminGSTTotal { get; set; }
        public decimal AdminTotal { get; set; }
        public decimal Taxableamttotal { get; set; }
        public string TaxableamttotalWord { get; set; }
        public decimal tax { get; set; }
        public decimal LibaryAmt { get; set; }
        public decimal GSTAmount { get; set; }
        public decimal CGSTAmount { get; set; }
        public decimal SGSTAmount { get; set; }
        public string HSN { get; set; }
        public decimal BillAmount { get; set; }
        public decimal GrandBillAmount { get; set; }
        public string GrandBillAmountWord { get; set; }
        public decimal PaymentAmt { get; set; }
        public decimal BalanceAmt { get; set; }
        public int NoOfResource { get; set; }
        public string WorkOrderNo { get; set; }
        public string IRN { get; set; }
        public string AcKNo { get; set; }
        public DateTime AckDt { get; set; }
    }
}
