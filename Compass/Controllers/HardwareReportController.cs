using ClosedXML.Excel;
//using ExcelDataReader;
using Compass.Classes;
using Compass.Models.ManpowerViewModel;
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
using Compass.Models.Test;


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
        //public async Task<IActionResult> ProductReport()
        //{
        //    var dt = await _cn.FillDataTableAsync("HardwareProductategory_List", "", null);

        //    if (dt == null || dt.Rows.Count == 0)
        //    {
        //        return View(new List<ProductReportVM>());
        //    }

        //    var list = CommonNew.ToList<ProductReportVM>(dt);

        //    return View(list ?? new List<ProductReportVM>());
        //}

        //public async Task<IActionResult> ProductReportPdf()
        //{
        //    var dt = await _cn.FillDataTableAsync("HardwareProductategory_List", "", null);
        //    var list = CommonNew.ToList<ProductReportVM>(dt);

        //    return new ViewAsPdf("ProductReport", list ?? new List<ProductReportVM>());
        //}
        //// Excel Export
        //public async Task<IActionResult> ExportToExcel()
        //{
        //    using var workbook = new XLWorkbook();
        //    var worksheet = workbook.Worksheets.Add("Report");

        //    // ===== Header =====
        //    ////https://localhost:7080/HardwareReport/ExportToExcel
           
            
        //    //worksheet.Cell("A1").InsertRowsAbove(1);
        //    worksheet.Cell("A1").Value = "Hardware Product Report";
        //    worksheet.Range("A1:B1").Merge();
        //    worksheet.Range("A1:B1").Style.Font.Bold = true;
        //    worksheet.Range("A1:B1").Style.Font.FontSize = 16;
        //    worksheet.Range("A1:B1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        //    worksheet.Cell(2, 1).Value = "Category";
        //    worksheet.Cell(2, 2).Value = "Title";
        //    var headerRange = worksheet.Range("A2:B2");
        //    headerRange.Style.Font.Bold = true;
        //    headerRange.Style.Font.FontColor = XLColor.White;
        //    headerRange.Style.Fill.BackgroundColor = XLColor.DarkBlue;
        //    headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        //    headerRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
        //    headerRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

        //    // ===== Fetch Data =====
        //    var dt = await _cn.FillDataTableAsync("HardwareProductategory_List", "", null);
        //    var list = CommonNew.ToList<ProductReportVM>(dt);

        //    int row = 3;

        //    foreach (var item in list)
        //    {
        //        worksheet.Cell(row, 1).Value = item.MainCategory;
        //        worksheet.Cell(row, 2).Value = item.Title;
        //        row++;
        //    }

        //    // ===== Apply Borders to Data =====
        //    var dataRange = worksheet.Range(1, 1, row - 1, 2);
        //    dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
        //    dataRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

        //    // ===== Auto Adjust Columns =====
        //    worksheet.Columns().AdjustToContents();

        //    // ===== Freeze Header Row =====
        //    worksheet.SheetView.FreezeRows(1);

        //    // ===== Optional: Convert to Table Style =====
        //    var table = worksheet.Range(1, 1, row - 1, 2).CreateTable();
        //    table.Theme = XLTableTheme.TableStyleMedium2;

        //    using var stream = new MemoryStream();
        //    workbook.SaveAs(stream);

        //    return File(stream.ToArray(),
        //        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //        "Report.xlsx");
        //}


        #endregion


        #region Tax Invoice
        public async Task<IActionResult> TaxInvoice()
        {
            var dt = await _cn.FillDataTableAsync("HardwareProductategory_List", "", null);

            if (dt == null || dt.Rows.Count == 0)
            {
                return View(new List<ProductReportVM>());
            }

            var list = CommonNew.ToList<ProductReportVM>(dt);

            return View(list ?? new List<ProductReportVM>());
        }
        // Pdf Export
        public async Task<IActionResult> TaxInvoicePdf()
        {
            var dt = await _cn.FillDataTableAsync("HardwareProductategory_List", "", null);
            var list = CommonNew.ToList<ProductReportVM>(dt);

            return new ViewAsPdf("TaxInvoice", list ?? new List<ProductReportVM>());
        }






        #endregion


        #region Department Invoice
        //public async Task<IActionResult> DepartmentInvoice()
        //{
        //    var dt = await _cn.FillDataTableAsync("TallyHpsedcDepartmentInvoice", "", null);

        //    if (dt == null || dt.Rows.Count == 0)
        //    {
        //        return View(new List<DeptInvoiceReportVM>());
        //    }

        //    var list = CommonNew.ToList<DeptInvoiceReportVM>(dt);

        //    return View(list ?? new List<DeptInvoiceReportVM>());
        //}
        public async Task<IActionResult> DepartmentInvoice([FromQuery] PInvoiceFilter filter)
        {
            SortedList parameters = new SortedList();
            parameters.Add("@DeptBillId", 0);
            parameters.Add("@AgencyBillId", filter.Id);
            


            var dt = await _cn.FillDataTableAsync("TallyHpsedcDepartmentInvoice", "", parameters);

            if (dt == null || dt.Rows.Count == 0)
            {
                return View(new DeptInvoiceReportVM()); // send empty object
            }

            var list = CommonNew.ToList<DeptInvoiceReportVM>(dt);

            //return View(list ?? new List<DeptInvoiceReportVM>());
            return View(list.FirstOrDefault()); // ✅ send single record
        }
        // Pdf Export
        //public async Task<IActionResult> DepartmentInvoicePdf()
        //{
        //    var dt = await _cn.FillDataTableAsync("TallyHpsedcDepartmentInvoice", "", null);
        //    var list = CommonNew.ToList<DeptInvoiceReportVM>(dt);

        //    return new ViewAsPdf("DepartmentInvoice", list ?? new List<DeptInvoiceReportVM>());
        //}






        #endregion


        #region MukeshSir Excel files
        public IActionResult DownloadFormat()
        {
            using var workbook = new XLWorkbook();

            var masterSheet = workbook.Worksheets.Add("Master");

            masterSheet.Cell("A1").Value = "Designation";
            masterSheet.Cell("A2").Value = "HR";
            masterSheet.Cell("A3").Value = "Accounts";
            masterSheet.Columns().AdjustToContents();

            var dataSheet = workbook.Worksheets.Add("Template");

            dataSheet.Cell("A1").Value = "RollNo";
            dataSheet.Cell("B1").Value = "Name";
            dataSheet.Cell("C1").Value = "Mobile";
            dataSheet.Cell("D1").Value = "Department";
            dataSheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();

            workbook.SaveAs(stream);

            return File(
                stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "StudentUploadFormat.xlsx");
        }


        public async Task<IActionResult> ReadExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file selected.");

            List<StudentExcelModel> list = new();

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                stream.Position = 0;

                using (var workbook = new XLWorkbook(stream))
                {
                    var worksheet = workbook.Worksheet(1);

                    var rows = worksheet.RowsUsed().Skip(1);
                    var totalRows = worksheet.RowsUsed().Count();

                    foreach (var row in rows)
                    {
                        list.Add(new StudentExcelModel
                        {
                            RollNo = row.Cell(1).Value.ToString(),
                            Name = row.Cell(2).Value.ToString(),
                            Mobile = row.Cell(3).Value.ToString(),
                            Status = ""
                        });
                    }
                }
            }

            return Ok(list);
        }
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
