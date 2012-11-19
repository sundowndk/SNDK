// ------------------------------------
	// Private functions
	// ------------------------------------
	function init ()
	{
		updateCache ();

		_attributes.heightType = "pixel";
		_attributes.height = _temp.cache["containerBoxSize"]["vertical"] + _temp.cache["containerHeight"] +"px";
	}
	
	// ------------------------------------
	// construct
	// ------------------------------------	
	function construct ()
	{					
		// Container					
		_elements["container"] = SNDK.tools.newElement ("button", {});
		_elements["container"].className = _attributes.stylesheet;
		
		// Icon
		if (_attributes.icon != null)
		{						
			_elements["button-icon"] = SNDK.tools.newElement ("span", {appendTo: _elements["container"]});
			
			_elements["button-icon"].className = "button-icon "+ _attributes.icon.split (";")[1];
			_elements["button-icon"].style.cssFloat = "left";
		
			_elements["icon"] = SNDK.tools.newElement ("span", {appendTo: _elements["button-icon"]});
			_elements["icon"].className = "icon-"+ _attributes.icon.split (";")[0];
		}	
		
		_elements["label"] = SNDK.tools.newElement ("span", {appendTo: _elements["container"]});			
																			
		// Hook events	
		_elements["container"].onfocus = eventOnFocus;
		_elements["container"].onblur = eventOnBlur;
		_elements["container"].onclick = eventOnClick;				
		_elements["container"].onkeydown = eventOnKeyDown;
		
		window.addEvent (window, 'SUIREFRESH', refresh);			
	}		
		
	// ------------------------------------
	// refresh
	// ------------------------------------	
	function refresh ()
	{
		if (_temp.initialized)
		{
			var style = _attributes.stylesheet +" "+ _attributes.color +" "+ _attributes.size;
					
			if (_attributes.disabled)
			{
				_elements["container"].disabled = true;
				_attributes.focus = false;
				eventOnBlur ();				
			}
			else
			{				
				_elements["container"].disabled = false;
			
				if (_attributes.active)
				{	
					style += " active";						
					_attributes.active = false;
					setTimeout (refresh, 100);					
				}				
												
				if (_attributes.focus)
				{	
					style += " focus";								
					setFocus ();			
				}
				
				_elements["container"].tabIndex = _attributes.tabIndex;
			}	
						
			_elements["label"].innerHTML = _attributes.label;		
						
			_elements["container"].className = style;
		
			setDimensions ();
		}		
	}	
	
	// ------------------------------------
	// dispose
	// ------------------------------------			
	function dispose ()
	{
		window.removeEvent (window, 'SUIREFRESH', refresh);				
	}	
	
	// ------------------------------------
	// updateCache
	// ------------------------------------		
	function updateCache ()
	{
		if (!_temp.cacheUpdated)
		{
			_temp.cache["containerBoxSize"] = SNDK.tools.getElementStyledBoxSize (_elements["container"]);			
			_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["container"]);
		}
		
		_temp.cacheUpdated = true;	
	}	

	// -------------------------------------
	// setAttributes
	// -------------------------------------
	function setAttributes ()
	{					
		// Stylesheet
		if (!_attributes.stylesheet)
			_attributes.stylesheet = "button";			
			
		if (!_attributes.size)
			_attributes.size = "";
			
		// Managed
		if (!_attributes.managed)
			_attributes.managed = false;								
					
		// Width
		if (!_attributes.width) 
			_attributes.width = "100%";				
			
		if (_attributes.width.substring (_attributes.width.length - 1) == "%")
		{
			_attributes.widthType = "percent";
			_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
		}
		else
		{
			_attributes.widthType = "pixel";
			_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
		}						
																					
		// Label
		if (!_attributes.label)
			_attributes.label = "BUTTON";	
	
		// Disabled
		if (!_attributes.disabled)
			_attributes.disabled = false;		
			
		// Focus	
		if (!_attributes.focus)
			_attributes.focus = false;
			
		// Active
		if (!_attributes.active)
			_attributes.active = false;
			
		// TabIndex
		if (!_attributes.tabIndex)
			_attributes.tabIndex = 0;
	}
			
	// -------------------------------------
	// setDimensions
	// -------------------------------------
	function setDimensions ()
	{
		if (_temp.initialized)
		{
			var width = 0;
		
			//if (!_attributes.managed && _attributes.widthType != "pixel")
			if (_attributes.widthType != "pixel")
			{
			//	console.log (SNDK.tools.getElementInnerWidth (_elements["container"].parentNode))
				
																											
				width = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100);
				
			//	console.log (width)
			}
			else
			{	
				width = _attributes.width ;
			}	
			
			_elements["container"].style.width = width - _temp.cache.containerBoxSize["horizontal"] +"px";
			
			//console.log (_temp.cache.containerBoxSize["horizontal"])
			
		}
	}
	
	// ------------------------------------
	// setFocus
	// ------------------------------------				
	function setFocus ()
	{
		_elements["container"].focus ()
		//setTimeout ( function () { _elements["container"].focus (); }, 2);	
	}	
	
	// ------------------------------------
	// setBlur
	// ------------------------------------				
	function setBlur ()
	{
		setTimeout ( function () { _elements["container"].blur (); }, 2);	
	}		
			
	// -------------------------------------
	// keyHandler
	// -------------------------------------
	function keyHandler (event)
	{		
		var key;
		if (!event && window.event) 
		{
			event = window.event;
		}
			
		if (event) 
		{
			key = event.keyCode;
		}
		else
		{
			key = event.which;	
		}
		
		if (key == 13)						// Enter			
		{
			eventOnKeyPressEnter ();
		}		
	 }
