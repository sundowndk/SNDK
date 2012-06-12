simplaMenu : function (attributes)
{
	var _elements = new Array ();
	var _attributes = attributes;
	var _temp = 	{ initialized: false,
			  id: SNDK.tools.newGuid (),
			  selectedCategory: null,
			  selectedItem: null,
			  expandedCategory: null,
			  lastid: "",
			  lastfocus: "",
			  animations: new Array (),
			  categoryheight: null			  
			};

	_attributes.id = SNDK.tools.newGuid ();
										
	// Construct
	construct ();
	
	// Initialize
	window.onDomReady (init);

	function init ()
	{
		if (typeof (_attributes.appendTo) == "string")
		{
			_attributes.appendTo = document.getElementById (_attributes.appendTo);
		}

		_attributes.appendTo.appendChild (_elements["container"]);		
		
		if (SNDK.cookie.get ("simplamenu-selected"))
		{						
			setSelected (SNDK.cookie.get ("simplamenu-selected").split (":")[0], SNDK.cookie.get ("simplamenu-selected").split (":")[1]);
		}
		
//				if (_temp.selectedCategory)
//				{
//				_temp.selectedCategory.style.height = _temp.selectedCategory.scrollHeight + "px";
//				_temp.lastid = _temp.selectedCategory.id;var attributes = parseAttributes (node.attributes);
//				}
		
		_temp.initialized = true;	
	};
	
	function construct ()
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
		
		
			var root = _attributes.XML.getElementsByTagName ("menu").item (0);	
		
			_attributes.items = new Array ();
		
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
						case "category":
						{													
							var attributes = parseAttributes (node.attributes);
						
							_attributes.items[attributes.tag] = attributes;
							
							if (node.childNodes.length > 0)
							{
								_attributes.items[attributes.tag].items = new Array ();
								
								nodes2 = node.childNodes;
								
								for (var index2 = 0, len2 = nodes2.length; index2 < len2; index2++)
								{
									var node2 = nodes2.item (index2);
									if (node2 == null)
									{
										continue;
									}
									
									switch (node2.tagName)
									{
										case "item":
										{										
											var attributes2 = parseAttributes (node2.attributes);
											_attributes.items[attributes.tag].items[attributes2.tag] = attributes2;
																	
											break;												
										}
									}																						
								}															
							}
												
							break;
						}	
					}
				}
			}				
			
			parseXML (root.childNodes);
		}
	
		// Container
		_elements["container"] = SNDK.tools.newElement ("div", {});
		_elements["container"].setAttribute ("id", _attributes.id);
		_elements["container"].className = _attributes.stylesheet;
		
		// Items
		_elements["items"] = new Array ();
		_elements["items2"] = new Array ();
		_elements["items3"] = new Array ();
		for (index in _attributes.items)
		{									
			var category = new SNDK.tools.newElement ("div", {id: _temp.id +"/category/"+ index, className: "Category", appendTo: _elements["container"]});
			category.onclick = eventOnCategoryClick;
			SNDK.tools.textSelectionDisable (category);

			if (_temp.categoryheight == null)
			{
				_temp.categoryheight = parseInt (SNDK.tools.getStyle (category, "height"));
			}					
												
			var text = SNDK.tools.newElement ("div", {id: _temp.id +"/categorytext/"+ index, className: "Text", appendTo: category});
			text.innerHTML = _attributes.items[index].title;
			text.onmouseover = eventOnCategoryMouseover;
			text.onmouseout = eventOnCategoryMouseout;
			
			if (_attributes.items[index].items) 
			{
				for (index2 in _attributes.items[index].items)
				{						
					var item = new SNDK.tools.newElement ("div", {id: _temp.id +"/item/"+ index +"/"+ index2, className: "Item", appendTo: category});
					item.innerHTML = _attributes.items[index].items[index2].title;
					item.onclick = eventOnItemClick;
					
					if (_attributes.items[index].items[index2].selected)
					{
						item.className = "Item ItemSelected";
						_attributes.items[index].selected = true;
					}						
					
					_elements["items2"]["item/"+index+"/"+index2] = item;	
				}					
			}
			
			if (_attributes.items[index].selected)
			{
				category.className = "Category CategorySelected";						
				_temp.selectedCategory = category;
			}
			
			_elements["items3"]["category/"+index] = category;
			_elements["items"][index] = category;									
		}
	}
			
	function setAttributes ()
	{
		
	}
	
	function expandCategory (category)
	{
		if (_temp.animations["category:"+ category])
		{
			_temp.animations["category:"+ category].stop ();
		}

		if (_temp.animations["category:"+ _temp.expandedCategory])
		{
			_temp.animations["category:"+ _temp.expandedCategory].stop ();
		}

		if (category == _temp.expandedCategory)
		{							
			var element = document.getElementById (_temp.id +"/category/"+ category)
		
			_temp.expandedCategory = null;
			_temp.animations["category:"+ category] = new SNDK.animation.animate	({ 
											element: element, 
											duration: 800, 
											fps: 60, 
											height: {end: _temp.categoryheight +"px", ease: "outexpo"}
										});
			_temp.animations["category:"+ category].play ();	
		}
		else
		{
			if (_temp.expandedCategory)
			{
				var test = document.getElementById (_temp.id +"/category/"+ _temp.expandedCategory);
				_temp.animations["category:"+ _temp.expandedCategory] = new SNDK.animation.animate 	({ 
													element: test, 
												  	duration: 400, 
													fps: 60, 
													height: {end: _temp.categoryheight +"px", ease: "outexpo"}
												});
				_temp.animations["category:"+ _temp.expandedCategory].play ();
	
			}

			var element = document.getElementById (_temp.id +"/category/"+ category)
			
			_temp.expandedCategory = category;			
			_temp.animations["category:"+ category] = new SNDK.animation.animate	({	
											element: element, 
										  	duration: 400, 
										  	fps: 60, 
										  	height: {end: element.scrollHeight + "px", ease: "outexpo"}
										});
			_temp.animations["category:"+ category].play ();
		}						
	
	}
						
	function setSelected (category, item)
	{
		if (category)
		{
			if (_temp.selectedCategory)
			{
				document.getElementById (_temp.id +"/category/"+ _temp.selectedCategory).className = "Category";				
			}
			
			if (_temp.selectedItem)
			{
				document.getElementById (_temp.id +"/item/"+ _temp.selectedCategory +"/"+ _temp.selectedItem).className = "Item";	
				_temp.selectedItem = null;
			}
					
			//var element = document.getElementById (_temp.id +"/category/"+ category);								
			var element = _elements["items3"]["category/"+ category];
			element.className = "Category CategorySelected";			
			
			if (_temp.animations["category:"+ category] == null)					
			{
				element.style.height = element.scrollHeight + "px";
				_temp.expandedCategory = category;
			}
								
			_temp.selectedCategory = category;
		}
									
		if (typeof item != "undefined" && item != "undefined")
		{	
			//var element = document.getElementById (_temp.id +"/item/"+ category +"/"+ item);
			var element = _elements["items2"]["item/"+ category +"/"+ item]
			element.className = "Item ItemSelected";
			
			_temp.selectedItem = item;
		}
						
		SNDK.cookie.set ("simplamenu-selected", category +":"+ item, 0, "/", "", "");
	}	
	

	
	function eventOnItemClick (e)
	{
		SNDK.tools.stopPropogation (e);
	
		var category = this.id.split ("/")[2];
		var item = this.id.split ("/")[3];

		setSelected (category, item);								
		
		if (_attributes.items[category].items[item].href)
		{
		
			SNDK.tools.setURL (_attributes.items[category].items[item].href);
		}											
	}
	
	function eventOnCategoryMouseover ()
	{
		if (_temp.animations[this.id])
		{
			_temp.animations[this.id].stop ()

		}

		_temp.animations[this.id] = new SNDK.animation.animate ({ element: this, 
								  	  duration: 400, 
								  	  fps: 60, 
								  	  paddingRight: {end: "25px", ease: "outexpo"}
									});
		_temp.animations[this.id].play ();
	
	}
	
	function eventOnCategoryMouseout ()
	{
		if (_temp.animations[this.id])
		{
			_temp.animations[this.id].stop ()
		}

		_temp.animations[this.id] = new SNDK.animation.animate	({
										element: this, 
										duration: 400, 
										fps: 60, 
										paddingRight: {end: "15px", ease: "outexpo"}
									});
		_temp.animations[this.id].play ();
	}
	
	function eventOnCategoryClick ()
	{				
		var category = this.id.split ("/")[2];
																				
		expandCategory (category)
						
		if (_attributes.items[category].items == null)
		{
			setSelected (category);
		}
		
		if (_attributes.items[category].href)
		{
			setTimeout ( function () {					SNDK.tools.setURL (_attributes.items[category].href);}, 300)

		}																	
	}
}
