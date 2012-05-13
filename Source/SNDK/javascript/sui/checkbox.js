// -------------------------------------------------------------------------------------------------------------------------
// checkbox ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
// .getAttribute (string)
// .setAttribute (string, string)
//	
// 	id 		get
//	tag		get/set
//	name		get/set
//	stylesheet	get/set
//	appendTo	get/set
//	managed		get/set
//	disabled	get/set
//	onFocus		get/set
//	onBlur		get/set
//	onChange	get/set
//	value		get/set
//
// CHANGELOG:
//
// v1.02:
//	- Added managed mode.
//
// v1.01:
//	- Fixed width caluclation. Now works with percentage.
//	- Code cleanup.
//
// v1.00:
//	- Initial release.
/**
 * @constructor
 */ 
checkbox : function (attributes)
{
	var _elements = new Array ();			
	var _attributes = attributes;	
						
	var _temp = 	{ initialized: false,
			  cache: new Array ()
			};
			
	_attributes.id = SNDK.tools.newGuid ();

	setAtrributes ();	
							
	// Private functions
	this._attributes = _attributes;
	this._elements = _elements;
	this._temp = _temp;	
	this._init = init;							
									
	// Functions
	this.refresh = functionRefresh;
	this.dispose = functionDispose;
	this.getAttribute = functionGetAttribute;
	this.setAttribute = functionSetAttribute;
				
	// Construct
	construct ();
														
	// Initialize
	SNDK.SUI.addInit (this);					
							
	// ------------------------------------
	// Private functions
	// ------------------------------------
	// ------------------------------------
	// init
	// ------------------------------------
	function init ()
	{
		updateCache ();
		
		_attributes.widthType = "pixel";
		_attributes.width = _temp.cache["containerPadding"]["horizontal"] + _temp.cache["containerWidth"] +"px";
				
		_attributes.heightType = "pixel";
		_attributes.height = _temp.cache["containerPadding"]["vertical"] + _temp.cache["containerHeight"] +"px";		
	}

	// ------------------------------------
	// construct
	// ------------------------------------	
	function construct ()
	{	
		// Container
		_elements["container"] = SNDK.tools.newElement ("div", {});
		_elements["container"].setAttribute ("id", _attributes.id);
		_elements["container"].className = _attributes.stylesheet;					
		
		// Control
		_elements["checkmark"] = SNDK.tools.newElement ("div", {className: "Checkmark", appendTo: _elements["container"]});

		// Hook events	
		_elements["container"].onfocus = eventOnFocus;
		_elements["container"].onblur = eventOnBlur;
		_elements["container"].onclick = eventOnClick;		
		_elements["container"].onkeyup = eventOnKeyUp;		
		
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
				if (_attributes.checked)
				{
					_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"DisabledChecked";
				}
				else
				{
					_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Disabled";
				}			
				
				_elements["container"].removeAttribute("tabIndex");
				_attributes.focus = false;
				eventOnBlur ();	
			}			
			else
			{
				_elements["container"].setAttribute("tabIndex", 0);	
				if (_attributes.focus)
				{
					if (_attributes.checked)
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Focus "+ _attributes.stylesheet +"Checked";
					}
					else
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Focus";
					}								
					
					setFocus ();			
				}
				else
				{
					if (_attributes.checked)
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Checked";
					}
					else
					{
						_elements["container"].className = _attributes.stylesheet;
					}									
				}
			}										
		}
	}
	
	function functionDispose ()
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
			_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
			_temp.cache["containerWidth"] = (SNDK.tools.getElementStyledWidth (_elements["checkmark"]));
			_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["checkmark"]);
		}
		
		_temp.cacheUpdated = true;	
	}	
	
	// ------------------------------------
	// setOptions
	// ------------------------------------		
	function setAtrributes ()
	{
		// Stylesheet
		if (!_attributes.stylesheet)
			_attributes.stylesheet = "SUICheckbox";
					
		// Checked
		if (!_attributes.checked)
			_attributes.checked = false;	
						 									
		// Disabled
		if (!_attributes.disabled)
			_attributes.disabled = false;
										
		// Focus	
		if (!_attributes.focus)
			_attributes.focus = false;
	}	
		
	// ------------------------------------
	// setFocus
	// ------------------------------------				
	function setFocus ()
	{
		setTimeout ( function () { _elements["container"].focus (); }, 2);	
	}	
	
	// ------------------------------------
	// setBlur
	// ------------------------------------				
	function setBlur ()
	{
		setTimeout ( function () { _elements["container"].blur (); }, 2);	
	}				
	
	// ------------------------------------
	// keyHandler
	// ------------------------------------	
	function keyHandler(event)
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
	
		if (key == 13)								// Enter			
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
			
			case "name":
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

			case "onChange":
			{
				return _attributes[attribute];			
			}

			case "value":
			{				
				return _attributes.checked;			
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
			
			case "name":
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
				throw "Attribute with name WIDTH is ready only.";
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

			case "password":
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

			case "onChange":
			{
				_attributes[attribute] = value;
				break;
			}

			case "value":
			{
				_attributes.checked = value;
				refresh ();
				break;
			}
					
			default:
			{
				throw "No attribute with the name '"+ attribute +"' exist in this object";
			}
		}		
	}		
	
	function functionDispose ()
	{
		dispose ();	
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
	// onKeyPressEnter
	// ------------------------------------	
	function eventOnKeyPressEnter ()
	{	
		if (!attributes.disabled)
		{
			if (_attributes.checked)
			{
				_attributes.checked = false;
			}
			else
			{
				_attributes.checked = true;
			}	
						
			refresh ();	
			eventOnChange ();					
		}	
	}
			
	// ------------------------------------
	// onClick
	// ------------------------------------	
	function eventOnClick ()
	{
		if (!_attributes.disabled)
		{
			if (_attributes.checked)
			{
				_attributes.checked = false;
			}
			else
			{
				_attributes.checked = true;
			}
			
			refresh ();
			eventOnChange ();
	
			if (_attributes.onClick != null)
			{
				setTimeout( function () { _attributes.onClick (_name); }, 1);
			}
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
					setTimeout( function () { _attributes.onFocus (_name); }, 1);
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
					setTimeout( function () { _attributes.onBlur (_name); }, 1);
				}			
			}
		}
	}	
			
	// ------------------------------------
	// onChange
	// ------------------------------------						
	function eventOnChange ()
	{
		if (_attributes.onChange != null)
		{
			setTimeout( function ()	{ _attributes.onChange (); }, 1);
		}
	}		
}