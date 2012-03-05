// -------------------------------------------------------------------------------------------------------------------------
// field ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
// Methods:
//
//	refresh ()
//	getAttribute (attribute)
//	setAttribute (attribute, value)
//
// Attributes:
//		
//	id			get
//	tag 		get/set
//	name 		get/set
//	width		get/set
//	height		get/set
//	appendTo	get/set
//	managed		get/set
//	disabled	get/set
//	focus		get/set
//	onFocus		get/set
//	onBlur		get/set
//	onChange	get/set
//	onKeyUp		get/set
//	value		get/set

/**
 * @constructor
 */
field : function (attributes)
{
	var _elements = new Array ();
	var _attributes = attributes;
	var _elements = new Array ();	
	var _temp = 	{ initialized: false,
					};
	
	// Functions		
	this.refresh = functionRefresh;	
	this.setAttribute = functionSetAttribute;
	this.getAttribute = functionGetAttribute;

	// Construct
	construct ();
	
	// Private functions
	this._attributes = _elements["container"]._attributes;
	this._elements = _elements["container"]._elements;
	this._temp = _elements["container"]._temp;	
	this._init = _elements["container"]._init;	
		
	// ------------------------------------
	// Private functions
	// ------------------------------------
	// ------------------------------------
	// init
	// ------------------------------------		
	function init ()
	{
		_elements["container"]._init ();
	}
	
	// ------------------------------------
	// construct
	// ------------------------------------	
	function construct ()
	{		
		_elements["container"] = new SNDK.SUI.layoutbox ({width: _attributes.width, height: _attributes.height, type: "vertical", stylesheet: "SUILayoutboxNoBorder"});		
		_elements["container"].addPanel ({tag: "containerpanel", size: "*"});
			
		switch (_attributes.type)
		{
			case "string":
			{
				_elements["content"] = new SNDK.SUI.textbox ({tag: _attributes.tag, width: "100%"});
				_elements["container"].getPanel ("containerpanel").addUIElement (_elements["content"]);		
				break;
			}		
			
			case "text":
			{
				var providerconfig = {};			
				providerconfig.theme = "advanced";
				providerconfig.plugins = "table,paste";
				providerconfig.theme_advanced_toolbar_location = "top";
				providerconfig.theme_advanced_toolbar_align = "left";
				providerconfig.theme_advanced_buttons1 = "bold,italic,underline,|,justifyleft, justifycenter, justifyright, justifyfull,|,formatselect,removeformat,|,numlist,bullist,|,undo";
				providerconfig.theme_advanced_buttons2 = "";
				providerconfig.theme_advanced_buttons3 = "";
				providerconfig.theme_advanced_blockformats = "h1,h2,h3,h4,h5,h6,blockquote";
				providerconfig.paste_auto_cleanup_on_paste = true;
				providerconfig.paste_remove_spans = true;
				providerconfig.paste_remove_styles = true;
				providerconfig.paste_remove_styles_if_webkit = true;
				providerconfig.paste_strip_class_attributes = "mso";		
			
				_elements["content"] = new SNDK.SUI.textarea ({tag: _attributes.tag, width: "100%", height: "100%", provider: "tinymce", providerConfig: providerconfig})
				_elements["container"].getPanel ("containerpanel").addUIElement (_elements["content"]);		
				break;
			}		
		}
		
	}	
		
	// ------------------------------------
	// refresh
	// ------------------------------------		
	function refresh ()
	{
		if (_attributes.disabled)
		{
			switch (_attributes.type)
			{
				case "string":
				{
					_elements["content"].setAttribute ("disabled", true);
					break;
				}
				
				case "text":
				{
					_elements["content"].setAttribute ("disabled", true);
					break;	
				}
			}		
		}
		else
		{
			switch (_attributes.type)
			{
				case "string":
				{
					_elements["content"].setAttribute ("disabled", false);
					break;
				}
				
				case "text":
				{
					_elements["content"].setAttribute ("disabled", false);
					break;					
				}
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
		_elements["container"].refresh ();	
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
				return _elements["content"].getAttribute ("id");
			}			

			case "tag":
			{
				return _elements["content"].getAttribute ("tag");
			}			
			
			case "width":
			{
				return _elements["container"].getAttribute ("width")
			}
			
			case "height":
			{
				return _elements["container"].getAttribute ("height")
			}	
			
			case "appendTo":
			{
				return _elements["container"].getAttribute ("appendTo");
			}			
			
			case "managed":
			{
				return _elements["container"].getAttribute ("managed");
			}
			
			case "focus":
			{
				return _elements["content"].getAttribute ("focus");
			}

			case "onFocus":
			{
				return _elements["content"].getAttribute ("onFocus");
			}

			case "onBlur":
			{
				return _elements["content"].getAttribute ("onBlur");
			}

			case "onChange":
			{
				return _elements["content"].getAttribute ("onChange");
			}

			case "onKeyUp":
			{
				return _elements["content"].getAttribute ("onKeyUp");
			}

			case "value":
			{
				return _elements["content"].getAttribute ("value");
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
				_elements["content"].setAttribute ("tag", value);				
				break;
			}
			
			case "name":
			{
				_elements["content"].setAttribute ("name", value);				
				break;
			}
						
			case "width":
			{
				_elements["container"].setAttribute ("width", value);
				break;			
			}

			case "height":
			{
				_elements["container"].setAttribute ("height", value);
				break;			
			}
			
			case "appendTo":
			{
				_elements["container"].setAttribute ("appendTo", value);
				break;
			}			
			
			case "managed":
			{
				_elements["container"].setAttribute ("managed", value);
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
				_elements["content"].setAttribute ("focus", value);
				break;
			}

			case "onFocus":
			{
				_elements["content"].setAttribute ("onFocus", value);
				break;
			}

			case "onBlur":
			{
				_elements["content"].setAttribute ("onBlur", value);
				break;
			}

			case "onChange":
			{
				_elements["content"].setAttribute ("onChange", value);
				break;
			}

			case "onKeyUp":
			{
				_elements["content"].setAttribute ("onKeyUp", value);
				break;
			}

			case "value":
			{
				_elements["content"].setAttribute ("value", value);
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
}
