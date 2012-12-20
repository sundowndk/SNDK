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
		
		public static List<T> StringToList<T> (string value)
		{
			return StringToList<T> (value, ";");
		}
		
		public static List<T> StringToList<T> (string value, string delimiter)
		{
			List<T> result = new List<T> ();
					
//			Console.WriteLine (typeof (T).FullName.ToLower ());
//			Console.WriteLine (typeof (int).FullName.ToLower ());

			foreach (string split in value.Split (delimiter.ToCharArray (), StringSplitOptions.RemoveEmptyEntries))
			{
				switch (typeof (T).FullName.ToLower ())
				{
					case "system.string":
					{
						result.Add ((T)System.Convert.ChangeType (split, typeof (T)));	
						break;
					}
						
					case "system.int32":
					{
						result.Add ((T)System.Convert.ChangeType (split, typeof (T)));
						break;
					}
						
					case "system.guid":
					{
						result.Add ((T)System.Convert.ChangeType (new Guid (split), typeof (T)));
						break;
					}
				}
			}
			
			return result;
		}

		// REMOVE REMOVE REMOVE
		public static string ListToString<T> (T List)
		{
			return ListToString (List, ";");
		}

		// REMOVE REMOVE REMOVE
		public static string ListToString<T> (T List, string Delimiter)
		{
			string result = string.Empty;
			
			System.Collections.IEnumerator enumerator = (System.Collections.IEnumerator)List.GetType ().GetMethod("GetEnumerator").Invoke (List, null);
			
			while (enumerator.MoveNext ())
			{
				result += enumerator.Current.ToString () + Delimiter;
			}				
			
			return result;
		}

		
		public static string ListToString<T> (List<T> List)
		{
			return ListToString (List, ";");
		}
		
		public static string ListToString<T> (List<T> List, string Delimiter)
		{
			string result = string.Empty;
			
			System.Collections.IEnumerator enumerator = (System.Collections.IEnumerator)List.GetType ().GetMethod("GetEnumerator").Invoke (List, null);
			
			while (enumerator.MoveNext ())
			{
				result += enumerator.Current.ToString () + Delimiter;
			}				
			
			return result;
		}
		
		
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
		
		public static XmlDocument StringToXmlDocument (string XML)
		{
			XmlDocument result = new XmlDocument ();
			result.Load (new StringReader (XML));
			return result;
		}
		
		public static XmlDocument XmlNodeToXmlDocument (XmlNode XmlNode)
		{
			XmlDocument result = new XmlDocument ();
			result.AppendChild (result.ImportNode (XmlNode, true));			
			return result;
		}
				
		public static XmlDocument ToXmlDocument (object value)
		{
			return ToXmlDocument (value, "root");
		}
		
		public static XmlDocument ToXmlDocument (object value, string rootName)
		{
			XmlDocument xmldocument = new XmlDocument ();

			XmlElement root = xmldocument.CreateElement ("", rootName, "");
			xmldocument.AppendChild (root);
			
//			root.AppendChild (ToXmlDocument (xmldocument, "top", value ));
//			root.AppendChild (ToXmlDocument (xmldocument, key, ((Hashtable)value)[key] ));			
			
			switch (value.GetType ().Name.ToLower ())
			{
				case "hashtable":
				{					
					foreach (string key in ((Hashtable)value).Keys)
					{													
						root.AppendChild (ToXmlDocument (xmldocument, key, ((Hashtable)value)[key] ));				
					}
					
					break;
				}
					
				default:
				{
					root.AppendChild (ToXmlDocument (xmldocument, "value", value ));	
//					ToXmlDocument (xmldocument, "value", value );
					
					break;
				}
			}				

			return xmldocument;
		}
		
		private static XmlElement ToXmlDocument (XmlDocument xmlDocument, string name, object data)
		{			
			XmlElement element;
			XmlAttribute type = xmlDocument.CreateAttribute ("type");
			
			switch (data.GetType ().Name.ToLower ())
			{
				case "string":
				{
					element = xmlDocument.CreateElement ("", name, "");	
					type.Value = "string";					
					element.AppendChild (xmlDocument.CreateCDataSection ((string)data));
					break;
				}
					
				case "guid":
				{
					element = xmlDocument.CreateElement ("", name, "");
					type.Value = "string";					
					element.AppendChild (xmlDocument.CreateCDataSection (((Guid)data).ToString ()));
					break;					
				}		
					
				case "int32":
				{
					element = xmlDocument.CreateElement ("", name, "");
					type.Value = "string";					
					element.AppendChild (xmlDocument.CreateCDataSection (((int)data).ToString ()));
					break;					
				}		
					
				case "int64":
				{
					element = xmlDocument.CreateElement ("", name, "");
					type.Value = "string";					
					element.AppendChild (xmlDocument.CreateCDataSection (((long)data).ToString ()));
					break;					
				}												
					
				case "decimal":
				{
					element = xmlDocument.CreateElement ("", name, "");
					type.Value = "decimal";					
					element.AppendChild (xmlDocument.CreateCDataSection (((decimal)data).ToString ()));
					break;					
				}	

				case "double":
				{
					element = xmlDocument.CreateElement ("", name, "");
					type.Value = "string";					
					element.AppendChild (xmlDocument.CreateCDataSection (((double)data).ToString ()));
					break;					
				}	
					
				case "datetime":
				{
					element = xmlDocument.CreateElement ("", name, "");
					type.Value = "string";					
					element.AppendChild (xmlDocument.CreateCDataSection (((DateTime)data).ToString ()));
					break;					
				}						
					
				case "boolean":
				{
					element = xmlDocument.CreateElement ("", name, "");
					type.Value = "boolean";
					element.AppendChild (xmlDocument.CreateCDataSection (SNDK.Convert.BoolToInt ((bool)data).ToString ()));
					break;					
				}	
					
				case "hashtable":
				{
					element = xmlDocument.CreateElement ("", name, "");
					type.Value = "hashtable";
					
					foreach (string key in ((Hashtable)data).Keys)
					{																			
						element.AppendChild (ToXmlDocument (xmlDocument, key, ((Hashtable)data)[key] ));
					}
					
					break;
				}		
					
				case "list`1":
				{					
					if (name == "value")
					{
						element = xmlDocument.CreateElement ("", data.GetType ().GetGenericArguments ()[0].ToString ().ToLower () +"s", "");
					}
					else
					{
						element = xmlDocument.CreateElement ("", name, "");
					}
					
					type.Value = "list";					
					
					System.Collections.IEnumerator enumerator = (System.Collections.IEnumerator)data.GetType ().GetMethod("GetEnumerator").Invoke (data, null);
					while (enumerator.MoveNext ())
					{						
						if (enumerator.Current.GetType ().GetMethod ("ToXmlDocument") != null)
						{
							XmlAttribute t = xmlDocument.CreateAttribute ("type");
							t.Value = "object";
							
							XmlElement e = (XmlElement)xmlDocument.ImportNode (((XmlDocument)enumerator.Current.GetType ().GetMethod ("ToXmlDocument").Invoke (enumerator.Current, null)).DocumentElement, true);
							
							e.Attributes.Append (t);
							
							element.AppendChild (e);
							
//							element.AppendChild (xmlDocument.ImportNode (((XmlDocument)enumerator.Current.GetType ().GetMethod ("ToXmlDocument").Invoke (enumerator.Current, null)).DocumentElement, true));
						}
						else
						{	
//							data.GetType ().Name.ToLower ()
//							Console.WriteLine (enumerator.Current.GetType ().ToString ().ToLower ());
							switch (enumerator.Current.GetType ().Name.ToLower ())
							{
								case "hashtable":
								{
//									XmlElement element2 = xmlDocument.CreateElement ("", enumerator.Current.GetType ().ToString ().ToLower (), "");
							
//									element2.AppendChild (ToXmlDocument (xmlDocument, "value", enumerator.Current));
									element.AppendChild (ToXmlDocument (xmlDocument, "value", enumerator.Current));
									
									break;
								}
									
								default:
								{
									XmlElement element2 = xmlDocument.CreateElement ("", enumerator.Current.GetType ().ToString ().ToLower (), "");
							
									element2.AppendChild (ToXmlDocument (xmlDocument, "value", enumerator.Current));
									element.AppendChild (element2);							
//									element.AppendChild (ToXmlDocument (xmlDocument, "value", enumerator.Current));

									break;
								}
							}
							
						}
					}
					
					break;
				}					
					
				default:
				{
					switch (data.GetType ().BaseType.Name.ToLower ())
					{
						case "enum":
						{							
							element = xmlDocument.CreateElement ("", name, "");
							type.Value = "string";
							element.AppendChild (xmlDocument.CreateCDataSection (SNDK.Convert.EnumToString ((Enum)data)));
							break;
						}
								
						default:
						{
							if (name == "value")
							{
								element = xmlDocument.CreateElement ("", data.GetType ().FullName.ToLower (), "");
							}
							else
							{
								element = xmlDocument.CreateElement ("", name, "");
							}							
//							element = xmlDocument.CreateElement ("", data.GetType ().FullName.ToLower (), "");
//							element = xmlDocument.CreateElement ("", name, "");
							type.Value = "object";
							
							if (data.GetType ().GetMethod ("ToXmlDocument") != null)
							{
								// Call ToXMLDocument on all objects inside Object, and import nodes into XmlDocument.
								foreach (XmlNode node in ((XmlDocument)data.GetType ().GetMethod ("ToXmlDocument").Invoke (data, null)).DocumentElement.ChildNodes)
								{
									element.AppendChild (xmlDocument.ImportNode (node, true));
								}
							}
							else
							{
								// TODO: Objects without the ToXmlDocument method will be skipped.
								break;
							}							

//							try
//							{
//								element.AppendChild (xmlDocument.CreateCDataSection (data.ToString().ToLower ()));
//							}
//							catch
//							{
//								element.AppendChild (xmlDocument.CreateCDataSection (string.Empty));
//							}

							break;
						}
					}
						
					break;
				}
			}
			
			element.Attributes.Append (type);

			
			return element;
		}
				
		private static void HashtableToXMLParser (XmlDocument XmlDocument, XmlElement ParentElement, Hashtable Data)
		{
			foreach (string key in Data.Keys)
			{				
				
//				ParentElement.AppendChild (HashtableToXMLParser2 (XmlDocument, key, Data[key]));
					
//				switch (Data[key].GetType ().Name.ToLower ())
//				{
//					case "string":
//					{
//						XmlElement element = XmlDocument.CreateElement ("", key, "");
//						XmlAttribute type = XmlDocument.CreateAttribute ("type");
//						type.Value = "string";
//						element.Attributes.Append (type);
//
//						element.AppendChild (XmlDocument.CreateCDataSection ((string)Data[key]));
//
//						ParentElement.AppendChild (element);
//
//						break;
//					}
					
//					case "guid":
//					{
//						XmlElement element = XmlDocument.CreateElement ("", key, "");
//						XmlAttribute type = XmlDocument.CreateAttribute ("type");
//						type.Value = "string";
//						element.Attributes.Append (type);
//					
//						element.AppendChild (XmlDocument.CreateCDataSection (((Guid)Data[key]).ToString ()));
//
//						ParentElement.AppendChild (element);
//
//						break;					
//					}

//					case "int32":
//					{
//						XmlElement element = XmlDocument.CreateElement ("", key, "");
//						XmlAttribute type = XmlDocument.CreateAttribute ("type");
//						type.Value = "string";
//						element.Attributes.Append (type);
//					
//						element.AppendChild (XmlDocument.CreateCDataSection (((int)Data[key]).ToString ()));
//
//						ParentElement.AppendChild (element);
//
//						break;					
//					}					
					
//					case "boolean":
//					{
//						XmlElement element = XmlDocument.CreateElement ("", key, "");
//						XmlAttribute type = XmlDocument.CreateAttribute ("type");
//						type.Value = "boolean";
//						element.Attributes.Append (type);
//														
//						element.AppendChild (XmlDocument.CreateCDataSection (SNDK.Convert.BoolToInt ((bool)Data[key]).ToString ()));
//
//						ParentElement.AppendChild (element);
//
//						break;					
//					}

//					case "hashtable":
//					{
//						XmlElement element = XmlDocument.CreateElement ("", key, "");
//						XmlAttribute type = XmlDocument.CreateAttribute ("type");
//						type.Value = "hashtable";
//						element.Attributes.Append (type);
//
//						HashtableToXMLParser (XmlDocument, element, (Hashtable)Data[key]);
//
//						ParentElement.AppendChild (element);
//
//						break;
//					}

//					case "list`1":
//					{
//						XmlElement element = XmlDocument.CreateElement ("", key, "");
//						XmlAttribute type = XmlDocument.CreateAttribute ("type");
//						type.Value = "list";
//						element.Attributes.Append (type);
//					
//					
//						// Get IEnumerator of Object.
////						System.Collections.IEnumerator enumerator = (System.Collections.IEnumerator)Data[key].GetType ().GetMethod("GetEnumerator").Invoke (Data[key], null);
//
//						// Enumerate objects inside Object.
////						while (enumerator.MoveNext ())
////						{					
////							HashtableToXMLParser (XmlDocument, ParentElement, enumerator.Current);
////						}
//					
////						foreach (object d in ((List<Hashtable>)Data[key]))
////						{
////							XmlElement element2 = XmlDocument.CreateElement("", "item", "");
//
//					
//
////							element.AppendChild (element2);
////						}
//					
//					
////					Console.WriteLine (Data[key].GetType ().GetGenericArguments ()[0].ToString ());
//
////						foreach (Hashtable data in ((List<Hashtable>)Data[key]))
////						{
////							XmlElement element2 = XmlDocument.CreateElement("", "item", "");
////
////							HashtableToXMLParser (XmlDocument, element2, data);
////
////							element.AppendChild (element2);
////						}
//
//						ParentElement.AppendChild (element);
//
//						break;
//					}

//					default:
//					{
//						switch (Data[key].GetType ().BaseType.Name.ToLower ())
//						{
//							case "enum":
//							{
//								XmlElement element = XmlDocument.CreateElement ("", key, "");
//								XmlAttribute type = XmlDocument.CreateAttribute ("type");
//								type.Value = "string";
//								element.Attributes.Append (type);
//								
//								
//								
//								element.AppendChild (XmlDocument.CreateCDataSection (SNDK.Convert.EnumToString ((Enum)Data[key])));
//
//								ParentElement.AppendChild (element);
//								
//								break;
//							}
//								
//							default:
//							{
//								XmlElement element = XmlDocument.CreateElement ("", key, "");
//								XmlAttribute type = XmlDocument.CreateAttribute ("type");
//								type.Value = "object";
//								element.Attributes.Append (type);
//
//								try
//								{
//									element.AppendChild (XmlDocument.CreateCDataSection (Data[key].ToString().ToLower ()));
//								}
//								catch
//								{
//									element.AppendChild (XmlDocument.CreateCDataSection (string.Empty));
//								}
//
//								ParentElement.AppendChild (element);								
//
//								break;
//							}
//						}
//						
//						break;
//					}
//				}
			}
		}		
		
		
