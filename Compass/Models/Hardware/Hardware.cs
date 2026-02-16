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
}
