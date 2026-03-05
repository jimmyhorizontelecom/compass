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
            int Id, 
            int ParentId1, 
            int ParentId2, 
            int ParentId3,
            int userId, 
            int roleId,
            string searchTerm)
        {
            return await _repository.GetWorkOredrDropdownAsync( Id, ParentId1, ParentId2, ParentId3, userId,  roleId, searchTerm);
        }

       

            }
}
