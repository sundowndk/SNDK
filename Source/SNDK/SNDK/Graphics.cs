//
// Graphics.cs
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
using System.Drawing;
using System.Collections;
using System.Drawing.Text;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

namespace SNDK
{
	public class Graphics
	{
		#region Static Public Methods
		static public bool ParseJob (string XML, string PathSource, string PathDestination)
		{
			bool response = false;

			Hashtable objects = new Hashtable();

			XmlTextReader reader = new XmlTextReader(new StringReader (XML));
//			XmlTextReader reader = new XmlTextReader (new StreamReader (XML));

			while (reader.Read()) 
			{
				switch (reader.NodeType) 
				{
					case XmlNodeType.Element:
											
						switch (reader.Name.ToLower())
						{
							#region NEW
							case "new":
								{
									string attname = string.Empty;
									string attwidth = string.Empty;
									string attheight = string.Empty;
								
									while (reader.MoveToNextAttribute()) 
									{
										switch (reader.Name.ToLower())
										{
											case "name":
												attname = reader.Value;
											break;								
									
											case "width":
												attwidth = reader.Value;
											break;
									
											case "height":
												attheight = reader.Value;
											break;								
										}								
									}								
															
									int width = 0;
									int height = 0;
						
									if (SNDK.Helpers.IsValidAlphaNumeric (attwidth))
									{
										width = int.Parse(attwidth);
									}
									else
									{
										string[] split = attwidth.Split(".".ToCharArray());
										if (split[1].ToLower() == "width")
										{
											width = ((Bitmap)objects[split[0]]).Width;
										}
										else if (split[1].ToLower() == "height")
										{
											width = ((Bitmap)objects[split[0]]).Height;
										}							
									}
						
									if (SNDK.Helpers.IsValidAlphaNumeric (attheight))
									{
										height = int.Parse(attheight);
									}			
									else
									{
										string[] split = attheight.Split(".".ToCharArray());
										if (split[1].ToLower() == "width")
										{
											height = ((Bitmap)objects[split[0]]).Width;
										}
										else if (split[1].ToLower() == "height")
										{
											height = ((Bitmap)objects[split[0]]).Height;
										}														
									}
									
									objects[attname] = new Bitmap(width, height);
						
									Console.WriteLine("Creating: "+ attname +" object with dimensions "+ width +" x "+ height);						
								}
						
							break;		
							#endregion
						
							#region LOAD
							case "load":
							{
								string attname = string.Empty;
								string attfilename = string.Empty;
													
								while (reader.MoveToNextAttribute())
								{
									switch (reader.Name.ToLower())
									{
										case "name":
											attname = reader.Value;
											break;								
									
										case "filename":
												attfilename = reader.Value.Replace ("%%PATHSOURCE%%", PathSource);
											break;
										}								
									}

								objects[attname] = Graphics.Load(attfilename);
								if (objects[attname] == null)
								{
									return false;
								}

								Console.WriteLine("Loading: "+ attfilename +" into "+ attname +" object.");
								}
							break;
							#endregion

							#region SAVE
							case "save":
							{
								string attsource = string.Empty;
								string attfilename = string.Empty;
								string attcodec = string.Empty;
								string attcompression = string.Empty;
								string attquality = string.Empty;

								while (reader.MoveToNextAttribute())
								{
									switch (reader.Name.ToLower())
									{
										case "source":
											attsource = reader.Value;
											break;

										case "filename":
											attfilename = reader.Value.Replace ("%%PATHDESTINATION%%", PathDestination);
											break;

										case "codec":
											attcodec = reader.Value;
											break;

										case "compression":
											attcompression = reader.Value;
											break;

										case "quality":
											attquality = reader.Value;
											break;
									}
								}

								switch (attcodec)
								{
									#region GIF
									case "gif":
										SNDK.Graphics.SaveGif(attfilename, (Bitmap)objects[attsource]);
										break;
									#endregion

									#region PNG
									case "png":
										if (SNDK.Helpers.IsValidAlphaNumeric(attcompression))
										{
											response = SNDK.Graphics.SavePng(attfilename, (Bitmap)objects[attsource], int.Parse (attcompression));
										}
										else
										{
											return false;
										}

										break;
									#endregion

									#region JPEG
									case "jpeg":
										if (SNDK.Helpers.IsValidAlphaNumeric(attquality))
										{
											response = SNDK.Graphics.SaveJpeg(attfilename, (Bitmap)objects[attsource],  long.Parse (attquality));
										}
										else
										{
											return false;
										}

										break;
									#endregion

									default:
										return false;
								}

								Console.WriteLine ("Saving "+ attcodec +": "+ attsource +" object to "+ attfilename);
								break;
							}
							#endregion

							#region SCALE
							case "scale":
								{
									string attsource = string.Empty;
									string attwidth = string.Empty;
									string attheight = string.Empty;
									string attkeepaspect = string.Empty;
									string attexact = string.Empty;
									
									while (reader.MoveToNextAttribute()) 
									{
										switch (reader.Name.ToLower())
										{
											case "source":
												attsource = reader.Value;
											break;								
									
											case "width":
												attwidth = reader.Value;
											break;
								
											case "height":
												attheight = reader.Value;
											break;
								
											case "keepaspect":
												attkeepaspect = reader.Value;
											break;
								
											case "exact":
												attexact = reader.Value;
											break;															
										}								
									}
									
									int width = 0;		
									int height = 0;
						
									if (SNDK.Helpers.IsValidAlphaNumeric(attwidth))
									{
										width = int.Parse(attwidth);
									}
									else
									{
										string[] split = attwidth.Split(".".ToCharArray());
										if (split[1].ToLower() == "width")
										{
											width = ((Bitmap)objects[split[0]]).Width;
										}
										else if (split[1].ToLower() == "height")
										{
											width = ((Bitmap)objects[split[0]]).Height;
										}							
									}
						
									if (SNDK.Helpers.IsValidAlphaNumeric(attheight))
									{
										height = int.Parse(attheight);
									}			
									else
									{
										string[] split = attheight.Split(".".ToCharArray());
										if (split[1].ToLower() == "width")
										{
											height = ((Bitmap)objects[split[0]]).Width;
										}
										else if (split[1].ToLower() == "height")
										{
											height = ((Bitmap)objects[split[0]]).Height;
										}														
									}		
						
									bool keepaspect = false;
									bool exact = false;						
						
									if (attkeepaspect.ToLower() == "true")
									{
										keepaspect = true;
									}
						
									if (attexact.ToLower() == "true")
									{
										exact = true;
									}
						
									objects[attsource] = SNDK.Graphics.Scale((Bitmap)objects[attsource], width, height, keepaspect, exact);
									
									Console.WriteLine("Scaling: "+ attsource +" object to dimensions "+ width +" x "+ height +"  keepaspect "+ keepaspect +"  exact "+ exact);						
								}
							break;
							#endregion
						
							#region PASTE
							case "paste":
								{
									string attsource = string.Empty;
									string attdestination = string.Empty;
									string attx = string.Empty;
									string atty = string.Empty;
									string attareax = string.Empty;
									string attareay = string.Empty;
									string attareawidth = string.Empty;
									string attareaheight = string.Empty;
						
									while (reader.MoveToNextAttribute()) 
									{
										switch (reader.Name.ToLower())
										{
											case "source":
												attsource = reader.Value;
											break;								
									
											case "destination":
												attdestination = reader.Value;
											break;
								
											case "x":
												attx = reader.Value;
											break;
								
											case "y":
												atty = reader.Value;
											break;
								
											case "areax":
												attareax = reader.Value;
											break;															

											case "areay":
												attareay = reader.Value;
											break;															

											case "areawidth":
												attareawidth = reader.Value;
											break;															

											case "areaheight":
												attareaheight = reader.Value;
											break;																							
										}								
									}
						
									int x = 0;		
									int y = 0;
						
									if (SNDK.Helpers.IsValidAlphaNumeric(attx))
									{
										x = int.Parse(attx);
									}
									else
									{
										string[] split = attx.Split(".".ToCharArray());
										if (split[1].ToLower() == "width")
										{
											x = ((Bitmap)objects[split[0]]).Width;
										}
										else if (split[1].ToLower() == "height")
										{
											x = ((Bitmap)objects[split[0]]).Height;
										}							
									}
						
									if (SNDK.Helpers.IsValidAlphaNumeric(atty))
									{
										y = int.Parse(atty);
									}			
									else
									{
										string[] split = atty.Split(".".ToCharArray());
										if (split[1].ToLower() == "width")
										{
											y = ((Bitmap)objects[split[0]]).Width;
										}
										else if (split[1].ToLower() == "height")
										{
											y = ((Bitmap)objects[split[0]]).Height;
										}														
									}		
						
									int areax = 0;		
									int areay = 0;
						
									if (SNDK.Helpers.IsValidAlphaNumeric(attareax))
									{
										areax = int.Parse(attareax);
									}
									else
									{
										string[] split = attareax.Split(".".ToCharArray());
										if (split[1].ToLower() == "width")
										{
											areax = ((Bitmap)objects[split[0]]).Width;
										}
										else if (split[1].ToLower() == "height")
										{
											areax = ((Bitmap)objects[split[0]]).Height;
										}							
									}
						
									if (SNDK.Helpers.IsValidAlphaNumeric(attareay))
									{
										areay = int.Parse(attareay);
									}			
									else
									{
										string[] split = attareay.Split(".".ToCharArray());
										if (split[1].ToLower() == "width")
										{
											areay = ((Bitmap)objects[split[0]]).Width;
										}
										else if (split[1].ToLower() == "height")
										{
											areay = ((Bitmap)objects[split[0]]).Height;
										}														
									}		
												
									int areawidth = 0;		
									int areaheight = 0;
						
									if (SNDK.Helpers.IsValidAlphaNumeric(attareawidth))
									{
										areawidth = int.Parse(attareawidth);
									}
									else
									{
										string[] split = attareawidth.Split(".".ToCharArray());
										if (split[1].ToLower() == "width")
										{
											areawidth = ((Bitmap)objects[split[0]]).Width;
										}
										else if (split[1].ToLower() == "height")
										{
											areawidth = ((Bitmap)objects[split[0]]).Height;
										}							
									}
						
									if (SNDK.Helpers.IsValidAlphaNumeric(attareaheight))
									{
										areaheight = int.Parse(attareaheight);
									}			
									else
									{
										string[] split = attareaheight.Split(".".ToCharArray());
										if (split[1].ToLower() == "width")
										{
											areaheight = ((Bitmap)objects[split[0]]).Width;
										}
										else if (split[1].ToLower() == "height")
										{
											areaheight = ((Bitmap)objects[split[0]]).Height;
										}														
									}						

									objects[attdestination] = SNDK.Graphics.Paste((Bitmap)objects[attdestination], (Bitmap)objects[attsource], x, y, new Rectangle(areax, areay, areawidth, areaheight));
									Console.WriteLine("Pasting: "+ attsource +" object onto "+ attdestination +" at "+ x +" x "+ y +" with dimensions "+ areax +" x "+ areay +" x "+ areawidth +" x "+ areaheight);						
								}
							break;
							#endregion
						
							#region ROTATE
							case "rotate":
								{
									string attsource = string.Empty;
									string attangle = string.Empty;
						
									while (reader.MoveToNextAttribute()) 
									{
										switch (reader.Name.ToLower())
										{
											case "source":
												attsource = reader.Value;
											break;								
									
											case "angle":
												attangle = reader.Value;
												Random random = new Random();
												attangle = random.Next(-20, 20).ToString();

											break;																	
										}								
									}	
						
									float angle = 0;
						
									angle = float.Parse(attangle);

									objects[attsource] = SNDK.Graphics.Rotate((Bitmap)objects[attsource], angle);
							
									Console.WriteLine("Rotating: "+ attsource +" object at "+ angle);
								}
							break;						
							#endregion
						
							#region TEXT
							case "text":
								{
									string attsource = string.Empty;
									string atttext = string.Empty;
									string attfontfilename = string.Empty;
									string attsize = string.Empty;
									string attcolor = string.Empty;
									string attx = string.Empty;
									string atty = string.Empty;
									string attalign = string.Empty;
						
									while (reader.MoveToNextAttribute()) 
									{
										switch (reader.Name.ToLower())
										{
											case "source":
												attsource = reader.Value;
											break;								
									
											case "text":
												atttext = reader.Value;
											break;																	
								
											case "fontfilename":
												attfontfilename = reader.Value;
											break;																	
								
											case "size":
												attsize = reader.Value;
											break;	
								
											case "color":
												attcolor = reader.Value;
											break;		
								
											case "x":
												attx = reader.Value;
											break;	
								
											case "y":
												atty = reader.Value;
											break;																	
								
											case "align":
												attalign = reader.Value;
											break;																	
										}								
									}	
						
									int x = 0;
									int y = 0;
								
									x = int.Parse(attx);
									y = int.Parse(atty);
						
									float size = 0;
						
									int alpha = 0;
									int r = 0;
									int g = 0;
									int b = 0;
						
									string[] split = attcolor.Split(",".ToCharArray());
						
									alpha = int.Parse(split[0]);
									r = int.Parse(split[1]);
									g = int.Parse(split[2]);
									b = int.Parse(split[3]);
												
									size = float.Parse(attsize);
						
									objects[attsource] = SNDK.Graphics.Text((Bitmap)objects[attsource], atttext, attfontfilename, size, Color.FromArgb(alpha, r, g, b), x, y, attalign);
						
									Console.WriteLine("Writing: "+ atttext +" on "+ attsource +" object using "+ attfontfilename +" size "+ size +" at "+ x +"x"+ y +" aligned "+ attalign);
								}
							break;						
							#endregion						
						}
						break;
				}
			}
			reader.Close();

			return response;
		}
		
