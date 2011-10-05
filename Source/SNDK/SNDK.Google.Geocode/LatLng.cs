//
// LatLng.cs
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

namespace SNDK.Google.Geocode
{
	public class LatLng
	{
		#region Private Fields
		private DD _latitude;
		private DD _longitude;
		#endregion
		
		#region Public Fields
		public DD Latitude
		{
			get
			{
				return this._latitude;
			}
			
			set
			{
				this._latitude = value;
			}
		}
		
		public DD Longitude
		{
			get
			{
				return this._longitude;
			}
			
			set
			{
				this._longitude = value;
			}
		}
		#endregion
		
		#region Constructor
		public LatLng ()
		{
			this._latitude = new DD ();
			this._longitude = new DD ();
		}
		
		public LatLng (Decimal Latitude, Decimal Longitude)
		{
			this._latitude = new DD (Latitude, DDType.Latitude);
			this._longitude = new DD (Longitude, DDType.Longitude);
		}
		
		public LatLng (DD Latitude, DD Longitude)
		{
			this._latitude = Latitude;
			this._longitude = Longitude;
		}
		
		public LatLng (DMS Latitude, DMS Longitude)
		{
			this._latitude = Latitude.ToDD ();
			this._longitude  = Longitude.ToDD ();
		}
		#endregion
		
		#region Public Methods
		override public string ToString ()
		{
			return this._latitude.Degrees.ToString () + ", "+ this._longitude.Degrees.ToString ();
		}
		#endregion
	}
}

