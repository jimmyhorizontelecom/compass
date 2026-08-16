using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Vml;
using Microsoft.AspNetCore.Http;
using System.Net.Mail;

namespace Compass.Models.Hardware
{
  
    public class Company
    {
       public int Id { get; set; }
        public string CompanyName { get; set; }
        public char IsActive { get; set; }

    }
    public class TermsConditionModal
    {

        public int TrId { get; set; }
        public int TrCatgId { get; set; }
        public string ConditionName { get; set; }
        public char IsActive { get; set; }

    }
    public class AddTypeTermsConditionModal
    {

        public int TrCatgId { get; set; }
        public int TypeId { get; set; }
        public string CategoryName { get; set; }


    }

    public class ProductModal
    {

        public int Id { get; set; }
        public string MainCategory { get; set; }
        public string Title { get; set; }
        public char IsActive { get; set; }
        public string FileName { get; set; }
        public IFormFile File { get; set; }
    }
    public class ProductDetail
    {


        public int ProductId { get; set; }
        public int MainCategoryId { get; set; }
        public int PCategoryId { get; set; }
        public int CompanyId { get; set; }
        public string ModelNo { get; set; }
        public decimal ProductPrice { get; set; }
        public string Sepcification { get; set; }
        public decimal CurrentStorck { get; set; }
        public string HSNCode { get; set; }
        public decimal Gst { get; set; }
        public decimal HPSEDCCharges { get; set; }
        public decimal GrandTotal { get; set; }
        public char IsActive { get; set; }
        public string TenderNo { get; set; }
        public DateOnly ValidFrom { get; set; }
        public DateOnly ValidTo { get; set; }
        public int RularPenaltyDays { get; set; }
        public int UrbanPenaltyDays { get; set; }
    }
    public class BillingDetailModel
    {
        public int BillingId { get; set; }
        public int DeptId { get; set; }
        public int DistrictId { get; set; }
        public string BillingAddress { get; set; }
        public string NodalOfficerName { get; set; }
        public string Email { get; set; }
        public string ContactNo { get; set; }

    }


    public class OrderItemModel
    {
        public int ProductId { get; set; }
        public double OrderQty { get; set; }
        public double Price { get; set; }
        public double Gst { get; set; }
        public double AdminCharge { get; set; }
        public double Gtotal { get; set; }
        public string Narration { get; set; }
    }


    public class PlaceOrderModel
    {
        public int SaleOrderId { get; set; }
        public int? SaleOrderNo { get; set; }
        public string SaleOrderNoText { get; set; }
        public DateTime OrderDate { get; set; }
        public int DeptId { get; set; }
        public int BillingAddressId { get; set; }
        public string BillingAddressText { get; set; }
        public string LetterReferenceNo { get; set; }
        public DateTime DeliveryDate { get; set; }
        public double Total { get; set; }
        public double Cgst { get; set; }
        public double Sgst { get; set; }
        public double Gst { get; set; }
        public double AdminCharge { get; set; }
        public double Gtotal { get; set; }
        public double PaymentAmt { get; set; }
        public double Balance { get; set; }
        public char IsPaymentRequired { get; set; }
        public IFormFile DeliveryAttachement { get; set; }
        public IFormFile Attachement { get; set; }
        public List<OrderItemModel> Items { get; set; }

    }
    public class OrderDeliverModel
    {
        public int ItemDetailsId { get; set; }
        public int SaleOrderId { get; set; }
        public int ProductId { get; set; }
        public double DeliveryQty { get; set; }
        public string ConsigneeName { get; set; }
        public string ConsigneeContactNo { get; set; }
        public string consigneeAddress { get; set; }
        public int DistrictId { get; set; }
        public int DeliveredQty { get; set; }




    }
    public class ItemDeliveryModel
    {
        public int PurchaseOrderNo { get; set; }
        public int ItemDetailsIdTxt { get; set; }

        public List<ItemProductDeliveredModel> Items { get; set; }

    }
    public class GenerateProductListModel
    {
        public int OrderDeliveryId { get; set; }




    }
    public class GenerateProductModel
    {
        public int PurchaseOrderNo { get; set; }


