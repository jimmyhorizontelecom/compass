using Compass.Models.Dropdown;
using Compass.Repositories;

namespace Compass.Services
{
    public class HardwareDropdownService : IHardwareDropdownService
    {
        private readonly IHardwareDropdownRepository _repository;

        public HardwareDropdownService(IHardwareDropdownRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<DropdownElement>> GetMainCategoryDdlAsync(int id, string searchTerm)
        {
            return await _repository.GetMainCategoryDdlAsync(id, searchTerm);
        }
    }
}
