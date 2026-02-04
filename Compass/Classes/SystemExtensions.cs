using System.Text.RegularExpressions;
using System.Text;

namespace Compass.Classes
{
    public static class SystemExtensions
    {
        private static Random random = new Random();
        public static T? As<T>(this object t) where T : class
        {
            return t as T;
        }

        public static void ForEach<T>(this IEnumerable<T> enumerable,
            Action<T> action)
        {
            foreach (T item in enumerable) { action(item); }
        }

        public static bool Is<T>(this object t) where T : class
        {
            return t is T;
        }

        public static bool IsEmail(this string s)
        {
            try
            {
                return Regex.IsMatch(s,
                      //@"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
                      //@"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
                      @"^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$",
                      RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }

        public static bool IsNotNull<T>(this T t) where T : class
        {
            return t != null;
        }

        public static bool IsNull<T>(this T t) where T : class
        {
            return t == null;
        }

        public static bool IsNotNullOrEmpty(this string s)
        {
            return !string.IsNullOrEmpty(s);
        }
        public static string DecimalFormat(this decimal s)
        {
            return s.ToString("##.##");
        }
        public static string ShowTwoPlacesAfterDecimal(this decimal s)
        {
            string[] a = s.ToString().Split(new char[] { '.' });
            if (Convert.ToInt32(a[1]) == 0)
                return s.ToString("0.####");
            else
                return string.Format("{0:f2}", s);
        }
        public static string AddCommaInAmount(this decimal s)
        {
            return String.Format("{0:n0}", s);
        }
        public static string AddCommaInAmountWithDecimal(this decimal s)
        {
            return String.Format("{0:n}", s);
        }
        public static bool IsNullOrEmpty(this string s, object returnResult)
        {
            return string.IsNullOrEmpty(s);
        }
        public static decimal DecimalRoundTwoPlace(this decimal s)
        {
            return Math.Round(s, 2);
        }
        public static bool IsNullOrWhiteSpace(this string s)
        {
            return string.IsNullOrWhiteSpace(s);
        }

        public static bool IsNumber(this string s)
        {
            int n;
            return int.TryParse(s, out n);
        }
        /// <summary>
        /// Generate Numeric Code
        /// </summary>
        /// <param name="length"></param>
        /// <returns></returns>
        public static string GenerateNumericCode(int length)
        {
            const string valid = "1234567890";
            StringBuilder res = new StringBuilder();
            Random rnd = new Random();
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            return res.ToString();
        }
        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public static int GetMonthInteger(string month)
        {
            int _month = 0;
            switch (month.ToLower())
            {
                case "jan":
                case "january":
                    _month = 1;
                    break;
                case "feb":
                case "february":
                    _month = 2;
                    break;
                case "mar":
                case "march":
                    _month = 3;
                    break;
                case "apr":
                case "april":
                    _month = 4;
                    break;
                case "may":
                    _month = 5;
                    break;
                case "jun":
                case "june":
                    _month = 6;
                    break;
                case "jul":
                case "july":
                    _month = 7;
                    break;
                case "aug":
                case "august":
                    _month = 8;
                    break;
                case "sep":
                case "september":
                    _month = 9;
                    break;
                case "oct":
                case "october":
                    _month = 10;
                    break;
                case "nov":
                case "november":
                    _month = 11;
                    break;
                case "dec":
                case "december":
                    _month = 12;
                    break;
                default:
                    break;
            }
            return _month;
        }
    }

}
