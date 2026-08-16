using Compass.Models.Dropdown;

namespace Compass.Repositories
{
    public interface IHardwareDropdownRepository
    {

        Task<List<DropdownElement>> GetMainCategoryDdlAsync(int Id, string searchTerm);
        // company/Brand ddl
        Task<List<DropdownElement>> GetCompanyDdlAsync(int Id, string searchTerm);
        // Bill For Pbg ddl
        Task<List<DropdownElement>> GetBillForPbgDdlAsync(int Id, string searchTerm);
        // Pbg Purchase Order ddl
        Task<List<DropdownElement>> GetPbgPOrderNoDdlAsync(int Id, string searchTerm);
        // Agency ddl
        Task<List<DropdownElement>> GetAgencyDdlAsync(int Id, string searchTerm);
        // Term and Condition ddl
        Task<List<DropdownElement>> GetTermConditionDdlAsync(int Id, string searchTerm);
        // Add Term Type ddl
        Task<List<DropdownElement>> GetTermTypeConditionDdlAsync(int Id, string searchTerm);
        // Product Name ddl
        Task<List<DropdownElement>> GetProductDdlAsync(int Id, int MainCatgId, string searchTerm);
        // Department Name ddl
        Task<List<DropdownElement>> GetDepartmentDdlAsync(int Id, int MainCatgId, string searchTerm);
        // Pi Ref No. ddl
        Task<List<DropdownElement>> GetPiRefNoDdlAsync(int Id, int ParentId, string searchTerm);
        // Pi Billing Address ddl
        Task<List<DropdownElement>> GetBillingAddressDdlAsync(int Id, int MainCatgId, string searchTerm);
        // Districts Name ddl
        Task<List<DropdownElement>> GetDistrictDdlAsync(int Id, int MainCatgId, string searchTerm);
        // Billing Address ddl
        Task<List<DropdownElement>> GetBillingAddressPISaleDdlAsync(int Id, int ParentId, string searchTerm);
        // Product Name With Model No. ddl
        Task<List<DropdownElement>> GetProductNameWithModelDdlAsync(int Id, int ParentId1, int ParentId2, int ParentId3, string searchTerm);
        // Bank Name ddl
        Task<List<DropdownElement>> GetBankDdlAsync(int Id, int MainCatgId, string searchTerm);
        // Payment Mode ddl
        Task<List<DropdownElement>> GetPaymentModeDdlAsync(int Id, int MainCatgId, string searchTerm);
        // Query Type ddl
        Task<List<DropdownElement>> GetQueryTypeDdlAsync(int Id, int MainCatgId, string searchTerm);
        // Consignee Name ddl
        Task<List<DropdownElement>> GetConsigneeDdlAsync(int Id, string searchTerm);
        // Billing AddressPI ddl
        Task<List<DropdownElement>> GetBillingAddressPIDdlAsync(int Id, int ParentId, string searchTerm);

    }
}
