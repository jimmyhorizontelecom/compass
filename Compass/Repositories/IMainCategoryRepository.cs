using Compass.Models.Dropdown;

namespace Compass.Repositories
{
    public interface IMainCategoryRepository
    {
        Task<List<DropdownDto>> GetMainCategoryDropdownAsync(int id, int mainCatgId, string searchTerm);
        // Get Department ddl
        //Task<List<DropdownDto>> GetDepartmentDropdownAsync(int deptId, string searchTerm);
        Task<List<DropdownDto>> GetDepartmentDropdownAsync(int deptId, int userId, int agencyId, string searchTerm);

        // Get Billing Address ddl
        //Task<List<DropdownDto>> GetBillingAddressDropdownAsync(int deptId, string searchTerm);
       // Task<List<DropdownDto>> GetBillingAddressDropdownAsync(int ParentId1, int ParentId2, int ParentId3, int userId, int roleId, string searchTerm);

        //Get Billing Address for Add New Work Order in Dept Master
        Task<List<DropdownDto>> GetAddWorkOrderBillingAddressDropdownAsync(int deptId, string searchTerm);


        // Get Agency ddl
        //Task<List<DropdownDto>> GetAgencyDropdownAsync(int deptId, string searchTerm);
        Task<List<DropdownDto>> GetAgencyDropdownAsync(int agencyId, int roleId, string searchTerm);

        //Get Designation ddl
        Task<List<DropdownDto>> GetDesignationDropdownAsync(int designationId , string searchTerm);

        //Get Educational ddl
        Task<List<DropdownDto>> GetEducationalDropdownAsync(int educationId, string searchTerm);

        //  //Get Work Order ddl & Billing Address depends on Work Order based on Parent 1 & Parent 2
        Task<List<DropdownDto>> GetWorkOredrDropdownAsync(int Id, int ParentId1, int ParentId2, int ParentId3, int userId, int roleId, string searchTerm);

        //Get Bank ddl
        Task<List<DropdownDto>> GetBankDropdownAsync(int bankId, string searchTerm);
        //Get Payment Mmode ddl
        Task<List<DropdownDto>> GetPaymentModeDropdownAsync(int Id, string searchTerm);

        // Get Work Order ddl based on Parent 1 & Parent 2 for Employee Detail Import
        Task<List<DropdownDto>> GetEMPImportWorkOrderDropdownAsync(int Id, int ParentId1, int ParentId2, int ParentId3, int userId, int roleId, string searchTerm);

        //Get Challan Type ddl
        Task<List<DropdownDto>> GetChallanTypeDropdownAsync(int Id, string searchTerm);



    }
}