        public List<GenerateProductListModel> Items { get; set; }

    }

    public class ItemProductDeliveredModel
    {
        public int OrderDetailsId { get; set; }
        public int OrderDeliveryId { get; set; }
        public int ProductId { get; set; }
        public string ConsigneeName { get; set; }
        public string ConsigneeContactNo { get; set; }
        public string consigneeAddress { get; set; }
        public double DeliveredQty { get; set; }
        public string DeliveredTo { get; set; }
        public string DeliveredDate { get; set; }
        public string Document { get; set; }
        public string Document2 { get; set; }




    }
    public class ConfirmPIOrderModel
    {
        public int DeptOrderId { get; set; }
        public decimal TotalBasePrice { get; set; }
        public decimal AdminP { get; set; }
        public decimal AdminAmt { get; set; }
        public decimal GstAmt { get; set; }
        public decimal RoundOff { get; set; }
        public decimal GrandTotal { get; set; }
        public int LocationAttach { get; set; }


        public List<ConfirmPIIDModel> Items { get; set; }

    }
    public class ConfirmPIIDModel
    {
        public int PiId { get; set; }
        public DateTime PiDate { get; set; }
        public int DeptId { get; set; }
        public int AddressId { get; set; }
        public string ReferenceNo { get; set; }
        public int ProductId { get; set; }
        public decimal Qty { get; set; }

    }
    public class PISaleGenerateModel
    {
        public int SaleOrderId { get; set; }
        public int PiId { get; set; }
        public DateTime OrderDate { get; set; }
        public int DeptId { get; set; }
        public int BillingAddressId { get; set; }
        public string BillingAddressText { get; set; }
        public string LetterReferenceNo { get; set; }
        public DateTime OrderEntryDate { get; set; }
        public decimal Total { get; set; }
        public decimal Cgst { get; set; }
        public decimal Sgst { get; set; }
        public decimal Gst { get; set; }
        public decimal AdminCharge { get; set; }
        public decimal Gtotal { get; set; }
        public int DeliveryAttachement { get; set; }


        public List<SalePIGenerateModel> Items { get; set; }

    }
    public class SalePIGenerateModel
    {
        public int ProductId { get; set; }
        public decimal OrderQty { get; set; }
        public int Narration { get; set; }
        public int DeliveryDay { get; set; }


    }
    public class IRConsigneeContactModel
    {
        public int PurchaseOrderNo { get; set; }

        public List<ItemIRConsigneeModel> Items { get; set; }

    }
    public class ItemIRConsigneeModel
    {
        public int OrderDeliveryId { get; set; }
        public int OrderDetailsId { get; set; }
        public string Document2 { get; set; }




    }
    public class GeneratePISubmitModel
    {
        public string Designation { get; set; }

        public List<PIGenerateRecordModel> Items { get; set; }

    }
    public class PIGenerateRecordModel
    {
        public int PiId { get; set; }

        public int DeptId { get; set; }
        public int AddressId { get; set; }
        public string AddressText { get; set; }
        public string EmailId { get; set; }
        public string AdditionalInfo { get; set; }
        public string Itemsheading { get; set; }
        public string ContactNo { get; set; }
        public string ReferenceNo { get; set; }
        public int ProductId { get; set; }
        public int Qty { get; set; }



    }
    public class GeneratePorformaModel
    {

        public int DeptOrderId { get; set; }
        public string BillGeneratedRemarks { get; set; }



    }
    public class AgencyLoginModel
    {

        public int AgencyId { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }



    }
    public class DepartmentLoginModel
    {

        public int BillingId { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }



    }


    public class DeliveryLocationModal
    {
        public int OrderDeliveryId { get; set; }
        public char AreaType { get; set; }

