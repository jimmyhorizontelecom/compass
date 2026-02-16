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
    public class MainCategoryRepository : IMainCategoryRepository
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        private readonly string _connectionString;
        public MainCategoryRepository(ISqlDataAccess db, IMemoryCache cache, IConfiguration configuration)
        {
            _cn = db;
            _cache = cache;
            _connectionString = configuration.GetConnectionString("TestConnection");
        }

       

        public async Task<List<DropdownDto>> GetMainCategoryDropdownAsync(
            int id,
            int mainCatgId,
            string searchTerm)
        {
            var searchParam = new SqlParameter("@SearchTerm",
            string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            SortedList parameters = new SortedList();
            parameters.Add("@Id", id);
            parameters.Add("@MainCatgId", mainCatgId);
            parameters.Add("@SearchTerm", searchTerm);
            //DataTable dt  =  async _cn.ExecuteNonQueryWMessage(
            //       "SP_GetMainCategoryDropdown",
            //       "",
            //       parameters
            //   ) ;
            //var result= CommonMethod.ToList(dt);
            //return result;

            var dt = await _cn.FillDataTableAsync(
                    "SP_GetMainCategoryDropdown",
                    "",
                    parameters
                );

            
            var result = CommonNew.ToList<DropdownDto>(dt);
            return result;
        }

        
        public async Task<List<DropdownDto>> GetDepartmentDropdownAsync(
            int deptId,
            string searchTerm)
        {
            
            SortedList parameters = new SortedList();
            parameters.Add("@DeptId", deptId);
            parameters.Add("@SearchTerm", string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm);
            var dt = await _cn.FillDataTableAsync(
                    "TallyDepartment_Cddl",
                    "",
                    parameters
                );
            if (dt == null || dt.Rows.Count == 0)
                return new List<DropdownDto>();

            var result = CommonNew.ToList<DropdownDto>(dt);
            return result;
        }
    }
}
