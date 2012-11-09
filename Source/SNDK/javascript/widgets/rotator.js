// ------------------------------------
// rotator
// ------------------------------------		
/**
 * @constructor
 */
rotator : function (options)
{
	var _initialized = false;
	var _id = SNDK.tools.newGuid ();
	var _elements = new Array ();
	var _options = options;	
	var _defaults = {	stylesheet: "SNDK-Rotator",
				fadeDelay: 500,
				fadeDouble: false,
				randomize: false,
				delay: 2000,
				width: "100px",
				height: "100px",
				
			};
			
	var _temp =	{	timer: null,
				currentImage: -1,
				nextRotation: null,
				inTransition: false,
				stopped: false
			}
											
	setOptions ();

	this.play = functionPlay;
	this.stop = functionStop;		
	this.prev = functionPrev;
	this.next = functionNext;

	// Initialize
	window.onDomReady (init);				

	function init ()
	{
		// Container
		if (_options.element)
		{			
			_elements["container"] = SNDK.SUI.helpers.getContainer ({element: _options.element});
		}
			
		if (_options.appendTo)		
		{
			_elements["container"] = SNDK.SUI.helpers.getContainer ({appendTo: _options.appendTo});
		}
			
			
		if (_options.imageElement)
		{
			_elements["container"] = SNDK.SUI.helpers.getContainer ({element: _options.imageElement});
		}
			
		if (_options.htmlElement)
		{
			_elements["container2"] = SNDK.SUI.helpers.getContainer ({element: _options.htmlElement});
			_options.hasHTML = true;
			_options.fadeDouble = true;
		}
					
	
//		// Container
//		if (options.appendTo)
//		{
//			
//		}
//		
//		if (typeof options.element == "string")
//		{
//			_elements["container"] = document.getElementById (_options.element);
//		}
//		else
//		{
//			_elements["container"] = _options.element;
//		}
//						
//		_elements["container"].setAttribute ("id", _id);
		_elements["container"].className = _options.stylesheet;
	
		switch (_options.type)
		{
			case "fade":
				_elements["image_from"] = SNDK.tools.newElement ("img", {appendTo: _elements["container"]});
				_elements["image_from"].style.position = "absolute";
				SNDK.tools.opacityChange (_elements["image_from"], 0);

				_elements["image_to"] = SNDK.tools.newElement ("img", {appendTo: _elements["container"]});
				_elements["image_to"].style.position = "absolute";
				SNDK.tools.opacityChange (_elements["image_to"], 0)
				
				if (_options.hasHTML)
				{
					_elements["html_from"] = SNDK.tools.newElement ("div", {appendTo: _elements["container2"]});
					_elements["html_from"].style.position = "absolute";
					SNDK.tools.opacityChange (_elements["html_from"], 0);
					
					_elements["html_to"] = SNDK.tools.newElement ("div", {appendTo: _elements["container2"]});
					_elements["html_to"].style.position = "absolute";	
					SNDK.tools.opacityChange (_elements["html_to"], 0)
				}
			
				break;									
		}	
				
		if (_options.randomize)
		{
			_options.images.sort(function() {return 0.5 - Math.random();})				
		}			
	
		rotate (false);		
	}

	function rotate (done)
	{			
		switch (_options.type)
		{
			case "fade":
		
					clearTimeout (_temp.nextRotation);
		
					if (done)
					{
						_elements["image_from"].src = _options.images[_temp.currentImage].src;
						SNDK.tools.opacityChange (_elements["image_from"], 100);
				
						_elements["image_to"].src = "";						
						SNDK.tools.opacityChange (_elements["image_to"], 0);
				
						if (_options.hasHTML)
						{
							_elements["html_from"].innerHTML = _options.htmls[_temp.currentImage].content;
							SNDK.tools.opacityChange (_elements["html_from"], 100);
				
							_elements["html_to"].innerHTML = " ";
							SNDK.tools.opacityChange (_elements["html_to"], 0);						
						}				
				
						_temp.nextRotation = setTimeout (function () {rotate (false)}, _options.delay);
						_temp.inTransition = false;
					}
					else
					{	
						_temp.inTransition = true;					
			
						if (_temp.currentImage == _options.images.length-1)
						{
							_temp.currentImage = 0;
					
							if (_options.randomize)
							{
								_options.images.sort(function() {return 0.5 - Math.random();})				
							}
						}				
						else
						{
							_temp.currentImage++;
						}
			
						_elements["image_to"].src = _options.images[_temp.currentImage].src;
						
						if (_options.hasHTML)
						{							
							_elements["html_to"].innerHTML = _options.htmls[_temp.currentImage].content;
							SNDK.animation.opacityFade (_elements["html_to"], 0, 100, _options.fadeDelay);
						}
						

						SNDK.animation.opacityFade (_elements["image_to"], 0, 100, _options.fadeDelay);
						
						if (_options.fadeDouble)
						{
							SNDK.animation.opacityFade (_elements["image_from"], 100, 0, _options.fadeDelay);
							
							if (_options.hasHTML)
							{							
								SNDK.animation.opacityFade (_elements["html_from"], 100, 0, _options.fadeDelay);								
							}
						}
						
						setTimeout (function () {rotate (true)}, _options.fadeDelay + 10);
					}
				break;
		}			
	}
		
	function setOptions ()
	{
		// stylesheet
		if (_options.stylesheet == null)
			_options.stylesheet = _defaults.stylesheet;			

		// fadeDelay
		if (_options.fadeDelay == null)
			_options.fadeDelay = _defaults.fadeDelay;		

		// fadeDelay
		if (_options.delay == null)
			_options.delay = _defaults.delay;
		
		// fadeDouble
		if (_options.fadeDouble == null)
			_options.fadeDouble = _defaults.fadeDouble;				

		// randomize
		if (_options.randomize == null)
			_options.randomize = _defaults.randomize;
		
		// images
		if (_options.images != null)
		{
			var temp = new Array ();
			for (var index in _options.images)
			{
				temp[index] = _options.images[index];
			}
		
			_options.images = temp;
		}												
	}
	
	function functionPrev ()
	{
		if (!_temp.inTransition)
		{
			rotate (true);

			_temp.currentImage--;
			if (_temp.currentImage == -1)
			{
				_temp.currentImage = _options.images.length-1;
			}			
			_temp.currentImage--;
	
			rotate (false);	
		}
	}
	
	function functionNext ()
	{
		if (!_temp.inTransition)
		{
			rotate (true);
			rotate (false);
		}			
	}

	function functionStop ()
	{
		clearTimeout (_temp.nextRotation);
		_temp.stopped = true;
	}

	function functionPlay ()
	{
		_temp.nextRotation = setTimeout (function () {rotate (false)}, _options.delay);
		_temp.stopped = false;
	}		
}	