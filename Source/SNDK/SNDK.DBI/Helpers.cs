//
// Helpers.cs
//
// Author:
//       Rasmus Pedersen <rasmus@akvaservice.dk>
//
// Copyright (c) 2010 Rasmus Pedersen
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

using System;
using System.Collections.Generic;

using SNDK;
using SNDK.Enums;

namespace SNDK.DBI
{
	public static class Helpers
	{

		public static int GetCount (SNDK.DBI.Connection DBConnection, string TableName)
		{
			return SNDK.DBI.Helpers.GetCount (DBConnection, TableName, string.Empty);
		}

		public static int GetCount (SNDK.DBI.Connection DBConnection, string TableName, string Where)
		{
			int result = 0;
			string querystring = string.Empty;

			querystring += "SELECT ";

			querystring += "COUNT(*) as rowcount FROM "+ TableName +" ";

			if (Where != string.Empty)
			{
				querystring += "WHERE "+ Where+ " ";
			}

			Query query = DBConnection.Query (querystring);

			if (query.Success)
			{
				if (query.NextRow ())
				{
					result = query.GetInt (0);
				}
			}

			query.Dispose ();
			query = null;
			querystring = null;

			return result;
		}

		public static bool GuidExists (SNDK.DBI.Connection DbConnection, string TableName, Guid Guid)
		{
			bool result = false;

			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Select);
			qb.Table (TableName);
			qb.Columns ("id");
			qb.AddWhere ("id", "=", Guid);
					
			Query query = DbConnection.Query (qb.QueryString);
			if (query.Success)
			{
				if (query.NextRow ())
				{
					result = true;
				}
			}

			query.Dispose ();
			query = null;
			qb = null;

			return result;
		}

		public static SNDK.DBI.Query GetCount (SNDK.DBI.Connection DBConnection, string TableName, string Where, params string[] OrderByColumns)
		{
			string querystring = string.Empty;

			querystring += "SELECT ";

			if (OrderByColumns.GetLength (0) >= 0)
			{
				foreach (string column in OrderByColumns)
				{
					querystring += column +",";
				}
			}

			querystring += "COUNT(*) as rowcount FROM "+ TableName +" ";

			if (Where != string.Empty)
			{
				querystring += "WHERE "+ Where+ " ";
			}

			if (OrderByColumns.GetLength (0) >= 0)
			{
				querystring += "ORDER BY ";
				foreach (string column in OrderByColumns)
				{
					querystring += column +",";
				}
				querystring = querystring.TrimEnd (",".ToCharArray ());
			}

			return DBConnection.Query (querystring);
		}
	}
}