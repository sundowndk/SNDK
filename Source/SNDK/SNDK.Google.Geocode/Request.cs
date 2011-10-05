//
// Request.cs
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
using System.IO;
using System.Xml;
using System.Text;
using System.Net;
using System.Collections.Generic;
using System.Globalization;

using SNDK.DBI;
using SNDK.Enums;

namespace SNDK.Google.Geocode
{
	public class Request
	{
		#region Private Static Fields
		private static string ServerUrl = "http://maps.google.com/maps/api/geocode/xml?";
		#endregion
		
		#region Private Fields
		private List<Result> _results;
		#endregion
				
		#region Public Fields
		#endregion
		
		#region Constructor
		private Request (string Address, string Region, LatLng Latlng, BoundingBox Bounds, bool Sensor)
		{
			// Build request URL.
			string url = Request.ServerUrl;
			
			if (Address != string.Empty)
			{
				url += "address="+ Address;
			}
			else if (Latlng != null)
			{
				url += "latlng=";
			}
			else
			{
				throw new Exception ("blablabla");
			}
			
			if (Region != string.Empty)
			{
				url += "&region="+ Region;
			}
			
			if (Bounds != null)
			{
				url += "&bounds=";
			}
			
			url +=  "&sensor="+ Sensor.ToString ().ToLower ();
			
			string xmlresponse = string.Empty;
			
			// Is cache enabled?
			if (Cache.Enabled)
			{
				xmlresponse = Cache.Get (url);
			}
			
			// Fetch from URL.
			if (xmlresponse == string.Empty)
			{
				Console.WriteLine ("Fetch");
				
				// Fetch result from URL.
				string responseContent = string.Empty;
				HttpWebRequest request = (HttpWebRequest)WebRequest.Create (url);
				request.Method = "GET";
				request.KeepAlive = false;
				request.Proxy = null;
				
				using (HttpWebResponse response = (HttpWebResponse)request.GetResponse ())
				{
					using (Stream responseStream = response.GetResponseStream ())
					{
						using (StreamReader sr = new StreamReader(responseStream, System.Text.Encoding.UTF8))
							responseContent = sr.ReadToEnd();
					}
				}
				
				xmlresponse = responseContent;
				
				// Store xmlrepsonse in database.
				if (Cache.Enabled)
				{
					Cache.Set (url, xmlresponse);
				}
			}
			

			
			XmlTextReader reader = new XmlTextReader (new System.IO.StringReader(xmlresponse));

			
			List<Result> results = new List<Result> ();
			
			while (reader.Read ())
			{
				#region GEOCODERESPONSE
				if ((reader.Name.ToLower () == "geocoderesponse") && (reader.NodeType == XmlNodeType.Element))
				{
					while (reader.Read ())
					{
						#region GEOCODERESPONSE -> STATUS
						if ((reader.Name.ToLower () == "status") && (reader.NodeType == XmlNodeType.Element))
						{
							reader.Read ();
							
							if (reader.Value.ToString () == "OK")
							{
							}
							
							if (reader.Value.ToString () == "ZERO_RESULTS")
							{
								break;
							}
							
							if (reader.Value.ToString () ==  "OVER_QUERY_LIMIT")
							{
								break;
							}
							
							if (reader.Value.ToString () == "REQUEST_DENIED")
							{
								break;
							}
							
							if (reader.Value.ToString () == "INVALID_REQUEST")
							{
								break;
							}
						}
						#endregion
						
						#region GEOCODERESPONSE -> RESULT
						if ((reader.Name.ToLower () == "result") && (reader.NodeType == XmlNodeType.Element))
						{
							Result result = new Result ();
							
							while (reader.Read ())
							{
								#region GEOCODERESPONSE -> RESULT -> TYPE
								if ((reader.Name.ToLower () == "type") && (reader.NodeType == XmlNodeType.Element))
								{
									reader.Read ();
									result.Type = (Type)Enum.Parse (typeof (Type), reader.Value.ToString ().Replace ("_", ""), true);
								}
								#endregion

								#region GEOCODERESPONSE -> RESULT -> FORMATTED_ADDRESS
								if ((reader.Name.ToLower () == "formatted_address") && (reader.NodeType == XmlNodeType.Element))
								{
									reader.Read ();
									result.FormattedAddress = reader.Value.ToString ();
								}
								#endregion
								
								#region GEOCODERESPONSE -> RESULT -> ADDRESS_COMPONENT
								if ((reader.Name.ToLower () == "address_component") && (reader.NodeType == XmlNodeType.Element))
								{
									AddressComponent addresscomponent = new AddressComponent ();
									
									while (reader.Read ())
									{
										#region GEOCODERESPONSE -> RESULT -> ADDRESS_COMPONENT -> LONG_NAME
										if ((reader.Name.ToLower () == "long_name") && (reader.NodeType == XmlNodeType.Element))
										{
											reader.Read ();
											addresscomponent.LongName = reader.Value.ToString ();
										}
										#endregion
										
										#region GEOCODERESPONSE -> RESULT -> ADDRESS_COMPONENT -> SHORT_NAME
										if ((reader.Name.ToLower () == "short_name") && (reader.NodeType == XmlNodeType.Element))
										{
											reader.Read ();
											addresscomponent.ShortName = reader.Value.ToString ();
										}
										#endregion
										
										#region GEOCODERESPONSE -> RESULT -> ADDRESS_COMPONENT -> TYPE
										if ((reader.Name.ToLower () == "type") && (reader.NodeType == XmlNodeType.Element))
										{
											reader.Read ();
											addresscomponent.Types.Add ((Type)Enum.Parse (typeof (Type), reader.Value.ToString ().Replace ("_", ""), true));
										}
										#endregion
										
										#region END ADDRESS_COMPONENT
										if ((reader.Name.ToLower () == "address_component") && (reader.NodeType == XmlNodeType.EndElement))
										{
											break;
										}
										#endregion
									}
									
									result.AddressComponents.Add (addresscomponent);
									addresscomponent = null;
								}
								#endregion
								
								#region GEOCODERESPONSE -> RESULT -> GEOMETRY
								if ((reader.Name.ToLower () == "geometry") && (reader.NodeType == XmlNodeType.Element))
								{
									result.Geometry = new Geometry ();
									
									while (reader.Read ())
									{
										#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> LOCATION
										if ((reader.Name.ToLower () == "location") && (reader.NodeType == XmlNodeType.Element))
										{
											decimal latitude = 0;
											decimal longitude = 0;
										
											while (reader.Read ())
											{
												#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> LOCATION -> LAT
												if ((reader.Name.ToLower () == "lat") && (reader.NodeType == XmlNodeType.Element))
												{
													reader.Read ();
													latitude = decimal.Parse (reader.Value.ToString ().Replace (".", CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator));
												}
												#endregion
											
												#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> LOCATION -> LNG
												if ((reader.Name.ToLower () == "lng") && (reader.NodeType == XmlNodeType.Element))
												{
													reader.Read ();
													longitude = decimal.Parse (reader.Value.ToString ().Replace (".", CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator));
												}
												#endregion
												
												#region END LOCATION
												if ((reader.Name.ToLower () == "location") && (reader.NodeType == XmlNodeType.EndElement))
												{													
													break;
												}
												#endregion
											}
											
											result.Geometry.Location = new LatLng (latitude, longitude);
										}
										#endregion
									
										#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> LOCATIONTYPE
										if ((reader.Name.ToLower () == "location_type") && (reader.NodeType == XmlNodeType.Element))
										{
											reader.Read ();
											result.Geometry.Type = (LocationType)Enum.Parse (typeof (LocationType), reader.Value.ToString ().Replace ("_", ""), true);
										}
										#endregion
									
										#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> VIEWPORT
										if ((reader.Name.ToLower () == "viewport") && (reader.NodeType == XmlNodeType.Element))
										{
											result.Geometry.Viewport = new BoundingBox ();
											
											while (reader.Read ())
											{
												#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> VIEWPORT -> SOUTHWEST
												if ((reader.Name.ToLower () == "southwest") && (reader.NodeType == XmlNodeType.Element))
												{
													decimal latitude = 0;
													decimal longitude = 0;
													
													while (reader.Read ())
													{
														#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> VIEWPORT -> SOUTHwEST -> LAT
														if ((reader.Name.ToLower () == "lat") && (reader.NodeType == XmlNodeType.Element))
														{
															reader.Read ();
															latitude = decimal.Parse (reader.Value.ToString ().Replace (".", CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator));
														}
														#endregion
													
														#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> VIEWPORT -> SOUTHWEST -> LNG
														if ((reader.Name.ToLower () == "lng") && (reader.NodeType == XmlNodeType.Element))
														{
															reader.Read ();
															longitude = decimal.Parse (reader.Value.ToString ().Replace (".", CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator));
														}
														#endregion
													
														#region END
														if ((reader.Name.ToLower () == "southwest") && (reader.NodeType == XmlNodeType.EndElement))
														{
															break;
														}
														#endregion
													}
													
													result.Geometry.Viewport.SouthWest = new LatLng (latitude, longitude);
												}
												#endregion
										
												#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> VIEWPORT -> NORTHEAST
												if ((reader.Name.ToLower () == "northeast") && (reader.NodeType == XmlNodeType.Element))
												{
													decimal latitude = 0;
													decimal longitude = 0;
													
													while (reader.Read ())
													{
														#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> VIEWPORT -> SOUTHwEST -> LAT
														if ((reader.Name.ToLower () == "lat") && (reader.NodeType == XmlNodeType.Element))
														{
															reader.Read ();
															latitude = decimal.Parse (reader.Value.ToString ().Replace (".", CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator));
														}
														#endregion
													
														#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> VIEWPORT -> SOUTHWEST -> LNG
														if ((reader.Name.ToLower () == "lng") && (reader.NodeType == XmlNodeType.Element))
														{
															reader.Read ();
															longitude = decimal.Parse (reader.Value.ToString ().Replace (".", CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator));
														}
														#endregion
													
														#region END
														if ((reader.Name.ToLower () == "northeast") && (reader.NodeType == XmlNodeType.EndElement))
														{
															break;
														}
														#endregion
													}
													
													result.Geometry.Viewport.NorthEast = new LatLng (latitude, longitude);
												}
												#endregion
										
												#region END VIEWPORT
												if ((reader.Name.ToLower () == "viewport") && (reader.NodeType == XmlNodeType.EndElement))
												{
													break;
												}
												#endregion
											}
										}
										#endregion
									
										#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> BOUNDS
										if ((reader.Name.ToLower () == "bounds") && (reader.NodeType == XmlNodeType.Element))
										{
											result.Geometry.Bounds = new BoundingBox ();
											
											while (reader.Read ())
											{
												#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> BOUNDS -> SOUTHWEST
												if ((reader.Name.ToLower () == "southwest") && (reader.NodeType == XmlNodeType.Element))
												{
													decimal latitude = 0;
													decimal longitude = 0;
													
													while (reader.Read ())
													{
														#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> BOUNDS -> SOUTHwEST -> LAT
														if ((reader.Name.ToLower () == "lat") && (reader.NodeType == XmlNodeType.Element))
														{
															reader.Read ();
															latitude = decimal.Parse (reader.Value.ToString ().Replace (".", CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator));
														}
														#endregion
													
														#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> BOUNDS -> SOUTHWEST -> LNG
														if ((reader.Name.ToLower () == "lng") && (reader.NodeType == XmlNodeType.Element))
														{
															reader.Read ();
															longitude = decimal.Parse (reader.Value.ToString ().Replace (".", CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator));
														}
														#endregion
													
														#region END
														if ((reader.Name.ToLower () == "southwest") && (reader.NodeType == XmlNodeType.EndElement))
														{
															break;
														}
														#endregion
													}
													
													result.Geometry.Bounds.SouthWest = new LatLng (latitude, longitude);
												}
												#endregion
											
												#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> BOUNDS -> NORTHEAST
												if ((reader.Name.ToLower () == "northeast") && (reader.NodeType == XmlNodeType.Element))
												{
													decimal latitude = 0;
													decimal longitude = 0;
													
													while (reader.Read ())
													{
														#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> BOUNDS -> SOUTHwEST -> LAT
														if ((reader.Name.ToLower () == "lat") && (reader.NodeType == XmlNodeType.Element))
														{
															reader.Read ();
															latitude = decimal.Parse (reader.Value.ToString ().Replace (".", CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator));
														}
														#endregion
													
														#region GEOCODERESPONSE -> RESULT -> GEOMETRY -> BOUNDS -> SOUTHWEST -> LNG
														if ((reader.Name.ToLower () == "lng") && (reader.NodeType == XmlNodeType.Element))
														{
															reader.Read ();
															longitude = decimal.Parse (reader.Value.ToString ().Replace (".", CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator));
														}
														#endregion
													
														#region END
														if ((reader.Name.ToLower () == "northeast") && (reader.NodeType == XmlNodeType.EndElement))
														{
															break;
														}
														#endregion
													}
													
													result.Geometry.Bounds.NorthEast = new LatLng (latitude, longitude);
												}
												#endregion
										
												#region END BOUNDS
												if ((reader.Name.ToLower () == "bounds") && (reader.NodeType == XmlNodeType.EndElement))
												{
													break;
												}
												#endregion
											}
										}
										#endregion
								
										#region END GEOMETRY
										if ((reader.Name.ToLower () == "geometry") && (reader.NodeType == XmlNodeType.EndElement))
										{
											break;
										}
										#endregion
									}
								}
								#endregion
								
								#region GEOCODERRESPONSE -> RESULT -> PARTIALMATCH
								if ((reader.Name.ToLower () == "partial_match") && (reader.NodeType == XmlNodeType.Element))
								{
									reader.Read ();
									result.PartialMatch = SNDK.Convert.StringToBool (reader.Value.ToString ());
								}
								#endregion
								
								#region END RESULT
								if ((reader.Name.ToLower () == "result") && (reader.NodeType == XmlNodeType.EndElement))
								{
									break;
								}
								#endregion
							}
							
							results.Add (result);
							result = null;
						}
						#endregion
						
						#region END GEOCODERESPONSE
						if ((reader.Name.ToLower () == "geocoderesponse") && (reader.NodeType == XmlNodeType.EndElement))
						{
							break;
						}
						#endregion
					}
				}
				#endregion
			}
			reader.Close ();
			
			

			
			foreach (Result r in results)
			{
				Console.WriteLine ("RESULT:");
				Console.WriteLine ("Type: "+ r.Type.ToString ());
				Console.WriteLine ("FormattedAddress: "+ r.FormattedAddress);
				Console.WriteLine ("");
				
				foreach (AddressComponent a in r.AddressComponents)
				{
					Console.WriteLine ("AddressComponent:");
					foreach (Type t in a.Types)
					{
						Console.WriteLine ("Type: "+ t.ToString ());
					}
					
					Console.WriteLine (a.LongName + " - "+ a.ShortName);
					Console.WriteLine ("");
				}
				
				Console.WriteLine ("LocationType: "+ r.Geometry.Type);
				Console.WriteLine ("LatLng: "+ r.Geometry.Location.ToString ());
				Console.WriteLine ("");
				Console.WriteLine ("ViewPort: "+ r.Geometry.Viewport.NorthEast.ToString ());
				Console.WriteLine ("Bounds: "+ r.Geometry.Viewport.SouthWest.ToString ());
				
				Console.WriteLine ("PartialMatch: "+ r.PartialMatch);
				
				Console.WriteLine ("----------------------------------");
				
			}
			
			
		}
		#endregion
		