//		private static void HashtableToXMLParser (XmlDocument XmlDocument, XmlElement ParentElement, Hashtable Data)
//		{
//			foreach (string key in Data.Keys)
//			{				
//				switch (Data[key].GetType ().Name.ToLower ())
//				{
//					case "string":
//					{
//						XmlElement element = XmlDocument.CreateElement ("", key, "");
//						XmlAttribute type = XmlDocument.CreateAttribute ("type");
//						type.Value = "string";
//						element.Attributes.Append (type);
//
//						element.AppendChild (XmlDocument.CreateCDataSection ((string)Data[key]));
//
//						ParentElement.AppendChild (element);
//
//						break;
//					}
//					
//					case "guid":
//					{
//						XmlElement element = XmlDocument.CreateElement ("", key, "");
//						XmlAttribute type = XmlDocument.CreateAttribute ("type");
//						type.Value = "string";
//						element.Attributes.Append (type);
//					
//						element.AppendChild (XmlDocument.CreateCDataSection (((Guid)Data[key]).ToString ()));
//
//						ParentElement.AppendChild (element);
//
//						break;					
//					}
//
//					case "int32":
//					{
//						XmlElement element = XmlDocument.CreateElement ("", key, "");
//						XmlAttribute type = XmlDocument.CreateAttribute ("type");
//						type.Value = "string";
//						element.Attributes.Append (type);
//					
//						element.AppendChild (XmlDocument.CreateCDataSection (((int)Data[key]).ToString ()));
//
//						ParentElement.AppendChild (element);
//
//						break;					
//					}					
//					
//					case "boolean":
//					{
//						XmlElement element = XmlDocument.CreateElement ("", key, "");
//						XmlAttribute type = XmlDocument.CreateAttribute ("type");
//						type.Value = "boolean";
//						element.Attributes.Append (type);
//														
//						element.AppendChild (XmlDocument.CreateCDataSection (SNDK.Convert.BoolToInt ((bool)Data[key]).ToString ()));
//
//						ParentElement.AppendChild (element);
//
//						break;					
//					}
//
//					case "hashtable":
//					{
//						XmlElement element = XmlDocument.CreateElement ("", key, "");
//						XmlAttribute type = XmlDocument.CreateAttribute ("type");
//						type.Value = "hashtable";
//						element.Attributes.Append (type);
//
//						HashtableToXMLParser (XmlDocument, element, (Hashtable)Data[key]);
//
//						ParentElement.AppendChild (element);
//
//						break;
//					}
//
//					case "list`1":
//					{
//						XmlElement element = XmlDocument.CreateElement ("", key, "");
//						XmlAttribute type = XmlDocument.CreateAttribute ("type");
//						type.Value = "list";
//						element.Attributes.Append (type);
//					
//					
//					// Get IEnumerator of Object.
//					System.Collections.IEnumerator enumerator = (System.Collections.IEnumerator)Data[key].GetType ().GetMethod("GetEnumerator").Invoke (Data[key], null);
//
//					// Enumerate objects inside Object.
//					while (enumerator.MoveNext ())
//					{					
//								HashtableToXMLParser (XmlDocument, ParentElement, enumerator.Current);
//					}
//					
////						foreach (object d in ((List<Hashtable>)Data[key]))
////						{
////							XmlElement element2 = XmlDocument.CreateElement("", "item", "");
//
//					
//
////							element.AppendChild (element2);
////						}
//					
//					
////					Console.WriteLine (Data[key].GetType ().GetGenericArguments ()[0].ToString ());
//
////						foreach (Hashtable data in ((List<Hashtable>)Data[key]))
////						{
////							XmlElement element2 = XmlDocument.CreateElement("", "item", "");
////
////							HashtableToXMLParser (XmlDocument, element2, data);
////
////							element.AppendChild (element2);
////						}
//
//						ParentElement.AppendChild (element);
//
//						break;
//					}
//
//					default:
//					{
//						switch (Data[key].GetType ().BaseType.Name.ToLower ())
//						{
//							case "enum":
//							{
//								XmlElement element = XmlDocument.CreateElement ("", key, "");
//								XmlAttribute type = XmlDocument.CreateAttribute ("type");
//								type.Value = "string";
//								element.Attributes.Append (type);
//								
//								
//								
//								element.AppendChild (XmlDocument.CreateCDataSection (SNDK.Convert.EnumToString ((Enum)Data[key])));
//
//								ParentElement.AppendChild (element);
//								
//								break;
//							}
//								
//							default:
//							{
//								XmlElement element = XmlDocument.CreateElement ("", key, "");
//								XmlAttribute type = XmlDocument.CreateAttribute ("type");
//								type.Value = "object";
//								element.Attributes.Append (type);
//
//								try
//								{
//									element.AppendChild (XmlDocument.CreateCDataSection (Data[key].ToString().ToLower ()));
//								}
//								catch
//								{
//									element.AppendChild (XmlDocument.CreateCDataSection (string.Empty));
//								}
//
//								ParentElement.AppendChild (element);								
//
//								break;
//							}
//						}
//						
//						break;
//					}
//				}
//			}
//		}
		
		public static object FromXmlDocument (XmlDocument xmlDocument)
		{			
			return FromXmlDocument (xmlDocument.DocumentElement.ChildNodes);		
		}
						
		private static object FromXmlDocument (XmlNodeList Nodes)
		{
			Hashtable result = new Hashtable ();
			
			foreach (XmlNode node in Nodes)
			{
				switch (node.Attributes["type"].Value.ToString().ToLower())
				{
					case "string":
					{
						result.Add (node.Name, node.InnerText);
						break;
					}

					case "decimal":
					{
//						try
//						{
//							result.Add (node.Name, decimal.Parse (node.InnerText));
							result.Add (node.Name, node.InnerText);
//						}
//						catch
//						{
//							result.Add (node.Name, 0m);
//						}
						break;
					}
						
					case "boolean":
					{
						result.Add (node.Name, SNDK.Convert.IntToBool (int.Parse (node.InnerText)));
						break;
					}

					case "hashtable":
					{
						result.Add (node.Name, FromXmlDocument (node.ChildNodes));
						break;
					}
						
					case "object":
					{						
						XmlDocument test = new XmlDocument ();
						test.AppendChild (test.ImportNode (node, true));
																			
						result.Add (node.Name, test);
						break;
					}

					case "list":
					{
						List<XmlDocument> list = new List<XmlDocument>();
						foreach (XmlNode node2 in node.ChildNodes)
						{
							XmlDocument test = new XmlDocument ();
							test.AppendChild (test.ImportNode (node2, true));
							
							list.Add (test);
//							Hashtable hashtable = new Hashtable ();
//							XMLToHashtableParser (node2.ChildNodes, hashtable);
//
//							list.Add (hashtable);
						}
						result.Add (node.Name, list);

						break;
					}
				}
			}
			
			return result;
		}
		

