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
        //public async Task<List<DropdownDto>> GetDepartmentDropdownAsync(
        //    int deptId,           
        //    string searchTerm)
        //{
        //    return await _repository.GetDepartmentDropdownAsync(deptId, searchTerm);
        //}
        public async Task<List<DropdownDto>> GetDepartmentDropdownAsync(
     int deptId,
     int userId,
     int agencyId,
     string searchTerm)
        {
            return await _repository.GetDepartmentDropdownAsync(deptId, userId, agencyId, searchTerm);
        }

        //Get Billing Address

        //public async Task<List<DropdownDto>> GetBillingAddressDropdownAsync(
        //    int deptId,
        //    string searchTerm)
        //{
        //    return await _repository.GetBillingAddressDropdownAsync(deptId, searchTerm);
        //}
        //public async Task<List<DropdownDto>> GetBillingAddressDropdownAsync(
        //    int ParentId1,
        //    int ParentId2,
        //    int ParentId3,
        //    int userId,
        //    int roleId,
        //    string searchTerm)
        //{
        //    return await _repository.GetBillingAddressDropdownAsync(ParentId1, ParentId2, ParentId3, userId, roleId, searchTerm);

        //}

        //Get Billing Address for Add New Work Order in Dept Master
        public async Task<List<DropdownDto>> GetAddWorkOrderBillingAddressDropdownAsync(
          int deptId,
           string searchTerm)
        {
            return await _repository.GetAddWorkOrderBillingAddressDropdownAsync(deptId, searchTerm);

        }

        //Get Agency ddl

        //public async Task<List<DropdownDto>> GetAgencyDropdownAsync(
        //    int deptId,
        //    string searchTerm)
        //{
        //    return await _repository.GetAgencyDropdownAsync(deptId, searchTerm);
        //}
        public async Task<List<DropdownDto>> GetAgencyDropdownAsync(
        int agencyId,
        int roleId,
        string searchTerm)
        {
            return await _repository.GetAgencyDropdownAsync(agencyId, roleId, searchTerm);
        }

       //Get Designation ddl
        public async Task<List<DropdownDto>> GetDesignationDropdownAsync(
        int designationId, 
        string searchTerm
        )
        {
            return await _repository.GetDesignationDropdownAsync(designationId, searchTerm);
        }

        //Get Educational ddl
        public async Task<List<DropdownDto>> GetEducationalDropdownAsync(
        int educationId,
        string searchTerm
        )
        {
            return await _repository.GetEducationalDropdownAsync(educationId, searchTerm);
        }

        //Get Work Order ddl & Billing Address depends on Work Order based on Parent 1 & Parent 2

        public async Task<List<DropdownDto>> GetWorkOredrDropdownAsync(
            int Id,
            int ParentId1,
            int ParentId2,
            int ParentId3,
            int userId,
            int roleId,
            string searchTerm)
        {
            return await _repository.GetWorkOredrDropdownAsync(Id, ParentId1, ParentId2, ParentId3, userId, roleId, searchTerm);
        }

        // Get Bank ddl
        public async Task<List<DropdownDto>> GetBankDropdownAsync(
           int bankId,
           string searchTerm)
        {
            return await _repository.GetBankDropdownAsync(bankId, searchTerm);
        }
        // Get Payment Mode ddl
        public async Task<List<DropdownDto>> GetPaymentModeDropdownAsync(
           int Id,
           string searchTerm)
        {
            return await _repository.GetPaymentModeDropdownAsync(Id, searchTerm);
        }


        //Get Work Order ddl based on Parent 1 & Parent 2 from Employee Detail Import

        public async Task<List<DropdownDto>> GetEMPImportWorkOrderDropdownAsync(
            int Id,
            int ParentId1,
            int ParentId2,
            int ParentId3,
            int userId,
            int roleId,
            string searchTerm)
        {
            return await _repository.GetEMPImportWorkOrderDropdownAsync(Id, ParentId1, ParentId2, ParentId3, userId, roleId, searchTerm);
        }

        // Get Challan Type ddl
        public async Task<List<DropdownDto>> GetChallanTypeDropdownAsync(
           int Id,
           string searchTerm)
        {
            return await _repository.GetChallanTypeDropdownAsync(Id, searchTerm);
        }


    }
}
