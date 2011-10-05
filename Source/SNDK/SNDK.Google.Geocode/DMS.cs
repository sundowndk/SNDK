//
// DMS.cs
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

using SNDK.Enums;

namespace SNDK.Google.Geocode
{
	public class DMS
	{
		#region Private Fields
		private int _degrees;
		private int _minutes;
		private int _seconds;
		private Quadrasphere _quadrasphere;
		#endregion
		
		#region Public Fields
		public int Degrees
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
		
		public int Minutes
		{
			get
			{
				return this._minutes;
			}
			
			set
			{
				this._minutes = value;
			}
		}
		
		public int Seconds
		{
			get
			{
				return this._seconds;
			}
			
			set
			{
				this._seconds = value;
			}
		}
		
		public Quadrasphere Quadrasphere
		{
			get
			{
				return this._quadrasphere;
			}
			
			set
			{
				this._quadrasphere = value;
			}
		}
		#endregion
		
		#region Constructor
		internal DMS ()
		{
			this._degrees = 0;
			this._minutes = 0;
			this._seconds = 0;
			this._quadrasphere = Quadrasphere.North;
		}
		
		public DMS (int Degrees, int Minutes, Quadrasphere Quadrasphere)
		{
			this._degrees = Degrees;
			this._minutes = Minutes;
			this._seconds = 0;
			this._quadrasphere = Quadrasphere;
		}
		
		public DMS (int Degrees, int Minutes, int Seconds, Quadrasphere Quadrasphere)
		{
			this._degrees = Degrees;
			this._minutes = Minutes;
			this._seconds = Seconds;
			this._quadrasphere = Quadrasphere;
		}
		#endregion
		
		#region Public Methods
		public DD ToDD ()
		{
			DD result = new DD ();

			decimal degrees = this._degrees;
			decimal minutes = this._minutes;
			decimal seconds = this._seconds;
				
			if ((this._quadrasphere == Quadrasphere.North) || (this._quadrasphere == Quadrasphere.East))
			{
				result.Degrees =  (degrees + minutes / 60) + (seconds / 3600);
				
				if (this._quadrasphere == Quadrasphere.North)
				{
					result.DDType = DDType.Latitude;		
				}
				else
				{
					result.DDType = DDType.Longitude;
				}			
			}
			else if ((this._quadrasphere == Quadrasphere.South) || (this._quadrasphere == Quadrasphere.West))
			{
				result.Degrees =  Math.Abs ((degrees + minutes / 60) + (seconds / 3600)) * (-1);
				result.DDType = DDType.Longitude;
				
				if (this._quadrasphere == Quadrasphere.South)
				{
					result.DDType = DDType.Latitude;
				}
				else
				{
					result.DDType =  DDType.Longitude;
				}
			}
						
			return result;
		}
		
		override public string ToString ()
		{
			return this._degrees + " "+ this._minutes +"\" "+ this._seconds +"' " +this._quadrasphere;
		}
		#endregion
	}
}
