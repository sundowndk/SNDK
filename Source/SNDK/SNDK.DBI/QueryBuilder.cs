//
// QueryBuilder.cs
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

namespace SNDK.DBI
{
	public class QueryBuilder
	{
		#region Private Fields
		private QueryBuilderType _type;
		private List<string> _tables;
		private List<string> _columns;
		private List<string> _values;
		private List<string> _wheres;
		private string _orderby;
		#endregion

		#region Public Fields
		public string QueryString
		{
			get
			{
				string result = string.Empty;

				switch (this._type)
				{
					#region SELECT
					case QueryBuilderType.Select:
						result = "SELECT ";

						if (this._columns.Count == 0)
						{
							result += "*";
						}
						else
						{
							foreach (string column in this._columns)
							{
								result += column + ", ";
							}
							result = result.TrimEnd (", ".ToCharArray ());
							result += " ";
						}

						if (this._tables.Count > 0)
						{
							result += "FROM ";
							foreach (string table in this._tables)
							{
								result += table + ", ";
							}
							result = result.TrimEnd (", ".ToCharArray ());
							result += " ";
						}
						else
						{
							throw new Exception ("No table has been specified, cannot create querystring.");
						}
						break;
					#endregion

					#region INSERT
					case QueryBuilderType.Insert:
						result = "INSERT ";

						if (this._tables.Count > 0)
						{
							result += "INTO ";
							foreach (string table in this._tables)
							{
								result += table + ", ";
							}
							result = result.TrimEnd(", ".ToCharArray ()) + " ";
						}
						else
						{
							throw new Exception ("No table has been specified, cannot create querystring.");
						}

						if (this._columns.Count > 0)
						{
							result += "(";
							foreach (string column in this._columns)
							{
								result += column + ", ";
							}
							result = result.TrimEnd(", ".ToCharArray ()) + ") ";
						}
						else
						{
							throw new Exception ("No columns has been specified, cannot create querystring");
						}

						if (this._values.Count > 0)
						{
							result += "VALUES (";
							foreach (string value in this._values)
							{
								result += "'"+ value + "', ";
							}
							result = result.TrimEnd(", ".ToCharArray ()) + ") ";
						}
						else
						{
							throw new Exception ("No values has been specified, cannot create querystring.");
						}
						break;
					#endregion

					#region UPDATE
					case QueryBuilderType.Update:
						result = "UPDATE ";

						if (this._tables.Count > 0)
						{
							foreach (string table in this._tables)
							{
								result += table + ", ";
							}
							result = result.TrimEnd(", ".ToCharArray ()) + " ";
						}
						else
						{
							throw new Exception ("No table has been specified, cannot create querystring.");
						}

						if (this._columns.Count > 0)
						{
							result += "SET ";
							int columnpos = 0;
							foreach (string column in this._columns)
							{
								result += column +" = '"+ this._values[columnpos]+ "', ";
								columnpos++;
							}
							result = result.TrimEnd(", ".ToCharArray ()) + " ";
						}
						else
						{
							throw new Exception ("No values has been specified, cannot create querystring.");
						}
						break;
					#endregion

					#region DELETE
					case QueryBuilderType.Delete:
						result = "DELETE ";

						if (this._tables.Count > 0)
						{
							result += "FROM ";
							foreach (string table in this._tables)
							{
								result += table + ", ";
							}
							result = result.TrimEnd(", ".ToCharArray ()) + " ";
						}
						break;
					#endregion
				}

//				if (this._type != Toolbox.Enums.QueryBuilderType.Insert)
//				{
					if (this._wheres.Count > 0)
					{
						result += "WHERE ";

						foreach (string where in this._wheres)
						{
							result += where +" ";
						}
					}

				if (this._orderby != string.Empty)
				{
					result += this._orderby;
				}
//				}


				return result;
			}
		}
		#endregion

