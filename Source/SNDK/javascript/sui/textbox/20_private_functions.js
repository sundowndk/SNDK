
// ------------------------------------
// Private functions
// ------------------------------------	
// ------------------------------------
// init
// ------------------------------------			
function init ()
{
	updateCache ();
	
	_attributes.heightType = "pixel";
	_attributes.height = _temp.cache["containerBoxDimensions"]["vertical"] + _temp.cache["containerHeight"];			
}

// ------------------------------------
// construct
// ------------------------------------			
function construct ()
{				
	// Container
	_elements["container"] = SNDK.tools.newElement ("span", {});
	_elements["container"].className = _attributes.stylesheet;
	
	// IconContainer
	_elements["iconcontainer"] = new SNDK.tools.newElement ("span", {appendTo: _elements["container"]})

	// Input
	var type = "text";
	if (_attributes.password)
	{
		type = "password";
	}
	
	_elements["input"] = SNDK.tools.newElement ("input", {type: type, appendTo: _elements["container"]});
	_elements["input"].className = "input-unstyled";
	
	if (_attributes.placeholder != null)
	{
		_elements["input"].placeholder = _attributes.placeholder;
	} 
	
	
	if (_attributes.textTransform)
	{
		_elements["input"].style.textTransform = _attributes.textTransform;					
	}
	
	// InfoBubbleContainer
	_elements["infobubblecontainer"] = new SNDK.tools.newElement ("span", {appendTo: _elements["container"]})

	// Icon
	setIcon ();

	// InfoBubble
	setInfoBubble ();
														
	// Hook Events
	_elements["input"].onfocus = eventOnFocus;
	_elements["input"].onblur = eventOnBlur;
	_elements["input"].onchange = eventOnChange;	
	_elements["input"].onkeyup = eventOnKeyUp;	
	_elements["input"].onkeypress = eventOnKeyPress;
	
	window.addEvent (window, 'SUIREFRESH', refresh);							 
}		
		
// ------------------------------------
// refresh
// ------------------------------------		
function refresh ()
{
	if (_temp.initialized)
	{					
		if (_attributes.disabled)
		{
			_elements["container"].className = _attributes.stylesheet +" disabled";														
			_elements["input"].disabled = true;
			_attributes.focus = false;
			eventOnBlur ();					
		}
		else
		{
			if (_attributes.focus)
			{	
				_elements["container"].className = _attributes.stylesheet +" focus";				
				setFocus ();
			}
			else
			{				
				_elements["container"].className = _attributes.stylesheet;
			}

			_elements["input"].disabled = false;
		}
			
		if (_attributes.autoComplete)
		{
			_elements["input"].setAttribute ("autocomplete", "on");
		}
		else
		{
			_elements["input"].setAttribute ("autocomplete", "off");
		}	
		
		if (_attributes.readOnly)
		{
			_elements["input"].setAttribute ("readonly", "true");
		}
		else
		{
			_elements["input"].removeAttribute ("readonly");
		}						
		
		if (_attributes.value != null)
		{
			_elements["input"].value = _attributes.value;
		}				
		
		_elements["input"].tabIndex = _attributes.tabIndex;									
	}
			
	setDimensions ();	
}	

// ------------------------------------
// updateCache
// ------------------------------------		
function updateCache ()
{
	_temp.cache = {};
	_temp.cache.containerBoxDimensions = SNDK.tools.getElementStyledBoxSize (_elements["container"]);
	_temp.cache.inputBoxDimensions = SNDK.tools.getElementStyledBoxSize (_elements["input"]);
	_temp.cache.containerBoxDimensions.horizontal += _temp.cache.inputBoxDimensions.horizontal;
		
	if (_attributes.icon)
	{
		_temp.cache.iconWidth = _elements["iconcontainer"].offsetWidth;			
		_temp.cache.containerBoxDimensions.horizontal += _temp.cache.iconWidth;		
	}
		
	if (_attributes.infoBubble)
	{
		_temp.cache.infoBubbleWidth = _elements["infospot"].offsetWidth;	
		_temp.cache.containerBoxDimensions.horizontal += _temp.cache.infoBubbleWidth;
	}
	
	_temp.cache.containerHeight = SNDK.tools.getElementStyledHeight (_elements["container"]);
}		
	
