var _elements = new Array ();
var _attributes = attributes;				

var _temp = 	{ 
					initialized: false,
		  			uiElements: new Array ()
				};



setAttributes ();	

// Private functions
this._attributes = _attributes;
this._elements = _elements;
this._temp = _temp;	
this._init = init;

// Functions		
this.refresh = functionRefresh;			
this.dispose = functionDispose;
this.addUIElement = functionAddUIElement;
this.getUIElement = functionGetUIElement;
this.setAttribute = functionSetAttribute;
this.getAttribute = functionGetAttribute;	

// Construct
construct ();
							
// Initialize
SNDK.SUI.addInit (this);
