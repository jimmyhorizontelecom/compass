using Compass.Models.Dropdown;

namespace Compass.Repositories
{
    public interface IHardwareDropdownRepository
    {

        Task<List<DropdownElement>> GetMainCategoryDdlAsync(int Id, string searchTerm);
    } 
}
