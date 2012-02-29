//
// Date.cs
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

namespace SNDK
{		
	public static class Date
	{
		#region Public Static Methods
		
		public static DateTime GetStartOfMonth (int Year, int Month)
		{
			return new DateTime (Year, Month, 1, 0, 0, 0, 0);
		}

		public static DateTime GetEndOfMonth (int Year, int Month)
		{
			return new DateTime (Year, System.Convert.ToInt32 (Month), DateTime.DaysInMonth (Year, Month), 23, 59, 59, 999);
		}
		
		
//		public static DateTime GetStartOfMonth (int Year, SNDK.Enums.Month Month)
//		{
//			return new DateTime (Year, System.Convert.ToInt32 (Month), 1, 0, 0, 0, 0);
//		}
//
//		public static DateTime GetEndOfMonth (int Year, SNDK.Enums.Month Month)
//		{
//			return new DateTime (Year, System.Convert.ToInt32 (Month), DateTime.DaysInMonth (Year, System.Convert.ToInt32 (Month)), 23, 59, 59, 999);
//		}

		public static DateTime GetStartOfQuarter (int Year, SNDK.Enums.Quarter Quarter)
		{
			switch (Quarter)
			{
				case SNDK.Enums.Quarter.First:
					return new DateTime (Year, 1, 1, 0, 0, 0, 0);

				case SNDK.Enums.Quarter.Second:
					return new DateTime (Year, 4, 1, 0, 0, 0, 0);

				case SNDK.Enums.Quarter.Third:
					return new DateTime (Year, 7, 1, 0, 0, 0, 0);

				case SNDK.Enums.Quarter.Fourth:
					return new DateTime (Year, 10, 1, 0, 0, 0, 0);
			}

			return DateTime.Now;
		}

		public static DateTime GetEndOfQuarter (int Year, SNDK.Enums.Quarter Quarter)
		{
			switch (Quarter)
			{
				case SNDK.Enums.Quarter.First:
					return new DateTime (Year, 3, DateTime.DaysInMonth (Year, 3), 23, 59, 59, 999);

				case SNDK.Enums.Quarter.Second:
					return new DateTime (Year, 6, DateTime.DaysInMonth (Year, 6), 23, 59, 59, 999);

				case SNDK.Enums.Quarter.Third:
					return new DateTime (Year, 9, DateTime.DaysInMonth (Year, 9), 23, 59, 59, 999);

				case SNDK.Enums.Quarter.Fourth:
					return new DateTime (Year, 12, DateTime.DaysInMonth (Year, 12), 23, 59, 59, 999);
			}

			return DateTime.Now;
		}

		public static SNDK.Enums.Quarter GetQuarter (SNDK.Enums.Month Month)
		{
			if (Month <= SNDK.Enums.Month.March)
			{
				return SNDK.Enums.Quarter.First;
			}
			else if ((Month >= SNDK.Enums.Month.April) && (Month <= SNDK.Enums.Month.June))
			{
				return SNDK.Enums.Quarter.Second;
			}
			else if ((Month >=  SNDK.Enums.Month.July) && (Month <= SNDK.Enums.Month.September))
			{
				return SNDK.Enums.Quarter.Third;
 			} else
			{
				return SNDK.Enums.Quarter.Fourth;
			}
		}

		public static int CurrentDateTimeToTimestamp ()
		{
			return (int)((TimeSpan)(DateTime.Now - new DateTime (1970, 1, 1))).TotalSeconds;			
		}

		public static int DateTimeToTimestamp (DateTime Datetime)
		{
			return (int)((TimeSpan)(Datetime - new DateTime (1970, 1, 1))).TotalSeconds;
		}

		public static DateTime TimestampToDateTime (int Timestamp)
		{
			System.DateTime datetime = new System.DateTime (1970, 1, 1, 0, 0, 0, 0);
			datetime = datetime.AddSeconds (Timestamp);
			return datetime;
		}

		public static int TimeSpanToSeconds (TimeSpan Timespan)
		{
			return System.Convert.ToInt32 ((Timespan.Ticks / 10000000L));
		}

		public static TimeSpan SecondsToTimeSpan (int Seconds)
		{
			return TimeSpan.FromTicks(10000000L * Seconds);
		}

		public static int TimespanToMinutes (TimeSpan Timespan)
		{
			return (System.Convert.ToInt32 ((Timespan.Ticks / 10000000L)) / 60);
		}
		#endregion
	}
}
