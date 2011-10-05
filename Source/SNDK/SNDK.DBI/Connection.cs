//
// Connection.cs
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
using System.IO;
using System.Data;
using System.Reflection;
using System.Collections.Generic;

namespace SNDK.DBI
{
	public class Connection
	{
		#region Private Fields
		private SNDK.Enums.DatabaseConnector _databaseconnector;

		private string _hostname;
		private string _database;
		private string _username;
		private string _password;

		public IDbConnection _test;
		
		public List<ConnectionThread> _threads;
		
		private bool _connected;
		private bool _debugmode;
		#endregion
		
		public class ConnectionThread
		{
			public bool _ready;
			public IDbConnection _dbconnection;
			public IDbCommand _dbcommand;
			
			public ConnectionThread ()
			{
				this._ready = true;
			}
		}

		#region Internal Fields
		public ConnectionThread GetConnection ()
		{
			ConnectionThread result = null;		
			
//			Console.WriteLine ("");
//			Console.Write ("Find connection");
			foreach (ConnectionThread connectionthread in this._threads)
			{
//				Console.Write (".");
				if (connectionthread._ready)
				{
//					Console.Write ("Found!");
					result = connectionthread;
					break;
				}
			}
			
			if (result == null)
			{
				switch (this._databaseconnector)
				{
					case SNDK.Enums.DatabaseConnector.Mysql:
						result = new ConnectionThread ();
						result._dbconnection = SNDK.DBI.Connector.Mysql.Connect (this);
						this._threads.Add (result);
						break;
				}
			}
			
			return result;
		}
		
		internal string Hostname
		{
			get
			{
				return this._hostname;
			}
		}

		internal string Database
		{
			get
			{
				return this._database;
			}
		}

		internal string Username
		{
			get
			{
				return this._username;
			}
		}

		internal string Password
		{
			get
			{
				return this._password;
			}
		}

		internal bool Connected
		{
			get
			{
				return this._connected;
			}

			set
			{
				this._connected = value;
			}
		}
		#endregion

		#region Public Fields
		public bool DebugMode
		{
			get
			{
				return this._debugmode;
			}
			set
			{
				this._debugmode = value;
			}
		}
		#endregion
		
		#region Constructor
		public Connection (SNDK.Enums.DatabaseConnector DatabaseConnector, string Hostname, string Database, string Username, string Password)
		{
			this._databaseconnector = DatabaseConnector;
			this._hostname = Hostname;
			this._database = Database;
			this._username = Username;
			this._password = Password;
			this._connected = false;
			this._debugmode = false;
			
			this._threads = new List<ConnectionThread> ();
		}

		public Connection (SNDK.Enums.DatabaseConnector DatabaseConnector, string Hostname, string Database, string Username, string Password, bool DebugMode)
		{
			this._databaseconnector = DatabaseConnector;
			this._hostname = Hostname;
			this._database = Database;
			this._username = Username;
			this._password = Password;
			this._connected = false;
			this._debugmode = DebugMode;
			
			this._threads = new List<ConnectionThread> ();
		}
		#endregion

		#region Public Methods
		public bool Connect ()
		{
			switch (this._databaseconnector)
			{
				case SNDK.Enums.DatabaseConnector.Mysql:
					ConnectionThread thread = new ConnectionThread ();
					thread._dbconnection = SNDK.DBI.Connector.Mysql.Connect (this);
					this._threads.Add (thread);
					break;

				case SNDK.Enums.DatabaseConnector.Mssql:
					SNDK.DBI.Connector.Mssql.Connect (this);
					break;

			}

			return this._connected;
		}

		public SNDK.DBI.Query Query (string QueryString)
		{
			SNDK.DBI.Query query = new SNDK.DBI.Query ();

			switch (this._databaseconnector)
			{
				case SNDK.Enums.DatabaseConnector.Mysql:
					SNDK.DBI.Connector.Mysql.Query2 (QueryString, this, query);
					break;

				case SNDK.Enums.DatabaseConnector.Mssql:
					SNDK.DBI.Connector.Mssql.Query (QueryString, this, query);
					break;
			}

			return query;
		}
		#endregion
	}
}