		static public System.Drawing.Bitmap Load (string Path)
		{
			return new Bitmap (Path);
		}
		
		public static System.Drawing.Bitmap Text (System.Drawing.Bitmap bitmap, string text, string fontfilename, float size, Color color, int x, int y)
		{
			return SNDK.Graphics.Text(bitmap, text, fontfilename, size, color, x, y, string.Empty);
		}
		
		public static System.Drawing.Bitmap Text (System.Drawing.Bitmap bitmap, string text, string fontfilename, float size, Color color, int x, int y, string align)
		{
			System.Drawing.Bitmap result = bitmap;
			
			System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(result);
						
			PrivateFontCollection fontcollection = new PrivateFontCollection();						
			fontcollection.AddFontFile(fontfilename);
			
			Font font = new Font(fontcollection.Families[0].Name, size, GraphicsUnit.Pixel);
			
						
			StringFormat sf = new StringFormat();        			
			if (align == "center")
			{
				sf.Alignment = StringAlignment.Center;
        		sf.LineAlignment = StringAlignment.Center;		
				
				x = result.Width/2 + x;					
				y = result.Height/2 + y;
			}
			else if (align == "far")
			{
				sf.Alignment = StringAlignment.Far;
				x = result.Width - x;
			}			
			
			
			
			
			g.DrawString(text, font, new SolidBrush(color), x, y, sf);
		
			g.Dispose();
			
			return result;			
		}


		
		static public System.Drawing.Bitmap Crop (System.Drawing.Bitmap bitmap, Rectangle croparea)
		{
			// Definitions
			Bitmap result = null;
			
//			try
//			{
				// Crop image. 
				result = bitmap.Clone(croparea, bitmap.PixelFormat);
//			}
//			catch
//			{}
							   
			// Finish
   			return result;
		}
								
