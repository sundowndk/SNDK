using System;
using System.Collections.Generic;
using SNDK;
using SNDK.DBI;

namespace Test
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			
			List<string> test1 = new List<string> ();
			test1.Add ("LINE1");
			test1.Add ("LINE2");
			
			List<Guid> test2 = new List<Guid> ();
			test2.Add (Guid.NewGuid ());
			test2.Add (Guid.NewGuid ());
			test2.Add (Guid.NewGuid ());
			test2.Add (Guid.NewGuid ());

			List<int> test3 = new List<int> ();
			test3.Add (1);
			test3.Add (2);
			test3.Add (3);
			test3.Add (4);

			
//			Console.WriteLine (SNDK.Convert.ListToString (test2));
			
//			Console.WriteLine (SNDK.Convert.StringToList<string> ("7edb2c35-5939-49f9-b3c1-c40e3690977b", ";"));
			
//			Console.WriteLine ();
			
			foreach (int guid in SNDK.Convert.StringToList<int> (SNDK.Convert.ListToString (test3)))
			{
				Console.WriteLine (guid);
			}
			
			
			
//			SNDK.DBI.Connection connection = new SNDK.DBI.Connection (	SNDK.Enums.DatabaseConnector.Mysql,
//				"localhost",
//				"qnax",
//				"qnax",
//				"qwerty",
//				true);
//			
//			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Select);
//			qb.Table ("voip_countrycodes");
//			qb.Columns ("id");
//			
//			Query query = connection.Query (qb.QueryString);
//			if (query.Success)
//			{
//				while (query.NextRow ())
//				{					
//					try
//					{
//						Console.WriteLine (query.GetGuid (qb.ColumnPos ("id")));
//					}
//					catch
//					{}
//				}
//			}
//
//			query.Dispose ();
//			query = null;
//			qb = null;

		
		}
	}
}
