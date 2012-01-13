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
		public static readonly object _lock = new object();		
		
		#region Private Fields
		private SNDK.Enums.DatabaseConnector _databaseconnector;
		private string _hostname;
		private string _database;
		private string _username;
		private string _password;
		private bool _connected;
		private bool _debugmode;
		private List<ConnectionThread> _pool;		
		
		public IDbConnection _test;				
		#endregion
		
		#region Internal Fields
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
		public Connection (Enums.DatabaseConnector DatabaseConnector, string Hostname, string Database, string Username, string Password)
		{
			Initalize (DatabaseConnector, Hostname, Database, Username, Password, false);
		}

		public Connection (Enums.DatabaseConnector DatabaseConnector, string Hostname, string Database, string Username, string Password, bool DebugMode)
		{
			Initalize (DatabaseConnector, Hostname, Database, Username, Password, DebugMode);
		}
		
		private void Initalize (Enums.DatabaseConnector DatabaseConnector, string Hostname, string Database, string Username, string Password, bool DebugMode)
		{
			this._databaseconnector = DatabaseConnector;
			this._hostname = Hostname;
			this._database = Database;
			this._username = Username;
			this._password = Password;
			this._connected = false;
			this._debugmode = DebugMode;
			
			this._pool = new List<ConnectionThread> ();
		}
		#endregion

		#region Public Methods
		public bool Connect ()
		{
			switch (this._databaseconnector)
			{
				case Enums.DatabaseConnector.Mysql:
				{
					ConnectionThread thread = new ConnectionThread ();
					thread.DbConnection = Connector.Mysql.Connect (this);
					this._pool.Add (thread);
					break;
				}
			}

			return this._connected;
		}

		public Query Query (string QueryString)
		{
			Query query = new Query ();

			switch (this._databaseconnector)
			{
				case Enums.DatabaseConnector.Mysql:
				{					
					Connector.Mysql.Query (QueryString, this, query);
					break;
				}
			}

			return query;
		}
		#endregion
		
		#region Internal Methods				
		internal void ReConnect ()
		{
			switch (this._databaseconnector)
			{
			    case Enums.DatabaseConnector.Mysql:
			    { 
				
				foreach (ConnectionThread thread in this._pool)
				{
//					Console.WriteLine ("RECONNECTING");
					thread.DbConnection = Connector.Mysql.Connect (this);
				}
					break;
				}
			}
		}
		
		internal ConnectionThread GetConnectionThread ()
		{			
			ConnectionThread result = null;		
						
			lock (_lock)
			{
			// Search for an available ConnectionThread.
			foreach (ConnectionThread connectionthread in this._pool)
			{					
				if (connectionthread.Ready)
				{
					if (connectionthread.DbCommand == null)
					{
						connectionthread.Ready = false;
						result = connectionthread;
						break;
					}
				}
			}
			
			// If no available ConnectionThread was found, lets make a new.
			if (result == null)
			{
//				Console.WriteLine ("New ConnectionThread: "+ this._pool.Count);
				
				switch (this._databaseconnector)
				{
					// New MySQL connector
					case SNDK.Enums.DatabaseConnector.Mysql:
					{
						result = new ConnectionThread ();
						result.DbConnection = SNDK.DBI.Connector.Mysql.Connect (this);												
						this._pool.Add (result);						
						break;                     
					}
				}
			}
			}
							
			return result;
		}			
		#endregion
	}
}
