using Compass.Models.Dropdown;

namespace Compass.Services
{
    public interface IMainCategoryService
    {
        Task<List<DropdownDto>> GetMainCategoryDropdownAsync(int id, int mainCatgId, string searchTerm);

        //Get Department Billing Address
        Task<List<DropdownDto>> GetDepartmentDropdownAsync(int deptId, string searchTerm);
        //Get Billing Address ddl
        Task<List<DropdownDto>> GetBillingAddressDropdownAsync(int deptId, string searchTerm);

        // Get Agency ddl
        Task<List<DropdownDto>> GetAgencyDropdownAsync(int deptId, string searchTerm);

        // Get Work Order ddl
        Task<List<DropdownDto>> GetWorkOredrDropdownAsync(int deptId, string searchTerm);

        // Get Month Year ddl
        Task<List<DropdownDto>> GetMonthYearDropdownAsync(int deptId, string searchTerm);

    }

}
