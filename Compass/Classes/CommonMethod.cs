using System.Data;

namespace Compass.Classes
{
    public static class CommonMethod
    {
        public static List<Dictionary<string, object>> ToList(DataTable dt)
        {
            var list = new List<Dictionary<string, object>>();
            foreach (DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    dict[col.ColumnName] = row[col] == DBNull.Value ? "" : row[col];
                }
                list.Add(dict);
            }
            return list;
        }
        public static List<Dictionary<string, object>> ToDataTableList(DataTable dt)
        {
            var list = new List<Dictionary<string, object>>();
            foreach (DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    dict[col.ColumnName] = row[col] == DBNull.Value ? "" : row[col];
                }
                list.Add(dict);
            }
            return list;
        }
        public static List<List<Dictionary<string, object>>> ToDataSetList(DataSet ds)
        {
            var result = new List<List<Dictionary<string, object>>>();

            foreach (DataTable dt in ds.Tables)
            {
                var tableList = new List<Dictionary<string, object>>();
                foreach (DataRow row in dt.Rows)
                {
                    var dict = new Dictionary<string, object>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        dict[col.ColumnName] = row[col] == DBNull.Value ? "" : row[col];
                    }
                    tableList.Add(dict);
                }
                result.Add(tableList);
            }

            return result;
        }
    }
}
