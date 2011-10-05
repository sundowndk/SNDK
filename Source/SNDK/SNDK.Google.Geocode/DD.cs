//
// DD.cs
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
using System.Globalization;

namespace SNDK.Google.Geocode
{
	public class DD
	{
		#region Private Fields
		private decimal _degrees;		
		private DDType _ddtype;
		#endregion;
		
		#region Public Fields
		public decimal Degrees
		{
			get
			{
				return this._degrees;
			}
			
			set
			{
				this._degrees = value;
			}
		}
		
		public DDType DDType
		{
			get
			{
				return this._ddtype;
			}
			
			set
			{
				this._ddtype = value;
			}
		}
		#endregion
		
		#region Constructor
		internal DD ()
		{
			this._degrees = 0;
			this._ddtype = DDType.Latitude;
		}
		
		public DD (decimal Degrees, DDType DDType)
		{
			this._degrees = Degrees;
			this._ddtype = DDType;
		}
		#endregion
		
		#region Public Methods
		public DMS ToDMS ()
		{
			DMS result = new DMS ();

			result.Degrees = (int) Math.Abs (this._degrees);
			result.Minutes = (int) Math.Abs ((60 * (Math.Abs (this._degrees) - result.Degrees)));
			result.Seconds = (int) Math.Abs ((60 * ((60 * (Math.Abs (this._degrees) - result.Degrees) - result.Minutes))));
			
			if (this._ddtype == DDType.Latitude)
			{						
				if (this._degrees < 0)
				{
					result.Quadrasphere = Quadrasphere.South;
				}
				else
				{
					result.Quadrasphere = Quadrasphere.North;
				}
			}
			else if  (this._ddtype == DDType.Longitude)
			{
				if (this._degrees < 0)
				{
					result.Quadrasphere = Quadrasphere.West;
				}
				else
				{
					result.Quadrasphere = Quadrasphere.East;
				}
			}
			
			return result;
		}
		
		override public string ToString ()
		{
			return this._degrees.ToString ();
		}
		#endregion
	}
}

