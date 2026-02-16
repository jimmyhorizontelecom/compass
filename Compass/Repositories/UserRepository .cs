using System.Data;
using System.Security.Cryptography;
using System.Text;
using wfms_ddl;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.Data.SqlClient;
using System.Collections;
using DocumentFormat.OpenXml.Spreadsheet;
using Compass.Models;
using Compass.Repositories;




public class UserRepository : IUserRepository
{
   
    private readonly ISqlDataAccess _db;
    private readonly SqlConnection _cn;
    private readonly string _baseUrl;
    private readonly TimeSpan _authExpiry;

    public UserRepository(ISqlDataAccess db, IConfiguration config)
    {
        _db = db;
        _cn = new SqlConnection(config.GetConnectionString("cnLogin"));
        _baseUrl = config["AppSettings:SiteUrl"];

        var expiryMinutes = config.GetValue<int>("AppSettings:AuthExpiryMinutes");
        _authExpiry = TimeSpan.FromMinutes(expiryMinutes);
    }

    public User? Login(string email, string password)
    {
        try
        {
            var parameters = new SortedList
            {
                   { "@Email", email.Trim() },
                   { "@PassWord", password }
               };

            DataTable dt = _db.FillDataTable("wfms_LoginDetail", "", parameters, _cn);

            if (dt.Columns.Count == 1)
            {
                return new User
                {
                    Success = false,
                    ErrorMessage = "Invalid email or password"
                };

            }

            var row = dt.Rows[0];

           

            string domainName;

            domainName = row["fvWebDomain"].ToString()!;

            var user = new User
            {
                UserId = Convert.ToInt32(row["id"]),
                DomainId = Convert.ToInt32(row["Domainid"]),
                Username = row["EmpName"].ToString()!,
                Role = Convert.ToInt32(row["RollId"]),
                DeptId = row["DeptId"].ToString()!,
                Success =true
            };
            return user;

        }
        catch (Exception ex)
        {
            return new User
            {
                Success = false,
                ErrorMessage =ex.Message
            };
        }
        
    }

    private static string Hash(string input)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToBase64String(bytes);
    }
}
