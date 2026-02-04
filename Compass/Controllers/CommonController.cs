using ClosedXML.Excel;
using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System.Collections;
using System.Data;
using System.Text;
using System.Text.Json;
using wfms_ddl;
using Compass.Classes;

namespace Compass.Controllers
{
    public class CommonController : Controller
    {
        private readonly ISqlDataAccess _db;
        private readonly IMemoryCache _cache;
        public CommonController(ISqlDataAccess db, IMemoryCache cache)
        {
            _db = db;
            _cache = cache;
        }
        public async Task<IActionResult> GetCountries()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.CountryDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpCountryddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.CountryDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetCircle(int countryId = 1)
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;

                SortedList parameters = new SortedList();
                parameters.Add("@CountryId", countryId);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpCircleddl", qry: "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return NotFound("No Role found.");

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetLocation(int circleId = 5)
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;

                SortedList parameters = new SortedList();
                parameters.Add("@CircleId", circleId);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpEmployeeLocationddl", qry: "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return NotFound("No Role found.");

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetDepartments()
        {
            try
            {
                // Declare variable outside TryGetValue to avoid nullable warning
                List<Dictionary<string, object>> departments;

                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.DepartmentList, out departments))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpDepartmentddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    departments = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.DepartmentList, departments, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(departments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching department.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetTravalModeType()
        {
            try
            {
                if (!_cache.TryGetValue(CacheKey.TravalModeList, out List<Dictionary<string, object>>? dropdown_list))
                {
                    var dt = await _db.FillDataTableAsync(procName: "stpTravalModeType", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Cache it
                    _cache.Set(CacheKey.TravalModeList, dropdown_list, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    });
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Traval Mode.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetManualConveyance()
        {
            try
            {
                // Check if data exists in cache
                if (!_cache.TryGetValue(CacheKey.ManualConveyanceList, out List<Dictionary<string, object>>? dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpModeManualddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.ManualConveyanceList, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Manual Conveyance.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetBranchList()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;

                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.BranchList, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpCostCenterddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.BranchList, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Branch.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetDesignationList()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;

                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.DesignationList, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpDesignationddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.DesignationList, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Designation.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetShiftgroupList()
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;

                if (!_cache.TryGetValue(CacheKey.ShiftgroupList, out dropdown_list))
                {
                    var dt = await _db.FillDataTableAsync(procName: "stpShiftddl", qry: "", parameters: null);

                    dropdown_list = CommonMethod.ToList(dt);

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration 
                    };

                    _cache.Set(CacheKey.ShiftgroupList, dropdown_list, cacheOptions);
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Designation.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetgroupList()
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;

                if (!_cache.TryGetValue(CacheKey.GetgroupList, out dropdown_list))
                {
                    var dt = await _db.FillDataTableAsync(procName: "stpShiftGroupddl", qry: "", parameters: null);

                    dropdown_list = CommonMethod.ToList(dt);

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    };

                    _cache.Set(CacheKey.GetgroupList, dropdown_list, cacheOptions);
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Designation.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetEmployeeTypeList()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;

                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.EmployeeType, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpEmployeeTypeddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.EmployeeType, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching EmployeeType.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetGradeList()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;

                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.Grade, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpGradeddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.Grade, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Grade.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetEmployeeCategoryList()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.EmployeeCategory, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpEmployeeCategoryddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.EmployeeCategory, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching EmployeeCategory.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetUserRoleList()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.RoleDropdown, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpUserRoleddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.RoleDropdown, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetEmployeeStatusList()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.EmployeeStatus, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpEmployeeStatusddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.EmployeeStatus, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetMartialStatusList()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.MartialStatus, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpMaritalStatusddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.MartialStatus, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetStateByCountry(int countryId)
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@CountryId", countryId);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpStateddlByCountryId", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetDistrictByState(int stateId)
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@StateId", stateId);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpDistrictddl", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetCityByState(int stateId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@StateId", stateId);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpCityddl", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching City.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetSubdivisionByCity(int cityid)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@cityID", cityid);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpSubDiv_ddl", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Sub Division.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetGender()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.GenderDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpGenderddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.GenderDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching City.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetBloodGroup()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.BloodDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpBloodGroupddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.BloodDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Blood.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetRelation()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.RelationDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpRelationddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.RelationDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Relation.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetBank()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.BankDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpBankddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.BankDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Bank.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> ReportingManager()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.ReportingManagerDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpCustomerReportingManagerddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.ReportingManagerDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Relation.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetLocationByCircle(int circleId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@CircleId", circleId);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpEmployeeLocationddl", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetSubLocationByLocation(int locationId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@LocationId", locationId);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpSubLocationddl", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetCustomers()

        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.CustomerDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpCustomerddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.CustomerDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Relation.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetContactor()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.SupplierDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stphtisContactorList", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.SupplierDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Relation.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> BillingAddressDDL(int customerId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@Id", customerId);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpCustomerBillAddressddl", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> ShippingAddressDDL(int customerId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@Id", customerId);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpCustomerShippingAddressddl", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> ShipingBillAddressDetail(int circleId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@CircileID", circleId);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpHTISCircle_Address", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> SaleOrderTypeDDL()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.SaleOrderTypeDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpSaleOrderTypeddl", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.SaleOrderTypeDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Relation.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> BillingAddressDetails(int Id)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@Id", Id);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpBillAddressDeatil", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> ShippingAddressDetail(int Id)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@Id", Id);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpShippingAddressDeatil", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> DelieveryDDL()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.DelieveryDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "StpDeliveryMethodSelect", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.DelieveryDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Relation.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetMainCategory()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.MainCategoryDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpMainCategoryddl", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Main Category found.");

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.MainCategoryDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Main Category",
                    error = ex.Message
                });
            }
        }

        public IActionResult _ImportFile(IFormFile ExcelFile)
        {
            if (ExcelFile == null || ExcelFile.Length == 0)
                return Json("Error: Please select file");

            // Needed for ExcelDataReader
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            DataTable dataTable;
            using (var stream = ExcelFile.OpenReadStream())
            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
                var result = reader.AsDataSet(new ExcelDataSetConfiguration()
                {
                    ConfigureDataTable = (_) => new ExcelDataTableConfiguration() { UseHeaderRow = true }
                });
                dataTable = result.Tables[0];
            }

            // Clean/convert nulls
            foreach (DataRow row in dataTable.Rows)
            {
                foreach (DataColumn col in dataTable.Columns)
                {
                    if (row[col] == DBNull.Value || string.IsNullOrWhiteSpace(row[col].ToString()))
                        row[col] = "0"; // or "" depending on column type
                }
            }

            // Convert DataTable to JSON string
            var json = JsonConvert.SerializeObject(dataTable);

            return Json(json);
        }


        [HttpPost]
        public IActionResult _PreviewExcelFile(IFormFile excelFile)
        {
            if (excelFile == null || excelFile.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                using (var stream = excelFile.OpenReadStream())
                using (var workbook = new ClosedXML.Excel.XLWorkbook(stream))
                {
                    var ws = workbook.Worksheet(1); // first sheet
                    var dt = new DataTable();
                    bool firstRow = true;

                    foreach (var row in ws.RowsUsed())
                    {
                        if (firstRow)
                        {
                            foreach (var cell in row.Cells())
                                dt.Columns.Add(cell.GetValue<string>().Trim());
                            firstRow = false;
                        }
                        else
                        {
                            var rowValues = row.Cells().Select(c => c.GetValue<string>().Trim()).ToArray();
                            dt.Rows.Add(rowValues);
                        }
                    }

                    var list = dt.AsEnumerable()
                                 .Select(r => dt.Columns.Cast<DataColumn>()
                                 .ToDictionary(c => c.ColumnName, c => r[c].ToString()))
                                 .ToList();

                    return Json(list);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Error reading Excel file: " + ex.Message);
            }
        }



        [HttpPost]
        public IActionResult ExportExcel([FromForm] string columnsJson)
        {
            if (string.IsNullOrEmpty(columnsJson))
                return BadRequest("No columns sent.");

            // Deserialize column names sent from jQuery
            var columnsToExport = JsonConvert.DeserializeObject<List<string>>(columnsJson);

            if (columnsToExport == null || columnsToExport.Count == 0)
                return BadRequest("Invalid columns data.");

            // Create DataTable dynamically (no rows)
            DataTable dt = new DataTable();
            foreach (var col in columnsToExport)
            {
                dt.Columns.Add(col, typeof(string)); // All string for simplicity
            }

            // Create Excel workbook
            using (var wb = new XLWorkbook())
            {
                var ws = wb.Worksheets.Add(dt, "Sheet1");

                // Bold header row
                ws.Row(1).Style.Font.Bold = true;

                // Auto-fit all columns
                ws.Columns().AdjustToContents();

                // Save workbook to MemoryStream
                using (var stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    stream.Position = 0;

                    // Generate dynamic file name with timestamp
                    string date = DateTime.UtcNow.AddMinutes(330).ToString("yyyyMMdd_HHmm");
                    string fileName = "DynamicExcel_" + date + ".xlsx";

                    // Return file for download
                    return File(
                        stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName
                    );
                }
            }
        }

        public FileResult ExportDataTableToExcel(DataTable dt, string filePrefix)
        {
            using (var wb = new XLWorkbook())
            {
                var ws = wb.Worksheets.Add(dt, "Sheet1");
                ws.Row(1).Style.Font.Bold = true;
                ws.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    stream.Position = 0;

                    string date = DateTime.Now.ToString("yyyyMMdd_HHmm");
                    string fileName = $"{filePrefix}_{date}.xlsx";

                    return new FileContentResult(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    {
                        FileDownloadName = fileName
                    };
                }
            }
        }

        public class ExportRequest
        {
            public string SpName { get; set; }
            public string FilePrefix { get; set; }
            public Dictionary<string, object> Parameters { get; set; }
        }

        [HttpPost]
        public IActionResult ExportFromSP([FromBody] ExportRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.SpName))
                return BadRequest("Invalid export request.");

            SortedList paramList = new SortedList();

            if (request.Parameters != null)
            {
                foreach (var p in request.Parameters)
                {
                    object val = p.Value;

                    // Convert JsonElement to actual types
                    if (val is JsonElement je)
                    {
                        switch (je.ValueKind)
                        {
                            case JsonValueKind.String:
                                val = je.GetString();
                                break;

                            case JsonValueKind.Number:
                                if (je.TryGetInt32(out int iVal))
                                    val = iVal;
                                else if (je.TryGetInt64(out long lVal))
                                    val = lVal;
                                else if (je.TryGetDecimal(out decimal dVal))
                                    val = dVal;
                                break;

                            case JsonValueKind.True:
                            case JsonValueKind.False:
                                val = je.GetBoolean();
                                break;

                            case JsonValueKind.Null:
                            case JsonValueKind.Undefined:
                                val = DBNull.Value;
                                break;
                        }
                    }

                    // Null replacement for SQL
                    if (val == null)
                        val = DBNull.Value;

                    paramList.Add(p.Key, val);
                }
            }

            DataTable dt = _db.FillDataTable(request.SpName, "", paramList);

            if (dt == null || dt.Rows.Count == 0)
                return BadRequest("No records found.");

            return ExportDataTableToExcel(dt, request.FilePrefix);
        }





        public async Task<IActionResult> GetLoanType()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpLoanType_List", qry: "", null);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Loan Type.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetCharges()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpHtisPayChargeddl", qry: "", null);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Charges.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetSection(string SectionId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                SortedList parameters = new SortedList();
                parameters.Add("@Id", SectionId);
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpTDSSectionddl", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Section.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetBranchDDl()
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpBranchddl", qry: "", null);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Branch.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetAllowances()
        {
            try
            {
                SortedList parameters = new SortedList();
                parameters.Add("@ctcType", "A");
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "PayCharges_GetHeadsByCtcType", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Allowances.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetDeductions()
        {
            try
            {
                SortedList parameters = new SortedList();
                parameters.Add("@ctcType", "D");
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "PayCharges_GetHeadsByCtcType", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Deductions.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> SaleProductUnitDDL()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.ProductUnitDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpProductUnit_Select", qry: "", parameters: null);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.ProductUnitDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Relation.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetExpenseType(string Id)
        {
            try
            {
                SortedList parameters = new SortedList();
                parameters.Add("@Id", Id);
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpClaimTypeDdl", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Task.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetTask(string EmpId, string Date)
        {
            try
            {
                SortedList parameters = new SortedList();
                parameters.Add("@EmpId", EmpId);
                parameters.Add("@Date", Date);
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "StpTaskList", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Task.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetExpenseSubType(string typeId)
        {
            try
            {
                SortedList parameters = new SortedList();
                parameters.Add("@typeId", typeId);
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpClaimSubTypeDdl", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Task.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetProjectList()
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpProjectSelect", qry: "", null);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Project.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetSiteList(string ProjectId)
        {
            try
            {
                SortedList parameters = new SortedList();
                parameters.Add("@ProjectId", ProjectId);
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpSiteddl", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Site.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetActivityList()
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpSiteActivityddl", qry: "", null);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Activity.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> BiilingCircleList()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpBillingCircle_ddl", qry: "", null);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> ServiceChargeCategoryList()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpServiceChargesCategory_dll", qry: "", null);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetEmployee()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.EmployeeDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpRecentEmployeesddl", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Employees found.");

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.EmployeeDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Employee",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetRecentEmployee()    
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.RecentEmployeeDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpRecentEmployeesddl", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Employees found.");

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.RecentEmployeeDDL, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Employee",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetEmployeeddlForManagerOrHR()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.EmployeeddlForManagerOrHR, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    SortedList parameters = new SortedList();
                    parameters.Add("@LoginId ", HttpContext.Session.GetString("EmployeeId"));
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpEmployeeddlForManagerOrHR", qry: "", parameters);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Employees found.");

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.EmployeeddlForManagerOrHR, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Employee",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetInjuryTypeList()
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpInjuryType_List", qry: "", null);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Injury Type.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetIncidentTypeList()
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpIncidentType_List", qry: "", null);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Incident Type.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetExternalAgencyList()
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpExternalAgency_List", qry: "", null);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching External Agency.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetInjuredPersonList()
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpInjuredPersonDDl", qry: "", null);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Injured Person.",
                    error = ex.Message
                });
            }
        }


        public async Task<IActionResult> GetLeavetype(string EmpId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
           
                    SortedList parameters = new SortedList();
                    parameters.Add("@EmployeeID", EmpId);
                    parameters.Add("@SessionID", HttpContext.Session.GetString("FsessionId"));
                    var dt = await _db.FillDataTableAsync(procName: "stpLeavetypeddl", qry: "", parameters);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Leave Type found.");

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Leave Type",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetLeaveDaytypeddl()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.LeaveDaytype, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpLeaveDaytypeddl", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Leave day found.");

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.LeaveDaytype, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Leave Day Type",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetstpLeaveDaytypeFordateddl(int LeaveTypeId,string FromDate,int FirstDayTypeId,string ToDate, string EmpId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache

                    SortedList parameters = new SortedList();
                    parameters.Add("@EmployeeID", EmpId);
                    parameters.Add("@SessionID", HttpContext.Session.GetString("FsessionId"));
                    parameters.Add("@LeaveTypeId", LeaveTypeId);
                    parameters.Add("@FromDate", FromDate);
                    parameters.Add("@FirstDayTypeId", FirstDayTypeId);
                    parameters.Add("@ToDate", ToDate);

                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpLeaveDaytypeFordateddl", qry: "", parameters: parameters);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Leave day found.");

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt); 
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Leave Day Type",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetActiveEmployeesddl()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.ActiveEmployee, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpActiveEmployeesddl", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Active Employee found.");

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.ActiveEmployee, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Leave Day Type",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetAmcStatus(string StatusId)
        {
            try
            {
                int amcId = int.TryParse(HttpContext.Session.GetString("AmcId"), out var val) ? val : 0;
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;

                SortedList parameters = new SortedList();
                parameters.Add("@StatusId", StatusId);
                parameters.Add("@AcmSession", amcId);
                var dt = await _db.FillDataTableAsync(procName: "AmcCallStatus_List", qry: "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return NotFound("No Amc Status found.");

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Amc Status",
                    error = ex.Message
                });
            }

        }

        public async Task<IActionResult> GetComplainCategoryList(string PCatgId)
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;

                SortedList parameters = new SortedList();
                parameters.Add("@PCatgId", PCatgId);
                var dt = await _db.FillDataTableAsync(procName: "AmcProbleCategory_List", qry: "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return NotFound("No Complain Category found.");

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Complain Category",
                    error = ex.Message
                });
            }

        }

        public async Task<IActionResult> GetAmcCustomer(string AmcCustomerId)
        {
            try
            {
                int amcId = int.TryParse(HttpContext.Session.GetString("AmcId"), out var val) ? val : 0;
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;

                SortedList parameters = new SortedList();
                parameters.Add("@AmcCustomerId", AmcCustomerId);
                parameters.Add("@AcmSession", amcId);
                var dt = await _db.FillDataTableAsync(procName: "AmcCustomerDetail_Dll", qry: "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return NotFound("No Amc Customer found.");

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Amc Customer",
                    error = ex.Message
                });
            }

        }

