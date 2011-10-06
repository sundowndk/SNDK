// ------------------------------------------------------------------------------------------------------------------------
// blobMenu (options)
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
/**
 * @constructor
 */
blobMenu : function (options)
{
	var _options = options;			
	var _elements = new Array ();
	var _temp = { initialized: false,
		      focusHover: null,
		      focusAnimation: null,
		      blurAnimation : null,
		      blurTimer: null,
		      blob: null,
		      lasthover: null,
		      home: null
		    };
						
	setOptions ();									
							
	// Initialize
	window.onDomReady (init);

	// -------------------------------------
	// Private functions
	// -------------------------------------	
	// -------------------------------------
	// init
	// -------------------------------------
	function init ()
	{															
		if (typeof _options.element == "string")
		{
			_elements["container"] = document.getElementById (_options.element);
		}
		else
		{
			_elements["container"] = _options.element;
		}
		
		var elements = _elements["container"].getElementsByTagName("*");
		for (var index = 0; index < elements.length; index++) 
		{
			var element = elements[index];
			if (element.tagName == "LI")
			{							
				element.setAttribute ("id", SNDK.tools.newGuid ());							
				element.onmouseover = eventOnMouseOver;
				element.onmouseout = eventOnMouseOut;
				
				if (element.className == "Selected")
				{
					_elements["selected"] = element;
				}
			}
		}
		
		_elements["blob"] = SNDK.tools.newElement ("li", {className: "Blob", appendTo: _elements["container"]});
		_elements["blob"].style.left = _elements["selected"].offsetLeft;
		_elements["blob"].style.top = _elements["selected"].offsetTop;		

// TODO: Needed?
//		if (!_options.blob.width)
//		{
//			_elements["blob"].style.width = _elements["selected"].offsetWidth;
//		}
		
		// Hook events	
		window.addEvent (window, 'resize', eventOnResize);						
	}							
	
	// -------------------------------------
	// setOptions
	// -------------------------------------
	function setOptions ()
	{
		if (!_options.blob) _options.blob = new Array ();
							
		if (!_options.blob.speed) _options.blob.speed = 500;
		if (!_options.blob.reset) _options.blob.reset = 500;
		
		if (!_options.blob.left) _options.blob.left = new Array ();
		if (!_options.blob.left.ease) _options.blob.left.ease = "outQuad";
		
		if (!_options.blob.top) _options.blob.top = new Array ();
		if (!_options.blob.top.ease) _options.blob.top.ease = "outQuad";
		
		if (_options.blob.width)
		{
			if (!_options.blob.width.ease) _options.blob.width.ease = "outQuad";
		}																	
	}

	// -------------------------------------
	// Events
	// -------------------------------------
	function eventOnResize ()
	{
		clearTimeout (_temp.blurTimer)
		
		if (_temp.blurAnimation != null)
		{
			_temp.blurAnimation.stop ();
		}						
		
		if (_temp.focusAnimation != null)
		{
			_temp.focusAnimation.stop ();
		}
		
		console.log ("ff")
																		
		eventOnMouseOut ();
	}
	
	// -------------------------------------
	// OnMouseOver
	// -------------------------------------									
	function eventOnMouseOver ()
	{				
		clearTimeout (_temp.blurTimer)
		
		if (_temp.blurAnimation != null)
		{
			_temp.blurAnimation.stop ();
		}						
		
		if (_temp.focusHover == this.id)
		{
			return;
		}

		if (_temp.focusAnimation != null)
		{
			_temp.focusAnimation.stop ();
		}
												
		_temp.focusHover = this.id;
			
		var top = null;
		var left = null;
		var width = null;								

		if (_options.blob.top != null)
		{
			top = {end: this.offsetTop, ease: _options.blob.left.ease};
		}

		if (_options.blob.left != null)
		{
			left = {end: this.offsetLeft, ease: _options.blob.left.ease};
		}
		
		if (_options.blob.width != null)
		{
			width = {end: this.offsetWidth, ease: _options.blob.width.ease};
		}
													
		_temp.focusAnimation = new SNDK.animation.animate ({
								element: _elements["blob"], 
								duration: options.blob.speed, 
								fps: 60, 
								top: top,
								left: left,																																							
								width: width
							});
		_temp.focusAnimation.play ();
	}

	// -------------------------------------
	// onMouseOut
	// -------------------------------------														
	function eventOnMouseOut ()
	{
		if (_temp.blurAnimation != null)
		{
			_temp.blurAnimation.stop ();
		}					
	
		var top = null;
		var left = null;
		var width = null;					
	
		if (_options.blob.top != null)
		{
			top = {end: _elements["selected"].offsetTop, ease: _options.blob.left.ease};
		}

		if (_options.blob.left != null)
		{
			left = {end: _elements["selected"].offsetLeft, ease: _options.blob.left.ease};
		}
		
		if (_options.blob.width != null)
		{
			width = {end: _elements["selected"].offsetWidth, ease: _options.blob.width.ease};
		}					
	
		_temp.blurTimer = setTimeout ( function () {
							 	_temp.focusHover = null;
								_temp.blurAnimation = new SNDK.animation.animate ({
														element: _elements["blob"],
														duration: _options.blob.speed, 
														fps: 60, 
														top: top,																		
														left: left,								
														width: width
														});
							
		_temp.blurAnimation.play ();
		}, _options.blob.reset);
	}
}				