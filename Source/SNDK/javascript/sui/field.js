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
					
	setAttributes ();
	
	// Functions		
	this.refresh = functionRefresh;	
	this.setAttribute = functionSetAttribute;
	this.getAttribute = functionGetAttribute;
	this.dispose = functionDispose;
	
	// ------------------------------------
	// STRING
	// ------------------------------------		
	var string =
	{
		onChange : function ()
		{
			if (_attributes.onChange != null)
			{
				setTimeout( function ()	{ _attributes.onChange (); }, 1);
			}
		}	
	}
	
	// ------------------------------------
	// LISTSTRING
	// ------------------------------------		
	var liststring =
	{
		add : function ()
		{
			var onDone =	function (string)
							{
								if (string != null)
								{
									_elements["content"].addItem (string);
									
								}
							};
							
			sCMS.modal.edit.fieldString ({onDone: onDone});			
		},
		
		edit : function ()
		{
			var onDone =	function (string)
							{
								if (string != null)
								{
									_elements["content"].setItem (string);
									
								}
							};
							
			sCMS.modal.edit.fieldString ({string: _elements["content"].getItem (), onDone: onDone});
		},
		
		remove : function ()
		{
			_elements["content"].removeItem ();
		},
		
		onChange : function ()
		{
			if (_elements["content"].getItem () != null)
			{
				_elements["edit"].setAttribute ("disabled", false);
				_elements["remove"].setAttribute ("disabled", false);
			}
			else
			{
				_elements["edit"].setAttribute ("disabled", true);
				_elements["remove"].setAttribute ("disabled", true);
			}
			
			if (_attributes.onChange != null)
			{
				setTimeout( function ()	{ _attributes.onChange (); }, 1);
			}
		}
	};	
	
	// ------------------------------------
	// TEXT
	// ------------------------------------		
	var text =
	{
		onChange : function ()
		{
			if (_attributes.onChange != null)
			{
				setTimeout( function ()	{ _attributes.onChange (); }, 1);
			}
		}
	}
	
	// ------------------------------------
	// LINK
	// ------------------------------------		
	var link =
	{
		choose : function ()
		{
			var onDone =	function (result)
							{							
								if (result != null)
								{																					
									var page = sCMS.page.load (result.id);													
									_elements["content"].setAttribute ("value", page.path);
								}
							};
	
			sCMS.modal.chooser.page ({onDone: onDone});									
		},
		
		onChange : function ()
		{
			if (_attributes.onChange != null)
			{
				setTimeout( function ()	{ _attributes.onChange (); }, 1);
			}
		}
	}
	
	// ------------------------------------
	// IMAGE
	// ------------------------------------		
	var image = 
	{
		value : null,		
		
		set : function (value)
		{
			if (value != "00000000-0000-0000-0000-000000000000")
			{
				image.value = sorentoLib.media.load (value);				
				_elements["content"].setAttribute ("source", "/console/cache/thumbnails/"+ image.value.id +"_large.jpg");
			}
			else
			{			
				image.value = null;
				_elements["content"].setAttribute ("source", "");
			}
			
			image.onChange ();
		},
		
		get : function ()
		{
			var result = "00000000-0000-0000-0000-000000000000";
		
			if (image.value != null)
			{
				result = image.value.id;
			}
			
			return result;
		},
		
		clear : function ()
		{
			image.set ("00000000-0000-0000-0000-000000000000");
		},
	
		upload : function ()
		{
			var onDone =	function (media)
							{
								if (media != null)
								{		
									image.set (media.id);																																											
									
								};
							};
				
			sConsole.modal.chooser.media ({type: "image", subType: "upload", path: "/media/scms/%%FILENAME%%%%EXTENSION%%", mediatransformations: _attributes.options.mediatransformationids, onDone: onDone});
		},
		
		onChange : function ()
		{		
			if (_attributes.onChange != null)
			{
				setTimeout( function ()	{ _attributes.onChange (); }, 1);
			}
		}
	}

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
		_elements["container"] = new SNDK.SUI.layoutbox ({width: _attributes.width, height: _attributes.height, type: "vertical", stylesheet: "SUILayoutboxNoBorder", appendTo: _attributes.appendTo});		
		_elements["container"].addPanel ({tag: "containerpanel", size: "*"});
			
		switch (_attributes.type)
		{
			case "string":
			{
				_elements["content"] = new SNDK.SUI.textbox ({tag: _attributes.tag, width: "100%"});
				_elements["content"].setAttribute ("value", _attributes.value);
				_elements["content"].setAttribute ("onChange", string.onChange);
				_elements["content"].setAttribute ("onKeyUp", string.onChange);
				
				_elements["container"].getPanel ("containerpanel").addUIElement (_elements["content"]);		
				
				_elements["content"].setAttribute ("onKeyUp", string.onChange);
				break;
			}		
			
			case "liststring":
			{
				// LAYOUT1
				_elements["layout1"] = new SNDK.SUI.layoutbox ({width: _attributes.width, height: _attributes.height, type: "vertical", stylesheet: "SUILayoutboxNoBorder"});
				_elements["layout1"].addPanel ({tag: "panel1", size: "*"});
				_elements["layout1"].addPanel ({tag: "panel2", size: "100px"});				
				_elements["container"].getPanel ("containerpanel").addUIElement (_elements["layout1"]);		
				
				// CONTENT
				var columns = new Array ();
				columns[0] = {tag: "value", label: "", width: "250px", visible: "true"};

				_elements["content"] = new SNDK.SUI.listview ({tag: _attributes.tag, width: "100%", height: "100%", columns: columns});
				_elements["content"].setAttribute ("onChange", liststring.onChange);																				
				_elements["layout1"].getPanel ("panel1").addUIElement (_elements["content"]);	
				
				// ADD
				_elements["add"] = new SNDK.SUI.button ({label: "Add", stylesheet: "SUIButtonSmall"});
				_elements["add"].setAttribute ("onClick", liststring.add)				
				_elements["layout1"].getPanel ("panel2").addUIElement (_elements["add"]);
				
				// EDIT
				_elements["edit"] = new SNDK.SUI.button ({label: "Edit", stylesheet: "SUIButtonSmall", disabled: true});
				_elements["edit"].setAttribute ("onClick", liststring.edit)
				_elements["layout1"].getPanel ("panel2").addUIElement (_elements["edit"]);
				
				// REMOVE
				_elements["remove"] = new SNDK.SUI.button ({label: "Remove", stylesheet: "SUIButtonSmall", disabled: true});
				_elements["remove"].setAttribute ("onClick", liststring.remove)
				_elements["layout1"].getPanel ("panel2").addUIElement (_elements["remove"]);
				
				break;
			}
			
			case "text":
			{
				var providerconfig = {};			
				providerconfig.theme = "advanced";
				providerconfig.plugins = "table,paste";
				providerconfig.theme_advanced_toolbar_location = "top";
				providerconfig.theme_advanced_toolbar_align = "left";
				providerconfig.theme_advanced_buttons1 = "bold,italic,underline,|,justifyleft, justifycenter, justifyright, justifyfull,|,formatselect,removeformat,|,numlist,bullist,|,undo,|,link,unlink";
				providerconfig.theme_advanced_buttons2 = "";
				providerconfig.theme_advanced_buttons3 = "";
				providerconfig.theme_advanced_blockformats = "h1,h2,h3,h4,h5,h6,blockquote";
				providerconfig.paste_auto_cleanup_on_paste = true;
				providerconfig.paste_remove_spans = true;
				providerconfig.paste_remove_styles = true;
				providerconfig.paste_remove_styles_if_webkit = true;
				providerconfig.paste_strip_class_attributes = "mso";		
				providerconfig.convert_urls = false;
								
				providerconfig.execcommand_callback = 	function (id, element, command, ui, value) 
														{   
															return sConsole.tinymce.execcommand_callback ({id: id, element: element, command: command, ui: ui, value: value, callback: sCMS.modal.tinymce.link});
														};
				
			
				_elements["content"] = new SNDK.SUI.textarea ({tag: _attributes.tag, width: "100%", height: "100%", provider: "tinymce", providerConfig: providerconfig})				
				_elements["content"].setAttribute ("value", _attributes.value);
				_elements["content"].setAttribute ("onChange", text.onChange);
				_elements["content"].setAttribute ("onKeyUp", text.onChange);
				
				_elements["container"].getPanel ("containerpanel").addUIElement (_elements["content"]);		
				break;
			}		
			
			case "link":
			{
				_elements["content"] = new SNDK.SUI.textbox ({tag: _attributes.tag, width: "90%"});
				_elements["content"].setAttribute ("value", _attributes.value);
				_elements["content"].setAttribute ("onChange", link.onChange);
				_elements["content"].setAttribute ("onKeyUp", link.onChange);
								
				_elements["container"].getPanel ("containerpanel").addUIElement (_elements["content"]);		
				
				_elements["choose"] = new SNDK.SUI.button ({label: "Select", width: "10%"});
				_elements["choose"].setAttribute ("onClick", link.choose);				
				_elements["container"].getPanel ("containerpanel").addUIElement (_elements["choose"]);		
				
				break;
			}
			
			case "image":
			{
				// LAYOUT1
				_elements["layout1"] = new SNDK.SUI.layoutbox ({width: _attributes.width, height: _attributes.height, type: "horizontal", stylesheet: "SUILayoutboxNoBorder"});
				_elements["layout1"].addPanel ({tag: "panel1", size: "190px"});
				_elements["layout1"].addPanel ({tag: "panel2", size: "*"});				
				_elements["container"].getPanel ("containerpanel").addUIElement (_elements["layout1"]);		
								
				// CONTENT
				_elements["content"] = new SNDK.SUI.image ({tag: _attributes.tag, width: "190px", height: "190px", columns: columns});
				//_elements["content"].setAttribute ("onChange", image.onChange);				
				_elements["layout1"].getPanel ("panel1").addUIElement (_elements["content"]);	
				
				// CLEAR
				_elements["clear"] = new SNDK.SUI.button ({label: "Clear", width: "95px", stylesheet: "SUIButtonSmall"});
				_elements["clear"].setAttribute ("onClick", image.clear)
				_elements["layout1"].getPanel ("panel2").addUIElement (_elements["clear"]);
				
				// UPLOAD
				_elements["upload"] = new SNDK.SUI.button ({label: "Upload", width: "95px", stylesheet: "SUIButtonSmall"});
				_elements["upload"].setAttribute ("onClick", image.upload)
				_elements["layout1"].getPanel ("panel2").addUIElement (_elements["upload"]);
							
				break;
			}
		}					
	}	
		
	function functionDispose ()
	{
		switch (_attributes.type)
		{
			case "string":
			{
				break;
			}		
			
			case "text":
			{
				_elements["content"].dispose ();
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
				
				case "liststring":
				{
					return
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
				
				case "liststring":
				{
					return
					break;
				}
				
				case "text":
				{
					_elements["content"].setAttribute ("disabled", false);
					break;					
				}
				
				case "image":
				{
					return
					break;
				}
			}
		}
	}
	
	// ------------------------------------
	// setAttributes
	// ------------------------------------		
	function setAttributes ()
	{	
		// VALUE
		if (!_attributes.value)
			_attributes.value = "";	
			
		// OPTIONS
		if (!_attributes.options)
			_attributes.options = new Array ();
			
		// OPTIONS.MEDIATRANSFORMATIONIDS
		if (!_attributes.options.mediatransformationids)
			_attributes.options.mediatransformationids = "";
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
				return _attributes[attribute];
			}

			case "value":
			{
				switch (_attributes.type)
				{
					case "string":
					{
						return _elements["content"].getAttribute ("value");
						break;
					}
					
					case "liststring":
					{						
						var items = _elements["content"].getItems ();
						var result = "";
						for (index in items)
						{
							result += items[index].value +"\n";
						}
					
						return result;						
					}
					
					case "text":
					{
						return _elements["content"].getAttribute ("value");						
					}
					
					case "link":
					{
						return _elements["content"].getAttribute ("value");						
					}
					
					case "image":
					{				
						return image.get ();								
					}
				}				
			}			

			default:
			{			
				throw "No attribute with the name '"+ attribute +"' exist in this object. (GET)";
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
//				switch (_attributes.type)
//				{
//					case "string":
//					{						
//						_attributes[attribute] = value;
//						_elements["content"].setAttribute ("onKeyUp", value);
//						break;					
	//				}
					
//					case "liststring":
//					{
//						_attributes[attribute] = value;
//						break;
//					}
					
//					case "text":
//					{
//						_attributes[attribute] = value;
//						_elements["content"].setAttribute ("onChange", value);
//						_elements["content"].setAttribute ("onKeyUp", value);
//						break;
//					}
					
//					case "link":
//					{						
						//_elements["content"].setAttribute ("onKeyUp", value);
//						_attributes[attribute] = value;
//						break;					
//					}
					
//					case "image":
//					{
//						image.onChangeValue = value;
//						break;
//					}
//				}								

				_attributes[attribute] = value;						
				break;
			}

			case "value":
			{
				switch (_attributes.type)
				{
					case "string":
					{
						_elements["content"].setAttribute ("value", value);
						break;
					}
					
					case "liststring":
					{
						var split = value.split ("\n");
						for (index in split)
						{
							if (split[index] != "")
							{
								var item = {};
								item.value = split[index];
								_elements["content"].addItem (item);
							}						
						}
						break;
					}
					
					case "text":
					{
						_elements["content"].setAttribute ("value", value);
						break;
					}
					
					case "link":
					{
						_elements["content"].setAttribute ("value", value);
						break;
					}
					
					case "image":
					{
						image.set (value);
						break;
					}
				}
				
				break;
			}			
					
			default:
			{
				throw "No attribute with the name '"+ attribute +"' exist in this object. (SET)";
			}
		}	
	}										
					
	// ------------------------------------
	// Events
	// ------------------------------------
}
