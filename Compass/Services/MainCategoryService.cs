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

        //Get Billing Address

        public async Task<List<DropdownDto>> GetBillingAddressDropdownAsync(
            int deptId,
            string searchTerm)
        {
            return await _repository.GetBillingAddressDropdownAsync(deptId, searchTerm);
        }

        //Get Agency ddl

        public async Task<List<DropdownDto>> GetAgencyDropdownAsync(
            int deptId,
            string searchTerm)
        {
            return await _repository.GetAgencyDropdownAsync(deptId, searchTerm);
        }

        //Get Work Oreder ddl

        public async Task<List<DropdownDto>> GetWorkOredrDropdownAsync(
            int deptId,
            string searchTerm)
        {
            return await _repository.GetWorkOredrDropdownAsync(deptId, searchTerm);
        }

        //Get Month Year ddl

        public async Task<List<DropdownDto>> GetMonthYearDropdownAsync(
            int deptId,
            string searchTerm)
        {
            return await _repository.GetMonthYearDropdownAsync(deptId, searchTerm);
        }



    }
}
