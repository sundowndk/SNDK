// ------------------------------------
// rotator
// ------------------------------------		
/**
 * @constructor
 */
rotator2 : function (attributes)
{
	var _initialized = false;
	var _id = SNDK.tools.newGuid ();
	var _elements = new Array ();	
	var _attributes = attributes;	
			
	var _temp =	{	
					timer: null,
					length: -1,
					currentContent: -1,					
					lastContentIndex: -1,
					nextRotation: null,
					inTransition: false,
					stopped: false
				};
													
	this.type = "ROTATOR";
	this.play = functionPlay;
	this.stop = functionStop;		
	this.previous = functionPrevious;
	this.next = functionNext;

	// Initialize
	window.onDomReady (init);				

	function init ()
	{		
		for (idx in _attributes.data)
		{
			var data = _attributes.data[idx];
		
			if (data.element)
			{
				_elements["container"+ idx] = SNDK.SUI.helpers.getContainer ({element: data.element});
			}
			else if (data.appendTo)
			{
				_elements["container"+ idx] = SNDK.SUI.helpers.getContainer ({element: data.appendTo});
			}			
			else
			{
				throw ("sndk.widgets.rotator: Neither element or appendTo is specified in data. Cannot create rotator.");
			}
			
			if (_temp.length == -1)
			{
				_temp.length = data.content.length;
			}
			else if (_temp.length != data.content.length)
			{
				throw ("sndk.widgets.rotator: All data must containe the same amount of content.");
			}
			else if (data.content.length == 0)
			{
				return;
			}
			
			switch (data.type.toLowerCase ())
			{
				case "fade":
				{
					// FROM
					_elements["from"+ idx] = SNDK.tools.newElement ("div", {appendTo: _elements["container"+ idx]});
					_elements["from"+ idx].style.position = "absolute";					
					SNDK.tools.opacityChange (_elements["from"+ idx], 0);	
					
					// TO
					_elements["to"+ idx] = SNDK.tools.newElement ("div", {appendTo: _elements["container"+ idx]});
					_elements["to"+ idx].style.position = "absolute";
					SNDK.tools.opacityChange (_elements["from"+ idx], 0);	
					break;
				}
			}
		}
	
		rotate (false);		
	}

	function getNextContentIndex ()
	{
		var result = _temp.currentContent;
		
		if (_attributes.randomize && _temp.length > 2)
		{			
			while (_temp.currentContent == result)
			{
				result = Math.floor ((Math.random () * (_temp.length -1 ))+1); 
			}
		}
		else
		{
			if (result == (_temp.length - 1))
			{
				result = 0;												
			}				
			else
			{
				result++;
			}
		}
		
		return result;
	}
	
	function getPreviousContentIndex ()
	{
		var result = _temp.currentContent;
		
		if (_attributes.randomize && _temp.length > 2)
		{			
			while (_temp.currentContent == result)
			{
				result = Math.floor ((Math.random () * (_temp.length -1 ))+1); 
			}
		}
		else
		{
			if (result == (_temp.length - 1))
			{
				result = 0;												
			}				
			else
			{
				result++;
			}
		}
		
		return result;
	}

	function rotate (done)
	{
		if (!done)
		{		
			_temp.lastContentIndex = _temp.currentContent;
			_temp.currentContent = getNextContentIndex ();
		}
		
		for (idx in _attributes.data)
		{		
			var data = _attributes.data[idx];					
			
			switch (data.type.toLowerCase ())
			{
				case "fade":
				{		
					clearTimeout (_temp.nextRotation);
		
					if (done)
					{
						_elements["from"+ idx].innerHTML = data.content[_temp.currentContent].html;
						SNDK.tools.opacityChange (_elements["from"+ idx], 100);
				
						_elements["to"+ idx].innerHTML = " ";		
						SNDK.tools.opacityChange (_elements["to"+ idx], 0);
								
						_temp.nextRotation = setTimeout (function () {rotate (false)}, _attributes.delay);
						_temp.inTransition = false;
					}
					else
					{	
						_temp.inTransition = true;					
												
						_elements["to"+ idx].innerHTML = data.content[_temp.currentContent].html;
												
						SNDK.animation.opacityFade (_elements["to"+ idx], 0, 100, _attributes.transitionTime);
						
						if (data.fadeDouble)
						{
							SNDK.animation.opacityFade (_elements["from"+ idx], 100, 0, _attributes.transitionTime);														
						}
						
						setTimeout (function () {rotate (true)}, _attributes.transitionTime + 10);
					}								
				
					break;
				}
			}
		}	
	}
			
	function functionPrevious ()
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
		rotate (true);		
		_temp.stopped = false;
	}		
}	