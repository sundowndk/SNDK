// ------------------------------------------------------------------------------------------------------------------------
// animate (options)
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
animate: function(options)
{
	var _options = options;
	var _temp = { initialized: false,
		      timer: null,
		      element: null,
		      begin: 0,
		      end: 0,
		      duration: 0,
		      fps: 0,
		      frame: 0,
		      change: 0,
		      interval: 0,
		      totalframes: 0,
		      step: 0,
		      frame: 0,
		      animators: new Array(),
		      qued: false
		    };

	setOptions();

	this.dispose = functionDispose;

	this.play = functionPlay;
	this.stop = functionStop;

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

		if (typeof _options.element == 'string')
		{
			_temp.element = document.getElementById(_options.element);
		}
		else
		{
			_temp.element = _options.element;
		}

		setAnimators();

		_temp.duration = parseFloat(_options.duration);
		_temp.fps = parseFloat(_options.fps);
		_temp.interval = Math.ceil(1000 / _temp.fps);
		_temp.totalframes = Math.ceil(_temp.duration / _temp.interval);

		//_temp.step = _temp.change / _temp.totalframes;

		_temp.initalized = true;

		if (_temp.qued)
		{
			loop();
		}
	}

	// -------------------------------------
	// loop
	// -------------------------------------
	function loop()
	{
		_temp.frame++;

		for (index in _temp.animators)
		{
			// TODO: Fix for prototype, should be removed when SNDK.LightBox is ready.
	//		try
//			{		
				var animator = _temp.animators[index];
				var increase = eval('SNDK.animation.ease.' + animator.ease.toLowerCase () + '(0,' + _temp.frame + ',' + animator.begin + ',' + animator.change + ',' + _temp.totalframes + ');');

				if (animator.dom != 'opacity')
				{
					_temp.element.style[animator.dom] = increase + animator.unit;
				}
				else
				{
	
					SNDK.tools.setOpacity(_temp.element, increase);
				}
		//	}
			//catch (error)
			//{}
		}

		if (_temp.frame <= _temp.totalframes)
		{
			_temp.timer = setTimeout(function() { loop() }, _temp.interval);
		}
		else
		{
			_temp.timer = null;
			eventOnFinish();
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
	// setAnimators
	// -------------------------------------
	function setAnimators()
	{
		// LEFT
		if (_options.left != null)
		{
			var animator = new Array();

			if (_options.left.begin != null)
			{
				animator.begin = parseFloat(_options.left.begin);
			}
			else
			{
				if (_temp.element.style.left != '')
				{
					animator.begin = parseInt(_temp.element.style.left);
				}
				else
				{
					animator.begin = parseInt (_temp.element.offsetLeft);
					animator.begin -= parseInt (SNDK.tools.getStyle (_temp.element, "margin-left"));
				}
			}

			animator.end = parseFloat(_options.left.end);
			animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
			animator.ease = (_options.left.ease);
			animator.unit = 'px';
			animator.dom = 'left';

			_temp.animators[_temp.animators.length] = animator;
		}
		
		// RIGHT
		if (_options.right != null)
		{
			var animator = new Array();

			if (_options.right.begin != null)
			{
				animator.begin = parseFloat(_options.right.begin);
			}
			else
			{
				if (_temp.element.style.right != '')
				{
					animator.begin = parseInt(_temp.element.style.right);
				}
				else
				{
					animator.begin = parseInt (_temp.element.offsetRight);
					animator.begin -= parseInt (SNDK.tools.getStyle (_temp.element, "margin-right"));
				}
			}

			animator.end = parseFloat(_options.right.end);
			animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
			animator.ease = (_options.right.ease);
			animator.unit = 'px';
			animator.dom = 'right';

			_temp.animators[_temp.animators.length] = animator;
		}		
		
		// MARGINLEFT
		if (_options.marginLeft != null)
		{
			var animator = new Array();

			if (_options.marginLeft.begin != null)
			{
				animator.begin = parseFloat(_options.marginLeft.begin);
			}
			else
			{
				if (_temp.element.style.marginLeft != '')
				{
					animator.begin = parseInt(_temp.element.style.marginLeft);
				}
				else
				{
					animator.begin = parseInt (_temp.element.offsetLeft);
					animator.begin -= parseInt (SNDK.tools.getStyle (_temp.element, "margin-left"));
				}
			}

			animator.end = parseFloat(_options.marginLeft.end);
			animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
			animator.ease = (_options.marginLeft.ease);
			animator.unit = 'px';
			animator.dom = 'marginLeft';

			_temp.animators[_temp.animators.length] = animator;
		}		
		
		// MARGINRIGHT
		if (_options.marginRight != null)
		{
			var animator = new Array();
			
			if (_options.marginRight.begin != null)
			{
				animator.begin = parseFloat(_options.marginRight.begin);
			}
			else
			{
				
				if (_temp.element.style.marginRight != '')
				{
					animator.begin = parseInt(_temp.element.style.marginRight);
				}
				else
				{
					animator.begin = parseInt (_temp.element.offsetRight);
					animator.begin -= parseInt (SNDK.tools.getStyle (_temp.element, "margin-right"));
				}
			}
			
			
			animator.end = parseFloat(_options.marginRight.end);
			animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
			animator.ease = (_options.marginRight.ease);
			animator.unit = 'px';
			animator.dom = 'marginRight';

			_temp.animators[_temp.animators.length] = animator;
		}			
		
		// PADDINGRIGHT
		if (_options.paddingRight != null)
		{
			var animator = new Array();

			if (_options.paddingRight.begin != null)
			{
				animator.begin = parseFloat(_options.paddingRight.begin);
			}
			else
			{
				if (_temp.element.style.paddingRight != '')
				{
					animator.begin = parseInt(_temp.element.style.paddingRight);
				}
				else
				{
					//animator.begin = 0;
					animator.begin = parseInt (SNDK.tools.getStyle (_temp.element, "padding-right"));
				}
			}
					

			animator.end = parseFloat(_options.paddingRight.end);
			animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
			animator.ease = (_options.paddingRight.ease);
			animator.unit = 'px';
			animator.dom = 'paddingRight';

			_temp.animators[_temp.animators.length] = animator;
		}			

		// TOP
		if (_options.top != null)
		{
			var animator = new Array();

			if (_options.top.begin != null)
			{
				animator.begin = parseFloat(_options.top.begin);
			}
			else
			{
				if (_temp.element.style.top != '')
				{
					animator.begin = parseInt (_temp.element.style.top);
				}
				else
				{
					animator.begin = parseInt (_temp.element.offsetTop);
					animator.begin -= parseInt (SNDK.tools.getStyle (_temp.element, "margin-top"));
				}
			}

			animator.end = parseFloat(_options.top.end);
			animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
			animator.ease = (_options.top.ease);
			animator.unit = 'px';
			animator.dom = 'top';
			
			if (animator.begin != animator.end)
			{

			_temp.animators[_temp.animators.length] = animator;
			}
		}

		// WIDTH
		if (_options.width != null)
		{
			var animator = new Array();

			if (_options.width.begin != null)
			{
				animator.begin = parseFloat(_options.width.begin);
			}
			else
			{
				if (_temp.element.style.width != '')
				{
					animator.begin = parseInt(_temp.element.style.width);
				}
				else
				{
					animator.begin = parseInt(_temp.element.offsetWidth);
				}
			}

			animator.end = parseFloat(_options.width.end);
			animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
			animator.ease = (_options.width.ease);
			animator.unit = 'px';
			animator.dom = 'width';

			_temp.animators[_temp.animators.length] = animator;
		}
		
		// HEIGHT
		if (_options.height != null)
		{
			var animator = new Array();

			if (_options.height.begin != null)
			{
				animator.begin = parseFloat(_options.height.begin);
			}
			else
			{
				if (_temp.element.style.height != '')
				{
					animator.begin = parseInt(_temp.element.style.height);
				}
				else
				{
					animator.begin = parseInt(_temp.element.offsetHeight);
				}
			}

			animator.end = parseFloat(_options.height.end);
			animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
			animator.ease = (_options.height.ease);
			animator.unit = 'px';
			animator.dom = 'height';

			_temp.animators[_temp.animators.length] = animator;
		}		

		// OPACITY
		if (_options.opacity != null)
		{
			var animator = new Array();

			if (_options.opacity.begin != null)
			{
				animator.begin = parseFloat(_options.opacity.begin);
			}
      //			else
      //			{
      //				if (_temp.element.style.width != "")
      //				{
      //					animator.begin = parseInt (_temp.element.style.width);
      //				}
      //				else
      //				{
      //					animator.begin = parseInt (_temp.element.offsetWidth);
      //				}
      //			}

			animator.end = parseFloat(_options.opacity.end);
			animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
			animator.ease = (_options.opacity.ease);
			animator.unit = '';
			animator.dom = 'opacity';

			_temp.animators[_temp.animators.length] = animator;

			console.log('Opacity created');
		}
	}

	// -------------------------------------
	// Public functions
	// -------------------------------------	
	function functionDispose ()
	{
		_options = null;
		_temp = null;		
	}	
	
	// -------------------------------------
	// play
	// -------------------------------------
	function functionPlay()
	{
		if (_temp.initalized)
		{
			loop();
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
			clearTimeout(_temp.timer);
		}
		else
		{
			_temp.qued = false;
		}
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