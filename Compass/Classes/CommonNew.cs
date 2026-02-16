using System.Data;
using System.Reflection;

namespace Compass.Classes
{
    public static class CommonNew
    {
        public static List<T> ToList<T>(DataTable dt) where T : new()
        {
            var list = new List<T>();

            foreach (DataRow row in dt.Rows)
            {
                T obj = new T();

                foreach (DataColumn col in dt.Columns)
                {
                    PropertyInfo prop = typeof(T).GetProperty(col.ColumnName);

                    if (prop != null && row[col] != DBNull.Value)
                    {
                        prop.SetValue(obj, row[col]);
                    }
                }

                list.Add(obj);
            }

            return list;
        }
    }
    
}
