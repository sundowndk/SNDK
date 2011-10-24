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
using System.IO;
using System.Xml;
using System.Reflection;
using System.Collections;
using System.Collections.Generic;

namespace SNDK
{
	public class Convert
	{	
		#region Public Static Methods
		public static XmlDocument HashtabelToXmlDocument (Hashtable Value)
		{
			return HashtabelToXmlDocument (Value, "root");
		}
		
		public static XmlDocument HashtabelToXmlDocument (Hashtable Value, string RootName)
		{
			XmlDocument xmldocument = new XmlDocument ();

			XmlElement root = xmldocument.CreateElement ("", RootName, "");
			xmldocument.AppendChild (root);

			HashtableToXMLParser (xmldocument, root, Value);

			return xmldocument;			
		}
		
//		public static XmlDocument HashtabelToXMLDocumentFragment (Hashtable Value)
//		{
//			XmlDocument xmldocument = new XmlDocument ();
//
//			XmlElement root = xmldocument.CreateElement ("", "xml", "");
//			xmldocument.AppendChild (root);
//
//			HashtableToXMLParser (xmldocument, root, Value);
//
//			return xmldocument;			
//		}
//		
//		
//		public static string HashtabelToXMLString (Hashtable Value)
//		{
//			string result = string.Empty;
//
//			XmlDocument xmldocument = new XmlDocument ();
//
//			XmlElement root = xmldocument.CreateElement ("", "xml", "");
//			xmldocument.AppendChild (root);
//
//			HashtableToXMLParser (xmldocument, root, Value);
//
//			result = xmldocument.OuterXml;
//
//			return result;
//		}
		
		private static void HashtableToXMLParser (XmlDocument XmlDocument, XmlElement ParentElement, Hashtable Data)
		{
			foreach (string key in Data.Keys)
			{				
				switch (Data[key].GetType ().Name.ToLower ())
				{
					case "string":
					{
						XmlElement element = XmlDocument.CreateElement ("", key, "");
						XmlAttribute type = XmlDocument.CreateAttribute ("type");
						type.Value = "string";
						element.Attributes.Append (type);

						element.AppendChild (XmlDocument.CreateCDataSection ((string)Data[key]));

						ParentElement.AppendChild (element);

						break;
					}
					
					case "guid":
					{
						XmlElement element = XmlDocument.CreateElement ("", key, "");
						XmlAttribute type = XmlDocument.CreateAttribute ("type");
						type.Value = "string";
						element.Attributes.Append (type);
					
						element.AppendChild (XmlDocument.CreateCDataSection (((Guid)Data[key]).ToString ()));

						ParentElement.AppendChild (element);

						break;					
					}

					case "int32":
					{
						XmlElement element = XmlDocument.CreateElement ("", key, "");
						XmlAttribute type = XmlDocument.CreateAttribute ("type");
						type.Value = "string";
						element.Attributes.Append (type);
					
						element.AppendChild (XmlDocument.CreateCDataSection (((int)Data[key]).ToString ()));

						ParentElement.AppendChild (element);

						break;					
					}					
					
					case "boolean":
					{
						XmlElement element = XmlDocument.CreateElement ("", key, "");
						XmlAttribute type = XmlDocument.CreateAttribute ("type");
						type.Value = "boolean";
						element.Attributes.Append (type);
														
						element.AppendChild (XmlDocument.CreateCDataSection (SNDK.Convert.BoolToInt ((bool)Data[key]).ToString ()));

						ParentElement.AppendChild (element);

						break;					
					}

					case "hashtable":
					{
						XmlElement element = XmlDocument.CreateElement ("", key, "");
						XmlAttribute type = XmlDocument.CreateAttribute ("type");
						type.Value = "hashtable";
						element.Attributes.Append (type);

						HashtableToXMLParser (XmlDocument, element, (Hashtable)Data[key]);

						ParentElement.AppendChild (element);

						break;
					}

					case "list`1":
					{
						XmlElement element = XmlDocument.CreateElement ("", key, "");
						XmlAttribute type = XmlDocument.CreateAttribute ("type");
						type.Value = "list";
						element.Attributes.Append (type);
					
					
					// Get IEnumerator of Object.
					System.Collections.IEnumerator enumerator = (System.Collections.IEnumerator)Data[key].GetType ().GetMethod("GetEnumerator").Invoke (Data[key], null);

					// Enumerate objects inside Object.
					while (enumerator.MoveNext ())
					{					
								HashtableToXMLParser (XmlDocument, ParentElement, enumerator.Current);
					}
					
//						foreach (object d in ((List<Hashtable>)Data[key]))
//						{
//							XmlElement element2 = XmlDocument.CreateElement("", "item", "");

					

//							element.AppendChild (element2);
//						}
					
					
//					Console.WriteLine (Data[key].GetType ().GetGenericArguments ()[0].ToString ());

//						foreach (Hashtable data in ((List<Hashtable>)Data[key]))
//						{
//							XmlElement element2 = XmlDocument.CreateElement("", "item", "");
//
//							HashtableToXMLParser (XmlDocument, element2, data);
//
//							element.AppendChild (element2);
//						}

						ParentElement.AppendChild (element);

						break;
					}

					default:
					{
						switch (Data[key].GetType ().BaseType.Name.ToLower ())
						{
							case "enum":
							{
								XmlElement element = XmlDocument.CreateElement ("", key, "");
								XmlAttribute type = XmlDocument.CreateAttribute ("type");
								type.Value = "string";
								element.Attributes.Append (type);
								
								
								
								element.AppendChild (XmlDocument.CreateCDataSection (SNDK.Convert.EnumToString ((Enum)Data[key])));

								ParentElement.AppendChild (element);
								
								break;
							}
								
							default:
							{
								XmlElement element = XmlDocument.CreateElement ("", key, "");
								XmlAttribute type = XmlDocument.CreateAttribute ("type");
								type.Value = "object";
								element.Attributes.Append (type);

								try
								{
									element.AppendChild (XmlDocument.CreateCDataSection (Data[key].ToString().ToLower ()));
								}
								catch
								{
									element.AppendChild (XmlDocument.CreateCDataSection (string.Empty));
								}

								ParentElement.AppendChild (element);								

								break;
							}
						}
						
						break;
					}
				}
			}
		}