		static public System.Drawing.Bitmap Rotate (System.Drawing.Bitmap bitmap, float angle)			
		{
			// Defintions
			System.Drawing.Bitmap result = null;
						
 			//Get the current rectangle points
     		Point[] pts = new Point[]
     		{ 
          		new Point(0, 0),
          		new Point(bitmap.Width, 0),
          		new Point(bitmap.Width, bitmap.Height),
          		new Point(0, bitmap.Height)						 
     		}; 			
							
		     // put the center point at (0,0) for the rotation
			for (int i = 0; i < 4; i++)
			{	
				pts[i].X -= bitmap.Width / 2;
				pts[i].Y -= bitmap.Height / 2;
			}
			
			//rotate the Rectangle
			Matrix m = new Matrix();
			m.Rotate(angle);
			m.TransformPoints(pts);
			m.Dispose();
			
			//Locate the new rectangle
			int maxX = int.MinValue;
			int maxY = int.MinValue;
			int minX = int.MaxValue;
			int minY = int.MaxValue;
			for (int i = 0; i < 4; i++)
			{
				if (maxX < pts[i].X) maxX = pts[i].X;
				if (maxY < pts[i].Y) maxY = pts[i].Y;

				if (minX > pts[i].X) minX = pts[i].X;
				if (minY > pts[i].Y) minY = pts[i].Y;
			}			
			
			//reset the points to a 0,0 base
			for (int i = 0; i < 4; i++)
			{
				pts[i].X -= minX;
				pts[i].Y -= minY;
			}			
			
			//Create the new bitmap
			result = new Bitmap(maxX - minX, maxY - minY, PixelFormat.Format32bppArgb);
  
			//Rotate the image onto the new Bitmap
			System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(result);
			Point[] finalPts = new Point[] { pts[0], pts[1], pts[3] };
			g.DrawImage(bitmap, finalPts);
			g.Dispose();
			
			// Finish
			return result;
		}
				
