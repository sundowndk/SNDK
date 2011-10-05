//
// Query.cs
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
using System.Data;

using System.IO;

namespace SNDK.DBI
{
	public class Query
	{
		#region Private Fields
		private IDataReader _rows;
		private int _affectedrows;
		private IDbConnection _dbconnection;
		private bool _dbconnectionactive;
		private bool _datareaderactive;
		public Connection.ConnectionThread _thread;
		private bool _success;
		#endregion

		#region Internal Fields
		internal IDataReader rows
		{
			get
			{
				return this._rows;
			}

		    set
			{
				this._datareaderactive = true;
				this._success = true;
				this._rows = value;
			}
		}

		internal int affectedrows
		{
			get
			{
				return this._affectedrows;
			}

			set
			{
				this._affectedrows = value;
			}
		}

		internal IDbConnection dbconnection
		{
			get
			{
				return this._dbconnection;
			}

		    set
			{
				this._dbconnectionactive = true;
				this._dbconnection = value;
			}
		}
		#endregion

		#region Public Fields
		public IDataReader Rows
		{
			get
			{
				return this._rows;
			}
		}

		public int AffectedRows
		{
			get
			{
				return this._affectedrows;
			}
		}

		public bool Success
		{
			get
			{
				return this._success;
			}
		}
		#endregion

		#region Methods
		public bool NextRow ()
		{
			if (this._rows.Read()) 
			{
				return true;
			} 			

			return false;
		}		

		public string GetString (int Column)
		{
			if (!this._rows.IsDBNull (Column))
			{
				return this._rows.GetString (Column);
			}

			return string.Empty;
		}


		public Guid GetGuid (int Column)
		{
			if (!this._rows.IsDBNull (Column))
			{
				try
				{
					return new Guid (this._rows.GetString (Column));
				}
				catch
				{
				}
			}

			return Guid.Empty;
		}
		
		public long GetLong (int Column)
		{
			if (!this._rows.IsDBNull (Column))
			{
				return this._rows.GetInt64 (Column);
			}

			return 0;
		}


		public bool GetBool (int Column)
		{
			if (!this._rows.IsDBNull (Column))
			{
				if (this._rows.GetInt32 (Column) == 1)
				{
					return true;
				}
			}

			return false;
		}

		public T GetSerialized<T> (int Column)
		{
			if (!this._rows.IsDBNull (Column))
			{
				return SNDK.Serializer.DeSerializeObjectFromString<T> (this._rows.GetString (Column));
			}

			return default (T);
		}

		public T GetEnum<T> (int Column)
		{
			if (!this._rows.IsDBNull (Column))
			{
				return (T)Enum.ToObject (typeof (T), this._rows.GetInt32 (Column));
			}
			
			return default(T);
		}

		public int GetInt (int Column)
		{
			if (!this._rows.IsDBNull (Column))
			{
				return this._rows.GetInt32 (Column);
			}
			
			return 0;
		}
		
		public float GetFloat (int Column)
		{
			if (!this._rows.IsDBNull (Column))
			{
				return this._rows.GetFloat (Column);
			}

			return 0f;
		}

		public double GetDouble (int Column)
		{		
			if (!this._rows.IsDBNull (Column))
			{
				return this._rows.GetDouble (Column);
			} 

			return 0;
		}
		
		public decimal GetDecimal (int Column)
		{		
			if (!this._rows.IsDBNull (Column))
			{
				return this._rows.GetDecimal (Column);
			} 

			return 0m;
		}
		
		public byte[] GetBytes (int Column)
		{			
			byte[] result = null;

			if (!this._rows.IsDBNull (Column))
			{
				MemoryStream memorystream = new MemoryStream();				
				
				long datasize = this._rows.GetBytes(0, 0, null, 0, 0);
				long offset = 0;
				int buffersize = 100;
				long bufferread = 0;				
				byte[] buffer = new byte[buffersize];
				result = new byte[datasize];												
				
				bufferread = this._rows.GetBytes (Column, offset, buffer, 0, buffersize);
				while (bufferread == buffersize)
				{
					memorystream.Write(buffer, 0, buffer.Length);
					
					offset += buffersize;
					bufferread = this._rows.GetBytes (Column, offset, buffer, 0, buffersize);
				}				
				memorystream.Write(buffer, 0, (int)bufferread);
				
				result = memorystream.ToArray();
				memorystream.Flush();
			 	memorystream.Close();								
			}			
			return result;	
		}

		public void Dispose ()
		{				
//			if (this._success == true) 
//			{
//				if (this._datareaderactive)
//				{
			try
			{


					this._rows.Close();
				this._rows.Dispose ();
				this._rows = null;
				
			}
			catch
			{

			}
//				}
				
//				if (_dbconnectionactive)
//				{
//			try
//			{
			this._thread._ready = true;
			
			if (this._thread._dbcommand != null)
			{
				this._thread._dbcommand.Dispose ();
				this._thread._dbcommand = null;
			}
				
				
//				this._dbconnection.Close();
//					this._dbconnection = null;
//			}
//			catch
//			{

//			}
//				}

				this._dbconnectionactive = false;
				this._datareaderactive = false;
//			}
		}
		#endregion
	}
}
