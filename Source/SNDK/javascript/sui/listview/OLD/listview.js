// -------------------------------------------------------------------------------------------------------------------------
// Listview ([attributes])
// -------------------------------------------------------------------------------------------------------------------------
//
//	refresh ()
//	dispose ()
//
//	addItem (item)
//	setItem (item, [row])
//	getItem ([row])
//	removeItem ([row])
//
//	setItems (items)
//	getItems ()
//  removeItems ()
//
//	removeRow ([row])
//
//	getAttributes (value)
//	setAttributes (key, value)
//
//		id			get
//		tag			get/set
//		stylesheet	get/set
//		width		get/set
//		height		get/set
//		managed		get/set
//		appendTo	get/set
//		disabled	get/set
//		onFocus		get/set
//		onBlur		get/set
//		onChange	get/set
//		columns		get/set
//		items		get/set
//		selectedRow	get/set
//		treeview	get/set		
//
// .moveItemUp ()
// .moveItemDowm ()
//
/**
 * @constructor
 */
listview : function (attributes)
{
	var _elements = new Array ();
	var _attributes = attributes;				
	var _temp = 	{ initialized: false,
			  id: SNDK.tools.newGuid (),
			  selectedRow: -1,			  
			  isDirty: true,
			  cache: new Array (),
			  bla: false
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
	this.setAttribute = functionSetAttribute;
	this.getAttribute = functionGetAttribute;

	this.addItem = functionAddItem;
	this.addItems = functionAddItems;
	this.removeItem = functionRemoveItem;	

	this.setItem = functionSetItem;
	this.getItem = functionGetItem;	
	this.setItems = functionSetItems;
	this.getItems = functionGetItems;
	this.getItemRow = functionGetItemRow;


//	this.removeAllItems = functionRemoveAllItems;
	this.moveItemUp = functionMoveItemUp;
	this.moveItemDown = functionMoveItemDown;
	this.canItemMove = functionCanItemMove;
//	this.canItemMove = functionCanItemMove;

											
	// Construct
	construct ();
			
	// Initialize
	SNDK.SUI.addInit (this);
		
	
			
	
	

	
					
	// ------------------------------------
	// Events
	// ------------------------------------					
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
					setTimeout( function ()	{ _attributes.onFocus (); }, 1);
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
					setTimeout( function ()	{ _attributes.onBlur (); }, 1);
				}			
			}	
		}
	}

	// ------------------------------------
	// onChange
	// ------------------------------------							
	function eventOnChange ()
	{
		if (!_attributes.disabled)
		{		
			if (_attributes.onChange != null)
			{
				setTimeout( function ()	{ _attributes.onChange (); }, 1);
			}			
		}
	}

	// ------------------------------------
	// onItemClick
	// ------------------------------------							
	function eventOnRowClick ()
	{
		if (!_attributes.disabled)
		{		

			setSelectedRow (this.id.split("_")[1])
			
			eventOnChange ();
							
//			if (_attributes.onClick != null)
//			{
//				setTimeout( function ()	{ _attributes.onClick (); }, 1);
//			}							
		}
	}
				
	



}