		#region Constructor
		public QueryBuilder (QueryBuilderType Type)
		{
			this._type = Type;
			this._tables = new List<string> ();
			this._columns = new List<string> ();
			this._values = new List<string> ();
			this._wheres = new List<string> ();
			this._orderby = string.Empty;
		}
		#endregion

		#region Public Methods
		public void Columns (params string[] Columns)
		{
			this._columns.Clear ();
			foreach (string column in Columns)
			{
				this._columns.Add (column);
			}
		}

		public void Values (params object[] Values)
		{
			if (Values.Length != this._columns.Count)
			{
				throw new Exception ("Number of values does not match the number of columns. Make sure columns are specified before values are added.");
			}

			this._values.Clear ();
			foreach (object value in Values)
			{
				string valueasstring = string.Empty;

				if (value != null)
				{
					valueasstring = value.ToString ();

					#region BOOLEAN
					if (value.GetType().Name.ToLower () == "boolean")
					{
						if (valueasstring.ToLower () == "true")
						{
							valueasstring = "1";
						}
						else
						{
							valueasstring = "0";
						}
					}
					#endregion

					#region ENUM
					if (value.GetType().BaseType.Name.ToLower () == "enum")
					{
						valueasstring = ((int)value).ToString ();
					}
					#endregion

					#region DECIMAL
					if (value.GetType().Name.ToLower () == "decimal")
					{
						valueasstring = value.ToString ().Replace (",", ".");
					}
					#endregion

					#region LIST
					if (value.GetType().Name.ToLower () == "list`1")
					{
						valueasstring = SNDK.Serializer.SerializeObjectToString (value);
					}

					#endregion
				}

				this._values.Add (QueryBuilder.MakeSafe (valueasstring));
			}
		}

		public void Table (string Table)
		{
			this._tables.Clear ();
			this._tables.Add (Table);
		}

		public void AddWhere (string Where)
		{
			this._wheres.Add ("("+ Where +")");
		}

		public void AddWhere(string Column, string Expression, object Value)
		{
			string valueasstring = string.Empty;

				if (Value != null)
				{
					valueasstring = Value.ToString ();

					#region BOOLEAN
					if (Value.GetType().Name.ToLower () == "boolean")
					{
						if (valueasstring.ToLower () == "true")
						{
							valueasstring = "1";
						}
						else
						{
							valueasstring = "0";
						}
					}
					#endregion

					#region ENUM
					if (Value.GetType().BaseType.Name.ToLower () == "enum")
					{
						valueasstring = ((int)Value).ToString ();
					}
					#endregion

					#region DECIMAL
					if (Value.GetType().Name.ToLower () == "decimal")
					{
						valueasstring = Value.ToString ().Replace (",", ".");
					}
					#endregion
				}

			this._wheres.Add ("("+ Column +" "+ Expression +" '"+ QueryBuilder.MakeSafe (valueasstring) +"')");
		}

		public void AddWhereOR ()
		{
			this._wheres.Add (" OR ");
		}

		public void AddWhereAND ()
		{
			this._wheres.Add (" AND ");
		}

		public void OrderBy (string Column, QueryBuilderOrder Order)
		{
			if (Order == QueryBuilderOrder.Accending)
			{
				this._orderby = "ORDER BY '"+ QueryBuilder.MakeSafe (Column) +"' ASC";
			}
			else if (Order == QueryBuilderOrder.Decending)
			{
				this._orderby = "ORDER BY '"+ QueryBuilder.MakeSafe (Column) +"' DESC";
			}
		}

		public int ColumnPos (string Column)
		{
			int position = 0;
			foreach (string column in this._columns)
			{
				if (Column == column)
				{
					return position;
				}
				position++;
			}
			return -1;
		}
		#endregion

		#region Public Static Methods
		public static string MakeSafe (string Value)
		{
			string result = string.Empty;

			if (Value != null)
			{
				result = Value.Replace("'","''");
			}

			return result;
		}
		#endregion
	}
}
