//
// IO.cs
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
using System.Net;
using System.Text;
using System.Collections.Generic;	
using System.Text.RegularExpressions;

using Mono.Unix;


namespace SNDK
{
	public static class IO
	{
		#region Public Static Methods



		public static void CreateSymlink (string SourcePath, string DestinationPath)
		{
			UnixFileInfo fileinfo = new UnixFileInfo (SourcePath);						
			fileinfo.CreateSymbolicLink (DestinationPath);
		}
		
		public static void RemoveSymlink (string Path)
		{
			try
			{
				if (File.Exists (Path))
				{
					File.Delete (Path);
				}
				
				if (Directory.Exists (Path))
				{
					Directory.Delete (Path);
				}
			}
			catch 
			{
				
			}
		}
		
		public static List<string> GetFilesRecursive (string Path)
		{
			List<string> result = new List<string> ();
			Stack<string> stack = new Stack<string> ();
			stack.Push(Path);
			
			while (stack.Count > 0)
			{
				string dir = stack.Pop ();

				result.AddRange (Directory.GetFiles (dir, "*.*"));
					
				foreach (string dn in Directory.GetDirectories (dir))
				{
					stack.Push (dn);
				}
			}

			return result;
		}

		public static List<string> GetDirectoriesRecursive (string Path)
		{
			List<string> result = new List<string> ();
			Stack<string> stack = new Stack<string> ();
			stack.Push(Path);

			while (stack.Count > 0)
			{
				string dir = stack.Pop ();

				result.AddRange (Directory.GetDirectories (dir, "*.*"));

				foreach (string dn in Directory.GetDirectories (dir))
				{
					stack.Push (dn);
				}
			}

			return result;
		}

		public static void CopyFile (string SourcePath, string DestiantionPath)
		{
			FileInfo fileinfo = new FileInfo (SourcePath);
			fileinfo.CopyTo (DestiantionPath);
			fileinfo = null;
		}

		public static void MoveFile (string SourcePath, string DestinationPath)
		{
			FileInfo fileinfo = new FileInfo (SourcePath);
			fileinfo.MoveTo (DestinationPath);
			fileinfo = null;
		}

		public static string GetMimeType (string Filename)
		{
//			string exec = "file ;
			System.Diagnostics.Process process = new System.Diagnostics.Process ();
//			process.StartInfo.FileName = exec;
			process.StartInfo.UseShellExecute = false;
			process.StartInfo.RedirectStandardOutput = true;
			process.StartInfo.FileName = "/usr/bin/file";
			process.StartInfo.Arguments = "--mime-type -F ';' "+ Filename;
			process.Start ();

			string output = string.Empty;
//			try
//			{
				output = process.StandardOutput.ReadToEnd ();
//			}
//			catch
//			{
//			}

			process.WaitForExit ();
			process.Close ();

//			output = output.TrimEnd ("\n".ToCharArray ());
//			output ="./media/avatars/test(18).jpg; image/jpeg";
			string[] split = output.Split (";".ToCharArray ());


			return split[1].Trim ();



//			string exec = "chmod "+ Chmod.ToString() +" \""+ Filename +"\"";
//			System.Diagnostics.Process process = new System.Diagnostics.Process();
//			process.StartInfo.FileName = exec;
//			process.Start();
		}

		public static void Chmod (string Filename, int Chmod)
		{
			string exec = "chmod "+ Chmod.ToString() +" \""+ Filename +"\"";
			System.Diagnostics.Process process = new System.Diagnostics.Process();
			process.StartInfo.FileName = exec;
			process.Start();
		}

		public static string IncrementFilename (string Path)
		{
			string path = System.IO.Path.GetDirectoryName (Path) +"/";
			string extension = System.IO.Path.GetExtension (Path);
			string filename = System.IO.Path.GetFileNameWithoutExtension (Path);
			string result = filename + extension;

			int increment = 1;
			while (File.Exists (path + result))
			{
				result = filename +"("+ increment +")" + extension;
				increment++;
			}

			return result;
		}
		
		public static List<string> ReadTextFile (string filename)
		{
			return ReadTextFile (filename, Encoding.Default);
		}

		public static List<string> ReadTextFile (string Filename, Encoding Encoding)
		{
			List<string> result = new List<string> ();
			
			if (File.Exists (Filename))
			{							
				string readline = null;
				StreamReader textfile = new StreamReader (Filename, Encoding);
				while ((readline = textfile.ReadLine ()) != null)
				{
					result.Add (readline);
				}
				textfile.Close ();
				textfile.Dispose ();
			}
			else
			{
				throw new Exception ("File not found. "+ Filename);
			}

			return result;
		}
		
		public static void WriteTextFile (string Filename, List<string> Content, bool Overwrite, bool Append, Encoding Encoding)
		{
			if ((!File.Exists (Filename)) || (Overwrite) || (Append))
			{							
				TextWriter textfile = new StreamWriter (Filename, Append, Encoding);
				foreach (string line in Content)
				{
					textfile.WriteLine (line);
				}
				textfile.Close ();
				textfile.Dispose ();
			}
			else
			{
				 throw new Exception ("File allready exists. Please use Overwrite or Append to write content to file.");
			}
		}

