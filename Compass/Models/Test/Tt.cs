namespace Compass.Models.Test
{
    public class Tt1
    {
        public int Id { get; set; }
        public string Field1 { get; set; }
        public string Field2 { get; set; }
        public MetaData Meta { get; set; } = new MetaData(); // nested object
    }
    public class Tt1WithFile
    {
        public int Id { get; set; }
        public string Field1 { get; set; }
        public string Field2 { get; set; }
        public string CreatedBy { get; set; }
        public string Notes { get; set; }

        public IFormFile File { get; set; }
    }
    public class MetaData
    {
        public string CreatedBy { get; set; }
        public string Notes { get; set; }
    }
    public class OrderModel
    {
        public string CustomerName { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItemModel> Items { get; set; }
    }

    public class OrderItemModel
    {
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
