//
// Serializer.cs
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
using System.Xml.Serialization;
using System.Runtime.Serialization; 
using System.Runtime.Serialization.Formatters.Binary;

namespace SNDK
{		
	public static class Serializer
	{		
		#region Public Static Methods
		
		public static void SerializeTest1 (object ObjectToSerialize)
		{
			System.Xml.Serialization.XmlSerializer x = new System.Xml.Serialization.XmlSerializer(ObjectToSerialize.GetType());
			x.Serialize(Console.Out, ObjectToSerialize);
			x.Serialize(Console.Out, ObjectToSerialize);
			Console.WriteLine();
			Console.ReadLine();


			
		}
		
		
		public static byte[] SerializeObjectToByteArray (object ObjectToSerialize)
		{
			byte[] result;

			System.IO.MemoryStream stream = new System.IO.MemoryStream();
			BinaryFormatter binaryformatter = new BinaryFormatter();
			binaryformatter.Serialize(stream, ObjectToSerialize);
			result = stream.ToArray();
			stream.Close();

			return result;			
		}
		
		public static T DeserializeObjectFromByteArray<T> (byte[] ByteArrayToDeserialize)
		{
			T result;

			System.IO.MemoryStream stream = new System.IO.MemoryStream(ByteArrayToDeserialize);
			BinaryFormatter binaryformatter = new BinaryFormatter();
			result = (T)binaryformatter.Deserialize(stream);

			return result;
		}		

		public static string SerializeObjectToString (object ObjectToSerialize)
		{
			string result = string.Empty;

			System.IO.MemoryStream stream = new System.IO.MemoryStream();
			BinaryFormatter binaryformatter = new BinaryFormatter();
			binaryformatter.Serialize(stream, ObjectToSerialize);
			result = System.Convert.ToBase64String(stream.ToArray());
			stream.Close();

			return result;
		}
		
		public static T DeSerializeObjectFromString<T> (string StringToDeserialize)
		{
			T result;

			System.IO.MemoryStream stream = new System.IO.MemoryStream (System.Convert.FromBase64String(StringToDeserialize));
			BinaryFormatter binaryformatter = new BinaryFormatter ();
			result = (T)binaryformatter.Deserialize (stream);

			return result;
		}
		
		public static void SerializeObjectToFile (string Filename, object ObjectToSerialize)
		{
			FileInfo fileinfo = new FileInfo(Filename);
			FileStream stream = fileinfo.Open(FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None);
			BinaryFormatter binaryformatter = new BinaryFormatter();
			binaryformatter.Serialize(stream, ObjectToSerialize);
			stream.Close();
		}

		public static T DeserializeObjectFromFile<T> (string Filename)
		{
			T result;

			FileInfo fileinfo = new FileInfo(Filename);
			FileStream stream = fileinfo.Open(FileMode.Open);
			BinaryFormatter binaryformatter = new BinaryFormatter();
			result = (T)binaryformatter.Deserialize(stream);
			stream.Close ();

			return result;
		}
		#endregion
	}
}