		#region Public Static Methods
		public static List<Result> Send (string Address)
		{
			Request result = new Request (Address, string.Empty, null, null, false);
			
			return result._results;
		}
		
//		public List<Result> Send (string Address, bool Sensor)
//		{
//			List<Result> result = new List<Result> ();
//			
//			this._address = Address;
//			this._latlng = null;
//			this._region = string.Empty;
//			this._bounds = null;
//			this._sensor = Sensor;
//			
//			return result;
//		}
		
//		public List<Result> Send (string Address, string Region, bool Sensor)
//		{
//			List<Result> result = new List<Result> ();
//			
//			this._address = Address;
//			this._latlng = null;
//			this._region = Region;
//			this._bounds = null;
//			this._sensor = Sensor;
//			
//			return result; 
//		}
		
//		public List<Result> Send (string Address, string Region, BoundingBox Bounds, bool Sensor)
//		{
//			List<Result> result = new List<Result> ();
//			
//			this._address = Address;
//			this._latlng = null;
//			this._region = Region;
//			this._bounds = Bounds;
//			this._sensor = Sensor;
//			
//			return result;
//		}
		
//		public List<Result> MakeRequest (string Address, string Region, BoundingBox Bounds, Language Language, bool Sensor)
//		{
//		}
		
//		public List<Result> Send (LatLng LatLng)
//		{
//			List<Result> result = new List<Result> ();
//			
//			this._address = string.Empty;
//			this._latlng = LatLng;
//			this._region = string.Empty;
//			this._bounds = null;
//			this._sensor = false;
//				
//			return result;
//		}
		
//		public List<Result> Send (LatLng LatLng, bool Sensor)
//		{
//			List<Result> result = new List<Result> ();
//			
//			this._address = string.Empty;
//			this._latlng = LatLng;
//			this._region = string.Empty;
//			this._bounds = null;
//			this._sensor = Sensor;
//			
//			return result;
//		}
		
//		public List<Result> Send (LatLng LatLng, string Region, bool Sensor)
//		{
//			List<Result> result = new List<Result> ();
//			
//			this._address = string.Empty;
//			this._latlng = LatLng;
//			this._region = Region;
//			this._bounds = null;
//			this._sensor = Sensor;
//			
//			return result;
//		}
		
//		public List<Result> Send (LatLng Latlng, string Region, BoundingBox Bounds, bool Sensor)
//		{
//			List<Result> result = new List<Result> ();
//			
//			this._address = string.Empty;
//			this._latlng = Latlng;
//			this._region = Region;
//			this._bounds = Bounds;
//			this._sensor = Sensor;
//			
//			return result;
//		}
		
//		public List<Result> MakeRequest (string Address, string Region, BoundingBox Bounds, Language Language, bool Sensor)
//		{
//		}
		#endregion
	}
}

