using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Office2013.Drawing.ChartStyle;
using DocumentFormat.OpenXml.Presentation;
using DocumentFormat.OpenXml.Vml;
using DocumentFormat.OpenXml.Wordprocessing;
using System;
using System.ComponentModel.DataAnnotations;
using System.Net.Mail;
using System.Runtime.Intrinsics.Arm;

namespace Compass.Models.Hardware
{
    public class CompanyView
    {

        public int Id { get; set; }
        public string CompanyName { get; set; }
        public char IsActive { get; set; }

    }
    public class TermConditionViewModal
    {

        public int TrId { get; set; }
        public string TermsAndConditionName { get; set; }
        public string TermsAndConditionDetails { get; set; }
        public int TrCatgId { get; set; }

    }
    public class TermTypeConditionViewModal
    {

        public int TrCatgId { get; set; }
        public string TermsAndConditionName { get; set; }
        public string TermsAndConditionType { get; set; }

    }
    public class TermsMappConditionViewModal
    {

        public int ProductId { get; set; }
        public string ProductCategoryName { get; set; }


    }
    public class TermsMappingPopUpViewModal
    {

        public int TrId { get; set; }
        public int TrCatgId { get; set; }
        public string CategoryName { get; set; }
        public string ConditionName { get; set; }


    }
    public class ProductModalView
    {

        public int Id { get; set; }
        public string MainCategory { get; set; }
        public string Title { get; set; }
        public char IsActive { get; set; }
        public string FileName { get; set; }
        public IFormFile File { get; set; }
    }
    public class ProductDetailView
    {

        public int Id { get; set; }
        public string PublicProductId { get; set; }
        public string MainCategoryName { get; set; }
        public string CompanyName { get; set; }
        public string Title { get; set; }
        public string ModalNo { get; set; }
        public string ProductNewPrice { get; set; }
        public int Gst { get; set; }
        public double GrandTotal { get; set; }
        public double GrandTotalNew { get; set; }
        public string Specification { get; set; }
        public string TenderNo { get; set; }
        public char IsActive { get; set; }
    }

    public class ProductDetailEditView
    {

        public int Id { get; set; }
        public string PublicProductId { get; set; }
        public int MainCatgNameId { get; set; }
        public string MainCatgName { get; set; }
        public int PCatgId { get; set; }
        public int CompanyId { get; set; }
        public string ModelNo { get; set; }
        public string Sepcification { get; set; }
        public int CurrentStorck { get; set; }
        public decimal HPSEDCCharges { get; set; }
        public decimal ProductPrice { get; set; }
        public decimal GrandTotal { get; set; }
        //public decimal NewGrandTotal { get; set; }
        public decimal Gst { get; set; }
        //public decimal NewGst { get; set; }
        public char IsActive { get; set; }
        public string CompanyName { get; set; }
        public string Title { get; set; }
        public string TenderNo { get; set; }
        public string ValidTo { get; set; }
        public string ValidFrom { get; set; }
        public int RulerPenaltyDays { get; set; }
        public int UrbenPenaltyDays { get; set; }
        public char OrderEnterStatus { get; set; }
        public decimal Gst2 { get; set; }
        public decimal GrandTotal2 { get; set; }
        public int TabIdNo { get; set; }
    }
    public class BillingAddressDetailViewModal
    {

        public int BillingId { get; set; }
        public int DeptId { get; set; }
        public int DistrictId { get; set; }

        public string DepartmentName { get; set; }
        public string District { get; set; }
        public string BillingAddress { get; set; }
        public string NodalOfficerName { get; set; }
        public string Email { get; set; }
        public string ContactNo { get; set; }
        public string IsActive { get; set; }

    }
    public class ProductPriceViewModal
    {

        public string HSNCode { get; set; }
        public string Sepcification { get; set; }
        public decimal ProductPrice { get; set; }

        public decimal TotalPrice { get; set; }
        public decimal Cgst { get; set; }
        public decimal Sgst { get; set; }
        public decimal Gst { get; set; }
        public decimal HPSEDCCharges { get; set; }
        public decimal GrandTotal { get; set; }
        public decimal Total { get; set; }


    }
    public class AgencyInvoiceFillViewModal
    {

