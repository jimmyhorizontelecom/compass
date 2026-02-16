namespace Compass.Models
{
    public class User
    {
        public int UserId { get; set; }
        public int DomainId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int Role { get; set; }
        public string DeptId { get; set; } = string.Empty;
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; } = string.Empty;
    }
}
