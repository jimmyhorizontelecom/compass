using Compass.Models.Dropdown;

namespace Compass.Services
{
    public interface IMainCategoryService
    {
        Task<List<DropdownDto>> GetMainCategoryDropdownAsync(int id, int mainCatgId, string searchTerm);
        Task<List<DropdownDto>> GetDepartmentDropdownAsync(int deptId, string searchTerm);
    }

}
