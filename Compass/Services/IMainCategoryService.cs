using Compass.Models.Dropdown;

namespace Compass.Services
{
    public interface IMainCategoryService
    {
        Task<List<DropdownDto>> GetMainCategoryDropdownAsync(int id, int mainCatgId, string searchTerm);
        Task<List<DropdownDto>> GetDepartmentDropdownAsync(int deptId, string searchTerm);
        Task<List<DropdownDto>> GetBillingAddressDropdownAsync(int deptId, string searchTerm);

        // Get Agency ddl
        Task<List<DropdownDto>> GetAgencyDropdownAsync(int deptId, string searchTerm);
       
    }

}
