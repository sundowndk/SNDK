//
// Arg.cs
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

namespace SNDK.Toolbox
{	
	public class Arg
	{
		#region Public Static Fields
		public static string Description
		{
			get
			{
				string result = string.Empty;

				int longestargname = 0;

				foreach (Arg arg in Arg._args)
				{
					if (longestargname < arg._longname.Length)
					{
						longestargname = arg._longname.Length;
					}
				}

				result = "\n";
				foreach (SNDK.Toolbox.Arg arg in SNDK.Toolbox.Arg._args)
				{
					string line = string.Empty;

					if (arg._name != string.Empty)
					{
						line += "-"+ arg._name;
						if (arg._longname != string.Empty)
						{
							line += ",";
						}
					}
					else
					{
						line += "   ";
					}

					if (arg._longname != string.Empty)
					{
						line += "  --"+ arg._longname;
						if (arg._hasvalue)
						{
							if (arg._valuename != string.Empty)
							{
								line += "="+ arg._valuename;
							}
							else
							{
								line += "=VALUE";
							}
						}
					}

					line = SNDK.Helpers.PadString (line, longestargname + 14, " ", false);
					if (arg._valuename != string.Empty)
					{
						line += ""+ string.Format (arg._description, arg._valuename);
					}
					else
					{
						line += ""+ arg._description;
					}
					line += "\n";

					result += line;
				}

				return result;
			}
		}
		#endregion

		#region Private Static Fields
		private static List<Arg> _args = new List<Arg> ();
		#endregion

		#region Private Fields
		private string _internalname;
		private string _name;
		private string _longname;
		private string _value;
		private string _description;
		private bool _hasvalue;
		private string _valuename;
		private bool _wasfound;
		#endregion

		#region Constructor
		private Arg ()
		{
			this._internalname = string.Empty;
			this._name = string.Empty;
			this._longname = string.Empty;
			this._value = string.Empty;
			this._description = string.Empty;
			this._hasvalue = false;
			this._wasfound = false;
		}
		#endregion

		#region Public Static Methods
		public static bool Found (string InternalName)
		{
			foreach (SNDK.Toolbox.Arg arg in SNDK.Toolbox.Arg._args)
			{
				if (arg._internalname == InternalName)
				{
					if (arg._wasfound)
					{
						return true;
					}
				}
			}
			return false;
		}

		public static string Value (string InternalName)
		{
			foreach (SNDK.Toolbox.Arg arg in SNDK.Toolbox.Arg._args)
			{
				if (arg._internalname == InternalName)
				{
					if (arg._wasfound)
					{
						return arg._value;
					}
				}
			}
			return string.Empty;
		}

		public static void Add (string InternalName, string Name)
		{
			SNDK.Toolbox.Arg.Add (InternalName, Name, string.Empty, string.Empty, false, string.Empty);
		}

		public static void Add (string InternalName, string Name, string Descriptipn)
		{
			SNDK.Toolbox.Arg.Add (Name, string.Empty, Description, false, string.Empty);
		}

		public static void Add (string InternalName, string Name, string Description, bool HasValue)
		{
			SNDK.Toolbox.Arg.Add (Name, string.Empty, Description, HasValue, string.Empty);
		}

		public static void Add (string InternalName, string Name, string Description, bool HasValue, string ValueName)
		{
			SNDK.Toolbox.Arg.Add (Name, string.Empty, Description, HasValue, string.Empty);
		}

		public static void Add (string InternalName, string Name, string LongName, string Description, bool HasValue, string ValueName)
		{
			SNDK.Toolbox.Arg arg = new SNDK.Toolbox.Arg ();
			arg._internalname = InternalName;
			arg._name = Name;
			arg._longname = LongName;
			arg._hasvalue = HasValue;
			arg._valuename = ValueName;
			arg._description = Description;

			SNDK.Toolbox.Arg._args.Add(arg);
		}

		public static void Parse(string[] args)
		{

			foreach (string argument in args)
			{
				if (argument.Substring (0, 2) == "--")
				{
					string longname = argument.Substring (2, argument.Length-2);
					string value = string.Empty;

					string[] splitarg = longname.Split ("=".ToCharArray());
					if (splitarg.Length > 1)
					{
						longname = splitarg[0];
						value = splitarg[1];
					}

					SNDK.Toolbox.Arg arg = SNDK.Toolbox.Arg.FindByLongName (longname);
					if (arg != null)
					{
						arg._wasfound = true;
						arg._value = value;
					}
				}
				else if (argument.Substring (0, 1) == "-")
				{
					string name = argument.Substring (1, argument.Length-1);
					string value = string.Empty;

					string[] splitarg = name.Split ("=".ToCharArray());
					if (splitarg.Length > 1)
					{
						name = splitarg[0];
						value = splitarg[1];

						SNDK.Toolbox.Arg arg = SNDK.Toolbox.Arg.FindByName (name);
						if (arg != null)
						{
							arg._wasfound = true;
							arg._value = value;
						}
					}
					else
					{
						for (int i = 0; i < name.Length; i++)
						{
							SNDK.Toolbox.Arg arg = SNDK.Toolbox.Arg.FindByName (name.Substring (i, 1));
							if (arg != null)
							{
								arg._wasfound = true;
							}
						}
					}
				}
			}
		}
		#endregion

		#region Private Static Methods
		private static SNDK.Toolbox.Arg FindByName (string Name)
		{
			foreach (SNDK.Toolbox.Arg arg in SNDK.Toolbox.Arg._args)
			{
				if (arg._name == Name)
				{
					return arg;
				}
			}

			return null;
		}

		private static SNDK.Toolbox.Arg FindByLongName (string LongName)
		{
			foreach (SNDK.Toolbox.Arg arg in SNDK.Toolbox.Arg._args)
			{
				if (arg._longname == LongName)
				{
					return arg;
				}
			}

			return null;
		}
		#endregion
	}
}
