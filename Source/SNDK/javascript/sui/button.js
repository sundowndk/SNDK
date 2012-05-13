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
			
		// Left	
		_elements["left"] = SNDK.tools.newElement ("div", {className: "Left", appendTo: _elements["container"]});

		// Center
		_elements["center"] = SNDK.tools.newElement ("div", {className: "Center", appendTo: _elements["container"]});
		SNDK.tools.textSelectionDisable (_elements["center"]);

		// Right
		_elements["right"] = SNDK.tools.newElement ("div", {className: "Right", appendTo: _elements["container"]});	
		
		// Clear
		SNDK.tools.newElement ("div", {className: "Clear", appendTo: _elements["container"]});																						
																	
		// Hook events	
		_elements["container"].onfocus = eventOnFocus;
		_elements["container"].onblur = eventOnBlur;
		_elements["container"].onmousedown = eventOnMouseDown;
		_elements["container"].onmouseup = eventOnMouseUp;			
		_elements["container"].onmouseover = eventOnMouseOver;
		_elements["container"].onmouseout = eventOnMouseOut;
		_elements["container"].onkeyup = eventOnKeyUp;
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
			if (_attributes.disabled)
			{
				_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Disabled";
				_elements["container"].removeAttribute("tabIndex");
				_attributes.focus = false;
				eventOnBlur ();				
			}
			else
			{
				_elements["container"].setAttribute("tabIndex", 0);	
				
				if (_attributes.focus)
				{
					if (_temp.mouseDown)
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Focus "+ _attributes.stylesheet+"LeftClicked";
					}
					else
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Focus";
					}								
					
					setFocus ();			
				}
				else
				{
					_elements["container"].className = _attributes.stylesheet;
				}
			}	
				
			_elements["center"].innerHTML = _attributes.label;
		}
		
		setDimensions ();
	}	
	
	// ------------------------------------
	// dispose
	// ------------------------------------			
	function dispose ()
	{
		window.addEvent (window, 'SUIREFRESH', refresh);				
	}	
	
	// ------------------------------------
	// updateCache
	// ------------------------------------		
	function updateCache ()
	{
		if (!_temp.cacheUpdated)
		{
			_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
			_temp.cache["containerWidth"] = (SNDK.tools.getElementStyledWidth (_elements["left"]) + SNDK.tools.getElementStyledWidth (_elements["right"]));
			_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["left"]);
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
			_attributes.stylesheet = "SUIButton";			
			
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
								
		// Label
		if (!_attributes.label)
			_attributes.label = "BUTTON";	
	
		// Disabled
		if (!_attributes.disabled)
			_attributes.disabled = false;		
			
		// Focus	
		if (!_attributes.focus)
			_attributes.focus = false;
	}
			
	// -------------------------------------
	// setDimensions
	// -------------------------------------
	function setDimensions ()
	{
		if (_temp.initialized)
		{
			var width = {};
			
			if (!_attributes.managed && _attributes.widthType != "pixel")
			{					
				width.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
			}
			else
			{			
				if (_attributes.managed && _attributes.widthType == "percent")
				{
					width.container = _attributes.managedWidth - _temp.cache.containerPadding["horizontal"];
				}
				else
				{
					width.container = _attributes.width - _temp.cache.containerPadding["horizontal"];
				}			
			}	
			
			width.center = width.container - _temp.cache.containerWidth;

			_elements["container"].style.width = width.container +"px";
			_elements["center"].style.width = width.center +"px";		
		}
	}
		
//	function setDimensions2 ()
//	{
//		if (_temp.initialized)
//		{
//			var containerwidth = SNDK.tools.getElementStyledWidth (_elements["left"]) + SNDK.tools.getElementStyledWidth (_elements["right"]);
		
//			if (_attributes.widthType == "percent")
//			{								
	//			setTimeout (	function () 
	//					{	
//							var parentwidth = SNDK.tools.getElementInnerWidth (_elements["container"].parentNode);							
//							var width = parentwidth - SNDK.tools.getElementStyledPadding (_elements["container"])["horizontal"] - containerwidth +"px";
													
//							_elements["center"].style.width = width;
	//					}, 0);						
//			}
//			else
//			{
//				var width = _attributes.width  - containerwidth +"px";
//
//				_elements["container"].style.width = _attributes.width +"px";
//				_elements["center"].style.width = width;
//			}		
//		}
//	}
	
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
			if (_temp.enterDown)
			{
				_temp.enterDown = false;
				_temp.mouseDown = false;
				refresh ();
			}
			else
			{
				_temp.enterDown = true;
				_temp.mouseDown = true;
				refresh ();
				
				eventOnClick ();
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