

namespace Compass.Repositories
{
    public interface IUserRepository
    {
        Models.User? Login(string username, string password);
    }
}
