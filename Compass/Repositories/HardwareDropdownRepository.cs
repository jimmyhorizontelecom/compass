//using ClosedXML.Excel;
//using ExcelDataReader;
using Compass.Classes;
using Compass.Models.Dropdown;
using Compass.Models.Filter;
using Compass.Models.Test;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

//using Newtonsoft.Json;
using System.Collections;
using System.Data;
//using static Azure.Core.HttpHeader;
//using DocumentFormat.OpenXml.Spreadsheet;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using wfms_ddl;


namespace Compass.Repositories
{
    public class HardwareDropdownRepository : IHardwareDropdownRepository
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        private readonly string _connectionString;
        public HardwareDropdownRepository(ISqlDataAccess db, IMemoryCache cache, IConfiguration configuration)
        {
            _cn = db;
            _cache = cache;
            _connectionString = configuration.GetConnectionString("TestConnection");
        }



        public async Task<List<DropdownElement>> GetMainCategoryDdlAsync(
            int id,
            string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@Id", id);
            //parameters.Add("@MainCatgId", "0");
            parameters.Add("@SearchTerm", searchTerm);
            //DataTable dt  =  async _cn.ExecuteNonQueryWMessage(
            //       "SP_GetMainCategoryDropdown",
            //       "",
            //       parameters
            //   ) ;
            //var result= CommonMethod.ToList(dt);
            //return result;

            var dt = await _cn.FillDataTableAsync(
                    "PiMainCategory_listC",
                    "",
                    parameters
                );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // company ddl
        public async Task<List<DropdownElement>> GetCompanyDdlAsync(
           int id,
           string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@Id", id);

            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwareCompany_ddlC",
                    "",
                    parameters
                );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // Bill for Pbg ddl
        public async Task<List<DropdownElement>> GetBillForPbgDdlAsync(
           int id,
           string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@Id", id);

            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwareCompany_ddlC",
                    "",
                    parameters
                );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // Pbg Purchase Order No. ddl
        public async Task<List<DropdownElement>> GetPbgPOrderNoDdlAsync(
           int id,
           string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@AgencyId", id);

            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwarePurchaseNo_ddlC",
                    "",
                    parameters
                );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }

        // Term And Condition ddl
        public async Task<List<DropdownElement>> GetTermConditionDdlAsync(
           int id,
           string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@TrCatgId", id);

            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwareTermCatg_DdlC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // Add Term Type ddl
        public async Task<List<DropdownElement>> GetTermTypeConditionDdlAsync(
           int id,
           string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@TypeId", id);

            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwareTermType_ddlC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // Agency ddl
        public async Task<List<DropdownElement>> GetAgencyDdlAsync(
          int id,
          string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@AgencyId", id);

            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwareAgencyList_ddlC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // get Product Name ddl
        public async Task<List<DropdownElement>> GetProductDdlAsync(
          int id, int MainCatgId,
          string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@ProductNameId", id);
            parameters.Add("@MainCatgId", MainCatgId);

            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwareProductList_ddlC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // get Department Name ddl
        public async Task<List<DropdownElement>> GetDepartmentDdlAsync(
          int id, int MainCatgId,
          string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@DeptId", id);
            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwareDepartmentList_ddlC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // get Pi Ref No. ddl
        public async Task<List<DropdownElement>> GetPiRefNoDdlAsync(
          int id, int MainCatgId,
          string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@Deptid", MainCatgId);
            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwarePi_DllC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // get Billing Address ddl
        public async Task<List<DropdownElement>> GetBillingAddressPISaleDdlAsync(
          int id, int MainCatgId,
          string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@BillingAddressId", id);
            parameters.Add("@DeptId", id);
            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwareBillingAddress_ddlNewC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // get Billing Address ddl
        public async Task<List<DropdownElement>> GetBillingAddressDdlAsync(
         int id, int ParentId,
         string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@DeptId", ParentId);
            parameters.Add("@BillingAddressId", id);
            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwareBillingAddress_ddlC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }

        // get Districts Name ddl
        public async Task<List<DropdownElement>> GetDistrictDdlAsync(
          int DistrictId, int StateId,
          string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@DistrictID", DistrictId);
            parameters.Add("@StateId", 13);

            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwareDistrict_ddlC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // get Product Name With Model No. ddl
        public async Task<List<DropdownElement>> GetProductNameWithModelDdlAsync(
         int Id, int ParentId1, int ParentId2, int ParentId3, string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@MainCategoryId", ParentId1);
            parameters.Add("@PCategoryId", ParentId2);
            parameters.Add("@CompanyId", ParentId3);

            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwareProductCompanyWise_list__ddlC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }

        // get Bank Name ddl
        public async Task<List<DropdownElement>> GetBankDdlAsync(
          int Id, int MainCatgId,
          string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@BankId", Id);
            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HpsedcBan_kDdlC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // get Query Type ddl
        public async Task<List<DropdownElement>> GetQueryTypeDdlAsync(
         int Id, int MainCatgId,
         string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@QueryId", Id);
            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwareQueryddlC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // get Payment mode ddl
        public async Task<List<DropdownElement>> GetPaymentModeDdlAsync(
         int Id, int MainCatgId,
         string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@Id", Id);
            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HpsedcPaymentmode_Ddl",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // get Consignee Name ddl
        public async Task<List<DropdownElement>> GetConsigneeDdlAsync(
          int id,
          string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@PurchaseOrderId", id);

            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    //"HardwareDeliveryAddress_ddlC",
                    "HardwareDeliveryAddress_List2DDLC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }
        // get Billing AddressPI ddl
        public async Task<List<DropdownElement>> GetBillingAddressPIDdlAsync(
         int id, int ParentId,
         string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@DeptId", ParentId);
            parameters.Add("@BillingAddressId", id);
            parameters.Add("@SearchTerm", searchTerm);


            var dt = await _cn.FillDataTableAsync(
                    "HardwareBillingAddress_ddlC",
                    "",
                    parameters
            );


            var result = CommonNew.ToList<DropdownElement>(dt);
            return result;
        }


    }
}