        public string AgencyName { get; set; }
        public string departmentName { get; set; }
        public string BillingAddress { get; set; }
        public string SaleNo { get; set; }
        public int SaleOrderId { get; set; }



    }
    public class CartItemCountViewModal
    {

        public string count { get; set; }




    }
    public class SaleOrderListViewModal
    {
        public string SaleOrderId { get; set; }
        public string SaleOrder { get; set; }
        public string ReferenceNo { get; set; }
        public string PoNo { get; set; }
        public string DeptReferenceNo { get; set; }

        public DateTime OrderDate { get; set; }
        public string DepartmentName { get; set; }
        public string BillingAddress { get; set; }
        public string ItemDescription { get; set; }
        public string DeliveryLocationDoc { get; set; }
        public string AddLocation { get; set; }

        public decimal GrandTotalAmt { get; set; }
        public decimal Balance { get; set; }
        public decimal DeptReceivedAmt { get; set; }

        public char PurchaseIssued { get; set; }
        public char CancelSaleOrder { get; set; }

    }
    public class GeneratePInvListViewModal
    {

        public int ProductId { get; set; }
        public string MainCatgName { get; set; }
        public string BrandName { get; set; }
        public string ProductName { get; set; }

        public string ModelNo { get; set; }
        public string BasePrice { get; set; }
        public decimal HPSEDCCharges { get; set; }
        public decimal Gst { get; set; }
        public decimal GrandTotal { get; set; }
        public string Sepcification { get; set; }
        public char IsAddedToCart { get; set; }

    }
    public class CreateAgencyLoginListViewModal
    {