		public static System.Drawing.Bitmap Paste(System.Drawing.Bitmap bitmap1, System.Drawing.Bitmap bitmap2, int x, int y, Rectangle area)		
		{
			// Definitions
			System.Drawing.Bitmap result = bitmap1;
							
			// Paste bitmap2 onto bitmap1
			System.Drawing.Graphics paste = System.Drawing.Graphics.FromImage(result);
			paste.DrawImage(bitmap2, x, y, area, GraphicsUnit.Pixel);			
					
			// Finish
			return result;			
		}
				
		public static System.Drawing.Bitmap Scale(System.Drawing.Bitmap bitmap, int width, int height, bool keepaspect, bool exact)
		{												
			int sourcewidth = bitmap.Width;
  			int sourceheight = bitmap.Height;

			float percent = 0;
			float percentwidth = (float)width / (float)sourcewidth;
			float percentheight = (float)height / (float)sourceheight;

			int cropx = 0;
			int cropy = 0;
			int cropwidth = 0;
			int cropheight = 0;
			
			int destinationwidth = 0;
			int destinationheight = 0;


			destinationwidth = width;
			destinationheight = height;

//			Console.WriteLine ("new dimensions: "+ destinationwidth +" x "+ destinationheight);

			if (keepaspect)
			{
				if (percentheight < percentwidth)
				{
					destinationwidth = (int)(sourcewidth * percentheight);
					destinationheight = height;
				}
				else
				{
					destinationwidth = width;
					destinationheight = (int)(sourceheight * percentwidth);
				}

//				Console.WriteLine ("keepaspect dimensions: "+ destinationwidth +" x "+ destinationheight);
			}

			if (exact)
			{
				if (destinationwidth < width)
				{
					float percent1 = (float)width / (float)destinationwidth;

					destinationwidth = width;
					destinationheight = (int)(destinationheight * percent1);

					cropx = 0;
					cropy = Math.Abs ((destinationheight - height) / 2);

				}
				else
				{
					float percent1 = (float)height / (float)destinationheight;

					destinationwidth = (int)(destinationwidth * percent1);
					destinationheight = height;

					cropx = Math.Abs ((destinationwidth - width) / 2);
					cropy = 0;
				}

				cropwidth = width;
				cropheight = height;

//				Console.WriteLine ("exact dimensions: "+ destinationwidth +" x "+ destinationheight);
//				Console.WriteLine ("exact crop: "+ cropx +" x "+ cropy +" - "+ cropwidth +" x "+ cropheight);
			}


//			Environment.Exit (0);


			Bitmap result = new Bitmap (destinationwidth, destinationheight);

			System.Drawing.Graphics scale = System.Drawing.Graphics.FromImage (result) ;
			scale.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
			scale.DrawImage (bitmap, 0, 0, destinationwidth, destinationheight) ;
			scale.Dispose ();

			if (exact)
			{
				result = Crop (result, new Rectangle (cropx, cropy, cropwidth, cropheight));
			}

			return result;
		}

