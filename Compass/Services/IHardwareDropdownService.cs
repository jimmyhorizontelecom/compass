using Compass.Models.Dropdown;

namespace Compass.Services
{
    public interface IHardwareDropdownService
    {
        Task<List<DropdownElement>> GetMainCategoryDdlAsync(int Id, string searchTerm);
        // get company ddl
        Task<List<DropdownElement>> GetCompanyDdlAsync(int Id, string searchTerm);
        // get Bill for Pbg ddl
        Task<List<DropdownElement>> GetBillForPbgDdlAsync(int Id, string searchTerm);
        // get Pbg Purchase Order No.ddl
        Task<List<DropdownElement>> GetPbgPOrderNoDdlAsync(int Id, string searchTerm);
        // get Agency ddl

        Task<List<DropdownElement>> GetAgencyDdlAsync(int Id, string searchTerm);
        // get Term and Condition ddl
        Task<List<DropdownElement>> GetTermConditionDdlAsync(int Id, string searchTerm);
        // get Add Term Type ddl
        Task<List<DropdownElement>> GetTermTypeConditionDdlAsync(int Id, string searchTerm);
        // get Product Name ddl
        Task<List<DropdownElement>> GetProductDdlAsync(int Id, int MainCatgId, string searchTerm);
        // get Department Name ddl
        Task<List<DropdownElement>> GetDepartmentDdlAsync(int Id, int MainCatgId, string searchTerm);
        // get Pi Ref No. ddl
        Task<List<DropdownElement>> GetPiRefNoDdlAsync(int Id, int ParentId, string searchTerm);
        // get Billing Address ddl
        Task<List<DropdownElement>> GetBillingAddressDdlAsync(int Id, int MainCatgId, string searchTerm);
        // get Districts Name ddl
        Task<List<DropdownElement>> GetDistrictDdlAsync(int Id, int MainCatgId, string searchTerm);
        // get Billing Address ddl 
        Task<List<DropdownElement>> GetBillingAddressPISaleDdlAsync(int Id, int ParentId, string searchTerm);
        // get Product Name with modal ddl 
        Task<List<DropdownElement>> HProductNameWithModel_ddl(int Id, int ParentId1, int ParentId2, int ParentId3, string searchTerm);
        // get Bank Name ddl
        Task<List<DropdownElement>> GetBankDdlAsync(int Id, int MainCatgId, string searchTerm);
        // get Payment mode ddl
        Task<List<DropdownElement>> GetPaymentModeDdlAsync(int Id, int MainCatgId, string searchTerm);
        // get Query Type ddl
        Task<List<DropdownElement>> GetQueryTypeDdlAsync(int Id, int MainCatgId, string searchTerm);
        // get Consignee Name ddl
        Task<List<DropdownElement>> GetConsigneeDdlAsync(int Id, string searchTerm);
        // get Billing AddressPI ddl 
        Task<List<DropdownElement>> GetBillingAddressPIDdlAsync(int Id, int ParentId, string searchTerm);
    }

}
