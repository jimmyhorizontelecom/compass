using Microsoft.AspNetCore.Mvc.Rendering;
using System.Security.Cryptography;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.RegularExpressions;
using System.Threading.Tasks;


namespace Compass.Models
{

    public class AppCommonMethod
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        HtmlEncoder _htmlEncoder;
        JavaScriptEncoder _javaScriptEncoder;
        UrlEncoder _urlEncoder;
        private static Random random = new Random();

        public AppCommonMethod(IHttpContextAccessor httpContextAccessor, HtmlEncoder htmlEncoder, JavaScriptEncoder javaScriptEncoder, UrlEncoder urlEncoder)
        {
            this._httpContextAccessor = httpContextAccessor;


            _htmlEncoder = htmlEncoder;
            _javaScriptEncoder = javaScriptEncoder;
            _urlEncoder = urlEncoder;

        }
        public string GenerateOTP(int NoOfDigit)
        {
            try
            {
                var chars = "0123456789";
                var stringChars = new char[NoOfDigit];
                var random = new Random();

                for (int i = 0; i < stringChars.Length; i++)
                {
                    stringChars[i] = chars[random.Next(chars.Length)];
                }

                var finalString = new String(stringChars);
                return finalString.ToLower();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        
        public string EncryptMD5(string input)
        {
            StringBuilder hash = new StringBuilder();
            MD5CryptoServiceProvider md5provider = new MD5CryptoServiceProvider();
            byte[] bytes = md5provider.ComputeHash(new UTF8Encoding().GetBytes(input));
            int Len = bytes.Length;
            for (int i = 0; i < Len; i++)
            {
                hash.Append(bytes[i].ToString("x2"));
            }
            return hash.ToString();

        }
        public string DecryptMD5(string input)
        {
            StringBuilder hash = new StringBuilder();
            MD5CryptoServiceProvider md5provider = new MD5CryptoServiceProvider();
            UTF8Encoding encoder = new UTF8Encoding();
            byte[] bytes = md5provider.ComputeHash(encoder.GetBytes(input));
            string sa = UTF8Encoding.UTF8.GetString(bytes);

            return sa;
        }
        public string CheckZero(string val)
        {
            return val == "0" ? null : val;
        }
        public string CheckIsNullOrEmpty(string val)
        {
            return (string.IsNullOrEmpty(val)) ? null : val;
        }
        public dynamic CheckFileSize(IFormFile file)
        {
            var Result = (dynamic)null;
            string FileName = "";
            var extension2 = Path.GetExtension(file.FileName);
            FileName = file.FileName.Replace(' ', '_').Replace('.', '_') + "-" + DateTime.Now.Year + "-" + DateTime.Now.ToString("MMM") + "-" + DateTime.Now.ToString("dd") + "-" + DateTime.Now.ToString("HH") + "-" + DateTime.Now.Minute + "-" + DateTime.Now.Second + extension2;
            var ext = file.ContentType;
            var extension = Path.GetExtension(file.FileName);
            var size = file.Length;
            var cr = file.ContentType;
            if (cr == "application/pdf")
            {
                if (extension.ToLower() == ".pdf")
                {
                    if (size > (200 * 1024 * 1024))
                    {
                        Result = new
                        {
                            result = "File size should be less than or equal to 200MB.",
                            status = false,

                        };

                    }
                    else
                    {
                        Result = new
                        {
                            result = FileName,
                            status = true,

                        };

                    }
                }
            }
            else
            {
                Result = new
                {
                    result = "file must be in pdf formate.",
                    status = false,

                };
            }

            return Result;
        }
        public dynamic CheckFileSizeAllExtention(IFormFile file)
        {
            var Result = (dynamic)null;
            string FileName = "";
            var extension2 = Path.GetExtension(file.FileName);
            FileName = file.FileName.Replace(' ', '_').Replace('.', '_') + "-" + DateTime.Now.Year + "-" + DateTime.Now.ToString("MMM") + "-" + DateTime.Now.ToString("dd") + "-" + DateTime.Now.ToString("HH") + "-" + DateTime.Now.Minute + "-" + DateTime.Now.Second + extension2;
            var ext = file.ContentType;
            var extension = Path.GetExtension(file.FileName);
            var size = file.Length;
            var cr = file.ContentType;

            if (size > (200 * 1024 * 1024))
            {
                Result = new
                {
                    result = "File size should be less than or equal to 200MB.",
                    status = false,
                };
            }
            else
            {
                Result = new
                {
                    result = FileName,
                    status = true,

                };

            }

            return Result;
        }

        public dynamic CheckFileSizeAllExtention2(IFormFile file)
        {
            var Result = (dynamic)null;
            string FileName = "";
            var extension2 = Path.GetExtension(file.FileName);
            FileName = file.FileName;//file.FileName.Replace(' ', '_').Replace('.', '_') + "-" + DateTime.Now.Year + "-" + DateTime.Now.ToString("MMM") + "-" + DateTime.Now.ToString("dd") + "-" + DateTime.Now.ToString("HH") + "-" + DateTime.Now.Minute + "-" + DateTime.Now.Second + extension2;
            var ext = file.ContentType;
            var extension = Path.GetExtension(file.FileName);
            var size = file.Length;
            var cr = file.ContentType;

            if (size > (200 * 1024 * 1024))
            {
                Result = new
                {
                    result = "File size should be less than or equal to 200 MB.",
                    status = false,
                };
            }
            else
            {
                Result = new
                {
                    result = FileName,
                    status = true,

                };

            }

            return Result;
        }
        public void FileSave(string WebRootPath, IFormFile file, string FolderNamePath, string FileName)
        {


            string RootFolderPath = Path.Combine(WebRootPath, FolderNamePath);
            if (!Directory.Exists(RootFolderPath))
            {
                Directory.CreateDirectory(RootFolderPath);
            }
            string FilePath = Path.Combine(RootFolderPath, FileName);
            using (var stream = new FileStream(FilePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
        }
        public bool FileDelete(string WebRootPath, string FolderNamePath)
        {
            try
            {
                string RootFolderPath = Path.Combine(WebRootPath, FolderNamePath);
                if (File.Exists(RootFolderPath))
                {
                    File.Delete(Path.Combine(WebRootPath, FolderNamePath));
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ee)
            {
                return false;
            }
        }
        public static string getDate(DateTime date)
        {
            string time = "";
            try
            {
                string DateIsNullFind = date.ToString() == "01-01-0001 00:00:00" ? null : "DateIsNullFind";
                if (DateIsNullFind == null)
                {
                    return "";
                }
                int TotalMinutes = 0;
                int TotalHours = 0;
                int TotalDays = 0;

                DateTime currentDate = DateTime.Now;
                DateTime dt = date;
                TimeSpan subtrat = currentDate.Subtract(dt);

                double TH = Math.Truncate(subtrat.TotalHours);
                double TD = Math.Truncate(subtrat.TotalDays);

                TotalMinutes = Convert.ToInt32(subtrat.TotalMinutes);
                TotalHours = Convert.ToInt32(TH);
                TotalDays = Convert.ToInt32(TD);
                if (TotalMinutes == 0)
                    time = "Just Now";
                else if (TotalMinutes > 0 && TotalHours == 0)
                    time = TotalMinutes + (TotalMinutes > 1 ? " Minutes " : "Minute ");
                else if (TotalHours > 0 && TotalDays == 0)
                    time = TotalHours + (TotalHours > 1 ? " Hours " : "Hour ");
                else
                    time = TotalDays + (TotalDays > 1 ? " Days " : "Day ");

            }
            catch (Exception ee)
            {
                return "ex : 1";
            }
            return time;
        }
        public static string Encrypt(string clearText)
        {
            string EncryptionKey = "PreviewTechLucknowSandip";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    clearText = Convert.ToBase64String(ms.ToArray());
                }
            }
            return clearText;
        }
        public static string Decrypt(string cipherText)
        {
            string EncryptionKey = "PreviewTechLucknowSandip";
            //string converted = base64String.Replace('-', '+');
            //converted = converted.Replace('_', '/');
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }
            return cipherText;
        }
        public string CookieGet(string key)
        {
            string value = _httpContextAccessor.HttpContext.Request.Cookies[key];
            return value;
        }
        
        public static string EncryptString(string plainText)
        {
            string publicKey = "dd5ab1f23402840695129e7ab2ef9108";
            byte[] iv = new byte[16];
            byte[] array;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(publicKey);
                aes.IV = iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter((Stream)cryptoStream))
                        {
                            streamWriter.Write(plainText);
                        }

                        array = memoryStream.ToArray();
                    }
                }
            }

            return Convert.ToBase64String(array).Replace('+', '$').Replace('/', '^');
        }
        public static string DecryptString(string cipherText)
        {
            string publicKey = "dd5ab1f23402840695129e7ab2ef9108";
            try
            {
                byte[] iv = new byte[16];
                byte[] buffer = Convert.FromBase64String(cipherText.Replace('$', '+').Replace('^', '/'));

                using (Aes aes = Aes.Create())
                {
                    aes.Key = Encoding.UTF8.GetBytes(publicKey);
                    aes.IV = iv;
                    ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                    using (MemoryStream memoryStream = new MemoryStream(buffer))
                    {
                        using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader streamReader = new StreamReader((Stream)cryptoStream))
                            {
                                return streamReader.ReadToEnd();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return "";
            }
        }

        public string GeneratePassword()
        {
            string str = "";
            try
            {
                var chars1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
                var stringChars1 = new char[8];
                var random1 = new Random();
                for (int i = 0; i < stringChars1.Length; i++)
                {
                    stringChars1[i] = chars1[random1.Next(chars1.Length)];
                }
                str = new String(stringChars1);
                return str;
            }
            catch (Exception ex)
            {
                return str;
            }
        }

    }

}