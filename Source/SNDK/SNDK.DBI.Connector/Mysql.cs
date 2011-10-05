//
// Mysql.cs
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
using System.Data;
using System.Text.RegularExpressions;

using MySql.Data.MySqlClient;

namespace SNDK.DBI.Connector
{
	internal static class Mysql
	{
		#region Public Static Methods
		internal static IDbConnection Connect (SNDK.DBI.Connection Connection)
		{
			MySqlConnection result = null;
			string connectionstring = "Server="+ Connection.Hostname +";Database="+ Connection.Database +";User ID="+ Connection.Username +";Password="+ Connection.Password +";pooling=true;min pool size=4;max pool size=100";

			try
			{
				result = new MySqlConnection (connectionstring);
				result.Open ();
				Connection.Connected = true;
			}
			catch
			{
				throw new Exception ("Could not connection to database.");
			}

			return result;
		}

		internal static bool Query (string QueryString, SNDK.DBI.Connection Connection, SNDK.DBI.Query Query)
		{
			bool success = false;
			MySqlConnection dbconnection = (MySqlConnection)Connect (Connection);
			
			
			IDbCommand dbcommand = dbconnection.CreateCommand ();

			dbcommand.CommandText = QueryString;
			Match usenonquery = Regex.Match (QueryString, @"^UPDATE|^DELETE|^INSERT");
			try
			{
				if (usenonquery.Success)
				{
					Query.affectedrows = dbcommand.ExecuteNonQuery ();
					Query.dbconnection = dbconnection;
				}
				else
				{
					Query.rows = dbcommand.ExecuteReader ();
					Query.dbconnection = dbconnection;
				}
				success = true;
			}
			catch
			{
				if (Connection.DebugMode)
				{
					throw new Exception ("Error in querystring: "+ QueryString);
				}
			}

			return success;
		}
		
		internal static bool Query2 (string QueryString, SNDK.DBI.Connection Test, SNDK.DBI.Query Query)
		{
			bool success = false;
			Connection.ConnectionThread thread = Test.GetConnection ();
			thread._ready = false;
			MySqlConnection dbconnection = (MySqlConnection)thread._dbconnection;
			Query._thread = thread;
			
//			MySqlConnection dbconnection = (MySqlConnection)Test.GetConnection ();
//			IDbCommand dbcommand = dbconnection.CreateCommand ();
			thread._dbcommand = dbconnection.CreateCommand ();
			
			thread._dbcommand.CommandText = QueryString;
			Match usenonquery = Regex.Match (QueryString, @"^UPDATE|^DELETE|^INSERT");
			try
			{
				if (usenonquery.Success)
				{
					Query.affectedrows = thread._dbcommand.ExecuteNonQuery ();
//					Query.dbconnection = dbconnection;
				}
				else
				{
					Query.rows = thread._dbcommand.ExecuteReader ();
//					Query.dbconnection = dbconnection;
				}
				success = true;
			}
			catch (Exception e)
			{
				Console.WriteLine (e.Message);
				Environment.Exit (0);
				
//				if (Connection.DebugMode)
//				{
//					throw new Exception ("Error in querystring: "+ QueryString);
//				}
			}

			return success;
		}
		#endregion
	}
}