//		public static Hashtable XmlDocumentToHashtable (XmlDocument xmlDocument)
//		{
//			Hashtable result = new Hashtable ();
//
//			XMLToHashtableParser (xmlDocument.DocumentElement.ChildNodes, result);		
//
//			return result;
//		}		
		
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

//		public static void XMLToHashtableParser (XmlNodeList Nodes, Hashtable Item)
//		{
//			foreach (XmlNode node in Nodes)
//			{
//				switch (node.Attributes["type"].Value.ToString().ToLower())
//				{
//					case "string":
//					{
//						Item.Add(node.Name, node.InnerText);
//						break;
//					}
//						
//					case "boolean":
//					{
//						Item.Add (node.Name, SNDK.Convert.IntToBool (int.Parse (node.InnerText)));
//						break;
//					}
//
//					case "hashtable":
//					{
//						Hashtable hashtable = new Hashtable ();
//						XMLToHashtableParser (node.ChildNodes, hashtable);
//						Item.Add (node.Name, hashtable);
//
//						break;
//					}
//
//					case "list":
//					{
//						List<Hashtable> list = new List<Hashtable>();
//						foreach (XmlNode node2 in node.ChildNodes)
//						{
//							Hashtable hashtable = new Hashtable ();
//							XMLToHashtableParser (node2.ChildNodes, hashtable);
//
//							list.Add (hashtable);
//						}
//						Item.Add (node.Name, list);
//
//						break;
//					}
//				}
//			}
//		}		
		
		
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

