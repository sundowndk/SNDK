//
// Result.cs
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
	public class Result
	{
		#region Private Fields
		private Type _type;
		private string _formattedaddress;
		private List<AddressComponent> _addresscomponents;
		private Geometry _geometry;
		private bool _partialmatch;
		#endregion
		
		#region Public Fields
		public Type Type
		{
			get
			{
				return this._type;
			}
			
			set
			{
				this._type = value;
			}
		}
		
		public string FormattedAddress
		{
			get
			{
				return this._formattedaddress;
			}
			
			set
			{
				this._formattedaddress = value;
			}
		}
		
		public List<AddressComponent> AddressComponents
		{
			get
			{
				return this._addresscomponents;
			}
		}
		
		public Geometry Geometry
		{
			get
			{
				return this._geometry;
			}
			
			set
			{
				this._geometry = value;
			}
		}
		
		public bool PartialMatch
		{
			get
			{
				return this._partialmatch;
			}
			
			set
			{
				this._partialmatch = value;
			}
		}
		#endregion
		
		#region Constructor
		internal Result ()
		{
			this._formattedaddress = string.Empty;
			this._addresscomponents = new List<AddressComponent> ();
		}
		#endregion
	}
}

