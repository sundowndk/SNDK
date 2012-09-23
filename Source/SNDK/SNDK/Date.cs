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
		
		public static int GetDaysInMonth (int Year, int Month)
		{
			int result = 0;
			
			DateTime begin = GetStartOfMonth (Year, Month);
			DateTime end = GetEndOfMonth (Year, Month);
			
			result = (end - begin).Days + 1;
			
			return result;			
		}

		public static decimal GetMonthsBetweenDates (DateTime begin, DateTime end)
		{
			decimal result = 0;
			
			// Find out how many months there is between the two dates, ruff calculation.
			decimal months = 0;
			var dummy = begin;
			while (dummy < end)
			{
				dummy = dummy.AddMonths (1);
				months++;
			}
			
			// If begin date does not start on day one of the month, we need to know how much of the month has to be excluded.
			// We also substract 1 month from the ruff calculation of months.
			decimal segment1 = 0;
			if (begin.Day > 1)
			{
				// Findout how many days are left in the month from the given date.
				int daysleft = (SNDK.Date.GetDaysInMonth (begin.Year, begin.Month) - begin.Day) + 1;
				
				// Calculate perentage of days left.
				segment1 = Math.Round (((decimal)daysleft / (decimal)SNDK.Date.GetDaysInMonth (begin.Year, begin.Month)), 12, MidpointRounding.ToEven);
				
				// Substact 1 month from ruff calculation, since this month is not complete.
				months--;
			}
			
			// If end date does not start on day one of the month, we need to know how much of the month has to be excluded.
			// We also substract 1 month from the ruff calculation of months.
			decimal segment2 = 0;
			if (end.Day > 1)
			{
				// Findout how many days are left in the month from the given date.
				var daysleft = (SNDK.Date.GetDaysInMonth (end.Year, end.Month) - end.Day);
				
				// Calculate percentage of days left.
				segment2 = Math.Round ((1 - ((decimal)daysleft / (decimal)SNDK.Date.GetDaysInMonth (end.Year, end.Month))), 12, MidpointRounding.ToEven);				
				
				// Substract 1 month from ruff calculation, since this month is not complete.
				months--;
			}
			
			result = segment1 + segment2+ months;
			
			return result;
		}
						
		public static int GetDaysInQuarter (int Year, SNDK.Enums.Quarter Quarter)
		{
			int result = 0;
			
			DateTime begin = GetStartOfQuarter (Year, Quarter);
			DateTime end = GetEndOfQuarter (Year, Quarter);
			
			result = (end - begin).Days + 1;
			
			return result;
		}
		
		public static int GetDaysInYear (int Year)
		{
			int result = 0;
			
			DateTime begin = new DateTime (Year, 1, 1);
			DateTime end = new DateTime (Year, 12, 31, 23, 59, 59);
			
			result = (end - begin).Days + 1;
			
			return result;			
		}
						
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
		
		
		public static SNDK.Enums.Quarter GetQuarter (int Month)
		{
			if (Month == 1)
			{
				return GetQuarter (SNDK.Enums.Month.January);
			}
			
			if (Month == 2)
			{
				return GetQuarter (SNDK.Enums.Month.February);
			}
			
			if (Month == 3)
			{
				return GetQuarter (SNDK.Enums.Month.March);
			}
			
			if (Month == 4)
			{
				return GetQuarter (SNDK.Enums.Month.April);
			}
			
			if (Month == 5)
			{
				return GetQuarter (SNDK.Enums.Month.May);
			}
			
			if (Month == 6)
			{
				return GetQuarter (SNDK.Enums.Month.June);
			}
			
			if (Month == 7)
			{
				return GetQuarter (SNDK.Enums.Month.July);
			}
			
			if (Month == 8)
			{
				return GetQuarter (SNDK.Enums.Month.August);
			}
			
			if (Month == 9)
			{
				return GetQuarter (SNDK.Enums.Month.September);
			}
			
			if (Month == 10)
			{
				return GetQuarter (SNDK.Enums.Month.October);
			}
			
			if (Month == 11)
			{
				return GetQuarter (SNDK.Enums.Month.November);
			}
			
			if (Month == 12)
			{
				return GetQuarter (SNDK.Enums.Month.December);
			}
			
			return SNDK.Enums.Quarter.First;
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
