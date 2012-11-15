// -------------------------------------------------------------------------------------------------------------------------
// button ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
// .refresh ()
// .dispose ()
// .getAttribute (string)
// .setAttribute (string, string)
//	
// 	id 			get
//	tag			get/set
//	stylesheet	get/set
//	width		get/set
//	height		get
//	appendTo	get/set
//	managed		get/set
//	disabled	get/set
//	focus		get/set
//	onFocus		get/set
//	onBlur		get/set
//	onClick		get/set
//	label		get/set
//	tabIndex	get/set
//
/**
 * @constructor
 */
button : function (attributes)
{	
	var _elements = new Array ();			
	var _attributes = attributes;				

	var _temp = 	{ 
						initialized: false,
			  			mouseDown: false,
			  			mouseOver: false,
			  			enterDown: false,
			  			cache: new Array ()
					};
	
	_attributes.id = SNDK.tools.newGuid ();				
	
	setAttributes ();	
			
	// Private functions
	this._attributes = _attributes;
	this._elements = _elements;
	this._temp = _temp;	
	this._init = init;			
				
	// Functions
	this.type = "BUTTON";
	this.refresh = functionRefresh;
	this.dispose = functionDispose;
	this.getAttribute = functionGetAttribute;
	this.setAttribute = functionSetAttribute;	
									
	// Construct
	construct ();
				
	// Init Control
	SNDK.SUI.addInit (this);		
	
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
			var style = _attributes.stylesheet +" "+ _attributes.color;
					
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

	// ------------------------------------
	// Public functions
	// ------------------------------------
	// ------------------------------------
	// refresh
	// ------------------------------------				
	function functionRefresh ()
	{
		refresh ();
	}		
	
	// ------------------------------------
	// dispose
	// ------------------------------------				
	function functionDispose ()
	{
		dispose ();
	}	
		
	// ------------------------------------
	// getAttribute
	// ------------------------------------						
	function functionGetAttribute (attribute)
	{
		switch (attribute)
		{
			case "id":
			{
				return _attributes[attribute];
			}
			
			case "tag":
			{
				return _attributes[attribute];
			}
			
			case "stylesheet":
			{
				return _attributes[attribute];
			}
			
			case "width":
			{
				if (_attributes.widthType == "percent")
				{
					return _attributes.width + "%";
				}

				if (_attributes.widthType == "pixel")
				{
					return _attributes.width + "px";
				}
			}
			
			case "height":
			{
				if (_attributes.heightType == "percent")
				{
					return _attributes.height + "%";
				}

				if (_attributes.heightType == "pixel")
				{
					return _attributes.height + "px";
				}
			}
			
			case "appendTo":
			{
				return _attributes[attribute];			
			}			
			
			case "managed":
			{
				return _attributes[attribute];			
			}

			case "disabled":
			{
				return _attributes[attribute];			
			}
			
			case "focus":
			{
				return _attributes[attribute];			
			}

			case "onFocus":
			{
				return _attributes[attribute];			
			}

			case "onBlur":
			{
				return _attributes[attribute];			
			}

			case "onClick":
			{
				return _attributes[attribute];			
			}

			case "label":
			{
				return _attributes[attribute];			
			}
			
			case "tabIndex":
			{
				return _attributes[attribute];
			}
					
			default:
			{
				throw "No attribute with the name '"+ attribute +"' exist in this object";
			}
		}	
	}
	
	// ------------------------------------
	// setAttribute
	// ------------------------------------						
	function functionSetAttribute (attribute, value)
	{
		switch (attribute)
		{
			case "id":
			{
				throw "Attribute with name ID is ready only.";
				break;
			}
			
			case "tag":
			{
				_attributes[attribute] = value;
				break;
			}
			
			case "stylesheet":
			{
				_attributes[attribute] = value;
				break;				
			}
			
			case "width":
			{
				if (value.substring (value.width.length, 3) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = value.width.substring (0, value.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = value.width.substring (0, value.width.length - 2)
				}	
				break;			
			}

			case "height":
			{
				throw "Attribute with name HEIGHT is ready only.";
				break;			
			}

			
			case "appendTo":
			{
				_attributes[attribute] = value;	
				_attributes.appendTo.appendChild (_elements["container"]);			
				break;
			}			
			
			case "managed":
			{
				_attributes[attribute] = value;

				if (value)
				{
					window.removeEvent (window, 'SUIREFRESH', refresh);		
				}
				else
				{
					window.addEvent (window, 'SUIREFRESH', refresh);
				}

				break;
			}

			case "disabled":
			{
				_attributes[attribute] = value;
				refresh ();
				break;
			}
			
			case "focus":
			{
				_attributes[attribute] = value;
				refresh ();
				break;
			}

			case "onFocus":
			{
				_attributes[attribute] = value;
				break;
			}

			case "onBlur":
			{
				_attributes[attribute] = value;
				break;
			}

			case "onClick":
			{
				_attributes[attribute] = value;
				break;
			}

			case "label":
			{
				_attributes[attribute] = value;
				refresh ();
				break;
			}
			
			case "tabIndex":
			{
				_attributes[attribute] = value;
				refresh ();
				break;
			}			
					
			default:
			{
				throw "No attribute with the name '"+ attribute +"' exist in this object";
			}
		}	
	}				
								
	// ------------------------------------
	// Events
	// ------------------------------------
	// ------------------------------------
	// eventOnKeyUp
	// ------------------------------------	
	function eventOnKeyUp (event)
	{
		keyHandler(event);
	}

	// ------------------------------------
	// eventOnKeyDown
	// ------------------------------------	
	function eventOnKeyDown (event)
	{
		keyHandler (event);
	}
		
	// ------------------------------------
	// eventOnEnter
	// ------------------------------------	
	function eventOnKeyPressEnter ()
	{	
		if (!attributes.disabled)
		{
			_attributes.active = true;
			refresh ();		
		}	
	}

	// ------------------------------------
	// onFocus
	// ------------------------------------		
	function eventOnFocus ()
	{
		if (!_attributes.disabled)
		{
			if (!_attributes.focus)
			{
				_attributes.focus = true;
				refresh ();
				
				if (_attributes.onFocus != null)
				{
					setTimeout( function () { _attributes.onFocus (_attributes.name); }, 1);
				}					
			}		
		}
	}
	
	// ------------------------------------
	// onBlur
	// ------------------------------------		
	function eventOnBlur ()
	{
		if (!_attributes.disabled)
		{
			if (_attributes.focus)
			{				
				_attributes.focus = false;
				refresh ();

				if (_attributes.onBlur != null)
				{
					setTimeout( function () { _attributes.onBlur (_attributes.name); }, 1);
				}									
			}
		}
	}
	
	// ------------------------------------
	// onMouseOver
	// ------------------------------------	
	function eventOnMouseOver ()
	{
		if (!_attributes.disabled)
		{		
			_temp.mouseOver = true;
			refresh ();
		}
	}	
	
	// ------------------------------------
	// onMouseOut
	// ------------------------------------	
	function eventOnMouseOut ()
	{
		if (!_attributes.disabled)
		{
			if (_temp.mouseDown)
			{		
				_temp.mouseOver = false;
				_temp.mouseDown = false;				
				refresh ();
			}	
		}
	}	
	
	// ------------------------------------
	// onMouseDown
	// ------------------------------------		
	function eventOnMouseDown ()
	{
		if (!_attributes.disabled)
		{
			_attributes.focus = true;
			_temp.mouseDown = true;				
			refresh ();
		}
	}				
	
	// ------------------------------------
	// onMouseUp
	// ------------------------------------	
	function eventOnMouseUp ()
	{
		if (!_attributes.disabled)
		{
			if (_temp.mouseDown)
			{
				_temp.mouseDown = false;
				refresh ();
				
				eventOnClick ();
			}						
		}
	}
	
	// ------------------------------------
	// onClick
	// ------------------------------------	
	function eventOnClick ()
	{		
		if (_attributes.onClick != null)
		{
			setTimeout( function () { _attributes.onClick (_attributes.name); }, 1);
		}
	}
	
	// ------------------------------------
	// onDrag
	// ------------------------------------		
	function eventOnDrag ()
	{
		return false;
	}			
}