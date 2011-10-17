//
// Config.cs
//
// Author:
//   Rasmus Pedersen (rasmus@akvaservice.dk)
//
// Copyright (C) 2009 Rasmus Pedersen
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
using System.Xml;
using System.Xml.XPath;
using System.Collections.Generic;

namespace SNDK
{
	public class Config
	{
//		#region Private Static Fields
//		private static string _path;
//		private static List<Config.Section> _sections;
//		#endregion
		
		#region Private Fields
		private string _path;
		private List<Config.Section> _sections;
		#endregion 
		
		#region Constructor
		public Config (string Path)
		{
			this._path = Path;
			this._sections = new List<Section> ();
			this.Parse ();
			
		}
		#endregion
		
		#region Public Methods
		public string Get (string SectionName, string KeyName)
		{
			return this._sections.Find (delegate (Section s) { return s.Name == SectionName; }).Keys.Find (delegate (Key k) { return k.Name == KeyName; }).Value;
		}

		public List<Section> GetSections (string SectionName)
		{
			return this._sections.FindAll (delegate (Section s) { return s.Name == SectionName; });
		}
		#endregion

		#region Private Methods
		private void Parse ()
		{
			try
			{
				XmlTextReader reader = new XmlTextReader (this._path);

				bool insection = false;
				Section currentsection = null;
				string keyname = string.Empty;
				string keyvalue = string.Empty;

				while (reader.Read ())
				{
					switch (reader.NodeType)
					{

						case XmlNodeType.Element:
							if (reader.Name.ToString () == "config")
							{
								break;
							}

							if (!insection)
							{
								currentsection = new Section (reader.Name.ToString ());
								insection = true;
								break;
							}

							keyname = reader.Name.ToString ();
							keyvalue = string.Empty;

							break;

						case XmlNodeType.Text:
							keyvalue = reader.Value.ToString ();

							break;

						case XmlNodeType.EndElement:
							if (reader.Name.ToString () == "config")
							{
								break;
							}

							if (reader.Depth == 1)
							{
								this._sections.Add (currentsection);
								currentsection = null;
								insection = false;
								break;
							}

							Key key = new Key (keyname, keyvalue);
							currentsection.Keys.Add (key);
							key = null;

							break;
					}
				}
				reader.Close ();
			}
			catch (Exception exception)
			{
				Console.WriteLine (exception);
//				throw new Exception (string.Format (Strings.Exception.ToolboxConfigErrorReadingConfigFile, this._path));
			}
		}
		#endregion

		#region Public Classes
		public class Section
		{
			#region Privat Fields
			private string _name;
			private List<Key> _keys;
			#endregion

			#region Public Fields
			internal string Name
			{
				get
				{
					return this._name;
				}
				set
				{
					this._name = value;
				}
			}

			internal List<Key> Keys
			{
				get
				{
					return this._keys;
				}
			}
			#endregion

			#region Constructor
			internal Section (string Name)
			{
				this._name = Name;
				this._keys = new List<Key> ();
			}
			#endregion

			#region Public Methods
			public string Get (string KeyName)
			{
				return this._keys.Find (delegate (Key k) { return k.Name == KeyName; }).Value;
			}
			#endregion
		}
		#endregion

		#region Internal Classes
		internal class Key
		{
			#region Privat Fields
			private string _name;
			private string _value;
			#endregion

			#region Public Fields
			internal string Name
			{
				get
				{
					return this._name;
				}
				set
				{
					this._name = value;
				}
			}

			internal string Value
			{
				get
				{
					return this._value;
				}
				set
				{
					this._value = value;
				}
			}
			#endregion

			#region Constructor
			internal Key (string Name, string Value)
			{
				this._name = Name;
				this._value = Value;
			}
			#endregion
		}
		#endregion
	}
}
