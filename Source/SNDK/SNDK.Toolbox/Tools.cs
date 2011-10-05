//
// Tools.cs
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
using System.Collections.Generic;

namespace SNDK.Toolbox
{		
	public static class Tools
	{		
		public static List<string> ParseCSVLine (string Data, char Delimeter)
		{
			List<string> strings = new List<string> ();
			StringBuilder stringbuilder = new StringBuilder ();	
						
			bool inquotes = false;
			bool holdquote = false;
					
			foreach (char c in Data)
			{
//				Console.WriteLine (c +":"+ inquotes);

				if (holdquote)
				{
					if (c == Delimeter)
					{
						stringbuilder.Remove (stringbuilder.Length-1, 1);
						holdquote = false;
						inquotes = false;
					}
					else
					{
						holdquote = false;
					}
				}
				
				if (c == '\'' || c == '"')
				{
					if (inquotes)
					{
						holdquote = true;						
					}
					else
					{
						inquotes = true;
						continue;
					}
				}				
				
				if (c == Delimeter)
				{
					if (inquotes)
					{
						stringbuilder.Append (c);
					}
					else
					{
						strings.Add (stringbuilder.ToString ());
						stringbuilder.Remove (0, stringbuilder.Length);
					}
				}
				else
				{
					stringbuilder.Append (c);
				}				
			}
			
			if (holdquote)
			{
				stringbuilder.Remove (stringbuilder.Length-1, 1 );
			}
			strings.Add (stringbuilder.ToString ());
			
			
			
//			bool inquotes = false;
//			char delimeter = Delimeter;
//			StringBuilder stringbuilder = new StringBuilder ();
			
//			bool hold = false;
//			
//			foreach (char c in Data)
//			{
//				Console.WriteLine (c +":"+ inquotes);
//				
//				
//				if (hold && (c == delimeter))
//				{
//					inquotes = false;
//					hold = false;													
//				}
//				else if (hold && inquotes)
//				{
//					hold = false;
//				//	stringbuilder.Append (@""" ");					
//				
//				}
//				
//				if (c == '\'' || c == '"')
//				{
//					if (!inquotes)
//					{
//						inquotes = true;
//						continue;
//					}
//					else
//					{
//						hold = true;						
//						continue;
//					}
//				}
//				if ( c == delimeter )
//				{
//					if( !inquotes )
//					{
////						strings.Add (stringbuilder.Replace ("'", string.Empty).Replace ("\"", string.Empty ).ToString ());
//						strings.Add (stringbuilder.ToString ());
//						stringbuilder.Remove (0, stringbuilder.Length );
//					}
//					else
//					{
//						stringbuilder.Append (c);
//					}
//				}
//				else
//				{
//					stringbuilder.Append (c);
//				}
//			}

//			strings.Add (stringbuilder.Replace ("'", string.Empty).Replace ( "\"", string.Empty).ToString ());
			
			return strings;
			
		}
	}
}