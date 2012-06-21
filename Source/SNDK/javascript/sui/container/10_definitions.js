var _elements = new Array ();
var _attributes = attributes;				
var _temp = 	{ initialized: false,
		  uiElements: new Array (),
		  cache: new Array (),
		  calculatedWidth: 0,
		  calculatedHeight: 0	 
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
this.addTitleBarUIElement = functionAddTitleBarUIElement;
//this.getTitleBarUIElement = funcitonGetTitleBarUIElement;
this.addUIElement = functionAddUIElement;
this.setAttribute = functionSetAttribute;
this.getAttribute = functionGetAttribute;

// Construct
construct ();
							
// Initialize
SNDK.SUI.addInit (this);
