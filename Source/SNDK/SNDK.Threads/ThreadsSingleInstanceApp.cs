using System;
using System.Threading;
using System.Collections;
using System.Runtime.Remoting;
using System.Runtime.Remoting.Channels;
using System.Runtime.Remoting.Channels.Ipc;

namespace SNDK.Threads
{
	public class SingleInstanceApp : MarshalByRefObject
	{
		#region Defintions
		private IpcChannel _ipcchannel;								// ServerChannel
		
		private string _instancename;								// InstanceName
		private bool _isfirstinstance = false;						// IsFirstInstance
		private bool _isipcchannelopen = false;						// IsIpcChannelOpen		
		private bool _ensuresecurity = false;
		private IDictionary _properties;
		
		static private Mutex _mutex;								// Mutex
		#endregion
		
		#region Values
		/// <value>
		/// InstanceName
		/// </value>
        public string InstanceName
        {
            get { return this._instancename; }
        }
		
		/// <value>
		/// IsFirstInstance
		/// </value>
        public bool IsFirstInstance
        {
            get { return this._isfirstinstance; }
        }
				
		/// <value>
		/// ArgsForwarded
		/// </value>
		static public SNDK.Threads.SingleInstanceAppBridge.ArgsForwardedDelegate ArgsForwarded
        {
            get { return SNDK.Threads.SingleInstanceAppBridge.ArgsForwarded; }
            set { SNDK.Threads.SingleInstanceAppBridge.ArgsForwarded = value; }
        }		
		#endregion
				
		#region Metods
		/// <summary>
		/// Create Object
		/// </summary>
		public SingleInstanceApp(string instancename, bool ensuresecurity, IDictionary properties)
        {
			// Defintions
			this._instancename = instancename;			
			this._properties = properties;
			this._ensuresecurity = ensuresecurity;			
			SingleInstanceApp._mutex = new Mutex(false, instancename);
			
			// Check Mutex
            if (SingleInstanceApp._mutex.WaitOne(1000, true))
            {
				// First instance
				this.OpenServerIpcChannel();
				this._isfirstinstance = true;
            }
            else
            {                	
				// NOT first instance
                SingleInstanceApp._mutex.Close();
                SingleInstanceApp._mutex = null;															
				this.OpenClientIpcChannel();
				this._isfirstinstance = false;
            }
        }
				
		/// <summary>
		/// OpenServerIpcChannel
		/// </summary>
		private bool OpenServerIpcChannel()
		{
			// Defintions
			bool success = false;
			
			// Create IpcChannel
			//try
			//{
				this._properties["portName"] = this._instancename;						
			
				BinaryClientFormatterSinkProvider clientprovider = new BinaryClientFormatterSinkProvider();
				BinaryServerFormatterSinkProvider serverprovider = new BinaryServerFormatterSinkProvider();				
				this._ipcchannel = new IpcChannel(this._properties, clientprovider, serverprovider);
			
				ChannelServices.RegisterChannel(this._ipcchannel, this._ensuresecurity);		
				RemotingConfiguration.RegisterWellKnownServiceType(typeof(SNDK.Threads.SingleInstanceAppBridge), "args", WellKnownObjectMode.Singleton);			
				
				this._isipcchannelopen = true;
				success = true;
			//}
			//catch {}
			
			// Finish
			return success;
		}
		
		/// <summary>
		/// OpenClientIpcChannel
		/// </summary>
		private bool OpenClientIpcChannel()
		{
			// Defintions
			bool success = false;
			
			// Open IpcChannel
			//try
			//{				
				this._properties["portName"] = this._instancename +"Client";							
			
				BinaryClientFormatterSinkProvider clientprovider = new BinaryClientFormatterSinkProvider();
				BinaryServerFormatterSinkProvider serverprovider = new BinaryServerFormatterSinkProvider();				
				this._ipcchannel = new IpcChannel(this._properties, clientprovider, serverprovider);
			                                  
				ChannelServices.RegisterChannel(this._ipcchannel, this._ensuresecurity);											
				RemotingConfiguration.RegisterWellKnownClientType(typeof(SNDK.Threads.SingleInstanceAppBridge), "ipc://"+ this._instancename +"/args");			
				
				this._isipcchannelopen = true;
				success = true;
			//} 
			//catch {}

			// Finish
			return success;
		}

		/// <summary>
		/// ForwardArgs
		/// </summary>
		public bool ForwardArgs(string[] args)						
		{
			// Definitons
			bool success = false;
			
			// Forward args via AppBridge
			if (!this._isfirstinstance)
			{
				if (this._isipcchannelopen)
				{
					SingleInstanceAppBridge singleinstanceappbridge = new SingleInstanceAppBridge();		 			
					singleinstanceappbridge.ArgsForward(args);									
					success = true;					
				}
			}
			
			// Finish
			return success;
		}
		#endregion
	}
	
	public class SingleInstanceAppBridge : MarshalByRefObject
	{	
		#region Defintions
		public delegate void ArgsForwardedDelegate(string[] args);		
		private static ArgsForwardedDelegate _argsforwarded = null;
		#endregion
		
		#region Values
		/// <value>
		/// AgrsForwarded
		/// </value>
		static public ArgsForwardedDelegate ArgsForwarded
        {
            get { return _argsforwarded; }
            set { _argsforwarded = value; }
        }
		#endregion
		
		#region Methods
		/// <summary>
		/// Create Object
		/// </summary>
		public SingleInstanceAppBridge()
		{			
		}

		/// <summary>
		/// ArgsForward
		/// </summary>
        public bool ArgsForward(string[] args)
        {
			// Definitions
			bool success = false;
					
            if (_argsforwarded != null)
            {
               _argsforwarded(args);
            }
			
			// Finsish
			return success;
        }		
		#endregion
	}
}
