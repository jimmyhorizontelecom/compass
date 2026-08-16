using System.Data;
using System.Reflection;

namespace Compass.Classes
{
    public static class CommonNew
    {
        //public static List<T> ToList<T>(DataTable dt) where T : new()
        //{
        //    var list = new List<T>();

        //    foreach (DataRow row in dt.Rows)
        //    {
        //        T obj = new T();

        //        foreach (DataColumn col in dt.Columns)
        //        {
        //            PropertyInfo prop = typeof(T).GetProperty(col.ColumnName);

        //            if (prop != null && row[col] != DBNull.Value)
        //            {
        //                prop.SetValue(obj, row[col]);
        //            }
        //        }

        //        list.Add(obj);
        //    }

        //    return list;
        //}
        public static List<T> ToList<T>(DataTable dt)
        {
            var list = new List<T>();

            foreach (DataRow row in dt.Rows)
            {
                T obj = Activator.CreateInstance<T>();

                foreach (DataColumn col in dt.Columns)
                {
                    try
                    {
                        var prop = typeof(T).GetProperty(col.ColumnName);

                        if (prop == null || !prop.CanWrite)
                            continue;

                        var value = row[col];

                        if (value == DBNull.Value)
                            continue;

                        var propType = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;

                        // ✅ HANDLE TYPES SAFELY
                        if (propType == typeof(string))
                        {
                            prop.SetValue(obj, value.ToString());
                        }
                        else if (propType == typeof(int))
                        {
                            prop.SetValue(obj, Convert.ToInt32(value));
                        }
                        else if (propType == typeof(decimal))
                        {
                            prop.SetValue(obj, Convert.ToDecimal(value));
                        }
                        else if (propType == typeof(double))
                        {
                            prop.SetValue(obj, Convert.ToDouble(value));
                        }
                        else if (propType == typeof(float))
                        {
                            prop.SetValue(obj, Convert.ToSingle(value));
                        }
                        else if (propType == typeof(DateTime))
                        {
                            prop.SetValue(obj, Convert.ToDateTime(value));
                        }
                        else if (propType == typeof(bool))
                        {
                            prop.SetValue(obj, Convert.ToBoolean(value));
                        }
                        else
                        {
                            prop.SetValue(obj, Convert.ChangeType(value, propType));
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception(
                            $"Error mapping column '{col.ColumnName}' with value '{row[col]}' to property '{typeof(T).Name}'",
                            ex
                        );
                    }
                }

                list.Add(obj);
            }

            return list;
        }


    }

}

//using HashidsNet;
//using System.Data;
//using System.Reflection;

//namespace Compass.Classes
//{
//    public static class CommonNew
//    {
//        public static List<T> ToList<T>(DataTable dt) where T : new()
//        {
//            var list = new List<T>();

//            foreach (DataRow row in dt.Rows)
//            {
//                T obj = new T();

//                foreach (DataColumn col in dt.Columns)
//                {
//                    PropertyInfo prop = typeof(T).GetProperty(col.ColumnName);

//                    if (prop != null && row[col] != DBNull.Value)
//                    {
//                        prop.SetValue(obj, row[col]);
//                    }
//                }

//                list.Add(obj);
//            }

//            return list;
//        }
//        //public static string GenerateKeyField(int key)
//        //{
//        //    var hashids = new Hashids("my Htis", 8); // "my salt" keeps encoding safe

//        //    int dbId = key;

//        //    // Encode for client
//        //    string publicCode = hashids.Encode(dbId);
//        //    Console.WriteLine(publicCode); // e.g., "NkK9L0Bq"


//        //    return publicCode;
//        //}
//        //public static int getKeyField(string publicKey)
//        //{
//        //    //var hashids = new Hashids("my Htis", 8);

//        //    // Decode when client sends back
//        //    int[] numbers = hashids.Decode(publicKey);
//        //    int originalId = numbers[0];
//        //    Console.WriteLine(originalId); // 102
//        //    return originalId;
//        //}

//    }

//}