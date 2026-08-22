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
        // get company ddl
        public async Task<List<DropdownElement>> GetCompanyDdlAsync(int id, string searchTerm)
        {
            return await _repository.GetCompanyDdlAsync(id, searchTerm);
        }
        // get Bill for Pbg ddl
        public async Task<List<DropdownElement>> GetBillForPbgDdlAsync(int id, string searchTerm)
        {
            return await _repository.GetBillForPbgDdlAsync(id, searchTerm);
        }
        // get Pbg Purchase Order No.ddl
        public async Task<List<DropdownElement>> GetPbgPOrderNoDdlAsync(int id, string searchTerm)
        {
            return await _repository.GetPbgPOrderNoDdlAsync(id, searchTerm);
        }
        // get Term and Condition ddl
        public async Task<List<DropdownElement>> GetTermConditionDdlAsync(int id, string searchTerm)
        {
            return await _repository.GetTermConditionDdlAsync(id, searchTerm);
        }
        // get Add Term Type ddl
        public async Task<List<DropdownElement>> GetTermTypeConditionDdlAsync(int id, string searchTerm)
        {
            return await _repository.GetTermTypeConditionDdlAsync(id, searchTerm);
        }
        // get Agency ddl
        public async Task<List<DropdownElement>> GetAgencyDdlAsync(int AgencyId, string searchTerm)
        {
            return await _repository.GetAgencyDdlAsync(AgencyId, searchTerm);
        }
        // get Product Name ddl
        public async Task<List<DropdownElement>> GetProductDdlAsync(int Id, int MainCatgId, string searchTerm)
        {
            return await _repository.GetProductDdlAsync(Id, MainCatgId, searchTerm);
        }
        // get Department Name ddl 
        public async Task<List<DropdownElement>> GetDepartmentDdlAsync(int Id, int MainCatgId, string searchTerm)
        {
            return await _repository.GetDepartmentDdlAsync(Id, MainCatgId, searchTerm);
        }
        // get Pi Ref No. ddl 
        public async Task<List<DropdownElement>> GetPiRefNoDdlAsync(int Id, int ParentId, string searchTerm)
        {
            return await _repository.GetPiRefNoDdlAsync(Id, ParentId, searchTerm);
        }
        // get Billing Address ddl 
        public async Task<List<DropdownElement>> GetBillingAddressDdlAsync(int Id, int MainCatgId, string searchTerm)
        {
            return await _repository.GetBillingAddressPISaleDdlAsync(Id, MainCatgId, searchTerm);
        }
        // get Districts Name ddl

        public async Task<List<DropdownElement>> GetDistrictDdlAsync(int Id, int MainCatgId, string searchTerm)
        {
            return await _repository.GetDistrictDdlAsync(Id, MainCatgId, searchTerm);
        }
        // get Billing Address ddl
        public async Task<List<DropdownElement>> GetBillingAddressPISaleDdlAsync(int Id, int ParentId, string searchTerm)
        {
            return await _repository.GetBillingAddressDdlAsync(Id, ParentId, searchTerm);
        }
        // get Product Name With Model No. ddl
        //public async Task<List<DropdownElement>> HProductNameWithModel_ddl(int Id, int ParentId1, int ParentId2, int ParentId3, string searchTerm)
        public async Task<List<DropdownElement>> GetProductNameWithModelDdlAsync(int Id, int ParentId1, int ParentId2, int ParentId3, string searchTerm)
        {
            return await _repository.GetProductNameWithModelDdlAsync(Id, ParentId1, ParentId2, ParentId3, searchTerm);
        }
        // get Bank Name ddl
        public async Task<List<DropdownElement>> GetBankDdlAsync(int Id, int MainCatgId, string searchTerm)
        {
            return await _repository.GetBankDdlAsync(Id, MainCatgId, searchTerm);
        }
        // get Query Type ddl
        public async Task<List<DropdownElement>> GetQueryTypeDdlAsync(int Id, int MainCatgId, string searchTerm)
        {
            return await _repository.GetQueryTypeDdlAsync(Id, MainCatgId, searchTerm);
        }
        // get Payment mode ddl
        public async Task<List<DropdownElement>> GetPaymentModeDdlAsync(int Id, int MainCatgId, string searchTerm)
        {
            return await _repository.GetPaymentModeDdlAsync(Id, MainCatgId, searchTerm);
        }

        public async Task<List<DropdownElement>> GetConsigneeDdlAsync(int Id, string searchTerm)
        {
            return await _repository.GetConsigneeDdlAsync(Id, searchTerm);
        }
        // get Billing Address ddl
        public async Task<List<DropdownElement>> GetBillingAddressPIDdlAsync(int Id, int ParentId, string searchTerm)
        {
            return await _repository.GetBillingAddressDdlAsync(Id, ParentId, searchTerm);
        }

    }
}