        public List<OrderDeliverModel> Items { get; set; }
    }
    public class PurchaseIssueModel
    {
        public int OrderDetailsId { get; set; }
        public string validDateFrom { get; set; }
        public string validDateTo { get; set; }
    }
    public class IssuesOrderModal
    {
        public int OrderDetailsId { get; set; }
        public int AgencyId { get; set; }
        public char IsUniquePruchaseOrder { get; set; }
        public List<PurchaseIssueModel> Items { get; set; }
    }
    public class MapConditionModel
    {
        public int ProductId { get; set; }
        public int TermconditionId { get; set; }

    }
    public class MapTermAndConditionModal
    {
        public int Id { get; set; }

        public List<MapConditionModel> Items { get; set; }
    }
    public class OrderDetailsModel
    {
        public int OrderDetailsId { get; set; }

    }
    public class PurchaseDetailsModal
    {
        public int OrderDetailsId { get; set; }
        public int PurchaseOrderId { get; set; }
        public int AgencyId { get; set; }
        public char IsCancelPruchaseOrder { get; set; }
        public string PoCancelRemarks { get; set; }
        public List<OrderDetailsModel> Items { get; set; }
    }
    public class POVerifyModal
    {
        public int SaleOrderId { get; set; }
        public int OrderDetailsId { get; set; }
        public int PurchaseOrderId { get; set; }
        public char IsOrderAccept { get; set; }
        public string Remarks { get; set; }

    }
    public class ClicktoCartModal
    {
        public int ProductId { get; set; }
        public string UnitBasePrice { get; set; }
        public string GstP { get; set; }
        public string AdminP { get; set; }
        public string AdminAmt { get; set; }
        public string GstAmt { get; set; }
        public string ProductUnitPrice { get; set; }
        public string GrandTotal { get; set; }

    }
    public class ExpectedDateModal
    {
        public int Id { get; set; }
        public DateTime EstimatedDate { get; set; }


    }
    public class VerifyPODModal
    {
        public int OrderDetailsId { get; set; }
        public int OrderDeliveryId { get; set; }
        public char? IsPODVerified { get; set; }
        public char? IsIRVerified { get; set; }


    }
    public class OrderQueryModal
    {
        public int QId { get; set; }
        public int SaleOrderId { get; set; }
        public string QueryRemarks { get; set; }


    }
    public class FeedbackModal
    {
        public int FeedBackId { get; set; }
        public int SaleOrderId { get; set; }
        public string FeedBackPoint { get; set; }
        public string Remarks { get; set; }


    }


    public class DepartmentPaymentModel
    {
        public int ReceiptId { get; set; }
        public int SaleOrderId { get; set; }
        public int PurchaseOrderId { get; set; }
        public string TransactionId { get; set; }
        public int ModeOfPayment { get; set; }
        public int BankNameId { get; set; }
        public string Narration { get; set; }
        public DateTime ReceivedDate { get; set; }
        public double ReceivedAmt { get; set; }
        public double BalanceAmt { get; set; }
        public double GSTTds2 { get; set; }
        public double Tds2 { get; set; }
        public IFormFile Attachement { get; set; }

    }
    public class SaleOrderVerifyModal
    {
        public int SaleOrderId { get; set; }
        public char Verify { get; set; }
        public string Remarks { get; set; }



    }
    public class PurchaseOrderRemarkModel
    {
        public int RemarkId { get; set; }
        public int SaleOrderId { get; set; }
        public string Remarks { get; set; }
        public string RemarksBy { get; set; }
        public IFormFile Attachement { get; set; }




    }
    public class PbgAdvanceSubmitModel
    {
        public int Id { get; set; }
        public char BillFor { get; set; }
        public int AgencyId { get; set; }
        public int BillNO { get; set; }
        public string BGNumber { get; set; }
        public int Pinvid { get; set; }
        public DateTime IssuanceDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime ClaimDate { get; set; }
        public decimal PBGAmt { get; set; }
        public decimal RestBalance { get; set; }
        public string Remarks { get; set; }
        public string IpAddress { get; set; }





    }
    public class UpdatePIAddressViewModal
    {

        public int PiAddressId { get; set; }
        public int DeptId { get; set; }
        public string AddressText { get; set; }
        public string EmailId { get; set; }
        public string ContactNo { get; set; }
        public string IsActive { get; set; }
        public string Designation { get; set; }


    }




}


