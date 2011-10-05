//
// Cache.cs
//
// Author:
//       Rasmus Pedersen <rasmus@akvaservice.dk>
//
// Copyright (c) 2009 Rasmus Pedersen
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

using SNDK.DBI;
using SNDK.Enums;

namespace SNDK.Google.Geocode
{
	public class Cache
	{
		#region Public Static Fields
		public static string DatabaseTableName = string.Empty;
		public static Connection DbConnection = null;
		public static bool Enabled = false;
		public static int Timeout = 1296000;
		#endregion
		
		#region Private Static Methods
		private static void Flush ()
		{
			QueryBuilder qb;
			qb = new QueryBuilder (QueryBuilderType.Delete);
			
			qb.Table (DatabaseTableName);
			qb.AddWhere ("("+ SNDK.Date.CurrentDateTimeToTimestamp().ToString () +" - createtimestamp) > "+ Timeout.ToString ());

			Query query = DbConnection.Query (qb.QueryString);

			query.Dispose();
			query = null;
			qb = null;
		}
		#endregion
		
		#region Public Static Methods
		public static string Get (string Url)
		{
			string result = string.Empty;
			
			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Select);
			qb.Table (DatabaseTableName);
			qb.Columns ("xmlresponse");

			qb.AddWhere ("url", "=", Url);

			Query query = DbConnection.Query (qb.QueryString);

			if (query.Success)
			{
				if (query.NextRow ())
				{
					result = query.GetString (qb.ColumnPos ("xmlresponse"));
				}
			}
			
			query.Dispose();
			query = null;
			qb = null;
											
			return result;
		}
		
		public static void Set (string Url, string XmlResponse)
		{
			QueryBuilder qb;
			qb = new QueryBuilder (QueryBuilderType.Insert);
			
			qb.Table (DatabaseTableName);

			qb.Columns ("id",
			            "createtimestamp",
			            "url",
			            "xmlresponse");

			qb.Values (Guid.NewGuid (),
			           SNDK.Date.CurrentDateTimeToTimestamp (),
			           Url,
			           XmlResponse);
						
			Query query = DbConnection.Query (qb.QueryString);
					
			query.Dispose();
			query = null;
			qb = null;		
			
			Flush ();
		}
		#endregion
	}
}

