using Compass.Models.Dropdown;
using Compass.Repositories;
using DocumentFormat.OpenXml.Office2010.Excel;

namespace Compass.Services
{
    public class MainCategoryService : IMainCategoryService
    {
        private readonly IMainCategoryRepository _repository;

        public MainCategoryService(IMainCategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<DropdownDto>> GetMainCategoryDropdownAsync(
            int id,
            int mainCatgId,
            string searchTerm)
        {
            return await _repository.GetMainCategoryDropdownAsync(id, mainCatgId, searchTerm);
        }
        public async Task<List<DropdownDto>> GetDepartmentDropdownAsync(
            int deptId,           
            string searchTerm)
        {
            return await _repository.GetDepartmentDropdownAsync(deptId, searchTerm);
        }

        //Get Billin Address

        public async Task<List<DropdownDto>> GetBillingAddressDropdownAsync(
            int deptId,
            string searchTerm)
        {
            return await _repository.GetBillingAddressDropdownAsync(deptId, searchTerm);
        }


    }
}