		private static ImageCodecInfo GetEncoder(string mimeType)
		{
   			// Get image codecs for all image formats
   			ImageCodecInfo[] codecs = ImageCodecInfo.GetImageEncoders();

   			// Find the correct image codec
   			for (int i = 0; i < codecs.Length; i++)
			{

      			if (codecs[i].MimeType == mimeType)
         			return codecs[i];
			}
   			return null;
		}

//		public static bool Save (string filename, System.Drawing.Bitmap bitmap, )

		public static bool SaveGif(string filename, System.Drawing.Bitmap bitmap)
		{
			// Definitions
			bool success = false;
			
			try
			{
				// Gif image codec
   				ImageCodecInfo codec = GetEncoder("image/gif");

				// Check if we found a working codec
				if (codec == null)
				{
					 throw new ArgumentNullException();
				}      				
   			
				// Encoder parameter for image compression
   				EncoderParameter compressionparam = new EncoderParameter(System.Drawing.Imaging.Encoder.Compression, "100");
			
	   			EncoderParameters encoderparams = new EncoderParameters(1);
   				encoderparams.Param[0] = compressionparam;				

				// Save image
   				bitmap.Save(filename, codec, encoderparams);
				
				success = true;
			}
			catch
			{

				success = false;
			}
			
			// Finish
			return success;
		}
				
