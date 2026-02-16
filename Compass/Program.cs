using Compass.Repositories;
using Microsoft.AspNetCore.Authentication.Cookies;
using wfms_ddl;

var builder = WebApplication.CreateBuilder(args);
// Force camelCase JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// Add services to the container.

// Read from configuration directly
var authExpiryMinutes = builder.Configuration.GetValue<int>("AppSettings:AuthExpiryMinutes");
builder.Services.AddDistributedMemoryCache();
builder.Services.AddControllersWithViews();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<ISqlDataAccess>(sp =>
    new SqlDataAccess(builder.Configuration.GetConnectionString("TestConnection")!));
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(authExpiryMinutes); ;
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login"; // Login page
        options.LogoutPath = "/Account/Logout";
        options.ExpireTimeSpan = TimeSpan.FromMinutes(authExpiryMinutes);
        options.SlidingExpiration = true;
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict;
        options.Cookie.SecurePolicy = Microsoft.AspNetCore.Http.CookieSecurePolicy.Always;
        options.Cookie.Name = "__Host-COMPASSAuth";
        options.Cookie.Path = "/";
    });

var app = builder.Build();
app.UseStaticFiles();
app.UseRouting();
// Rotative Pdv view
Rotativa.AspNetCore.RotativaConfiguration.Setup(
    builder.Environment.WebRootPath,
    "Rotativa"
);
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession();
app.UseAuthentication();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.Run();
