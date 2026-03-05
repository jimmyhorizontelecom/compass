using Compass.Models.Dropdown;

namespace Compass.Repositories
{
    public interface IMainCategoryRepository
    {
        Task<List<DropdownDto>> GetMainCategoryDropdownAsync(int id, int mainCatgId, string searchTerm);
        Task<List<DropdownDto>> GetDepartmentDropdownAsync(int deptId, string searchTerm);
        // Get Billing Address ddl
        Task<List<DropdownDto>> GetBillingAddressDropdownAsync(int deptId, string searchTerm);
        // Get Agency ddl
        Task<List<DropdownDto>> GetAgencyDropdownAsync(int deptId, string searchTerm);

        // Get Work Oreder ddl
        Task<List<DropdownDto>> GetWorkOredrDropdownAsync(int Id, int ParentId1, int ParentId2, int ParentId3, int userId, int roleId, string searchTerm);

        
        
        





    }
}