        public async Task<IActionResult> GetAmcEngineerCategoryList(string CatgId)
        {
            try
            {
                int amcId = int.TryParse(HttpContext.Session.GetString("AmcId"), out var val) ? val : 0;
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;

                SortedList parameters = new SortedList();
                parameters.Add("@CatgId", CatgId);
                parameters.Add("@AcmSession", amcId);
                var dt = await _db.FillDataTableAsync(procName: "AmcEngineerCatg_List", qry: "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return NotFound("No Amc Status found.");

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Amc Status",
                    error = ex.Message
                });
            }

        }

        public async Task<IActionResult> GetAmcDesignationList(string DesignationId)
        {
            try
            {
                int amcId = int.TryParse(HttpContext.Session.GetString("AmcId"), out var val) ? val : 0;
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;

                SortedList parameters = new SortedList();
                parameters.Add("@DesignationId", DesignationId);
                parameters.Add("@AcmSession", amcId);
                var dt = await _db.FillDataTableAsync(procName: "AmcAmcDesignation_List", qry: "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return NotFound("No Amc Designation found.");

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Amc Designation",
                    error = ex.Message
                });
            }

        }

        public async Task<IActionResult> GetAmcPart(string PartNameId)
        {
            try
            {
                int amcId = int.TryParse(HttpContext.Session.GetString("AmcId"), out var val) ? val : 0;
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;

                SortedList parameters = new SortedList();
                parameters.Add("@PartNameId", PartNameId);
                parameters.Add("@AcmSession", amcId);
                var dt = await _db.FillDataTableAsync(procName: "amcHardwarePart_List", qry: "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return NotFound("No Amc Part found.");

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Amc Part",
                    error = ex.Message
                });
            }

        }

        public async Task<IActionResult> GetAmcList(string AmcId)
        {
            try
            {
                int amcId = int.TryParse(HttpContext.Session.GetString("AmcId"), out var val) ? val : 0;
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;

                SortedList parameters = new SortedList();
                parameters.Add("@AmcId", amcId);
                var dt = await _db.FillDataTableAsync(procName: "AmcDetails_List", qry: "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return NotFound("No Amc found.");

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Amc ",
                    error = ex.Message
                });
            }

        }

        public async Task<IActionResult> GetAmcTypeList()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                int amcId = int.TryParse(HttpContext.Session.GetString("AmcId"), out var val) ? val : 0;
                List<Dictionary<string, object>> dropdown_list;

                SortedList parameters = new SortedList();
                parameters.Add("@AcmSession", amcId);
                var dt = await _db.FillDataTableAsync(procName: "AmcAmcType_List", qry: "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return NotFound("No Amc found.");

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Amc ",
                    error = ex.Message
                });
            }

        }

        public async Task<IActionResult> GetAmcDetails(string AmcId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;

                SortedList parameters = new SortedList();
                parameters.Add("@AmcId", AmcId);
               
                var dt = await _db.FillDataTableAsync(procName: "amcHardwarePart_List", qry: "", parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return NotFound("No Amc Part found.");

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Amc Part",
                    error = ex.Message
                });
            }

        }

        public async Task<IActionResult> GetComplainCatgList(string PCatgId)
        {
            try
            {
                int amcId = int.TryParse(HttpContext.Session.GetString("AmcId"), out var val) ? val : 0;
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@PCatgId", PCatgId);
                parameters.Add("@AcmSession", amcId);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "AmcProbleCategory_List", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Category.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetAssetsTypeList(string PCatgId)
        {
            try
            {
                int amcId = int.TryParse(HttpContext.Session.GetString("AmcId"), out var val) ? val : 0;
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@PCatgId", PCatgId);
                parameters.Add("@AcmSession", amcId);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "AmcAssetsType_List", qry: "", parameters);

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Assets Type.",
                    error = ex.Message
                });
            }
        }


        public async Task<IActionResult> GetLeaveAssignedEmployeeddl(string EmpId)
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache

                SortedList parameters = new SortedList();
                parameters.Add("@EmpID", EmpId);
                // Cache miss → fetch from database
                var dt = await _db.FillDataTableAsync(procName: "stpLeaveAssignedEmployeewise", qry: "", parameters: parameters);

                if (dt == null || dt.Rows.Count == 0)
                    return NotFound("No Leave found.");

                // Convert DataTable to List<Dictionary<string, object>>
                dropdown_list = CommonMethod.ToList(dt);
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Leave Type",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> DomainDDl()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.DomainDDl, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpHiringDomainddl", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Domain found.");

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Set cache with common duration
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration, // e.g., 1 hour
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration // resets if accessed
                    };

                    _cache.Set(CacheKey.DomainDDl, dropdown_list, cacheOptions);
                }

                // Return cached or freshly loaded data
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Domain",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> SubDomainDDl(int domainId=0)
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@DomainId", domainId);
                var dt = await _db.FillDataTableAsync(procName: "stpHiringSubDomainddl", qry: "", parameters);
                dropdown_list = CommonMethod.ToList(dt);
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Sub Domain.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetNoticeBoardBranchddl()
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                var dt = await _db.FillDataTableAsync(procName: "stpNoticeBoardBranchddl", qry: "", null);
                dropdown_list = CommonMethod.ToList(dt);
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Branches.",
                    error = ex.Message
                });
            }
        }


        public async Task<IActionResult> ReportingManagerDDl()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.ReportingManagerDDl, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpReportingManager", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Reporting Manager found.");

                    dropdown_list = CommonMethod.ToList(dt);

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    };

                    _cache.Set(CacheKey.ReportingManagerDDl, dropdown_list, cacheOptions);
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Reporting Manager",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> SkillDDl()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.SkillDDl, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpTechnicalSkillsddl", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Skills found.");

                    dropdown_list = CommonMethod.ToList(dt);

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    };

                    _cache.Set(CacheKey.SkillDDl, dropdown_list, cacheOptions);
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Skills",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> QualificationDDL()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.QualificationDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpEducationQualificationddl", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Qualification found.");

                    dropdown_list = CommonMethod.ToList(dt);

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    };

                    _cache.Set(CacheKey.QualificationDDL, dropdown_list, cacheOptions);
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Qualification",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> PolicyCategoryddl()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.PolicyCategoryDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpPolicyCategoryddl", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Policy Category found.");

                    dropdown_list = CommonMethod.ToList(dt);

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    };

                    _cache.Set(CacheKey.PolicyCategoryDDL, dropdown_list, cacheOptions);
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Policy Category",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> PolicyGradeddl()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.Grade, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpGradeddl", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Grade found.");

                    dropdown_list = CommonMethod.ToList(dt);

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    };

                    _cache.Set(CacheKey.Grade, dropdown_list, cacheOptions);
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Grade",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetBranchByState(string StateId)
        {
            try
            {
                if (!_cache.TryGetValue(CacheKey.BranchList, out List<Dictionary<string, object>>? dropdown_list))
                {
                    SortedList parameters = new SortedList();
                    parameters.Add("@StateId", StateId);

                    var dt = await _db.FillDataTableAsync(procName: "stpSelectBranchByState", qry: "", parameters: parameters);

                    // Convert DataTable to List<Dictionary<string, object>>
                    dropdown_list = CommonMethod.ToList(dt);

                    // Cache it
                    _cache.Set(CacheKey.BranchList, dropdown_list, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    });
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Branch List.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> RecruitmentTeamDDL()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.RecruitmentTeamDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpRecruitmentTeamddl", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Qualification found.");

                    dropdown_list = CommonMethod.ToList(dt);

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    };

                    _cache.Set(CacheKey.RecruitmentTeamDDL, dropdown_list, cacheOptions);
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Qualification",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetRequisitionDesignationList()
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@EmpId", HttpContext.Session.GetString("EmployeeId"));
                var dt = await _db.FillDataTableAsync(procName: "stp_GetRequisitionDesignationList", qry: "", parameters);
                dropdown_list = CommonMethod.ToList(dt);
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Job Title.",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetHRListDDL()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.HRListDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stp_GetHRList", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Qualification found.");

                    dropdown_list = CommonMethod.ToList(dt);

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    };

                    _cache.Set(CacheKey.HRListDDL, dropdown_list, cacheOptions);
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching HR List",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetCustomerforCreateUser(int entityId)
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@EntityId", entityId);
                var dt = await _db.FillDataTableAsync(procName: "stpCustomerforCreateUser", qry: "", parameters);
                dropdown_list = CommonMethod.ToList(dt);
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Customer.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetStateDDL(int countryId)
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@CountryId", countryId);
                var dt = await _db.FillDataTableAsync(procName: "stpState_ddl", qry: "", parameters);
                dropdown_list = CommonMethod.ToList(dt);
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching State.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> EmployeeLocationByCircle(int circleId)
        {
            try
            {
                List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@CircleId", circleId);
                var dt = await _db.FillDataTableAsync(procName: "stpEmployeeLocationByCircle", qry: "", parameters);
                dropdown_list = CommonMethod.ToList(dt);
                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching State.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetRoleDDL()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.RoleDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpRoleddl ", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Role found.");

                    dropdown_list = CommonMethod.ToList(dt);

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    };

                    _cache.Set(CacheKey.RoleDDL, dropdown_list, cacheOptions);
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> GetCustomerEntityddl()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.CustomerEntityddl, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpCustomerEntityddl", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Customer Entity found.");

                    dropdown_list = CommonMethod.ToList(dt);

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    };

                    _cache.Set(CacheKey.CustomerEntityddl, dropdown_list, cacheOptions);
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Role",
                    error = ex.Message
                });
            }
        }


        public async Task<IActionResult> GetDocumentcategoryDDL()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<Dictionary<string, object>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.DocumentcategoryDDL, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    var dt = await _db.FillDataTableAsync(procName: "stpDocumentcategoryList", qry: "", parameters: null);

                    if (dt == null || dt.Rows.Count == 0)
                        return NotFound("No Document Category found.");

                    dropdown_list = CommonMethod.ToList(dt);

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    };

                    _cache.Set(CacheKey.DocumentcategoryDDL, dropdown_list, cacheOptions);
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Document Category List",
                    error = ex.Message
                });
            }
        }
        public async Task<IActionResult> GetDivisionStateCityddl()
        {
            try
            {
                // Declare the variable outside to avoid nullable warning
                List<List<Dictionary<string, object>>> dropdown_list;
                // Try to get from cache
                if (!_cache.TryGetValue(CacheKey.DivisionStateCity, out dropdown_list))
                {
                    // Cache miss → fetch from database
                    DataSet dt = await _db.FillDataSetAsync(procName: "stpViksatDivisionStateCity", qry: "", null);

                    if (dt == null || dt.Tables[3].Rows.Count == 0)
                        return NotFound("No Company Nature found.");

                    dropdown_list = CommonMethod.ToDataSetList(dt);

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheSettings.DropdownCacheDuration,
                        SlidingExpiration = CacheSettings.DropdownSlidingExpiration
                    };

                    _cache.Set(CacheKey.DivisionStateCity, dropdown_list, cacheOptions);
                }

                return Ok(dropdown_list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Company Nature",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> BranchCompanyStateCity(int action)
        {
            try
            {
                //List<Dictionary<string, object>> dropdown_list;
                SortedList parameters = new SortedList();
                parameters.Add("@Action", action);
                DataSet dt = await _db.FillDataSetAsync(procName: "stpViksatBranchCompanyStateCity", qry: "", null);
                if (dt == null || dt.Tables.Count == 0)
                    return NotFound("No Data found.");
                var dropdown_list = CommonMethod.ToDataSetList(dt);
                return Ok(dropdown_list);
        }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Data",
                    error = ex.Message
    });
            }
        }
        public async Task<IActionResult> GetBillsByVendorId(int vendorId)
        {
            try
            {
                SortedList parameters = new SortedList
                {
                    { "@SupplierID", vendorId }
                };

                DataSet ds = await _db.FillDataSetAsync(
                    procName: "usp_GetAllVendorBillByVendor",
                    qry: "",
                    parameters
                );

                // 🔥 GET DATA FROM SECOND TABLE
                var billList = CommonMethod.ToDataTableList(ds.Tables[0]);

                return Ok(billList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching Data",
                    error = ex.Message
                });
            }
        }

    }
}
