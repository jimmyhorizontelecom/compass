using ClosedXML.Excel;
//using ExcelDataReader;
using Compass.Classes;
using Compass.Report.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Rotativa.AspNetCore;
//using Newtonsoft.Json;
using System.Collections;
using System.Data;
//using static Azure.Core.HttpHeader;
//using DocumentFormat.OpenXml.Spreadsheet;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using wfms_ddl;


namespace Compass.Controllers
{
    public class HardwareReportController : Controller
    {
        private readonly ISqlDataAccess _cn;
        private readonly IMemoryCache _cache;
        public HardwareReportController(ISqlDataAccess db, IMemoryCache cache)
        { 
            _cn = db;
            _cache = cache;
        }
        public IActionResult Index()
        {
            return View();
        }
        #region TestReport
        public async Task<IActionResult> ProductReport()
        {
            var dt = await _cn.FillDataTableAsync("HardwareProductategory_List", "", null);

            if (dt == null || dt.Rows.Count == 0)
            {
                return View(new List<ProductReportVM>());
            }

            var list = CommonNew.ToList<ProductReportVM>(dt);

            return View(list ?? new List<ProductReportVM>());
        }

        public async Task<IActionResult> ProductReportPdf()
        {
            var dt = await _cn.FillDataTableAsync("HardwareProductategory_List", "", null);
            var list = CommonNew.ToList<ProductReportVM>(dt);

            return new ViewAsPdf("ProductReport", list ?? new List<ProductReportVM>());
        }
        // Excel Export
        public async Task<IActionResult> ExportToExcel()
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Report");

            // ===== Header =====
            ////https://localhost:7080/HardwareReport/ExportToExcel
           
            
            //worksheet.Cell("A1").InsertRowsAbove(1);
            worksheet.Cell("A1").Value = "Hardware Product Report";
            worksheet.Range("A1:B1").Merge();
            worksheet.Range("A1:B1").Style.Font.Bold = true;
            worksheet.Range("A1:B1").Style.Font.FontSize = 16;
            worksheet.Range("A1:B1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            worksheet.Cell(2, 1).Value = "Category";
            worksheet.Cell(2, 2).Value = "Title";
            var headerRange = worksheet.Range("A2:B2");
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Font.FontColor = XLColor.White;
            headerRange.Style.Fill.BackgroundColor = XLColor.DarkBlue;
            headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            headerRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            headerRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

            // ===== Fetch Data =====
            var dt = await _cn.FillDataTableAsync("HardwareProductategory_List", "", null);
            var list = CommonNew.ToList<ProductReportVM>(dt);

            int row = 3;

            foreach (var item in list)
            {
                worksheet.Cell(row, 1).Value = item.MainCategory;
                worksheet.Cell(row, 2).Value = item.Title;
                row++;
            }

            // ===== Apply Borders to Data =====
            var dataRange = worksheet.Range(1, 1, row - 1, 2);
            dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            dataRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

            // ===== Auto Adjust Columns =====
            worksheet.Columns().AdjustToContents();

            // ===== Freeze Header Row =====
            worksheet.SheetView.FreezeRows(1);

            // ===== Optional: Convert to Table Style =====
            var table = worksheet.Range(1, 1, row - 1, 2).CreateTable();
            table.Theme = XLTableTheme.TableStyleMedium2;

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);

            return File(stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Report.xlsx");
        }


        #endregion
    }
}
