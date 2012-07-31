var _elements = new Array ();
var _attributes = attributes;				
var _temp =	{ 	initialized: false,
			  	id: SNDK.tools.newGuid (),
			  	selectedRow: -1,			  
				isDirty: true,
				cache: new Array (),
				bla: false,
				doubleClickTicks: 0,
				doubleClickRow: ""
			};

_attributes.id = SNDK.tools.newGuid ();

setAttributes ();	

// Private functions
this._attributes = _attributes;
this._elements = _elements;
this._temp = _temp;		
this._init = init;

this.type = "LISTVIEW";

// Functions
this.addItem = functionAddItem;
this.addItems = functionAddItems;
this.removeItem = functionRemoveItem;	

this.setItem = functionSetItem;
this.getItem = functionGetItem;	
this.setItems = functionSetItems;
this.getItems = functionGetItems;
this.getItemRow = functionGetItemRow;

this.refresh = functionRefresh;
this.dispose = functionDispose;

this.setAttribute = functionSetAttribute;
this.getAttribute = functionGetAttribute;



//	this.removeAllItems = functionRemoveAllItems;
this.moveItemUp = functionMoveItemUp;
this.moveItemDown = functionMoveItemDown;
this.canItemMove = functionCanItemMove;
//	this.canItemMove = functionCanItemMove;
										
// Construct
construct ();
		
// Initialize
SNDK.SUI.addInit (this);