		public static bool SavePng(string filename, System.Drawing.Bitmap bitmap, long compression)
		{
			// Definitions 
			bool success = false;
			
//			try
//			{
	   			// Png image codec
   				ImageCodecInfo codec = GetEncoder("image/png");

				// Check if we found a working codec
				if (codec == null)
				{
					 throw new ArgumentNullException();
				}      				

				// Encoder parameter for image compression
   				EncoderParameter compressionparam = new EncoderParameter(System.Drawing.Imaging.Encoder.Compression, compression);
   			
	   			EncoderParameters encoderparams = new EncoderParameters(1);
   				encoderparams.Param[0] = compressionparam;

				// Save image
			Console.WriteLine (filename);
   				bitmap.Save(filename, codec, encoderparams);
				
				success = true;

//			}
//			catch
//			{
//				success = false;
//			}
			
			// Finish
			return success;
		}
						
		public static bool SaveJpeg(string filename, System.Drawing.Bitmap image, long quality)
		{
			// Definitions
			bool success = false;
			
			try
			{
	   			// Jpeg image codec
   				ImageCodecInfo codec = GetEncoder("image/jpeg");

				// Check if we found a working codec
				if (codec == null)
				{
					 throw new ArgumentNullException();
				}      				

				// Encoder parameter for image quality
   				EncoderParameter qualityparam = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, quality);
   			
	   			EncoderParameters encoderparams = new EncoderParameters(1);
   				encoderparams.Param[0] = qualityparam;

				// Save image
   				image.Save(filename, codec, encoderparams);
				
				success = true;
			}
			catch
			{
				success = false;
			}
			
			// Finish
			return success;
		}						
	}
	#endregion
}
