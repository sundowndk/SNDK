// ------------------------------------------------------------------------------------------------------------------------
// scene (options)
// ------------------------------------------------------------------------------------------------------------------------
// .play ()
// .stop ()
// .onPlay (function)
// .onStop (function)
// .onFinish (function)
// ------------------------------------------------------------------------------------------------------------------------
/**
 * @constructor
 */
scene: function(options)
{
	var _options = options;
	var _temp = { initialized: false
		    	};
		    
	var _animations = new Array ();

	setOptions();

	this.addAnimation = functionAddAnimation;

	this.play = functionPlay;
	this.stop = functionStop;
	
	this.dispose = functionDispose;

	this.onPlay = getsetOnPlay;
	this.onStop = getsetOnStop;
	this.onFinish = getsetOnFinish;

	// Initialize
	window.onDomReady(init);

	// -------------------------------------
	// Private functions
	// -------------------------------------
	// -------------------------------------
	// init
	// -------------------------------------
	function init()
	{
		// Ready
		_temp.initalized = true;

		// Play if qued.
		if (_temp.qued)
		{
			functionPlay ();
		}
		
	}

	// -------------------------------------
	// setOptions
	// -------------------------------------
	function setOptions()
	{
		if (!_options.duration) _options.duration = 1000;
		if (!_options.fps) _options.fps = 20;
	}

	// -------------------------------------
	// Public functions
	// -------------------------------------
	// -------------------------------------
	// addAnimation
	// -------------------------------------
	function functionAddAnimation (options)
	{
		options.duration = _options.duration;
		options.fps = _options.fps;
	
		var animation = new SNDK.animation.animate (options);
		
		_animations[_animations.length] = animation;
	}


	// -------------------------------------
	// play
	// -------------------------------------
	function functionPlay()
	{
		if (_temp.initalized)
		{
			for (index in _animations)
			{
				_animations[index].play ();
			}
		}
		else
		{
			_temp.qued = true;
		}
	}

	// -------------------------------------
	// stop
	// -------------------------------------
	function functionStop()
	{
		if (_temp.initalized)
		{
			//clearTimeout(_temp.timer);
			
			for (index in _animations)
			{
				// TODO: Fix for prototype, should be removed when SNDK.LightBox is ready.
				try
				{
					_animations[index].stop ();
				}
				catch (error)
				{}
			}
			
		}
		else
		{
			_temp.qued = false;
		}
	}

	function functionDispose ()
	{
		for (index in _animations)
		{
			_animations[index].dispose ();
			_animations[index] = null;
		}
		
		_animations = null;
		_options = null;
		_temp = null;
	}

	// ------------------------------------
	// Events
	// ------------------------------------
	// ------------------------------------
	// eventOnPlay
	// ------------------------------------
	function eventOnPlay()
	{
		if (_temp.initalized)
		{
			if (_options.onPlay != null)
			{
				setTimeout(function() { _options.onPlay(); }, 1);
			}
		}
	}

	// ------------------------------------
	// eventOnStop
	// ------------------------------------
	function eventOnStop()
	{
		if (_temp.initalized)
		{
			if (_options.onStop != null)
			{
				setTimeout(function() { _options.onStop(); }, 1);
			}
		}
	}

	// ------------------------------------
	// eventOnComplete
	// ------------------------------------
	function eventOnFinish()
	{
		if (_temp.initalized)
		{
			if (_options.onFinish != null)
			{
				setTimeout(function() { _options.onFinish(); }, 1);
			}
		}
	}

	// ------------------------------------
	// GET/SET
	// ------------------------------------
	// ------------------------------------
	// onPlay
	// ------------------------------------
	function getsetOnPlay(value)
	{
		_options.onPlay = value;
	}

	// ------------------------------------
	// onStop
	// ------------------------------------
	function getsetOnStop(value)
	{
		_options.onStop = value;
	}

	// ------------------------------------
	// onFinish
	// ------------------------------------
	function getsetOnFinish(value)
	{
		_options.onFinish = value;
	}
}