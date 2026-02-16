using Compass.Models.Dropdown;

namespace Compass.Services
{
    public interface IHardwareDropdownService
    {
        Task<List<DropdownElement>> GetMainCategoryDdlAsync(int Id, string searchTerm);
    }

}
