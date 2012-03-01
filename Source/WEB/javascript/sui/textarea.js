// -------------------------------------------------------------------------------------------------------------------------
// textarea ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
// .refresh ()
// .getAttribute (string)
// .setAttribute (string, string)
//	
//	id		get
//	tag		get/set
//	stylesheet	get/set
//	width		get/set
//	height		get/set
//	appendTo	get/set			
//	managed		get/set
//	value		get/set
//
/**
 * @constructor
 */
textarea : function (attributes)
{

	var _elements = new Array ();			
	var _attributes = attributes;	

	var _temp =	{ 	initialized: false,
			  		providerInitialized: false,
			  		pageSizeX: 0,
			  		pageSizeY: 0,
			  		cache: new Array ()
				};
														
	_attributes.id = SNDK.tools.newGuid ()	
					
	setAttributes ();
	
	// Private functions
	this._attributes = _attributes;
	this._elements = _elements;
	this._temp = _temp;	
	this._init = init;	
		
	// Functions
	this.refresh = functionRefresh;	
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
		
		// TOP
		_elements["top"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
		_elements["topleft"] = SNDK.tools.newElement ("div", {className: "TopLeft", appendTo: _elements["top"]});
		_elements["topcenter"] = SNDK.tools.newElement ("div", {className: "TopCenter", appendTo: _elements["top"]});
		_elements["topright"] = SNDK.tools.newElement ("div", {className: "TopRight", appendTo: _elements["top"]});		
				
		// CENTER
		_elements["center"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
		_elements["centerleft"] = SNDK.tools.newElement ("div", {className: "CenterLeft", appendTo: _elements["center"]});
		_elements["centercenter"] = SNDK.tools.newElement ("div", {className: "CenterCenter", appendTo: _elements["center"]});
		_elements["centerright"] = SNDK.tools.newElement ("div", {className: "CenterRight", appendTo: _elements["center"]});				

		// BOTTOM
		_elements["bottom"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
		_elements["bottomleft"] = SNDK.tools.newElement ("div", {className: "BottomLeft", appendTo: _elements["bottom"]});
		_elements["bottomcenter"] = SNDK.tools.newElement ("div", {className: "BottomCenter", appendTo: _elements["bottom"]});
		_elements["bottomright"] = SNDK.tools.newElement ("div", {className: "BottomRight", appendTo: _elements["bottom"]});
		
		// AREA
		switch (_attributes.provider)
		{
			case "default":
			{
				_elements["area"] = SNDK.tools.newElement ("div", {className: "Area", appendTo: _elements["centercenter"]});
				_elements["provider"] = SNDK.tools.newElement ("textarea", {className: "Provider", appendTo: _elements["area"]});
				_elements["provider"].style.resize = "none";
				_elements["provider"].name = _attributes.name;				
				_elements["provider"].style.width = "100%";
				_elements["provider"].style.height = "100%";
				
				_elements["provider"].onfocus = eventOnFocus;
				_elements["provider"].onblur = eventOnBlur;
				_elements["provider"].onkeyup = eventOnChange;
				_elements["provider"].onchange = eventOnChange;
				_elements["provider"].value = _attributes.value;
				
				break;
			}
			
			case "codemirror":
			{
				_elements["area"] = SNDK.tools.newElement ("div", {appendTo: _elements["centercenter"]});
				
				_attributes.providerConfig.onFocus = eventOnFocus;
				_attributes.providerConfig.onBlur = eventOnBlur;
				_attributes.providerConfig.onChange = eventOnChange;
				
				_attributes.providerConfig.onKeyEvent = 	function (editor, event) 
															{
																eventOnKeyUp (event);
															}
				
				_attributes.providerConfig.value = _attributes.value;
			
				_elements["provider"] = new CodeMirror(_elements["area"], _attributes.providerConfig);					
				
				_temp.providerInitialized = true;
				break;
			}
			
			case "tinymce":
			{
				_temp.tinymceId = SNDK.tools.newGuid ();
				_elements["area"] = SNDK.tools.newElement ("div", {appendTo: _elements["centercenter"], id: _temp.tinymceId});
		
				_attributes.providerConfig.init_instance_callback =	function (editor) 
																	{
																		tinymce.dom.Event.add (editor.getWin (), 'focus', eventOnFocus); 																	
																		tinymce.dom.Event.add (editor.getWin (), 'blur', eventOnBlur);
																	};							
																					
				_elements["provider"] = new tinymce.Editor(_temp.tinymceId, _attributes.providerConfig);							
				
				_elements["provider"].render ();
				_elements["provider"].onInit.add (	function () 
													{ 
														_elements["provider"].setContent (_attributes.value);
														_temp.providerInitialized = true;
													});
								
				_elements["provider"].onChange.add (eventOnChange);
				_elements["provider"].onKeyUp.add (	function (editor, event) 
													{
														eventOnKeyUp (event);										
													});
											
				break;
			}
		}		
		
		// Hook events		
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
				_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet+"Disabled";			
			
				switch (_attributes.provider)
				{
					case "default":
					{
						_elements["provider"].disabled = true;
						break;
					}
				
					case "codemirror":
					{					
						_elements["provider"].setOption ("readOnly", true);
						break;
					}
		
					case "tinymce":
					{
						break;
					}
				}				
			}			
			else
			{
				switch (_attributes.provider)
				{
					case "default":
					{
						_elements["provider"].disabled = false;
						break;
					}
				
					case "codemirror":
					{					
						_elements["provider"].setOption ("readOnly", false);
						break;
					}
		
					case "tinymce":
					{
						break;
					}
				}				
								
				if (_attributes.focus)
				{
					_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Focus";
				}
				else
				{
					_elements["container"].className = _attributes.stylesheet;
				}
			}		
		}
				
		setDimensions ();
	}

	// ------------------------------------
	// updateCache
	// ------------------------------------		
	function updateCache ()
	{
		if (!_temp.cacheUpdated)
		{
			_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
			_temp.cache["containerWidth"] = (SNDK.tools.getElementStyledWidth (_elements["topleft"]) + SNDK.tools.getElementStyledWidth (_elements["topright"]));
			_temp.cache["containerHeight"] = (SNDK.tools.getElementStyledWidth (_elements["topleft"]) + SNDK.tools.getElementStyledWidth (_elements["bottomleft"]));
		}
		
		_temp.cacheUpdated = true;	
	}	
	
	// ------------------------------------
	// setAttributes
	// ------------------------------------		
	function setAttributes ()
	{	
		// Name
		if (!_attributes.name)		
			_attributes.name = "";	
		
		// Stylesheet
		if (!_attributes.stylesheet)
		{
			_attributes.stylesheet = "SUITextarea";
		}
						 		
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

		// Height
		if (!_attributes.height) 
			_attributes.height = "100px";
			
		if (_attributes.height.substring (_attributes.height.length - 1) == "%")
		{
			_attributes.heightType = "percent";
			_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
		}
		else
		{
			_attributes.heightType = "pixel";
			_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
		}						 		
						 									
		// Disabled
		if (!_attributes.disabled)
			_attributes.disabled = false;		
										
		// Focus	
		if (!_attributes.focus)
			_attributes.focus = false
		
		// Disabled
		if (!_attributes.disabled)		
			_attributes.disabled = false;				
														
		// Focus	
		if (!_attributes.focus)
			_attributes.focus = false;
				
		// onFocus
		if (!_attributes.onFocus)
			_attributes.onFocus = null;	
			
		// onBlur
		if (!_attributes.onBlur)
			_attributes.onBlur = null;	

		// onChange
		if (!_attributes.onChange)
			_attributes.onChange = null;
								
		// Value
		if (!_attributes.value)
			_attributes.value = "";	
		
		// Provider
		if (_attributes.provider == null)
		{
			_attributes.provider = "default";	
		}		
	}	
	
	// ------------------------------------
	// setDimensions
	// ------------------------------------
	function setDimensions ()
	{
		var width = {};	
		var height = {};
		var combinedheightofchildren = 0;

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

		if (!_attributes.managed && _attributes.heightType != "pixel")
		{					
			height.container = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100) - _temp.cache.containerPadding["vertical"];
		}
		else
		{			
			if (_attributes.managed && _attributes.heightType == "percent")
			{
				height.container = _attributes.managedHeight - _temp.cache.containerPadding["vertical"];				
			}
			else
			{
				height.container = _attributes.height - _temp.cache.containerPadding["vertical"];
			}			
		}	
		
		width.topCenter = width.container - _temp.cache.containerWidth;
		width.centerCenter = width.container - _temp.cache.containerWidth;
		width.bottomCenter = width.container - _temp.cache.containerWidth;
		width.area = width.container - _temp.cache.containerWidth;
		
		height.centerLeft = height.container - _temp.cache.containerHeight;
		height.centerCenter = height.container - _temp.cache.containerHeight;
		height.centerRight = height.container - _temp.cache.containerHeight;
		height.area = height.container - _temp.cache.containerHeight;
		
		_elements["container"].style.width = width.container +"px";				
		
		_elements["topcenter"].style.width = width.topCenter +"px";
		_elements["centercenter"].style.width = width.centerCenter +"px";
		_elements["bottomcenter"].style.width = width.bottomCenter +"px";	

		_elements["container"].style.height = height.container +"px"; 	
		
		_elements["centerleft"].style.height = height.centerLeft +"px";
		_elements["centercenter"].style.height = height.centerCenter +"px";
		_elements["centerright"].style.height = height.centerRight +"px";									
		
		_elements["area"].style.width = width.area +"px";
		_elements["area"].style.height = height.area +"px";
		
		if (_temp.providerInitialized)
		{
			switch (_attributes.provider)
			{
				case "codemirror":
				{
//					setTimeout (	function () 
//									{								
										_elements["provider"].getScrollerElement().style.height = height.area +"px";
										_elements["provider"].refresh ();			
//									}, 10);
					break;
				}
		
				case "tinymce":
				{
					document.getElementById(_temp.tinymceId +'_tbl').style.width = width.area + "px";
					document.getElementById(_temp.tinymceId +'_tbl').style.height = height.area +"px";										
					_elements["provider"].execCommand ("mceRepaint");
					break;
				}
			}
		}									
	}
		
	function setDimensions2 ()
	{		
		// Get padding dimensions of container.
		var containerpadding = SNDK.tools.getElementStyledPadding (_elements["container"]);

		// If either width or height is in percent, we also need parent padding dimensions.
		var parentpadding;
		if (_attributes.widthType == "percent" || _attributes.heightType == "percent")
		{
			parentpadding = SNDK.tools.getElementStyledPadding (_elements["container"].parentNode);
		}
		
		// Get all corners styled widths.										
		var topleftwidth = SNDK.tools.getElementStyledWidth (_elements["topleft"]); 
		var toprightwidth = SNDK.tools.getElementStyledWidth (_elements["topright"]); 		
		var topleftheight = SNDK.tools.getElementStyledHeight (_elements["topleft"]); 
		var bottomleftheight = SNDK.tools.getElementStyledHeight (_elements["bottomright"]); 	
		
		
		if (_attributes.widthType == "percent")
		{				
			containerwidth = topleftwidth + toprightwidth + containerpadding.horizontal;
		}
		else
		{
			 containerwidth = topleftwidth + toprightwidth;
		}
		
		if (_attributes.heightType == "percent")		
		{	
			containerheight = topleftheight + bottomleftheight + containerpadding.vertical;
		}
		else
		{
			containerheight = topleftheight + bottomleftheight;		
		}
							
		// TODO: this needs to be calculated right.
		var areawidth = parseInt (SNDK.tools.getStyle (_elements["area"], "margin-left")) + parseInt (SNDK.tools.getStyle (_elements["area"], "margin-right"));
		var areaheight = parseInt (SNDK.tools.getStyle (_elements["area"], "margin-top")) + parseInt (SNDK.tools.getStyle (_elements["area"], "margin-bottom"));

		// WIDTH			
		if (_attributes.widthType == "percent")
		{
			var parentnode = _elements["container"].parentNode;
			
			_elements["container"].style.width = parentnode.offsetWidth - containerpadding.horizontal - parentpadding.horizontal +"px";
			
			var pagesize = SNDK.tools.getPageSize ();
			if (_temp.pageSizeX == 0)
			{
				_temp.pageSizeX = pagesize[0];
			}			
			
			setTimeout (	function () 
					{	
						if (_temp.pageSizeX != pagesize[0])
						{
							_elements["topcenter"].style.width = 0 +"px";
							_elements["centercenter"].style.width = 0 +"px";
							_elements["bottomcenter"].style.width = 0 +"px";
							_elements["area"].style.width = 0 +"px";
				
							_temp.pageSizeX = pagesize[0];
						}	
													
						var width = _elements["container"].offsetWidth
						width = width - containerwidth;
						
						_elements["topcenter"].style.width = width +"px";
						_elements["centercenter"].style.width = width +"px";
						_elements["bottomcenter"].style.width = width +"px";			
			
						_elements["area"].style.width = width - areawidth +"px";	
					}, 0);						
		}
		else
		{
		
			_elements["container"].style.width = _attributes.width +"px";
			_elements["topcenter"].style.width = _attributes.width - containerwidth +"px";
			_elements["centercenter"].style.width = _attributes.width - containerwidth +"px";
			_elements["bottomcenter"].style.width = _attributes.width - containerwidth +"px";	

		// TODO: areawidth needs to be calculated.
//			_elements["area"].style.width = _attributes.width - containerwidth - areawidth +"px";
			_elements["area"].style.width = _attributes.width - containerwidth +"px";
		}

		// HEIGHT
		if (_attributes.heightType == "percent")
		{
			var parentnode = _elements["container"].parentNode;
						
			_elements["container"].style.height = parentnode.offsetHeight - containerpadding.vertical - parentpadding.vertical +"px";
			
			
			var pagesize = SNDK.tools.getPageSize ();
			if (_temp.pageSizeY == 0)
			{
				_temp.pageSizeY = pagesize[1];
			}			
			
			setTimeout (	function () 
					{	

						if (_temp.pageSizeX != pagesize[0])
						{
							_elements["centerleft"].style.height = 0 +"px";
							_elements["centercenter"].style.height = 0 +"px";
							_elements["centerright"].style.height = 0 +"px";
							_elements["area"].style.height = 0 +"px";
				
							_temp.pageSizeY = pagesize[1];				
						}	
													
						var height = _elements["container"].offsetHeight
						
						_elements["centerleft"].style.height = height - containerheight +"px";
						_elements["centercenter"].style.height = height - containerheight +"px";
						_elements["centerright"].style.height = height - containerheight +"px";						
						
						_elements["area"].style.height = height - containerheight +"px";
					}, 0);	
		}
		else
		{
			_elements["centerleft"].style.height = _attributes.height +"px";
			_elements["centercenter"].style.height = _attributes.height +"px";
			_elements["centerright"].style.height = _attributes.height +"px";		
	
			// TODO: area height needs to be calculated.
//			_elements["area"].style.height = _attributes.height - areaheight +"px";			
			_elements["area"].style.height = _attributes.height  +"px";
		}
		
		if (_temp.providerInitialized)
		{
		switch (_attributes.provider)
		{
			case "codemirror":
			{
				setTimeout (	function () 
				{
				_elements["provider"].refresh ();			
				}, 10);
				break;
			}
			
			case "tinymce":
			{
//				document.getElementById(_temp.tinymceId +'_tbl').style.width = "200px"
//				document.getElementById(_temp.tinymceId +'_tbl').style.height = "200px"
				
				//alert ("test"+ document.getElementById(_temp.tinymceId +'_tbl'))
			
//				_elements["provider"].execCommand ("mceRepaint");
				break;
			}
		}
		}
		//alert (_temp.providerInitialized)
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
	}	
	
	function getValue ()
	{		
		switch (_attributes.provider)
		{
			case "default":
			{
				_attributes.value = _elements["provider"].value;
				break;
			}
			
			case "codemirror":
			{
				_attributes.value = _elements["provider"].getValue ();
				break;
			}
			
			case "tinymce":
			{
				_attributes.value = _elements["provider"].getContent ();
				break;
			}
		}
	}
	
	function setValue ()
	{
		switch (_attributes.provider)
		{
			case "default":
			{
				_elements["provider"].value = _attributes.value;
				break;
			}
			
			case "codemirror":
			{
				_elements["provider"].setValue (_attributes.value);
				break;
			}
			
			case "tinymce":
			{
				_elements["provider"].setContent (_attributes.value);
				break;
			}
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

			case "autocomplete":
			{
				return _attributes[attribute];			
			}

			case "readOnly":
			{
				return _attributes[attribute];			
			}
			
			case "focus":
			{
				return _attributes[attribute];			
			}

			case "password":
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

			case "onKeyUp":
			{
				return _attributes[attribute];			
			}

			case "value":
			{
				getValue ();
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

			case "autocomplete":
			{
				_attributes[attribute] = value;
				break;
			}

			case "readOnly":
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

			case "onKeyUp":
			{
				_attributes[attribute] = value;
				break;
			}

			case "value":
			{		
				_attributes[attribute] = value;
				setValue ();
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
		var result = true;
			
		result = keyHandler (event);		
		
		getValue ();				
		
		if (_attributes.onKeyUp != null)
		{
			setTimeout( function () { _attributes.onKeyUp (_attributes.name); }, 1);
		}		
					
		return result;				
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
		if (_temp.initialized)
		{		
			getValue ();
			
			if (_attributes.onChange != null)
			{
				setTimeout( function ()	{ _attributes.onChange (); }, 1);
			}
		}
	}	
}