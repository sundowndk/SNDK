using System;
using System.Collections.Generic;
using System.Threading;
using System.IO;
using System.ComponentModel;

namespace SNDK.Threads
{
	public class ExtendedBackgroundWorker : BackgroundWorker
	{
		#region Private Fields
		private long _completedworkload;
		private long _totalworkload;

		private int _progresssegmentstart;
		private int _progresssegmentend;
		private int _progresssegment;

		private DateTime _timerstart;
		private DateTime _timersegment;
		private TimeSpan _timercalc;

		private int _timerprogress;
		private int _progress;
		
		private string _text1;
		private string _text2;

		private List<object> _args;
		#endregion

		#region Public Fields
		public long CompletedWorkload
		{
			get
			{
				return this._completedworkload;
			}

			set
			{
				this._completedworkload = value;
			}
		}

		public long TotalWorkload
		{
			get
			{
				return this._totalworkload;
			}

			set
			{
				this._totalworkload = value;
			}
		}

		public int ProgressSegmentStart
		{
			get
			{
				return this._progresssegmentstart;
			}

			set
			{
				this._progresssegmentstart = value;
				this._progresssegment = (this._progresssegmentend - this._progresssegmentstart);
			}
		}

		public int ProgressSegmentEnd
		{
			get
			{
				return this._progresssegmentend;
			}

			set
			{
				this._progresssegmentend = value;
				this._progresssegment = (this._progresssegmentend - this._progresssegmentstart);
			}
		}
		
		public string Text1
		{
			get
			{
				return this._text1;
			}
			
			set
			{
				this._text1 = value;
			}
		}
		
		public string Text2
		{
			get
			{
				return this._text2;
			}
			
			set
			{
				this._text2 = value;
			}
		}

		public TimeSpan ProgressETA
		{
			get
			{
//				TimeSpan result = new TimeSpan (0, 0, 0);

//				if ((DateTime.Now - this._timerstart).TotalSeconds > 5)
//				{
//					if ((DateTime.Now - this._timersegment).TotalSeconds >= 2)
//					{
						int progress = this._progress - this._progresssegmentstart;

						double percentprsecond = (DateTime.Now - this._timerstart).TotalSeconds / (progress);
						double secondsleft = ((this._progresssegmentend - this._progresssegmentstart) - progress) * percentprsecond;

//						Console.WriteLine (" "+ progress);
						this._timercalc = new TimeSpan (0, 0, (int)secondsleft);

						this._timersegment = DateTime.Now;
						this._timerprogress = this._progress;


//					}

//					Console.WriteLine ("!");
//					double wait = (DateTime.Now - this._timersegment).TotalSeconds;
//					if (wait > 5)
//					{
//						this._timersegment = DateTime.Now;

//						int progress = this._progress - this._timerprogress;
//						this._timerprogress = this._progress;

						//seconds = (DateTime.Now - this._timersegment).TotalSeconds;
//						this._timersegment = DateTime.Now;

//						double percentprsecond = (DateTime.Now - this._timerstart).TotalSeconds/this._progress;

//						double secondsleft = (100-this._progress)*percentprsecond;

//						this._timercalc = new TimeSpan (0, 0, (int)secondsleft);


//						Console.WriteLine (result);
//						Environment.Exit (0);
//					}
//				}

				return this._timercalc;
			}
		}

		public List<object> Args
		{
			get
			{
				return this._args;
			}
		}
		#endregion

		#region Constructors
		public ExtendedBackgroundWorker ()
		{
			this._completedworkload = 0;
			this._totalworkload = 0;

			this._progresssegment = 0;
			this._progresssegmentstart = 0;
			this._progresssegmentend = 100;
			this._progresssegment = (this._progresssegmentend - this._progresssegmentstart);

			this._timerstart = DateTime.Now;
			this._timersegment = DateTime.Now;
			this._timercalc = new TimeSpan (0, 0, 0);
			this._timerprogress = 0;
			
			this._text1 = string.Empty;
			this._text2 = string.Empty;

			this._args = new List<object> ();
		}

		public ExtendedBackgroundWorker (long TotalWorkload)
		{
			this._completedworkload = 0;
			this._totalworkload = TotalWorkload;

			this._progresssegment = 0;
			this._progresssegmentstart = 0;
			this._progresssegmentend = 100;
			this._progresssegment = (this._progresssegmentend - this._progresssegmentstart);

			this._timerstart = DateTime.Now;
			this._timersegment = DateTime.Now;
			this._timercalc = new TimeSpan (0, 0, 0);
			this._timerprogress = 0;
			
			this._text1 = string.Empty;
			this._text2 = string.Empty;

			this._args = new List<object> ();
		}

		public ExtendedBackgroundWorker (long TotalWorkload, int ProgressSegmentStart, int ProgressSegmentEnd)
		{
			this._completedworkload = 0;
			this._totalworkload = TotalWorkload;

			this._progresssegment = 0;
			this._progresssegmentstart = ProgressSegmentStart;
			this._progresssegmentend = ProgressSegmentEnd;
			this._progresssegment = (this._progresssegmentend - this._progresssegmentstart);

			this._timerstart = DateTime.Now;
			this._timersegment = DateTime.Now;
			this._timercalc = new TimeSpan (0, 0, 0);
			this._timerprogress = 0;

			this._text1 = string.Empty;
			this._text2 = string.Empty;
			
			this._args = new List<object> ();
		}

		public void ReportProgress ()
		{
			this.ReportProgress (-1);
		}

		new public void ReportProgress (int Progress)
		{
			if (Progress == -1)
			{
				Progress = System.Convert.ToInt32 (((this._completedworkload * this._progresssegment) / this._totalworkload) + this._progresssegmentstart);

				if (Progress > 100)
				{
					Progress = 100;
				}
			}

			base.ReportProgress (Progress);
			this._progress = Progress;
		}
		#endregion

		#region Public Methods
		public void ProgressInit (int ProgressSegmentStart, int ProgressSegmentEnd)
		{
			this.ProgressInit (ProgressSegmentStart, ProgressSegmentEnd, 0, 0);
		}

		public void ProgressInit (int ProgressSegmentStart, int ProgressSegmentEnd, int TotalWorkload)
		{
			this.ProgressInit (ProgressSegmentStart, ProgressSegmentEnd, TotalWorkload, 0);
		}

		public void ProgressInit (int ProgressSegmentStart, int ProgressSegmentEnd, int TotalWorkload, int CompletedWorkload)
		{
			this._completedworkload = CompletedWorkload;
			this._totalworkload = TotalWorkload;

			this._progresssegmentstart = ProgressSegmentStart;
			this._progresssegmentend = ProgressSegmentEnd;

			this._progresssegment = (this._progresssegmentend - this._progresssegmentstart);

			this._timerstart = DateTime.Now;
			this._timersegment = DateTime.Now;
		}
		#endregion
	}
}
