using System;
using SNDK;
using SNDK.DBI;

namespace Test
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			SNDK.DBI.Connection connection = new SNDK.DBI.Connection (	SNDK.Enums.DatabaseConnector.Mysql,
				"localhost",
				"qnax",
				"qnax",
				"qwerty",
				true);
			
			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Select);
			qb.Table ("voip_countrycodes");
			qb.Columns ("id");
			
			Query query = connection.Query (qb.QueryString);
			if (query.Success)
			{
				while (query.NextRow ())
				{					
					try
					{
						Console.WriteLine (query.GetGuid (qb.ColumnPos ("id")));
					}
					catch
					{}
				}
			}

			query.Dispose ();
			query = null;
			qb = null;

		
		}
	}
}