// ------------------------------------
// setAttributes
// ------------------------------------		
function setAttributes ()
{
	// Id
	_attributes.id = SNDK.tools.newGuid ()	

	// Name
	if (!_attributes.name)		
		_attributes.name = "";	

	// Stylesheet
	if (!_attributes.stylesheet)
		_attributes.stylesheet = "input";

	// Managed
	if (!_attributes.managed)		
		_attributes.managed = false;	

	// Width
	if (!_attributes.width) 
		_attributes.width = "100px";				
		
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

	// Disabled
	if (!_attributes.disabled)		
		_attributes.disabled = false;				
												
	// AutoComplete
	if (!_attributes.autoComplete)
		_attributes.autoComplete = false;

	// ReadOnly
	if (!_attributes.readOnly)
		_attributes.readOnly = false;

	// Focus	
	if (!_attributes.focus)
		_attributes.focus = false;
			
	// Password
	if (!_attributes.password)
		_attributes.password = false;
		
	// textTransform
	if (!_attributes.textTransform)
		_attributes.textTransform = "none";

	// onFocus
	if (!_attributes.onFocus)
		_attributes.onFocus = null;	
		
	// onBlur
	if (!_attributes.onBlur)
		_attributes.onBlur = null;	

	// onChange
	if (!_attributes.onChange)
		_attributes.onChange = null;
		
	// onEnter
	if (!_attributes.onEnter)
		_attributes.onEnter = null;
							
	// Value
	if (!_attributes.value)
		_attributes.value = "";	
		
	// TabIndex
	if (!_attributes.tabIndex)
		_attributes.tabIndex = 0;
}		

// ------------------------------------	
// setDimensions
// ------------------------------------			
function setDimensions ()
{
	if (_temp.initialized)
	{	
		var width = 0;
		
		if (_attributes.widthType != "pixel")
		{								
			width = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100)
		}
		else
		{			
			width = _attributes.width;
		}	
		
		_elements["input"].style.width = width - _temp.cache.containerBoxDimensions.horizontal +"px";
	}
}	

// ------------------------------------
// keyHandler
// ------------------------------------
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
	
	return key;
}	

// ------------------------------------
// keyHandler
// ------------------------------------
function functionDispose ()
{		
	window.removeEvent (window, 'SUIREFRESH', refresh);	
}
			
// ------------------------------------
// setFocus
// ------------------------------------				
function setFocus ()
{	
	setTimeout ( function () {  _attributes.focus = true; _elements["input"].focus (); }, 25);	
}	

// ------------------------------------
// setIcon
// ------------------------------------					
function setIcon ()
{
	if (_attributes.icon != null)
	{
		var icon = _attributes.icon.split (";")[0];
		var color =  _attributes.icon.split (";")[1];
	
		_elements["icon"] = SNDK.tools.newElement ("span", {appendTo: _elements["iconcontainer"]});
		_elements["icon"].className = "icon-"+ icon +" "+ color;
	}		
	else
	{
		_elements["icon"] = null;
		_elements["iconcontainer"].innerHTML = " ";
	}
}

// ------------------------------------
// setInfoBubble
// ------------------------------------				
function setInfoBubble ()
{
	if (_attributes.infoBubble != null)
	{		
		var icon = _attributes.infoBubble.split (";")[0];
		var text = _attributes.infoBubble.split (";")[1];

		_elements["infospot"] = SNDK.tools.newElement ("span", {appendTo: _elements["infobubblecontainer"]});
		_elements["infospot"].className = "info-spot";

		_elements["infoicon"] = SNDK.tools.newElement ("span", {appendTo: _elements["infospot"]});
		_elements["infoicon"].className = "icon-"+ icon; 
		
		_elements["infobubble"] = SNDK.tools.newElement ("span", {appendTo: _elements["infospot"]});
		_elements["infobubble"].className = "info-bubble";
		_elements["infobubble"].innerHTML = text;
	}
	else
	{
		_elements["infospot"] = null;
		_elements["infoicon"] = null;
		_elements["infobubble"] = null;
		_elements["infobubblecontainer"].innerHTML = " ";
	}
}