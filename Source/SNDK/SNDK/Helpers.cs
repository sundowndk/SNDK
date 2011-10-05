//
// Helpers.cs
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
using System.Text;

namespace SNDK
{
	public class Helpers
	{
		#region Public Static Methods
		public static bool BoolReverse (bool Value)
		{
			if (!Value)
			{
				return true;
			}
			return false;
		}
		
		public static bool IsValidAlphaNumeric(string inputStr)
		{
			//make sure the user provided us with data to check
			//if not then return false

			if (string.IsNullOrEmpty(inputStr))

				return false;

			//now we need to loop through the string, examining each character

		    for (int i = 0; i < inputStr.Length; i++)
	    	{
		        //if this character isn't a letter and it isn't a number then return false
		        //because it means this isn't a valid alpha numeric string

		        if (!(char.IsLetter(inputStr[i])) && (!(char.IsNumber(inputStr[i]))))
	            return false;
    		}

		    //we made it this far so return true
		    return true;
		}			

		public static Decimal RoundByIncrement (Decimal Value, Decimal Increment)
		{
			Decimal numberWithoutIncrements = (Value - (Increment * System.Math.Floor(Value / Increment)));
			Decimal result = Value - numberWithoutIncrements;
			if(Increment - numberWithoutIncrements < numberWithoutIncrements)
			{
				result += Increment;
			}
			return result;
		}		
		
		public static string UpperFirstCharacter (string Value)
		{
			if (string.IsNullOrEmpty(Value))
			{
				return string.Empty;
			}
			
			char[] letters = Value.ToCharArray();
			letters[0] = char.ToUpper(letters[0]);
			return new string(letters);
		}
		
		public static string RandomString (int Length)
		{			
			StringBuilder builder = new StringBuilder ();
			Random random = new Random ();
			char ch ;
			for(int i=0; i<Length; i++)
			{
				ch = System.Convert.ToChar (System.Convert.ToInt32 (Math.Floor(26 * random.NextDouble() + 65))) ;
				builder.Append(ch);
			}

			return builder.ToString();
		}
		
		public static string PadString (string Value, int Length, string PadCharacter, bool FromStart)
		{
			string result = string.Empty;
			string padding = string.Empty;
			
			int newlength = Length-Value.Length;
			
			for (int a = 0; a<newlength; a++)
			{
				padding += PadCharacter;
			}
			
			if (FromStart) {
				result = padding + Value;
			} else {
				result = Value + padding;
			}
			
			return result; 				
		}	
		#endregion
	}
}

