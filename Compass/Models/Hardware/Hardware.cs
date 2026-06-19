using DocumentFormat.OpenXml.Office2010.Excel;

namespace Compass.Models.Hardware

{
    public class ProductModal
    {
        
        public int Id { get; set; }
        public string MainCategory { get; set; }
        public string Title { get; set; }
        public char IsActive { get; set; }        
        public string FileName { get; set; }
        public IFormFile File { get; set; }
    }

    public class TestModel
    {
        public int Id { get; set; }
        public string Field1 { get; set; }
        public string Field2 { get; set; }
    }
    public class StudentExcelModel
    {
        public string RollNo { get; set; }
        public string Name { get; set; }
        public string Mobile { get; set; }
        public string Status { get; set; }
    }




}
