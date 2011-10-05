//
// AddressComponent.cs
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
using System.Collections.Generic;

namespace SNDK.Google.Geocode
{
	public class AddressComponent
	{
		#region Private Fields
		private List<Type> _types;
		private string _longname;
		private string _shortname;
		#endregion
				
		#region Public Fields
		public List<Type> Types
		{
			get
			{
				return this._types;
			}
		}
		
		public string LongName
		{
			get
			{
				return this._longname;
			}
			
			set
			{
				this._longname = value;
			}
		}
		
		public string ShortName
		{
			get
			{
				return this._shortname;
			}
			
			set
			{
				this._shortname = value;
			}
		}
		#endregion
		
		#region Constructor
		public AddressComponent ()
		{
			this._types = new List<Type> ();
			this._longname = string.Empty;
			this._shortname = string.Empty;
		}
		#endregion		
	}
}


