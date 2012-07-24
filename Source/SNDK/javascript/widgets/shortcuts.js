shortcuts : function (attributes)
{
	var _elements = new Array ();
	var _attributes = attributes;		
	var _temp = 	{ initialized: false,
			  id: SNDK.tools.newGuid (),
			  isDirty: false,
			  selected: null
			};
			
	setAttributes ();
															
	// Functions
	this.type = "SHORTCUTS";
	this.refresh = functionRefresh;
	this.addItem = functionAddItem;
	this.removeItem = functionRemoveItem;
	this.getAttribute = functionGetAttribute;
	this.setAttribute = functionSetAttribute;
																							
	// Construct
	construct ();

	// Initialize
	window.onDomReady (init);

	// --------------------------------------------------------------------------------------------------------------------------------------
	// Private functions
	// --------------------------------------------------------------------------------------------------------------------------------------
	function init ()
	{			
		if (typeof (_attributes.appendTo) == "string")
		{
			_attributes.appendTo = document.getElementById (_attributes.appendTo);
		}
		
		_attributes.appendTo.appendChild (_elements["container"]);		

		_temp.initialized = true;	
	};			
					
	function construct ()
	{				
		// Container
		_elements["container"] = SNDK.tools.newElement ("ul", {});
		_elements["container"].setAttribute ("id", _attributes.id);
		_elements["container"].className = _attributes.stylesheet;
					
		// Items
		drawItems ();	
	}
		
	function drawItems ()
	{
		// Clear current items.
		_elements["container"].innerHTML = " ";
		
		// Create new items.
		_elements["items"] = new Array ();
		for (index in _attributes.items)
		{		
			var item = _attributes.items[index];							
			var element1 = new SNDK.tools.newElement ("li", {id: _temp.id +"+"+ item.tag, appendTo: _elements["container"]});
			var element2 = new SNDK.tools.newElement ("a", {appendTo: element1});								
			
			if (item.link)
			{
				element2.setAttribute ("href", item.link);
			}
			
			if (item.onClick)
			{
				element1.onclick = function () {eventOnClick (this)};				
			}				
			
			// This Item uses icons.
			if (item.icon)
			{
				var attributes = item.icon.split (",");
				
				var icon = attributes[0];
				var color1 = attributes[1];
				var color2 = attributes[2];
			
				var icon1 = new SNDK.tools.newElement ("span", {id: "icon1", className: "icon-"+ icon +" icon-size4 "+ color1, appendTo: element2});
				var icon2 = new SNDK.tools.newElement ("span", {id: "icon2", className: "icon-"+ icon +" icon-size4 "+ color2, appendTo: element2});
			}
			
			// This Item uses stylesheet.
			if (_attributes.stylesheet)
			{
				element2.className = item.stylesheet;	
			}	
			
			_elements["items"][index] = element1;
		}
	}
			
	function refresh ()
	{
		if (_temp.isDirty)
		{
			drawItems ();
			_temp.isDirty = false;
		}
	}
	
	function setAttributes ()
	{
		// Id
		_attributes.id = SNDK.tools.newGuid ();
	
		// Stylesheet
		if (!_attributes.stylesheet)
			_attributes.stylesheet = "shortcuts";			

		// Items
		if (!_attributes.items)
			_attributes.items = new Array ();
		
		// Tag
		if (!_attributes.tag)
			_attributes.tag = "";
		
		
		// XML
		if (_attributes.XML)
			parseXML ();					
	}
	
	function parseXML ()
	{
		if (_attributes.XML)
		{		
			var parseAttributes =	function (attributes)
			{
				var result = {};
				for (var i = 0; i < attributes.length; i++)
				{		
					var value = attributes[i].value;
					var attribute = attributes[i].name;
									
					if (value.toLowerCase () == "true")
					{
						value = true;
					}
					else if (value.toLowerCase () == "false")
					{
						value = false;
					}
									
					result[attribute] = value; 
				}
			
				return result;
			}
			
			var root = _attributes.XML.getElementsByTagName ("shortcuts").item (0);	
	
			var parseXML = function (nodes)
			{
				for (var index = 0, len = nodes.length; index < len; index++)
				{
					var node = nodes.item (index);
					if (node == null)
					{
						continue;
					}
									
					switch (node.tagName)
					{
						case "item":
						{													
							var attributes = parseAttributes (node.attributes);
					
							_attributes.items[attributes.tag] = attributes;
																	
							break;
						}	
					}
				}
			}				
		
			parseXML (root.childNodes);
		}
	}		
					
	function getAttribute (attribute)
	{
		switch (attribute)
		{
			case "id":
			{
				return _attributes[attribute];
			}
		
			case "selected":
			{
				return _temp.selected;
			}
							
			default:
			{
				throw "No attribute with the name '"+ attribute +"' exist in this object";
			}
		}	
	}

	function setAttribute (attribute, value)
	{
		switch (attribute)
		{
			case "id":
			{
				throw "Attribute with name ID is ready only.";
				break;
			}

			case "selected":
			{
				setSelected (value);
				break;;
			}

										
			default:
			{
				throw "No attribute with the name '"+ attribute +"' exist in this object";
			}
		}	
	}	
	
	function setSelected (tag)
	{
		if (_temp.selected != null)
		{
			try
			{
			_elements["items"][_temp.selected].className = "";
			}
			catch (e)
			{
			}
		}
		
		_temp.selected = tag;
	
		_elements["items"][tag].className = "current";		
	}		
	
	function addItem (item)
	{
		// If not tag has been set, make sure one is.
		if (!item.tag)
			item.tag = SNDK.tools.newGuid ();
	
		_attributes.items[item.tag] = item;
		
		// Refresh
		_temp.isDirty = true;
		refresh ();
					
		return item.tag;		
	}			
	
	function removeItem (tag)
	{
		for (index in _attributes.items)
		{				
			var item = _attributes.items[index];
								
			if (item.tag == tag)
			{
				// Remove item
				delete _attributes.items [index];
				
				// Refresh
				_temp.isDirty = true;
				refresh ();
				
				break;
			}
		}								
	}
	

	// --------------------------------------------------------------------------------------------------------------------------------------
	// Public functions
	// --------------------------------------------------------------------------------------------------------------------------------------
	function functionAddItem (item)
	{
		return addItem (item)
	}
	
	function functionRemoveItem (tag)
	{		
		removeItem (tag);
	}	
	
	function functionRefresh ()
	{
		refresh ();
	}	
	
	function functionGetAttribute (attribute)
	{
		return getAttribute (attribute);
	}
	
	function functionSetAttribute (attribute, value)
	{
		setAttribute (attribute, value);
	}
	
	
	// --------------------------------------------------------------------------------------------------------------------------------------
	// Events
	// --------------------------------------------------------------------------------------------------------------------------------------		
	function eventOnClick (element)
	{
		for (index in _attributes.items)
		{
			var item = _attributes.items[index];
			var id = element.id.split ("+")[1];
			
			if (item.tag == id)
			{
				if (item.onClick)
				{
					setSelected (id)
				
					switch (typeof (item.onClick))
					{
						case "string":
						{	
							setTimeout (function () {eval (item.onClick +"('"+id+"')")}, 1);
							break;
						}
						
						case "function":
						{
							setTimeout (function () {item.onClick (id)}, 1);								
							break;							
						}
					}					
				}
			
				break;
			}
		}			
	}		
}	