        public string agencyname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }



    }
    public class DepartmentLoginListViewModal
    {


        public int ID { get; set; }
        public string departmentName { get; set; }
        public string Email { get; set; }
        public string BillingAddress { get; set; }
        public string Password { get; set; }



    }
    public class GeneratePIListViewModal
    {

        public int PiIdNO { get; set; }
        public string PiDate { get; set; }
        public string DeptOrderId { get; set; }
        public string PBNoText { get; set; }
        public string IsDeptConfirmed { get; set; }
        public string IsBillGenerated { get; set; }
        public string BillGeneratedDate { get; set; }

        public string ReferenceNo { get; set; }
        public string DepartmentName { get; set; }
        public string AddressText { get; set; }

    }
    public class PIAddressListViewModal
    {

        public string Designation { get; set; }
        public string PIAddress { get; set; }
        public string EmailId { get; set; }
        public string ContactNo { get; set; }


    }
    public class ItemDescriptionViewModal
    {

        public string ItemDescription { get; set; }
        public decimal Quantity { get; set; }
        public decimal BasePrice { get; set; }
        public decimal GST { get; set; }
        public decimal UnitRate { get; set; }
        public decimal TotalAmount { get; set; }


    }
    public class SaleOrderCancelViewModal
    {

        public int SaleOrderId { get; set; }
        public string HWSaleOrderNo { get; set; }
        public string LetterReferenceNo { get; set; }
        public DateTime OrderDate { get; set; }
        public string departmentName { get; set; }
        public string BillingAddress { get; set; }
        public decimal Gtotal { get; set; }
        public decimal Balance { get; set; }
        public decimal AdvanceAmt { get; set; }
        public string CancelRemarks { get; set; }


    }
    public class SaleOrderDetailsViewModal
    {

        public int SaleOrderId { get; set; }
        public string SaleOrderRef { get; set; }
        public string departmentName { get; set; }
        public string BillingAddress { get; set; }
        public Decimal OrderAmount { get; set; }
        public string DeptOrderDate { get; set; }
        public string OrderEntryDate { get; set; }
        public string DeptAmt { get; set; }
        public string item { get; set; }
        public string Agency { get; set; }
        public string IssueDate { get; set; }
        public string sinvStatus { get; set; }
        public string sinvitem { get; set; }
        public string remarks { get; set; }



    }
    public class AddLocationViewModal
    {

        public int ItemDetailsId { get; set; }
        public string ProductName { get; set; }
        public int ProductId { get; set; }
        public decimal OrderQty { get; set; }
        public decimal AvailableQuantity { get; set; }
        public decimal DeliveryQuantity { get; set; }



    }
    public class PIConfirmViewModal
    {

        public string DepartmentName { get; set; }
        public int PIId { get; set; }
        public int ProductId { get; set; }
        public string Designation { get; set; }
        public string PIAddress { get; set; }
        public string ReferenceNo { get; set; }
        public string AdditionalInformation { get; set; }
        public string ProductName { get; set; }
        public decimal UnitBasePrice { get; set; }
        public decimal AdminAmt { get; set; }
        public decimal GstAmt { get; set; }
        public decimal GrandTotal { get; set; }
        public decimal Qty { get; set; }
        public decimal TotalAmount { get; set; }



    }
    public class TermsConditionMappingViewModal
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductCategoryName { get; set; }
        public string ConditionDetails { get; set; }



    }
    public class PBGenerateViewModal
    {

        public string DepartmentName { get; set; }
        public string DeptOrderId { get; set; }
        public string IsDeptConfirmed { get; set; }
        public int ProductId { get; set; }
        public string Designation { get; set; }
        public string PIAddress { get; set; }
        public string ReferenceNo { get; set; }
        public string AdditionalInformation { get; set; }
        public IFormFile LocationAttachment { get; set; }
        public string ProductName { get; set; }
        public decimal UnitBasePrice { get; set; }
        public decimal AdminAmt { get; set; }
        public decimal GstAmt { get; set; }
        public decimal GrandTotal { get; set; }
        public decimal Qty { get; set; }
        public decimal TotalAmount { get; set; }



    }
    public class CartItemViewModal
    {
        public int ProductId { get; set; }
        public int PiId { get; set; }
        public string ProductName { get; set; }
        public decimal BasePrice { get; set; }
        public decimal AdminCharge { get; set; }
        public decimal Gst { get; set; }
        public decimal GTotal { get; set; }
        public decimal Qty { get; set; }
        public decimal TotalAmount { get; set; }



    }

    public class PurchaseIssueViewModal
    {

        public int SaleOrderId { get; set; }
        public int OrderDetailId { get; set; }
        public char SaleOrder { get; set; }
        public string RefferenceNo { get; set; }
        public string ProductName { get; set; }
        public decimal Quantity { get; set; }
        public string PurchaseOrderNo { get; set; }
        public string PurchaseOrderDate { get; set; }
        public decimal Amount { get; set; }
        public string AgencyName { get; set; }



    }
    public class AddDeliveryAddressViewModal
    {
        public int OrderDetailsId { get; set; }
        public string ProductName { get; set; }
        public decimal DeliveryQuantity { get; set; }
        public string ConsigneeName { get; set; }
        public string ContactNo { get; set; }
        public string ConsigneeAddress { get; set; }
        public string AddressType { get; set; }
        public int DeleteAddress { get; set; }



    }
    public class DepartmentDetailViewModal
    {
        public string SaleOrderId { get; set; }
        public string HPSEDCOrder { get; set; }
        public string ReferenceNo { get; set; }
        public string DeptRefNo { get; set; }
        public DateTime OrderDate { get; set; }
        public int BillingAddress { get; set; }
        public decimal TotalOrderAmt { get; set; }




    }
    public class ViewPaymentDetailsModal
    {
        public string SaleOrderId { get; set; }
        public string TransactionId { get; set; }
        public string ModeOfPayment { get; set; }
        public decimal ReleasedAmount { get; set; }
        public decimal Tds { get; set; }
        public decimal GstTds { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal DueBalance { get; set; }




    }
    public class TrackingStatusViewModal
    {
        public int SaleOrderId { get; set; }
        public string Milestone { get; set; }
        public string Status { get; set; }
        public string CurrentStatus { get; set; }


    }
    public class DepartmentBalViewModal
    {
        public string OrderReferenceNo { get; set; }
        public string SaleOrderNo { get; set; }
        public string DepartmentName { get; set; }
        public decimal OrderAmount { get; set; }
        public decimal AdvanceAmount { get; set; }
        public decimal OutstandingAmount { get; set; }
        public int BankNameId { get; set; }
        public decimal BalanceAmt { get; set; }
        public DateTime ReceivedDate { get; set; }





    }
    public class DeliveryDateViewModal
    {
        public string ItemName { get; set; }
        public string SupplierName { get; set; }
        public string ContactNo { get; set; }
        public string EmailId { get; set; }
        public string EstimatedDeliveryDate { get; set; }






    }
    public class DeliveryDetailViewModal
    {
        public string ProductName { get; set; }
        public string ConsigneeName { get; set; }
        public string Address { get; set; }
        public string ContactNo { get; set; }
        public decimal DeliveredQty { get; set; }
        public string DeliveredDate { get; set; }
        public string POD { get; set; }
        public string IR { get; set; }






    }
    public class OrderQueryViewModal
    {
        public string QueryType { get; set; }
        public string QueryRemark { get; set; }
    }

    public class ConsigneeAddressViewModal
    {
        public int SaleOrderId { get; set; }
        public decimal DeliveryQty { get; set; }
        public string consigneeAddress { get; set; }
    }

    public class SaleOrderIdViewModal
    {
        public int SaleOrderNo { get; set; }
        public string HWSaleOrderNo { get; set; }
        public int BillingAddressId { get; set; }
        public string LetterReferenceNo { get; set; }
        public DateTime OrderDate { get; set; }
        public int DeptId { get; set; }
        public DateTime CreatedDate { get; set; }
        public decimal Total { get; set; }
        public decimal AdminCharge { get; set; }
        public decimal Gst { get; set; }
        public decimal Gtotal { get; set; }

    }

    public class ProductDetailsViewModal
    {
        public string MainCatgName { get; set; }
        public string CompanyName { get; set; }
        public string ProductName { get; set; }
        public string ModelNo { get; set; }
        public string Sepcification { get; set; }
        public int OrderQty { get; set; }
        public decimal Price { get; set; }
        public decimal Gtotal { get; set; }
        public decimal AdminCharge { get; set; }
        public decimal Gst { get; set; }
        public string Narration { get; set; }

    }
    public class IssueOrderViewModal
    {
        public int SaleOrderId { get; set; }
        public string SaleOrderNo { get; set; }
        public string RefferenceNo { get; set; }
        public string PONO { get; set; }
        public string DeptReffNo { get; set; }
        public DateTime OrderDate { get; set; }
        public int OrderStatus { get; set; }
        public string DepartmentName { get; set; }
        public string BillingAddress { get; set; }
        public decimal BillAmt { get; set; }
        public decimal Balance { get; set; }
        public decimal DeptAmtReceived { get; set; }


    }
    public class PurchaseOrderViewModal
    {

        public string PO { get; set; }
        public DateTime PODate { get; set; }
        public string Agency { get; set; }
        public string ActionByAgency { get; set; }
        public DateTime ActionDate { get; set; }
        public string ActionRemarks { get; set; }


    }
    public class PurchaseIssueRemarksViewModal
    {

        public string Remarks { get; set; }
        public string RemarksDoc { get; set; }
        public DateTime RemarksDate { get; set; }
        public string RemarksBy { get; set; }


    }
    public class VerificationStatusViewModal
    {

        public string SaleOrderId { get; set; }
        public string VerificationStatus { get; set; }
        public string VerifiedDate { get; set; }
        public string Remarks { get; set; }


    }
    public class POVerificationViewModal
    {
        public int SaleOrderId { get; set; }
        public int PurchaseOrderNoId { get; set; }
        public string PurchaseOrderNo { get; set; }
        public DateTime PurchaseOrderDate { get; set; }
        public string DepartmentName { get; set; }
        public string AgencyName { get; set; }
        public decimal Amount { get; set; }



    }
    public class OrderProcessingViewModal
    {
        public int SaleOrderId { get; set; }
        public int PurchaseOrderNoId { get; set; }
        public string PurchaseOrderDate { get; set; }
        public string DepartmentName { get; set; }
        public string AgencyName { get; set; }
        public decimal Amount { get; set; }
        public decimal DepartmentAmtReceived { get; set; }



    }
    public class OrderDetailViewModal
    {

        public int Id { get; set; }
        public int PurchaseOrderNoId { get; set; }
        public string ProductName { get; set; }
        public string Quantity { get; set; }
        public string IsEstimatedDate { get; set; }
        public string EstimatedDate { get; set; }
        public decimal BaseAmt { get; set; }
        public decimal SGSTAmt { get; set; }
        public decimal CGSTAmt { get; set; }
        public decimal Total { get; set; }




    }
    public class POCancelViewModal
    {

        public int PurchaseOrderNoId { get; set; }
        public string PurchaseOrderDate { get; set; }
        public string HWSaleOrderReferenceNo { get; set; }
        public string AgencyName { get; set; }
        public string FilterStatus { get; set; }
        public string DepartmentName { get; set; }



    }
    public class ProductDeliveryViewModal
    {

        public string PurchaseOrderNo { get; set; }
        public string ProductName { get; set; }
        public string ConsigneeName { get; set; }
        public string ConsigneeAddress { get; set; }
        public int OrderDeliveryId { get; set; }
        public int DeliveryQuantity { get; set; }
        public int DeliveredQty { get; set; }
        public string DeliveryDate { get; set; }
        public string ContactNo { get; set; }
        public string POD { get; set; }
        public string IR { get; set; }





    }
    public class AgencyInvoiceViewModal
    {

        public string PurchaseOrderNo { get; set; }
        public int OrderDeliveryId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ConsigneeName { get; set; }
        public string ConsigneeAddress { get; set; }
        public string DeliveredDate { get; set; }
        public int DeliveredQty { get; set; }

    }
    public class PODVerifyViewModal
    {

        public string PurchaseOrderNo { get; set; }
        public string ProductName { get; set; }
        public string ConsigneeName { get; set; }
        public string ConsigneeAddress { get; set; }
        public int OrderDeliveryId { get; set; }
        public int ItemDetailsId { get; set; }
        public int DeliveryQuantity { get; set; }
        public int DeliveredQty { get; set; }
        public string DeliveryDate { get; set; }
        public string ContactNo { get; set; }
        public char IsPOdVerified { get; set; }
        public char IsIRVerified { get; set; }



        public string POD { get; set; }
        public string IR { get; set; }





    }
    public class ProductDeliveryItemViewModal
    {
        public int OrderDeliveryId { get; set; }
        public int OrderDetailsId { get; set; }
        public string ProductName { get; set; }
        public string ContactNo { get; set; }
        public int ProductId { get; set; }
        public int ItemDetailsId { get; set; }
        public decimal AvailableQty { get; set; }

        public decimal DeliveryQty { get; set; }
        public decimal DeliveredQty { get; set; }







    }
    public class OrderDetailsViewModal
    {

        public int Id { get; set; }
        public int PurchaseOrderNoId { get; set; }
        public int OrderDetailsId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal BaseAmt { get; set; }
        public decimal SGSTAmt { get; set; }
        public decimal CGSTAmt { get; set; }
        public decimal Total { get; set; }
        public string CancelDateAndTime { get; set; }
        public string Agency { get; set; }
        public string CancelRemarks { get; set; }




    }
    public class ProductInvViewModal
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Qty { get; set; }
        public decimal productprice { get; set; }
        public decimal GstP { get; set; }

    }

    public class PbgAdvanceViewModal
    {

        public int Id { get; set; }
        public string BillFor { get; set; }
        public string BillForId { get; set; }
        public string Pinvid { get; set; }
        public string BillNO { get; set; }
        public string BGNumber { get; set; }
        public string IssuanceDate { get; set; }
        public string ExpiryDate { get; set; }
        public string ClaimDate { get; set; }
        public decimal PBGAmt { get; set; }
        public decimal RestBalance { get; set; }
        public string Remarks { get; set; }
        public string AgencyName { get; set; }
        public string AgencyId { get; set; }
        public string Document { get; set; }

    }
    public class PIAddressViewModal
    {

        public int PiAddressId { get; set; }
        public string departmentName { get; set; }
        public int departmentID { get; set; }
        public string Designation { get; set; }
        public string AddressText { get; set; }
        public string EmailId { get; set; }
        public string ContactNo { get; set; }


    }
    public class CreateLoginIdViewModal
    {

        public int AgencyId { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string AddressDetails { get; set; }



    }
    public class CreateDepartmentLoginViewModal
    {

        public int AgencyId { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string AddressDetails { get; set; }



    }




}

