//
// CSVReader.cs
//
// Author:
//   Rasmus Pedersen (rasmus@akvaservice.dk)
//
// Copyright (C) 2010 Rasmus Pedsersen
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

using System;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Collections;


namespace SNDK.Toolbox
{
	public class CSVReader:IEnumerable,IEnumerator
	{
		#region Priate Fields
		List<string> _raw;
		List<List<string>> _parsed;
		List<string> _columnnames;
		private int Position=-1;
		#endregion
			
		#region Constructor
		public CSVReader (string Path, Encoding Encoding, char Delimeter)
		{
			Parse (null, Path, Encoding, Delimeter, false, 0);
		}
		
		public CSVReader (string Path, Encoding Encoding, char Delimeter, bool FirstLineIsColumnNames)
		{
			Parse (null, Path, Encoding, Delimeter,  FirstLineIsColumnNames, 0);
		}
		
		public CSVReader (string Path, Encoding Encoding, char Delimeter, int FromLine)
		{
			Parse (null, Path, Encoding, Delimeter, false, FromLine);
		}
		
		public CSVReader (string Path, Encoding Encoding, char Delimeter, bool FirstLineIsColumnNames, int FromLine)
		{
			Parse (null, Path, Encoding, Delimeter, FirstLineIsColumnNames, FromLine);
		}
		
		public CSVReader (StreamReader Stream, char Delimeter)
		{
			Parse (Stream, null, null, Delimeter, false, 0);
		}
		
		public CSVReader (StreamReader Stream, char Delimeter, bool FirstLineIsColumnNames)
		{
			Parse (Stream, null, null, Delimeter, FirstLineIsColumnNames, 0);
		}
		
		public CSVReader (StreamReader Stream, char Delimeter, int FromLine)	
		{
			Parse (Stream, null, null, Delimeter, false, FromLine);
		}
		
		public CSVReader (StreamReader Stream, char Delimeter, bool FirstLineIsColumnNames, int FromLine)
		{
			Parse (Stream, null, null, Delimeter, FirstLineIsColumnNames, FromLine);
		}
		#endregion
		
		public int Count
		{
			get
			{
				return this._parsed.Count;
			}
		}
		
		
		/* Needed since Implementing IEnumerable*/
		public IEnumerator GetEnumerator()
		{
			return (IEnumerator)this;
		}
		/* Needed since Implementing IEnumerator*/
		public bool MoveNext()
		{
			if(Position<this._parsed.Count-1)
			{
				++Position;
				return true;
			}
			else
			{
				Position = -1;
			}
			return false;
		}
		public void Reset()
		{
			Position=-1;
		}
		public object Current
		{
			get
			{
				return this._parsed[Position];
			}
		}
		
		
		#region Privat Methods
		private void Parse (StreamReader Stream, String Path, Encoding Encoding, char Delimeter, bool FirstLineIsColumnNames, int FromLine)
		{
			this._raw = new List<string> ();
			this._columnnames = new List<string> ();
			
			StreamReader reader = null;
			
			if (Stream != null)
			{
				 reader = Stream;
			}
			else
			{				
				if (File.Exists (Path))
				{	
					reader = new StreamReader (Path, Encoding);
				}
				else
				{
					throw new Exception ("File not found.");
				}							
			}
			

			
			int count = -1;
			string readline = string.Empty;
			while ((readline = reader.ReadLine ()) != null)
			{
				count++;
				
				if (FromLine != 0)
				{
					if (count < FromLine)
					{
						continue;
					}
				}
				
				this._raw.Add (readline);
			}
			
			if (Stream != null)				
			{
				reader.Close ();
				reader.Dispose ();				
			}		
			
			
			if (FirstLineIsColumnNames)
			{
				foreach (string columnname in this._raw [0].Split (Delimeter))
				{
					this._columnnames.Add (columnname);
				}
				
				this._raw.RemoveAt (0);
			}
					
			this._parsed = new List<List<string>> ();
			
			StringBuilder stringbuilder = new StringBuilder ();	
			
			List<string> fields = new List<string> ();
			
			bool inquotes = false;
			bool holdquotes = false;
			
			int line = -1;

			foreach (string data in this._raw)
			{
				int pos = -1;
				line ++;
				
				if (data == string.Empty)
				{
					continue;
				}
										
				foreach (char c in data)
				{
					pos++;
										
					if (c == '\'' || c == '"')
					{
						if (inquotes)
						{	
							// Quote at last character ends record.
							if ((data.Length - 1) == pos)
							{
								if (holdquotes)
								{
									stringbuilder.Append (c);
									holdquotes = false;
									continue;
								}
								
								inquotes = false;
								continue;
							}
							
							// If quote is followed by delimeter, end field.
							if (data.Substring (pos + 1, 1) == Delimeter.ToString ())
							{
								inquotes = false;
								continue;
							}
							
							// Insert quote that was holded.
							if (holdquotes)
							{
								stringbuilder.Append (c);
								holdquotes = false;
								continue;
								
							}							
							
							// If quote is followed by another quote, skip it.
							if (data.Substring (pos + 1, 1) == '"'.ToString () || data.Substring (pos + 1, 1) == '\''.ToString ())
							{				
								holdquotes = true;
								continue;
							}
						}
						else
						{
							inquotes = true;
							continue;
						}
					}				
				
					if (c == Delimeter)
					{
						if (inquotes)
						{
							stringbuilder.Append (c);
						}
						else
						{
							fields.Add (stringbuilder.ToString ());
							stringbuilder.Remove (0, stringbuilder.Length);
						}
					}
					else
					{
						stringbuilder.Append (c);
					}				
				}
				
				if (!inquotes)
				{
					fields.Add (stringbuilder.ToString ());
					this._parsed.Add (fields);
					fields = new List<string> ();
				
					stringbuilder.Remove (0, stringbuilder.Length);
													
					inquotes = false;
				}						
			}
		}
		#endregion
		
		#region Public Methods
		public int ColumnPos (string ColumnName)
		{
			int result = -1;
			
			foreach (string columnname in this._columnnames)
			{
				result++;

				if (columnname == ColumnName)
				{
					return result;
				}
			}
			
			result = -1;
								
			return result;
			
		}
		
		public bool ColumnExists (string ColumnName)
		{
			foreach (string columnaname in this._columnnames)
			{
				if (columnaname == ColumnName)
				{
					return true;
				}
			}
			return false;
		}
			
		#endregion
		
//		
//					string[] columns = null;
//			string csvline = string.Empty;
//			TextReader csvreader = new StreamReader (Filename);
//			while ((csvline = csvreader.ReadLine ()) != null)
//			{				
//				columns = Regex.Split (csvline, Seperator);
//				break;
//			}			
//			csvreader.Close ();
//
//			return columns.Length;
//		}
//		
//			if ((!File.Exists (Filename)) || (Overwrite) || (Append))
//			{							
//				TextWriter textfile = new StreamWriter (Filename, Append, Encoding);
//				foreach (string line in Content)
//				{
//					textfile.WriteLine (line);
//				}
//				textfile.Close ();
//				textfile.Dispose ();
//			}
//			else
//			{
//				 throw new Exception ("File allready exists. Please use Overwrite or Append to write content to file.");
//			}
	}
}

