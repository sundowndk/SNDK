using System;
using System.Data;

using MySql.Data.MySqlClient;


namespace SNDK.DBI
{
	public class ConnectionThread
	{
		#region Private Fields	
		public Guid _id;
		private bool _ready;
		private IDbConnection _dbconnection;
		private IDbCommand _dbcommand;
		#endregion
		
		#region Public Fields
		public bool Ready
		{
			get
			{
				return this._ready;
			}
			
			set
			{
				this._ready = value;
			}
		}
		
		public IDbConnection DbConnection
		{
			get
			{
				return this._dbconnection;
			}
			
			set
			{
				this._dbconnection = value;
			}
		}
		
		public IDbCommand DbCommand
		{
			get
			{
				return this._dbcommand;
			}
			
			set
			{
				this._dbcommand = value;
			}
		}
		#endregion
		
		#region Constructor
		public ConnectionThread ()
		{
			this._id = Guid.NewGuid ();
			this._ready = false;
		}
		#endregion
		
	}
}
