//
// Crypto.cs
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
using System.Security.Cryptography;

namespace SNDK
{
	public static class Crypto
	{
		#region Public Static Methods
		public static string MD5Hash (string PlainText)
		{
			return SNDK.Crypto.MD5Hash (PlainText, string.Empty);
		}

		public static string MD5Hash (string PlainText, string Salt)
		{
//			System.Security.Cryptography.MD5CryptoServiceProvider x = new System.Security.Cryptography.MD5CryptoServiceProvider();
//			byte[] data = System.Text.Encoding.ASCII.GetBytes(PlainText);
//			data = x.ComputeHash(data);
//			string ret = "";
//			for (int i=0; i < data.Length; i++)
//				ret += data[i].ToString("x2").ToLower();
//			return ret;


			string result = string.Empty;
			HashAlgorithm hash = new MD5CryptoServiceProvider();
			byte[] plaintextbytes;

			if (Salt != null || Salt != string.Empty)
			{
				plaintextbytes = Encoding.UTF8.GetBytes (PlainText + Salt);
			}
			else
			{
				plaintextbytes = Encoding.UTF8.GetBytes (PlainText);
			}

			byte[] plaintexthash = hash.ComputeHash (plaintextbytes);

			foreach (byte x in plaintexthash)
			{
				result += String.Format("{0:x2}", x);
			}

			return result;
		}

		public static string SHAHash (SNDK.Enums.SHAHashAlgorithm HashAlgorithm, string PlainText)
		{
			return SNDK.Crypto.SHAHash (HashAlgorithm, PlainText, string.Empty);
		}

		public static string SHAHash (SNDK.Enums.SHAHashAlgorithm HashAlgorithm, string PlainText, string Salt)
		{
			string result = string.Empty;
			HashAlgorithm hash = null;
			byte[] plaintextbytes;

			switch (HashAlgorithm)
			{
			    case SNDK.Enums.SHAHashAlgorithm.SHA1:
				    hash = new SHA1Managed ();
				    break;

				case SNDK.Enums.SHAHashAlgorithm.SHA256:
				    hash = new SHA256Managed ();
				    break;

				case SNDK.Enums.SHAHashAlgorithm.SHA384:
                    hash = new SHA384Managed ();
                    break;

				case SNDK.Enums.SHAHashAlgorithm.SHA512:
                    hash = new SHA512Managed ();
                    break;
			}

			if (Salt != string.Empty || Salt != null)
			{
				plaintextbytes = Encoding.UTF8.GetBytes (PlainText+Salt);
			}
			else
			{
				plaintextbytes = Encoding.UTF8.GetBytes (PlainText);
			}

			byte[] plaintexthash = hash.ComputeHash (plaintextbytes);

			foreach (byte x in plaintexthash)
			{
				result += String.Format("{0:x2}", x);
			}

			return result;
		}
		#endregion

	}
}
