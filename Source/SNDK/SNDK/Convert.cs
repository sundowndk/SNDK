//
// Convert.cs
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
	public class Convert
	{	
		#region Public Static Methods
		public static bool StringToBool (string Value)
		{
			bool result = false;
			
			switch (Value.ToLower ()) 
			{
				case "true":
					result = true;
					break;
				
				case "false":
					result = false;
					break;
					
				case "1":
					result = true;
					break;
					
				case "0":
					result = false;
					break;
			}
			
			return result;
		}
	
		public static string BoolToString (bool Value)
		{
			if (Value == true)
			{
				return "true";
			} else
			{
				return "false";
			}
		}
		
		public static T StringToEnum<T> (string value)
		{
			return (T)Enum.Parse (typeof(T), value, true);
		}
				
		public static T IntToEnum<T> (int Value)
		{
			return (T)Enum.ToObject (typeof (T), Value);
		}

		public static string IntToLetter(int Value)
		{
			string result = string.Empty;
			int i = 97;
			string prfx = "";
			int loop = 0;
			int iPrfx = 97;
			for (int iCnt = 0; iCnt <= Value; iCnt++)
			{
				loop += 1;
				result = prfx + System.Convert.ToChar(i);
				i += 1;
				if (loop == 26)
				{
					loop = 0;
					prfx = System.Convert.ToChar(iPrfx).ToString();
					iPrfx += 1;
					i = 97;
				}
			}

			return result;
		}

		public static bool IntToBool (int Value)
		{
			if (Value == 1)
			{
				return true;
			}
			else
			{
				return false;
			}
		}

		public static int BoolToInt (bool Value)
		{
			if (Value == true)
			{
				return 1;
			}
			else
			{
				return 0;
			}
		}
		#endregion	
	}
}