		public static void WriteTextFile (string Filename, List<string> Content, Encoding Encoding)
		{
			WriteTextFile (Filename, Content, false, Encoding);
		}

		public static void WriteTextFile (string Filename, List<string> Content, bool Append, Encoding Encoding)
		{
			string content = string.Empty;

			foreach (string line in Content)
			{
				content += line +"\n";
			}

			WriteTextFile (Filename, content, Append, Encoding);
		}

		public static void WriteTextFile (string Filename, string Content, Encoding Encoding)
		{
			WriteTextFile (Filename, Content, false, Encoding);
		}

		public static void WriteTextFile (string Filename, string Content, bool Append, Encoding Encoding)
		{
			if ((!File.Exists (Filename)) && (Append))
			{
				throw new Exception ("File does not exists, cannot append.");
			}
			else
			{
				TextWriter textfile = new StreamWriter (Filename, Append, Encoding);
				textfile.WriteLine (Content);
				textfile.Close ();
				textfile.Dispose ();
			}
		}
		
		public static int GetCSVColumnCount (string Filename, string Seperator)
		{
			string[] columns = null;
			string csvline = string.Empty;
			TextReader csvreader = new StreamReader (Filename);
			while ((csvline = csvreader.ReadLine ()) != null)
			{				
				columns = Regex.Split (csvline, Seperator);
				break;
			}			
			csvreader.Close ();

			return columns.Length;
		}
		
		public static byte[] FileToByteArray (string Filename)
		{
    		byte[] result = null;

			System.IO.FileStream filestream = new System.IO.FileStream (Filename, System.IO.FileMode.Open, System.IO.FileAccess.Read);
			System.IO.BinaryReader binaryreader = new System.IO.BinaryReader (filestream);

        	long totalbytes = new System.IO.FileInfo (Filename).Length;
        	result = binaryreader.ReadBytes ((Int32)totalbytes);

			binaryreader.Close();
        	filestream.Close();
        	filestream.Dispose();
			binaryreader = null;
			filestream = null;

    		return result;
		}

		public static bool ByteArrayToFile (string Filename, Byte[] InArray)
		{
    		bool response = false;

			try
			{
				FileStream filestream = new FileStream (Filename, FileMode.Create);
				BinaryWriter binarywriter = new BinaryWriter (filestream);
				binarywriter.Write (InArray);
				binarywriter.Close ();
				filestream.Close ();
				filestream.Dispose ();
				response = true;
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
			}
				return response;
		}
		
		public static string FetchURLAsString (string Url)
		{
			return FetchURLAsString (Url, Encoding.UTF8);
		}
		
		public static string FetchURLAsString (string Url, Encoding Encoding)
		{
			string page = null;
		
			string responseContent;
			HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Url);
			request.Method = "GET";
			request.KeepAlive = true;
			request.Proxy = null;

			using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
			{
				using (Stream responseStream = response.GetResponseStream())
				{					
//					using (StreamReader sr = new StreamReader(responseStream, System.Text.Encoding.GetEncoding ("ISO-8859-15")))
						using (StreamReader sr = new StreamReader(responseStream, Encoding))
						responseContent = sr.ReadToEnd();
				}
			}

			page = responseContent;

			return page;
		}		
		
		
//		public static string GetURL (string Url)
//		{
//			// used to build entire input
//			StringBuilder sb  = new StringBuilder();
//
//			// used on each read operation
//			byte[]        buf = new byte[8192];
//
//			// prepare the web page we will be asking for
//			HttpWebRequest  request  = (HttpWebRequest)
//				WebRequest.Create(Url);
//
//			// execute the request
//			HttpWebResponse response = (HttpWebResponse)
//				request.GetResponse();
//
//			// we will read data via the response stream
//			Stream resStream = response.GetResponseStream();
//
//			string tempString = null;
//			int    count      = 0;
//
//			do
//			{
//				// fill the buffer with data
//				count = resStream.Read (buf, 0, buf.Length);
//
//				// make sure we read some data
//				if (count != 0)
//				{
//					// translate from bytes to ASCII text
//					tempString = Encoding.ASCII.GetString(buf, 0, count);
//
//					// continue building the string
//					sb.Append(tempString);
//				}
//			}
//			while (count > 0); // any more data to read?
//						
//			// print out page source
//			return sb.ToString ();
//		}

		public static void DownloadToFile (string Url, string Filename)
		{
			Stream remotestream  = null;
			Stream localstream   = null;
			WebResponse response = null;

			WebRequest request = WebRequest.Create (Url);
			if (request != null)
			{
				response = request.GetResponse ();
				if (response != null)
				{
					remotestream = response.GetResponseStream ();
					localstream = File.Create (Filename);

					byte[] buffer = new byte[1024];
					int bytesread;

					do
					{
						bytesread = remotestream.Read (buffer, 0, buffer.Length);
						localstream.Write (buffer, 0, bytesread);

					} while (bytesread > 0);
				}
			}

			response.Close ();
			remotestream.Close ();
			localstream.Close ();
		}
		#endregion
	}
}