		public static Hashtable XmlDocumentToHashtable (XmlDocument xmlDocument)
		{
			Hashtable result = new Hashtable ();

			XMLToHashtableParser (xmlDocument.DocumentElement.ChildNodes, result);		

			return result;
		}		
		
//		public static Hashtable XMLToHashtabel (string XML)
//		{
//			Hashtable result = new Hashtable ();
//
//			XmlDocument xml = new XmlDocument();
//			xml.Load (new StringReader (XML));
//			
//			XmlElement root = xml.DocumentElement;
//			
//			XMLToHashtabelParser (root.ChildNodes, result);		
//
//			return result;
//			
//		}

		public static void XMLToHashtableParser (XmlNodeList Nodes, Hashtable Item)
		{
			foreach (XmlNode node in Nodes)
			{
				switch (node.Attributes["type"].Value.ToString().ToLower())
				{
					case "string":
					{
						Item.Add(node.Name, node.InnerText);
						break;
					}
						
					case "boolean":
					{
						Item.Add (node.Name, SNDK.Convert.IntToBool (int.Parse (node.InnerText)));
						break;
					}

					case "hashtable":
					{
						Hashtable hashtable = new Hashtable ();
						XMLToHashtableParser (node.ChildNodes, hashtable);
						Item.Add (node.Name, hashtable);

						break;
					}

					case "list":
					{
						List<Hashtable> list = new List<Hashtable>();
						foreach (XmlNode node2 in node.ChildNodes)
						{
							Hashtable hashtable = new Hashtable ();
							XMLToHashtableParser (node2.ChildNodes, hashtable);

							list.Add (hashtable);
						}
						Item.Add (node.Name, list);

						break;
					}
				}
			}
		}		
		
		
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
				
		public static string EnumToString (Enum value)
		{
			return value.ToString ();
		}
		
		public static int EnumToInt (object enumeration)
		{
			return (int)enumeration;
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

